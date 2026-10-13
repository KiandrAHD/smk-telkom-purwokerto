import assert from 'node:assert/strict';
import { createServer } from 'vite';
const server = await createServer({ configFile: false, appType: 'custom', logLevel: 'silent', server: { middlewareMode: true }, plugins: [{ name: 'spmb-fixture', enforce: 'pre', resolveId(source) { if (source === './supabase') return '\0spmb-fixture'; }, load(id) { if (id === '\0spmb-fixture') return 'export const ensureSupabase = () => globalThis.__spmbFixture'; } }] });
const writes = [], filters = [], ranges = [];
let pages = [], error = null, abort, statistic = null;
globalThis.__spmbFixture = {
  from(table) {
    assert.equal(table, 'spmb_information');
    const query = {
      select: () => query, order: () => query,
      eq(field, value) { filters.push([field, value]); return query; },
      range(start, end) { ranges.push([start, end]); return query; },
      abortSignal(signal) { abort = signal; return query; },
      upsert(payload, options) { writes.push({ payload, options }); return query; },
      update(payload) { writes.push({ payload }); return query; }, delete: () => query,
      single: async () => ({ data: error ? null : { id: 'stable', ...writes.at(-1)?.payload }, error }),
      then(resolve) { resolve({ data: pages.shift() || [], error }); },
    }; return query;
  },
  rpc(name) { assert.equal(name, 'get_spmb_statistics'); const query = { abortSignal(signal) { abort = signal; return query; }, then(resolve) { resolve({ data: statistic, error }); } }; return query; },
};
try {
  const { getSpmbInformation, getSpmbStatistics, createSpmbInformation, updateSpmbInformation, deleteSpmbInformation, spmbInformationError } = await server.ssrLoadModule('/src/services/spmbInformationService.js');
  const valid = { jenis: 'syarat', judul: 'QA', deskripsi: 'Description', urutan: '1', status: 'published', sumber_url: '/spmb' };
  const controller = new AbortController(); pages = [Array.from({ length: 500 }, (_, id) => ({ id })), [{ id: 500 }]];
  assert.equal((await getSpmbInformation(true, controller.signal)).length, 501); assert.deepEqual(ranges, [[0, 499], [500, 999]]); assert.equal(abort, controller.signal);
  assert.deepEqual(filters, [['status', 'published'], ['status', 'published']]);
  await createSpmbInformation(valid, 'stable'); await createSpmbInformation(valid, 'stable'); assert.equal(writes[0].payload.id, writes[1].payload.id); assert.deepEqual(writes[0].options, { onConflict: 'id' });
  const result = await updateSpmbInformation('stable', { ...valid, judul: 'Edited', id: 'wrong' }); assert.equal(result.judul, 'Edited'); assert.equal(result.deskripsi, 'Description'); assert.equal(writes.at(-1).payload.id, undefined); assert.deepEqual(filters.at(-1), ['id', 'stable']);
  assert.equal(await getSpmbStatistics(controller.signal), null, 'Unavailable count is not fabricated'); statistic = { total_pendaftar: 0, diterima: 0, kuota_total: null, kuota_tersedia: null }; assert.deepEqual(await getSpmbStatistics(), statistic);
  error = { code: 'PGRST116' }; await assert.rejects(updateSpmbInformation('missing', valid), error); await assert.rejects(deleteSpmbInformation('missing'), error);
  error = { code: '42501' }; await assert.rejects(createSpmbInformation(valid, 'stable'), error);
  error = { code: 'PGRST205' }; await assert.rejects(getSpmbInformation(), error); assert.match(spmbInformationError(error), /012_spmb_information/);
  await assert.rejects(deleteSpmbInformation('00000000-0000-4000-8000-000000000012'));
  console.log('PASS SPMB service public filter/pagination/abort, stable UUID, correct update ID/payload, nullable stats and denied/missing/schema errors.');
} finally { delete globalThis.__spmbFixture; await server.close(); }
