/* global document, window, getComputedStyle */
import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.QA_URL || 'http://127.0.0.1:5197';
const output = process.env.QA_OUTPUT || join(tmpdir(), 'spmb-management-qa');
await mkdir(output, { recursive: true });
const env = await readFile(new URL('../.env', import.meta.url), 'utf8');
const apiUrl = env.match(/^VITE_SUPABASE_URL=(.+)$/m)[1].trim().replace(/^['"]|['"]$/g, '');
const storageKey = `sb-${new URL(apiUrl).hostname.split('.')[0]}-auth-token`;
const adminId = '11111111-1111-4111-8111-111111111111';
const quotaId = '00000000-0000-4000-8000-000000000012';
const groups = [['jadwal', 'Jadwal Pendaftaran'], ['timeline', 'Timeline Penerimaan'], ['skema', 'Skema Masuk'], ['persyaratan', 'Persyaratan Pendaftaran'], ['syarat', 'Syarat Umum']];
const initial = { deskripsi: 'Informasi QA', urutan: 1, tanggal_mulai: null, tanggal_selesai: null, tanggal_seleksi: null, tanggal_pengumuman: null, ikon: null, tautan_url: null, sumber_url: '/spmb', status: 'published', kuota_total: null };
const rows = [{ ...initial, id: quotaId, jenis: 'statistik', judul: 'Statistik Pendaftaran' }, ...groups.map(([jenis], index) => ({ ...initial, id: `seed-${index}`, jenis, judul: `Existing ${jenis}`, ...(jenis === 'jadwal' ? { tanggal_mulai: '2030-01-01', tanggal_selesai: '2030-12-31' } : {}) }))];
rows.push({ ...initial, id: 'digitest', jenis: 'skema', judul: 'DIGITEST', ikon: 'digitest' }, { ...initial, id: 'service', jenis: 'skema', judul: 'One Day Service', ikon: 'service' });
let failWrite = false;
const errors = [], results = [];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const user = id => ({ id, email: 'qa@example.invalid', aud: 'authenticated', role: 'authenticated', app_metadata: { provider: 'email' }, user_metadata: {} });
async function contextFor(id) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  context.setDefaultTimeout(15000);
  if (id) {
    const token = [Buffer.from('{"alg":"HS256"}').toString('base64url'), Buffer.from(JSON.stringify({ sub: id, role: 'authenticated', exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url'), 'fixture'].join('.');
    await context.addInitScript(({ storageKey, value }) => { if (['http:', 'https:'].includes(window.location.protocol)) localStorage.setItem(storageKey, JSON.stringify(value)); }, { storageKey, value: { access_token: token, refresh_token: 'qa', expires_at: Math.floor(Date.now() / 1000) + 3600, user: user(id) } });
  }
  context.on('page', page => page.on('pageerror', error => errors.push(error.message)));
  await context.route('**/auth/v1/**', route => route.fulfill({ contentType: 'application/json', body: JSON.stringify(user(id)) }));
  await context.route('**/rest/v1/**', async route => {
    const request = route.request(), url = new URL(request.url()), table = url.pathname.split('/').at(-1), method = request.method();
    let data = [];
    if (table === 'admins') data = id === adminId ? [{ id: adminId }] : [];
    if (table === 'get_spmb_statistics') { const capacity = rows.find(row => row.id === quotaId)?.kuota_total ?? null; data = { total_pendaftar: 16, diterima: 4, kuota_total: capacity, kuota_tersedia: capacity === null ? null : Math.max(0, capacity - 4) }; }
    if (table === 'spmb_information') {
      if (method === 'GET') data = rows.filter(row => (id === adminId || row.status === 'published') && (url.searchParams.get('status') !== 'eq.published' || row.status === 'published')).sort((a, b) => a.urutan - b.urutan || a.id.localeCompare(b.id));
      else {
        if (id !== adminId) return route.fulfill({ status: 403, contentType: 'application/json', body: '{"code":"42501"}' });
        if (failWrite) { failWrite = false; return route.fulfill({ status: 500, contentType: 'application/json', body: '{"code":"XX000"}' }); }
        const input = method === 'DELETE' ? null : request.postDataJSON();
        const index = rows.findIndex(row => row.id === (input?.id || url.searchParams.get('id')?.slice(3)));
        if (method === 'POST') { data = input; if (index < 0) rows.push(input); else rows[index] = input; }
        else if (method === 'PATCH' && index >= 0) { rows[index] = { ...rows[index], ...input }; data = rows[index]; }
        else if (method === 'DELETE' && index >= 0) { data = { id: rows[index].id }; rows.splice(index, 1); }
        else return route.fulfill({ status: 406, contentType: 'application/json', body: '{"code":"PGRST116"}' });
      }
    }
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify(data) });
  });
  return context;
}
let admin, publicPage;
try {
  for (const id of [null, 'other']) { const context = await contextFor(id), page = await context.newPage(); await page.goto(base + '/dashboard/informasi-spmb'); if (!id) await page.waitForURL(base + '/login'); else await page.getByText('403', { exact: false }).first().waitFor(); await context.close(); }
  const context = await contextFor(adminId); admin = await context.newPage(); publicPage = await context.newPage();
  await admin.goto(base + '/dashboard/informasi-spmb'); await admin.getByRole('heading', { name: 'Informasi SPMB', exact: true }).waitFor();
  await publicPage.goto(base + '/spmb'); await publicPage.getByText('Existing jadwal', { exact: true }).first().waitFor();
  assert.match(await admin.locator('[data-spmb-stat="total"]').innerText(), /16/);
  assert.match(await admin.locator('[data-spmb-stat="quota"]').innerText(), /Belum tersedia/);
  const statHeights = await admin.locator('[data-spmb-stat="total"]').evaluate(node => [...node.parentElement.children].map(card => card.getBoundingClientRect().height));
  assert.ok(Math.max(...statHeights) - Math.min(...statHeights) < 2, 'Desktop statistics must have matching heights.');
  const field = (label, value) => admin.getByLabel(label, { exact: true }).fill(value);
  const save = async () => { await admin.getByRole('button', { name: 'Simpan Informasi', exact: true }).click(); await admin.getByRole('dialog').waitFor({ state: 'hidden' }); };
  for (const [jenis, label] of groups) {
    const panel = admin.locator(`[data-spmb-group="${jenis}"]`);
    await panel.getByRole('button', { name: `Tambah ${label}`, exact: true }).click();
    await admin.getByRole('button', { name: 'Simpan Informasi', exact: true }).click(); await admin.getByText('Nama wajib diisi, maksimal 180 karakter.', { exact: true }).waitFor();
    const title = `QA ${jenis}`;
    await field('Nama', title); await field('Deskripsi', 'Deskripsi awal QA'); await field('Sumber informasi', '/spmb');
    await admin.getByLabel('Status publikasi', { exact: true }).selectOption('published');
    if (jenis === 'jadwal' || jenis === 'timeline') { await field('Tanggal mulai', '2030-02-01'); await field('Tanggal akhir', '2030-01-01'); await admin.getByRole('button', { name: 'Simpan Informasi', exact: true }).click(); await admin.getByText('Tanggal akhir tidak boleh sebelum tanggal mulai.', { exact: true }).waitFor(); await field('Tanggal akhir', '2030-02-28'); }
    await save(); const row = rows.find(item => item.judul === title); assert.ok(row);
    await publicPage.getByText(title, { exact: true }).first().waitFor();
    await panel.getByRole('button', { name: `Edit ${title}`, exact: true }).click(); assert.equal(await admin.getByLabel('Nama', { exact: true }).inputValue(), title);
    await field('Nama', title + ' diperbarui'); await field('Deskripsi', 'Deskripsi terbaru QA'); await field('Urutan', '0'); await save();
    assert.equal(rows.find(item => item.id === row.id).deskripsi, 'Deskripsi terbaru QA'); await publicPage.getByText(title + ' diperbarui', { exact: true }).first().waitFor();
    await admin.reload(); await panel.getByRole('button', { name: `Edit ${title} diperbarui`, exact: true }).click();
    await admin.getByLabel('Status publikasi', { exact: true }).selectOption('draft'); await save(); await publicPage.getByText(title + ' diperbarui', { exact: true }).first().waitFor({ state: 'hidden' });
    await panel.getByRole('button', { name: `Hapus ${title} diperbarui`, exact: true }).click(); await admin.getByRole('button', { name: 'Batal', exact: true }).click(); assert.ok(rows.some(item => item.id === row.id));
    await panel.getByRole('button', { name: `Hapus ${title} diperbarui`, exact: true }).click(); await admin.getByRole('button', { name: 'Ya, Hapus', exact: true }).click(); await admin.getByRole('dialog').waitFor({ state: 'hidden' }); assert.ok(!rows.some(item => item.id === row.id));
    console.log(`PASS persistent fixture CRUD/public sync: ${label}`);
  }
  await admin.getByRole('button', { name: 'Atur Kuota', exact: true }).click(); await field('Kuota total', '20'); await admin.getByRole('button', { name: 'Simpan Kuota', exact: true }).click(); await admin.getByRole('dialog').waitFor({ state: 'hidden' });
  await admin.locator('[data-spmb-stat="quota"]').getByText('16', { exact: true }).waitFor(); await publicPage.getByText('Kuota tersedia: 16', { exact: true }).waitFor();
  const panel = admin.locator('[data-spmb-group="syarat"]'); await panel.getByRole('button', { name: 'Tambah Syarat Umum', exact: true }).click();
  await field('Nama', 'Retry QA'); failWrite = true; await admin.getByRole('button', { name: 'Simpan Informasi', exact: true }).click(); await admin.getByRole('dialog').getByRole('alert').waitFor(); assert.equal(rows.filter(row => row.judul === 'Retry QA').length, 0);
  await save(); assert.equal(rows.filter(row => row.judul === 'Retry QA').length, 1);
  for (const width of [1440, 1024, 768, 375, 320]) {
    await admin.setViewportSize({ width, height: 1000 }); await publicPage.setViewportSize({ width, height: 1000 });
    if (width === 1440) assert.equal(await admin.locator('[data-spmb-group] [role="region"]').evaluateAll(nodes => nodes.some(node => node.scrollWidth > node.clientWidth)), false, 'All desktop table actions must fit without horizontal scrolling.');
    for (const [view, name] of [[admin, 'admin'], [publicPage, 'public']]) { assert.equal(await view.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth), false); await view.screenshot({ path: join(output, `${name}-${width}.png`), fullPage: true, animations: 'disabled' }); }
    assert.match(await admin.locator('[data-spmb-group="syarat"] h2').evaluate(el => getComputedStyle(el).fontFamily), /Inter/);
    await panel.getByRole('button', { name: 'Tambah Syarat Umum', exact: true }).click(); assert.equal(await admin.getByRole('dialog').evaluate(el => el.scrollWidth > el.clientWidth), false); await admin.getByRole('dialog').screenshot({ path: join(output, `form-${width}.png`) }); await admin.keyboard.press('Escape');
    results.push({ width, overflow: false });
  }
  assert.deepEqual(errors, []); await context.close();
  console.log('PASS all five information groups, auth, validation, reload, pub/Draft sync, quota, errors/retry, confirm delete and five responsive widths.');
} catch (error) { if (admin) await admin.screenshot({ path: join(output, 'failure.png'), fullPage: true }).catch(() => {}); throw error; }
finally { await writeFile(join(output, 'results.json'), JSON.stringify({ results, errors }, null, 2)); await browser.close(); }
