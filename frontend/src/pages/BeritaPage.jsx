import { useLanguage } from '../context/LanguageContext';
import { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import Reveal from '../components/Reveal';
import BeritaHeroSection from '../components/berita/BeritaHeroSection';
import BeritaSorotSection from '../components/berita/BeritaSorotSection';
import RibbonDivider from '../components/RibbonDivider';
import BeritaKategoriSection from '../components/berita/BeritaKategoriSection';
import BeritaAgendaSection from '../components/berita/BeritaAgendaSection';
import StelaAISection from '../components/StelaAISection';
import PublicDataState from '../components/PublicDataState';
import { getPublishedBerita } from '../services/beritaService';
import { toBeritaItem } from '../utils/publicContent';

const BeritaPage = () => {
  const { t } = useLanguage();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    let active = true;
    getPublishedBerita()
      .then((rows) => active && setItems(rows.map(toBeritaItem)))
      .catch(() => active && setError('Berita belum dapat dimuat. Silakan coba lagi nanti.'))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [requestVersion]);

  return (
    <MainLayout>
      <BeritaHeroSection items={items} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PublicDataState onRetry={() => { setLoading(true); setError(''); setRequestVersion((value) => value + 1); }} loading={loading} error={error} empty={!loading && !error && items.length === 0} label={t("berita")} />
      </div>
      {!loading && !error && <Reveal><BeritaSorotSection items={items} /></Reveal>}
      <RibbonDivider />
      {!loading && !error && <Reveal>
        <BeritaKategoriSection items={items}>
          {(shown) => <BeritaAgendaSection items={shown} />}
        </BeritaKategoriSection>
      </Reveal>}
      <Reveal><StelaAISection /></Reveal>
    </MainLayout>
  );
};

export default BeritaPage;
