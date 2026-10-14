import PageHeroCarousel from '../../components/PageHeroCarousel';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowRight } from 'lucide-react';
import HeroStatsBar from '../HeroStatsBar';
import HeroBadges from '../HeroBadges';
import { prestasiHero, prestasiStats } from '../../data/dummyData';
import hero640 from '../../assets/banners/prestasi-640.webp';
import hero960 from '../../assets/banners/prestasi-960.webp';

const PrestasiHeroSection = () => {
  const { t } = useLanguage();
  return (
  <section className="school-hero">
    <div className="hero-container">
      <PageHeroCarousel page="prestasi"><div className="hero-panel hero-panel--floating hero-panel--bleed hero-panel--achievements">
        <div className="hero-grid">
          <div className="hero-copy">
            <HeroBadges />

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
            srcSet={`${hero640} 640w, ${hero960} 960w, ${prestasiHero.image} 1106w`}
            sizes="(min-width: 1280px) 793px, (min-width: 1024px) 65vw, (min-width: 640px) calc(100vw - 3rem), calc(100vw - 2rem)"
            alt={t(prestasiHero.imageAlt)}
            width="1106"
            height="656"
            fetchPriority="high"
            decoding="async"
            className="hero-image"
          />
        </div>

      </div></PageHeroCarousel>
      <HeroStatsBar items={prestasiStats} />

    </div>
  </section>
  );
};

export default PrestasiHeroSection;
