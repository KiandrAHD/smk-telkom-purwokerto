import { useParams } from 'react-router-dom';
import DetailLayout from '../components/DetailLayout';
import SegeraHadirPage from './SegeraHadirPage';
import {
  agendaDetail,
  galeriDetail,
  guruDetail,
  panduanDetail,
  pklDetailLengkap,
  projectDetail,
  roadmapDetail,
} from '../data/dummyData';

// Tujuh jenis halaman detail pelengkap (agenda, galeri, panduan, PKL, roadmap,
// projek, guru) memakai kerangka yang sama persis: cari item berdasarkan slug,
// lalu serahkan ke DetailLayout. Membuat tujuh berkas yang hanya berbeda pada
// nama array-nya cuma menggandakan kode, jadi jenisnya dioper lewat prop dari
// definisi route.
//
// Halaman detail kategori utama (Jurusan, Prestasi, Berita, Pengumuman) tetap
// punya berkasnya sendiri karena masing-masing sudah punya isi tambahan yang
// berbeda-beda.
const KOLEKSI = {
  agenda: { data: agendaDetail, backTo: '/berita', backLabel: 'Berita' },
  galeri: { data: galeriDetail, backTo: '/galeri', backLabel: 'Galeri' },
  panduan: { data: panduanDetail, backTo: '/bkk/panduan', backLabel: 'Panduan Karier' },
  pkl: { data: pklDetailLengkap, backTo: '/bkk', backLabel: 'BKK' },
  roadmap: { data: roadmapDetail, backTo: '/bkk', backLabel: 'BKK' },
  project: { data: projectDetail, backTo: '/jurusan', backLabel: 'Jurusan' },
  guru: { data: guruDetail, backTo: '/tentang', backLabel: 'Tentang' },
};

const DetailPelengkapPage = ({ jenis }) => {
  const { slug } = useParams();
  const koleksi = KOLEKSI[jenis];
  const item = koleksi?.data.find((entri) => entri.slug === slug);

  if (!item) return <SegeraHadirPage />;

  return <DetailLayout item={item} backTo={koleksi.backTo} backLabel={koleksi.backLabel} />;
};

export default DetailPelengkapPage;
