import { landingHero, quickLinks } from '../data/dummyData';
import HeroPanel from './HeroPanel';
import HeroCarousel from './HeroCarousel';
import PageHeroCarousel from './PageHeroCarousel';
import HeroQuickAccess from './HeroQuickAccess';

const HeroSection = ({ content = landingHero, links = quickLinks, media, breadcrumb, slides, page }) => (
  <section className="school-hero">
    <div className="hero-container">
      {slides ? <HeroCarousel slides={slides} /> : page ? <PageHeroCarousel page={page}><HeroPanel content={content} media={media} breadcrumb={breadcrumb} /></PageHeroCarousel> : <HeroPanel content={content} media={media} breadcrumb={breadcrumb} />}
      <HeroQuickAccess links={links} />
    </div>
  </section>
);

export default HeroSection;
