// Warna badge diturunkan dari isinya, bukan ditentukan satu per satu di tiap
// halaman. Dengan begitu "Published" selalu hijau dan "Draft" selalu oranye di
// mana pun ia muncul, dan halaman pemanggil cukup menulis <StatusBadge nilai={...} />.
const NADA = {
  merah: 'bg-primary-50 text-primary',
  biru: 'bg-blue-50 text-blue-600',
  hijau: 'bg-green-50 text-green-600',
  oranye: 'bg-orange-50 text-orange-600',
  ungu: 'bg-purple-50 text-purple-600',
  abu: 'bg-dark-100 text-dark-600',
};

const PETA = {
  // status berita
  Published: 'hijau',
  Draft: 'oranye',
  // status pendaftar
  Diverifikasi: 'hijau',
  'Belum Diverifikasi': 'oranye',
  Ditolak: 'merah',
  // kategori berita
  Prestasi: 'merah',
  Kegiatan: 'biru',
  PPDB: 'oranye',
  BKK: 'ungu',
  // tingkat prestasi
  Nasional: 'merah',
  Provinsi: 'biru',
  Kota: 'ungu',
  // program keahlian
  PPLG: 'ungu',
  TJKT: 'ungu',
  DKV: 'ungu',
  AKL: 'ungu',
};

const StatusBadge = ({ nilai, nada }) => (
  <span
    className={`inline-flex items-center justify-center rounded-full px-4 py-1.5 text-[11px] font-bold ${
      NADA[nada ?? PETA[nilai] ?? 'abu']
    }`}
  >
    {nilai}
  </span>
);

export default StatusBadge;
