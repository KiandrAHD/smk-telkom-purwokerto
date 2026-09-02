// Penyaringan lowongan BKK, dipisah dari komponennya supaya bisa dijalankan
// dan diuji tanpa browser maupun koneksi database.
//
// Tabel `bkk` hanya punya dua kolom yang bisa dipakai menyaring: `lokasi` dan
// `tipe_pekerjaan`. Tidak ada kolom kategori -- itulah sebabnya panel filter
// hanya menawarkan dua faset, bukan tiga.

// Pilihan dropdown diturunkan dari lowongan yang benar-benar ada, bukan daftar
// tetap. Daftar tetap menawarkan kota yang tidak punya lowongan sama sekali,
// sekaligus menyembunyikan kota yang punya.
export const opsiFilter = (items = []) => {
  const unik = (ambil) => [...new Set(items.map(ambil).filter(Boolean))].sort();
  return {
    lokasiOptions: unik((job) => job.lokasi),
    tipeOptions: unik((job) => job.tipe_pekerjaan),
  };
};

// Semua kriteria di-AND-kan: lowongan harus lolos semuanya. Kriteria yang
// kosong berarti "tidak menyaring".
export const saringLowongan = (items = [], { keyword = '', lokasi = '', tipe = '' } = {}) => {
  const q = keyword.trim().toLowerCase();
  return items.filter((job) => {
    const cocokTeks =
      !q ||
      job.role?.toLowerCase().includes(q) ||
      job.company?.toLowerCase().includes(q) ||
      job.tags?.some((t) => t.toLowerCase().includes(q));
    // Cocok persis pada kolom aslinya, bukan `includes` pada array turunan:
    // lokasi "Jakarta" tidak boleh ikut menangkap "Jakarta Selatan" hanya
    // karena substring-nya sama.
    const cocokLokasi = !lokasi || job.lokasi === lokasi;
    const cocokTipe = !tipe || job.tipe_pekerjaan === tipe;
    return cocokTeks && cocokLokasi && cocokTipe;
  });
};
