/* global document */
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:4173';
const output = process.env.QA_OUTPUT || join(tmpdir(), 'smk-teacher-border-qa');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const errors = [];
let pages = 0, cards = 0;
try {
  for (const width of [1920, 1440, 1024, 768, 640, 400, 375, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    page.on('pageerror', error => errors.push(error.message));
    for (const route of ['/profil-sekolah/guru', '/profil-sekolah']) {
      await page.goto(base + route);
      await page.locator('.teacher-card').first().waitFor();
      for (const language of ['id', 'en']) {
        if (await page.locator('html').getAttribute('lang') !== language) await page.locator('header').getByRole('button', { name: /^Switch to / }).click();
        const scopes = route.endsWith('/guru') ? ['#kesiswaan-grid', '#guru-grid'] : ['#guru [data-sliding-page]'];
        for (const selector of scopes) {
          const scope = page.locator(selector);
          const nav = route.endsWith('/guru') ? scope.locator('xpath=ancestor::section').locator('[data-teacher-pagination]') : page.locator('#guru [data-sliding-page]').locator('xpath=..');
          const next = route.endsWith('/guru') ? nav.locator(':scope > button').last() : page.locator('#guru').getByRole('button', { name: language === 'id' ? 'Guru berikutnya' : 'Next teachers', exact: true });
          const previous = route.endsWith('/guru') ? nav.locator(':scope > button').first() : page.locator('#guru').getByRole('button', { name: language === 'id' ? 'Guru sebelumnya' : 'Previous teachers', exact: true });
          if (route.endsWith('/guru')) {
            while (await previous.count() && !await previous.isDisabled()) await previous.click();
          } else if (language === 'en') {
            await page.reload();
            await scope.locator('.teacher-card').first().waitFor();
          }
          let firstNames, height;
          for (let index = 0; index < 60; index++) {
            await scope.locator('.teacher-card img').evaluateAll(images => Promise.all(images.map(image => { image.loading = 'eager'; return image.decode(); })));
            await page.evaluate(() => document.fonts.ready);
            const names = await scope.locator('.teacher-card h3').allTextContents();
            if (index && JSON.stringify(names) === JSON.stringify(firstNames)) break;
            firstNames ||= names;
            const geometry = await scope.locator('.teacher-card').evaluateAll(items => items.map(card => {
              const portrait = card.querySelector('.teacher-card-portrait').getBoundingClientRect();
              const label = card.querySelector('.teacher-card-label').getBoundingClientRect();
              const textFits = [...card.querySelectorAll('.teacher-card-label h3, .teacher-card-label p')].every(text => {
                const box = text.getBoundingClientRect();
                return box.top >= label.top && box.bottom <= label.bottom + 1 && text.scrollWidth <= text.clientWidth + 1;
              });
              return { height: card.getBoundingClientRect().height, portrait: portrait.height, textFits, corners: card.querySelectorAll('.teacher-card-corner').length, labelTop: (label.top - portrait.top) / portrait.height };
            }));
            assert.ok(geometry.every(item => item.corners === 4 && item.textFits && item.labelTop > .5), JSON.stringify({ route, width, language, names, geometry }));
            assert.ok(Math.max(...geometry.map(item => item.portrait)) - Math.min(...geometry.map(item => item.portrait)) < 1);
            height ??= await scope.evaluate(el => el.getBoundingClientRect().height);
            assert.ok(Math.abs(await scope.evaluate(el => el.getBoundingClientRect().height) - height) < 1, JSON.stringify({ message: 'Page height must remain consistent', route, width, language, selector, index, height, current: await scope.evaluate(el => el.getBoundingClientRect().height), names }));
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth), false);
            if (index === 0 && language === 'id') await scope.locator('.teacher-card').first().screenshot({ path: join(output, `${route.endsWith('/guru') ? selector.slice(1) : 'carousel'}-${width}.png`) });
            cards += geometry.length; pages++;
            if (!await next.count() || await next.isDisabled()) break;
            const before = JSON.stringify(names);
            await next.click();
            await page.waitForFunction(({ selector, before }) => JSON.stringify([...document.querySelectorAll(`${selector} .teacher-card h3`)].map(el => el.textContent)) !== before, { selector, before });
          }
        }
      }
      const link = route.endsWith('/guru') ? page.locator('#guru-grid a').first() : page.locator('#guru a[href*="/profil-sekolah/guru/"]').first();
      const href = await link.getAttribute('href');
      await link.click(); await page.waitForURL(base + href);
      assert.doesNotMatch(await page.locator('h1').innerText(), /404|Tidak Ditemukan/);
    }
    await page.close();
  }
  const motionPage = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
  motionPage.on('pageerror', error => errors.push(error.message));
  await motionPage.goto(base + '/profil-sekolah/guru');
  const controls = motionPage.locator('section[aria-labelledby="guru-list-title"] [data-teacher-pagination] > button');
  await controls.last().scrollIntoViewIfNeeded();
  const before = await motionPage.locator('#guru-grid h3').first().textContent();
  await controls.last().focus(); await motionPage.keyboard.press('Enter');
  await motionPage.waitForFunction(before => document.querySelector('#guru-grid h3')?.textContent !== before, before);
  await motionPage.waitForFunction(() => document.querySelectorAll('[data-motion-outgoing]').length === 0);
  assert.equal(await motionPage.locator('#guru-grid [data-teacher-border]').count(), 8);
  await controls.first().focus(); await motionPage.keyboard.press('Enter');
  await motionPage.waitForFunction(before => document.querySelector('#guru-grid h3')?.textContent === before, before);
  await motionPage.waitForFunction(() => document.querySelectorAll('[data-motion-outgoing]').length === 0);
  await motionPage.close();
  assert.deepEqual(errors, []);
  console.log(`PASS teacher border browser: ${pages} pages / ${cards} cards, ID/EN, 8 widths, all pagination, stable heights, full labels, loaded corners/photos, detail links, no overflow/runtime errors.`);
} finally { await browser.close(); }
