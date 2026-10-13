import { useLanguage } from '../context/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { landingHero, quickLinks } from '../data/dummyData';
import hero640 from '../assets/landing/beranda-hero-640.webp';
import hero960 from '../assets/landing/beranda-hero-960.webp';
import heroPanel from '../assets/landing/beranda-hero.webp';
import accountIcon from '../assets/landing/quick-access-account.svg';
import robotIcon from '../assets/landing/quick-access-robot.svg';
import sparkIcon from '../assets/landing/quick-access-spark.svg';
import sparkDot from '../assets/landing/quick-access-dot.svg';
import HeroBreadcrumb from './HeroBreadcrumb';
import HeroBadges from './HeroBadges';

const icons = {
  userPlus: accountIcon,
  bot: robotIcon,
  sparkles: sparkIcon,
};

const HeroSection = ({ content = landingHero, links = quickLinks, media, breadcrumb }) => {
  const { t } = useLanguage();
  return (
  <section className="school-hero">
    <div className="hero-container">
      <div className={`hero-panel hero-panel--floating hero-panel--bleed ${media?.composition === 'admissions' ? 'hero-panel--admissions' : 'hero-panel--students'}`}>
        <div className="hero-grid">
          <div className="hero-copy">
            {breadcrumb && <HeroBreadcrumb {...breadcrumb} />}
            <HeroBadges tags={content.hashtags} />

            <h1 className="mt-4 font-heading text-3xl sm:text-4xl lg:text-[1.75rem] xl:text-[1.875rem] font-extrabold leading-[1.2] tracking-tight text-dark-900">
              {t(content.title)}
              <br />
              <span className="text-primary">{t(content.titleAccent)}</span>
            </h1>

            <p className="mt-4 max-w-md text-xs sm:text-sm leading-relaxed text-dark-500">
              {t(content.description)}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to={content.primaryCta.href}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-800"
              >
                {t(content.primaryCta.label)}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={content.secondaryCta.href}
                className="inline-flex items-center gap-2 rounded-full border border-dark-200 bg-white px-6 py-3 text-sm font-semibold text-dark-700 transition-colors hover:border-primary hover:text-primary"
              >
                {t(content.secondaryCta.label)}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Panel merah + foto + watermark TELKOM (satu aset dari Figma) */}
          <img
            src={media?.src || heroPanel}
            srcSet={media?.srcSet || `${hero640} 640w, ${hero960} 960w, ${heroPanel} 1208w`}
            sizes="(min-width: 80rem) 876px, (min-width: 64rem) 72vw, (min-width: 40rem) calc(100vw - 3rem), calc(100vw - 2rem)"
            alt={t("Siswa SMK Telkom Purwokerto")}
            width={media?.width || 1208}
            height={media?.height || 679}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className={`hero-image ${media?.className || ''}`}
          />
        </div>

      </div>

        {/* Keep QAC in flow outside the hero border so its height reserves space below. */}
        <div data-quick-access className="hero-floating hero-floating--quick overflow-hidden">
          <div className="grid grid-cols-1 divide-y divide-dark-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:grid-cols-3">
            {links.map((item) => {
              return (
                <div key={item.title} className="quick-access-card flex min-w-0 gap-3 px-4 py-3">
                  <span aria-hidden="true" className="quick-access-icon relative flex aspect-[97/105] w-12 shrink-0 items-center justify-center self-start rounded-lg bg-primary sm:w-10 lg:w-12">
                    <img src={icons[item.icon]} alt="" className={`h-auto ${item.icon === 'userPlus' ? 'w-[59%]' : item.icon === 'bot' ? 'w-[69%]' : 'w-[58%]'}`} />
                    {item.icon === 'sparkles' && <><span className="absolute right-[18%] top-[20%] text-[10px] font-extrabold leading-none text-white">+</span><img src={sparkDot} alt="" className="absolute bottom-[24%] left-[16%] h-auto w-[10%]" /></>}
                  </span>
                  <div className="quick-access-content min-w-0 flex-1">
                    <p className="quick-access-title font-heading text-base font-bold leading-tight text-dark-900">
                      {t(item.title)}
                    </p>
                    <p className="quick-access-description text-xs text-dark-600 sm:text-[11px] lg:text-xs">
                      {t(item.desc)}
                    </p>
                    <Link
                      to={item.href}
                      className="quick-access-cta inline-flex min-h-9 items-center gap-1 text-xs font-semibold text-primary hover:underline sm:text-[11px] lg:text-xs"
                    >
                      {t(item.linkLabel)}
                      {/* flex-shrink-0 supaya panahnya tidak gepeng saat kolom
                          menyempit di layar kecil. */}
                      <ArrowRight className="h-3 w-3 flex-shrink-0" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
    </div>
  </section>
  );
};

export default HeroSection;
