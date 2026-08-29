import { ensureSupabase } from './supabase';

const beritaTerbaruColumns = 'id, judul, penulis, status, created_at';
const ppdbTerbaruColumns = 'id, nama_lengkap, asal_sekolah, pilihan_jurusan, status, created_at';
const statusPpdb = ['menunggu', 'diproses', 'diterima', 'ditolak'];

const hitungBaris = async (client, table, filter) => {
  let query = client.from(table).select('id', { count: 'exact', head: true });
  if (filter) query = query.eq('status', filter);
  const { count, error } = await query;
  if (error) throw error;
  return count ?? 0;
};

export async function getDashboardStats() {
  const client = ensureSupabase();
  const [berita, pengumuman, prestasi, bkkAktif, ppdbTotal, ...statusCounts] = await Promise.all([
    hitungBaris(client, 'berita'),
    hitungBaris(client, 'pengumuman'),
    hitungBaris(client, 'prestasi'),
    hitungBaris(client, 'bkk', 'aktif'),
    hitungBaris(client, 'ppdb'),
    ...statusPpdb.map((status) => hitungBaris(client, 'ppdb', status)),
  ]);

  const [{ data: beritaTerbaru, error: beritaError }, { data: ppdbTerbaru, error: ppdbError }] = await Promise.all([
    client
      .from('berita')
      .select(beritaTerbaruColumns)
      .order('created_at', { ascending: false })
      .limit(5),
    client
      .from('ppdb')
      .select(ppdbTerbaruColumns)
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  if (beritaError) throw beritaError;
  if (ppdbError) throw ppdbError;

  return {
    counts: {
      berita,
      pengumuman,
      prestasi,
      bkkAktif,
      ppdbTotal,
      ppdbMenunggu: statusCounts[0],
      ppdbDiproses: statusCounts[1],
      ppdbDiterima: statusCounts[2],
      ppdbDitolak: statusCounts[3],
    },
    beritaTerbaru: beritaTerbaru ?? [],
    ppdbTerbaru: ppdbTerbaru ?? [],
  };
}
