import assert from 'node:assert/strict';
import { createServer } from 'vite';
const server = await createServer({ configFile: false, appType: 'custom', logLevel: 'silent', server: { middlewareMode: true }, plugins: [{
  name: 'events-test-client', enforce: 'pre',
  resolveId(source) { if (source === './supabase') return '\0events-test-client'; },
  load(id) { if (id === '\0events-test-client') return 'export const ensureSupabase = () => globalThis.__eventTestClient'; },
}] });
const writes = [], ranges = [], filters = [], uploads = [], removals = [];
let responseError = null, storageError = null, pages = [], signal;
globalThis.__eventTestClient = {
  from(table) {
    assert.equal(table, 'events');
    const query = {
      select: () => query, order: () => query,
      range(start, end) { ranges.push([start, end]); return query; },
      eq(field, value) { filters.push([field, value]); return query; },
      abortSignal(value) { signal = value; return query; },
      insert(payload) { writes.push({ kind: 'insert', payload }); return query; },
      update(payload) { writes.push({ kind: 'update', payload }); return query; },
      delete: () => query,
      single: async () => ({ data: responseError ? null : { id: 'stable-id', ...writes.at(-1)?.payload }, error: responseError }),
      then(resolve) { resolve({ data: pages.shift() || [], error: responseError }); },
    };
    return query;
  },
  storage: { from(bucket) { assert.equal(bucket, 'content-images'); return {
    upload: async (path, file, options) => { uploads.push({ path, file, options }); return { error: storageError }; },
    getPublicUrl: path => ({ data: { publicUrl: `https://storage.example/${path}` } }),
    remove: async paths => { removals.push(...paths); return { error: null }; },
  }; } },
};
try {
  const { getEvents, createEvent, updateEvent, deleteEvent, eventError } = await server.ssrLoadModule('/src/services/eventService.js');
  const valid = { judul: 'QA', kategori: 'akademik', tanggal_mulai: '2028-02-29', status: 'draft' };
  pages = [Array.from({ length: 500 }, (_, id) => ({ id })), [{ id: 500 }]];
  const controller = new AbortController();
  assert.equal((await getEvents(true, controller.signal)).length, 501);
  assert.deepEqual(ranges, [[0, 499], [500, 999]]); assert.equal(signal, controller.signal);
  assert.deepEqual(filters, [['status', 'published'], ['status', 'published']]);
  await createEvent(valid, 'stable-id');
  responseError = { code: '23505' };
  await assert.rejects(createEvent(valid, 'stable-id'), { code: '23505' });
  responseError = null;
  assert.equal(writes[0].payload.id, writes[1].payload.id); assert.equal(writes[0].payload.status, 'draft');
  assert.deepEqual(writes.slice(0, 2).map(write => write.kind), ['insert', 'insert'], 'Duplicate create must not become an implicit update');
  const categoryChange = await updateEvent('stable-id', { ...valid, kategori: 'penilaian-siswa', deskripsi: 'Keep description', lokasi: 'Keep location' });
  assert.equal(categoryChange.kategori, 'penilaian-siswa');
  assert.equal(categoryChange.deskripsi, 'Keep description'); assert.equal(categoryChange.lokasi, 'Keep location');
  assert.deepEqual(filters.at(-1), ['id', 'stable-id']);
  const file = new File([new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])], 'poster.png', { type: 'image/png' });
  await updateEvent('stable-id', { ...valid, image_file: file });
  assert.match(uploads.at(-1).path, /^events\//); assert.equal(uploads.at(-1).options.upsert, false);
  assert.match(writes.at(-1).payload.gambar_url, /^https:\/\/storage.example\/events\//); assert.equal('image_file' in writes.at(-1).payload, false);
  storageError = new Error('Storage unavailable'); const before = writes.length;
  await assert.rejects(createEvent({ ...valid, image_file: file }, 'stable-id'), { code: 'CONTENT_IMAGE_UPLOAD' }); assert.equal(writes.length, before);
  storageError = null; responseError = { code: '42501' };
  await assert.rejects(createEvent({ ...valid, image_file: file }, 'stable-id'), { code: '42501' }); assert.equal(removals.at(-1), uploads.at(-1).path);
  responseError = { code: 'PGRST116' }; await assert.rejects(deleteEvent('missing'), { code: 'PGRST116' }); await assert.rejects(updateEvent('missing', valid), { code: 'PGRST116' });
  responseError = { code: 'PGRST205' }; await assert.rejects(getEvents(true), { code: 'PGRST205' }); assert.match(eventError(responseError), /010_calendar_events/);
  console.log('PASS event service pagination, published filter, abort signal, stable create UUID, poster upload/cleanup failures, denied or missing writes and missing-table errors.');
} finally { delete globalThis.__eventTestClient; await server.close(); }
