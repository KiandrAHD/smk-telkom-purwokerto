import ribbon from '../assets/landing/ribbon-divider.png';

// Static decorative ribbon only. Animated marquees use the shared WaveMarquee.
const RibbonDivider = () => (
  <div data-ribbon-accent aria-hidden="true" className="pointer-events-none relative aspect-[1847/146] overflow-hidden">
    <img src={ribbon} alt="" className="absolute inset-x-0 top-0 w-full select-none" />
  </div>
);

export default RibbonDivider;
