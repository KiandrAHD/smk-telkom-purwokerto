const BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

// Data menyimpan tanggal dalam format ISO (2025-05-24) supaya bisa langsung
// dipakai <input type="date">. Fungsi ini yang mengubahnya jadi "24 Mei 2025"
// untuk tampilan tabel. Sengaja tidak memakai Intl agar hasilnya sama persis
// di semua mesin, termasuk yang locale-nya bukan Indonesia.
export const formatTanggal = (iso) => {
  if (!iso) return '-';
  const [tahun, bulan, hari] = String(iso).split('-');
  if (!tahun || !bulan || !hari) return iso;
  const namaBulan = BULAN[Number(bulan) - 1];
  if (!namaBulan) return iso;
  return `${Number(hari)} ${namaBulan} ${tahun}`;
};
