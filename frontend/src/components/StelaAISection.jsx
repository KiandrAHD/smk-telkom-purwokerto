import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import stelaCard from '../assets/landing/stela-card.jpg';
import { stelaCardEn, stelaEnglishSrcSet, stelaFullSizes, restoreOriginalStelaArtwork } from '../utils/stelaArtwork';
import { stelaData } from '../data/dummyData';

const StelaAISection = () => {
  const { t, language } = useLanguage();
  const english = language === 'en';
  return (
    <section id="stela" className="bg-white py-6 lg:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#830b19]">
          <img src={english ? stelaCardEn : stelaCard} srcSet={english ? stelaEnglishSrcSet : undefined} sizes={english ? stelaFullSizes : undefined} onError={english ? restoreOriginalStelaArtwork : undefined} width={english ? 2172 : 2200} height={english ? 724 : 693} alt="" aria-hidden="true" loading="lazy" className="block h-auto w-full" />
          {english ? (
            <Link to="/stela" className="absolute bottom-[9.2%] left-[5.9%] h-[8.3%] min-h-11 w-[17.2%] min-w-11 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              <span className="sr-only">{t(stelaData.ctaText)}</span>
            </Link>
          ) : (
          <div className="px-[5.7%] pb-4 sm:absolute sm:bottom-[10.7%] sm:left-[5.7%] sm:w-[24.2%] sm:p-0">
            <Link to="/stela" className="inline-flex min-h-11 items-center justify-center gap-1 rounded-lg bg-white px-4 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:min-h-8 sm:w-full sm:text-[clamp(0.75rem,1.4vw,1.125rem)] sm:px-3 sm:py-1.5 lg:min-h-11 lg:px-5 lg:py-2">
              {t(stelaData.ctaText)}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
          )}
        </div>
        <div className="sr-only">
          <h2>{t(stelaData.title).replace('\n', ' ')}</h2>
          <p>{t(stelaData.description)}</p>
          {stelaData.chats.map((chat) => <p key={chat.from}>{t(chat.text)}</p>)}
        </div>
      </div>
    </section>
  );
};

export default StelaAISection;
