import { useLanguage } from '../context/LanguageContext';
import { useParams } from 'react-router-dom';
import DetailLayout from '../components/DetailLayout';
import JurusanDetailKonten from '../components/jurusan/JurusanDetailKonten';
import SegeraHadirPage from './SegeraHadirPage';
import { jurusanDetail } from '../data/dummyData';

// Isi halaman diambil dari slug di URL, bukan ditulis ulang di sini — kartu mana
// pun yang diklik akan membuka data miliknya sendiri. Slug yang tidak dikenal
// (misal /prestasi/galeri yang halamannya belum dibangun) jatuh ke Segera Hadir.
const JurusanDetailPage = () => {
  const { t } = useLanguage();
  const { slug } = useParams();
  const item = jurusanDetail.find((entri) => entri.slug === slug);

  if (!item) return <SegeraHadirPage />;

  const displayItem = {
    ...item,
    title: t(item.title), kategori: t(item.kategori), subtitle: t(item.subtitle),
    date: t(item.date), lead: t(item.lead), body: item.body.map((text) => t(text)),
    facts: item.facts.map((fact) => ({ ...fact, label: t(fact.label), value: t(fact.value) })),
  };

  return (
    <DetailLayout item={displayItem} backTo="/jurusan" backLabel={t('Jurusan')}>
      <JurusanDetailKonten item={item} />
    </DetailLayout>
  );
};

export default JurusanDetailPage;
