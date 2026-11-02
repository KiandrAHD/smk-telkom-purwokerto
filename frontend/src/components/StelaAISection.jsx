import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { stelaData } from '../data/dummyData';

// Keep the internal component name compatible with existing page imports.
const StelaAISection = ({ variant = 'default', className, containerClassName }) => {
  const { t, language } = useLanguage();
  const translatedPanel = language === 'en';
  return (
    <section id="nexa" aria-label="Nexa AI" className={className ?? 'bg-white py-6 lg:py-8'}>
      <div className={containerClassName ?? (variant === 'prestasi' ? 'mx-auto w-[calc(100%-2rem)] max-w-[1683px] sm:w-[calc(100%-3rem)] lg:w-[91.27%]' : 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8')}>
        <div className="relative overflow-hidden rounded-3xl bg-[#a60012]">
          {!translatedPanel && <img src="/assets/branding/nexa-banner.png" width="2000" height="667" alt="" aria-hidden="true" loading="lazy" className="block h-auto w-full" />}
          {translatedPanel && <img src="/assets/branding/nexa-mark.png" alt="" aria-hidden="true" loading="lazy" className="ml-6 mt-6 h-16 w-auto object-contain" />}
          <div className={`px-6 pb-6 pt-4 text-white ${translatedPanel ? '' : 'sm:sr-only'}`}>
            <h2 className="font-heading text-xl font-bold">{t(stelaData.title).replace('\n', ' ')}</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/90">{t(stelaData.description)}</p>
          </div>
          <div className={`px-6 pb-6 ${translatedPanel ? '' : 'sm:absolute sm:bottom-[10%] sm:left-[5.7%] sm:w-[25%] sm:p-0'}`}>
            <Link to="/nexa" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:text-sm">
              {t(stelaData.ctaText)}<ArrowRight aria-hidden="true" className="size-4 shrink-0" />
            </Link>
          </div>
        </div>
        <div className="sr-only">{stelaData.chats.map(chat => <p key={chat.from}>{t(chat.text)}</p>)}</div>
      </div>
    </section>
  );
};

export default StelaAISection;
