import ribbon from '../assets/landing/ribbon.png';

const RibbonDivider = () => (
  // Batas bawah mengikuti tepi kedua pita; watermark bawaan gambar tidak ikut tampil.
  <div aria-hidden="true" className="pointer-events-none relative aspect-[1847/146] overflow-hidden">
    <img
      src={ribbon}
      alt=""
      className="absolute inset-x-0 top-0 w-full select-none [clip-path:polygon(0_0,100%_0,100%_47.5%,56%_40.5%,0_44.6%)]"
    />
  </div>
);

export default RibbonDivider;
