import { useEffect, useState } from 'react';
import PrestasiCarousel from './PrestasiCarousel';
import PublicDataState from './PublicDataState';
import SectionAccents from './SectionAccents';
import laurelBranch from '../assets/landing/laurel-branch.png';
import { prestasiData } from '../data/dummyData';
import { getPrestasi } from '../services/prestasiService';
import { toPrestasiItem } from '../utils/publicContent';

const AchievementsSection = () => {
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
  <section id="prestasi" className="relative overflow-hidden bg-white py-8 lg:py-12 2xl:min-h-[635px]">
    <SectionAccents variant="achievements" />

    <div className="relative mx-auto max-w-[1546px] px-4 sm:px-6 lg:px-8">
      {/* Judul diapit dua cabang laurel (sisi kanan = cabang yang sama, dicerminkan) */}
      <div className="flex items-center justify-center gap-3 sm:gap-6">
        <img
          src={laurelBranch}
          alt=""
          aria-hidden="true"
          className="hidden h-24 w-auto shrink-0 select-none sm:block lg:h-28"
        />
        <div className="text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-primary">
            {prestasiData.title}
          </h2>
          <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-dark-500">
            {prestasiData.subtitle}
          </p>
        </div>
        <img
          src={laurelBranch}
          alt=""
          aria-hidden="true"
          className="hidden h-24 w-auto shrink-0 -scale-x-100 select-none sm:block lg:h-28"
        />
      </div>

      {/* Kartu prestasi — carousel horizontal, dot ada di dalamnya */}
      <PublicDataState loading={loading} error={error} empty={!loading && !error && !items.length} label="prestasi" />
      {!loading && !error && items.length > 0 && <PrestasiCarousel items={items} />}

    </div>
  </section>
  );
};

export default AchievementsSection;
