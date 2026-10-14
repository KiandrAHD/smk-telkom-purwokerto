import { useLanguage } from '../context/LanguageContext';
import ribbon from '../assets/landing/ribbon-divider.png';
import { Award, Lightbulb, Rocket } from 'lucide-react';
import school from '../assets/landing/marquee-school.png';
import './RibbonDivider.css';

const badges = [
  { label: 'GLOBAL TECHNOPRENEUR', filled: false, icon: Lightbulb },
  { label: 'NEXT GENERATION', filled: true, icon: Rocket },
  { label: 'SMK PUSAT UNGGULAN', filled: false },
  { label: 'AKREDITASI A', filled: true, icon: Award },
];

export function MarqueeBadge({ label, filled, icon: Icon }) {
  const { t } = useLanguage();
  return <span className={`beranda-ribbon-badge flex shrink-0 items-center justify-center gap-[0.4em] whitespace-nowrap rounded-full border-2 border-primary px-[0.75em] text-[length:var(--ribbon-font-size)] font-extrabold leading-none ${filled ? 'bg-primary text-white' : 'bg-white text-primary'}`}>
    {Icon ? <Icon aria-hidden="true" className="size-[1.2em] shrink-0" strokeWidth={1.8} /> : <img src={school} alt="" className="size-[1.2em] shrink-0 object-contain" />}
    {t(label)}
  </span>;
}

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
            {[0, 1, 2, 3].map((cycle) => badges.map(badge => (
              <div key={`${cycle}-${badge.label}`} className="flex shrink-0 items-center pr-4 sm:pr-6">
                <MarqueeBadge {...badge} />
              </div>
            )))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RibbonDivider;
