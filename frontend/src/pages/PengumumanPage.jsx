import { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import Reveal from '../components/Reveal';
import PengumumanHeroSection from '../components/pengumuman/PengumumanHeroSection';
import PengumumanPpdbSection from '../components/pengumuman/PengumumanPpdbSection';
import PengumumanStatsSection from '../components/pengumuman/PengumumanStatsSection';
import PengumumanDaftarSection from '../components/pengumuman/PengumumanDaftarSection';
import CTASection from '../components/CTASection';
import PublicDataState from '../components/PublicDataState';
import { getPublishedPengumuman } from '../services/pengumumanService';
import { toPengumumanItem } from '../utils/publicContent';

const PengumumanPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getPublishedPengumuman()
      .then((rows) => active && setItems(rows.map(toPengumumanItem)))
      .catch(() => active && setError('Pengumuman belum dapat dimuat. Silakan coba lagi nanti.'))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  return (
    <MainLayout>
      <PengumumanHeroSection />
      <Reveal><PengumumanPpdbSection /></Reveal>
      <Reveal><PengumumanStatsSection /></Reveal>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PublicDataState loading={loading} error={error} empty={!loading && !error && items.length === 0} label="pengumuman" />
      </div>
      <Reveal><PengumumanDaftarSection items={items} /></Reveal>
      <Reveal><CTASection /></Reveal>
    </MainLayout>
  );
};

export default PengumumanPage;
