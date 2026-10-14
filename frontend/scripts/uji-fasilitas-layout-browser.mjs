/* global document, getComputedStyle */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.QA_URL || 'http://localhost:5173';
const output = process.env.QA_OUTPUT || '../../qa-output/fasilitas-layout-2026-10-14';
await mkdir(output, { recursive: true });
const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
const { fasilitasViews } = await server.ssrLoadModule('/src/data/fasilitasPageData.js');
const { translate } = await server.ssrLoadModule('/src/utils/language.js');
await server.close();
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ reducedMotion: 'reduce' });
const errors = [], imagesFailed = [], results = [];
page.on('pageerror', error => errors.push(error.message));
page.on('response', response => { if (response.request().resourceType() === 'image' && response.status() >= 400) imagesFailed.push(response.url()); });
await page.route('**/rest/v1/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
page.setDefaultTimeout(15000);
try {
  for (const width of [1847, 1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const language of ['id', 'en']) {
      await page.goto(base + '/fasilitas');
      await page.locator('[data-facility-card]').first().waitFor();
      const english = await page.locator('#fasilitas-title').innerText();
      if ((language === 'en') !== english.includes('School')) await page.locator('header').getByRole('button', { name: language === 'en' ? 'Switch to English' : 'Switch to Indonesian', exact: true }).click();
      await page.evaluate(() => document.fonts.ready);
      for (const [category, groups] of Object.entries(fasilitasViews)) {
        const items = groups.flatMap(group => group.items);
        const filter = page.getByRole('button', { name: translate(category, language), exact: true });
        await filter.click();
        await page.waitForFunction(label => [...document.querySelectorAll('button[aria-controls="fasilitas-grid"]')].find(button => button.textContent === label)?.getAttribute('aria-pressed') === 'true', translate(category, language));
        assert.equal(await filter.getAttribute('aria-pressed'), 'true');
        assert.deepEqual(await page.locator('[data-facility-card] h4').allTextContents(), items.map(item => translate(item.name, language)));
        assert.equal(new URL(page.url()).searchParams.get('kategori'), category === 'Semua' ? null : category);
        const geometry = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth, columns: getComputedStyle(document.querySelector('[data-facility-grid]')).gridTemplateColumns.split(' ').length }));
        assert(geometry.scroll <= geometry.client, `${width} ${language}: page overflow`);
        assert.equal(geometry.columns, width >= 1024 ? 4 : width >= 640 ? 2 : 1);
        for (const card of await page.locator('[data-facility-card]').all()) {
          await card.scrollIntoViewIfNeeded();
          const photo = card.locator('img');
          await photo.waitFor();
          await photo.evaluate(img => img.decode());
          assert.equal(await photo.evaluate(img => getComputedStyle(img).objectFit), 'cover');
          assert(!String(await photo.getAttribute('src')).includes('belajar-kelompok'));
        }
        if (width === 1847 && language === 'id') {
          await page.locator('#daftar-fasilitas').screenshot({ path: `${output}/${category}-desktop.png`, animations: 'disabled', style: 'header { visibility: hidden; }' });
          // Every distinct inventory item gets its detail and gallery checked once.
          if (category === 'Semua' || category === 'Kelas' || category === 'Laboratorium') {
            for (let index = 0; index < items.length; index++) {
              const card = page.locator('[data-facility-card]').nth(index), trigger = card.getByRole('button');
              await trigger.click();
              const dialog = page.locator('dialog[open]');
              await dialog.waitFor();
              await dialog.locator('img').first().evaluate(img => img.decode());
              assert.equal(await dialog.locator('img').first().evaluate(img => getComputedStyle(img).objectFit), 'cover');
              const thumbs = dialog.getByRole('button', { name: /^Lihat foto / });
              if (items[index].classroomGallery) await page.waitForFunction(() => document.querySelectorAll('dialog[open] [aria-pressed]').length > 1);
              assert(await thumbs.count() > 0);
              await thumbs.last().click();
              await dialog.locator('img').first().evaluate(img => img.decode());
              if (items[index].photoNote) assert(await dialog.getByText(translate(items[index].photoNote, language, { name: translate(items[index].photoKey, language) })).count());
              await page.keyboard.press('Escape');
              await dialog.waitFor({ state: 'hidden' });
              assert.equal(await trigger.evaluate(button => button === document.activeElement), true);
            }
          }
        }
      }
      await page.getByRole('button', { name: translate('Semua', language), exact: true }).click();
      await page.waitForFunction(() => document.querySelectorAll('[data-facility-card]').length === 24);
      for (const card of await page.locator('[data-facility-card]').all()) {
        await card.scrollIntoViewIfNeeded();
        await card.locator('img').evaluate(img => img.decode());
      }
      await page.locator('#daftar-fasilitas').screenshot({ path: `${output}/${width}-${language}.png`, animations: 'disabled', style: 'header { visibility: hidden; }' });
      results.push({ width, language, filters: 7, photos: 'loaded and cover', overflow: false });
      console.log(`PASS ${width} ${language}: all seven filters, names, photos, responsive grid, URL, overflow`);
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base+'/fasilitas?kategori=Kelas');
  if ((await page.locator('#fasilitas-title').innerText()).includes('School')) await page.locator('header').getByRole('button', { name: 'Switch to Indonesian', exact: true }).click();
  const pin = page.locator('[data-campus-hotspot="gedung-d-2"]');
  // Pan to make the selected label reachable, including keyboard access.
  await page.locator('.campus-viewport').scrollIntoViewIfNeeded();
  await pin.focus();
  await page.keyboard.press('Enter');
  await page.locator('[data-campus-preview] select').selectOption({ label: 'Kelas D 2.2' });
  assert((await page.locator('[data-campus-preview]').innerText()).includes('Gedung D'));
  await page.locator('[data-campus-preview]').screenshot({ path: output+'/gedung-d.png', animations: 'disabled' });
  await page.keyboard.press('Escape');
  for (const id of ['rps-selatan', 'rps-utara']) {
    const hotspot = page.locator(`[data-campus-hotspot="${id}"]`);
    await hotspot.focus();
    await page.keyboard.press('Enter');
    const gallery = page.locator('[data-campus-preview] [data-facility-carousel]');
    await gallery.waitFor();
    const photo = gallery.locator('img.campus-preview-photo').first();
    await photo.evaluate(img => img.decode());
    assert((await photo.getAttribute('src')).includes(id));
    assert.equal(await photo.evaluate(img => getComputedStyle(img).objectFit), 'cover');
    await page.keyboard.press('Escape');
  }
  assert.deepEqual(errors, []);
  assert.deepEqual(imagesFailed, []);
  await writeFile(output+'/results.json', JSON.stringify({ results, errors, imagesFailed }, null, 2));
  console.log('PASS 46 detail dialogs/galleries, Escape/focus, Gedung D destination; no runtime or image errors');
} finally { await browser.close(); }
