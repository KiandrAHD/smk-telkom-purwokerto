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

const icons = {
  userPlus: accountIcon,
  bot: robotIcon,
  sparkles: sparkIcon,
};

const HeroSection = () => {
  const { t } = useLanguage();
  return (
  <section className="bg-white pb-6 pt-4">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-[2rem] border border-primary/30 bg-white p-3 sm:p-4">
        <div className="grid grid-cols-1 lg:grid-cols-[40%_1fr] xl:grid-cols-[34%_1fr] gap-6 lg:gap-4 items-start">
          {/* Kolom teks */}
          {/* pb-16 menyisakan ruang untuk kartu akses cepat yang menimpa dari bawah —
              lihat catatan yang sama di PrestasiHeroSection. */}
          <div className="px-3 pt-6 lg:pb-16 lg:pl-4 lg:pt-2">
            <div className="flex flex-wrap items-center gap-1">
              {landingHero.hashtags.map(tag => (
                <span key={tag} className="inline-block whitespace-nowrap rounded-full border border-primary/25 bg-white px-2 py-1 text-[10px] font-bold tracking-wide text-primary">
                  {t(tag)}
                </span>
              ))}
            </div>

            <h1 className="mt-4 font-heading text-3xl sm:text-4xl lg:text-[1.75rem] xl:text-[1.875rem] font-extrabold leading-[1.2] tracking-tight text-dark-900">
              {t(landingHero.title)}
              <br />
              <span className="text-primary">{t(landingHero.titleAccent)}</span>
            </h1>

            <p className="mt-4 max-w-md text-xs sm:text-sm leading-relaxed text-dark-500">
              {t(landingHero.description)}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to={landingHero.primaryCta.href}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-800"
              >
                {t(landingHero.primaryCta.label)}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={landingHero.secondaryCta.href}
                className="inline-flex items-center gap-2 rounded-full border border-dark-200 bg-white px-6 py-3 text-sm font-semibold text-dark-700 transition-colors hover:border-primary hover:text-primary"
              >
                {t(landingHero.secondaryCta.label)}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Panel merah + foto + watermark TELKOM (satu aset dari Figma) */}
          <img
            src={heroPanel}
            srcSet={`${hero640} 640w, ${hero960} 960w, ${heroPanel} 1208w`}
            sizes="(min-width: 80rem) 47.7575rem, (min-width: 64rem) calc(60vw - 4.675rem), (min-width: 40rem) calc(100vw - 5.125rem), calc(100vw - 3.625rem)"
            alt={t("Siswa SMK Telkom Purwokerto")}
            width={1208}
            height={679}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="aspect-[1208/679] w-full rounded-[1.75rem] object-contain"
          />
        </div>

      </div>

        {/* Keep QAC in flow outside the hero border so its height reserves space below. */}
        <div data-quick-access className="relative z-10 left-1/2 -translate-x-1/2 -mt-8 w-[calc(100%-2rem)] overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-card sm:w-[92%] lg:w-[70.53%]">
          <div className="grid grid-cols-1 divide-y divide-dark-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:grid-cols-3">
            {quickLinks.map((item) => {
              return (
                <div key={item.title} className="flex min-w-0 gap-3 px-4 py-3">
                  <span aria-hidden="true" className="relative flex aspect-[97/105] w-12 shrink-0 items-center justify-center self-start rounded-lg bg-primary sm:w-10 lg:w-12">
                    <img src={icons[item.icon]} alt="" className={`h-auto ${item.icon === 'userPlus' ? 'w-[59%]' : item.icon === 'bot' ? 'w-[69%]' : 'w-[58%]'}`} />
                    {item.icon === 'sparkles' && <><span className="absolute right-[18%] top-[20%] text-[10px] font-extrabold leading-none text-white">+</span><img src={sparkDot} alt="" className="absolute bottom-[24%] left-[16%] h-auto w-[10%]" /></>}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="font-heading text-base font-bold leading-tight text-dark-900">
                      {t(item.title)}
                    </p>
                    <p className="mt-1 flex-1 text-xs leading-snug text-dark-500 sm:text-[11px] lg:text-xs">
                      {t(item.desc)}
                    </p>
                    <Link
                      to={item.href}
                      className="mt-1 inline-flex min-h-9 items-center gap-1 text-xs font-semibold text-primary hover:underline sm:text-[11px] lg:text-xs"
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
