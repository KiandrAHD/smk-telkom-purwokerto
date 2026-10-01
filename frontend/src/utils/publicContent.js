export const formatPublicDate = (value, options = {}, locale = 'id-ID') => {
  if (!value) return locale === 'en-US' ? 'Date unavailable' : 'Tanggal belum tersedia';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return locale === 'en-US' ? 'Date unavailable' : 'Tanggal belum tersedia';

  return new Intl.DateTimeFormat(locale, {
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

export const normalizeImage = (value) => typeof value === 'string' ? value.trim() : '';

const contentWithLead = (value, summary) => {
  const paragraphs = splitContent(value);
  const lead = summary || paragraphs[0] || '';
  return { lead, body: paragraphs[0] === lead ? paragraphs.slice(1) : paragraphs };
};

export const toBeritaItem = (row) => ({
  ...row,
  title: row.judul,
  desc: row.ringkasan || row.konten,
  excerpt: row.ringkasan || row.konten,
  text: row.ringkasan || row.konten,
  image: normalizeImage(row.gambar_url),
  author: row.penulis || 'SMK Telkom Purwokerto',
  // Tabel `berita` belum punya kolom kategori; sampai ada, semua
  // berita berkategori sama. Pola fallback ini mengikuti toPrestasiItem,
  // yang tabelnya sudah punya kolomnya.
  kategori: row.kategori || 'Berita',
  date: formatPublicDate(row.created_at),
  iso: row.created_at || '',
  ...contentWithLead(row.konten, row.ringkasan),
});

export const toPengumumanItem = (row) => ({
  ...row,
  title: row.judul,
  desc: row.ringkasan || row.konten,
  image: normalizeImage(row.gambar_url),
  kategori: row.kategori || 'Pengumuman',
  tags: [row.kategori || 'Pengumuman'],
  date: formatPublicDate(row.tanggal || row.created_at),
  iso: row.tanggal || row.created_at || '',
  ...contentWithLead(row.konten, row.ringkasan),
  icon: 'megaphone',
  thumb: 'bg-primary-50',
  iconColor: 'text-primary',
});

export const toPrestasiItem = (row) => ({
  ...row,
  title: row.judul,
  desc: row.deskripsi,
  image: normalizeImage(row.gambar_url),
  level: row.tingkat || 'Prestasi',
  kategori: row.kategori || 'Prestasi',
  date: formatPublicDate(row.tanggal),
  iso: row.tanggal || row.created_at || '',
  ...contentWithLead(row.deskripsi),
});

export const toBkkItem = (row) => ({
  ...row,
  role: row.posisi,
  company: row.perusahaan,
  location: row.lokasi || 'Lokasi belum tersedia',
  logo: normalizeImage(row.logo_url),
  badges: [row.tipe_pekerjaan].filter(Boolean),
  tags: [row.tipe_pekerjaan, row.lokasi].filter(Boolean),
  deadlineLabel: row.deadline ? formatPublicDate(row.deadline) : 'Deadline tidak ditentukan',
});
