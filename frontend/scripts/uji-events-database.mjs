import assert from 'node:assert/strict';
import { readFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createServer } from 'vite';
const { PGlite } = await import(pathToFileURL(process.env.PGLITE_MODULE).href);
const { pgcrypto } = await import(pathToFileURL(process.env.PGLITE_MODULE.replace(/index\.js$/, 'contrib/pgcrypto.js')).href);
const directory = await mkdtemp(join(tmpdir(), 'school-event-db-'));
let db = new PGlite(directory, { extensions: { pgcrypto } });
const vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
const root = new URL('../../supabase/', import.meta.url);
const admin = '11111111-1111-4111-8111-111111111111', other = '22222222-2222-4222-8222-222222222222';
const id = '33333333-3333-4333-8333-333333333333';
const session = who => `SET LOCAL ROLE authenticated; SELECT set_config('request.jwt.claims','{"sub":"${who}"}',true);`;
const run = async (role, sql) => {
  await db.exec(`BEGIN; ${role}`);
  try { const result = await db.exec(sql); await db.exec('COMMIT;'); return result.at(-1).rows; }
  catch (error) { await db.exec('ROLLBACK;'); throw error; }
};
try {
  await db.exec(await readFile(new URL('tests/security-fixture.sql', root), 'utf8'));
  await db.exec(await readFile(new URL('migrations/001_initial_schema.sql', root), 'utf8'));
  await db.exec(await readFile(new URL('migrations/010_calendar_events.sql', root), 'utf8'));
  await db.exec(`INSERT INTO public.events(judul,kategori,tanggal_mulai,deskripsi,lokasi) SELECT 'Legacy ' || category,category,'2028-02-29','Preserve description','Preserve location' FROM unnest(ARRAY['kegiatan','akademik','lomba','karier','lainnya']) AS category;`);
  const legacy = (await db.query('SELECT * FROM public.events ORDER BY id;')).rows;
  await db.exec(await readFile(new URL('migrations/011_event_categories.sql', root), 'utf8'));
  assert.deepEqual((await db.query('SELECT * FROM public.events ORDER BY id;')).rows, legacy, 'Migration preserves every legacy field');
  await db.exec(`INSERT INTO auth.users(id) VALUES ('${admin}'),('${other}'); INSERT INTO public.admins(user_id,nama) VALUES ('${admin}','QA Admin');`);
  const insert = () => `INSERT INTO public.events(id,judul,tanggal_mulai,kategori) VALUES ('${id}','QA Event','2028-02-29','upacara-nasional') RETURNING id;`;
  await assert.rejects(() => run('SET LOCAL ROLE anon;', insert()), { code: '42501' });
  await assert.rejects(() => run(session(other), insert()), { code: '42501' });
  await run(session(admin), insert());
  assert.equal((await run('SET LOCAL ROLE anon;', 'SELECT id FROM public.events;')).length, 0, 'Draft hidden from anon');
  assert.equal((await run(session(other), 'SELECT id FROM public.events;')).length, 0, 'Draft hidden from nonadmin');
  assert.equal((await run(session(admin), 'SELECT id FROM public.events;')).length, 6);
  const { eventCategories } = await vite.ssrLoadModule('/src/data/eventCategories.js');
  for (const category of eventCategories) {
    const saved = await run(session(admin), `UPDATE public.events SET kategori='${category.value}' WHERE id='${id}' RETURNING kategori;`);
    assert.equal(saved[0].kategori, category.value, 'Every shared official category is accepted by SQL');
  }
  await assert.rejects(() => run(session(admin), `UPDATE public.events SET kategori=NULL WHERE id='${id}';`), { code: '23502' });
  for (const assignment of ["judul=' '", "tanggal_selesai='2028-02-28'", "waktu_mulai='10:00',waktu_selesai='09:00'", "status='invalid'", "kategori='invalid'", "link_informasi='javascript:alert(1)'", "waktu_mulai='24:00'"]) await assert.rejects(() => run(session(admin), `UPDATE public.events SET ${assignment} WHERE id='${id}';`), { code: '23514' });
  await run(session(admin), `UPDATE public.events SET status='published',judul='Updated QA',kategori='penilaian-siswa',tanggal_selesai='2028-03-01',waktu_mulai='23:00',waktu_selesai='01:00' WHERE id='${id}';`);
  assert.equal((await run('SET LOCAL ROLE anon;', 'SELECT judul FROM public.events;'))[0].judul, 'Updated QA');
  assert.equal((await run(session(other), `UPDATE public.events SET judul='Not allowed' WHERE id='${id}' RETURNING id;`)).length, 0);
  assert.equal((await run(session(other), `DELETE FROM public.events WHERE id='${id}' RETURNING id;`)).length, 0);
  await db.close(); db = new PGlite(directory, { extensions: { pgcrypto } });
  assert.equal((await run('SET LOCAL ROLE anon;', 'SELECT judul FROM public.events;'))[0].judul, 'Updated QA', 'Record survives database restart');
  assert.equal((await run('SET LOCAL ROLE anon;', 'SELECT kategori FROM public.events;'))[0].kategori, 'penilaian-siswa', 'Category edit persists after restart');
  assert.deepEqual((await db.query(`SELECT * FROM public.events WHERE id <> '${id}' ORDER BY id;`)).rows, legacy);
  await run(session(admin), `DELETE FROM public.events WHERE id='${id}';`);
  assert.equal((await run('SET LOCAL ROLE anon;', 'SELECT id FROM public.events;')).length, 0);
  console.log('PASS non-destructive category migration, all 10 category IDs, legacy preservation, persistent category edit, admin CRUD, Draft privacy, RLS and server constraints.');
} finally { await db.close(); await vite.close(); }
