import { useLanguage } from '../../context/LanguageContext';
import { ArrowRight } from 'lucide-react';
import HeroStatsBar from '../HeroStatsBar';
import { prestasiHero, prestasiStats } from '../../data/dummyData';

const PrestasiHeroSection = () => {
  const { t } = useLanguage();
  return (
  <section className="school-hero">
    <div className="hero-container">
      <div className="hero-panel hero-panel--floating">
        <div className="hero-grid">
          <div className="hero-copy">
            <span className="inline-block rounded-md bg-primary-50 px-2.5 py-1 text-[10px] font-bold text-primary">
              {t(prestasiHero.badge)}
            </span>

            <h1 className="mt-4 font-heading text-3xl sm:text-4xl lg:text-[1.75rem] xl:text-[2rem] font-extrabold leading-[1.2] tracking-tight text-dark-900">
              {t(prestasiHero.title)}
              <br />
              <span className="whitespace-pre-line text-primary">{t(prestasiHero.titleAccent)}</span>
            </h1>

            <p className="mt-4 max-w-md text-xs sm:text-sm leading-relaxed text-dark-500">
              {t(prestasiHero.description)}
            </p>

            <a
              href="#galeri-prestasi"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-800"
            >
              {t(prestasiHero.ctaText)}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <img
            src={prestasiHero.image}
            alt={t(prestasiHero.imageAlt)}
            className="hero-image"
          />
        </div>

      </div>
      <HeroStatsBar items={prestasiStats} />

    </div>
  </section>
  );
};

export default PrestasiHeroSection;
