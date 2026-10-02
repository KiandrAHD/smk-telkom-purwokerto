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

// Konten impor menyimpan atribusi "Sumber: URL"; buka artikel aslinya, bukan endpoint API.
export const getContentSource = (content) => {
  const match = String(content || '').match(/\bSumber:\s*(https?:\/\/[^\s<>"']+)/i);
  if (!match) return '';
  try {
    const url = new URL(match[1].replace(/[.,;]+$/, ''));
    return url.pathname.includes('/wp-json/') ? '' : url.href;
  } catch {
    return '';
  }
};

// Urutan kronologis tanpa mengubah urutan daftar utama; tanggal tidak valid ditaruh terakhir.
export const sortPengumumanTimeline = (items) => {
  const timestamp = (item) => Number.isFinite(Date.parse(item.iso)) ? Date.parse(item.iso) : Infinity;
  return [...items].sort((a, b) => timestamp(a) - timestamp(b));
};

export const getPengumumanCounts = (items, now = new Date()) => {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const afterTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2);
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - (today.getDay() + 6) % 7); // Minggu kalender dimulai Senin.
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const dates = items.map((item) => new Date(item.iso));
  return [[today, tomorrow], [tomorrow, afterTomorrow], [weekStart, weekEnd], [monthStart, monthEnd]]
    .map(([start, end]) => dates.filter((date) => date >= start && date < end).length);
};

// Kategori dan galeri memakai item yang sama dengan daftar berita, termasuk hasil filter.
export const getBeritaCategories = (items) => {
  const groups = new Map();
  for (const item of items) {
    const name = item.kategori || 'Berita';
    if (!groups.has(name)) groups.set(name, { name, items: [] });
    groups.get(name).items.push(item);
  }
  return [...groups.values()];
};

export const getBeritaGallery = (items) => items.filter((item) => item.slug && normalizeImage(item.image));

const contentWithLead = (value, summary) => {
  const paragraphs = splitContent(value);
  const lead = summary || paragraphs[0] || '';
  return { lead, body: paragraphs[0] === lead ? paragraphs.slice(1) : paragraphs };
};

export const toBeritaItem = (row) => ({
  ...row,
  title: row.judul,
  desc: row.ringkasan || row.konten,
  sourceUrl: getContentSource(row.konten),
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
  sourceUrl: getContentSource(row.konten),
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
  sourceUrl: getContentSource(row.deskripsi),
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
