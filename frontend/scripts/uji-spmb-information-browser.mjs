/* global document, window, getComputedStyle */
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.QA_URL || 'http://127.0.0.1:4173';
const output = process.env.QA_OUTPUT || join(tmpdir(), 'spmb-information-qa');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ reducedMotion: 'reduce' });
// Existing source-backed content is seeded by migration; keep this visual regression offline.
const migration = await readFile(new URL('../../supabase/migrations/012_spmb_information.sql', import.meta.url), 'utf8');
const fixtureRows = JSON.parse(migration.match(/jsonb_to_recordset\('([\s\S]+)'::jsonb\)/)[1].replace(/''/g, "'")).map((row, index) => ({ ...row, id: `seed-${index}` }));
await context.route('**/rest/v1/spmb_information?*', route => route.fulfill({ contentType: 'application/json', body: JSON.stringify(fixtureRows) }));
await context.route('**/rest/v1/rpc/get_spmb_statistics', route => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ total_pendaftar: null, diterima: null, kuota_total: null, kuota_tersedia: null }) }));
const page = await context.newPage(), errors = [], results = [];
page.on('pageerror', error => errors.push(error.message));
try {
  await page.goto(base + '/spmb'); await page.getByRole('heading', { level: 1, name: /Wujudkan Mimpimu/ }).waitFor();
  assert.equal(new URL(page.url()).pathname, '/spmb');
  await page.reload(); await page.getByRole('heading', { name: 'Timeline Penerimaan', exact: true }).waitFor();
  assert.equal(await page.locator('.spmb-timeline li').count(), 7); assert.equal(await page.locator('.spmb-scheme').count(), 3);
  assert.equal(await page.getByText('Data belum tersedia', { exact: true }).count(), 1); assert.equal(await page.getByRole('timer').count(), 0);
  assert.match(await page.locator('.spmb-wave-table').innerText(), /31 Agu 2026/);
  assert.equal(await page.locator('.spmb-wave-table tbody tr').first().getByText('Ditutup', { exact: true }).count(), 1);
  assert.equal(await page.locator('.spmb-info-card a').getAttribute('href'), 'https://wa.me/6281229701800');
  assert.equal(await page.locator('#ppdb a').getAttribute('href'), '/spmb/daftar');
  assert.equal(await page.locator('#mitra img[alt]:not([alt=""])').count(), 6);
  await page.getByRole('link', { name: 'Lihat Alur', exact: true }).click();
  await page.waitForURL(base + '/spmb#alur-spmb');
  await page.waitForFunction(() => Math.abs(document.getElementById('alur-spmb').getBoundingClientRect().top - 96) < 10);
  await page.getByRole('link', { name: 'Daftar SPMB', exact: true }).click(); await page.waitForURL(base + '/spmb/daftar');
  await page.getByRole('heading', { level: 1 }).waitFor();
  await page.goto(base + '/spmb/masuk'); await page.getByRole('heading', { name: 'Masuk ke Akun Anda', exact: true }).waitFor();
  await page.goto(base + '/ppdb?next=qa'); await page.waitForURL(base + '/spmb/masuk?next=qa');
  for (const language of ['id', 'en']) {
    await page.goto(base + '/spmb');
    if (language === 'en') await page.getByRole('button', { name: 'Switch to English', exact: true }).click();
    for (const width of [1920, 1440, 1024, 768, 375, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.locator('.spmb-page .hero-image').waitFor();
      for (const section of await page.locator('.spmb-page .reveal').all()) { await section.scrollIntoViewIfNeeded(); }
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' })); await page.waitForFunction(() => window.scrollY < 2);
      await page.waitForFunction(() => [...document.images].filter(img => img.getBoundingClientRect().height > 0).every(img => img.complete && img.naturalWidth > 0));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth), false, `${language}/${width} overflow`);
      assert.equal(await page.locator('header nav[aria-label]').count() <= 1, true);
      assert.equal(await page.locator('main').count(), 1); assert.equal(await page.locator('footer').count(), 1);
      assert.equal(await page.locator('.beranda-ribbon-track').evaluate(el => getComputedStyle(el).animationName), 'none');
      const cards = await page.locator('[data-quick-access] .quick-access-card').evaluateAll(elements => elements.map(el => el.getBoundingClientRect().height));
      if (width >= 1024) assert(cards.every(height => Math.abs(height - cards[0]) < 1));
      await page.screenshot({ path: join(output, `spmb-${language}-${width}.png`), fullPage: true });
      results.push({ language, width, overflow: false });
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  // Capture related rectangles in one frame; scroll restoration can move the page between calls.
  const measureHero = () => page.evaluate(() => { const hero = document.querySelector('.hero-panel').getBoundingClientRect(), qac = document.querySelector('[data-quick-access]').getBoundingClientRect(); return { height: hero.height, width: hero.width, qacHeight: qac.height, overlap: qac.top - hero.bottom }; });
  await page.goto(base + '/'); await page.locator('.hero-panel').waitFor();
  const home = await measureHero();
  await page.goto(base + '/spmb'); await page.locator('.hero-panel').waitFor();
  const spmb = await measureHero();
  assert.deepEqual(home, spmb); results.push({ baseline: 'Beranda', spmb });
  await page.getByRole('button', { name: /Information|Informasi/, exact: true }).click(); await page.getByRole('link', { name: 'SPMB', exact: true }).first().click(); await page.waitForURL(base + '/spmb');
  await page.setViewportSize({ width: 375, height: 900 }); await page.getByRole('button', { name: 'Open menu', exact: true }).click();
  await page.getByRole('button', { name: 'Information', exact: true }).click(); await page.getByRole('link', { name: 'SPMB', exact: true }).first().click();
  await page.waitForURL(base + '/spmb'); assert.equal(await page.getByRole('button', { name: 'Close menu', exact: true }).count(), 0);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'no-preference' }); await page.reload(); await page.locator('.beranda-ribbon-track').waitFor();
  assert.equal(await page.locator('.beranda-ribbon-track').evaluate(el => getComputedStyle(el).animationTimingFunction), 'linear');
  assert.equal(await page.locator('.beranda-ribbon-track').evaluate(el => getComputedStyle(el).animationIterationCount), 'infinite');
  await page.locator('.spmb-timeline').scrollIntoViewIfNeeded(); await page.locator('.reveal.visible').filter({ has: page.locator('.spmb-timeline') }).waitFor();
  await page.waitForFunction(() => getComputedStyle(document.querySelector('.spmb-timeline'), '::before').transform === 'matrix(1, 0, 0, 1, 0, 0)');
  assert.deepEqual(errors, []);
  console.log('PASS SPMB info route/reload, registration/login/legacy, timeline anchor, valid source/empty states, 12 viewport/language checks, assets, shared Hero/QAC dimensions, menu, reduced motion and marquee/timeline motion.');
} finally { await writeFile(join(output, 'results.json'), JSON.stringify({ results, errors }, null, 2)); await context.close(); await browser.close(); }
