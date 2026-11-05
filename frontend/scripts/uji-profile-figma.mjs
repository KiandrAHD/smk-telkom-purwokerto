/* global document, window, getComputedStyle */
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
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await principles.locator('.profile-principle-tagline').count(), 2);
      assert.notEqual(await principles.locator('.profile-value-card').first().evaluate(card => getComputedStyle(card, '::after').backgroundImage), 'none', 'The values must be connected by the red ribbon');
      const cards = await principles.locator('.profile-principle-card').first().boundingBox();
      assert.ok(cards.width > 200);
      const valueLayout = await principles.locator('.profile-values-grid').evaluate(grid => ({
        columns: getComputedStyle(grid).gridTemplateColumns.split(' ').length,
        heights: [...grid.children].map(card => card.getBoundingClientRect().height),
        contained: [...grid.children].every(card => {
          const box = card.getBoundingClientRect();
          return [...card.querySelectorAll('h3, p')].every(text => {
            const rect = text.getBoundingClientRect();
            return rect.left >= box.left && rect.right <= box.right + 1 && rect.bottom <= box.bottom;
          });
        }),
      }));
      assert.equal(valueLayout.columns, width >= 1024 ? 4 : 2);
      assert.ok(Math.max(...valueLayout.heights) - Math.min(...valueLayout.heights) < 1);
      assert.ok(valueLayout.contained, `${width}/${language}: value text must fit its card`);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false, `${width}/${language}: page overflow`);
      await principles.screenshot({ path: `${output}/principles-${width}-${language}.png`, style: 'header.sticky,.fixed.bottom-4 {visibility:hidden}' });
      const history = page.locator('#perjalanan');
      await history.scrollIntoViewIfNeeded();
      await history.locator('img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
      assert.deepEqual(await history.locator('.profile-milestone-year').allTextContents(), ['1993', '2016', '2020', '2023', '2026']);
      assert.equal(await history.locator('button').count(), 0, 'Static milestones should not be misleading controls');
      const milestones = await history.locator('.profile-milestone').evaluateAll(items => items.map(item => {
        const box = item.getBoundingClientRect();
        return { x: box.x, y: box.y, right: box.right, bottom: box.bottom, textFits: [...item.querySelectorAll('.profile-milestone-title, .profile-milestone-description')].every(text => text.scrollWidth <= text.clientWidth && text.getBoundingClientRect().right <= box.right + 1) };
      }));
      assert.ok(milestones.every(item => item.textFits), `${width}/${language}: timeline text fits`);
      for (let i = 1; i < milestones.length; i++) {
        if (width >= 1024) {
          assert.ok(Math.abs(milestones[i].y - milestones[0].y) < 1);
          assert.ok(milestones[i].x >= milestones[i - 1].right);
        } else assert.ok(milestones[i].y > milestones[i - 1].bottom);
      }
      await history.screenshot({ path: `${output}/history-${width}-${language}.png`, style: 'header.sticky,.fixed.bottom-4 {visibility:hidden}' });
      console.log(`PASS profile vision, values, history ${width}/${language}`);
    }
  }
  assert.deepEqual(errors, []);
} finally {
  await browser.close();
}

