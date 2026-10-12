/* global document, window, getComputedStyle */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';

const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const base = process.env.QA_URL || 'http://127.0.0.1:5173';
const output = process.env.QA_OUTPUT || '../../qa-output/fasilitas-page-2026-10-12';
await mkdir(output, { recursive: true });
const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base);
  const all = page.getByRole('link', { name: 'Lihat semua fasilitas', exact: true });
  await all.waitFor();
  assert.equal(await all.getAttribute('href'), '/fasilitas');
  assert.equal(await page.locator('[data-facility-card]').count(), 0, 'Beranda hanya memuat carousel.');
  await all.scrollIntoViewIfNeeded();
  await page.evaluate(() => { window.__facilitiesNavigation = true; });
  await all.click();
  await page.waitForURL('**/fasilitas');
  await page.getByRole('heading', { level: 1 }).waitFor();
  assert.equal(await page.evaluate(() => window.__facilitiesNavigation), true, 'Navigasi tanpa reload.');
  await page.waitForTimeout(600);
  assert.equal(await page.evaluate(() => window.scrollY), 0);
  await page.reload();
  await page.locator('[data-facility-card]').first().waitFor();
  assert.equal(await page.locator('[data-facility-card]').count(), 8);
  assert.equal(new Set(await page.locator('[data-facility-card]').evaluateAll(nodes => nodes.map(n => n.dataset.facilityCard))).size, 8);
  for (const [category, count] of [['Laboratorium', 3], ['Kelas', 4], ['Perpustakaan', 1], ['Semua', 8]]) {
    await page.getByRole('button', { name: category, exact: true }).click();
    await page.waitForFunction(count => document.querySelectorAll('[data-facility-card]').length === count, count);
    assert.equal(await page.locator('[data-facility-card]').count(), count);
    assert.equal(await page.getByRole('button', { name: category, exact: true }).getAttribute('aria-pressed'), 'true');
  }
  await page.getByRole('button', { name: 'Laboratorium', exact: true }).click();
  await page.waitForURL('**/fasilitas?kategori=Laboratorium');
  await page.reload();
  await page.locator('[data-facility-card]').first().waitFor();
  assert.equal(await page.locator('[data-facility-card]').count(), 3, 'Kategori bertahan setelah refresh.');
  await page.getByRole('button', { name: 'Semua', exact: true }).click();
  await page.waitForFunction(() => document.querySelectorAll('[data-facility-card]').length === 8);
  for (let index = 0; index < 8; index++) {
    const button = page.locator('[data-facility-card]').nth(index).getByRole('button');
    await button.click();
    const dialog = page.locator('dialog[open]');
    await dialog.waitFor();
    assert.ok((await dialog.innerText()).length > 100);
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'hidden' });
    assert.equal(await button.evaluate(el => el === document.activeElement), true);
  }
  for (const width of [1920, 1440, 1366, 768, 390, 375]) {
    await page.setViewportSize({ width, height: 900 });
    for (const language of ['id', 'en']) {
      await page.evaluate(language => sessionStorage.setItem('smk-telkom-language', language), language);
      await page.goto(`${base}/fasilitas`);
      await page.locator('[data-facility-card]').first().waitFor();
      // Change through the actual language control if the storage key differs.
      if (await page.locator('html').getAttribute('lang') !== language) await page.locator('header').getByRole('button', { name: /^Switch to / }).click();
      await page.evaluate(() => { document.querySelectorAll('main img').forEach(img => { img.loading = 'eager'; }); });
      await page.locator('main img').evaluateAll(images => Promise.all(images.map(img => img.decode())));
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(500);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), 0, `${width} ${language}: overflow`);
      assert.equal(await page.locator('main img').evaluateAll(images => images.every(img => img.naturalWidth > 0)), true);
      const expectedCols = width >= 1024 ? 4 : width >= 640 ? 2 : 1;
      assert.equal(await page.locator('[data-facility-grid]').first().evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length), expectedCols);
      await page.screenshot({ path: `${output}/${width}-${language}.png`, fullPage: true });
      console.log(`PASS responsive ${width}px ${language.toUpperCase()}`);
    }
  }
  await page.getByRole('button', { name: 'Switch to Indonesian' }).click();
  await page.waitForFunction(() => document.documentElement.lang === 'id');
  assert.match(await page.getByRole('heading', { level: 1 }).innerText(), /Ruang Kelas Modern/);
  await page.getByRole('button', { name: 'Switch to English' }).click();
  await page.waitForFunction(() => document.documentElement.lang === 'en');
  assert.match(await page.getByRole('heading', { level: 1 }).innerText(), /Modern Classrooms/);
  await page.getByRole('button', { name: 'Switch to Indonesian' }).click();
  await page.getByRole('button', { name: 'Buka menu' }).click();
  await page.getByRole('button', { name: 'Tentang', exact: true }).click();
  await page.getByRole('link', { name: 'Fasilitas Sekolah', exact: true }).click();
  assert.equal(await page.locator('#mobile-nav').count(), 0);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(base);
  await page.evaluate(() => sessionStorage.clear());
  await page.reload();
  const next = page.getByRole('button', { name: 'Fasilitas berikutnya', exact: true });
  await next.scrollIntoViewIfNeeded();
  await next.hover();
  const index = () => page.locator('#fasilitas ol button').evaluateAll(buttons => buttons.findIndex(b => b.getAttribute('aria-pressed') === 'true'));
  for (let step = 0; step < 7; step++) {
    const before = await index();
    await next.click();
    await page.waitForTimeout(600);
    assert.equal(await index(), (before + 1) % 6);
  }
  await page.mouse.move(0, 0);
  const before = await index();
  await page.waitForTimeout(6800);
  assert.equal(await index(), (before + 1) % 6, 'Autoplay tetap berjalan.');
  await page.getByRole('button', { name: 'Tentang', exact: true }).click();
  await page.getByRole('link', { name: 'Fasilitas Sekolah', exact: true }).click();
  await page.waitForURL('**/fasilitas');
  assert.deepEqual(errors, []);
  console.log('PASS: routing, refresh/kategori, scroll atas, grid unik, filter, 8 modal/Escape/fokus, 12 viewport/bahasa, toggle ID/EN, carousel loop/autoplay, menu Tentang desktop/mobile, runtime.');
} finally { await browser.close(); }
