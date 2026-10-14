import { useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowRight, Compass } from 'lucide-react';
import HeroBreadcrumb from '../HeroBreadcrumb';

const NextTelIntro = ({ onStart }) => {
  const { t } = useLanguage();
  const headingRef = useRef(null);
  useEffect(() => { headingRef.current?.focus({ preventScroll: true }); }, []);
  return (
    <>
      <HeroBreadcrumb current="NextTel AI" parent="Beranda" parentTo="/" />
      <p className="mb-5 flex items-center gap-2 text-sm font-semibold text-dark-700"><Compass className="h-5 w-5 text-primary" aria-hidden="true" /> NextTel AI</p>
      <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-900 px-6 py-10 text-white shadow-card sm:px-10 sm:py-14 lg:px-16 lg:py-20">
        <img src="/assets/nexttel/banner-pattern.svg" alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
          <img src="/assets/nexttel/robot.png" alt="" className="h-28 w-28 shrink-0 object-contain sm:h-36 sm:w-36" />
          <h1 ref={headingRef} tabIndex={-1} className="max-w-2xl font-heading text-3xl font-extrabold leading-tight outline-none sm:text-4xl">{t('Temukan jurusan yang cocok dengan minatmu')}</h1>
        </div>
        <p className="mt-7 max-w-2xl text-sm leading-relaxed text-white/85 sm:ml-44">{t('Jawab 8 pertanyaan singkat tentang hal yang kamu sukai. NextTel akan membantu membaca kecenderungan minatmu pada jurusan teknologi di SMK Telkom Purwokerto.')}</p>
        <button type="button" onClick={onStart} className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:ml-44">
          {t('Mulai sekarang')} <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </>
  );
};

export default NextTelIntro;
