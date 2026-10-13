/* global document, getComputedStyle */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.QA_URL || 'http://127.0.0.1:4173';
const output = process.env.QA_OUTPUT || join(tmpdir(), 'hero-consistency-qa');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ reducedMotion: 'reduce' });
const results = [], errors = [];
page.on('pageerror', error => errors.push(error.message));
await page.route('**/rest/v1/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
const paths = ['/', '/jurusan', '/prestasi', '/bkk', '/pengumuman', '/berita', '/profil-sekolah', '/profil-sekolah/guru', '/ekstrakurikuler', '/fasilitas', '/kalender'];
try {
  for (const path of paths) {
    for (const width of [1920, 1440, 1280, 1024, 768, 375, 320]) {
      await page.setViewportSize({ width, height: 1100 });
      await page.goto(base + path);
      const panel = page.locator('.hero-panel');
      await panel.waitFor();
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(() => Promise.all(document.querySelector('main').getAnimations().map(animation => animation.finished.catch(() => {}))));
      await panel.locator('img').evaluateAll(imgs => Promise.all(imgs.map(img => img.decode())));
      for (const language of ['id', 'en']) {
        if (await page.locator('html').getAttribute('lang') !== language) {
          await page.locator('header').getByRole('button', { name: language === 'id' ? 'Switch to Indonesian' : 'Switch to English', exact: true }).click();
          await page.waitForFunction(lang => document.documentElement.lang === lang, language);
        }
        const geometry = await panel.evaluate(panel => {
          const rect = el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom }; };
          const p = rect(panel), copy = panel.querySelector('.hero-copy'), bar = document.querySelector('.hero-floating');
          const controls = Array.from(copy.querySelectorAll('a, input'), rect);
          const media = panel.querySelector('.hero-image, .hero-background, .hero-calendar-art');
          return {
            panel: p, media: media ? rect(media) : null,
            radius: getComputedStyle(panel).borderTopLeftRadius, border: getComputedStyle(panel).borderTopWidth,
            borderColor: getComputedStyle(panel).borderTopColor,
            navbarGap: p.y - document.querySelector('header').getBoundingClientRect().bottom,
            copy: rect(copy), controls,
            bar: bar ? rect(bar) : null,
            overlap: bar ? p.bottom - rect(bar).y : null,
            centerOffset: bar ? Math.abs(p.x + p.width / 2 - (rect(bar).x + rect(bar).width / 2)) : null,
            barInside: bar ? panel.contains(bar) : false,
            cardContentFits: !bar || Array.from(bar.firstElementChild.children).every(card => Array.from(card.querySelectorAll('p, a')).every(text => rect(text).right <= rect(card).right + 1 && text.scrollWidth <= text.clientWidth + 1)),
            panelOverflow: panel.scrollWidth > panel.clientWidth,
            overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
            brokenImages: Array.from(panel.querySelectorAll('img')).filter(img => !img.complete || !img.naturalWidth).length,
          };
        });
        assert.equal(geometry.panel.width, Math.min(width, 1280) - (width >= 1024 ? 64 : width >= 640 ? 48 : 32), `${path}: container width`);
        assert.equal(geometry.radius, '32px', `${path}: radius`);
        assert.equal(geometry.border, '1px');
        assert(Math.abs(geometry.navbarGap - 16) < 1, `${path}: navbar gap ${geometry.navbarGap}`);
        assert.equal(geometry.overflow, false, `${path}/${width}/${language}: overflow`);
        assert.equal(geometry.panelOverflow, false, `${path}: panel overflow`);
        assert.equal(geometry.brokenImages, 0, `${path}: image loading`);
        assert(geometry.controls.every(c => c.x >= geometry.panel.x && c.right <= geometry.panel.right + 1 && c.bottom <= geometry.panel.bottom), `${path}/${width}/${language}: control clipping`);
        if (width >= 1024) assert.equal(geometry.panel.height, width >= 1280 ? 464 : 544, `${path}/${width}/${language}: desktop height`);
        if (geometry.bar) {
          assert.equal(geometry.barInside, false);
          assert(geometry.cardContentFits, `${path}/${width}/${language}: card content overflow`);
          assert.equal(Math.round(geometry.overlap), 40, `${path}: overlap`);
          assert(geometry.bar.bottom > geometry.panel.bottom);
          assert(geometry.centerOffset < 1, `${path}: centered cards`);
          assert(geometry.controls.every(c => c.bottom < geometry.bar.y), `${path}/${width}/${language}: CTA/card collision`);
        }
        if (language === 'id' && [1440, 768, 375].includes(width)) {
          await page.locator('.school-hero').screenshot({ path: join(output, `${path.slice(1).replaceAll('/', '-') || 'beranda'}-${width}.png`), animations: 'disabled' });
        }
        results.push({ path, width, language, geometry });
      }
    }
    console.log(`PASS ${path}: 14 viewport/language checks`);
  }
  for (const [path, text] of [['/kalender', 'Contoh desain Figma'], ['/prestasi', 'Rekap situs resmi per'], ['/pengumuman', 'Rekap arsip pengumuman']]) {
    await page.goto(base + path); await page.locator('.hero-panel').waitFor();
    assert.equal(await page.getByText(text, { exact: false }).count(), 0);
  }
  assert.deepEqual(errors, []);
  console.log(`PASS ${results.length} checks: shared dimensions, navbar alignment, floating cards, CTA clearance, responsive images, ID/EN and removed notes.`);
} finally {
  await writeFile(join(output, 'results.json'), JSON.stringify({ results, errors }, null, 2));
  await browser.close();
}
