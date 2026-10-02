import { useLanguage } from '../../context/LanguageContext';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projectShowcase } from '../../data/dummyData';
import { slugify } from '../../utils/slug';
import ContentImage from '../ContentImage';

const JurusanShowcaseSection = () => {
  const { t, language } = useLanguage();
  const items = projectShowcase.items;
  const [start, setStart] = useState(0);

  // Geser satu kartu; indeks berputar supaya panah tidak pernah jadi jalan buntu.
  const move = (step) => {
    if (!step) return;
    setStart((s) => (s + step + items.length) % items.length);
  };
  const ordered = items.map((_, i) => items[(start + i) % items.length]);

  return (
    <section className="overflow-hidden bg-white py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-dark-900">
          {language === 'en' ? t('Pameran Proyek Siswa') : <>{projectShowcase.title}{' '}
          <span className="text-primary">{projectShowcase.titleAccent}</span>{' '}
          {projectShowcase.titleTail}</>}
        </h2>

        <div className="relative mt-7">
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label={t("Project sebelumnya")}
            className="absolute -left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-dark-100 bg-white text-dark-600 shadow-md transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-primary lg:-left-5"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label={t("Project berikutnya")}
            className="absolute -right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-dark-100 bg-white text-dark-600 shadow-md transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-primary lg:-right-5"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>

          <div
            key={start}
            // key memutar ulang animasi CSS saat navigasi; reduced motion tetap dihormati.
            className="grid grid-cols-1 gap-5 motion-safe:animate-masuk-halaman sm:grid-cols-2 lg:grid-cols-4"
          >
            {ordered.map((item, index) => (
              <Link
                key={item.title}
                to={`/jurusan/project/${slugify(item.title)}`}
                className={`overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-card transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-primary ${index === 0 ? 'block' : index === 1 ? 'hidden sm:block' : 'hidden lg:block'}`}
              >
                <div className="relative">
                  <ContentImage
                    src={item.image}
                    alt={t(item.imageAlt || item.title)}
                    className="w-full aspect-[16/10] object-cover object-top"
                  />
                  <span
                    className={`absolute bottom-2 left-2 rounded px-2 py-1 text-[9px] font-bold text-white ${item.tagClass}`}
                  >
                    {item.tag}
                  </span>
                </div>
                <h3 className="px-4 pt-3 font-heading text-sm font-bold leading-snug text-dark-900">
                  {t(item.title)}
                </h3>
                <p className="px-4 pb-4 pt-2 text-xs leading-relaxed text-dark-500">{t(item.description)}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {items.map((item, i) => (
            <button
              key={item.title}
              type="button"
              onClick={() => move(i - start)}
              aria-label={t('Mulai dari project {tag}', { tag: t(item.title) })}
              aria-current={i === start}
              className={`relative h-2 rounded-full transition-all before:absolute before:-inset-2 before:content-[''] ${
                i === start ? 'w-5 bg-primary' : 'w-2 bg-dark-200 hover:bg-dark-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default JurusanShowcaseSection;
