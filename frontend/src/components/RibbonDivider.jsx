import ribbon from '../assets/landing/ribbon-divider.png';

// Static decorative ribbon only. Animated marquees use the shared WaveMarquee.
const RibbonDivider = ({ className = '' }) => (
  <div data-ribbon-accent aria-hidden="true" className={`pointer-events-none py-6 sm:py-10 ${className}`}>
    <div className="relative aspect-[1847/146] overflow-hidden">
      <img src={ribbon} alt="" className="absolute inset-0 h-full w-full select-none object-cover" />
    </div>
  </div>
);

export default RibbonDivider;
