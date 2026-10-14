/* global document, window, getComputedStyle, requestAnimationFrame, KeyboardEvent */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const base = process.env.QA_URL || 'http://127.0.0.1:5173', output = process.env.QA_OUTPUT || '../outputs/motion-redesign-2026-10-14';
const records = JSON.parse(await readFile(`${output}/responsive.json`, 'utf8')).filter(item => item.viewport === 1440 && item.language === 'id');
const errors = [], results = [], hrefs = new Set();
const framesOnly = process.argv.includes('--frames'), linksOnly = process.argv.includes('--links');
await mkdir(output, { recursive: true });
try {
  // One context at a time records frame timing without concurrent QA tabs competing for the GPU.
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  page.on('pageerror', error => errors.push(error.message));
  for (const record of records) {
    await page.goto(base + record.route, { waitUntil: 'domcontentloaded' });
    const root = page.locator('[data-hero-carousel]'); await root.waitFor();
    for (const href of await root.locator('a').evaluateAll(links => links.map(link => link.getAttribute('href')))) {
      const target = new URL(href, base + record.route);
      hrefs.add(target.pathname + target.search + target.hash);
    }
    if (linksOnly) {
      if (record.route === '/fasilitas') {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        for (const [index, category, anchor] of [[1, 'Laboratorium', 'lab'], [2, 'Perpustakaan', 'perpustakaan']]) {
          await root.press('ArrowRight');
          await page.waitForFunction(index => document.querySelector('[data-hero-carousel]').dataset.heroIndex === String(index), index);
          await root.locator('[data-active="true"] a').first().click();
          await page.waitForURL(`**/fasilitas?kategori=${category}#fasilitas-${anchor}`);
          await page.locator(`#fasilitas-${anchor}`).waitFor();
        }
      }
      continue;
    }
    await root.locator('img').evaluateAll(images => Promise.all(images.map(img => { img.loading = 'eager'; return img.decode(); })));
    await page.evaluate(() => document.fonts.ready); await root.focus();
    const frames = await root.evaluate(node => new Promise(resolve => {
      const active = node.querySelector('[data-active="true"]'), height = node.getBoundingClientRect().height, times = [], xs = [], heights = [];
      let started;
      node.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      const sample = time => {
        started ??= time; times.push(time); xs.push(new window.DOMMatrixReadOnly(getComputedStyle(active).transform).m41); heights.push(node.getBoundingClientRect().height);
        if (time - started < 950) requestAnimationFrame(sample);
        else resolve({ times, xs, stable: heights.every(value => Math.abs(value - height) < 1) });
      };
      requestAnimationFrame(sample);
    }));
    assert.ok(frames.xs.some(x => x > 20), 'Previous moves horizontally');
    assert.ok(frames.stable, `Stable transition height ${record.route}`);
    const count = record.slides.length;
    await page.waitForFunction(next => document.querySelector('[data-hero-carousel]').dataset.heroIndex === String(next), count - 1);
    if (!framesOnly) for (const direction of [-1, 1]) for (let turn = 1; turn <= count * 3; turn++) {
      const before = Number(await root.getAttribute('data-hero-index'));
      await root.press(direction > 0 ? 'ArrowRight' : 'ArrowLeft');
      await page.waitForFunction(next => document.querySelector('[data-hero-carousel]').dataset.heroIndex === String(next), (before + direction + count) % count);
    }
    const intervals = frames.times.slice(1).map((time, index) => time - frames.times[index]).sort((a, b) => a - b);
    results.push({ route: record.route, nextCycles: framesOnly ? 0 : 3, previousCycles: framesOnly ? 0 : 3, averageFps: 1000 * (frames.times.length - 1) / (frames.times.at(-1) - frames.times[0]), medianFrameMs: intervals[Math.floor(intervals.length / 2)], slowFrames: intervals.filter(time => time > 34).length, stableHeight: true });
    console.log(`${framesOnly ? 'Frame sample' : 'Manual 3 cycles each direction'} ${record.route}`);
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  if (!framesOnly) for (const href of hrefs) {
    const target = new URL(href, base);
    await page.goto(target.href, { waitUntil: 'domcontentloaded' });
    await page.getByRole('heading', { level: 1 }).waitFor();
    assert.equal(new URL(page.url()).pathname, target.pathname);
    assert.equal(new URL(page.url()).search, target.search, 'CTA preserves category filtering');
    assert.equal(await page.getByRole('heading', { name: /Halaman Tidak Ditemukan|Page Not Found/ }).count(), 0, `Real CTA ${href}`);
    if (target.hash) await page.locator(target.hash).waitFor({ state: 'attached' });
  }
  if (!framesOnly) {
  await page.goto(base + '/ekstrakurikuler', { waitUntil: 'domcontentloaded' });
  const search = page.getByRole('searchbox', { name: 'Cari kegiatan' }); await search.fill('OSIS');
  await page.waitForFunction(() => document.querySelector('input[type="search"]').value === 'OSIS');
  await search.press('ArrowLeft');
  assert.equal(await page.locator('[data-hero-carousel]').getAttribute('data-hero-index'), '0', 'Text editing arrows keep search active');
  assert.equal(await search.inputValue(), 'OSIS');
  }
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  const marquee = page.locator('[data-hero-marquee]'), track = marquee.locator('.beranda-ribbon-track');
  await marquee.scrollIntoViewIfNeeded();
  const seam = await track.evaluate(node => {
    const animation = node.getAnimations()[0], duration = animation.effect.getTiming().duration;
    animation.pause();
    const sample = time => {
      animation.currentTime = time;
      const box = node.parentElement.getBoundingClientRect();
      return [...node.querySelectorAll('.beranda-ribbon-badge')].map(badge => {
        const rect = badge.getBoundingClientRect(); return { text: badge.textContent, x: rect.x - box.x, width: rect.width };
      }).filter(badge => badge.x + badge.width >= 0 && badge.x <= box.width);
    };
    return { easing: animation.effect.getTiming().easing, before: sample(duration - 1), after: sample(duration + 1) };
  });
  assert.equal(seam.easing, 'linear'); assert.equal(seam.before.length, seam.after.length);
  seam.before.forEach((badge, index) => { assert.equal(badge.text, seam.after[index].text); assert.ok(Math.abs(badge.x - seam.after[index].x) < 1, 'Loop seam has no jump'); });
  assert.deepEqual(errors, []);
  await writeFile(`${output}/${framesOnly ? 'frame-timing' : linksOnly ? 'links' : 'interactions'}.json`, JSON.stringify({ results, destinations: [...hrefs], marqueeSeam: seam, errors }, null, 2));
  console.log(`PASS ${framesOnly ? `${results.length} frame samples` : linksOnly ? 'CTA links' : `normal-motion three cycles Next/Previous on ${results.length} routes`}, ${hrefs.size} configured destinations and marquee seam.`);
} finally { await browser.close(); }
