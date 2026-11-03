import { useState } from 'react';
import { Pause, Play } from 'lucide-react';
import bg from '../assets/responsive/partners-1847.webp';
import bg960 from '../assets/responsive/partners-960.webp';
import bg1440 from '../assets/responsive/partners-1440.webp';
import decoLeft from '../assets/landing/partners-deco-left.png';
import decoRight from '../assets/landing/partners-deco-right.png';
import { mitraIndustri } from '../data/dummyData';
import { useLanguage } from '../context/LanguageContext';

const PartnersSection = ({ items = mitraIndustri, animated = true, variant = 'default' }) => {
  const home = variant === 'home';
  const marquee = animated;
  const { t, language } = useLanguage();
  const [paused, setPaused] = useState(false);

  return (
    <>
      <section id="mitra" aria-labelledby="mitra-title" data-paused={paused} className="relative w-full overflow-hidden">
        <h2 id="mitra-title" className="sr-only">{t('Mitra Industri')}</h2>
        <img
          src={bg}
          srcSet={`${bg960} 960w, ${bg1440} 1440w, ${bg} 1847w`}
          sizes="(min-width: 64rem) max(100vw, 57.9451rem), (min-width: 40rem) max(100vw, 50.702rem), max(100vw, 43.4588rem)"
          width={1847}
          height={255}
          loading="lazy"
          decoding="async"
          alt=""
          aria-hidden="true"
          className={home ? 'h-44 w-full object-cover sm:h-36 lg:h-32' : animated ? 'h-24 w-full object-cover sm:h-28 lg:h-32' : 'h-44 w-full object-cover sm:h-36 lg:h-32'}
        />
        <img
          src={decoLeft}
          width={1505}
          height={251}
          loading="lazy"
          decoding="async"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 h-full w-auto select-none"
        />
        <img
          src={decoRight}
          width={1480}
          height={252}
          loading="lazy"
          decoding="async"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 h-full w-auto select-none"
        />

        <div className={marquee ? 'absolute inset-y-0 left-20 right-20 flex items-center overflow-hidden sm:left-24 sm:right-24 lg:left-28 lg:right-28' : 'absolute inset-y-0 left-8 right-8 grid items-center sm:left-12 sm:right-12 lg:left-24 lg:right-24'}>
          <div id="mitra-logo-track" className={marquee ? 'partners-marquee flex w-max shrink-0' : `grid w-full grid-cols-3 items-center justify-items-center gap-4 py-6 ${home ? 'sm:grid-cols-4 lg:grid-cols-7' : 'md:grid-cols-6'} md:gap-6`}>
            {(marquee ? [0, 1, 2, 3] : [0]).map((copyIndex) => (
              <div
                key={copyIndex}
                aria-hidden={copyIndex > 0 || undefined}
                className={marquee ? 'flex shrink-0 items-center gap-14 px-7' : 'contents'}
              >
                {items.map((mitra) => (
                  <img
                    key={mitra.name}
                    src={mitra.logo}
                    alt={copyIndex === 0 ? mitra.name : ''}
                    className={`${mitra.size} ${marquee ? '' : 'max-w-full'} w-auto shrink-0 object-contain`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        {marquee && <button type="button" onClick={() => setPaused(value => !value)} aria-controls="mitra-logo-track" aria-pressed={paused} aria-label={language === 'en' ? 'Pause partner animation' : 'Jeda animasi mitra'} className="absolute bottom-2 right-2 z-20 flex size-11 items-center justify-center rounded-full bg-white/90 text-primary shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          {paused ? <Play aria-hidden="true" className="size-4" /> : <Pause aria-hidden="true" className="size-4" />}
        </button>}
      </section>
    </>
  );
};

export default PartnersSection;
