import HeroCarousel from './HeroCarousel';
import { pageHeroSlides } from '../data/pageHeroSlides';
import { landingHeroSlides } from '../data/landingHeroSlides';

export default function PageHeroCarousel({ page, children, slides = pageHeroSlides[page] }) {
  const opening = landingHeroSlides.find(slide => slide.id === page);
  return <HeroCarousel page={page} slides={[opening, ...slides]} opening={children} />;
}
