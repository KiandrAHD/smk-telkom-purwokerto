/* global document, getComputedStyle */
import assert from 'node:assert/strict';
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const manifest = JSON.parse(await readFile(path.join(root, 'src/data/classroomPhotoManifest.json')));
const audit = JSON.parse(await readFile(path.join(root, 'docs/foto-kelas-integrasi.json')));
const missing = ['Kelas C 2.3', 'Kelas C 3.3', 'Kelas D 2.2'];
assert.equal(Object.keys(manifest).length, 13);
assert.equal(audit.length, 91);
assert.equal(new Set(audit.map(photo => photo.sha256)).size, 91);
for (const [name, photos] of Object.entries(manifest)) {
  for (const photo of photos) {
    assert.equal(photo.source.split('/')[1].replace(/\s/g, ''), name.replace('Kelas ', '').replace(/\s/g, ''));
    if (name === 'Kelas C 2.2') assert(photo.source.endsWith('.jpeg'), 'Wooden-chair set is not C 2.2');
    const record = audit.find(entry => entry.source === photo.source);
    assert(record, 'Every used photo must have provenance');
    for (const variant of record.variants) {
      const file = path.join(root, 'src/assets/fasilitas/kelas', variant.file);
      const metadata = await sharp(file).metadata();
      assert.equal(metadata.width, variant.width);
      assert.equal(metadata.height, variant.height);
      assert.equal(metadata.format, 'webp');
      assert(metadata.width <= record.width);
      assert((await stat(file)).size < record.originalBytes);
    }
  }
}
console.log('PASS 91 correctly mapped photos / 364 optimized variants; excluded C 2.2 JPG set.');

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const output = process.env.QA_OUTPUT || path.join(root, '../../qa-output/foto-kelas-2026-10-13/browser');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ reducedMotion: 'reduce' });
const errors = [], failedImages = [], results = [];
page.on('pageerror', error => errors.push(error.message));
page.on('response', response => { if (response.request().resourceType() === 'image' && response.status() >= 400) failedImages.push(response.url()); });
await page.route('**/rest/v1/**', route => route.fulfill({ contentType: 'application/json', body: '[]' }));
try {
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto((process.env.QA_URL || 'http://127.0.0.1:4174') + '/fasilitas?kategori=Kelas');
    await page.locator('[data-facility-card]').first().waitFor();
    const names = await page.locator('[data-facility-card] h4').allTextContents();
    assert.deepEqual(names, ['Kelas A 1.4', 'Kelas A 2.2', 'Kelas A 3.4', 'Kelas A 3.6', 'Kelas B 1.4', 'Kelas B 1.5', 'Kelas B 2.3', 'Kelas B 2.5', 'Kelas C 2.2', 'Kelas C 2.3', 'Kelas C 3.2', 'Kelas C 3.3', 'Kelas D 1.2', 'Kelas D 2.1', 'Kelas D 2.2', 'Kelas D 3.1']);
    assert(await page.locator('[data-facility-card] img').evaluateAll(images => images.every(img => img.loading === 'lazy')));
    const requestedBeforeScroll = await page.evaluate(() => performance.getEntriesByType('resource').filter(entry => entry.initiatorType === 'img' && /\/kelas-[abcd]-/.test(entry.name)).length);
    assert.equal(requestedBeforeScroll, 0, 'Classroom photos must not load before the list approaches the viewport');
    await page.locator('#daftar-fasilitas').scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    const boxes = await page.locator('[data-facility-card]').evaluateAll(cards => cards.map(card => {
      const image = card.firstElementChild.getBoundingClientRect();
      return { width: card.getBoundingClientRect().width, imageRatio: image.width / image.height, radius: getComputedStyle(card).borderTopLeftRadius };
    }));
    assert(boxes.every(box => Math.abs(box.imageRatio - 16 / 9) < .02 && box.radius === '16px'));
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth), false);
    for (const name of names) {
      const card = page.locator('[data-facility-card]').filter({ has: page.getByRole('heading', { name, exact: true }) });
      await card.scrollIntoViewIfNeeded();
      await card.locator('img').waitFor();
      await card.locator('img').evaluate(img => img.decode());
      const source = await card.locator('img').getAttribute('src');
      assert(manifest[name] ? source.includes(manifest[name][0].id) : source.includes('belajar-kelompok-laptop'));
      await card.getByRole('button').click();
      const dialog = page.locator('dialog[open]');
      await dialog.waitFor();
      if (manifest[name]) {
        assert.equal(await dialog.getByText('Foto merupakan ilustrasi kegiatan belajar.', { exact: false }).count(), 0);
        const thumbs = dialog.getByRole('button', { name: /^Lihat foto / });
        await page.waitForFunction(count => document.querySelector('dialog[open] [role="group"]')?.children.length === count, manifest[name].length);
        assert.equal(await thumbs.count(), manifest[name].length);
        const indices = width === 1440 ? manifest[name].map((_, index) => index) : [0, manifest[name].length - 1];
        for (const index of indices) {
          await thumbs.nth(index).click();
          const image = dialog.locator('img').first();
          await image.evaluate(img => img.decode());
          assert((await image.getAttribute('src')).includes(manifest[name][index].id));
          assert.equal(await image.evaluate(img => getComputedStyle(img).objectFit), 'contain');
        }
      } else {
        assert(missing.includes(name));
        await dialog.getByText('Foto merupakan ilustrasi kegiatan belajar.', { exact: false }).waitFor();
      }
      if (name === 'Kelas A 1.4') await dialog.screenshot({ path: path.join(output, `modal-${width}.png`) });
      await page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'hidden' });
      assert.equal(await card.getByRole('button').evaluate(button => button === document.activeElement), true);
    }
    assert.equal(await page.locator('[data-facility-card] img[loading="lazy"]').count(), 16);
    assert.equal(await page.locator('[data-facility-card] img[srcset]').count(), 13);
    await page.locator('#daftar-fasilitas').screenshot({ path: path.join(output, `kelas-${width}.png`) });
    results.push({ width, names, boxes, requestedBeforeScroll });
    console.log(`PASS ${width}: cards, gallery, lazy loading, fallback, Escape/focus and overflow`);
  }
  await page.locator('header').getByRole('button', { name: 'Switch to English', exact: true }).click();
  await page.locator('[data-facility-card]').first().getByRole('button').click();
  await page.locator('dialog[open]').getByText('Photo 1 of 6', { exact: true }).waitFor();
  assert.equal(await page.locator('dialog[open]').getByRole('button', { name: /^View photo / }).count(), 6);
  assert.deepEqual(errors, []);
  assert.deepEqual(failedImages, []);
} finally {
  await writeFile(path.join(output, 'results.json'), JSON.stringify({ results, errors, failedImages }, null, 2));
  await browser.close();
}
