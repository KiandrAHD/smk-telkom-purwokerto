import { useLanguage } from '../../context/LanguageContext';
import { ArrowRight } from 'lucide-react';
import HeroStatsBar from '../HeroStatsBar';
import { bkkHero, bkkStats } from '../../data/dummyData';

const BkkHeroSection = () => {
  const { t } = useLanguage();
  return (
  <section className="school-hero">
    <div className="hero-container">
      <div className="hero-panel hero-panel--floating">
        <div className="hero-grid">
          <div className="hero-copy">
            <span className="inline-block rounded-md bg-primary-50 px-2.5 py-1 text-[10px] font-bold text-primary">
              {t(bkkHero.badge)}
            </span>

            <h1 className="mt-4 font-heading text-3xl sm:text-4xl lg:text-[1.75rem] xl:text-[2rem] font-extrabold leading-[1.2] tracking-tight text-dark-900">
              {t(bkkHero.title)}
              <br />
              <span className="whitespace-pre-line text-primary">{t(bkkHero.titleAccent)}</span>
            </h1>

            <p className="mt-4 max-w-md text-xs sm:text-sm leading-relaxed text-dark-500">
              {t(bkkHero.description)}
            </p>

            <a
              href="#lowongan"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-800"
            >
              {t(bkkHero.ctaText)}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <img
            src={bkkHero.image}
            alt={t(bkkHero.imageAlt)}
            width="1920"
            height="902"
            fetchPriority="high"
            className="hero-image"
          />
        </div>

      </div>
      <HeroStatsBar items={bkkStats} />
    </div>
  </section>
  );
};

export default BkkHeroSection;
