import assert from 'node:assert/strict';
import { readFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const { PGlite } = await import(pathToFileURL(process.env.PGLITE_MODULE).href);
const { pgcrypto } = await import(pathToFileURL(process.env.PGLITE_MODULE.replace(/index\.js$/, 'contrib/pgcrypto.js')).href);
const directory = await mkdtemp(join(tmpdir(), 'school-event-db-'));
let db = new PGlite(directory, { extensions: { pgcrypto } });
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
  await db.exec(`INSERT INTO auth.users(id) VALUES ('${admin}'),('${other}'); INSERT INTO public.admins(user_id,nama) VALUES ('${admin}','QA Admin');`);
  const insert = (fields = '', values = '') => `INSERT INTO public.events(id,judul,tanggal_mulai${fields}) VALUES ('${id}','QA Event','2028-02-29'${values}) RETURNING id;`;
  await assert.rejects(() => run('SET LOCAL ROLE anon;', insert()), { code: '42501' });
  await assert.rejects(() => run(session(other), insert()), { code: '42501' });
  await run(session(admin), insert());
  assert.equal((await run('SET LOCAL ROLE anon;', 'SELECT id FROM public.events;')).length, 0, 'Draft hidden from anon');
  assert.equal((await run(session(other), 'SELECT id FROM public.events;')).length, 0, 'Draft hidden from nonadmin');
  assert.equal((await run(session(admin), 'SELECT id FROM public.events;')).length, 1);
  for (const assignment of ["judul=' '", "tanggal_selesai='2028-02-28'", "waktu_mulai='10:00',waktu_selesai='09:00'", "status='invalid'", "kategori='invalid'", "link_informasi='javascript:alert(1)'", "waktu_mulai='24:00'"]) await assert.rejects(() => run(session(admin), `UPDATE public.events SET ${assignment} WHERE id='${id}';`), { code: '23514' });
  await run(session(admin), `UPDATE public.events SET status='published',judul='Updated QA',tanggal_selesai='2028-03-01',waktu_mulai='23:00',waktu_selesai='01:00' WHERE id='${id}';`);
  assert.equal((await run('SET LOCAL ROLE anon;', 'SELECT judul FROM public.events;'))[0].judul, 'Updated QA');
  assert.equal((await run(session(other), `UPDATE public.events SET judul='Not allowed' WHERE id='${id}' RETURNING id;`)).length, 0);
  assert.equal((await run(session(other), `DELETE FROM public.events WHERE id='${id}' RETURNING id;`)).length, 0);
  await db.close(); db = new PGlite(directory, { extensions: { pgcrypto } });
  assert.equal((await run('SET LOCAL ROLE anon;', 'SELECT judul FROM public.events;'))[0].judul, 'Updated QA', 'Record survives database restart');
  await run(session(admin), `DELETE FROM public.events WHERE id='${id}';`);
  assert.equal((await run('SET LOCAL ROLE anon;', 'SELECT id FROM public.events;')).length, 0);
  console.log('PASS persistent database restart, admin create/update/delete, Published read, Draft privacy, nonadmin mutation denial and server constraints.');
} finally { await db.close(); }
