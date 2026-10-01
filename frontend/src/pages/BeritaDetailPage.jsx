import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DetailLayout from '../components/DetailLayout';
import BeritaDetailKonten from '../components/berita/BeritaDetailKonten';
import MainLayout from '../layouts/MainLayout';
import { getBeritaBySlug, getPublishedBerita } from '../services/beritaService';
import { toBeritaItem } from '../utils/publicContent';

const BeritaDetail = ({ slug }) => {
  const [item, setItem] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([getBeritaBySlug(slug), getPublishedBerita().catch(() => [])])
      .then(([row, rows]) => {
        if (!active) return;
        const current = toBeritaItem(row);
        setItem(current);
        setRelated(rows.map(toBeritaItem).filter((entry) => entry.slug !== slug).slice(0, 3));
      })
      .catch((requestError) => active && setError(requestError?.code === 'PGRST116'
        ? 'Berita tidak ditemukan.'
        : 'Berita belum dapat dimuat. Silakan coba lagi nanti.'))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [slug]);

  if (loading) return <MainLayout><p className="py-16 text-center text-sm text-dark-500">Memuat berita...</p></MainLayout>;
  if (error || !item) return <MainLayout><p className="py-16 text-center text-sm text-dark-500">{error || 'Berita tidak ditemukan.'}</p></MainLayout>;

  return (
    <DetailLayout item={item} backTo="/berita" backLabel="Berita">
      <BeritaDetailKonten item={item} relatedItems={related} />
    </DetailLayout>
  );
};

const BeritaDetailPage = () => {
  const { slug } = useParams();
  return <BeritaDetail key={slug} slug={slug} />;
};

export default BeritaDetailPage;
