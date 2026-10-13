import assert from 'node:assert/strict';
import { createServer } from 'vite';

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
try {
  const { emptyEvent, validateEvent, eventPayload, toCalendarEvent, getEventCategory, eventColor } = await server.ssrLoadModule('/src/utils/events.js');
  const valid = { judul: 'QA kategori', tanggal_mulai: '2030-10-06', status: 'published' };
  const official = ['upacara-nasional', 'penilaian-siswa', 'libur-tahun-pelajaran', 'awal-pkl', 'hari-pertama-sekolah', 'hut-smk', 'libur-akhir-semester', 'perkiraan-kelulusan', 'cuti-bersama', 'libur-ramadhan'];
  for (const kategori of official) {
    assert.equal(validateEvent({ ...valid, kategori }).kategori, undefined, `Official category ${kategori} can be saved`);
    const payload = eventPayload({ ...valid, kategori, warna: '#wrong' });
    assert.equal(toCalendarEvent(payload).category, kategori);
    assert.equal(payload.warna, undefined, 'Only category ID is stored; color comes from the shared registry');
    assert.equal(eventColor(toCalendarEvent(payload)), getEventCategory(kategori).badgeClass, 'Published badges follow the official category registry');
    assert.equal(eventColor({ ...toCalendarEvent(payload), status: 'draft' }), 'bg-amber-50 text-amber-700', 'Draft badge tint from main remains distinct');
  }
  assert.equal(emptyEvent.kategori, '', 'New events require an explicit selection');
  assert.ok(validateEvent({ ...valid, kategori: '' }).kategori);
  assert.ok(validateEvent({ ...valid, kategori: 'unrecognized' }).kategori);
  for (const kategori of ['kegiatan', 'akademik', 'lomba', 'karier', 'lainnya']) {
    assert.equal(eventPayload({ ...valid, kategori }).kategori, kategori, 'Legacy categories are preserved');
    assert.equal(getEventCategory(kategori).legacy, true);
    assert.equal(getEventCategory(kategori).color, '#6B7280', 'Legacy records are not assigned an invented official category');
  }
  assert.equal(getEventCategory(null).label, 'Kategori belum ditentukan');
  assert.match(getEventCategory('unrecognized').label, /unrecognized/);
  assert.equal(getEventCategory('penilaian-siswa').color, '#0080FF');
  assert.equal(getEventCategory('cuti-bersama').color, '#16B900');
  console.log('PASS official category validation/payload, explicit selection, legacy preservation and neutral unknown fallback.');
} finally { await server.close(); }
