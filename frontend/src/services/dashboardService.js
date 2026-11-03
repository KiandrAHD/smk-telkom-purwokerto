import { api } from './apiClient';

export async function getDashboardStats() {
  const [dashboard, statuses, beritaList] = await Promise.all([
    api.get('/api/admin/dashboard'),
    Promise.all(['menunggu', 'diproses', 'diterima', 'ditolak'].map((s) => api.get(`/api/admin/ppdb?status=${s}&limit=1`))),
    api.get('/api/berita?limit=5'),
  ]);
  const [menunggu, diproses, diterima, ditolak] = statuses.map((r) => r.pagination.total);
  return {
    counts: {
      berita: dashboard.counts.berita,
      pengumuman: dashboard.counts.pengumuman,
      prestasi: dashboard.counts.prestasi,
      bkkAktif: dashboard.counts.bkk,
      ppdbTotal: dashboard.counts.ppdb,
      ppdbMenunggu: menunggu,
      ppdbDiproses: diproses,
      ppdbDiterima: diterima,
      ppdbDitolak: ditolak,
    },
    beritaTerbaru: beritaList.data.map((row) => ({ id: row.id, judul: row.judul, penulis: row.penulis, status: row.status, created_at: row.createdAt })),
    ppdbTerbaru: dashboard.recentPpdb.map((row) => ({ id: row.id, nama_lengkap: row.namaLengkap, asal_sekolah: row.asalSekolah, pilihan_jurusan: row.pilihanJurusan, status: row.status, created_at: row.createdAt })),
  };
}
