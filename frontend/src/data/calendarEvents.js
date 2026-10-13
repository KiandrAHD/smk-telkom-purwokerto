// Contoh dari Figma 184:359, BUKAN jadwal resmi. Ganti dengan agenda terverifikasi saat API tersedia.
// date adalah tanggal kegiatan (YYYY-MM-DD), bukan tanggal publikasi artikel; waktu menggunakan WIB.
export const calendarEvents = [
  { id: 'figma-upacara', date: '2026-10-01', title: 'Upacara Kesaktian Pancasila', start: '06:30', end: '08:00', location: 'Lapangan Upacara', category: 'kegiatan' },
  { id: 'figma-tryout', date: '2026-10-02', title: 'Tryout TKA', start: '07:00', end: '12:00', location: 'Ruang Kelas', category: 'akademik' },
  ...[26, 27, 28, 29, 30].map(day => ({ id: `figma-tka-${day}`, date: `2026-10-${day}`, title: 'TKA', start: '07:00', end: '12:00', location: 'Ruang Kelas', category: 'akademik' })),
];
