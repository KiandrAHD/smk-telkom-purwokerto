/* global document, window */
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const out = process.env.QA_OUTPUT || 'outputs/hero-pills'; await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ reducedMotion: 'reduce', viewport: { width: 1440, height: 1000 } });
const errors = []; page.on('pageerror', error => errors.push(error.message));
await page.route('**/api/**', route => route.fulfill({ contentType: 'application/json', body: '[]' }));
const base = process.env.QA_URL || 'http://127.0.0.1:5173';
const hero = page.locator('[data-hero-carousel]').first(), nav = page.locator('.hero-carousel-navigation');
const selected = index => page.waitForFunction(index => document.querySelector('[data-hero-carousel]').dataset.heroIndex === String(index), index);
try {
  await page.goto(base); await nav.waitFor(); assert.equal(await nav.count(), 1);
  const count = await nav.locator('button').count(); assert.ok(count > 2);
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const lang of ['id', 'en']) {
      if (await page.locator('html').getAttribute('lang') !== lang) await page.getByRole('button', { name: /^Switch to / }).first().click();
      for (let i = 0; i < count; i++) {
        await nav.locator('button').nth(i).click(); await selected(i);
        assert.equal(await nav.locator('[aria-pressed="true"]').count(), 1);
        const geometry = await hero.evaluate(root => {
          const nav = root.querySelector('.hero-carousel-navigation').getBoundingClientRect();
          const panel = root.querySelector('.hero-carousel-viewport').getBoundingClientRect();
          const cta = root.querySelector('[data-active="true"] .hero-copy > div:last-child').getBoundingClientRect();
          const cards = root.nextElementSibling.getBoundingClientRect();
          return { nav: nav.toJSON(), panel: panel.toJSON(), cta: cta.toJSON(), cards: cards.toJSON(), overflow: document.documentElement.scrollWidth > window.innerWidth };
        });
        assert.equal(geometry.overflow, false);
        assert.ok(geometry.nav.bottom <= geometry.cards.top + .5, 'Navigation stays above service cards');
        if (width >= 1024) assert.ok(geometry.nav.top >= geometry.cta.bottom + 8, `CTA overlap ${width} ${lang} ${i}: ${JSON.stringify(geometry)}`);
        else assert.ok(geometry.nav.top >= geometry.panel.bottom, 'Mobile navigation is below photo');
      }
      await nav.locator('button').first().click(); await selected(0);
      await hero.screenshot({ path: `${out}/${width}-${lang}.png` });
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await nav.locator('button').first().focus(); await page.keyboard.press('End'); await selected(count - 1);
  await page.keyboard.press('ArrowRight'); await selected(0);
  await page.keyboard.press('ArrowLeft'); await selected(count - 1);
  await page.keyboard.press('Home'); await selected(0);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await nav.locator('button').first().evaluate(node => node.blur()); await nav.hover();
  await page.waitForTimeout(7000); assert.equal(await hero.getAttribute('data-hero-index'), '0', 'Hover pauses autoplay');
  await page.mouse.move(5, 5); await selected(1);
  await nav.locator('button').nth(1).focus(); await page.waitForTimeout(7000);
  assert.equal(await hero.getAttribute('data-hero-index'), '1', 'Keyboard focus pauses autoplay');
  await nav.locator('button').nth(3).click(); await nav.locator('button').nth(8).click(); await selected(8);
  await page.goto(base + '/fasilitas'); assert.equal(await nav.count(), 0, 'Other page carousels retain their UI');
  assert.deepEqual(errors, []);
  console.log('PASS all pills in ID/EN at five widths, layout, keyboard wrap/Home/End, autoplay pause/resume, queued selection and page scope');
} finally { await browser.close(); }
