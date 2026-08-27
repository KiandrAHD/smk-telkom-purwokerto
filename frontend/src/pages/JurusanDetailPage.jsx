import { useParams } from 'react-router-dom';
import DetailLayout from '../components/DetailLayout';
import SegeraHadirPage from './SegeraHadirPage';
import { jurusanDetail } from '../data/dummyData';

// Isi halaman diambil dari slug di URL, bukan ditulis ulang di sini — kartu mana
// pun yang diklik akan membuka data miliknya sendiri. Slug yang tidak dikenal
// (misal /prestasi/galeri yang halamannya belum dibangun) jatuh ke Segera Hadir.
const JurusanDetailPage = () => {
  const { slug } = useParams();
  const item = jurusanDetail.find((entri) => entri.slug === slug);

  if (!item) return <SegeraHadirPage />;

  return <DetailLayout item={item} backTo="/jurusan" backLabel="Jurusan" />;
};

export default JurusanDetailPage;
