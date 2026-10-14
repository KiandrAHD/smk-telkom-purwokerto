import { useLanguage } from '../context/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { landingHero, quickLinks } from '../data/dummyData';
import accountIcon from '../assets/landing/quick-access-account.svg';
import robotIcon from '../assets/landing/quick-access-robot.svg';
import sparkIcon from '../assets/landing/quick-access-spark.svg';
import sparkDot from '../assets/landing/quick-access-dot.svg';
import HeroPanel from './HeroPanel';
import HeroCarousel from './HeroCarousel';
import PageHeroCarousel from './PageHeroCarousel';

const icons = {
  userPlus: accountIcon,
  bot: robotIcon,
  sparkles: sparkIcon,
};

const HeroSection = ({ content = landingHero, links = quickLinks, media, breadcrumb, slides, page }) => {
  const { t } = useLanguage();
  return (
  <section className="school-hero">
    <div className="hero-container">
      {slides ? <HeroCarousel slides={slides} /> : page ? <PageHeroCarousel page={page}><HeroPanel content={content} media={media} breadcrumb={breadcrumb} /></PageHeroCarousel> : <HeroPanel content={content} media={media} breadcrumb={breadcrumb} />}

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
