import bg from '../assets/responsive/partners-1847.webp';
import bg960 from '../assets/responsive/partners-960.webp';
import bg1440 from '../assets/responsive/partners-1440.webp';
import decoLeft from '../assets/landing/partners-deco-left.png';
import decoRight from '../assets/landing/partners-deco-right.png';
import { mitraIndustri } from '../data/dummyData';
import { useLanguage } from '../context/LanguageContext';

const PartnersSection = ({ items = mitraIndustri, animated = true }) => {
  const { t } = useLanguage();

  return (
    <>
      <section id="mitra" aria-labelledby="mitra-title" className="relative w-full overflow-hidden">
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
          className={animated ? 'h-24 w-full object-cover sm:h-28 lg:h-32' : 'h-44 w-full object-cover sm:h-36 lg:h-32'}
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

        <div className={animated ? 'absolute inset-y-0 left-20 right-20 flex items-center overflow-hidden sm:left-24 sm:right-24 lg:left-28 lg:right-28' : 'absolute inset-y-0 left-10 right-10 grid items-center sm:left-16 sm:right-16 lg:left-24 lg:right-24'}>
          <div id="mitra-logo-track" className={animated ? 'partners-marquee flex w-max' : 'grid w-full grid-cols-3 items-center justify-items-center gap-5 py-6 md:grid-cols-6 md:gap-8'}>
            {(animated ? [0, 1, 2, 3] : [0]).map((copyIndex) => (
              <div
                key={copyIndex}
                aria-hidden={copyIndex > 0 || undefined}
                className={animated ? 'flex shrink-0 items-center gap-14 px-7' : 'contents'}
              >
                {items.map((mitra) => (
                  <img
                    key={mitra.name}
                    src={mitra.logo}
                    alt={copyIndex === 0 ? mitra.name : ''}
                    className={`${mitra.size} ${animated ? '' : 'max-w-full'} w-auto shrink-0 object-contain`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default PartnersSection;
