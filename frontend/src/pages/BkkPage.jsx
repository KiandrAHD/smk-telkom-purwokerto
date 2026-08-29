import { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import Reveal from '../components/Reveal';
import BkkHeroSection from '../components/bkk/BkkHeroSection';
import BkkLowonganSection from '../components/bkk/BkkLowonganSection';
import BkkPklSection from '../components/bkk/BkkPklSection';
import BkkJalurKarierSection from '../components/bkk/BkkJalurKarierSection';
import BkkAlumniSection from '../components/bkk/BkkAlumniSection';
import CTASection from '../components/CTASection';
import PublicDataState from '../components/PublicDataState';
import { getActiveBkk } from '../services/bkkService';
import { toBkkItem } from '../utils/publicContent';

const BkkPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getActiveBkk()
      .then((rows) => active && setItems(rows.map(toBkkItem)))
      .catch(() => active && setError('Lowongan BKK belum dapat dimuat. Silakan coba lagi nanti.'))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  return (
    <MainLayout>
      <BkkHeroSection />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PublicDataState loading={loading} error={error} empty={!loading && !error && items.length === 0} label="lowongan aktif" />
      </div>
      <Reveal><BkkLowonganSection items={items} /></Reveal>
      <Reveal><BkkPklSection /></Reveal>
      <Reveal><BkkJalurKarierSection /></Reveal>
      <Reveal><BkkAlumniSection /></Reveal>
      <Reveal><CTASection /></Reveal>
    </MainLayout>
  );
};

export default BkkPage;
