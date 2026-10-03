import { useLanguage } from '../context/LanguageContext';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DetailLayout from '../components/DetailLayout';
import PengumumanDetailKonten from '../components/pengumuman/PengumumanDetailKonten';
import MainLayout from '../layouts/MainLayout';
import PublicDataState from '../components/PublicDataState';
import { getPublishedPengumuman, getPengumumanBySlug } from '../services/pengumumanService';
import { toPengumumanItem } from '../utils/publicContent';

const PengumumanDetail = ({ slug }) => {
  const { t } = useLanguage();

  const [item, setItem] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    if (loading || error || !item) document.title = `${t(error || 'Pengumuman')} | SMK Telkom Purwokerto`;
  }, [loading, error, item, t]);

  useEffect(() => {
    let active = true;
    Promise.all([getPengumumanBySlug(slug), getPublishedPengumuman().catch(() => [])])
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
  }, [slug, requestVersion]);

  if (loading || error || !item) return (
    <MainLayout><div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PublicDataState loading={loading} error={error || (!loading && 'Pengumuman tidak ditemukan.')} label="pengumuman" onRetry={error === 'Pengumuman tidak ditemukan.' ? undefined : () => { setLoading(true); setError(''); setRequestVersion((value) => value + 1); }} />
    </div></MainLayout>
  );

  return (
    <DetailLayout item={item} backTo="/pengumuman" backLabel="Pengumuman">
      <PengumumanDetailKonten item={item} relatedItems={related} />
    </DetailLayout>
  );
};

const PengumumanDetailPage = () => {
  const { slug } = useParams();
  return <PengumumanDetail key={slug} slug={slug} />;
};

export default PengumumanDetailPage;
