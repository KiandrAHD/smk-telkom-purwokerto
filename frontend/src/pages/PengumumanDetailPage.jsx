import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DetailLayout from '../components/DetailLayout';
import PengumumanDetailKonten from '../components/pengumuman/PengumumanDetailKonten';
import MainLayout from '../layouts/MainLayout';
import { getPublishedPengumuman, getPengumumanBySlug } from '../services/pengumumanService';
import { toPengumumanItem } from '../utils/publicContent';

// Isi halaman diambil dari slug di URL, bukan ditulis ulang di sini — kartu mana
// pun yang diklik akan membuka data miliknya sendiri. Slug yang tidak dikenal
// (misal /prestasi/galeri yang halamannya belum dibangun) jatuh ke Segera Hadir.
const PengumumanDetailPage = () => {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([getPengumumanBySlug(slug), getPublishedPengumuman()])
      .then(([row, rows]) => {
        if (!active) return;
        setItem(toPengumumanItem(row));
        setRelated(rows.map(toPengumumanItem).filter((entry) => entry.slug !== slug).slice(0, 3));
      })
      .catch((requestError) => active && setError(requestError?.code === 'PGRST116'
        ? 'Pengumuman tidak ditemukan.'
        : 'Pengumuman belum dapat dimuat. Silakan coba lagi nanti.'))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [slug]);

  if (loading) return <MainLayout><p className="py-16 text-center text-sm text-dark-500">Memuat pengumuman...</p></MainLayout>;
  if (error || !item) return <MainLayout><p className="py-16 text-center text-sm text-dark-500">{error || 'Pengumuman tidak ditemukan.'}</p></MainLayout>;

  return (
    <DetailLayout item={item} backTo="/pengumuman" backLabel="Pengumuman">
      <PengumumanDetailKonten item={item} relatedItems={related} />
    </DetailLayout>
  );
};

export default PengumumanDetailPage;
