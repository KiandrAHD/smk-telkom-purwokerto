import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import bg from '../assets/landing/partners-bg.png';
import decoLeft from '../assets/landing/partners-deco-left.png';
import decoRight from '../assets/landing/partners-deco-right.png';
import { mitraIndustri } from '../data/dummyData';

const PartnersSection = () => {
  const { t } = useLanguage();
  const [paused, setPaused] = useState(false);

  return (
    <>
      <section id="mitra" data-paused={paused} className="relative w-full overflow-hidden">
        <img
          src={bg}
          alt=""
          aria-hidden="true"
          className="h-24 w-full object-cover sm:h-28 lg:h-32"
        />
        <img
          src={decoLeft}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 h-full select-none"
        />
        <img
          src={decoRight}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 h-full select-none"
        />

        <div className="absolute inset-y-0 left-20 right-20 flex items-center overflow-hidden sm:left-24 sm:right-24 lg:left-28 lg:right-28">
          <div id="mitra-logo-track" className="partners-marquee flex w-max">
            {[0, 1, 2, 3].map((copyIndex) => (
              <div
                key={copyIndex}
                aria-hidden={copyIndex > 0 || undefined}
                className="flex shrink-0 items-center gap-14 px-7"
              >
                {mitraIndustri.map((mitra) => (
                  <img
                    key={mitra.name}
                    src={mitra.logo}
                    alt={copyIndex === 0 ? mitra.name : ''}
                    className={`${mitra.size} w-auto shrink-0 object-contain`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
      <button
        type="button"
        aria-controls="mitra-logo-track"
        aria-label={t('Jeda animasi logo')}
        aria-pressed={paused}
        onClick={() => setPaused((value) => !value)}
        className="mx-auto mb-4 mt-3 block rounded-full border border-dark-200 bg-white px-4 py-2 text-xs font-medium text-dark-700 transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:hidden"
      >
        {t(paused ? 'Lanjutkan animasi logo' : 'Jeda animasi logo')}
      </button>
    </>
  );
};

export default PartnersSection;
