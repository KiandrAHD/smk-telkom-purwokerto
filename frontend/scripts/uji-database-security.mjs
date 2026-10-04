import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFile, readdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { ppdbMataPelajaran, ppdbSemester } from '../src/data/ppdbFormOptions.js';

const literal = value => `'${String(value).replace(/'/g, "''")}'`;
const root = new URL('../../supabase/', import.meta.url);
const embedded = process.env.PGLITE_MODULE;
let db;
let query;
if (embedded) {
  const { PGlite } = await import(pathToFileURL(embedded).href);
  const { pgcrypto } = await import(pathToFileURL(embedded.replace(/index\.js$/, 'contrib/pgcrypto.js')).href);
  db = new PGlite({ extensions: { pgcrypto } });
  query = async sql => (await db.exec(sql)).flatMap(result => result.rows.map(row => Object.values(row).map(v => String(v)).join('|'))).join('\n').trim();
} else {
  const address = new URL(process.env.SECURITY_DATABASE_URL ?? 'http://missing.invalid');
  assert.ok(['postgres:', 'postgresql:'].includes(address.protocol) && ['localhost', '127.0.0.1', '[::1]'].includes(address.hostname) && address.pathname === '/security_regression', 'Use a disposable loopback Postgres database named security_regression');
  query = sql => new Promise((resolve, reject) => {
    const proc = spawn(process.env.PSQL_PATH || 'psql', ['-X', '-q', '-t', '-A', '-v', 'ON_ERROR_STOP=1', '-v', 'VERBOSITY=verbose', '--dbname', address.href], { windowsHide: true });
    let stdout = '', stderr = '';
    proc.stdout.on('data', data => { stdout += data; });
    proc.stderr.on('data', data => { stderr += data; });
    proc.on('error', reject);
    proc.on('close', code => code === 0 ? resolve(stdout.trim()) : reject(Object.assign(new Error(stderr), { code: stderr.match(/ERROR:\s+([A-Z0-9]{5}):/)?.[1] })));
    proc.stdin.end(sql);
  });
}

const owner = '11111111-1111-4111-8111-111111111111';
const other = '22222222-2222-4222-8222-222222222222';
const admin = '33333333-3333-4333-8333-333333333333';
const grades = Object.fromEntries(ppdbMataPelajaran.flatMap(s => ppdbSemester.map(t => [`${s.nama}|${t}`, 85.5])));
const payload = {
  id: '44444444-4444-4444-8444-444444444444', auth_user_id: owner, nama_lengkap: 'Siswa fixture',
  nisn: '1234567890', nik: '1234567890123456', agama: 'Islam', asal_sekolah: 'SMP fixture',
  tahun_lulus: '2027', tempat_lahir: 'Purwokerto', tanggal_lahir: '2010-01-01', jenis_kelamin: 'Laki-laki',
  alamat: 'Purwokerto', no_hp: '081234567890', email: 'siswa@example.invalid',
  pilihan_jurusan: 'Rekayasa Perangkat Lunak (RPL)', nilai_rapor: grades,
  dokumen_url: `submissions/${owner}/document.pdf`, status: 'menunggu', catatan_admin: null,
};
const insert = data => {
  const columns = Object.keys(data).join(',');
  return `INSERT INTO public.ppdb (${columns}) SELECT ${columns} FROM jsonb_populate_record(NULL::public.ppdb, ${literal(JSON.stringify(data))}::jsonb);`;
};
const session = (id = owner) => `SET LOCAL ROLE authenticated; SELECT set_config('request.jwt.claims', ${literal(JSON.stringify({ sub: id, email: 'siswa@example.invalid' }))}, true);`;
const object = (path = payload.dokumen_url, id = owner) => `INSERT INTO storage.objects (bucket_id, name, owner_id) VALUES ('ppdb-documents', ${literal(path)}, ${literal(id)});`;
const submission = (data, storage = object()) => `BEGIN; ${storage} ${session()} ${insert(data)} ROLLBACK;`;
const denied = async (label, sql, code = '23514') => {
  try {
    await assert.rejects(() => query(sql), error => error.code === code, label);
  } finally { if (embedded) await query('ROLLBACK;'); }
  console.log(`SQL rejected: ${label}`);
};
const waitForActivity = async (marker, event) => {
  const until = Date.now() + 5000;
  while (Date.now() < until) {
    const count = await query(`SELECT count(*) FROM pg_stat_activity WHERE wait_event = ${literal(event)} AND query LIKE ${literal(`%${marker}%`)} AND pid <> pg_backend_pid();`);
    if (count === '1') return;
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  assert.fail(`Transaction did not reach expected ${event} barrier: ${marker}`);
};

try {
  await query(await readFile(new URL('tests/security-fixture.sql', root), 'utf8'));
  for (const file of (await readdir(new URL('migrations/', root))).filter(f => f.endsWith('.sql') && (!process.argv.includes('--before-008') || f < '008')).sort()) {
    await query(await readFile(new URL(`migrations/${file}`, root), 'utf8'));
  }
  await query(`INSERT INTO auth.users(id) VALUES (${literal(owner)}), (${literal(other)}), (${literal(admin)}); INSERT INTO public.admins(user_id,nama) VALUES (${literal(admin)}, 'Admin fixture');`);
  await query(submission(payload));
  console.log('SQL accepted: valid canonical submission and owned document');
  for (const [label, changes] of [
    ['invalid jurusan', { pilihan_jurusan: 'Jurusan asing' }], ['invalid agama', { agama: 'Pilihan asing' }],
    ['invalid graduation choice', { tahun_lulus: '2030' }], ['wrong 25 keys', { nilai_rapor: Object.fromEntries(Array.from({ length: 25 }, (_, i) => [`wrong-${i}`, 85])) }],
    ['missing grade key', { nilai_rapor: Object.fromEntries(Object.entries(grades).slice(1)) }],
    ['extra grade key', { nilai_rapor: { ...grades, extra: 85 } }],
    ['out-of-range grade', { nilai_rapor: { ...grades, [Object.keys(grades)[0]]: 101 } }],
    ['grade is a string', { nilai_rapor: { ...grades, [Object.keys(grades)[0]]: '85' } }],
    ["another user's document", { dokumen_url: `submissions/${other}/document.pdf` }],
  ]) await denied(label, submission({ ...payload, ...changes }));
  await denied('nonexistent document', submission(payload, ''));
  await denied('wrong metadata owner at correct path', submission(payload, object(payload.dokumen_url, other)));
  await denied('anonymous insert', `BEGIN; ${object()} SET LOCAL ROLE anon; ${insert(payload)} ROLLBACK;`, '42501');

  await query(`BEGIN; ${object()} ${session()} ${insert(payload)} COMMIT;`);
  await denied('invalid grade update', `BEGIN; ${session(admin)} UPDATE public.ppdb SET nilai_rapor = ${literal(JSON.stringify({ ...grades, [Object.keys(grades)[0]]: -1 }))}::jsonb WHERE id = ${literal(payload.id)}; ROLLBACK;`);
  await query(`BEGIN; ${session(admin)} UPDATE public.ppdb SET status = 'diterima', catatan_admin = 'Fixture' WHERE id = ${literal(payload.id)}; COMMIT;`);
  assert.equal(await query(`SELECT status FROM public.ppdb WHERE id = ${literal(payload.id)};`), 'diterima');
  assert.equal((await query(`BEGIN; ${session(other)} SELECT count(*) FROM public.ppdb; ROLLBACK;`)).split('\n').at(-1), '0', 'Other user cannot read submission');
  await query(`BEGIN; ${session()} DELETE FROM storage.objects WHERE name = ${literal(payload.dokumen_url)}; COMMIT;`);
  assert.equal(await query(`SELECT count(*) FROM storage.objects WHERE name = ${literal(payload.dokumen_url)};`), '1', 'Owner cannot delete a submitted document');
  await query(`INSERT INTO public.ppdb(nama_lengkap,asal_sekolah,pilihan_jurusan) VALUES ('Legacy','SMP','Legacy'); BEGIN; ${session(admin)} UPDATE public.ppdb SET status = 'diproses' WHERE auth_user_id IS NULL; COMMIT;`);
  assert.equal(await query('SELECT public FROM storage.buckets WHERE id = \'ppdb-documents\';'), embedded ? 'false' : 'f');
  console.log('SQL passed: update range, admin status/legacy, private bucket and ownership RLS');

  await query(`DELETE FROM public.ppdb WHERE auth_user_id = ${literal(owner)};`);
  await query(`BEGIN; SET TRANSACTION ISOLATION LEVEL REPEATABLE READ; ${session()} DELETE FROM storage.objects WHERE name = ${literal(payload.dokumen_url)}; COMMIT;`);
  assert.equal(await query(`SELECT count(*) FROM storage.objects WHERE name = ${literal(payload.dokumen_url)};`), '1', 'Owner cleanup fails closed under non-default isolation');
  await query(`BEGIN; ${session()} DELETE FROM storage.objects WHERE name = ${literal(payload.dokumen_url)}; COMMIT;`);
  assert.equal(await query(`SELECT count(*) FROM storage.objects WHERE name = ${literal(payload.dokumen_url)};`), '0', 'Owner may remove unsubmitted upload');
  if (!embedded) {
    await query(object());
    const finalizing = query(`BEGIN; ${session()} ${insert(payload)} SELECT /* SECURITY_DOCUMENT_RACE */ pg_sleep(2); COMMIT;`);
    await waitForActivity('SECURITY_DOCUMENT_RACE', 'PgSleep');
    const deleting = query(`BEGIN; ${session()} /* SECURITY_DOCUMENT_DELETE_RACE */ DELETE FROM storage.objects WHERE name = ${literal(payload.dokumen_url)}; COMMIT;`);
    await waitForActivity('SECURITY_DOCUMENT_DELETE_RACE', 'advisory');
    await Promise.all([finalizing, deleting]);
    assert.equal(await query(`SELECT count(*) FROM storage.objects WHERE name = ${literal(payload.dokumen_url)};`), '1', 'Concurrent owner DELETE must not orphan a finalized submission');
    console.log('SQL document race passed: owner DELETE began before submission commit and retained the document');
    await query(`DELETE FROM public.ppdb WHERE auth_user_id = ${literal(owner)};`);
    const cleanup = query(`BEGIN; ${session()} DELETE FROM storage.objects WHERE name = ${literal(payload.dokumen_url)}; SELECT /* SECURITY_CLEANUP_RACE */ pg_sleep(2); COMMIT;`);
    await waitForActivity('SECURITY_CLEANUP_RACE', 'PgSleep');
    const submit = denied('document deleted during finalization', `BEGIN; ${session()} /* SECURITY_SUBMIT_RACE */ ${insert(payload)} COMMIT;`);
    await waitForActivity('SECURITY_SUBMIT_RACE', 'advisory');
    await Promise.all([cleanup, submit]);
    assert.equal(await query(`SELECT count(*) FROM public.ppdb WHERE auth_user_id = ${literal(owner)};`), '0');
    console.log('SQL reverse document race passed: cleanup first prevents a submission referencing the removed object');
  } else {
    console.log('SQL document cleanup passed; native concurrent finalization/deletion race NOT VERIFIED in single-connection PGlite.');
  }

  for (const role of ['anon', 'authenticated']) await denied(`${role} quota RPC`, `BEGIN; SET LOCAL ROLE ${role}; SELECT public.reserve_ai_attempt('stela', 1); ROLLBACK;`, '42501');
  await query('TRUNCATE public.ai_daily_attempts;');
  if (embedded) {
    assert.equal(await query("SELECT public.reserve_ai_attempt('stela', 1);"), 'true');
    assert.equal(await query("SELECT public.reserve_ai_attempt('stela', 1);"), 'false');
    console.log('SQL quota sequential behavior passed. PGlite has one connection: native concurrent race NOT VERIFIED.');
  } else {
    const reserve = "BEGIN; SET LOCAL ROLE service_role; SELECT public.reserve_ai_attempt('stela', 1); SELECT pg_sleep(0.15); COMMIT;";
    const results = await Promise.all([query(reserve), query(reserve)]);
    assert.deepEqual(results.map(s => s.trim()).sort(), ['f', 't']);
    assert.equal(await query("SELECT public.reserve_ai_attempt('stela', 1);"), 'f', 'New connection cannot reset quota');
    console.log('SQL quota concurrent race passed: exactly one reservation across independent connections');
  }
  assert.equal(await query("SELECT attempts FROM public.ai_daily_attempts WHERE feature = 'stela';"), '1');
  console.log('Database security regression completed against disposable fixture schemas only.');
} finally { if (db) await db.close(); }
