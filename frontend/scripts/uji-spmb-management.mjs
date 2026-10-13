import assert from 'node:assert/strict';
import { createServer } from 'vite';
const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
try {
  let domain;
  try { domain = await server.ssrLoadModule('/src/utils/spmbInformation.js'); }
  catch { assert.fail('Shared persistent SPMB information contract is not implemented'); }
  const { emptySpmbInfo, spmbInfoPayload, validateSpmbInfo, registrationForSpmb, toSpmbWave } = domain;
  const valid = { ...emptySpmbInfo, jenis: 'jadwal', judul: 'Gelombang QA', status: 'published', sumber_url: 'https://school.example/official', tanggal_mulai: '2028-02-29', tanggal_selesai: '2028-03-01' };
  for (const jenis of ['jadwal', 'timeline', 'skema', 'persyaratan', 'syarat']) assert.equal(spmbInfoPayload({ ...valid, jenis, id: 'injected', updated_at: 'injected' }).id, undefined);
  for (const overrides of [{ judul: '' }, { jenis: 'other' }, { status: 'other' }, { urutan: '-1' }, { urutan: '1.5' }, { tanggal_mulai: '2027-02-29' }, { tanggal_selesai: '2028-02-28' }, { sumber_url: '' }, { tautan_url: 'javascript:alert(1)' }, { tautan_url: '//evil.example' }, { tautan_url: '/\\evil.example' }, { kuota_total: '9' }]) assert.ok(Object.keys(validateSpmbInfo({ ...valid, ...overrides })).length, JSON.stringify(overrides));
  assert.doesNotThrow(() => spmbInfoPayload({ ...valid, tautan_url: '/spmb/status' }));
  assert.doesNotThrow(() => spmbInfoPayload({ ...valid, status: 'draft', sumber_url: '' }));
  const quota = spmbInfoPayload({ ...emptySpmbInfo, jenis: 'statistik', judul: 'Statistik Pendaftaran', status: 'published', kuota_total: '' });
  assert.equal(quota.kuota_total, null, 'Missing quota never becomes a made-up zero');
  for (const kuota_total of ['-1', '1.5', 'no']) assert.ok(validateSpmbInfo({ ...quota, kuota_total }).kuota_total);
  const rows = [
    { ...valid, id: 'draft', status: 'draft', tanggal_mulai: '2028-01-01', tanggal_selesai: '2028-12-31' },
    { ...valid, id: 'upcoming', judul: 'Next', tanggal_mulai: '2028-04-01', tanggal_selesai: '2028-04-30' },
    { ...valid, id: 'active', judul: 'Current' },
  ];
  const selected = registrationForSpmb(rows, { total_pendaftar: 12, kuota_tersedia: 7 }, Date.parse('2028-02-29T06:00:00Z'));
  assert.equal(selected.wave, 'Current'); assert.equal(selected.applicants, 12); assert.equal(selected.quota, 7);
  assert.equal(toSpmbWave(valid).closesAt, '2028-03-01T23:59:59+07:00');
  assert.equal(registrationForSpmb([], null).applicants, null);
  const uncertain = registrationForSpmb([
    { ...valid, id: 'closed', judul: 'Closed', tanggal_mulai: '2028-01-01', tanggal_selesai: '2028-01-31' },
    { ...valid, id: 'unknown', judul: 'Awaiting schedule', tanggal_mulai: null, tanggal_selesai: null },
  ], null, Date.parse('2028-03-01T00:00:00Z'));
  assert.equal(uncertain.wave, 'Awaiting schedule', 'An undated published wave must not make the whole intake look closed');
  console.log('PASS SPMB types, payload whitelist, published source, safe links, WIB dates, order, nullable quota and relevant wave selection.');
} finally { await server.close(); }
