import assert from 'node:assert/strict';
import { readFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const modulePath = process.env.PGLITE_MODULE;
assert.ok(modulePath, 'Set PGLITE_MODULE to the installed PGlite runtime.');
const { PGlite } = await import(pathToFileURL(modulePath).href);
const { pgcrypto } = await import(pathToFileURL(modulePath.replace(/index\.js$/, 'contrib/pgcrypto.js')).href);
const directory = await mkdtemp(join(tmpdir(), 'site-settings-db-'));
let db = new PGlite(directory, {extensions:{pgcrypto}});
const admin = '33333333-3333-4333-8333-333333333333';
const other = '22222222-2222-4222-8222-222222222222';
const session = id => `SET LOCAL ROLE authenticated; SELECT set_config('request.jwt.claims','{"sub":"${id}"}',true);`;
try {
  await db.exec(await readFile(new URL('../../supabase/tests/security-fixture.sql',import.meta.url),'utf8'));
  for (const name of ['001_initial_schema.sql','014_site_settings.sql']) await db.exec(await readFile(new URL('../../supabase/migrations/'+name,import.meta.url),'utf8'));
  await db.exec(`INSERT INTO auth.users VALUES ('${admin}'),('${other}'); INSERT INTO public.admins(user_id,nama) VALUES ('${admin}','Admin QA');`);
  await assert.rejects(db.exec(`BEGIN; SET LOCAL ROLE anon; UPDATE public.site_settings SET school_name='Forbidden'; COMMIT;`)); await db.exec('ROLLBACK');
  await db.exec(`BEGIN; ${session(other)} UPDATE public.site_settings SET school_name='Forbidden'; COMMIT;`);
  assert.equal((await db.query('SELECT school_name FROM site_settings')).rows[0].school_name,'SMK Telkom Purwokerto');
  for (const change of ["npsn='123'","academic_year='2027/2030'",'news_page_size=0',"website='javascript:alert(1)'", "phone='123'"]) {
    await assert.rejects(db.exec(`BEGIN; ${session(admin)} UPDATE site_settings SET ${change}; COMMIT;`)); await db.exec('ROLLBACK');
  }
  await db.exec(`BEGIN; ${session(admin)} UPDATE site_settings SET school_name='Sekolah QA',news_page_size=7,spmb_open=false WHERE revision=1; COMMIT;`);
  assert.equal((await db.query('SELECT revision FROM site_settings')).rows[0].revision,2);
  await db.exec(`BEGIN; ${session(admin)} UPDATE site_settings SET school_name='Stale write' WHERE revision=1; COMMIT;`);
  await assert.rejects(db.exec("INSERT INTO ppdb(nama_lengkap,asal_sekolah,pilihan_jurusan) VALUES ('QA','SMP QA','RPL')"));
  await assert.rejects(db.exec(`BEGIN; ${session(admin)} UPDATE site_settings SET revision=10; COMMIT;`)); await db.exec('ROLLBACK');
  await db.close(); db = new PGlite(directory,{extensions:{pgcrypto}});
  const row=(await db.query('SELECT * FROM site_settings')).rows[0];
  assert.equal(row.school_name,'Sekolah QA'); assert.equal(row.news_page_size,7); assert.equal(row.spmb_open,false);
  const publicRead=await db.exec('BEGIN; SET LOCAL ROLE anon; SELECT school_name FROM site_settings; COMMIT;');
  assert.ok(publicRead.some(result=>result.rows.some(row=>row.school_name==='Sekolah QA')));
  console.log('Settings SQL: admin write/readback, reopen persistence, anon/non-admin denial, constraints, stale revision and closed SPMB passed. Auth/Storage services are not simulated by this SQL test.');
} finally { await db.close(); }
