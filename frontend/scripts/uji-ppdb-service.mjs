import assert from 'node:assert/strict';
import { createServer } from 'vite';

const user = { id: 'siswa-1', email: 'siswa@example.com' };
const document = { type: 'application/pdf', size: 100 };
const path = `submissions/${user.id}/document.pdf`;

function buatClient({ existing = [], insertError = null } = {}) {
  const stored = new Set();
  const uploads = [];
  const removals = [];
  let inserts = 0;

  const client = {
    auth: { getUser: async () => ({ data: { user }, error: null }) },
    from(table) {
      if (table === 'ppdb_drafts') return { delete: () => ({ eq: async () => ({ error: null }) }) };
      assert.equal(table, 'ppdb');
      return {
        select: (columns) => {
          assert.equal(columns, 'id');
          return { eq: (column, id) => {
            assert.equal(column, 'auth_user_id');
            assert.equal(id, user.id);
            return { limit: async (count) => {
              assert.equal(count, 1);
              return { data: existing, error: null };
            } };
          } };
        },
        insert: () => {
          inserts += 1;
          return { select: () => ({ single: async () => ({ data: insertError ? null : { id: 'baru-1' }, error: insertError }) }) };
        },
      };
    },
    storage: {
      from(bucket) {
        assert.equal(bucket, 'ppdb-documents');
        return {
          upload: async (filePath) => {
            uploads.push(filePath);
            stored.add(filePath);
            return { error: null };
          },
          remove: async (paths) => {
            removals.push(...paths);
            paths.forEach((filePath) => stored.delete(filePath));
            return { error: null };
          },
        };
      },
    },
  };
  return { client, stored, uploads, removals, get inserts() { return inserts; } };
}

const server = await createServer({
  configFile: false,
  appType: 'custom',
  logLevel: 'silent',
  server: { middlewareMode: true },
  plugins: [{
    name: 'ppdb-test-client',
    enforce: 'pre',
    resolveId(source) { if (source === './supabase') return '\0ppdb-test-client'; },
    load(id) { if (id === '\0ppdb-test-client') return 'export const ensureSupabase = () => globalThis.__ppdbTestClient'; },
  }],
});

try {
  const { submitPpdb, savePpdbDraft, signUpPpdb } = await server.ssrLoadModule('/src/services/ppdbService.js');
  const submission = { nama_lengkap: 'Siswa', dokumen: document };

  const duplicate = buatClient({ existing: [{ id: 'sudah-ada' }] });
  globalThis.__ppdbTestClient = duplicate.client;
  await assert.rejects(submitPpdb(submission), { code: 'PPDB_DUPLICATE_SUBMISSION' });
  assert.equal(duplicate.inserts, 0);
  assert.deepEqual(duplicate.uploads, []);

  const insertError = new Error('Simpan gagal');
  const failed = buatClient({ insertError });
  globalThis.__ppdbTestClient = failed.client;
  await assert.rejects(submitPpdb(submission), (error) => error === insertError);
  assert.equal(failed.inserts, 1);
  assert.deepEqual(failed.uploads, [path]);
  assert.deepEqual(failed.removals, [path]);
  assert.equal(failed.stored.size, 0);

  const raceError = Object.assign(new Error('duplicate key value violates unique constraint "ppdb_one_submission_per_auth_user_idx"'), { code: '23505' });
  const raced = buatClient({ insertError: raceError });
  globalThis.__ppdbTestClient = raced.client;
  await assert.rejects(submitPpdb(submission), { code: 'PPDB_DUPLICATE_SUBMISSION' });
  assert.deepEqual(raced.removals, [path]);
  assert.equal(raced.stored.size, 0);

  // An old queued autosave must never write one account's data to another account.
  let draftWrites = 0;
  globalThis.__ppdbTestClient = {
    auth: { getUser: async () => ({ data: { user: { id: 'different-account' } } }) },
    from() { draftWrites += 1; throw new Error('Should not reach a write'); },
  };
  await assert.rejects(savePpdbDraft({ namaLengkap: 'Old draft' }, {}, user.id), /Sesi SPMB telah berubah/);
  assert.equal(draftWrites, 0);
  await assert.rejects(submitPpdb({ expectedUserId: user.id }), /Sesi SPMB telah berubah/);
  assert.equal(draftWrites, 0);

  const previousWindow = globalThis.window;
  let signup;
  globalThis.window = { location: { origin: 'http://localhost:5173' } };
  globalThis.__ppdbTestClient = { auth: { signUp: async (payload) => { signup = payload; return { data: {}, error: null }; } } };
  try {
    await signUpPpdb('qa@example.invalid', 'qa-password-only');
    assert.equal(signup.email, 'qa@example.invalid');
    assert.deepEqual(signup.options.data.ppdb, { nisn: '', namaLengkap: '', whatsapp: '', jurusan: '' }, 'Simple signup must not carry hidden identity from another draft');
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }

  console.log('Layanan pendaftaran PPDB: lulus');
} finally {
  delete globalThis.__ppdbTestClient;
  await server.close();
}
