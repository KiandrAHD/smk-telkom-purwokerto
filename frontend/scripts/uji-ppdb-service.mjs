import assert from 'node:assert/strict';
import { createServer } from 'vite';

const user = { id: 'siswa-1', email: 'siswa@example.com' };
const document = { type: 'application/pdf', size: 100 };

function buatBackend({ existing = null, insertError = null, spmbOpen = true } = {}) {
  const uploads = [];
  let inserts = 0;
  const backend = {
    me: async () => ({ user }),
    settings: async () => ({ data: { spmbOpen } }),
    mine: async () => ({ data: existing }),
    get: async (path) => path === '/api/ppdb/mine' ? { data: existing } : { data: {} },
    upload: async (_path, file) => { uploads.push(file); return { path: `submissions/${user.id}/document.pdf` }; },
    create: async () => { inserts += 1; if (insertError) throw insertError; return { data: { id: 'baru-1' } }; },
    post: async (path, body) => { void path; void body; inserts += 1; if (insertError) throw insertError; return { data: { id: 'baru-1' } }; },
    draftDelete: async () => {},
  };
  return { backend, uploads, get inserts() { return inserts; } };
}

const server = await createServer({
  configFile: false, appType: 'custom', logLevel: 'silent', server: { middlewareMode: true },
  plugins: [{
    name: 'ppdb-test-backend',
    enforce: 'pre',
    resolveId(source) { if (source === './apiClient' || source === './apiAuthService' || source === './siteSettingsService') return `\0ppdb-test-${source.slice(2)}`; },
    load(id) {
      if (id === '\0ppdb-test-apiClient') return `export const api = new Proxy({}, { get: (_target, property) => (...args) => globalThis.__ppdbTestBackend[property](...args) });`;
      if (id === '\0ppdb-test-apiAuthService') return 'export const apiMe = () => globalThis.__ppdbTestBackend.me();';
      if (id === '\0ppdb-test-siteSettingsService') return 'export const getSiteSettings = () => globalThis.__ppdbTestBackend.settings();';
    },
  }],
});

try {
  const { submitPpdb, signUpPpdb } = await server.ssrLoadModule('/src/services/ppdbService.js');
  const submission = { nama_lengkap: 'Siswa', dokumen: document };

  const closed = buatBackend({ spmbOpen: false });
  globalThis.__ppdbTestBackend = closed.backend;
  await assert.rejects(submitPpdb(submission), /ditutup/);
  await assert.rejects(signUpPpdb('student@example.invalid', 'not-used'), /ditutup/);
  assert.equal(closed.inserts, 0);
  assert.deepEqual(closed.uploads, []);

  const duplicate = buatBackend({ existing: { id: 'sudah-ada' } });
  globalThis.__ppdbTestBackend = duplicate.backend;
  await assert.rejects(submitPpdb(submission), { code: 'PPDB_DUPLICATE_SUBMISSION' });
  assert.equal(duplicate.inserts, 0);
  assert.deepEqual(duplicate.uploads, []);

  const insertError = new Error('Simpan gagal');
  const failed = buatBackend({ insertError });
  globalThis.__ppdbTestBackend = failed.backend;
  await assert.rejects(submitPpdb(submission), (error) => error === insertError);
  assert.equal(failed.inserts, 1);
  assert.equal(failed.uploads.length, 1);

  const raceError = Object.assign(new Error('duplikat'), { status: 409, code: 'duplicate_submission' });
  const raced = buatBackend({ insertError: raceError });
  globalThis.__ppdbTestBackend = raced.backend;
  await assert.rejects(submitPpdb(submission), { code: 'PPDB_DUPLICATE_SUBMISSION' });

  let creates = 0;
  globalThis.__ppdbTestBackend = { ...buatBackend().backend, me: async () => ({ user: { id: 'different-account' } }), create: async () => { creates += 1; return { data: {} }; } };
  await assert.rejects(submitPpdb({ expectedUserId: user.id }), /Sesi SPMB telah berubah/);
  assert.equal(creates, 0);

  let signup;
  globalThis.window = { location: { origin: 'http://localhost:5173' } };
  globalThis.__ppdbTestBackend = { ...buatBackend().backend, post: async (path, body) => { signup = { path, body }; return { user: {} }; } };
  try {
    await signUpPpdb('qa@example.invalid', 'qa-password-only');
    assert.equal(signup.body.email, 'qa@example.invalid');
    assert.equal(signup.body.password, 'qa-password-only');
    assert.equal(signup.path, '/api/auth/register');
  } finally { delete globalThis.window; }

  console.log('Layanan pendaftaran PPDB: lulus');
} finally {
  delete globalThis.__ppdbTestBackend;
  await server.close();
}
