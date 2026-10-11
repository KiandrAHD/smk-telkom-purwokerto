import petalTopLeft from '../assets/landing/beranda-petal-14.svg';
import petalTopRight from '../assets/landing/beranda-petal-15.svg';
import petalBottomRight from '../assets/landing/beranda-petal-16.svg';
import petalBottomLeft from '../assets/landing/beranda-petal-17.svg';
import logoMask from '../assets/landing/beranda-logo-mask.png';

// Figma 150:703–723, positioned relative to the 715px photo rather than the viewport.
const AboutPhotoAccents = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 select-none">
    <div className="absolute -left-[6.294%] -top-[3.357cqw] aspect-[91/272] w-[12.727%]">
      <span className="absolute left-0 top-0 h-[33.456%] w-[49.45%] bg-white" />
      <img src={petalTopLeft} alt="" className="absolute left-0 top-0 w-[49.45%] rotate-180 -scale-y-100" />
      <img src={petalTopRight} alt="" className="absolute left-[49.45%] top-0 w-[47.253%]" />
      <img src={petalBottomRight} alt="" className="absolute left-[49.45%] top-[15.809%] w-[50.55%] -scale-y-100" />
      <img src={petalBottomLeft} alt="" className="absolute left-0 top-[15.809%] w-[49.45%] rotate-180" />
      <span className="absolute left-0 top-[31.985%] h-[35.662%] w-full bg-[#cd091d]" />
      <span className="absolute -left-[0.407%] top-[32.551%] flex aspect-[87.458/94.379] w-[96.108%] items-center justify-center">
        <span className="aspect-square w-[73.56%] rotate-[132.82deg] skew-x-[-4.36deg] bg-white" />
      </span>
      <span className="absolute left-[26.989%] top-[41.618%] flex aspect-[37.349/40.304] w-[41.043%] items-center justify-center">
        <span className="aspect-square w-[73.56%] rotate-[132.82deg] skew-x-[-4.36deg] bg-[#cd091d]" />
      </span>
      <span className="absolute left-0 top-[67.279%] h-[32.353%] w-[49.45%] bg-white" />
      <div className="absolute left-[0.571%] top-[67.268%] grid w-[97.475%] grid-cols-2">
        {[0, 1, 2, 3].map((item) => (
          <span key={item} className="flex aspect-[44.351/44.696] items-center justify-center">
            <span className="aspect-square w-[70.988%] rotate-[-134.78deg] skew-x-[0.44deg] bg-[#cd091d]" />
          </span>
        ))}
      </div>
    </div>
    <span className="absolute -top-[3.357cqw] right-[0.14%] aspect-[101/97] w-[14.126%] bg-[#cd091d]">
      <img src={logoMask} alt="" className="absolute left-[3.038%] top-[2.066%] w-[92.264%] brightness-0 invert" />
    </span>
  </div>
);

export default AboutPhotoAccents;
