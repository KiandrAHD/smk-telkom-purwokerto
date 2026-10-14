/* global document, window, getComputedStyle, requestAnimationFrame */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';

const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const base = process.env.QA_URL || 'http://127.0.0.1:5173';
const output = process.env.QA_OUTPUT || '../outputs/hero-carousel-2026-10-14';
await mkdir(output, { recursive: true });
const errors = [], results = [];
const paths = ['/spmb/masuk', '/fasilitas', '/jurusan', '/prestasi', '/profil-sekolah', '/profil-sekolah/guru', '/ekstrakurikuler', '/bkk', '/berita', '/pengumuman', '/kalender', '/spmb'];
const slideCount = paths.length;
const monitor = page => page.on('pageerror', error => errors.push(error.message));
const index = page => page.locator('[data-hero-carousel]').getAttribute('data-hero-index').then(Number);
const settled = page => page.waitForFunction(() => document.querySelector('[data-hero-carousel]')?.dataset.heroMoving === 'false');
const ready = async page => {
  await page.locator('[data-hero-carousel]').waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all(document.querySelector('main').getAnimations().map(animation => animation.finished.catch(() => {}))));
  await page.locator('[data-hero-carousel] img').evaluateAll(images => Promise.all(images.map(image => { image.loading = 'eager'; return image.decode(); })));
};
const step = async (page, direction = 1) => {
  const before = await index(page);
  await page.locator('[data-hero-carousel]').press(direction > 0 ? 'ArrowRight' : 'ArrowLeft');
  await page.waitForFunction(next => document.querySelector('[data-hero-carousel]').dataset.heroIndex === String(next), (before + direction + slideCount) % slideCount);
  await settled(page);
};
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  monitor(page);
  await page.goto(base);
  await ready(page);
  assert.equal(await page.locator('[data-hero-carousel]').count(), 1, 'Beranda memiliki carousel hero.');
  assert.equal(await page.locator('[data-hero-slide]').count(), slideCount);
  assert.equal(await page.locator('[data-hero-carousel] button').count(), 0, 'Hero tidak memakai tombol arah atau pause.');
  const motion = await page.evaluate(() => new Promise(resolve => {
    const root = document.querySelector('[data-hero-carousel]'), viewport = root.querySelector('.hero-carousel-viewport');
    const frames = [], height = root.getBoundingClientRect().height;
    const quick = document.querySelector('[data-quick-access]').getBoundingClientRect().top;
    root.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    const sample = time => {
      const bounds = viewport.getBoundingClientRect();
      frames.push({ time, height: root.getBoundingClientRect().height, quick: document.querySelector('[data-quick-access]').getBoundingClientRect().top, left: bounds.left + 1, right: bounds.right - 1,
        panels: [...root.querySelectorAll('[data-hero-slide]')].filter(el => getComputedStyle(el).visibility === 'visible').map(el => ({ x: el.getBoundingClientRect().left, right: el.getBoundingClientRect().right, opacity: getComputedStyle(el).opacity })) });
      if (root.dataset.heroIndex === '1' && root.dataset.heroMoving === 'false') resolve({ frames, height, quick });
      else requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  }));
  await writeFile(`${output}/motion-frames.json`, JSON.stringify(motion, null, 2));
  assert.ok(motion.frames.some(frame => frame.panels.length === 2 && frame.panels[0].x < frame.left - 20 && frame.panels[1].x > frame.left + 20), 'Kedua slide bergerak horizontal bersamaan.');
  for (const frame of motion.frames) {
    assert.ok(Math.abs(frame.height - motion.height) < 0.5 && Math.abs(frame.quick - motion.quick) < 0.5, 'Hero dan kartu akses cepat tidak bergeser.');
    const intervals = frame.panels.filter(panel => panel.right > frame.left && panel.x < frame.right).sort((a, b) => a.x - b.x);
    assert.ok(intervals.length && intervals[0].x <= frame.left + 1 && intervals.at(-1).right >= frame.right - 1, 'Viewport selalu terisi.');
    if (intervals.length === 2) assert.ok(intervals[1].x - intervals[0].right < 1.5, 'Tidak ada celah di antara slide.');
    assert.ok(frame.panels.every(panel => panel.opacity === '1'), 'Gerak utama bukan crossfade.');
  }
  const intervals = motion.frames.slice(1).map((frame, i) => frame.time - motion.frames[i].time);
  results.push({ motion: { frames: motion.frames.length, averageFps: Number((1000 / (intervals.reduce((sum, value) => sum + value, 0) / intervals.length)).toFixed(1)), medianFrameMs: intervals.sort((a, b) => a - b)[Math.floor(intervals.length / 2)] } });
  console.log('PASS horizontal sliding, coverage setiap frame, tinggi hero/QAC stabil, transform-only');
  for (const direction of [1, -1]) {
    const start = await index(page);
    for (let i = 0; i < slideCount * 2; i++) await step(page, direction);
    assert.equal(await index(page), start, 'Dua loop manual kembali ke slide awal.');
  }
  await page.locator('[data-hero-carousel]').evaluate(root => { for (let i = 0; i < 30; i++) root.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })); });
  await settled(page);
  assert.equal(await index(page), 3, 'Input cepat memakai satu transisi dan satu permintaan terakhir.');
  await page.locator('[data-hero-carousel]').evaluate(root => {
    root.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    root.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
  });
  await settled(page);
  assert.equal(await index(page), 3, 'Perubahan arah tidak membuat animasi bertumpuk.');
  console.log('PASS loop keyboard, loop dua arah, input cepat, dan perubahan arah');
  await page.clock.install();
  await page.evaluate(() => document.activeElement.blur());
  const beforeReset = await index(page);
  await page.clock.runFor(6100);
  assert.equal(await index(page), beforeReset, 'Timer di-reset setelah interaksi manual.');
  await page.clock.runFor(1300);
  await settled(page);
  assert.equal(await index(page), (beforeReset + 1) % slideCount);
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new window.Event('visibilitychange')); });
  const hidden = await index(page);
  await page.clock.runFor(21000);
  assert.equal(await index(page), hidden, 'Visibility handler menghentikan timer tab tersembunyi.');
  await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new window.Event('visibilitychange')); });
  await page.clock.runFor(7500);
  await settled(page);
  assert.equal(await index(page), (hidden + 1) % slideCount);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const reduced = await index(page);
  await page.clock.runFor(21000);
  assert.equal(await index(page), reduced, 'Reduced motion tidak memutar otomatis.');
  await step(page);
  assert.equal(await page.locator('[data-hero-slide][data-active="true"]').evaluate(el => getComputedStyle(el).transform), 'none');
  console.log('PASS reset/resume timer, visibilitychange tersimulasi, dan reduced motion (clock dipercepat)');
  await page.close();

  // Recorded before the carousel: these are the existing ID hero dimensions, not a generated fixture.
  const baseline = [{ width: 1216, height: 464 }, { width: 1216, height: 464 }, { width: 960, height: 544 }, { width: 720, height: 739.1875 }, { width: 358, height: 623.09375 }, { width: 288, height: 668.25 }];
  for (const [position, width] of [1920, 1440, 1024, 768, 390, 320].entries()) for (const language of ['id', 'en']) {
    const page = await browser.newPage({ viewport: { width, height: 1100 }, reducedMotion: 'reduce' });
    monitor(page);
    await page.addInitScript(language => sessionStorage.setItem('smk-telkom-language', language), language);
    await page.goto(base);
    await ready(page);
    const root = page.locator('[data-hero-carousel]'), geometry = await root.boundingBox();
    assert.equal(geometry.width, baseline[position].width, 'Lebar container existing dipertahankan.');
    if (language === 'id') assert.equal(geometry.height, baseline[position].height, 'Tinggi container existing dipertahankan.');
    for (let slide = 0; slide < slideCount; slide++) {
      const active = page.locator('[data-hero-slide][data-active="true"]');
      assert.equal(await index(page), slide);
      assert.equal(await page.getByRole('heading', { level: 1 }).count(), 1, 'Hanya heading slide aktif dibaca pembaca layar.');
      assert.equal(await active.locator('a').first().getAttribute('href'), paths[slide]);
      assert.equal(await root.locator('[inert]').count(), slideCount - 1, 'Slide tersembunyi tidak dapat menerima fokus.');
      const bounds = await root.boundingBox();
      assert.equal(bounds.height, geometry.height, 'Pergantian slide tidak mengubah layout.');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), 0);
      assert.equal(await root.locator('button').count(), 0);
      assert.ok(await active.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)));
      assert.ok(await active.locator('.hero-copy').evaluate(el => el.scrollWidth <= el.clientWidth + 1), 'Teks tidak overflow.');
      assert.ok(await active.locator('a').evaluateAll(links => links.every(link => {
        const bounds = link.getBoundingClientRect(), panel = link.closest('.hero-panel').getBoundingClientRect(), quick = document.querySelector('[data-quick-access]').getBoundingClientRect();
        return bounds.left >= panel.left && bounds.right <= panel.right + 1 && bounds.bottom < quick.top;
      })), 'CTA tidak terpotong atau tertutup kartu akses cepat.');
      if ([1440, 1024, 390].includes(width)) await root.screenshot({ path: `${output}/${width}-${language}-${slide}.png` });
      if (slide < slideCount - 1) await step(page);
    }
    results.push({ width, language, height: geometry.height, slides: slideCount });
    console.log(`PASS responsive ${width}px ${language.toUpperCase()}, seluruh slide navbar, CTA, dan layout`);
    await page.close();
  }

  const navigation = await browser.newPage({ viewport: { width: 1440, height: 1100 }, reducedMotion: 'reduce' });
  monitor(navigation);
  for (let slide = 0; slide < slideCount; slide++) {
    await navigation.goto(base);
    await ready(navigation);
    for (let i = 0; i < slide; i++) await step(navigation);
    await navigation.locator('[data-hero-slide][data-active="true"] a').first().click();
    await navigation.waitForURL(`**${paths[slide]}`);
    await navigation.getByRole('heading', { level: 1 }).waitFor();
  }
  await navigation.goto(`${base}/spmb`);
  await navigation.locator('[data-hero-slide][data-active="true"] .hero-panel').waitFor();
  assert.equal(await navigation.locator('[data-hero-carousel]').count(), 1, 'Hero SPMB memakai animasi bersama.');
  await navigation.close();
  console.log('PASS seluruh CTA navbar benar-benar membuka route dan hero SPMB memakai carousel bersama');

  const autoplay = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  monitor(autoplay);
  await autoplay.goto(base);
  await ready(autoplay);
  await autoplay.mouse.move(0, 0);
  const autoplayHeight = (await autoplay.locator('[data-hero-carousel]').boundingBox()).height;
  const started = Date.now();
  for (let transition = 1; transition <= slideCount * 3; transition++) {
    const before = await index(autoplay);
    await autoplay.waitForFunction(before => Number(document.querySelector('[data-hero-carousel]').dataset.heroIndex) !== before, before, { timeout: 11000 });
    assert.equal(await index(autoplay), transition % slideCount);
    await settled(autoplay);
    assert.equal((await autoplay.locator('[data-hero-carousel]').boundingBox()).height, autoplayHeight);
    console.log(`PASS autoplay nyata ${transition}/${slideCount * 3}: slide ${(transition % slideCount) + 1}`);
  }
  results.push({ autoplay: { realTransitions: slideCount * 3, completeCycles: 3, elapsedSeconds: Number(((Date.now() - started) / 1000).toFixed(1)) } });
  await autoplay.locator('[data-hero-carousel]').press('ArrowRight');
  await autoplay.goto(`${base}/profil-sekolah`);
  await autoplay.getByRole('heading', { level: 1 }).waitFor();
  await autoplay.close();
  assert.deepEqual(errors, []);
  await writeFile(`${output}/results.json`, JSON.stringify(results, null, 2));
  console.log('PASS semua pemeriksaan hero, unmount saat animasi, dan runtime.');
} finally { await browser.close(); }
