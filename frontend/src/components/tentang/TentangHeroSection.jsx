import { useLanguage } from '../../context/LanguageContext';
import { ArrowRight } from 'lucide-react';
import HeroBreadcrumb from '../HeroBreadcrumb';
import { heroData } from '../../data/dummyData';
import profilHeroEnglish from '../../assets/tentang/profil-hero-en.jpeg';

const TentangHeroSection = () => {
  const { t, language } = useLanguage();
  return (
  <section className="bg-white pt-4">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative isolate flex flex-col overflow-hidden rounded-[20px] border border-primary/30 bg-white pb-12 lg:block lg:min-h-[408px] lg:pb-16">
        <div className="relative order-2 mt-6 aspect-[1277/652] overflow-hidden lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:aspect-auto lg:w-[72%]">
          {/* Keep the crop window at the source panel ratio to exclude viewer margins. */}
          <div className="relative aspect-[1277/652] w-full overflow-hidden rounded-[20px] lg:absolute lg:right-0 lg:top-1/2 lg:h-full lg:w-auto lg:-translate-y-1/2">
            <img
              src={language === 'en' ? profilHeroEnglish : heroData.image}
              alt={`${t('Gedung SMK Telkom Purwokerto')}. ${heroData.badges.map((badge) => `${t(badge.title)}: ${t(badge.desc)}`).join('. ')}`}
              className={language === 'en' ? 'absolute left-[-2.82%] top-[-39.72%] w-[105.48%] max-w-none' : 'h-full w-full object-cover'}
            />
          </div>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] hidden bg-linear-to-r from-white from-30% via-white/95 via-40% to-transparent to-62% lg:block" />

        <div className="relative order-1 z-10 px-6 pt-6 sm:px-8 lg:w-[44%] lg:px-8 lg:pt-7">
            <HeroBreadcrumb current="Profil Sekolah" />

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
