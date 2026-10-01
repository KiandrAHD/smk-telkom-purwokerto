import { useLanguage } from '../../context/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { heroData } from '../../data/dummyData';

const TentangHeroSection = () => {
  const { t, language } = useLanguage();
  return (
  <section className="bg-white pt-4 pb-6">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-primary/30 bg-white p-3 sm:p-4">
        <div className="grid grid-cols-1 lg:grid-cols-[38%_1fr] items-start gap-6 lg:gap-4">
          {/* Kolom teks */}
          <div className="px-3 pt-6 lg:pl-4 lg:pt-6">
            <span className="mt-3 inline-block rounded-md bg-primary-50 px-2.5 py-1 text-[10px] font-bold text-primary">
              {t(heroData.hashtag)}
            </span>

            <h1 className="mt-4 whitespace-pre-line font-heading text-3xl sm:text-4xl lg:text-[1.75rem] xl:text-[2rem] font-extrabold leading-[1.2] tracking-tight text-dark-900">
              {t(heroData.heading)}
              {'\n'}
              <span className="text-primary">{t(heroData.headingAccent)}</span>
            </h1>

            <p className="mt-4 max-w-md text-xs sm:text-sm leading-relaxed text-dark-500">
              {t(heroData.description)}
            </p>

            <Link
              to="/ppdb"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-800"
            >
              {t(heroData.ctaText)}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Panel merah + gedung + poin keunggulan (satu aset dari Figma) */}
          {language === 'en' ? (
            <div className="overflow-hidden rounded-[1.75rem] bg-primary">
              <div className="aspect-[2/1] overflow-hidden">
                <img src={heroData.image} alt={t('Gedung SMK Telkom Purwokerto')} className="w-[150%] max-w-none" />
              </div>
              <div className="grid grid-cols-3 gap-3 px-4 py-5 text-center text-white">
                {heroData.badges.map((badge) => (
                  <div key={badge.title}>
                    <p className="font-heading text-xs font-bold sm:text-sm">{t(badge.title)}</p>
                    <p className="mt-1 text-[10px] leading-relaxed text-white/85">{t(badge.desc)}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : <img
            src={heroData.image}
            alt={t("Gedung SMK Telkom Purwokerto")}
            className="w-full rounded-[1.75rem] object-contain"
          />}
        </div>
      </div>
    </div>
  </section>
  );
};

export default TentangHeroSection;
