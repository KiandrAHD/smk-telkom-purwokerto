/* global window, document -- referenced only inside browser callbacks */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createServer } from 'vite';
// Browser tests use an existing Playwright installation; no runtime dependency.
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(import.meta.dirname, '..');
const server = await createServer({ root, logLevel: 'error', server: { host: '127.0.0.1', port: 5192, strictPort: true }, plugins: [{
  name: 'qa-achievements',
  resolveId(id) { if (id === '/qa-achievements.jsx') return id; },
  load(id) { if (id === '/qa-achievements.jsx') return `import React from 'react'; import {createRoot} from 'react-dom/client'; import {MemoryRouter} from 'react-router-dom'; import AchievementsSection from '/src/components/AchievementsSection.jsx'; import '/src/index.css'; const root=createRoot(document.getElementById('root')); window.unmountAchievements=()=>root.unmount(); root.render(<React.StrictMode><MemoryRouter><AchievementsSection/></MemoryRouter></React.StrictMode>);`; },
  configureServer(s) { s.middlewares.use(async (req, res, next) => { if (req.url?.split('?')[0] !== '/qa-achievements') return next(); res.setHeader('Content-Type', 'text/html'); res.end(await s.transformIndexHtml('/qa-achievements', '<html><head><style>#spacer{height:3000px}</style></head><body><div id="spacer"></div><div id="root"></div><script type="module" src="/qa-achievements.jsx"></script></body></html>')); }); },
}] });
await server.listen();
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, headless: true });
const results = [];
const row = { id: 91, judul: 'Prestasi QA pertama', slug: 'prestasi-qa-pertama', kategori: 'Teknologi', deskripsi: 'Fixture pengujian lokal', gambar_url: null, tingkat: 'Nasional', tanggal: '2026-01-01', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' };
try {
  for (const scenario of ['success', 'empty', 'error', 'slow', 'no-observer', 'import-error', 'unmount']) {
    const context = await browser.newContext({ viewport: { width: 412, height: 823 } });
    const page = await context.newPage();
    let calls = 0;
    let loadingHeight;
    let release;
    const pending = new Promise((resolve) => { release = resolve; });
    await page.route('**/rest/v1/prestasi?*', async (route) => {
      calls++;
      if (scenario === 'slow') await pending;
      await route.fulfill({ status: scenario === 'error' ? 500 : 200, contentType: 'application/json', body: JSON.stringify(scenario === 'error' ? { message: 'QA failure', code: 'QA' } : scenario === 'empty' ? [] : [row, { ...row, id: 92, judul: 'Prestasi QA kedua', slug: 'prestasi-qa-kedua' }]) });
    });
    if (scenario === 'no-observer') await page.addInitScript(() => { window.IntersectionObserver = undefined; });
    if (scenario === 'import-error') await page.route('**/src/services/prestasiService.js*', (r) => r.abort());
    await page.goto('http://127.0.0.1:5192/qa-achievements');
    await page.locator('#prestasi').waitFor();
    await page.waitForTimeout(600);
    if (scenario !== 'no-observer') assert.equal(calls, 0, 'Achievements fetched before the below-fold section was approached');
    if (scenario === 'unmount') {
      await page.evaluate(() => window.unmountAchievements());
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);
      assert.equal(calls, 0, 'Unmounted observer started a request');
    } else {
      await page.locator('#prestasi').scrollIntoViewIfNeeded();
      if (scenario === 'slow') { await page.locator('[aria-busy="true"]').waitFor(); loadingHeight = (await page.locator('#prestasi').boundingBox()).height; release(); }
      if (scenario === 'error' || scenario === 'import-error') await page.getByRole('alert').waitFor();
      else if (scenario === 'empty') await page.getByText('Belum ada prestasi.').waitFor();
      else {
        await page.getByRole('heading', { name: 'Prestasi QA pertama' }).waitFor();
        assert.equal(await page.locator('a[href="/prestasi/prestasi-qa-pertama"]').count(), 1);
        await page.locator('#prestasi').scrollIntoViewIfNeeded();
      }
      assert.equal(calls, scenario === 'import-error' ? 0 : 1, 'Request must start at most once despite StrictMode and repeated intersections');
      if (scenario === 'slow') {
        const loadedHeight = (await page.locator('#prestasi').boundingBox()).height;
        assert.ok(Math.abs(loadingHeight - loadedHeight) < 80, `Deferred mobile skeleton collapses ${loadingHeight - loadedHeight}px when data arrives`);
      }
    }
    results.push({ scenario, calls, passed: true });
    await context.close();
  }
  const integration = await browser.newPage({ viewport: { width: 1350, height: 940 } });
  await integration.route('**/rest/v1/prestasi?*', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([row]) }));
  await integration.goto('http://127.0.0.1:5192/#prestasi', { waitUntil: 'networkidle' });
  await integration.waitForFunction(() => {
    const section = document.querySelector('#prestasi');
    return section && section.getBoundingClientRect().top < window.innerHeight && !section.querySelector('[aria-busy="true"]');
  });
  await integration.locator('footer a[href="/profil-sekolah"]').scrollIntoViewIfNeeded();
  const savedTop = await integration.evaluate(() => window.scrollY);
  await integration.locator('footer a[href="/profil-sekolah"]').click();
  await integration.waitForURL('**/profil-sekolah');
  await integration.goBack({ waitUntil: 'networkidle' });
  await integration.waitForFunction((top) => Math.abs(window.scrollY - top) < 80, savedTop);
  results.push({ scenario: 'full-app-anchor-history', passed: true });
  const fragment = await browser.newPage({ viewport: { width: 412, height: 823 } });
  await fragment.route('**/rest/v1/prestasi?*', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([row]) }));
  await fragment.goto('http://127.0.0.1:5192/', { waitUntil: 'networkidle' });
  await fragment.locator('#tentang').scrollIntoViewIfNeeded();
  await fragment.goto('http://127.0.0.1:5192/#prestasi', { waitUntil: 'networkidle' });
  await fragment.waitForFunction(() => {
    const section = document.querySelector('#prestasi');
    return section && section.getBoundingClientRect().top >= 0 && section.getBoundingClientRect().top < window.innerHeight && !section.querySelector('[aria-busy="true"]');
  });
  results.push({ scenario: 'full-app-native-fragment-same-key', passed: true });
  if (process.env.QA_OUTPUT_DIR) {
    fs.mkdirSync(process.env.QA_OUTPUT_DIR, { recursive: true });
    fs.writeFileSync(path.join(process.env.QA_OUTPUT_DIR, 'achievements-check.json'), JSON.stringify(results, null, 2));
  }
  console.log('Achievements: seven real-component scenarios and full-app anchor/history/native-fragment pass.');
} finally { await browser.close(); await server.close(); }
