import assert from 'node:assert/strict';
import { createServer } from 'vite';
const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
try {
  const { eventPayload, validateEvent, toCalendarEvent, eventColor, getEventCategory, eventsOnDate, upcomingEvents } = await server.ssrLoadModule('/src/utils/events.js');
  const { eventsForMonth } = await server.ssrLoadModule('/src/utils/calendar.js');
  const valid = { judul: ' Kegiatan QA ', kategori: 'akademik', tanggal_mulai: '2028-02-29', status: 'draft' };
  const payload = eventPayload({ ...valid, id: 'injected', updated_at: 'injected' });
  assert.equal(payload.judul, 'Kegiatan QA'); assert.equal(payload.tanggal_selesai, null); assert.equal(payload.id, undefined); assert.equal(payload.updated_at, undefined);
  for (const data of [{ judul: ' ' }, { tanggal_mulai: '2027-02-29' }, { tanggal_mulai: '2028-02-30' }, { tanggal_selesai: '2028-02-28' }, { waktu_mulai: '24:00' }, { waktu_mulai: '09:00', waktu_selesai: '08:00' }, { status: 'public' }, { kategori: 'invalid' }, { link_informasi: 'javascript:alert(1)' }, { gambar_url: 'data:image/svg+xml,test' }, { ringkasan: 'a'.repeat(501) }]) assert(Object.keys(validateEvent({ ...valid, ...data })).length, JSON.stringify(data));
  assert.doesNotThrow(() => eventPayload({ ...valid, waktu_mulai: '23:00', tanggal_selesai: '2028-03-01', waktu_selesai: '01:00' }));
  for (const field of ['gambar_url', 'link_informasi']) {
    for (const value of ['http://example.com/info', 'https://user:password@example.com/info']) assert.ok(validateEvent({ ...valid, [field]: value })[field], 'Main HTTPS and credential restrictions remain enforced');
    assert.equal(validateEvent({ ...valid, [field]: 'https://example.com/info' })[field], undefined);
  }
  const mapped = toCalendarEvent({ ...payload, id: 'qa', tanggal_mulai: '2026-12-30', tanggal_selesai: '2027-01-02', waktu_mulai: '09:00:00', waktu_selesai: '10:00:00' });
  assert.equal(eventColor(mapped), 'bg-amber-50 text-amber-700');
  assert.equal(eventColor({ ...mapped, status: 'published' }), getEventCategory(mapped.category).badgeClass);
  assert.equal(mapped.start, '09:00'); assert.equal(eventsOnDate([mapped], '2027-01-01').length, 1); assert.equal(eventsOnDate([mapped], '2027-01-03').length, 0); assert.equal(eventsForMonth([mapped], 2027, 0).length, 1);
  const sameDay = { ...mapped, date: '2026-10-13', endDate: '2026-10-13', end: '09:00' };
  assert.equal(upcomingEvents([sameDay], new Date('2026-10-13T03:00:00Z')).length, 0, '10:00 WIB has passed an event ending at 09:00');
  assert.equal(upcomingEvents([sameDay], new Date('2026-10-13T01:00:00Z')).length, 1);
  console.log('PASS client validation, leap dates, date/time order, safe URLs, payload whitelist, multi-day/year events and WIB agenda.');
} finally { await server.close(); }
