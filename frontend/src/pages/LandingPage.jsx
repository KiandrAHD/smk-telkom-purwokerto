import { lazy, Suspense } from 'react';
import MainLayout from '../layouts/MainLayout';
import Reveal from '../components/Reveal';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import RibbonDivider from '../components/RibbonDivider';
import DepartmentsSection from '../components/DepartmentsSection';

const FacilitiesSection = lazy(() => import('../components/FacilitiesSection'));
const PartnersSection = lazy(() => import('../components/PartnersSection'));
const AchievementsSection = lazy(() => import('../components/AchievementsSection'));

const SectionFallback = () => <div className="py-12 bg-white" />;

// Hero sengaja tidak dibungkus <Reveal>: bagian itu sudah kelihatan sejak awal
// dan ikut animasi masuk halaman dari MainLayout, jadi membungkusnya lagi hanya
// membuat gerakannya dobel.
const LandingPage = () => (
  <MainLayout>
    <HeroSection />
    <RibbonDivider animated />
    <AboutSection />
    <RibbonDivider />
    <DepartmentsSection />
    <Suspense fallback={<SectionFallback />}>
      <FacilitiesSection />
      <Reveal>
        <PartnersSection />
      </Reveal>
      <Reveal>
        <AchievementsSection />
      </Reveal>
    </Suspense>
  </MainLayout>
);

export default LandingPage;
