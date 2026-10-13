/* global document */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.QA_URL || 'http://127.0.0.1:4173';
const output = process.env.QA_OUTPUT || join(tmpdir(), 'floating-hero-qa');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage();
const results = [], errors = [];
page.on('pageerror', error => errors.push(error.message));
await page.route('**/rest/v1/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
try {
  for (const path of ['/jurusan', '/prestasi', '/bkk', '/pengumuman', '/']) {
    for (const width of [1920, 1440, 1280, 1024, 768, 375, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(base + path);
      const hero = page.locator('#main-content > section').first();
      await hero.locator('h1').waitFor();
      await hero.locator('img').evaluateAll(imgs => Promise.all(imgs.map(img => img.decode())));
      await page.evaluate(() => document.fonts.ready);
      for (const language of ['id', 'en']) {
        if (await page.locator('html').getAttribute('lang') !== language) {
          await page.locator('header').getByRole('button', { name: language === 'id' ? 'Switch to Indonesian' : 'Switch to English', exact: true }).click();
          await page.waitForFunction(lang => document.documentElement.lang === lang, language);
        }
        await page.evaluate(() => Promise.all(document.querySelector('#main-content').getAnimations().map(animation => animation.finished.catch(() => {}))));
        const geometry = await hero.evaluate(section => {
          const panel = section.querySelector('.hero-panel');
          const bar = section.querySelector('.hero-floating');
          const rect = el => { const r = el.getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height }; };
          const p = rect(panel), b = rect(bar);
          return {
            panel: p, bar: b, barCount: section.querySelectorAll('.hero-floating').length,
            overlap: p.bottom - b.top,
            centerOffset: Math.abs((p.left + p.right - b.left - b.right) / 2),
            sectionBottom: rect(section).bottom,
            ctaBottom: Math.max(...Array.from(panel.querySelectorAll('a'), link => rect(link).bottom)),
            children: Array.from(bar.firstElementChild.children, rect),
            overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
            inPanel: panel.contains(bar),
            nextTop: section.nextElementSibling.getBoundingClientRect().top,
          };
        });
        assert.equal(geometry.barCount, 1);
        assert.equal(geometry.inPanel, false, `${path}: cards must be outside the hero panel`);
        assert(geometry.bar.top < geometry.panel.bottom && geometry.bar.bottom > geometry.panel.bottom, `${path}: cards must straddle the hero border`);
        assert(geometry.centerOffset < 1, `${path}: cards must be centered`);
        assert.equal(Math.round(geometry.overlap), 40);
        assert(geometry.bar.left >= 0 && geometry.bar.right <= width);
        assert(geometry.ctaBottom < geometry.bar.top, `${path}: hero CTA must remain uncovered`);
        assert(geometry.sectionBottom >= geometry.bar.bottom && geometry.nextTop >= geometry.bar.bottom, `${path}: next section must follow cards`);
        assert.equal(geometry.overflow, false);
        if (width >= 1024) assert(geometry.children.every(child => Math.abs(child.top - geometry.children[0].top) < 1), `${path}: cards must align`);
        if (language === 'id' && [1440, 768, 375].includes(width)) {
          await hero.screenshot({ path: join(output, `${path.slice(1) || 'beranda'}-${width}.png`), animations: 'disabled' });
        }
        results.push({ path, width, language, geometry });
      }
    }
  }
  assert.deepEqual(errors, []);
  console.log(`PASS ${results.length} route/viewport/language checks: floating, centered, aligned, no CTA collision, clipping or overflow.`);
} finally {
  await writeFile(join(output, 'results.json'), JSON.stringify({ results, errors }, null, 2));
  await browser.close();
}
