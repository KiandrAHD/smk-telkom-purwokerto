/* global document, window, getComputedStyle */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';

const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.QA_URL || 'http://127.0.0.1:4174';
const output = process.env.QA_OUTPUT || '../outputs/detail-jurusan';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const programs = ['rpl', 'pg', 'tkj', 'tjat'];
const facilityAssets = {
  rpl: ['rpl-lab', 'library', 'rpl-class'],
  pg: ['pg-lab', 'pg-dlg', 'pg-studio'],
  tkj: ['tkj-lab', 'rpl-lab', 'tkj-class'],
  tjat: ['tjat-lab', 'library', 'tjat-class'],
};
const errors = [];
const failedAssets = [];
const report = { routing: [], responsive: [], motion: {}, errors, failedAssets };

async function settle(page) {
  await page.locator('h1').waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1500);
}

async function revealAll(page) {
  // Scroll each section into view before taking a full-page capture of Reveal content.
  for (const section of await page.locator('main > section, .detail-jurusan-content > section').all()) {
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(350);
  }
  for (const card of await page.locator('[data-department-facility], [data-learning-year]').all()) {
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(1200);
}

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => {
    if (response.status() >= 400 && /\/assets\//.test(response.url())) failedAssets.push({ url: response.url(), status: response.status() });
  });
  await page.goto(`${base}/jurusan`);
  await settle(page);
  const links = page.locator('#daftar-jurusan a');
  assert.deepEqual(await links.evaluateAll(nodes => nodes.map(node => node.getAttribute('href'))), programs.map(slug => `/jurusan/${slug}`));
  for (const slug of programs) {
    await page.evaluate(() => { window.__departmentNavigation = true; });
    const link = page.locator(`#daftar-jurusan a[href="/jurusan/${slug}"]`);
    await link.scrollIntoViewIfNeeded();
    await link.click();
    await page.waitForURL(`${base}/jurusan/${slug}`);
    await settle(page);
    assert.equal(await page.evaluate(() => window.__departmentNavigation), true, 'Navigation must use the existing client router.');
    assert.equal(await page.evaluate(() => window.scrollY), 0, 'Detail navigation must start at the top.');
    assert.match(await page.locator('h1').innerText(), new RegExp(`\\(${slug.toUpperCase()}\\)`));
    await page.goBack();
    await page.waitForURL(`${base}/jurusan`);
    await page.goForward();
    await page.waitForURL(`${base}/jurusan/${slug}`);
    await settle(page);
    await page.reload();
    await settle(page);
    assert.match(await page.locator('h1').innerText(), new RegExp(`\\(${slug.toUpperCase()}\\)`));
    assert.equal(await page.locator('[data-department-facility]').count(), 3);
    const sources = await page.locator('[data-department-facility] img').evaluateAll(nodes => nodes.map(node => node.src.split('/').pop()));
    sources.forEach((source, index) => assert.ok(source.startsWith(facilityAssets[slug][index] + '-'), `${slug}: incorrect facility photo at position ${index}`));
    assert.deepEqual(await page.locator('[data-learning-year]').evaluateAll(nodes => nodes.map(node => node.dataset.learningYear)), ['Kelas X', 'Kelas XI', 'Kelas XII']);
    assert.equal(await page.locator('footer').count(), 1);
    assert.equal(await page.locator('#stela').count(), 1);
    assert.equal(await page.locator('#ppdb').count(), 1);
    assert.equal(await page.locator('.hero-copy a[href="/spmb"]').count(), 1);
    await page.locator('.hero-copy a[href="#fasilitas-jurusan"]').click();
    await page.waitForTimeout(1200);
    assert.equal(new URL(page.url()).hash, '#fasilitas-jurusan');
    const facilityPosition = await page.locator('#fasilitas-jurusan').boundingBox();
    assert.ok(facilityPosition.y >= 0 && facilityPosition.y < 150, `Facilities anchor must clear the navbar: ${facilityPosition.y}`);
    assert.equal(await page.locator('#stela a[href="/stela"]').count(), 1);
    assert.equal(await page.locator('#ppdb a').getAttribute('href'), '/spmb');
    await page.locator('#stela a[href="/stela"]').click();
    await page.waitForURL(`${base}/stela`);
    await page.goto(`${base}/jurusan/${slug}`);
    await settle(page);
    await page.locator('#ppdb a').scrollIntoViewIfNeeded();
    await page.locator('#ppdb a').click();
    await page.waitForURL(`${base}/spmb`);
    report.routing.push({ slug, card: 'pass', directAndRefresh: 'pass', backForward: 'pass', anchor: 'pass', sharedSections: 'pass' });
    await page.goto(`${base}/jurusan`);
    await settle(page);
  }
  for (const width of [1847, 1440, 1280, 1024, 768, 390, 360]) {
    await page.setViewportSize({ width, height: 900 });
    for (const slug of programs) {
      await page.goto(`${base}/jurusan/${slug}`);
      await settle(page);
      await revealAll(page);
      const layout = await page.evaluate(() => {
        const hero = document.querySelector('.hero-panel');
        const copy = document.querySelector('.hero-copy').getBoundingClientRect();
        const photo = document.querySelector('.detail-hero-photo');
        const heading = document.querySelector('h1');
        const root = getComputedStyle(document.documentElement);
        const normalize = value => value.replace(/['"]/g, '').trim();
        return {
          overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          copyOverflow: document.querySelector('.hero-copy').scrollWidth > copy.width + 1,
          heroHeight: hero.getBoundingClientRect().height,
          focalPoint: getComputedStyle(photo).objectPosition,
          fit: getComputedStyle(photo).objectFit,
          headingFont: normalize(getComputedStyle(heading).fontFamily),
          tokenFont: normalize(root.getPropertyValue('--font-heading')),
          brokenImages: [...document.querySelectorAll('main img')].filter(image => !image.complete || image.naturalWidth === 0).map(image => image.src),
          lazyFacilities: [...document.querySelectorAll('[data-department-facility] img')].every(image => image.loading === 'lazy'),
          hiddenContent: [...document.querySelectorAll('.reveal')].filter(node => getComputedStyle(node).opacity !== '1').length,
        };
      });
      assert.equal(layout.overflow, false, `${slug}/${width}: horizontal overflow`);
      assert.equal(layout.copyOverflow, false, `${slug}/${width}: copy overflow`);
      assert.equal(layout.fit, 'contain', `${slug}/${width}: preserve the complete source photograph`);
      assert.deepEqual(layout.brokenImages, [], `${slug}/${width}: unloaded or broken image`);
      assert.equal(layout.hiddenContent, 0, `${slug}/${width}: section still hidden after scroll`);
      assert.equal(layout.lazyFacilities, true);
      assert.equal(layout.headingFont, layout.tokenFont);
      await page.screenshot({ path: `${output}/${slug}-${width}.png`, fullPage: true });
      report.responsive.push({ slug, width, ...layout });
    }
    console.log(`Responsive ${width}px: 4 programs passed.`);
  }
  await page.setViewportSize({ width: 1280, height: 900 });
  const startTransform = await page.locator('.beranda-ribbon-track').evaluate(node => getComputedStyle(node).transform);
  await page.waitForTimeout(250);
  const endTransform = await page.locator('.beranda-ribbon-track').evaluate(node => getComputedStyle(node).transform);
  assert.notEqual(startTransform, endTransform, 'The shared marquee must animate.');
  const marqueeWidths = await page.locator('.beranda-ribbon-group').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().width));
  assert.ok(Math.abs(marqueeWidths[0] - marqueeWidths[1]) < 0.5, 'Marquee halves match within browser subpixel rounding.');
  report.motion.marquee = 'matching halves and moving transform';
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await settle(page);
  assert.equal(await page.locator('.beranda-ribbon-track').evaluate(node => getComputedStyle(node).animationName), 'none');
  assert.equal(await page.locator('.hero-copy .reveal').first().evaluate(node => getComputedStyle(node).transform), 'none');
  report.motion.reducedMotion = 'pass';
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.evaluate(() => sessionStorage.setItem('smk-telkom-language', 'en'));
  for (const slug of programs) {
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${base}/jurusan/${slug}`);
      await settle(page);
      await revealAll(page);
      assert.match(await page.locator('#tentang-jurusan-title').innerText(), /What is/);
      assert.equal(await page.locator('#fasilitas-jurusan-title').innerText(), 'Supporting Facilities');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth), false);
      assert.doesNotMatch(await page.locator('main').innerText(), /Selama tiga tahun|Kami menyediakan|Membentuk karakter|Dasar pemrograman/);
      await page.screenshot({ path: `${output}/${slug}-en-${width}.png`, fullPage: true });
    }
  }
  await page.goto(`${base}/jurusan/tidak-ada`);
  await settle(page);
  assert.match(await page.locator('h1').innerText(), /404/);
  assert.equal(await page.locator('.hero-panel--detail').count(), 0);
  assert.deepEqual(errors, []);
  assert.deepEqual(failedAssets, []);
  await writeFile(`${output}/hasil.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ routing: report.routing, responsiveCases: report.responsive.length, englishCases: 8, motion: report.motion, errors, failedAssets }, null, 2));
} finally {
  await browser.close();
}
