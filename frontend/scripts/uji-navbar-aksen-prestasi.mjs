/* global document, window, getComputedStyle */
import assert from 'node:assert/strict';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { tmpdir } from 'node:os';
import { createServer } from 'vite';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.QA_URL || 'http://127.0.0.1:4173';
const output = process.env.QA_OUTPUT || join(tmpdir(), 'navbar-prestasi-qa');
await mkdir(output, { recursive: true });
const server = await createServer({ logLevel: 'silent', server: { middlewareMode: true } });
const { prestasiData } = await server.ssrLoadModule('/src/data/dummyData.js');
const assets = await readdir('dist/assets');
const rows = Array.from({ length: 8 }, (_, index) => {
  const item = prestasiData.items[index % prestasiData.items.length];
  const stem = basename(item.image).replace(/\.[^.]+$/, '');
  const image = assets.find(asset => asset.startsWith(stem + '-'));
  assert(image, stem);
  return { id: index + 1, judul: item.title, slug: `qa-prestasi-${index}`, kategori: item.category, gambar_url: `${base}/assets/${image}`, tanggal: '2026-10-12' };
});
await server.close();
const browser = await chromium.launch({ channel: 'chrome', headless: true });
let page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [], results = [];
let fixture = rows;
page.on('pageerror', error => errors.push(error.message));
await page.route('**/rest/v1/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(route.request().url().includes('/prestasi') ? fixture : []) }));
const trigger = name => page.locator('header').getByRole('button', { name, exact: true });
const menu = name => page.locator(`#desktop-${name.toLowerCase()}-links`);
const gotoHome = async () => {
  await page.goto(base); await page.locator('[data-quick-access]').waitFor();
  if (await page.locator('html').getAttribute('lang') !== 'id') await trigger('Switch to Indonesian').click();
  await page.evaluate(() => document.fonts.ready);
};
try {
  await gotoHome();
  for (const name of ['Tentang', 'Informasi']) {
    const button = trigger(name); await button.hover(); await menu(name).waitFor();
    assert.equal(await button.getAttribute('aria-expanded'), 'true');
    assert.equal(await button.locator('svg.lucide-chevron-down').count(), 1);
    assert.equal(await menu(name).evaluate(el => getComputedStyle(el).animationDuration), '0.18s');
    const b = await button.boundingBox(), m = await menu(name).boundingBox();
    await button.evaluate(el => { window.dropdownStates = []; new window.MutationObserver(() => window.dropdownStates.push(el.getAttribute('aria-expanded'))).observe(el, { attributes: true, attributeFilter: ['aria-expanded'] }); });
    await page.mouse.move(b.x + b.width / 2, m.y + 20, { steps: 12 });
    await menu(name).locator('a').last().hover(); assert.equal(await button.getAttribute('aria-expanded'), 'true');
    assert(!(await page.evaluate(() => window.dropdownStates)).includes('false'), 'Hover through the submenu must not close it.');
    await page.mouse.move(10, 100); assert.equal(await menu(name).count(), 0);
    await button.hover(); await menu(name).waitFor();
    await page.keyboard.press('Escape'); assert.equal(await menu(name).count(), 0); assert.equal(await button.evaluate(el => el === document.activeElement), true);
    await page.keyboard.press('Enter'); await menu(name).waitFor(); await page.keyboard.press('Escape');
    await page.keyboard.press('Tab'); await button.focus(); await menu(name).waitFor();
    await page.keyboard.press('ArrowDown');
    await page.waitForFunction(id => document.querySelector(`#${id} a`) === document.activeElement, `desktop-${name.toLowerCase()}-links`, { timeout: 250 });
    await page.keyboard.press('Escape'); assert.equal(await menu(name).count(), 0);
  }
  for (const [parent, label, href] of [['Tentang', 'Fasilitas Sekolah', '/fasilitas'], ['Informasi', 'Berita', '/berita'], ['Informasi', 'Pengumuman', '/pengumuman']]) {
    await trigger(parent).hover(); await menu(parent).getByRole('link', { name: label, exact: true }).click(); await page.waitForURL(base + href); await gotoHome();
  }
  const desktopPage = page;
  page = await browser.newPage({ hasTouch: true, viewport: { width: 768, height: 1000 } });
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/rest/v1/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
  for (const width of [768, 375, 320]) {
    await page.setViewportSize({ width, height: 1000 }); await gotoHome();
    await trigger('Buka menu').tap({ timeout: 2000 });
    for (const name of ['Tentang', 'Informasi']) {
      await page.locator('#mobile-nav').getByRole('button', { name, exact: true }).tap({ timeout: 2000 });
      const panel = page.locator(`#mobile-${name.toLowerCase()}-links`); await panel.waitFor();
      await panel.evaluate(el => Promise.all(el.getAnimations().map(animation => animation.finished.catch(() => {}))));
      assert.equal(await page.locator('#mobile-nav').getByRole('button', { name, exact: true }).locator('svg.lucide-chevron-down').count(), 1);
      assert.ok(await panel.locator('a').count() > 0);
    }
    await page.locator('#mobile-informasi-links').getByRole('link', { name: 'Pengumuman', exact: true }).tap({ timeout: 2000 }); await page.waitForURL(base + '/pengumuman'); assert.equal(await page.locator('#mobile-nav').count(), 0);
    results.push({ width, mobileTap: 'passed' });
  }
  await page.close(); page = desktopPage;
  const touch = await browser.newPage({ viewport: { width: 1440, height: 1000 }, hasTouch: true });
  try { await touch.goto(base); await touch.locator('[data-quick-access]').waitFor(); await touch.locator('header').getByRole('button', { name: 'Tentang', exact: true }).tap(); await touch.locator('#desktop-tentang-links').waitFor(); } finally { await touch.close(); }
  for (const count of [8, 0]) for (const width of [1920, 1440, 1280, 768, 375, 320]) {
    fixture = rows.slice(0, count); await page.setViewportSize({ width, height: 1000 }); await gotoHome();
    await page.locator('#prestasi').scrollIntoViewIfNeeded();
    if (count) await page.locator('#prestasi h3').first().waitFor(); else await page.getByText('Belum ada prestasi.', { exact: true }).waitFor();
    const accents = page.locator('#prestasi [data-accent-side="left"]'); assert.equal(await accents.count(), 3);
    await accents.evaluateAll(imgs => Promise.all(imgs.map(img => img.decode())));
    const geometry = await accents.evaluateAll(imgs => imgs.map(el => {
      const r = el.getBoundingClientRect(), s = document.querySelector('#prestasi').getBoundingClientRect();
      return { id: el.dataset.figmaNode, inside: r.left >= s.left && r.right <= s.right && r.top >= s.top && r.bottom <= s.bottom, displayed: getComputedStyle(el).display !== 'none', size: r.width, pointer: getComputedStyle(el.parentElement).pointerEvents };
    }));
    assert(geometry.every(item => item.inside && item.displayed && item.size > 0 && item.pointer === 'none'));
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth), false);
    if (count && [1440, 768, 375].includes(width)) await page.locator('#prestasi').screenshot({ path: join(output, `prestasi-${width}.png`), animations: 'disabled', style: 'header { visibility: hidden; }' });
    results.push({ width, count, geometry });
  }
  await page.setViewportSize({ width: 1440, height: 1000 }); await page.emulateMedia({ reducedMotion: 'reduce' }); await gotoHome(); await trigger('Tentang').hover();
  assert.equal(await menu('Tentang').evaluate(el => getComputedStyle(el).animationName), 'none');
  assert.deepEqual(errors, []); console.log('PASS desktop hover, uninterrupted pointer path, keyboard/Escape, 3 submenu routes, mobile taps, wide touch, three unclipped native accents, reduced motion and no runtime errors.');
} finally { await writeFile(join(output, 'results.json'), JSON.stringify({ results, errors }, null, 2)); await browser.close(); }
