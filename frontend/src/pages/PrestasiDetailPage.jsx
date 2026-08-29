import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DetailLayout from '../components/DetailLayout';
import PrestasiDetailKonten from '../components/prestasi/PrestasiDetailKonten';
import MainLayout from '../layouts/MainLayout';
import { getPrestasi, getPrestasiBySlug } from '../services/prestasiService';
import { toPrestasiItem } from '../utils/publicContent';

// Isi halaman diambil dari slug di URL, bukan ditulis ulang di sini — kartu mana
// pun yang diklik akan membuka data miliknya sendiri. Slug yang tidak dikenal
// (misal /prestasi/galeri yang halamannya belum dibangun) jatuh ke Segera Hadir.
const PrestasiDetailPage = () => {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([getPrestasiBySlug(slug), getPrestasi()])
      .then(([row, rows]) => {
        if (!active) return;
        setItem(toPrestasiItem(row));
        setRelated(rows.map(toPrestasiItem).filter((entry) => entry.slug !== slug).slice(0, 3));
      })
      .catch((requestError) => active && setError(requestError?.code === 'PGRST116'
        ? 'Prestasi tidak ditemukan.'
        : 'Prestasi belum dapat dimuat. Silakan coba lagi nanti.'))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [slug]);

  if (loading) return <MainLayout><p className="py-16 text-center text-sm text-dark-500">Memuat prestasi...</p></MainLayout>;
  if (error || !item) return <MainLayout><p className="py-16 text-center text-sm text-dark-500">{error || 'Prestasi tidak ditemukan.'}</p></MainLayout>;

  return (
    <DetailLayout item={item} backTo="/prestasi" backLabel="Prestasi">
      <PrestasiDetailKonten item={item} relatedItems={related} />
    </DetailLayout>
  );
};

export default PrestasiDetailPage;
