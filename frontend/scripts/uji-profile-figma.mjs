/* global document, window */
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const output = process.env.QA_OUTPUT || '../outputs/profile-figma-redesign';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ reducedMotion: 'reduce' });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await page.route('**/api/**', route => route.fulfill({ contentType: 'application/json', body: '[]' }));
try {
  for (const width of [1847, 1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1100 });
    await page.goto(`${process.env.QA_URL || 'http://127.0.0.1:5181'}/profil-sekolah`);
    for (const language of ['id', 'en']) {
      if (await page.locator('html').getAttribute('lang') !== language) await page.getByRole('button', { name: /^Switch to / }).first().click();
      const principles = page.locator('section[aria-label]').filter({ has: page.locator('.profile-vision-grid') });
      await principles.scrollIntoViewIfNeeded();
      assert.equal(await principles.locator('.profile-principle-photo').count(), 2, 'Both vision/mission cards need their Figma photo');
      await principles.locator('img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
      assert.equal(await principles.locator('.profile-principle-tagline').count(), 2);
      const cards = await principles.locator('.profile-principle-card').first().boundingBox();
      assert.ok(cards.width > 200);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false, `${width}/${language}: page overflow`);
      await principles.screenshot({ path: `${output}/principles-${width}-${language}.png`, style: 'header.sticky,.fixed.bottom-4 {visibility:hidden}' });
      console.log(`PASS profile principles ${width}/${language}`);
    }
  }
  assert.deepEqual(errors, []);
} finally {
  await browser.close();
}

