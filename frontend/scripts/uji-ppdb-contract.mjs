import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { ppdbAgama, ppdbJurusanPilihan, ppdbMataPelajaran, ppdbSemester, ppdbTahunLulus } from '../src/data/ppdbFormOptions.js';

// Source contract check only. SQL behavior is tested by database integration.
const sql = await readFile(new URL('../../supabase/migrations/008_ppdb_canonical_document_guard.sql', import.meta.url), 'utf8');
const sqlArray = name => {
  const raw = sql.match(new RegExp(`${name} constant text\\[\\] := ARRAY\\[([\\s\\S]*?)\\];`))?.[1];
  assert.ok(raw, `Missing documented canonical array ${name}`);
  return [...raw.matchAll(/'((?:[^']|'')*)'/g)].map(m => m[1].replace(/''/g, "'"));
};
for (const [name, expected] of Object.entries({ jurusan: ppdbJurusanPilihan, agama: ppdbAgama, tahun_lulus: ppdbTahunLulus, mata_pelajaran: ppdbMataPelajaran.map(s => s.nama), semester: ppdbSemester })) {
  assert.deepEqual(sqlArray(name), expected, `Frontend and SQL canonical values differ: ${name}`);
}
assert.match(sql, /jsonb_object_keys/);
assert.match(sql, /owner_id\s*=\s*NEW\.auth_user_id::text/);
assert.match(sql, /bucket_id\s*=\s*'ppdb-documents'/);
assert.match(sql, /FOR SHARE/i);
assert.match(sql, /BEFORE INSERT OR UPDATE OF/i);
assert.match(sql, /SECURITY DEFINER SET search_path = ''/);
assert.match(sql, /VOLATILE SECURITY DEFINER SET search_path = ''/);
assert.equal([...sql.matchAll(/pg_advisory_xact_lock/g)].length, 2, 'Insert and owner deletion must share the same lock');
console.log('PPDB SQL/frontend source contract matches; runtime SQL requires database integration.');
