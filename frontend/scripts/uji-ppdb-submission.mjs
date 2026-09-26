import assert from 'node:assert/strict';
import { preparePpdbSubmission } from '../src/utils/ppdbSubmission.js';
import { ppdbMataPelajaran, ppdbSemester } from '../src/data/ppdbFormOptions.js';

const biodata = {
  namaLengkap: ' Siswa ', nisn: '1234567890', whatsapp: '081234567890', jurusan: 'Rekayasa Perangkat Lunak (RPL)',
  nik: '1234567890123456', agama: 'Islam', tempatLahir: 'Purwokerto', tanggalLahir: '2010-01-01',
  jenisKelamin: 'Laki-laki', alamat: 'Purwokerto', namaSmp: 'SMP 1', tahunLulus: '2027',
};
const nilai = Object.fromEntries(ppdbMataPelajaran.flatMap((mapel) => ppdbSemester.map((semester) => [`${mapel.nama}|${semester}`, '85.5'])));
const fields = preparePpdbSubmission(biodata, nilai);
assert.equal(fields.nama_lengkap, 'Siswa');
assert.equal(fields.nik, biodata.nik);
assert.equal(fields.nilai_rapor['Matematika|Semester 1'], 85.5);
assert.equal(Object.keys(fields.nilai_rapor).length, 25);
assert.throws(() => preparePpdbSubmission(biodata, {}), { code: 'PPDB_VALIDATION' });
assert.throws(() => preparePpdbSubmission({ ...biodata, nik: '123' }, nilai), { code: 'PPDB_VALIDATION' });
console.log('Payload pendaftaran PPDB: lulus');
