import ribbon from '../assets/landing/figma-ribbon.png';

const RibbonDivider = () => (
  // Slot existing dipertahankan; export Figma ini hanya berisi kedua pita.
  <div aria-hidden="true" className="pointer-events-none relative aspect-[1847/146] overflow-hidden">
    <img
      src={ribbon}
      alt=""
      className="absolute inset-x-0 top-0 w-full select-none"
    />
  </div>
);

export default RibbonDivider;
