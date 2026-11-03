/* global document, window */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const output = process.env.QA_OUTPUT;
assert(output, 'Set QA_OUTPUT to an approved output directory.');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [], errors = [];
try {
  for (const language of ['id', 'en']) {
    for (const width of [1920, 1847, 1440, 1366, 768, 390, 375]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
      page.on('pageerror', error => errors.push(error.message));
      // Isolate page geometry from live CMS availability; no backend writes.
      await page.route('**/rest/v1/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
      await page.addInitScript(lang => sessionStorage.setItem('smk-telkom-language', lang), language);
      await page.goto(`${process.env.QA_URL || 'http://127.0.0.1:4173'}/profil-sekolah`);
      await page.locator('.profile-about-panel').waitFor();
      await page.evaluate(() => document.fonts.ready);
      for (const selector of ['#profil', '.profile-principles', '#perjalanan', '#guru', '[data-facilities-actions]']) {
        await page.locator(selector).scrollIntoViewIfNeeded();
      }
      await page.locator('#profil').scrollIntoViewIfNeeded();
      const geometry = await page.evaluate(() => {
        const rect = el => { const r = el.getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top + window.scrollY, bottom: r.bottom + window.scrollY, width: r.width, height: r.height }; };
        const cards = [...document.querySelectorAll('.profile-value-card')];
        const boxes = [...document.querySelectorAll('.profile-about-panel, .profile-value-card, .profile-milestone, .profile-video')];
        return {
          overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          cards: cards.map(rect), boxes: boxes.map(rect),
          clipped: boxes.filter(el => el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1).map(el => el.className),
          assets: [...document.querySelectorAll('.profile-section img')].map(el => ({ src: el.getAttribute('src'), loaded: el.complete && el.naturalWidth > 0, ...rect(el) })),
          heroStats: document.querySelectorAll('.school-hero .hero-floating').length,
          facilities: document.querySelectorAll('[data-facilities-actions]').length,
          timelineCount: document.querySelectorAll('.profile-timeline > li').length,
        };
      });
      assert.equal(geometry.overflow, false, `${width}/${language}: horizontal overflow`);
      assert.equal(geometry.cards.length, 6);
      assert.equal(geometry.timelineCount, 5);
      assert.equal(geometry.heroStats, 1);
      assert.equal(geometry.facilities, 1);
      assert.deepEqual(geometry.clipped, [], `${width}/${language}: clipped content`);
      assert(geometry.boxes.every(r => r.left >= 0 && r.right <= width + 1));
      assert(geometry.assets.every(a => a.loaded && a.width > 0 && a.height > 0), 'Profile assets load and render.');
      await page.locator('.profile-milestone').nth(2).click();
      assert.equal(await page.locator('.profile-milestone').nth(2).getAttribute('aria-current'), 'step');
      const indicators = page.locator('.facilities-indicators button');
      await indicators.last().click();
      assert.equal(await indicators.last().getAttribute('aria-pressed'), 'true');
      await page.getByRole('button', { name: language === 'id' ? 'Fasilitas berikutnya' : 'Next facility', exact: true }).click();
      assert.equal(await indicators.first().getAttribute('aria-pressed'), 'true', 'Carousel wraps from last to first.');
      const tour = page.locator('[data-facilities-actions] a').first();
      assert.equal(await tour.getAttribute('href'), '/fasilitas#school-tour');
      assert.equal(await page.locator('[data-facilities-actions] a').last().innerText(), language === 'id' ? 'Lihat Fasilitas Lainnya' : 'View More Facilities');
      // Native video stays unloaded until clicked, then retains browser controls.
      assert.equal(await page.locator('.profile-video video').count(), 0);
      await page.locator('.profile-video button').click();
      assert.equal(await page.locator('.profile-video video[controls]').count(), 1);
      await page.reload();
      for (const selector of ['#profil', '#perjalanan', '#guru', '[data-facilities-actions]']) await page.locator(selector).scrollIntoViewIfNeeded();
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: join(output, `profile-${width}-${language}.png`), fullPage: true, animations: 'disabled' });
      if (width === 1920 && language === 'id') {
        await page.locator('#profil').screenshot({ path: join(output, 'about-desktop.png') });
        await page.locator('.profile-principles').screenshot({ path: join(output, 'values-desktop.png') });
        await page.locator('#perjalanan').screenshot({ path: join(output, 'timeline-desktop.png') });
      }
      results.push({ width, language, geometry });
      await page.close();
    }
  }
  const motionPage = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  motionPage.on('pageerror', error => errors.push(error.message));
  await motionPage.route('**/rest/v1/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
  await motionPage.goto(`${process.env.QA_URL || 'http://127.0.0.1:4173'}/profil-sekolah`);
  await motionPage.locator('#fasilitas').scrollIntoViewIfNeeded();
  await motionPage.mouse.move(0, 0);
  await motionPage.waitForFunction(() => document.querySelectorAll('.facilities-indicators button')[1]?.getAttribute('aria-pressed') === 'true', null, { timeout: 15000 });
  await motionPage.waitForFunction(() => !document.querySelector('#fasilitas [data-slide][style*="will-change"]'));
  await motionPage.close();
  assert.deepEqual(errors, []);
  console.log(`PASS ${results.length} profile viewport/language checks, local assets, timeline interaction, native video, carousel wrap/autoplay and facilities links.`);
} finally {
  await writeFile(join(output, 'results.json'), JSON.stringify({ results, errors }, null, 2));
  await browser.close();
}
