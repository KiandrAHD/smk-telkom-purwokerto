/* global document, getComputedStyle */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.QA_URL || 'http://127.0.0.1:4174';
const output = process.env.QA_OUTPUT || '../outputs/prestasi-ci-2026-10-14/browser';
await mkdir(output, { recursive: true });
const server = await createServer({ server: { middlewareMode: true, hmr: false }, logLevel: 'silent' });
let rows, translate;
try {
  const { getPrestasi } = await server.ssrLoadModule('/src/services/prestasiService.js');
  ({ translate } = await server.ssrLoadModule('/src/utils/language.js'));
  rows = (await getPrestasi()).slice(0, 4);
  assert.equal(rows.length, 4, 'Validate against four real published achievement records.');
  assert.ok(rows.every(row => row.gambar_url));
} finally { await server.close(); }
await writeFile(`${output}/verified-records.json`, JSON.stringify(rows.map(({ judul, slug, gambar_url, tanggal }) => ({ judul, slug, gambar_url, tanggal })), null, 2));

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [], errors = [];
try {
  for (const width of [1847, 1440, 1024, 768, 390, 320]) for (const language of ['id', 'en']) {
    const page = await browser.newPage({ viewport: { width, height: 1100 }, reducedMotion: 'reduce' });
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(language => sessionStorage.setItem('smk-telkom-language', language), language);
    await page.route('**/rest/v1/**', route => route.fulfill({ contentType: 'application/json', body: JSON.stringify(route.request().url().includes('/prestasi?') ? rows : []) }));
    await page.goto(`${base}/prestasi`);
    const section = page.locator('[data-prestasi-unggulan]');
    await section.waitFor();
    await page.locator('.hero-panel img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
    assert.equal(await section.getByRole('button').count(), 3);
    for (const row of rows) {
      if (await section.locator('article').getAttribute('data-featured-slug') !== row.slug) {
        await section.getByRole('button').filter({ hasText: translate(row.judul, language) }).click();
      }
      const article = section.locator('article');
      const image = article.locator('img');
      await image.scrollIntoViewIfNeeded();
      await image.evaluate(image => image.decode());
      assert.equal(await image.getAttribute('src'), row.gambar_url);
      assert.equal(await image.getAttribute('alt'), translate(row.judul, language));
      assert.equal(await article.locator('h3').innerText(), translate(row.judul, language));
      assert.equal(await article.locator('a').getAttribute('href'), `/prestasi/${row.slug}`);
      assert.equal(await image.getAttribute('loading'), 'lazy');
    }
    const layout = await section.evaluate(section => ({
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      columns: getComputedStyle(section.querySelector('article')).gridTemplateColumns.split(' ').length,
      imageFit: getComputedStyle(section.querySelector('article img')).objectFit,
      headingFont: getComputedStyle(section.querySelector('h2')).fontFamily,
    }));
    assert.equal(layout.overflow, false);
    assert.equal(layout.columns, width >= 768 ? 2 : 1);
    assert.equal(layout.imageFit, 'contain');
    assert.match(layout.headingFont, /^Poppins/);
    assert.equal(await page.locator('.hero-floating--stats > div > div > span').count(), 4);
    await page.locator('.school-hero').screenshot({ path: `${output}/hero-${width}-${language}.png` });
    // Restore the newest achievement for the before/after composition screenshots.
    await section.getByRole('button').filter({ hasText: translate(rows[0].judul, language) }).click();
    await section.locator('article img').evaluate(image => image.decode());
    await section.screenshot({ path: `${output}/featured-${width}-${language}.png` });
    results.push({ width, language, records: rows.length, ...layout });
    await page.close();
  }
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  page.on('pageerror', error => errors.push(error.message));
  let response = [{ ...rows[0], gambar_url: null }];
  await page.route('**/rest/v1/**', route => route.fulfill({ contentType: 'application/json', body: JSON.stringify(response) }));
  await page.goto(`${base}/prestasi`);
  await page.locator('[data-prestasi-unggulan] article').getByRole('img', { name: 'Foto belum tersedia', exact: true }).waitFor();
  assert.equal(await page.locator('[data-prestasi-unggulan] article img').count(), 0);
  response = [];
  await page.reload();
  await page.getByText('Belum ada prestasi.', { exact: true }).waitFor();
  assert.equal(await page.locator('[data-prestasi-unggulan]').count(), 0);
  assert.deepEqual(errors, []);
  await writeFile(`${output}/results.json`, JSON.stringify({ results, errors, missingPhoto: 'pass', emptyData: 'pass' }, null, 2));
  console.log(`PASS ${results.length} viewport/language combinations: four real achievement/photo pairs, selection, links, lazy images, layout, statistics and empty/missing-photo states.`);
} finally { await browser.close(); }
