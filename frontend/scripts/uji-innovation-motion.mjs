/* global document, window, getComputedStyle */
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const out = process.env.QA_OUTPUT || 'outputs/innovation-motion';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = []; page.on('pageerror', e => errors.push(e.message));
await page.route('**/api/**', r => r.fulfill({ contentType: 'application/json', body: '[]' }));
const root = page.locator('[data-innovation-reveal]');
const sleep = ms => page.waitForTimeout(ms);
const sample = () => root.evaluate(node => {
  const box = node.querySelector('.home-innovation-box'), reel = node.querySelector('[data-innovation-reel]');
  const rect = box.getBoundingClientRect();
  const range = document.createRange(); range.selectNodeContents(reel.firstElementChild);
  const text = range.getBoundingClientRect();
  return { x: new window.DOMMatrixReadOnly(getComputedStyle(reel).transform).m41, width: rect.width,
    left: rect.left, top: rect.top, full: text.left >= rect.left - .5 && text.right <= rect.right + .5,
    count: node.querySelectorAll('.is-typed').length };
});
try {
  await page.goto((process.env.QA_URL || 'http://127.0.0.1:5173') + '/');
  await root.scrollIntoViewIfNeeded(); await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ reducedMotion: 'reduce' }); await sleep(100);
  assert.ok((await sample()).full, 'The whole phrase must fit at the centered stop');
  await page.emulateMedia({ reducedMotion: 'no-preference' }); await root.scrollIntoViewIfNeeded(); await sleep(150);
  const holds = []; let since = null, last = await sample(), begun = Date.now();
  while (holds.length < 3 && Date.now() - begun < 16000) {
    await sleep(50); const next = await sample();
    assert.ok(Math.abs(next.width - last.width) < .5 && Math.abs(next.left - last.left) < .5 && Math.abs(next.top - last.top) < .5, 'Stable box layout');
    if (Math.abs(next.x) < .1) {
      assert.ok(next.full, 'No clipping during pause'); since ??= Date.now();
    } else if (since !== null) { holds.push(Date.now() - since); since = null; }
    last = next;
  }
  assert.equal(holds.length, 3); assert.ok(holds.every(ms => ms >= 1500 && ms <= 2100), JSON.stringify(holds));
  console.log('PASS three slide/pause cycles:', holds);
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const language of ['id', 'en']) {
      if (await page.locator('html').getAttribute('lang') !== language) await page.getByRole('button', { name: /^Switch to / }).first().click();
      await root.scrollIntoViewIfNeeded(); await page.emulateMedia({ reducedMotion: 'reduce' }); await root.scrollIntoViewIfNeeded(); await sleep(150);
      assert.ok((await sample()).full, `Phrase fits ${width} ${language}`);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
      await root.screenshot({ path: `${out}/${width}-${language}.png` });
    }
  }
  assert.deepEqual(errors, []); console.log('PASS responsive ID/EN, reduced motion, no exceptions');
} finally { await browser.close(); }
