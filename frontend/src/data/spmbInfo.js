// Source-backed announcement archive, not an operational schedule or applicant count.
export const spmbSources = {
  easy: 'https://smktelkom-pwt.sch.id/berita/spmb-smk-telkom-purwokerto-2027-2028-jalur-easy/',
  digitest: 'https://smktelkom-pwt.sch.id/pengumuman/spmb-digitest-1-ta-2027-2028-smk-telkom-purwokerto-resmi-dibuka-saatnya-jadi-bagian-dari-nextgens-stematel/',
};
export const spmbContact = { href: 'https://wa.me/6281229701800', number: '0812-2970-1800', source: spmbSources.digitest };
// Admin settings currently have no public schedule/count endpoint. Keep absent data explicit.
export const spmbRegistration = { opensAt: null, closesAt: null, wave: null, applicants: null };
export const spmbWaves = [
  { name: 'EASY', opensAt: null, closesAt: '2026-08-31T23:59:59+07:00', selectionAt: null, resultAt: null, source: spmbSources.easy },
  { name: 'DIGITEST 1', opensAt: null, closesAt: null, selectionAt: null, resultAt: null, source: spmbSources.digitest },
  { name: 'One Day Service', opensAt: null, closesAt: null, selectionAt: null, resultAt: null, source: null },
];
export const spmbSteps = [
  { title: 'Buat Akun', description: 'Registrasi akun', icon: 'account', href: '/spmb/daftar' },
  { title: 'Pengisian Data', description: 'Lengkapi identitas siswa', icon: 'data', href: '/spmb/formulir' },
  { title: 'Unggah Berkas', description: 'Unggah PDF gabungan', icon: 'upload', href: '/spmb/berkas' },
  { title: 'Pilih Jurusan', description: 'Tentukan pilihan kompetensi keahlian', icon: 'program', href: '/jurusan' },
  { title: 'Seleksi', description: 'Ikuti tahapan seleksi', icon: 'selection', href: '/spmb/status' },
  { title: 'Pengumuman', description: 'Lihat hasil penerimaan', icon: 'result', href: '/spmb/status' },
  { title: 'Daftar Ulang', description: 'Konfirmasi dan registrasi akhir', icon: 'register', href: '/spmb/status' },
];
export const spmbSchemes = [
  { title: 'EASY', description: 'Persiapkan pendaftaran lebih awal dan kenali keterampilan digital melalui Stematel Digital Class.', note: 'Informasi jalur 2027/2028', icon: 'easy', href: spmbSources.easy },
  { title: 'DIGITEST', description: 'Jalur penerimaan murid baru tahun ajaran 2027/2028. Lihat pengumuman sekolah untuk informasi selengkapnya.', note: 'Lihat pengumuman DIGITEST 1', icon: 'digitest', href: spmbSources.digitest },
  { title: 'One Day Service', description: 'Jadwal dan ketentuan layanan belum tersedia. Hubungi panitia untuk konfirmasi.', note: 'Tanyakan kepada panitia', icon: 'service', href: spmbContact.href },
];
