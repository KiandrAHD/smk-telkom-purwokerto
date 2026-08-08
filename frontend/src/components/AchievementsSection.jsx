import AchievementCard from './AchievementCard';
import watermark from '../assets/landing/watermark-logo.png';
import laurelBranch from '../assets/landing/laurel-branch.png';
import { prestasiData } from '../data/dummyData';

const AchievementsSection = () => (
  <section id="prestasi" className="relative overflow-hidden bg-white py-8 lg:py-12">
    {/* Watermark logo dekoratif */}
    <img
      src={watermark}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute -left-10 top-10 hidden w-28 select-none opacity-40 lg:block"
    />
    <img
      src={watermark}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute -right-10 bottom-16 hidden w-32 select-none opacity-40 lg:block"
    />

    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* Kartu prestasi */}
      <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {prestasiData.items.map((item, i) => (
          <AchievementCard key={item.title} {...item} highlight={i === 0} />
        ))}
      </div>

      {/* Indikator carousel */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {prestasiData.items.map((item, i) => (
          <span
            key={item.title}
            className={`h-2 w-2 rounded-full ${i === 0 ? 'bg-primary' : 'bg-dark-200'}`}
          />
        ))}
      </div>
    </div>
  </section>
);

export default AchievementsSection;
