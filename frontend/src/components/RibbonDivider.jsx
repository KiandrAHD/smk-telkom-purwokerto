import { useLanguage } from '../context/LanguageContext';
import ribbon from '../assets/landing/ribbon-divider.png';
import petalTopLeft from '../assets/landing/beranda-150-568.png';
import petalTopRight from '../assets/landing/beranda-150-570.png';
import petalBottomLeft from '../assets/landing/beranda-150-581.png';
import petalBottomRight from '../assets/landing/beranda-150-583.png';
import './RibbonDivider.css';

const badges = [
  { label: 'NEXT GENERATION', filled: true },
  { label: 'SMK PUSAT UNGGULAN', filled: false },
  { label: 'AKREDITASI A', filled: true },
  { label: 'GLOBAL TECHNOPRENUER', filled: false },
];

const RibbonDivider = ({ animated = false }) => {
  const { t } = useLanguage();
  if (!animated) return (
    <div data-ribbon-accent aria-hidden="true" className="pointer-events-none relative aspect-[1847/146] overflow-hidden">
      <img src={ribbon} alt="" className="absolute inset-x-0 top-0 w-full select-none" />
    </div>
  );
  return (
    <div data-hero-marquee className="beranda-ribbon relative w-full overflow-hidden bg-white py-6 sm:py-8">
      <ul className="sr-only">
        {badges.map(({ label }) => <li key={label}>{t(label)}</li>)}
      </ul>
      <div aria-hidden="true" className="beranda-ribbon-track flex w-max select-none">
        {[0, 1].map((copy) => (
          <div key={copy} className="beranda-ribbon-group flex shrink-0 items-center">
            {/* Four cycles cover a 4K viewport; both halves remain identical. */}
            {[0, 1, 2, 3].map((cycle) => badges.map(({ label, filled }) => (
              <div key={`${cycle}-${label}`} className="flex shrink-0 items-center gap-4 pr-4 sm:gap-6 sm:pr-6">
                <span className={`beranda-ribbon-badge flex shrink-0 items-center justify-center whitespace-nowrap rounded-full border-2 border-primary px-[0.75em] text-[length:var(--ribbon-font-size)] font-extrabold leading-none ${filled ? 'bg-primary text-white' : 'bg-white text-primary'}`}>
                  {t(label)}
                </span>
                <span className="beranda-ribbon-flower grid shrink-0 grid-cols-2 items-center">
                  {[petalTopLeft, petalTopRight, petalBottomLeft, petalBottomRight].map((src) => (
                    <img key={src} src={src} alt="" className="w-full" />
                  ))}
                </span>
              </div>
            )))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RibbonDivider;
