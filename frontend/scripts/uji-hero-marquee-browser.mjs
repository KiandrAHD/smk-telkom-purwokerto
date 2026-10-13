/* global document, getComputedStyle, requestAnimationFrame */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import sharp from 'sharp';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.QA_URL || 'http://127.0.0.1:4173';
const output = process.env.QA_OUTPUT || join(tmpdir(), 'hero-marquee-qa');
const routes = ['/', '/jurusan', '/profil-sekolah', '/profil-sekolah/guru', '/fasilitas', '/ekstrakurikuler', '/prestasi', '/bkk', '/berita', '/pengumuman', '/spmb', '/kalender'];
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ reducedMotion: 'no-preference' });
// Isolate marquee/layout checks from asynchronous content and live database writes.
await context.route('**/rest/v1/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
const page = await context.newPage(), errors = [], results = [];
page.on('pageerror', error => errors.push(error.message));
const slug = route => route === '/' ? 'beranda' : route.slice(1).replaceAll('/', '-');
try {
  for (const width of [1440, 768, 375, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of routes) {
      await page.goto(base + route); await page.locator('.school-hero').waitFor(); await page.locator('[data-hero-marquee]').waitFor();
      await page.evaluate(() => document.fonts.ready);
      await page.locator('[data-hero-marquee]').scrollIntoViewIfNeeded();
      assert.equal(await page.locator('[data-hero-marquee]').count(), 1, `${route} has one marquee`);
      assert.equal(await page.locator('img[src*="ribbon-divider.png"]').count(), 0, `${route} has no old raster divider`);
      await page.waitForFunction(() => [...document.querySelectorAll('.beranda-ribbon-flower img')].every(img => img.complete && img.naturalWidth));
      const layout = await page.evaluate(() => {
        const marquee = document.querySelector('[data-hero-marquee]'), hero = document.querySelector('.school-hero');
        const previous = marquee.previousElementSibling, m = marquee.getBoundingClientRect();
        const floatBottom = Math.max(...[...document.querySelectorAll('.hero-floating')].map(el => el.getBoundingClientRect().bottom), hero.getBoundingClientRect().bottom);
        const groups = [...marquee.querySelectorAll('.beranda-ribbon-group')], track = marquee.querySelector('.beranda-ribbon-track');
        const pills = [...marquee.querySelectorAll('.beranda-ribbon-badge')];
        return {
          followsHero: previous === hero || Boolean(previous?.querySelector('.hero-stats-section')),
          overlap: m.top < floatBottom - 1,
          nextOverlap: marquee.nextElementSibling?.getBoundingClientRect().top < m.bottom - 1,
          overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          duration: getComputedStyle(track).animationDuration, easing: getComputedStyle(track).animationTimingFunction,
          groupWidths: groups.map(el => el.getBoundingClientRect().width), equalContent: groups[0].innerHTML === groups[1].innerHTML,
          coverage: groups[0].getBoundingClientRect().width >= m.width,
          pillHeights: [...new Set(pills.map(el => Math.round(el.getBoundingClientRect().height)))],
          textClipped: pills.some(el => el.scrollWidth > el.clientWidth),
          flowers: marquee.querySelectorAll('.beranda-ribbon-flower').length,
          petalsPerFlower: [...marquee.querySelectorAll('.beranda-ribbon-flower')].every(el => el.children.length === 4),
          accessibleLabels: marquee.querySelector('ul').children.length, hiddenTrack: track.getAttribute('aria-hidden'),
        };
      });
      assert.equal(layout.followsHero, true, `${route} marquee immediately follows Hero/floating area`);
      assert.equal(layout.overlap, false, `${route} hero overlap`); assert.equal(layout.nextOverlap, false, `${route} next-section overlap`);
      assert.equal(layout.overflow, false, `${route}/${width} overflow`);
      assert.equal(layout.duration, '160s'); assert.equal(layout.easing, 'linear');
      assert.equal(layout.equalContent, true); assert.equal(layout.coverage, true); assert(Math.abs(layout.groupWidths[0] - layout.groupWidths[1]) < 1, 'Group geometry differs by less than one device pixel');
      assert.equal(layout.pillHeights.length, 1); assert.equal(layout.textClipped, false); assert.equal(layout.petalsPerFlower, true);
      assert.equal(layout.accessibleLabels, 4); assert.equal(layout.hiddenTrack, 'true');
      const animation = await page.locator('.beranda-ribbon-track').evaluate(el => { const a = el.getAnimations()[0]; a.pause(); a.currentTime = 0; return { duration: a.effect.getTiming().duration }; });
      assert.equal(animation.duration, 160000);
      await page.locator('[data-hero-marquee]').screenshot({ path: join(output, `${slug(route)}-${width}.png`) });
      results.push({ route, width, ...layout });
    }
  }
  // Sample a full cycle, including the frame immediately before/after wrapping.
  await page.setViewportSize({ width: 3840, height: 1400 }); await page.goto(base + '/spmb'); await page.locator('[data-hero-marquee]').waitFor(); await page.evaluate(() => document.fonts.ready);
  const animationCheck = await page.locator('.beranda-ribbon-track').evaluate(async track => {
    const animation = track.getAnimations()[0]; animation.pause(); const duration = animation.effect.getTiming().duration;
    const points = [];
    for (const progress of [0, .25, .5, .75, .999999, 1]) {
      animation.currentTime = progress * duration;
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const rect = track.getBoundingClientRect(), viewport = track.parentElement.getBoundingClientRect();
      const flower = [...track.querySelectorAll('.beranda-ribbon-flower')].find(el => { const r = el.getBoundingClientRect(); return r.left >= viewport.left && r.right <= viewport.right; });
      points.push({ progress, covers: rect.left <= viewport.left + 1 && rect.right >= viewport.right - 1, flowerInside: flower.getBoundingClientRect().top >= viewport.top && flower.getBoundingClientRect().bottom <= viewport.bottom });
    }
    return { points, groupWidth: track.firstElementChild.getBoundingClientRect().width, firstPillAtStart: track.firstElementChild.firstElementChild.getBoundingClientRect().left, viewportWidth: track.parentElement.clientWidth };
  });
  assert(animationCheck.groupWidth >= animationCheck.viewportWidth); assert(animationCheck.points.every(point => point.covers && point.flowerInside)); results.push({ animationCheck });
  const seamImages = [];
  for (const fraction of [.999999, 1]) {
    await page.locator('.beranda-ribbon-track').evaluate((track, progress) => { const a = track.getAnimations()[0]; a.currentTime = a.effect.getTiming().duration * progress; }, fraction);
    seamImages.push(await page.locator('[data-hero-marquee]').screenshot({ path: join(output, `seam-${fraction}.png`) }));
  }
  const before = await sharp(seamImages[0]).raw().toBuffer({ resolveWithObject: true }), after = await sharp(seamImages[1]).raw().toBuffer({ resolveWithObject: true });
  assert.deepEqual(before.info, after.info);
  let difference = 0; for (let index = 0; index < before.data.length; index++) difference += Math.abs(before.data[index] - after.data[index]);
  const averagePixelDifference = difference / before.data.length;
  assert(averagePixelDifference < 2, `Loop seam changes ${averagePixelDifference} intensity levels per channel`); results.push({ averagePixelDifference });
  // Reduced motion shows each slogan once, including those normally outside the viewport.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [1440, 768, 375, 320]) {
    await page.setViewportSize({ width, height: 1000 }); await page.goto(base + '/kalender'); await page.locator('[data-hero-marquee]').waitFor();
    const reduced = await page.locator('[data-hero-marquee]').evaluate(el => {
      const pills = [...el.querySelectorAll('.beranda-ribbon-badge')].filter(item => item.getClientRects().length);
      const box = el.getBoundingClientRect();
      return { animation: getComputedStyle(el.querySelector('.beranda-ribbon-track')).animationName, count: pills.length,
        clipped: pills.some(item => { const b = item.getBoundingClientRect(); return item.scrollWidth > item.clientWidth || b.left < box.left || b.right > box.right; }) };
    });
    assert.deepEqual(reduced, { animation: 'none', count: 4, clipped: false });
    await page.locator('[data-hero-marquee]').screenshot({ path: join(output, `reduced-${width}.png`) }); results.push({ width, reduced });
  }
  await page.getByRole('button', { name: 'Switch to English', exact: true }).click(); assert.equal(await page.locator('[data-hero-marquee] ul li').count(), 4);
  for (const route of ['/spmb/masuk', '/dashboard', '/kebijakan-privasi', '/jurusan/rpl', '/nexttel']) {
    await page.goto(base + route); await page.getByRole('heading', { level: 1 }).first().waitFor(); assert.equal(await page.locator('[data-hero-marquee]').count(), 0, `${route} is excluded`);
  }
  assert.deepEqual(errors, []);
  console.log('PASS 12 public heroes × 4 viewports: one marquee, placement/floating gaps, uniform pills/petals, identical groups, no overflow/clipping; 4K cycle coverage; reduced-motion full labels; excluded portal/dashboard/detail/utility routes.');
} finally { await writeFile(join(output, 'results.json'), JSON.stringify({ results, errors }, null, 2)); await context.close(); await browser.close(); }
