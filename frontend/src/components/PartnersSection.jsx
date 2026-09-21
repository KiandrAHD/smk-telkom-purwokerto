import bg from '../assets/landing/partners-bg.png';
import decoLeft from '../assets/landing/partners-deco-left.png';
import decoRight from '../assets/landing/partners-deco-right.png';
import { mitraIndustri } from '../data/dummyData';

const PartnersSection = () => (
  <section id="mitra" className="relative w-full overflow-hidden">
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
      className="pointer-events-none absolute inset-y-0 left-0 h-full select-none"
    />
    <img
      src={decoRight}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 h-full select-none"
    />

    <div className="absolute inset-0 flex items-center overflow-hidden">
      <div className="partners-marquee flex w-max">
        {[false, true].map((duplicate) => (
          <div
            key={duplicate ? 'duplicate' : 'original'}
            aria-hidden={duplicate || undefined}
            className="flex w-screen min-w-[72rem] shrink-0 items-center justify-around px-20"
          >
            {mitraIndustri.map((mitra) => (
              <img
                key={mitra.name}
                src={mitra.logo}
                alt={duplicate ? '' : mitra.name}
                className={`${mitra.size} w-auto shrink-0 object-contain`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PartnersSection;
