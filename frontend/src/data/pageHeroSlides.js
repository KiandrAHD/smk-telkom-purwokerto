import { landingHeroSlides } from './landingHeroSlides';

// Keep each page's live opening panel, then show only other navbar destinations.
export const pageHeroSlides = Object.fromEntries(landingHeroSlides.map(page => [
  page.id, landingHeroSlides.filter(slide => slide.id !== page.id),
]));
