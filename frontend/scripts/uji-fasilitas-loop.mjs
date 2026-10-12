/* global document, getComputedStyle */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
const active = () => page.locator('#fasilitas ol button[aria-pressed="true"]').innerText();
const next = page.getByRole('button', { name: 'Fasilitas berikutnya', exact: true });
const previous = page.getByRole('button', { name: 'Fasilitas sebelumnya', exact: true });
const all = page.getByRole('button', { name: 'Lihat semua fasilitas', exact: true });
const step = async button => {
  const before = await active();
  await button.click();
  await page.waitForTimeout(550);
  assert.notEqual(await active(), before, 'Navigasi harus mengubah slide.');
};
try {
  await page.goto(process.env.QA_URL || 'http://127.0.0.1:5173/');
  await next.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  const initial = await active();
  await page.waitForTimeout(6600);
  assert.notEqual(await active(), initial, 'Autoplay harus berpindah tanpa input pengguna.');
  await step(next);
  const manual = await active();
  await page.mouse.move(0, 0);
  await page.waitForTimeout(6600);
  assert.notEqual(await active(), manual, 'Navigasi manual tidak boleh mematikan autoplay.');
  await page.getByRole('button', { name: 'Jeda carousel', exact: true }).click();
  const first = await active();
  await page.waitForTimeout(5200);
  assert.equal(await active(), first, 'Slide harus tetap diam saat autoplay dijeda.');
  for (const button of [next, previous]) {
    for (let i = 0; i < 6; i++) await step(button);
    assert.equal(await active(), first, 'Loop enam slide harus kembali ke posisi awal.');
  }
  for (const width of [1440, 768, 390, 375]) {
    await page.setViewportSize({ width, height: 900 });
    await all.scrollIntoViewIfNeeded();
    await all.click();
    assert.equal(await next.isEnabled(), true, 'Next harus tersedia saat scroll detail berjalan.');
    assert.equal(await previous.isEnabled(), true);
    // Wheel interrupts Lenis scrolling: controls must not depend on its onComplete.
    await page.mouse.wheel(0, -600);
    await step(next);
    await step(previous);
    await all.click();
    await page.waitForTimeout(1300);
    await all.click();
    await page.waitForTimeout(1300);
    await step(next);
    await step(previous);
    assert.equal(await page.locator('#fasilitas [data-slide].z-10').evaluate(el => getComputedStyle(el).transform), 'none');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), 0);
    assert.equal(await page.locator('#fasilitas-grid [data-facility-card]:visible').count(), 8);
  }
  await next.evaluate(el => { for (let i = 0; i < 15; i++) el.click(); });
  await page.waitForTimeout(600);
  await step(previous);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await all.click();
  await step(next);
  await step(previous);
  const idle = await active();
  await page.waitForTimeout(5200);
  assert.equal(await active(), idle);
  await page.goto((process.env.QA_URL || 'http://127.0.0.1:5173/') + 'profil-sekolah');
  await page.waitForTimeout(1000);
  assert.deepEqual(errors, []);
  console.log('PASS: autoplay dan pemulihan setelah navigasi manual, jeda autoplay, loop next/previous, navigasi saat/setelah scroll detail dan interupsi, detail berulang, 1440/768/390/375px, overflow, klik cepat, reduced motion, unmount, console.');
} finally {
  await browser.close();
}
