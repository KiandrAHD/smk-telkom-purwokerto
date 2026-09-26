import assert from 'node:assert/strict';
import { getSignupBiodata, restoreSignupBiodata } from '../src/utils/ppdbIdentity.js';

assert.deepEqual(getSignupBiodata({ email: 'a@example.com', user_metadata: { ppdb: {
  nisn: ' 1234567890 ', namaLengkap: ' Siswa Baru ', whatsapp: '08123456789', jurusan: 'RPL', nik: '1234567890123456',
} } }), {
  email: 'a@example.com', nisn: '1234567890', namaLengkap: 'Siswa Baru', whatsapp: '08123456789', jurusan: 'RPL',
});
assert.deepEqual(getSignupBiodata({ email: 'a@example.com' }), { email: 'a@example.com' });
const user = { email: 'a@example.com', user_metadata: { ppdb: { namaLengkap: 'Nama akun', nisn: '1234567890' } } };
assert.deepEqual(restoreSignupBiodata({ namaLengkap: '', nisn: '' }, user), {
  email: 'a@example.com', namaLengkap: 'Nama akun', nisn: '1234567890',
});
assert.equal(restoreSignupBiodata({ namaLengkap: 'Nama terbaru' }, user).namaLengkap, 'Nama terbaru');
console.log('Identitas pendaftar PPDB: lulus');
