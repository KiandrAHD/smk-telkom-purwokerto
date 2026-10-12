/* global document, window, getComputedStyle, requestAnimationFrame */
import assert from 'node:assert/strict';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { tmpdir } from 'node:os';
import { createServer } from 'vite';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.QA_URL || 'http://127.0.0.1:4173';
const output = process.env.QA_OUTPUT || join(tmpdir(), 'carousel-pages-qa');
await mkdir(output, { recursive: true });
const server = await createServer({ logLevel: 'silent', server: { middlewareMode: true } });
const { prestasiData } = await server.ssrLoadModule('/src/data/dummyData.js');
await server.close();
const assets = await readdir('dist/assets');
const rows = Array.from({ length: 18 }, (_, i) => {
  const item = prestasiData.items[i % prestasiData.items.length];
  const stem = basename(item.image).replace(/\.[^.]+$/, '');
  const asset = assets.find(file => file.startsWith(stem + '-'));
  assert(asset);
  return { id: i + 1, judul: `QA Prestasi ${i + 1}`, slug: `qa-${i}`, kategori: item.category, gambar_url: `${base}/assets/${asset}`, tanggal: '2026-10-12' };
});
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage();
const errors = [], results = [];
page.on('pageerror', e => errors.push(e.message));
await page.route('**/rest/v1/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(route.request().url().includes('/prestasi') ? rows : []) }));
const sample = viewport => viewport.evaluate(el => new Promise(resolve => {
  const frames = [], start = performance.now();
  const tick = now => {
    const layer = el.querySelector('[data-motion-outgoing]');
    frames.push({ ms: now - start, incoming: new window.DOMMatrixReadOnly(getComputedStyle(el.firstElementChild).transform).m41, outgoing: layer ? new window.DOMMatrixReadOnly(getComputedStyle(layer).transform).m41 : null });
    if (now - start < 600) requestAnimationFrame(tick); else resolve(frames);
  };
  requestAnimationFrame(tick);
}));
try {
  for (const width of [1440, 768, 375]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    for (const [path, sectionSelector] of [['/profil-sekolah', '#guru'], ['/profil-sekolah/guru', 'section[aria-labelledby="kesiswaan-list-title"]'], ['/profil-sekolah/guru', 'section[aria-labelledby="guru-list-title"]']]) {
      await page.goto(base + path);
      const section = page.locator(sectionSelector), viewport = section.locator('[data-sliding-page]');
      await viewport.scrollIntoViewIfNeeded();
      await viewport.locator('img').evaluateAll(images => Promise.allSettled(images.map(image => { image.loading = 'eager'; return image.decode(); })));
      const controls = section.locator('button[aria-label*="sebelumnya"],button[aria-label*="berikutnya"]');
      const first = await viewport.locator('h3').allTextContents();
      for (const direction of [1, -1]) {
        const button = direction === 1 ? controls.last() : controls.first();
        const before = await viewport.boundingBox();
        await button.evaluate(el => { for (let i = 0; i < 12; i++) el.click(); });
        const recording = sample(viewport);
        if (width === 1440 && direction === 1) {
          await page.waitForTimeout(160);
          // Capture only the viewport: a tall element screenshot resizes the window and finishes motion.
          const y = Math.max(0, before.y);
          await page.screenshot({ path: join(output, `motion-${sectionSelector.includes('kesiswaan') ? 'kesiswaan' : path.endsWith('/guru') ? 'guru' : 'profil'}-160ms.png`), clip: { x: before.x, y, width: before.width, height: Math.min(before.height, 1000 - y) }, style: 'header { visibility: hidden; }' });
        }
        const frames = await recording;
        await page.waitForFunction(selector => !document.querySelector(selector)?.querySelector('[data-motion-outgoing]'), sectionSelector);
        const moving = frames.filter(frame => frame.outgoing !== null && Math.abs(frame.incoming) > 1);
        assert(moving.length > 3, `${width} ${sectionSelector}: horizontal transition missing`);
        assert(moving.every(frame => direction * frame.incoming > 0 && direction * frame.outgoing <= 0), 'Both pages must follow navigation direction');
        assert(frames.filter(frame => frame.outgoing !== null).every(frame => Math.abs(Math.abs(frame.incoming - frame.outgoing) - before.width) < 1), 'Outgoing and incoming pages must meet without a blank gap');
        assert(Math.abs(frames.at(-1).incoming) < 1, 'No final snap');
        assert(Math.abs((await viewport.boundingBox()).height - before.height) < 1, 'Page height must remain stable');
        if (direction === 1) assert.notDeepEqual(await viewport.locator('h3').allTextContents(), first);
        else assert.deepEqual(await viewport.locator('h3').allTextContents(), first, 'Rapid clicks must advance exactly one page');
        results.push({ width, path, sectionSelector, direction, frames });
      }
      assert(await controls.first().isDisabled());
      await page.emulateMedia({ reducedMotion: 'reduce' }); await controls.last().click();
      assert.equal(await viewport.locator('[data-motion-outgoing]').count(), 0);
      assert.equal(await viewport.locator(':scope > div').first().evaluate(el => getComputedStyle(el).transform), 'none');
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await section.locator('h2').first().evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await page.waitForFunction(selector => document.querySelector(selector).querySelector('h2').closest('.reveal')?.classList.contains('visible') ?? true, sectionSelector);
      await page.waitForTimeout(600);
      await section.screenshot({ path: join(output, `${sectionSelector.includes('kesiswaan') ? 'kesiswaan' : path.endsWith('/guru') ? 'guru' : 'profil'}-${width}.png`), animations: 'disabled', style: 'header { visibility: hidden; }' });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth), false);
    }
    await page.goto(base);
    const section = page.locator('#prestasi'); await section.scrollIntoViewIfNeeded(); await section.locator('h3').first().waitFor();
    const track = section.locator('[data-lenis-prevent-horizontal]');
    for (const direction of [1, -1]) {
      const button = section.getByRole('button', { name: direction === 1 ? 'Prestasi berikutnya' : 'Prestasi sebelumnya', exact: true });
      const start = await track.evaluate(el => el.scrollLeft);
      await button.evaluate(el => { for (let i = 0; i < 12; i++) el.click(); });
      const values = await track.evaluate(el => new Promise(resolve => {
        const values = [], start = performance.now();
        const tick = now => { values.push(el.scrollLeft); if (now - start < 600) requestAnimationFrame(tick); else resolve(values); };
        requestAnimationFrame(tick);
      }));
      assert(direction * (values.at(-1) - start) > 1);
      assert(values.some(value => Math.abs(value - start) > 1 && Math.abs(value - values.at(-1)) > 1));
      assert(values.every((v, i) => i === 0 || direction * (v - values[i - 1]) >= -1));
      if (direction === -1) assert(values.at(-1) < 1);
      results.push({ width, prestasi: true, direction, values });
    }
    await section.screenshot({ path: join(output, `prestasi-${width}.png`), animations: 'disabled', style: 'header { visibility: hidden; }' });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const dots = section.locator('button[aria-label^="Ke slide prestasi"]');
    await dots.last().click();
    await page.waitForFunction(() => {
      const el = document.querySelector('#prestasi [data-lenis-prevent-horizontal]');
      return Math.abs(el.scrollLeft - (el.scrollWidth - el.clientWidth)) < 1;
    });
    await section.locator('button[aria-label="Prestasi berikutnya"]:disabled').waitFor();
    await dots.first().click(); await section.locator('button[aria-label="Prestasi sebelumnya"]:disabled').waitFor();
  }
  // A real touch context and keyboard activation retain native control behavior.
  const touch = await browser.newPage({ viewport: { width: 375, height: 1000 }, hasTouch: true, reducedMotion: 'reduce' });
  try {
    await touch.goto(base + '/profil-sekolah/guru');
    const section = touch.locator('section[aria-labelledby="kesiswaan-list-title"]');
    await section.locator('#kesiswaan-grid h3').first().waitFor();
    const next = section.locator('[data-teacher-pagination] > button').last();
    const initial = await section.locator('#kesiswaan-grid h3').allTextContents();
    await next.tap(); assert.notDeepEqual(await section.locator('#kesiswaan-grid h3').allTextContents(), initial);
    await section.locator('[data-teacher-pagination] > button').first().focus(); await touch.keyboard.press('Enter');
    assert.deepEqual(await section.locator('#kesiswaan-grid h3').allTextContents(), initial);
  } finally { await touch.close(); }
  assert.deepEqual(errors, []);
  console.log('PASS four sections, 1440/768/375px, left/right motion, rapid-click lock, stable height, finite first endpoint, reduced motion, overflow and runtime errors.');
} finally {
  await writeFile(join(output, 'results.json'), JSON.stringify({ results, errors }, null, 2));
  await browser.close();
}
