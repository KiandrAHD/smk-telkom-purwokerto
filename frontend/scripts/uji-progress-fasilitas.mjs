/* global window, document, getComputedStyle, requestAnimationFrame */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const output = process.env.QA_OUTPUT || join(tmpdir(), 'facility-progress-qa');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [], results = [];
page.on('pageerror', error => errors.push(error.message));
await page.route('**/rest/v1/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
const list = page.locator('#fasilitas ol');
const next = page.getByRole('button', { name: 'Fasilitas berikutnya', exact: true });
const previous = page.getByRole('button', { name: 'Fasilitas sebelumnya', exact: true });
const read = () => list.evaluate(el => {
  const line = getComputedStyle(el, '::after');
  return { fill: new window.DOMMatrixReadOnly(line.transform).a, opacity: Number(line.opacity), active: [...el.querySelectorAll('button')].findIndex(button => button.getAttribute('aria-pressed') === 'true') };
});
const samples = () => list.evaluate(el => new Promise(resolve => {
  const values = [], start = performance.now();
  const sample = now => {
    const line = getComputedStyle(el, '::after');
    const circle = el.querySelector('[aria-pressed="true"] > span');
    const cards = [...document.querySelectorAll('#fasilitas [data-slide]')];
    values.push({ ms: now - start, fill: new window.DOMMatrixReadOnly(line.transform).a, opacity: Number(line.opacity), circleScale: parseFloat(getComputedStyle(circle).scale) || 1, cardsMoving: cards.some(card => card.style.transform && card.style.transform !== 'translate(0px, 0px)') });
    if (now - start < 580) requestAnimationFrame(sample); else resolve(values);
  };
  requestAnimationFrame(sample);
}));
const settle = async index => {
  // Custom-property transforms are committed on the next browser frame.
  await page.waitForFunction(index => {
    const el = document.querySelector('#fasilitas ol'), line = getComputedStyle(el, '::after');
    return Math.abs(new window.DOMMatrixReadOnly(line.transform).a - index / 5) < 0.001 && Number(line.opacity) === 1;
  }, index, { timeout: 250 });
  const state = await read(); assert.equal(state.active, index); assert.ok(Math.abs(state.fill - index / 5) < 0.001); assert.equal(state.opacity, 1);
  assert.equal(await page.locator('#fasilitas [data-slide].z-10').getAttribute('data-flip-id'), `facility-${index}`);
};
const transition = async (button, from, to, wrap = false) => {
  await button.click(); const values = await samples();
  assert.ok(Math.abs(values.at(-1).fill - to / 5) < 0.001); await settle(to);
  if (wrap) {
    assert(values.every(value => Math.abs(value.fill - from / 5) < 0.001 || Math.abs(value.fill - to / 5) < 0.001));
    const reset = values.find((value, i) => i > 0 && Math.abs(value.fill - values[i - 1].fill) > 0.9);
    assert(reset && reset.opacity < 0.05, 'The wrap reset must occur while the line is hidden.');
    assert(values.some(value => value.opacity > 0 && value.opacity < 1));
  } else {
    assert(values.some(value => value.fill > Math.min(from, to) / 5 && value.fill < Math.max(from, to) / 5));
    assert(values.every((value, i) => i === 0 || (to > from ? value.fill >= values[i - 1].fill - 0.001 : value.fill <= values[i - 1].fill + 0.001)));
  }
  assert(values.some(value => value.circleScale > 1 && value.circleScale < 1.04));
  assert(values.some(value => value.cardsMoving), 'The fill and carousel must animate together.');
  assert(values.every(value => value.ms > 520 || (value.fill >= 0 && value.fill <= 1)));
  results.push({ from, to, wrap, samples: values });
};
try {
  await page.goto(process.env.QA_URL || 'http://127.0.0.1:4173/'); await list.waitFor();
  if (await page.locator('html').getAttribute('lang') !== 'id') await page.locator('header').getByRole('button', { name: /^Switch to / }).click();
  await settle(0);
  await transition(next, 0, 1); await transition(next, 1, 2); await transition(previous, 2, 1);
  await transition(list.locator('button').nth(4), 1, 4); await transition(next, 4, 5);
  await transition(next, 5, 0, true); await transition(previous, 0, 5, true);
  await transition(list.locator('button').nth(2), 5, 2);
  for (const width of [1440, 768, 375, 320]) {
    await page.setViewportSize({ width, height: 1000 }); await list.scrollIntoViewIfNeeded();
    const geometry = await list.evaluate(el => {
      const line = getComputedStyle(el, '::after'), r = el.getBoundingClientRect();
      const centers = [...el.querySelectorAll('button > span:first-child')].map(circle => { const b = circle.getBoundingClientRect(); return b.x + b.width / 2; });
      return { start: r.x + parseFloat(line.left), end: r.x + parseFloat(line.left) + parseFloat(line.width), centers, overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth };
    });
    assert.ok(Math.abs(geometry.start - geometry.centers[0]) < 0.1); assert.ok(Math.abs(geometry.end - geometry.centers[5]) < 0.1); assert.equal(geometry.overflow, false);
    await page.locator('#fasilitas img').evaluateAll(imgs => Promise.all(imgs.map(img => { img.loading = 'eager'; return img.decode(); })));
    await page.locator('#fasilitas').screenshot({ path: join(output, `progress-${width}.png`), animations: 'disabled', style: 'header { visibility: hidden; }' });
    results.push({ width, geometry });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' }); await next.click(); await settle(3);
  assert.equal(await list.locator('button[aria-pressed="true"] > span').first().evaluate(el => parseFloat(getComputedStyle(el).scale)), 1);
  await page.emulateMedia({ reducedMotion: 'no-preference' }); await next.click(); await page.emulateMedia({ reducedMotion: 'reduce' }); await settle(4);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await previous.click(); await page.waitForTimeout(550); await settle(3);
  await list.locator('button').nth(2).focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(550); await settle(2);
  await next.scrollIntoViewIfNeeded(); await page.mouse.move(0, 0); await page.keyboard.press('Tab');
  await page.waitForTimeout(6600); await settle(3);
  results.push({ reducedMotion: 'passed', keyboard: 'passed', autoplay: 'passed' });
  await page.getByRole('link', { name: 'Lihat semua fasilitas', exact: true }).click(); await page.waitForURL('**/fasilitas');
  assert.deepEqual(errors, []); console.log('PASS progressive fill/shrink, hidden wrap reset, carousel sync, responsive alignment, reduced motion, keyboard, autoplay and cleanup.');
} finally { await writeFile(join(output, 'results.json'), JSON.stringify({ results, errors }, null, 2)); await browser.close(); }
