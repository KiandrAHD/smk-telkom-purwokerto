import { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import Reveal from '../components/Reveal';
import PrestasiHeroSection from '../components/prestasi/PrestasiHeroSection';
import PrestasiUnggulanSection from '../components/prestasi/PrestasiUnggulanSection';
import RibbonDivider from '../components/RibbonDivider';
import PrestasiGaleriSection from '../components/prestasi/PrestasiGaleriSection';
import PrestasiPerjalananSection from '../components/prestasi/PrestasiPerjalananSection';
import PrestasiDukunganSection from '../components/prestasi/PrestasiDukunganSection';
import CTASection from '../components/CTASection';
import PublicDataState from '../components/PublicDataState';
import { getPrestasi } from '../services/prestasiService';
import { toPrestasiItem } from '../utils/publicContent';

const PrestasiPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getPrestasi()
      .then((rows) => active && setItems(rows.map(toPrestasiItem)))
      .catch(() => active && setError('Prestasi belum dapat dimuat. Silakan coba lagi nanti.'))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  return (
    <MainLayout>
      <PrestasiHeroSection />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PublicDataState loading={loading} error={error} empty={!loading && !error && items.length === 0} label="prestasi" />
      </div>
      <Reveal><PrestasiUnggulanSection items={items} /></Reveal>
      <RibbonDivider />
      <Reveal><PrestasiGaleriSection items={items} /></Reveal>
      <Reveal><PrestasiPerjalananSection /></Reveal>
      <Reveal><PrestasiDukunganSection /></Reveal>
      <Reveal><CTASection /></Reveal>
    </MainLayout>
  );
};

export default PrestasiPage;
