import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Bot, UserPlus, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { landingHero, quickLinks } from '../data/dummyData';
import HeroBreadcrumb from './HeroBreadcrumb';
import hero640 from '../assets/responsive/hero-640.webp';
import hero960 from '../assets/responsive/hero-960.webp';
import hero1440 from '../assets/responsive/hero-1440.webp';

const icons = {
  userPlus: UserPlus,
  bot: Bot,
  sparkles: Sparkles,
};

const HeroSection = () => {
  const { t } = useLanguage();
  return (
  <section className="bg-white pb-6 pt-4 lg:pb-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-[2rem] border border-primary/30 bg-white p-3 sm:p-4">
        <div className="grid grid-cols-1 lg:grid-cols-[40%_1fr] xl:grid-cols-[34%_1fr] gap-6 lg:gap-4 items-start">
          {/* Kolom teks */}
          {/* pb-16 menyisakan ruang untuk kartu akses cepat yang menimpa dari bawah —
              lihat catatan yang sama di PrestasiHeroSection. */}
          <div className="px-3 pt-6 lg:pb-16 lg:pl-4 lg:pt-2">
            <HeroBreadcrumb current="Beranda" />
            {/* Chip yang sama dipakai enam hero lain; sebelumnya di sini cuma
                teks merah polos, jadi hero Beranda terlihat lain sendiri. */}
            <span className="inline-block rounded-md bg-primary-50 px-2.5 py-1 text-[10px] font-bold text-primary">
              {t(landingHero.hashtag)}
            </span>

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
            src={landingHero.image}
            srcSet={`${hero640} 640w, ${hero960} 960w, ${hero1440} 1440w, ${landingHero.image} 1920w`}
            sizes="(min-width: 80rem) 47.7575rem, (min-width: 64rem) calc(60vw - 4.675rem), (min-width: 40rem) calc(100vw - 5.125rem), calc(100vw - 3.625rem)"
            alt={t("Siswa SMK Telkom Purwokerto")}
            width={1920}
            height={902}
            fetchPriority="high"
            className="aspect-[1920/902] w-full rounded-[1.75rem] object-contain"
          />
        </div>

        {/* Panel tiga akses utama menimpa batas bawah hero seperti di Figma. */}
        <div className="relative z-10 mx-1 -mt-6 overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-card lg:absolute lg:bottom-0 lg:left-1/2 lg:mx-0 lg:mt-0 lg:w-[calc(100%-4rem)] lg:max-w-[52rem] lg:-translate-x-1/2 lg:translate-y-1/2">
          <div className="grid grid-cols-1 divide-y divide-dark-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:grid-cols-3">
            {quickLinks.map((item) => {
              const Icon = icons[item.icon];
              return (
                <div key={item.title} className="flex gap-3 px-5 py-4">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary">
                    <Icon className="h-5 w-5 text-white" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-heading text-sm font-bold text-dark-900">
                      {t(item.title)}
                    </p>
                    <p className="mt-1 text-[10px] leading-snug text-dark-500">
                      {t(item.desc)}
                    </p>
                    <Link
                      to={item.href}
                      className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline"
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
    </div>
  </section>
  );
};

export default HeroSection;
