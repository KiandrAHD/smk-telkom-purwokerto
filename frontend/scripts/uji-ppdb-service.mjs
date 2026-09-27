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
  const { submitPpdb } = await server.ssrLoadModule('/src/services/ppdbService.js');
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

  console.log('Layanan pendaftaran PPDB: lulus');
} finally {
  delete globalThis.__ppdbTestClient;
  await server.close();
}
