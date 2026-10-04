import { useLanguage } from '../../context/LanguageContext';
import { useState } from 'react';
import { ArrowRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import stelaCard from '../../assets/landing/stela-card.jpg';
import { stelaCardEn, stelaEnglishSrcSet, stelaFullSizes, restoreOriginalStelaArtwork } from '../../utils/stelaArtwork';
import { jurusanFaq, stelaData } from '../../data/dummyData';

const JurusanFaqSection = () => {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(null);

  return (
    <section id="faq-jurusan" className="bg-white py-8 lg:py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-8 px-4 sm:px-6 lg:px-8">
        {/* Akordeon FAQ */}
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-primary">
            {t(jurusanFaq.title)} <span className="text-dark-900">{t(jurusanFaq.titleAccent)}</span>
          </h2>

          <div className="mt-6 space-y-3">
            {jurusanFaq.items.map((item, i) => {
              const isOpen = i === open;
              return (
                <div
                  key={item.q}
                  className={`rounded-xl border bg-white transition-colors ${
                    isOpen ? 'border-primary' : 'border-dark-200'
                  }`}
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
                    >
                      <span className="text-xs font-medium text-dark-800">{t(item.q)}</span>
                      <Plus
                        className={`h-4 w-4 flex-shrink-0 text-primary transition-transform ${
                          isOpen ? 'rotate-45' : ''
                        }`}
                      />
                    </button>
                  </h3>
                  {isOpen && (
                    <p
                      id={`faq-panel-${i}`}
                      className="border-t border-dark-100 px-4 py-3 text-[11px] leading-relaxed text-dark-500"
                    >
                      {t(item.a)}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <Link
            to="/jurusan/faq"
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
          >
            {t(jurusanFaq.ctaText)}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Artwork lengkap diberi lebar penuh agar teks kedua bahasa terbaca. */}
        <Link to="/stela" aria-label={t(stelaData.ctaText)} className="relative block overflow-hidden rounded-2xl bg-[#830b19] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
          <img
            src={language === 'en' ? stelaCardEn : stelaCard}
            srcSet={language === 'en' ? stelaEnglishSrcSet : undefined}
            sizes={language === 'en' ? stelaFullSizes : undefined}
            onError={language === 'en' ? restoreOriginalStelaArtwork : undefined}
            alt=""
            aria-hidden="true"
            width={language === 'en' ? 2172 : 2200}
            height={language === 'en' ? 724 : 693}
            loading="lazy"
            className="block h-auto w-full"
          />
          {language !== 'en' && <span className="block px-[5.7%] pb-4 sm:absolute sm:bottom-[10.7%] sm:left-[5.7%] sm:w-[24.2%] sm:p-0">
            <span className="inline-flex min-h-11 items-center justify-center gap-1 rounded-lg bg-white px-4 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary-50 sm:min-h-8 sm:w-full sm:px-3 sm:py-1.5 sm:text-[clamp(0.75rem,1.4vw,1.125rem)] lg:min-h-11 lg:px-5 lg:py-2">
              {t(stelaData.ctaText)}<ArrowRight aria-hidden="true" className="h-4 w-4" />
            </span>
          </span>}
          <span className="sr-only">
            {t(stelaData.title).replace('\n', ' ')}. {t(stelaData.description)}
          </span>
        </Link>
      </div>
    </section>
  );
};

export default JurusanFaqSection;
