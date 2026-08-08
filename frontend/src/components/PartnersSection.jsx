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

    <div className="absolute inset-0 flex items-center">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-4 px-4 sm:justify-between sm:gap-x-4 sm:px-6 lg:px-8">
        {mitraIndustri.map((mitra) => (
          <img
            key={mitra.name}
            src={mitra.logo}
            alt={mitra.name}
            className={`${mitra.size} w-auto object-contain`}
          />
        ))}
      </div>
    </div>
  </section>
);

export default PartnersSection;
