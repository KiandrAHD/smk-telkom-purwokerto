import { lazy, Suspense } from 'react';
import MainLayout from '../layouts/MainLayout';
import Reveal from '../components/Reveal';
import HeroSection from '../components/HeroSection';
import { landingHeroSlides } from '../data/landingHeroSlides';
import AboutSection from '../components/AboutSection';
import RibbonDivider from '../components/RibbonDivider';
import DepartmentsSection from '../components/DepartmentsSection';
import HomeStatistics from '../components/HomeStatistics';
import WaveMarquee from '../components/WaveMarquee';
import JurusanFaqSection from '../components/jurusan/JurusanFaqSection';

const FacilitiesSection = lazy(() => import('../components/FacilitiesSection'));
const PartnersSection = lazy(() => import('../components/PartnersSection'));
const AchievementsSection = lazy(() => import('../components/AchievementsSection'));
const HallOfFameSection = lazy(() => import('../components/prestasi/PrestasiPerjalananSection'));

const SectionFallback = () => <div className="py-12 bg-white" />;

// Hero sengaja tidak dibungkus <Reveal>: bagian itu sudah kelihatan sejak awal
// dan ikut animasi masuk halaman dari MainLayout, jadi membungkusnya lagi hanya
// membuat gerakannya dobel.
const LandingPage = ({ initialPrestasi }) => (
  <MainLayout showOpeningMarquee={false}>
    <HeroSection slides={landingHeroSlides} />
    <RibbonDivider />
    <AboutSection />
    <HomeStatistics />
    <WaveMarquee />
    <DepartmentsSection />
    <Suspense fallback={<SectionFallback />}>
      <FacilitiesSection />
      <Reveal>
        <PartnersSection variant="home" />
      </Reveal>
      <Reveal>
        <AchievementsSection initialItems={initialPrestasi} />
      </Reveal>
      <Reveal>
        <HallOfFameSection />
      </Reveal>
    </Suspense>
    <JurusanFaqSection variant="home" />
  </MainLayout>
);

export default LandingPage;
