import assert from 'node:assert/strict';
import { readFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const { PGlite } = await import(pathToFileURL(process.env.PGLITE_MODULE).href);
const { pgcrypto } = await import(pathToFileURL(process.env.PGLITE_MODULE.replace(/index\.js$/, 'contrib/pgcrypto.js')).href);
const directory = await mkdtemp(join(tmpdir(), 'spmb-info-db-'));
let db = new PGlite(directory, { extensions: { pgcrypto } });
const root = new URL('../../supabase/', import.meta.url);
const admin = '11111111-1111-4111-8111-111111111111', other = '22222222-2222-4222-8222-222222222222';
const session = who => `SET LOCAL ROLE authenticated; SELECT set_config('request.jwt.claims','{"sub":"${who}"}',true);`;
const run = async (role, sql) => { await db.exec(`BEGIN; ${role}`); try { const result = await db.exec(sql); await db.exec('COMMIT;'); return result.at(-1).rows; } catch (error) { await db.exec('ROLLBACK;'); throw error; } };
const quotaId = '00000000-0000-4000-8000-000000000012';
try {
  await db.exec(await readFile(new URL('tests/security-fixture.sql', root), 'utf8'));
  await db.exec(await readFile(new URL('migrations/001_initial_schema.sql', root), 'utf8'));
  await db.exec(`INSERT INTO auth.users(id) VALUES ('${admin}'),('${other}'); INSERT INTO public.admins(user_id,nama) VALUES ('${admin}','QA'); INSERT INTO public.ppdb(nama_lengkap,asal_sekolah,pilihan_jurusan,status) VALUES ('Private Student','QA School','RPL','diterima'),('Private Student 2','QA School','RPL','menunggu');`);
  const privateBefore = (await db.query('SELECT * FROM public.ppdb ORDER BY id;')).rows;
  let migration;
  try { migration = await readFile(new URL('migrations/012_spmb_information.sql', root), 'utf8'); } catch { assert.fail('Persistent SPMB information migration is missing'); }
  await db.exec(migration);
  assert.deepEqual((await db.query('SELECT * FROM public.ppdb ORDER BY id;')).rows, privateBefore, 'Migration never changes applicant data');
  assert.equal((await run('SET LOCAL ROLE anon;', 'SELECT * FROM public.ppdb;')).length, 0, 'Applicant identities remain private');
  let stats = (await run('SET LOCAL ROLE anon;', 'SELECT public.get_spmb_statistics() AS stats;'))[0].stats;
  assert.deepEqual(stats, { total_pendaftar: 2, diterima: 1, kuota_total: null, kuota_tersedia: null });
  assert.ok(!JSON.stringify(stats).includes('Private Student'));
  const ids = [];
  for (const jenis of ['jadwal', 'timeline', 'skema', 'persyaratan', 'syarat']) {
    const sql = `INSERT INTO public.spmb_information(jenis,judul,status) VALUES ('${jenis}','QA ${jenis}','draft') RETURNING id;`;
    await assert.rejects(() => run('SET LOCAL ROLE anon;', sql), { code: '42501' });
    await assert.rejects(() => run(session(other), sql), { code: '42501' });
    const id = (await run(session(admin), sql))[0].id; ids.push(id);
    assert.equal((await run('SET LOCAL ROLE anon;', `SELECT id FROM public.spmb_information WHERE id='${id}';`)).length, 0);
    await assert.rejects(() => run(session(admin), `UPDATE public.spmb_information SET status='published' WHERE id='${id}';`), { code: '23514' });
    await run(session(admin), `UPDATE public.spmb_information SET status='published',sumber_url='/spmb',deskripsi='Updated',urutan=0 WHERE id='${id}';`);
    assert.equal((await run('SET LOCAL ROLE anon;', `SELECT deskripsi FROM public.spmb_information WHERE id='${id}';`))[0].deskripsi, 'Updated');
    assert.equal((await run(session(other), `UPDATE public.spmb_information SET judul='Bad' WHERE id='${id}' RETURNING id;`)).length, 0);
  }
  for (const assignment of ["judul=' '", "urutan=-1", "status='other'", "tautan_url='javascript:alert(1)'", "sumber_url='//evil.example'", "tanggal_mulai='2030-02-01',tanggal_selesai='2030-01-01'", "kuota_total=20"]) await assert.rejects(() => run(session(admin), `UPDATE public.spmb_information SET ${assignment} WHERE id='${ids[0]}';`), { code: '23514' });
  await run(session(admin), `UPDATE public.spmb_information SET kuota_total=5 WHERE id='${quotaId}';`);
  stats = (await run('SET LOCAL ROLE anon;', 'SELECT public.get_spmb_statistics() AS stats;'))[0].stats;
  assert.equal(stats.kuota_tersedia, 4);
  assert.equal((await run(session(admin), `DELETE FROM public.spmb_information WHERE id='${quotaId}' RETURNING id;`)).length, 0);
  await db.close(); db = new PGlite(directory, { extensions: { pgcrypto } });
  assert.equal((await run('SET LOCAL ROLE anon;', `SELECT deskripsi FROM public.spmb_information WHERE id='${ids[0]}';`))[0].deskripsi, 'Updated');
  for (const id of ids) { await run(session(admin), `DELETE FROM public.spmb_information WHERE id='${id}';`); assert.equal((await run('SET LOCAL ROLE anon;', `SELECT id FROM public.spmb_information WHERE id='${id}';`)).length, 0); }
  console.log('PASS SPMB migration/seed, five persistent CRUD groups, published-source validation, admin RLS, private applicant data, real count/null quota and quota subtraction.');
} finally { await db.close(); }
