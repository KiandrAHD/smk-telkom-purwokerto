/* global document, window, getComputedStyle */
import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.QA_URL || 'http://127.0.0.1:4173';
const output = process.env.QA_OUTPUT || join(tmpdir(), 'event-browser-qa');
await mkdir(output, { recursive: true });
const source = await readFile(new URL('../.env', import.meta.url), 'utf8');
const apiUrl = source.match(/^VITE_SUPABASE_URL=(.+)$/m)?.[1].trim().replace(/^['"]|['"]$/g, '');
const storageKey = `sb-${new URL(apiUrl).hostname.split('.')[0]}-auth-token`;
const adminId = '11111111-1111-4111-8111-111111111111', otherId = '22222222-2222-4222-8222-222222222222';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const rows = [], errors = [], results = [];
const categories = [
  ['upacara-nasional', 'Upacara Hari Nasional', '#FF0033'],
  ['penilaian-siswa', 'Penilaian Siswa (TKA, PSAS, PSAJ)', '#0080FF'],
  ['libur-tahun-pelajaran', 'Libur Tahun Pelajaran', '#A22828'],
  ['awal-pkl', 'Awal praktek kerja industri', '#B5651D'],
  ['hari-pertama-sekolah', 'Hari Pertama masuk sekolah', '#F2FF00'],
  ['hut-smk', 'HUT SMK', '#CFB53B'],
  ['libur-akhir-semester', 'Libur Akhir Semester', '#B300FF'],
  ['perkiraan-kelulusan', 'Perkiraan Kelulusan', '#FF9500'],
  ['cuti-bersama', 'Cuti bersama', '#16B900'],
  ['libur-ramadhan', 'Libur awal Ramadhan', '#8CF97D'],
];
const dotColor = locator => locator.evaluate(async element => {
  await element.decode();
  const canvas = document.createElement('canvas'); canvas.width = 18; canvas.height = 18;
  const context = canvas.getContext('2d'); context.drawImage(element, 0, 0);
  return '#' + [...context.getImageData(9, 9, 1, 1).data].slice(0, 3).map(value => value.toString(16).padStart(2, '0')).join('').toUpperCase();
});
const legend = async page => {
  assert.deepEqual(await page.locator('[data-event-legend] li').allTextContents(), categories.map(category => category[1]));
  for (const [id, , color] of categories) assert.equal(await dotColor(page.locator(`[data-event-legend] [data-category-dot="${id}"]`)), color);
};
const selectCategory = async (page, label) => {
  await page.getByRole('combobox', { name: 'Kategori Kegiatan', exact: true }).click();
  await page.getByRole('option', { name: label, exact: true }).click();
};
let failSave = false, loseSaveResponse = false, failRead = false, requests = 0;
const user = id => ({ id, email: 'qa@example.invalid', role: 'authenticated', aud: 'authenticated', app_metadata: { provider: 'email' }, user_metadata: {} });
async function contextFor(id) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  context.setDefaultTimeout(15000);
  if (id) {
    const token = [Buffer.from('{"alg":"HS256","typ":"JWT"}').toString('base64url'), Buffer.from(JSON.stringify({ sub: id, role: 'authenticated', exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url'), 'fixture'].join('.');
    await context.addInitScript(({ storageKey, value }) => { if (window.location.protocol === 'http:' || window.location.protocol === 'https:') localStorage.setItem(storageKey, JSON.stringify(value)); }, { storageKey, value: { access_token: token, refresh_token: 'qa-refresh', expires_at: Math.floor(Date.now() / 1000) + 3600, expires_in: 3600, token_type: 'bearer', user: user(id) } });
  }
  context.on('page', page => page.on('pageerror', error => errors.push(error.message)));
  await context.route('**/auth/v1/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(user(id)) }));
  await context.route('**/rest/v1/**', async route => {
    const request = route.request(), url = new URL(request.url()), table = url.pathname.split('/').at(-1), method = request.method();
    let data = [];
    if (table === 'admins') data = id === adminId ? [{ id: adminId }] : [];
    if (table === 'events') {
      const isAdmin = id === adminId;
      if (method === 'GET') {
        if (failRead) return route.fulfill({ status: 404, contentType: 'application/json', body: '{"code":"PGRST205"}' });
        data = rows.filter(row => (isAdmin || row.status === 'published') && (url.searchParams.get('status') !== 'eq.published' || row.status === 'published') && (!url.searchParams.get('id') || row.id === url.searchParams.get('id').slice(3)));
      } else {
        requests++;
        if (!isAdmin) return route.fulfill({ status: 403, contentType: 'application/json', body: '{"code":"42501","message":"denied"}' });
        if (failSave) { failSave = false; return route.fulfill({ status: 500, contentType: 'application/json', body: '{"code":"XX000","message":"QA failure"}' }); }
        const existing = rows.findIndex(row => row.id === url.searchParams.get('id')?.slice(3));
        if (method === 'POST') {
          const input = request.postDataJSON(); const index = rows.findIndex(row => row.id === input.id);
          data = { ...input, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
          if (index < 0) rows.push(data); else rows[index] = data;
          if (loseSaveResponse) { loseSaveResponse = false; return route.fulfill({ status: 500, contentType: 'application/json', body: '{"code":"XX000","message":"Response lost after save"}' }); }
        } else if (method === 'PATCH' && existing >= 0) { rows[existing] = { ...rows[existing], ...request.postDataJSON(), updated_at: new Date().toISOString() }; data = rows[existing]; }
        else if (method === 'DELETE' && existing >= 0) { data = { id: rows[existing].id }; rows.splice(existing, 1); }
        else return route.fulfill({ status: 406, contentType: 'application/json', body: '{"code":"PGRST116"}' });
      }
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(data) });
  });
  return context;
}
try {
  for (const id of [null, otherId]) {
    const context = await contextFor(id), page = await context.newPage();
    await page.goto(base + '/dashboard/kalender');
    if (!id) await page.waitForURL(base + '/login'); else await page.getByText('403', { exact: false }).first().waitFor();
    assert.equal(await page.getByRole('button', { name: 'Tambah Event', exact: true }).count(), 0);
    await context.close();
  }
  const adminContext = await contextFor(adminId), admin = await adminContext.newPage();
  const publicContext = await contextFor(null), publicPage = await publicContext.newPage();
  await admin.goto(base + '/dashboard/kalender'); await admin.getByRole('heading', { name: 'Calendar of Events', exact: true }).waitFor();
  await legend(admin);
  console.log('PASS admin legend colors; checking category dropdown and keyboard.');
  const field = (label, value) => admin.getByLabel(label, { exact: true }).fill(value);
  const add = async (title, published = false) => {
    await admin.getByRole('button', { name: 'Tambah Event', exact: true }).click();
    await field('Judul kegiatan (wajib)', title); await field('Tanggal mulai (wajib)', '2030-10-06');
    await selectCategory(admin, 'Upacara Hari Nasional');
    if (published) await admin.getByLabel('Status publikasi', { exact: true }).selectOption('published');
    await admin.getByRole('button', { name: 'Simpan Event', exact: true }).click();
    await admin.getByRole('dialog').waitFor({ state: 'hidden' });
  };
  await admin.getByRole('button', { name: 'Tambah Event', exact: true }).click();
  const before = requests;
  await admin.getByRole('button', { name: 'Simpan Event', exact: true }).click();
  await admin.getByText('Judul kegiatan wajib diisi.', { exact: true }).waitFor(); assert.equal(requests, before);
  await admin.getByText('Pilih kategori kegiatan yang tersedia.', { exact: true }).waitFor();
  const categoryField = admin.getByRole('combobox', { name: 'Kategori Kegiatan', exact: true });
  await categoryField.click();
  assert.equal(await admin.getByRole('listbox').getByRole('option').count(), 10);
  for (const [id, label, color] of categories) assert.equal(await dotColor(admin.getByRole('option', { name: label, exact: true }).locator(`[data-category-dot="${id}"]`)), color);
  await admin.keyboard.press('End'); await admin.keyboard.press('Enter');
  assert.match(await categoryField.textContent(), /Libur awal Ramadhan/);
  await categoryField.click(); await admin.keyboard.press('Home'); await admin.keyboard.press('Enter');
  assert.match(await categoryField.textContent(), /Upacara Hari Nasional/);
  await categoryField.click(); await admin.keyboard.press('Escape');
  assert.equal(await admin.getByRole('dialog').count(), 1, 'Escape dismisses dropdown before modal');
  assert.equal(await categoryField.getAttribute('aria-expanded'), 'false');
  console.log('PASS category dropdown colors and keyboard.');
  await field('Judul kegiatan (wajib)', 'Invalid QA'); await field('Tanggal mulai (wajib)', '2030-10-06'); await field('Tanggal selesai', '2030-10-05');
  await admin.getByRole('button', { name: 'Simpan Event', exact: true }).click(); await admin.getByText('Tanggal selesai tidak boleh lebih awal dari tanggal mulai.', { exact: true }).waitFor();
  await field('Tanggal selesai', ''); await field('Waktu mulai (WIB)', '10:00'); await field('Waktu selesai (WIB)', '09:00');
  await admin.getByRole('button', { name: 'Simpan Event', exact: true }).click(); await admin.getByText('Waktu selesai harus setelah waktu mulai pada hari yang sama.', { exact: true }).waitFor();
  await admin.keyboard.press('Escape');
  await add('Draft QA'); await admin.reload(); await admin.getByLabel('Bulan kalender admin').fill('2030-10'); await admin.getByRole('button', { name: 'Detail Draft QA', exact: true }).waitFor();
  await publicPage.goto(base + '/kalender'); await publicPage.locator('[data-calendar-date]').first().waitFor();
  await legend(publicPage);
  assert.equal(await publicPage.getByText('Draft QA', { exact: true }).count(), 0);
  await add('Published QA', true); await publicPage.evaluate(() => window.dispatchEvent(new Event('focus')));
  console.log('PASS create/reload and Draft privacy; checking category edit sync.');
  await publicPage.locator('input[type="month"]').fill('2030-10'); await publicPage.locator('[data-calendar-date="2030-10-06"]').click();
  await publicPage.locator('aside').getByRole('button', { name: /Published QA/ }).waitFor();
  const sameOriginPublic = await adminContext.newPage();
  await sameOriginPublic.goto(base + '/kalender'); await sameOriginPublic.locator('[data-calendar-date]').first().waitFor();
  await sameOriginPublic.locator('input[type="month"]').fill('2030-10'); await sameOriginPublic.locator('[data-calendar-date="2030-10-06"]').click();
  await sameOriginPublic.locator('aside').getByRole('button', { name: /Published QA/ }).waitFor();
  await admin.getByRole('button', { name: 'Detail Published QA', exact: true }).click(); await admin.getByRole('dialog').getByRole('button', { name: 'Edit Published QA', exact: true }).click();
  assert.match(await admin.getByRole('combobox', { name: 'Kategori Kegiatan' }).textContent(), /Upacara Hari Nasional/);
  const publishedId = rows.find(row => row.judul === 'Published QA').id;
  await publicPage.locator(`[data-school-agenda-event="${publishedId}"]`).waitFor();
  await selectCategory(admin, 'Cuti bersama');
  await field('Judul kegiatan (wajib)', 'Updated QA'); await field('Lokasi', 'Laboratorium QA'); await field('Deskripsi lengkap', '<script>window.qaXss=true</script>');
  await admin.getByRole('button', { name: 'Simpan Event', exact: true }).click(); await admin.getByRole('dialog').waitFor({ state: 'hidden' });
  assert.equal(rows.length, 2);
  assert.equal(rows.find(row => row.id === publishedId).kategori, 'cuti-bersama');
  await sameOriginPublic.locator('aside').getByRole('button', { name: /Updated QA/ }).waitFor();
  await sameOriginPublic.locator(`[data-school-agenda-event="${publishedId}"]`).getByText('Updated QA', { exact: true }).waitFor();
  await publicPage.evaluate(() => window.dispatchEvent(new Event('focus'))); await publicPage.locator('aside').getByRole('button', { name: /Updated QA/ }).click();
  await publicPage.getByRole('dialog').getByText('Laboratorium QA', { exact: true }).waitFor(); assert.equal(await publicPage.evaluate(() => window.qaXss), undefined); await publicPage.keyboard.press('Escape');
  assert.equal(await dotColor(admin.locator('aside [data-category-dot="cuti-bersama"]')), '#16B900');
  assert.equal(await dotColor(publicPage.locator('aside [data-category-dot="cuti-bersama"]')), '#16B900');
  assert.equal(await dotColor(publicPage.locator('[data-calendar-date="2030-10-06"] [data-category-dot="cuti-bersama"]')), '#16B900');
  assert.equal(await dotColor(publicPage.locator(`[data-school-agenda-event="${publishedId}"] [data-category-dot="cuti-bersama"]`)), '#16B900');
  assert.equal(await dotColor(admin.locator('[data-admin-date="2030-10-06"] [data-category-dot="cuti-bersama"]')), '#16B900');
  console.log('PASS category edit updates admin/public calendar, detail and agenda.');
  await admin.getByRole('button', { name: 'Edit Updated QA', exact: true }).click(); await admin.getByLabel('Status publikasi', { exact: true }).selectOption('draft');
  await admin.getByRole('button', { name: 'Simpan Event', exact: true }).click(); await admin.getByRole('dialog').waitFor({ state: 'hidden' });
  await publicPage.evaluate(() => window.dispatchEvent(new Event('focus'))); await publicPage.getByText('Belum ada kegiatan pada tanggal ini.', { exact: true }).waitFor();
  assert.equal(await publicPage.locator(`[data-school-agenda-event="${publishedId}"]`).count(), 0);
  await admin.getByRole('button', { name: 'Edit Updated QA', exact: true }).click(); await admin.getByLabel('Status publikasi', { exact: true }).selectOption('published');
  await admin.getByRole('button', { name: 'Simpan Event', exact: true }).click(); await admin.getByRole('dialog').waitFor({ state: 'hidden' });
  await admin.getByRole('button', { name: 'Hapus Updated QA', exact: true }).click(); await admin.getByRole('dialog').getByRole('button', { name: 'Batal', exact: true }).click(); assert.equal(rows.length, 2);
  await admin.getByRole('button', { name: 'Hapus Updated QA', exact: true }).click(); await admin.getByRole('button', { name: 'Ya, Hapus', exact: true }).click(); await admin.getByRole('dialog').waitFor({ state: 'hidden' });
  await publicPage.evaluate(() => window.dispatchEvent(new Event('focus'))); await publicPage.getByText('Belum ada kegiatan pada tanggal ini.', { exact: true }).waitFor(); assert.equal(rows.length, 1);
  assert.equal(await publicPage.locator(`[data-school-agenda-event="${publishedId}"]`).count(), 0);
  await admin.getByRole('button', { name: 'Tambah Event', exact: true }).click(); await field('Judul kegiatan (wajib)', 'Retry QA'); await field('Tanggal mulai (wajib)', '2030-10-06'); failSave = true;
  await selectCategory(admin, 'Penilaian Siswa (TKA, PSAS, PSAJ)');
  await admin.getByRole('button', { name: 'Simpan Event', exact: true }).click(); await admin.getByRole('dialog').getByRole('alert').waitFor(); assert.equal(rows.length, 1);
  await admin.getByRole('button', { name: 'Simpan Event', exact: true }).dblclick(); await admin.getByRole('dialog').waitFor({ state: 'hidden' }); assert.equal(rows.filter(row => row.judul === 'Retry QA').length, 1);
  await admin.getByRole('button', { name: 'Tambah Event', exact: true }).click(); await field('Judul kegiatan (wajib)', 'Lost response QA'); await field('Tanggal mulai (wajib)', '2030-10-07'); loseSaveResponse = true;
  await selectCategory(admin, 'Penilaian Siswa (TKA, PSAS, PSAJ)');
  await admin.getByRole('button', { name: 'Simpan Event', exact: true }).click(); await admin.getByRole('dialog').getByRole('alert').waitFor();
  await admin.getByRole('button', { name: 'Simpan Event', exact: true }).click(); await admin.getByRole('dialog').waitFor({ state: 'hidden' }); assert.equal(rows.filter(row => row.judul === 'Lost response QA').length, 1);
  await add('Third QA'); await add('Fourth QA');
  await admin.locator('[data-admin-date="2030-10-06"]').getByRole('button', { name: '+2 lainnya', exact: true }).click(); await admin.getByRole('dialog').getByText('Fourth QA', { exact: true }).waitFor(); await admin.keyboard.press('Escape');
  await field('Cari kegiatan', 'not found'); await admin.getByText('Tidak ada kegiatan yang cocok dengan pencarian.', { exact: true }).waitFor(); await field('Cari kegiatan', '');
  await admin.getByLabel('Bulan kalender admin').fill('2028-02'); assert.equal(await admin.locator('[data-admin-date="2028-02-29"]').count(), 1);
  await admin.getByLabel('Bulan kalender admin').fill('2026-12'); await admin.getByRole('button', { name: 'Bulan berikutnya', exact: true }).click(); assert.equal(await admin.getByLabel('Bulan kalender admin').inputValue(), '2027-01');
  // Existing records retain their category and other fields when edited without reclassification.
  rows.push({ ...rows[0], id: 'legacy-qa', judul: 'Legacy QA', kategori: 'akademik', status: 'published', lokasi: 'Legacy location', deskripsi: 'Legacy description' });
  await admin.getByRole('button', { name: 'Muat ulang kegiatan', exact: true }).click();
  await admin.getByText(/1 kegiatan memakai kategori lama/).waitFor();
  await admin.getByRole('button', { name: 'Edit Legacy QA', exact: true }).click();
  assert.match(await admin.getByRole('combobox', { name: 'Kategori Kegiatan' }).textContent(), /Akademik \(kategori lama\)/);
  await admin.getByRole('button', { name: 'Simpan Event', exact: true }).click(); await admin.getByRole('dialog').waitFor({ state: 'hidden' });
  assert.equal(rows.find(row => row.id === 'legacy-qa').kategori, 'akademik');
  assert.equal(rows.find(row => row.id === 'legacy-qa').deskripsi, 'Legacy description');
  assert.equal(rows.find(row => row.id === 'legacy-qa').lokasi, 'Legacy location');
  await publicPage.evaluate(() => window.dispatchEvent(new Event('focus')));
  await publicPage.locator('aside').getByText('Akademik (kategori lama)', { exact: true }).waitFor();
  console.log('PASS CRUD/retry and legacy category preservation; checking viewports.');
  for (const width of [1440, 1024, 768, 375, 320]) {
    await admin.setViewportSize({ width, height: 1000 }); await admin.getByLabel('Bulan kalender admin').fill('2030-10');
    assert.equal(await admin.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth), false);
    await admin.locator('aside ul').evaluate(element => { element.scrollTop = 0; });
    await admin.screenshot({ path: join(output, `admin-${width}.png`), fullPage: true });
    await admin.getByRole('button', { name: 'Tambah Event', exact: true }).click();
    assert.equal(await admin.getByRole('dialog').evaluate(el => el.scrollWidth > el.clientWidth), false);
    await admin.getByRole('combobox', { name: 'Kategori Kegiatan' }).click();
    assert.equal(await admin.getByRole('listbox').evaluate(el => el.scrollWidth > el.clientWidth), false);
    await admin.getByRole('dialog').screenshot({ path: join(output, `form-${width}.png`) });
    await admin.getByRole('option', { name: 'Libur awal Ramadhan', exact: true }).click();
    assert.match(await admin.getByRole('combobox', { name: 'Kategori Kegiatan' }).textContent(), /Libur awal Ramadhan/);
    await admin.keyboard.press('Escape');
    await publicPage.setViewportSize({ width, height: 1000 });
    assert.equal(await publicPage.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth), false);
    for (const view of [admin, publicPage]) {
      const typography = await view.locator('[data-event-legend] li span').first().evaluate(el => { const style = getComputedStyle(el); return { family: style.fontFamily, size: style.fontSize, weight: style.fontWeight, lineHeight: style.lineHeight }; });
      assert.match(typography.family, /Inter/); assert.equal(typography.size, '10px'); assert.equal(typography.weight, '600'); assert.equal(typography.lineHeight, '16.25px');
      const dots = await view.locator('[data-event-legend] img').evaluateAll(items => items.map(el => ({ width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height, loaded: el.complete && el.naturalWidth === 18 })));
      assert.ok(dots.every(dot => dot.loaded && dot.width === 18 && dot.height === 18));
      assert.equal(await view.locator('[data-event-legend]').evaluate(el => el.scrollWidth > el.clientWidth), false);
    }
    await publicPage.locator('#kalender').screenshot({ path: join(output, `public-${width}.png`) });
    results.push({ width, adminOverflow: false, publicOverflow: false, legend: '10 exact Figma colors', typography: 'Inter / 10px / 600 / 16.25px', dots: '18 x 18' });
  }
  failRead = true;
  await admin.getByRole('button', { name: 'Muat ulang kegiatan', exact: true }).click(); await admin.getByRole('alert').filter({ hasText: 'Tabel kegiatan belum tersedia.' }).waitFor();
  await publicPage.evaluate(() => window.dispatchEvent(new Event('focus'))); await publicPage.getByRole('alert').waitFor(); assert.equal(await publicPage.locator('[data-calendar-date]').count(), 0);
  failRead = false;
  await publicPage.getByRole('button', { name: 'Coba lagi', exact: true }).click(); await publicPage.locator('[data-calendar-date]').first().waitFor();
  assert.deepEqual(errors, []);
  await adminContext.close(); await publicContext.close();
  console.log('PASS mocked API UI: 10 Figma categories/colors in both legends and dropdown, keyboard selection, category edit/color sync, legacy edit preservation, protected CRUD/Draft privacy/retry, typography and five responsive admin/public/form viewports.');
} catch (error) {
  for (const [index, context] of browser.contexts().entries()) for (const [pageIndex, page] of context.pages().entries()) {
    await page.screenshot({ path: join(output, `failure-${index}-${pageIndex}.png`), fullPage: true });
    console.error('Failure page:', page.url(), await page.getByRole('heading').allTextContents());
  }
  throw error;
} finally { await writeFile(join(output, 'results.json'), JSON.stringify({ results, errors, records: rows.length }, null, 2)); await browser.close(); }
