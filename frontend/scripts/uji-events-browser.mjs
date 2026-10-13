/* global document, window */
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
let failSave = false, loseSaveResponse = false, failRead = false, requests = 0;
const user = id => ({ id, email: 'qa@example.invalid', role: 'authenticated', aud: 'authenticated', app_metadata: { provider: 'email' }, user_metadata: {} });
async function contextFor(id) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
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
  const field = (label, value) => admin.getByLabel(label, { exact: true }).fill(value);
  const add = async (title, published = false) => {
    await admin.getByRole('button', { name: 'Tambah Event', exact: true }).click();
    await field('Judul kegiatan (wajib)', title); await field('Tanggal mulai (wajib)', '2030-10-06');
    if (published) await admin.getByLabel('Status publikasi', { exact: true }).selectOption('published');
    await admin.getByRole('button', { name: 'Simpan Event', exact: true }).click();
    await admin.getByRole('dialog').waitFor({ state: 'hidden' });
  };
  await admin.getByRole('button', { name: 'Tambah Event', exact: true }).click();
  const before = requests;
  await admin.getByRole('button', { name: 'Simpan Event', exact: true }).click();
  await admin.getByText('Judul kegiatan wajib diisi.', { exact: true }).waitFor(); assert.equal(requests, before);
  await field('Judul kegiatan (wajib)', 'Invalid QA'); await field('Tanggal mulai (wajib)', '2030-10-06'); await field('Tanggal selesai', '2030-10-05');
  await admin.getByRole('button', { name: 'Simpan Event', exact: true }).click(); await admin.getByText('Tanggal selesai tidak boleh lebih awal dari tanggal mulai.', { exact: true }).waitFor();
  await field('Tanggal selesai', ''); await field('Waktu mulai (WIB)', '10:00'); await field('Waktu selesai (WIB)', '09:00');
  await admin.getByRole('button', { name: 'Simpan Event', exact: true }).click(); await admin.getByText('Waktu selesai harus setelah waktu mulai pada hari yang sama.', { exact: true }).waitFor();
  await admin.keyboard.press('Escape');
  await add('Draft QA'); await admin.reload(); await admin.getByLabel('Bulan kalender admin').fill('2030-10'); await admin.getByRole('button', { name: 'Detail Draft QA', exact: true }).waitFor();
  await publicPage.goto(base + '/kalender'); await publicPage.locator('[data-calendar-date]').first().waitFor();
  assert.equal(await publicPage.getByText('Draft QA', { exact: true }).count(), 0);
  await add('Published QA', true); await publicPage.evaluate(() => window.dispatchEvent(new Event('focus')));
  await publicPage.locator('input[type="month"]').fill('2030-10'); await publicPage.locator('[data-calendar-date="2030-10-06"]').click();
  await publicPage.locator('aside').getByRole('button', { name: /Published QA/ }).waitFor();
  const sameOriginPublic = await adminContext.newPage();
  await sameOriginPublic.goto(base + '/kalender'); await sameOriginPublic.locator('[data-calendar-date]').first().waitFor();
  await sameOriginPublic.locator('input[type="month"]').fill('2030-10'); await sameOriginPublic.locator('[data-calendar-date="2030-10-06"]').click();
  await sameOriginPublic.locator('aside').getByRole('button', { name: /Published QA/ }).waitFor();
  await admin.getByRole('button', { name: 'Detail Published QA', exact: true }).click(); await admin.getByRole('dialog').getByRole('button', { name: 'Edit Published QA', exact: true }).click();
  await field('Judul kegiatan (wajib)', 'Updated QA'); await field('Lokasi', 'Laboratorium QA'); await field('Deskripsi lengkap', '<script>window.qaXss=true</script>');
  await admin.getByRole('button', { name: 'Simpan Event', exact: true }).click(); await admin.getByRole('dialog').waitFor({ state: 'hidden' });
  assert.equal(rows.length, 2);
  await sameOriginPublic.locator('aside').getByRole('button', { name: /Updated QA/ }).waitFor();
  await publicPage.evaluate(() => window.dispatchEvent(new Event('focus'))); await publicPage.locator('aside').getByRole('button', { name: /Updated QA/ }).click();
  await publicPage.getByRole('dialog').getByText('Laboratorium QA', { exact: true }).waitFor(); assert.equal(await publicPage.evaluate(() => window.qaXss), undefined); await publicPage.keyboard.press('Escape');
  await admin.getByRole('button', { name: 'Edit Updated QA', exact: true }).click(); await admin.getByLabel('Status publikasi', { exact: true }).selectOption('draft');
  await admin.getByRole('button', { name: 'Simpan Event', exact: true }).click(); await admin.getByRole('dialog').waitFor({ state: 'hidden' });
  await publicPage.evaluate(() => window.dispatchEvent(new Event('focus'))); await publicPage.getByText('Belum ada kegiatan pada tanggal ini.', { exact: true }).waitFor();
  await admin.getByRole('button', { name: 'Edit Updated QA', exact: true }).click(); await admin.getByLabel('Status publikasi', { exact: true }).selectOption('published');
  await admin.getByRole('button', { name: 'Simpan Event', exact: true }).click(); await admin.getByRole('dialog').waitFor({ state: 'hidden' });
  await admin.getByRole('button', { name: 'Hapus Updated QA', exact: true }).click(); await admin.getByRole('dialog').getByRole('button', { name: 'Batal', exact: true }).click(); assert.equal(rows.length, 2);
  await admin.getByRole('button', { name: 'Hapus Updated QA', exact: true }).click(); await admin.getByRole('button', { name: 'Ya, Hapus', exact: true }).click(); await admin.getByRole('dialog').waitFor({ state: 'hidden' });
  await publicPage.evaluate(() => window.dispatchEvent(new Event('focus'))); await publicPage.getByText('Belum ada kegiatan pada tanggal ini.', { exact: true }).waitFor(); assert.equal(rows.length, 1);
  await admin.getByRole('button', { name: 'Tambah Event', exact: true }).click(); await field('Judul kegiatan (wajib)', 'Retry QA'); await field('Tanggal mulai (wajib)', '2030-10-06'); failSave = true;
  await admin.getByRole('button', { name: 'Simpan Event', exact: true }).click(); await admin.getByRole('dialog').getByRole('alert').waitFor(); assert.equal(rows.length, 1);
  await admin.getByRole('button', { name: 'Simpan Event', exact: true }).dblclick(); await admin.getByRole('dialog').waitFor({ state: 'hidden' }); assert.equal(rows.filter(row => row.judul === 'Retry QA').length, 1);
  await admin.getByRole('button', { name: 'Tambah Event', exact: true }).click(); await field('Judul kegiatan (wajib)', 'Lost response QA'); await field('Tanggal mulai (wajib)', '2030-10-07'); loseSaveResponse = true;
  await admin.getByRole('button', { name: 'Simpan Event', exact: true }).click(); await admin.getByRole('dialog').getByRole('alert').waitFor();
  await admin.getByRole('button', { name: 'Simpan Event', exact: true }).click(); await admin.getByRole('dialog').waitFor({ state: 'hidden' }); assert.equal(rows.filter(row => row.judul === 'Lost response QA').length, 1);
  await add('Third QA'); await add('Fourth QA');
  await admin.locator('[data-admin-date="2030-10-06"]').getByRole('button', { name: '+2 lainnya', exact: true }).click(); await admin.getByRole('dialog').getByText('Fourth QA', { exact: true }).waitFor(); await admin.keyboard.press('Escape');
  await field('Cari kegiatan', 'not found'); await admin.getByText('Tidak ada kegiatan yang cocok dengan pencarian.', { exact: true }).waitFor(); await field('Cari kegiatan', '');
  await admin.getByLabel('Bulan kalender admin').fill('2028-02'); assert.equal(await admin.locator('[data-admin-date="2028-02-29"]').count(), 1);
  await admin.getByLabel('Bulan kalender admin').fill('2026-12'); await admin.getByRole('button', { name: 'Bulan berikutnya', exact: true }).click(); assert.equal(await admin.getByLabel('Bulan kalender admin').inputValue(), '2027-01');
  for (const width of [1440, 1024, 768, 375, 320]) {
    await admin.setViewportSize({ width, height: 1000 }); await admin.getByLabel('Bulan kalender admin').fill('2030-10');
    assert.equal(await admin.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth), false);
    await admin.screenshot({ path: join(output, `admin-${width}.png`), fullPage: true });
    await admin.getByRole('button', { name: 'Tambah Event', exact: true }).click();
    assert.equal(await admin.getByRole('dialog').evaluate(el => el.scrollWidth > el.clientWidth), false);
    await admin.getByRole('dialog').screenshot({ path: join(output, `form-${width}.png`) }); await admin.keyboard.press('Escape');
    results.push({ width, overflow: false });
  }
  failRead = true;
  await admin.getByRole('button', { name: 'Muat ulang kegiatan', exact: true }).click(); await admin.getByRole('alert').filter({ hasText: 'Tabel kegiatan belum tersedia.' }).waitFor();
  await publicPage.evaluate(() => window.dispatchEvent(new Event('focus'))); await publicPage.getByRole('alert').waitFor(); assert.equal(await publicPage.locator('[data-calendar-date]').count(), 0);
  failRead = false;
  await publicPage.getByRole('button', { name: 'Coba lagi', exact: true }).click(); await publicPage.locator('[data-calendar-date]').first().waitFor();
  assert.deepEqual(errors, []);
  await adminContext.close(); await publicContext.close();
  console.log('PASS mocked API UI: protected routes, create/reload/edit/delete/cancel, Draft privacy, Published sync, validation/failure/retry/double-submit, many events, search, leap/year navigation, modal keyboard and five responsive viewports.');
} finally { await writeFile(join(output, 'results.json'), JSON.stringify({ results, errors, records: rows.length }, null, 2)); await browser.close(); }
