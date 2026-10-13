/* global document, window, getComputedStyle, Node */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.QA_URL || 'http://127.0.0.1:4175';
const output = process.env.QA_OUTPUT || join(tmpdir(), 'school-agenda-qa');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
page.setDefaultTimeout(10000);
const errors = [], results = [];
page.on('pageerror', error => errors.push(error.message));
const record = (id, date, extra = {}) => ({ id, judul: `Kegiatan uji ${id}`, ringkasan: 'Ringkasan kegiatan untuk pengujian antarmuka.', deskripsi: 'Deskripsi lengkap kegiatan untuk pengujian detail.', tanggal_mulai: date, kategori: 'upacara-nasional', status: 'published', ...extra });
let rows = [record('foto', '2099-01-01', { gambar_url: `${base}/qa-agenda-image.svg` }), record('broken', '2099-01-02', { gambar_url: `${base}/qa-agenda-broken.jpg`, kategori: 'penilaian-siswa' }), record('tanpa', '2099-01-03', { ringkasan: '', deskripsi: 'Isi dari deskripsi.' }), record('fourth', '2099-01-04'), record('draft', '2098-01-01', { status: 'draft' })];
let failed = false;
await page.route('**/qa-agenda-image.svg', route => route.fulfill({ status: 200, contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="477" height="346"><rect width="477" height="346" fill="#eee"/><text x="50" y="180" font-size="30">Gambar khusus QA</text></svg>' }));
await page.route('**/qa-agenda-broken.jpg', route => route.fulfill({ status: 404, body: 'missing' }));
await page.route('**/rest/v1/**', route => {
  if (route.request().url().includes('/events?') && failed) return route.fulfill({ status: 500, contentType: 'application/json', body: '{"code":"XX000"}' });
  return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(route.request().url().includes('/events?') ? rows.filter(row => row.status === 'published') : []) });
});
const ids = () => page.locator('[data-school-agenda-event]').evaluateAll(cards => cards.map(card => card.dataset.schoolAgendaEvent));
const refresh = () => page.evaluate(() => window.dispatchEvent(new Event('focus')));
try {
  await page.goto(base + '/kalender', { waitUntil: 'domcontentloaded', timeout: 30000 }); await page.locator('[data-calendar-date]').first().waitFor();
  assert.equal(await page.getByRole('heading', { name: 'Agenda Sekolah', exact: true }).count(), 1, 'Public calendar needs the School Agenda section.');
  assert.equal(await page.getByText('Ingin tahu lebih banyak?', { exact: true }).count(), 0, 'The removed promotion must not remain in the sidebar.');
  assert.equal(await page.locator('aside').getByRole('button', { name: 'Lihat Semua', exact: true }).count(), 1);
  assert.deepEqual(await ids(), ['foto', 'broken', 'tanpa']);
  assert.equal(await page.getByText('Kegiatan uji draft', { exact: true }).count(), 0);
  await page.locator('[data-school-agenda-event="foto"] [data-agenda-image] img').waitFor();
  await page.waitForFunction(() => document.querySelector('[data-school-agenda-event="foto"] [data-agenda-image] img')?.naturalWidth === 477);
  await page.locator('[data-school-agenda-event="broken"] [data-agenda-fallback]').waitFor();
  assert.equal(await page.locator('[data-school-agenda-event="tanpa"] [data-agenda-fallback]').count(), 1);
  assert.equal(await page.locator('[data-school-agenda-event="tanpa"]').getByText('Isi dari deskripsi.', { exact: true }).count(), 1);
  const card = page.locator('[data-school-agenda-event="foto"]');
  await card.focus(); await page.keyboard.press('Enter');
  await page.getByRole('dialog').getByText('Deskripsi lengkap kegiatan untuk pengujian detail.', { exact: true }).waitFor();
  await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); assert.equal(await page.getByRole('dialog').evaluate(dialog => dialog.contains(document.activeElement)), true);
  await page.keyboard.press('Escape'); await page.getByRole('dialog').waitFor({ state: 'hidden' });
  assert.equal(await card.evaluate(node => node === document.activeElement), true);
  await page.locator('[data-school-agenda-event="tanpa"]').click(); await page.getByRole('dialog').getByText('Isi dari deskripsi.', { exact: true }).waitFor(); await page.getByRole('button', { name: 'Tutup', exact: true }).click();
  await page.locator('input[type="month"]').fill('2099-01');
  await page.locator('[data-calendar-date="2099-01-01"]').click(); await page.locator('aside [data-calendar-event="foto"]').click();
  await page.getByRole('dialog').getByText('Deskripsi lengkap kegiatan untuk pengujian detail.', { exact: true }).waitFor(); await page.keyboard.press('Escape');
  for (const width of [1920, 1440, 1024, 768, 375, 320]) for (const language of ['id', 'en']) {
    await page.setViewportSize({ width, height: 1000 });
    if (await page.locator('html').getAttribute('lang') !== language) await page.locator('header').getByRole('button', { name: language === 'en' ? 'Switch to English' : 'Switch to Indonesian', exact: true }).click();
    await page.locator('#agenda-sekolah').scrollIntoViewIfNeeded(); await page.evaluate(() => document.fonts.ready);
    const geometry = await page.locator('#agenda-sekolah').evaluate(section => {
      const cards = [...section.querySelectorAll('[data-school-agenda-event]')];
      const boxes = cards.map(card => card.getBoundingClientRect());
      const image = section.querySelector('[data-agenda-image]'); const imageBox = image.getBoundingClientRect();
      const heading = section.querySelector('h2');
      return { overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth, columns: new Set(boxes.map(box => Math.round(box.left))).size, heights: boxes.map(box => box.height), imageRatio: imageBox.width / imageBox.height, bodyFont: getComputedStyle(cards[0]).fontFamily, headingFont: getComputedStyle(heading).fontFamily, transition: getComputedStyle(cards[0]).transitionDuration, beforeStela: Boolean(section.compareDocumentPosition(document.querySelector('#stela')) & Node.DOCUMENT_POSITION_FOLLOWING) };
    });
    assert.equal(geometry.overflow, false); assert.equal(geometry.columns, width >= 1024 ? 3 : width >= 640 ? 2 : 1);
    assert.ok(Math.max(...geometry.heights) - Math.min(...geometry.heights) < 2); assert.ok(Math.abs(geometry.imageRatio - 477 / 346) < 0.02);
    assert.match(geometry.bodyFont, /Inter/); assert.match(geometry.headingFont, /Poppins/); assert.ok(parseFloat(geometry.transition) <= 0.00001); assert.equal(geometry.beforeStela, true);
    await page.locator('#agenda-sekolah').screenshot({ path: join(output, `agenda-${width}-${language}.png`) }); results.push({ width, language, ...geometry });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  if (await page.locator('html').getAttribute('lang') !== 'id') await page.locator('header').getByRole('button', { name: 'Switch to Indonesian', exact: true }).click();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.locator('#agenda-sekolah').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => [...document.querySelectorAll('#agenda-sekolah article')].every(node => node.classList.contains('visible')));
  const motion = await page.locator('#agenda-sekolah article').evaluateAll(nodes => nodes.map(node => ({ duration: getComputedStyle(node).transitionDuration, delay: getComputedStyle(node).transitionDelay })));
  assert.deepEqual(motion.map(item => item.duration), ['0.55s', '0.55s', '0.55s']);
  assert.deepEqual(motion.map(item => item.delay), ['0s', '0.1s', '0.2s']);
  assert.match(await card.evaluate(node => getComputedStyle(node).transitionDuration), /0\.2s/);
  await card.hover();
  await page.waitForFunction(() => getComputedStyle(document.querySelector('[data-school-agenda-event="foto"]')).translate === '0px -4px');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.locator('#agenda-sekolah').scrollIntoViewIfNeeded();
  assert.equal(await page.locator('#agenda-sekolah article.visible').count(), 3, 'Entrance must remain revealed after leaving and returning.');
  await page.evaluate(() => document.fonts.ready);
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
  const { root } = await cdp.send('DOM.getDocument');
  const renderedFonts = {};
  for (const [name, selector, expected] of [['heading', '#school-agenda-title', 'Poppins'], ['body', '[data-school-agenda-event="foto"] .text-sm', 'Inter']]) {
    const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector });
    const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId });
    assert.ok(fonts.some(font => font.familyName.startsWith(expected) && font.glyphCount > 0), `${name} must render with ${expected}: ${JSON.stringify(fonts)}`);
    renderedFonts[name] = fonts;
  }
  await cdp.detach(); results.push({ motion, renderedFonts });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  rows[0] = { ...rows[0], judul: 'Judul hasil edit', ringkasan: 'Ringkasan hasil edit', kategori: 'cuti-bersama', gambar_url: null };
  await refresh(); await page.locator('[data-school-agenda-event="foto"]').getByText('Judul hasil edit', { exact: true }).waitFor();
  assert.equal(await page.locator('[data-school-agenda-event="foto"]').getByText('Cuti bersama', { exact: true }).count(), 1);
  assert.equal(await page.locator('[data-school-agenda-event="foto"] [data-agenda-fallback]').count(), 1);
  rows[0].status = 'draft'; await refresh(); await page.waitForFunction(() => !document.querySelector('[data-school-agenda-event="foto"]')); assert.deepEqual(await ids(), ['broken', 'tanpa', 'fourth']);
  rows.splice(1, 1); await refresh(); await page.waitForFunction(() => !document.querySelector('[data-school-agenda-event="broken"]')); assert.deepEqual(await ids(), ['tanpa', 'fourth']);
  rows = []; await refresh(); await page.getByText('Belum ada agenda sekolah yang dipublikasikan.', { exact: true }).waitFor(); assert.deepEqual(await ids(), []);
  failed = true; await refresh(); await page.getByRole('alert').waitFor(); assert.equal(await page.locator('#agenda-sekolah').count(), 0);
  failed = false; rows = [record('restored', '2099-02-01')]; await page.getByRole('button', { name: 'Coba lagi', exact: true }).click(); await page.locator('[data-school-agenda-event="restored"]').waitFor();
  await page.reload({ waitUntil: 'domcontentloaded' }); await page.locator('[data-school-agenda-event="restored"]').waitFor();
  assert.deepEqual(errors, []);
  console.log('PASS School Agenda UI: shared Published cards, images/fallbacks, keyboard/modal/focus, calendar detail, edit/unpublish/delete refresh, empty/error/retry/reload, 12 viewport/language combinations, stagger/hover/reduced motion and rendered Inter/Poppins fonts.');
} finally { await writeFile(join(output, 'results.json'), JSON.stringify({ results, errors }, null, 2)); await browser.close(); }
