import assert from 'node:assert/strict';
import { createServer } from 'vite';

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
try {
  const { selectSchoolAgenda } = await server.ssrLoadModule('/src/utils/events.js');
  assert.equal(typeof selectSchoolAgenda, 'function', 'The public agenda needs its Published-only selector.');
  const event = (id, date, extra = {}) => ({ id, date, endDate: date, start: '', end: '', status: 'published', ...extra });
  const now = new Date('2026-10-13T03:00:00Z'); // 10:00 WIB
  const rows = [
    event('far', '2026-11-01'), event('draft', '2026-10-13', { status: 'draft' }),
    event('next', '2026-10-14'), event('ongoing', '2026-10-12', { endDate: '2026-10-15' }),
    event('older', '2026-10-01'), event('ended', '2026-10-13', { end: '09:00' }),
    event('today', '2026-10-13', { start: '11:00', end: '12:00' }),
  ];
  assert.deepEqual(selectSchoolAgenda(rows, now).map(item => item.id), ['ongoing', 'today', 'next'], 'Ongoing/upcoming events are ordered before past events, with a maximum of three.');
  assert.deepEqual(selectSchoolAgenda([rows[5], rows[4], rows[2]], now).map(item => item.id), ['next', 'ended', 'older'], 'The latest finished events fill only the remaining slots.');
  assert.deepEqual(selectSchoolAgenda([rows[2], rows[2], rows[3]], now).map(item => item.id), ['ongoing', 'next'], 'Duplicate IDs must not produce duplicate cards or fake fillers.');
  assert.deepEqual(selectSchoolAgenda([rows[1]], now), [], 'Draft events stay private even if handed to the selector.');
  assert.deepEqual(selectSchoolAgenda([], now), []);
  assert.deepEqual(rows.map(item => item.id), ['far', 'draft', 'next', 'ongoing', 'older', 'ended', 'today'], 'Selection must not reorder shared calendar input.');
  const overnight = event('overnight', '2026-10-12', { endDate: '2026-10-13', end: '00:15' });
  assert.deepEqual(selectSchoolAgenda([overnight, event('future', '2026-10-14')], new Date('2026-10-12T17:30:00Z')).map(item => item.id), ['future', 'overnight'], 'Past/future selection respects the WIB date and finishing time.');
  console.log('PASS School Agenda: Published privacy, ongoing/upcoming priority, recent-past fill, max three, dedupe, no input mutation and WIB boundaries.');
} finally { await server.close(); }
