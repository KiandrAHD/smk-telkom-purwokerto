/* global document, getComputedStyle, window, requestAnimationFrame */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: Number(process.env.QA_WIDTH || 1440), height: 900 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
const active = () => page.locator('#fasilitas ol button[aria-pressed="true"]').innerText();
const activeIndex = () => page.locator('#fasilitas ol button').evaluateAll(buttons => buttons.findIndex(button => button.getAttribute('aria-pressed') === 'true'));
const assertSlide = async index => {
  assert.equal(await activeIndex(), index, 'Timeline harus mengikuti urutan 01–06.');
  assert.equal(await page.locator('#fasilitas [data-slide].z-10').getAttribute('data-flip-id'), `facility-${index}`, 'Slide tengah harus sesuai dengan timeline.');
};
const next = page.getByRole('button', { name: 'Fasilitas berikutnya', exact: true });
const previous = page.getByRole('button', { name: 'Fasilitas sebelumnya', exact: true });
const all = page.getByRole('button', { name: 'Lihat semua fasilitas', exact: true });
const step = async button => {
  const before = await activeIndex();
  await button.click();
  await page.waitForTimeout(550);
  await assertSlide((before + (button === previous ? 5 : 1)) % 6);
};
try {
  await page.goto(process.env.QA_URL || 'http://127.0.0.1:5173/');
  await next.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await assertSlide(0);
  // Real autoplay timing: three complete cycles, without advancing the browser clock.
  for (let transition = 1; transition <= 18; transition++) {
    const before = await activeIndex();
    await page.waitForFunction(index => {
      const buttons = [...document.querySelectorAll('#fasilitas ol button')];
      return buttons.findIndex(button => button.getAttribute('aria-pressed') === 'true') !== index;
    }, before, { timeout: 9000 });
    await page.waitForTimeout(550);
    await assertSlide(transition % 6);
    console.log(`Autoplay ${transition}/18: ${(transition % 6) + 1}`);
  }
  await step(next);
  const manual = await activeIndex();
  await page.mouse.move(0, 0);
  await page.waitForTimeout(6600);
  await assertSlide((manual + 1) % 6);
  assert.equal(await page.getByRole('button', { name: /Jeda carousel|Lanjutkan carousel|Pause carousel|Resume carousel/ }).count(), 0);
  await next.hover();
  const first = await active();
  await page.waitForTimeout(5200);
  assert.equal(await active(), first, 'Autoplay harus berhenti selama hover pada carousel.');
  for (const button of [next, previous]) {
    for (let i = 0; i < 6; i++) await step(button);
    assert.equal(await active(), first, 'Loop enam slide harus kembali ke posisi awal.');
  }
  for (const width of [1440, 768, 390, 375]) {
    await page.setViewportSize({ width, height: 900 });
    await next.scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    for (const button of [next, previous]) {
      assert.ok(await button.evaluate(el => {
        const r = el.getBoundingClientRect();
        return [2, 22, 42].every(x => document.elementFromPoint(r.x + x, r.y + 22)?.closest('button') === el);
      }), 'Seluruh area panah harus berada di atas card, termasuk tepinya.');
    }
    await page.mouse.wheel(0, 220);
    await page.waitForTimeout(70);
    await page.evaluate(() => {
      window.facilityNavigationScroll = [];
      document.addEventListener('pointerdown', () => {
        let frames = 0;
        const sample = () => {
          window.facilityNavigationScroll.push(window.scrollY);
          if (frames++ < 32) requestAnimationFrame(sample);
        };
        sample();
      }, { once: true, capture: true });
    });
    const arrowBox = await next.boundingBox();
    await page.mouse.click(arrowBox.x + 22, arrowBox.y + 22);
    await page.waitForTimeout(650);
    const positions = await page.evaluate(() => window.facilityNavigationScroll);
    assert.ok(positions.length > 20);
    assert.ok(Math.max(...positions) - Math.min(...positions) <= 1, 'Navigasi harus membatalkan momentum scroll tanpa menggeser viewport.');
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
  console.log('PASS: autoplay dan pemulihan setelah navigasi manual, pause saat hover, tanpa UI jeda/lanjut, momentum scroll dibatalkan, hit area panah, loop next/previous, navigasi saat/setelah scroll detail dan interupsi, detail berulang, 1440/768/390/375px, overflow, klik cepat, reduced motion, unmount, console.');
} finally {
  await browser.close();
}
