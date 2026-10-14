/* global document, window, KeyboardEvent, requestAnimationFrame */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  await page.goto(process.env.QA_URL || 'http://127.0.0.1:5173', { waitUntil: 'domcontentloaded' });
  const root = page.locator('[data-hero-carousel]'); await root.waitFor();
  await root.locator('img').evaluateAll(images => Promise.all(images.map(img => { img.loading = 'eager'; return img.decode(); })));
  await page.evaluate(() => {
    const root = document.querySelector('[data-hero-carousel]'), image = root.querySelector('[data-hero-slide="1"] img');
    image.decode = () => new Promise(resolve => { window.__resolveHeroDecode = resolve; });
    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  });
  await page.waitForFunction(() => Boolean(window.__resolveHeroDecode));
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new window.Event('visibilitychange'));
    window.__resolveHeroDecode();
  });
  await page.waitForFunction(() => document.querySelector('[data-hero-carousel]').dataset.heroMoving === 'false');
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  assert.equal(await root.getAttribute('data-hero-index'), '0', 'Image finishing decode in a hidden tab must not start a new transition');
  assert.equal(await page.getByRole('heading', { level: 1 }).count(), 1);
  await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new window.Event('visibilitychange')); });
  console.log('PASS hide during pending image decode: no background transition, current heading remains accessible.');
} finally { await browser.close(); }
