import { ppdbAgama, ppdbJurusanPilihan, ppdbMataPelajaran, ppdbSemester, ppdbTahunLulus } from '../data/ppdbFormOptions.js';

const required = ['namaLengkap', 'nisn', 'whatsapp', 'jurusan', 'nik', 'agama', 'tempatLahir', 'tanggalLahir', 'jenisKelamin', 'alamat', 'namaSmp', 'tahunLulus'];

const invalid = (message) => {
  const error = new Error(message);
  error.code = 'PPDB_VALIDATION';
  throw error;
};

export const preparePpdbSubmission = (biodata, nilai) => {
  if (!biodata || required.some((key) => typeof biodata[key] !== 'string' || !biodata[key].trim())) {
    invalid('Lengkapi seluruh biodata pada halaman formulir sebelum mengirim berkas.');
  }
  if (!/^\d{10}$/.test(biodata.nisn.trim()) || !/^\d{16}$/.test(biodata.nik.trim())) {
    invalid('NISN harus 10 digit dan NIK harus 16 digit.');
  }
  if (!ppdbJurusanPilihan.includes(biodata.jurusan) || !ppdbAgama.includes(biodata.agama) || !ppdbTahunLulus.includes(biodata.tahunLulus) || !['Laki-laki', 'Perempuan'].includes(biodata.jenisKelamin)) {
    invalid('Periksa kembali pilihan jurusan, agama, tahun lulus, dan jenis kelamin.');
  }
  const grades = {};
  for (const subject of ppdbMataPelajaran) {
    for (const semester of ppdbSemester) {
      const key = `${subject.nama}|${semester}`;
      const raw = nilai?.[key];
      const score = Number(raw);
      if (raw === undefined || raw === null || String(raw).trim() === '' || !Number.isFinite(score) || score < 0 || score > 100) {
        invalid('Lengkapi seluruh nilai rapor dengan angka antara 0 dan 100.');
      }
      grades[key] = score;
    }
  }
  return {
    nama_lengkap: biodata.namaLengkap.trim(),
    nisn: biodata.nisn.trim(),
    nik: biodata.nik.trim(),
    agama: biodata.agama,
    asal_sekolah: biodata.namaSmp.trim(),
    tahun_lulus: biodata.tahunLulus,
    tempat_lahir: biodata.tempatLahir.trim(),
    tanggal_lahir: biodata.tanggalLahir,
    jenis_kelamin: biodata.jenisKelamin,
    alamat: biodata.alamat.trim(),
    no_hp: biodata.whatsapp.trim(),
    pilihan_jurusan: biodata.jurusan,
    nilai_rapor: grades,
  };
};
