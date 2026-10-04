import { ppdbAgama, ppdbJurusanPilihan, ppdbMataPelajaran, ppdbSemester, ppdbTahunLulus } from '../data/ppdbFormOptions.js';

export const ppdbFieldLabels = { namaLengkap: 'Nama Lengkap', nisn: 'NISN Siswa', whatsapp: 'Nomor WhatsApp', jurusan: 'Peminatan Jurusan', nik: 'NIK (Nomor Induk Kependudukan)', agama: 'Agama', tempatLahir: 'Tempat Lahir', tanggalLahir: 'Tanggal Lahir', jenisKelamin: 'Jenis Kelamin', alamat: 'Alamat Lengkap', namaSmp: 'Nama SMP / MTs', tahunLulus: 'Tahun Lulus' };

export const validatePpdbForm = (biodata, nilai) => {
  const errors = [];
  for (const [field, label] of Object.entries(ppdbFieldLabels)) {
    if (typeof biodata?.[field] !== 'string' || !biodata[field].trim()) {
      errors.push({ field, message: '{field} wajib diisi.', variables: { field: label } });
    }
  }
  for (const [field, digits] of [['nisn', 10], ['nik', 16]]) {
    if (biodata?.[field]?.trim() && !new RegExp(`^\\d{${digits}}$`).test(biodata[field].trim())) {
      errors.push({ field, message: '{field} harus terdiri dari {digits} digit.', variables: { field: ppdbFieldLabels[field], digits } });
    }
  }
  for (const [field, options] of [['jurusan', ppdbJurusanPilihan], ['agama', ppdbAgama], ['tahunLulus', ppdbTahunLulus], ['jenisKelamin', ['Laki-laki', 'Perempuan']]]) {
    if (biodata?.[field]?.trim() && !options.includes(biodata[field])) {
      errors.push({ field, message: 'Pilih {field} yang tersedia.', variables: { field: ppdbFieldLabels[field] } });
    }
  }
  for (const subject of ppdbMataPelajaran) {
    for (const semester of ppdbSemester) {
      const field = `${subject.nama}|${semester}`;
      const raw = nilai?.[field];
      const score = Number(raw);
      if (raw === undefined || raw === null || String(raw).trim() === '' || !Number.isFinite(score) || score < 0 || score > 100) {
        errors.push({ field, message: 'Nilai {subject} {semester} harus berupa angka 0–100.', variables: { subject: subject.nama, semester } });
      }
    }
  }
  return errors;
};

export const preparePpdbSubmission = (biodata, nilai) => {
  const issue = validatePpdbForm(biodata, nilai)[0];
  if (issue) {
    const error = new Error(issue.message.replace(/\{(\w+)\}/g, (_, key) => issue.variables[key]));
    error.code = 'PPDB_VALIDATION';
    error.field = issue.field;
    throw error;
  }
  const grades = {};
  for (const subject of ppdbMataPelajaran) {
    for (const semester of ppdbSemester) {
      const key = `${subject.nama}|${semester}`;
      const raw = nilai?.[key];
      const score = Number(raw);
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
