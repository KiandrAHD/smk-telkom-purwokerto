import PageHeroCarousel from '../../components/PageHeroCarousel';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowRight } from 'lucide-react';
import HeroStatsBar from '../HeroStatsBar';
import HeroBadges from '../HeroBadges';
import { bkkHero, bkkStats } from '../../data/dummyData';
import hero640 from '../../assets/banners/bkk-640.webp';
import hero960 from '../../assets/banners/bkk-960.webp';

const BkkHeroSection = () => {
  const { t } = useLanguage();
  return (
  <section className="school-hero">
    <div className="hero-container">
      <PageHeroCarousel page="bkk"><div className="hero-panel hero-panel--floating hero-panel--bleed hero-panel--careers">
        <div className="hero-grid">
          <div className="hero-copy">
            <HeroBadges />

            <h1 className="mt-4 font-heading text-3xl sm:text-4xl lg:text-[1.75rem] xl:text-[2rem] font-extrabold leading-[1.2] tracking-tight text-dark-900">
              {t(bkkHero.title)}
              <br />
              <span>{t(bkkHero.titleAccent)}</span>
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
            srcSet={`${hero640} 640w, ${hero960} 960w, ${bkkHero.image} 1106w`}
            sizes="(min-width: 1280px) 804px, (min-width: 1024px) 66vw, (min-width: 640px) calc(100vw - 3rem), calc(100vw - 2rem)"
            alt={t(bkkHero.imageAlt)}
            width="1106"
            height="656"
            fetchPriority="high"
            decoding="async"
            className="hero-image"
          />
        </div>

      </div></PageHeroCarousel>
      <HeroStatsBar items={bkkStats} />
    </div>
  </section>
  );
};

export default BkkHeroSection;
