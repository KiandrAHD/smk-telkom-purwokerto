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
      className="pointer-events-none absolute inset-y-0 left-0 z-10 h-full select-none"
    />
    <img
      src={decoRight}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 z-10 h-full select-none"
    />

    <div className="absolute inset-y-0 left-20 right-20 flex items-center overflow-hidden sm:left-24 sm:right-24 lg:left-28 lg:right-28">
      <div className="partners-marquee flex w-max">
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
);

export default PartnersSection;
