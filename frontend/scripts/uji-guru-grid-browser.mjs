/* global document, window, getComputedStyle, requestAnimationFrame */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createServer } from 'vite';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:4173';
const output = process.env.QA_OUTPUT || join(tmpdir(), 'smk-guru-grid-qa');
await mkdir(output, { recursive: true });
const fixtureHtml = `<html><body><div id="root"></div><script type="module">
import React from 'react'; import {createRoot} from 'react-dom/client'; import {MemoryRouter} from 'react-router-dom';
import {GuruGrid} from '/src/pages/GuruPage.jsx'; import {profilGuruData} from '/src/data/profilGuruData.js';
import {LanguageContext} from '/src/context/LanguageContext.js'; import {translate} from '/src/utils/language.js'; import '/src/index.css';
const params=new URLSearchParams(location.search); const language=params.get('lang')||'id';
createRoot(document.getElementById('root')).render(React.createElement(MemoryRouter,null,React.createElement(LanguageContext.Provider,{value:{language,t:(text,vars)=>translate(text,language,vars)}},React.createElement(GuruGrid,{teachers:profilGuruData.slice(0,Number(params.get('count')))}))));
</script></body></html>`;
const server = await createServer({ logLevel: 'silent', server: { host: '127.0.0.1', port: 5186, strictPort: true }, plugins: [{
  name: 'guru-grid-qa-fixture', configureServer(vite) {
    vite.middlewares.use('/__guru_fixture', async (req, res, next) => {
      if (req.url.includes('html-proxy')) return next();
      try { res.setHeader('Content-Type', 'text/html'); res.end(await vite.transformIndexHtml('/__guru_fixture', fixtureHtml)); }
      catch (error) { next(error); }
    });
  },
}] });
await server.listen();
const { profilGuruData, kesiswaanData, tenagaPendidikData } = await server.ssrLoadModule('/src/data/profilGuruData.js');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ reducedMotion: 'reduce' });
const errors = [], results = [];
page.on('pageerror', error => errors.push(error.message));
await page.route('**/rest/v1/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
let category = 'guru';
const grid = () => page.locator(`#${category}-grid`);
const nav = () => page.locator(`section[aria-labelledby="${category}-list-title"] [data-teacher-pagination]`);
const names = () => grid().locator('h3').allTextContents();
const sizeAt = width => width >= 1200 ? 8 : width >= 768 ? 4 : 2;
const assertPage = async (index, size, data = profilGuruData) => {
  const expected = data.slice(index * size, (index + 1) * size).map(teacher => teacher.nama);
  await page.waitForFunction(({ expected, category }) => JSON.stringify([...document.querySelectorAll(`#${category}-grid [data-teacher-card] h3`)].map(el => el.textContent)) === JSON.stringify(expected), { expected, category });
  assert.deepEqual(await names(), expected);
  if (Math.ceil(data.length / size) > 1) {
    const controls = nav().locator(':scope > button');
    assert.equal(await controls.first().isDisabled(), index === 0);
    assert.equal(await controls.last().isDisabled(), index === Math.ceil(data.length / size) - 1);
    assert.equal(await nav().locator('[aria-current="page"]').count(), 1);
    const centers = await nav().evaluate(el => {
      const pill = el.querySelector('[data-teacher-pill]').getBoundingClientRect(), active = el.querySelector('[aria-current="page"]').getBoundingClientRect();
      return { pill: pill.x + pill.width / 2, active: active.x + active.width / 2 };
    });
    assert.ok(Math.abs(centers.pill - centers.active) < 1);
  }
};
try {
  for (const width of process.env.QA_FIXTURES_ONLY ? [] : [1440, 1200, 1199, 768, 767, 375, 320]) for (const language of ['id', 'en']) {
    await page.setViewportSize({ width, height: 1000 }); await page.goto(base + '/profil-sekolah/guru'); await grid().waitFor();
    if (await page.locator('html').getAttribute('lang') !== language) await page.locator('header').getByRole('button', { name: /^Switch to / }).click();
    await page.evaluate(() => document.fonts.ready);
    for (const [id, teachers] of [['kesiswaan', kesiswaanData], ['guru', tenagaPendidikData]]) {
    category = id;
    const otherId = id === 'guru' ? 'kesiswaan' : 'guru';
    const otherNames = await page.locator(`#${otherId}-grid h3`).allTextContents();
    const size = sizeAt(width), visited = [], heights = [];
    for (let index = 0; index < Math.ceil(teachers.length / size); index++) {
      await assertPage(index, size, teachers); visited.push(...await names());
      assert.deepEqual(await page.locator(`#${otherId}-grid h3`).allTextContents(), otherNames, 'Category pagination must be independent.');
      const geometry = await grid().evaluate(el => {
        const boxes = [...el.children].map(card => card.getBoundingClientRect());
        return { height: el.getBoundingClientRect().height, columns: getComputedStyle(el).gridTemplateColumns.split(' ').length, rows: new Set(boxes.map(box => Math.round(box.y))).size, overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth, maxHeight: Math.max(...boxes.map(box => box.height)), minHeight: Math.min(...boxes.map(box => box.height)) };
      });
      assert.equal(geometry.columns, size / 2); assert.equal(geometry.rows, Math.ceil(Math.min(size, teachers.length - index * size) / (size / 2))); assert.equal(geometry.overflow, false);
      assert.ok(geometry.maxHeight - geometry.minHeight < 1); heights.push(geometry.height);
      await grid().locator('img').evaluateAll(images => Promise.all(images.map(img => { img.loading = 'eager'; return img.decode(); })));
      if (index === 0) {
        await grid().screenshot({ path: join(output, `${category}-grid-${width}-${language}.png`), animations: 'disabled', style: 'header { visibility: hidden; }' });
        if ((width === 1440 && language === 'id') || (width === 768 && language === 'id') || (width === 375 && language === 'en')) {
          const section = page.locator(`section[aria-labelledby="${category}-list-title"]`); await section.scrollIntoViewIfNeeded();
          await section.screenshot({ path: join(output, `${category}-section-${width}-${language}.png`), animations: 'disabled', style: 'header { visibility: hidden; }' });
        }
      }
      if (index < Math.ceil(teachers.length / size) - 1) await nav().locator(':scope > button').last().click();
    }
    assert.deepEqual(visited, teachers.map(teacher => teacher.nama)); assert.equal(new Set(visited).size, teachers.length);
    assert.ok(Math.max(...heights) - Math.min(...heights) < 1, 'Grid height must remain stable across teacher pages.');
    results.push({ category, width, language, size, pages: heights.length, heightRange: Math.max(...heights) - Math.min(...heights) });
    console.log('PASS all teachers and independent finite pagination', category, width, language, 'height range', Math.max(...heights) - Math.min(...heights));
    await nav().locator(':scope > button').first().focus(); await page.keyboard.press('Enter'); await assertPage(Math.ceil(teachers.length / size) - 2, size, teachers);
    const dot = nav().locator('button[aria-current="page"]'); await dot.focus(); await page.keyboard.press('Space');
    }
  }
  category = 'guru';
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const count of [0, 1, 7, 8, 9, 15]) {
    await page.goto(`http://127.0.0.1:5186/__guru_fixture?count=${count}`);
    if (count === 0) { await page.getByText('Belum ada profil guru.', { exact: true }).waitFor(); assert.equal(await nav().count(), 0); results.push({ fixture: count, passed: true }); continue; }
    await grid().waitFor(); await assertPage(0, 8, profilGuruData.slice(0, count));
    assert.equal(await nav().count(), count > 8 ? 1 : 0);
    if (count > 8) {
      const initial = await grid().boundingBox(); await nav().locator(':scope > button').last().click(); await assertPage(1, 8, profilGuruData.slice(0, count));
      assert.equal(await grid().locator('[data-teacher-card]').count(), count - 8);
      const last = await grid().boundingBox(); assert.ok(Math.abs(last.height - initial.height) < 1);
    }
    console.log('PASS fixture', count);
    results.push({ fixture: count, passed: true });
  }
  await page.goto(base + '/profil-sekolah/guru'); await grid().waitFor();
  if (await page.locator('html').getAttribute('lang') !== 'en') await page.locator('header').getByRole('button', { name: /^Switch to / }).click();
  await nav().locator(':scope > div > button').nth(2).click();
  await assertPage(2, 8, tenagaPendidikData); const firstTeacher = (await names())[0];
  for (const width of [375, 768, 1200]) { await page.setViewportSize({ width, height: 1000 }); await page.waitForFunction(name => document.querySelector('#guru-grid [data-teacher-card] h3')?.textContent === name, firstTeacher); await assertPage(16 / sizeAt(width), sizeAt(width), tenagaPendidikData); }
  await page.setViewportSize({ width: 1440, height: 1000 }); await page.reload(); await grid().waitFor(); await page.emulateMedia({ reducedMotion: 'no-preference' }); await nav().scrollIntoViewIfNeeded();
  await nav().locator('[data-teacher-pill]').evaluate(el => { window.teacherPill = el; });
  await nav().locator(':scope > div > button').nth(1).click();
  const samples = await nav().locator('[data-teacher-pill]').evaluate(el => new Promise(resolve => {
    const positions = [], start = performance.now(); const sample = now => { positions.push(new window.DOMMatrixReadOnly(getComputedStyle(el).transform).m41); if (now - start < 600) requestAnimationFrame(sample); else resolve(positions); }; requestAnimationFrame(sample);
  }));
  assert.ok(samples.some(x => x > 0 && x < 32)); assert.ok(Math.abs(samples.at(-1) - 32) < 0.1); assert.ok(samples.every((x, index) => index === 0 || x >= samples[index - 1] - 0.1));
  assert.equal(await nav().locator('[data-teacher-pill]').evaluate(el => window.teacherPill === el), true);
  assert.equal(await nav().locator('[data-teacher-pill]').evaluate(el => getComputedStyle(el).transitionProperty), 'none');
  await page.emulateMedia({ reducedMotion: 'reduce' }); assert.ok(parseFloat(await nav().locator('[data-teacher-pill]').evaluate(el => getComputedStyle(el).transitionDuration)) <= 0.001);
  results.push({ resize: 'passed', keyboard: 'passed', motion: 'passed', transformSamples: samples, reducedMotion: 'passed', runtimeErrors: errors });
  assert.deepEqual(errors, []); console.log('PASS resize, shared pill interpolation, 500ms shared timeline, reduced motion, no runtime errors');
} catch (error) { console.error('Runtime errors:', errors, 'Body:', (await page.locator('body').innerText()).slice(0, 500)); throw error; }
finally { await writeFile(join(output, 'results.json'), JSON.stringify(results, null, 2)); await browser.close(); await server.close(); }
