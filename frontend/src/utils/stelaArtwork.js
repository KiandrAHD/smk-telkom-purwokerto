import stelaCardEn from '../assets/landing/stela-card-en.png';
import stela720 from '../assets/responsive/stela-card-en-720.webp';
import stela960 from '../assets/responsive/stela-card-en-960.webp';
import stela1440 from '../assets/responsive/stela-card-en-1440.webp';
import stela1920 from '../assets/responsive/stela-card-en-1920.webp';
import stela2172 from '../assets/responsive/stela-card-en-2172.webp';

export { stelaCardEn };
export const stelaEnglishSrcSet = `${stela720} 720w, ${stela960} 960w, ${stela1440} 1440w, ${stela1920} 1920w, ${stela2172} 2172w`;

// max-w-7xl is 80rem; the container's responsive padding remains unchanged.
export const stelaFullSizes = '(min-width: 80rem) 76rem, (min-width: 64rem) calc(100vw - 4rem), (min-width: 40rem) calc(100vw - 3rem), calc(100vw - 2rem)';

// Pengumuman's image is 156% of its column. At lg the column receives
// 565/1630 of the available width after the 4.23% grid gap.
export const stelaHelpSizes = '(min-width: 80rem) 39.358rem, (min-width: 64rem) calc(51.7854vw - 2.07142rem), (min-width: 40rem) calc(156vw - 4.68rem), calc(156vw - 3.12rem)';

export function restoreOriginalStelaArtwork({ currentTarget }) {
  currentTarget.removeAttribute('srcset');
  currentTarget.removeAttribute('sizes');
  if (currentTarget.getAttribute('src') !== stelaCardEn) currentTarget.src = stelaCardEn;
}
