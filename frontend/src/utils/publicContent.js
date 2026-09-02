import heroPanel from '../assets/landing/hero-panel.jpg';
import logoTelkom from '../assets/bkk/logo-telkom.png';

export const formatPublicDate = (value, options = {}) => {
  if (!value) return 'Tanggal belum tersedia';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Tanggal belum tersedia';

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options,
  }).format(date);
};

export const splitContent = (value) =>
  String(value || '')
    .split(/\n{2,}|\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

export const normalizeImage = (value, fallback) => value || fallback;

export const toBeritaItem = (row) => ({
  ...row,
  title: row.judul,
  desc: row.ringkasan || row.konten,
  excerpt: row.ringkasan || row.konten,
  text: row.ringkasan || row.konten,
  image: normalizeImage(row.gambar_url, heroPanel),
  author: row.penulis || 'SMK Telkom Purwokerto',
  // Tabel `berita` belum punya kolom kategori; sampai ada, semua
  // berita berkategori sama. Pola fallback ini mengikuti toPrestasiItem,
  // yang tabelnya sudah punya kolomnya.
  kategori: row.kategori || 'Berita',
  date: formatPublicDate(row.created_at),
  iso: row.created_at || '',
  body: splitContent(row.konten),
  lead: row.ringkasan || row.konten,
});

export const toPengumumanItem = (row) => ({
  ...row,
  title: row.judul,
  desc: row.ringkasan || row.konten,
  image: normalizeImage(row.gambar_url, heroPanel),
  kategori: row.kategori || 'Pengumuman',
  tags: [row.kategori || 'Pengumuman'],
  date: formatPublicDate(row.tanggal || row.created_at),
  iso: row.tanggal || row.created_at || '',
  body: splitContent(row.konten),
  lead: row.ringkasan || row.konten,
  icon: 'megaphone',
  thumb: 'bg-primary-50',
  iconColor: 'text-primary',
});

export const toPrestasiItem = (row) => ({
  ...row,
  title: row.judul,
  desc: row.deskripsi,
  image: normalizeImage(row.gambar_url, heroPanel),
  level: row.tingkat || 'Prestasi',
  kategori: row.kategori || 'Prestasi',
  date: formatPublicDate(row.tanggal),
  iso: row.tanggal || row.created_at || '',
  body: splitContent(row.deskripsi),
  lead: row.deskripsi,
});

export const toBkkItem = (row) => ({
  ...row,
  role: row.posisi,
  company: row.perusahaan,
  location: row.lokasi || 'Lokasi belum tersedia',
  logo: normalizeImage(row.logo_url, logoTelkom),
  badges: [row.tipe_pekerjaan].filter(Boolean),
  tags: [row.tipe_pekerjaan, row.lokasi].filter(Boolean),
  deadlineLabel: row.deadline ? formatPublicDate(row.deadline) : 'Deadline tidak ditentukan',
});
