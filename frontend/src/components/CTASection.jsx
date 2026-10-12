import { ArrowRight, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ctaBanner } from '../data/dummyData';
import { useLanguage } from '../context/LanguageContext';
import prestasiArrow from '../assets/prestasi-remake/MaterialSymbolsLightArrowForwardRounded1.svg';
import nextTel from '../assets/landing/nexttel-cta.jpeg';
import facilitiesBadge from '../assets/fasilitas/cta-badge.svg';

const CTASection = ({ variant = 'default', containerClassName }) => {
  const { t } = useLanguage();
  if (variant === 'prestasi') return (
    <section id="ppdb" className="bg-white pb-8 font-['Plus_Jakarta_Sans'] lg:pb-[5.0434vw]">
      <div className="mx-auto flex w-[calc(100%-2rem)] max-w-[1703px] flex-col items-center justify-between gap-5 rounded-[20px] bg-[#bf0d1b] px-6 py-6 text-center sm:w-[calc(100%-3rem)] sm:flex-row sm:text-left lg:min-h-[9.3818vw] lg:w-[92.35%] lg:gap-[2vw] lg:rounded-[1.6269vw] lg:py-[1.5vw] lg:pl-[2.0065vw] lg:pr-[6.345vw]">
        <div className="flex min-w-0 items-center gap-4 lg:gap-[1.6811vw]">
          <img src={nextTel} alt="NextTel" width="1024" height="1024" loading="lazy" className="size-12 shrink-0 rounded-full border border-white/35 bg-white object-contain sm:size-16 lg:size-[6.0195vw]" />
          <div className="min-w-0">
            <h2 className="text-lg font-bold leading-tight text-white lg:text-[clamp(1.125rem,1.9523vw,2.25rem)]">{t(ctaBanner.title)}</h2>
            <p className="mt-2 text-xs font-bold leading-relaxed text-white/80 lg:text-[clamp(0.75rem,1.0846vw,1.25rem)]">{t(ctaBanner.description)}</p>
          </div>
        </div>
        <Link to={ctaBanner.href} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-3 rounded-xl bg-white px-6 py-3 text-sm font-extrabold text-black transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white lg:min-h-[3.8503vw] lg:min-w-[21.2039vw] lg:rounded-[0.65vw] lg:px-[2.0065vw] lg:text-[clamp(0.875rem,1.3015vw,1.5rem)]">
          {t(ctaBanner.ctaText)}<span aria-hidden="true" className="relative block size-6 lg:size-[2.5932vw]"><img src={prestasiArrow} alt="" className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 scale-50 lg:scale-[calc(100vw/1844px)]" /></span>
        </Link>
      </div>
    </section>
  );
  return (
  <section id="ppdb" className="bg-white pb-8 lg:pb-12">
    <div className={containerClassName ?? 'mx-auto max-w-[1546px] px-4 sm:px-6 lg:px-8'}>
      <div className={`flex flex-col items-center gap-5 rounded-2xl px-6 py-6 text-center sm:flex-row sm:justify-between sm:px-10 sm:text-left ${variant === 'fasilitas' ? 'bg-[#bf0d1b] lg:min-h-32 lg:rounded-[30px] lg:px-8' : 'bg-primary'}`}>
        <div className="flex items-center gap-4">
          {variant === 'fasilitas' ? <span aria-hidden="true" className="relative block size-12 shrink-0 lg:size-[5.5vw]"><img src={facilitiesBadge} alt="" loading="lazy" className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 scale-[0.4673] lg:scale-[calc(100vw/1847px)]" /></span> : <span className="flex size-11 flex-shrink-0 items-center justify-center rounded-full bg-white/20"><GraduationCap className="size-5 text-white" /></span>}
          <div>
            <h2 className={`text-white ${variant === 'fasilitas' ? 'font-sans font-bold! leading-tight! tracking-[-0.025em]! text-lg sm:text-xl lg:text-2xl' : 'font-heading font-extrabold text-lg sm:text-xl'}`}>
              {t(ctaBanner.title)}
            </h2>
            <p className={`mt-1 leading-relaxed text-white/85 ${variant === 'fasilitas' ? 'max-w-[739px] text-sm' : 'max-w-md text-[11px]'}`}>
              {t(ctaBanner.description)}
            </p>
          </div>
        </div>

        <Link
          to={ctaBanner.href}
          className={`inline-flex flex-shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-primary transition-colors hover:bg-primary-50 ${variant === 'fasilitas' ? 'min-h-11 text-sm' : 'text-xs'}`}
        >
          {t(ctaBanner.ctaText)}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  </section>
  );
};

export default CTASection;
