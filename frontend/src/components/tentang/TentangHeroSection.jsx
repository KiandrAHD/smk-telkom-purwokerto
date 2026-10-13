import { useLanguage } from '../../context/LanguageContext';
import { ArrowRight } from 'lucide-react';
import HeroBreadcrumb from '../HeroBreadcrumb';
import { heroData } from '../../data/dummyData';
import profilHeroEnglish from '../../assets/tentang/profil-hero-en.jpeg';

const TentangHeroSection = () => {
  const { t, language } = useLanguage();
  return (
  <section className="school-hero school-hero--profile">
    <div className="hero-container">
      <div className="hero-panel hero-panel--background hero-panel--floating isolate overflow-hidden">
        <div className="hero-background overflow-hidden">
          {/* Keep the crop window at the source panel ratio to exclude viewer margins. */}
          <div className={`relative w-full overflow-hidden rounded-[1.75rem] lg:absolute lg:right-0 lg:top-1/2 lg:h-full lg:w-auto lg:-translate-y-1/2 ${language === 'en' ? 'aspect-[1277/652]' : 'aspect-[1600/751]'}`}>
            <img
              src={language === 'en' ? profilHeroEnglish : heroData.image}
              alt={`${t('Gedung SMK Telkom Purwokerto')}. ${heroData.badges.map((badge) => `${t(badge.title)}: ${t(badge.desc)}`).join('. ')}`}
              className={language === 'en' ? 'absolute left-[-2.82%] top-[-39.72%] w-[105.48%] max-w-none' : 'h-full w-full object-cover'}
            />
          </div>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] hidden bg-linear-to-r from-white from-30% via-white/95 via-40% to-transparent to-62% lg:block" />

        <div className="hero-copy">
            <HeroBreadcrumb current="Profil Sekolah" parentTo={null} />

            <h1 className="whitespace-pre-line font-heading text-3xl font-extrabold leading-[1.2] tracking-tight text-dark-900 sm:text-4xl lg:text-[1.75rem] xl:text-[2rem]">
              {t(heroData.heading)}
              {'\n'}
              <span className="text-primary">{t(heroData.headingAccent)}</span>
            </h1>

            <p className="mt-4 max-w-md text-xs leading-relaxed text-dark-600 sm:text-sm lg:text-[13px]">
              {t(heroData.description)}
            </p>

            <a
              href="#profil"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold text-white transition-colors hover:bg-primary-800"
            >
              {t('Jelajahi Sekolah Kami')}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
        </div>
      </div>
    </div>
  </section>
  );
};

export default TentangHeroSection;
