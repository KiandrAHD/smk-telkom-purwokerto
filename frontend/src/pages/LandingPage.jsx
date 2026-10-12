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
const StelaAISection = lazy(() => import('../components/StelaAISection'));
const CTASection = lazy(() => import('../components/CTASection'));

const SectionFallback = () => <div className="py-12 bg-white" />;

// Hero sengaja tidak dibungkus <Reveal>: bagian itu sudah kelihatan sejak awal
// dan ikut animasi masuk halaman dari MainLayout, jadi membungkusnya lagi hanya
// membuat gerakannya dobel.
const LandingPage = () => (
  <MainLayout>
    <HeroSection />
    <AboutSection />
    <RibbonDivider animated />
    <DepartmentsSection />
    <Suspense fallback={<SectionFallback />}>
      <FacilitiesSection />
      <Reveal>
        <PartnersSection />
      </Reveal>
      <Reveal>
        <AchievementsSection />
      </Reveal>
      <Reveal>
        <StelaAISection />
      </Reveal>
      <Reveal>
        <CTASection />
      </Reveal>
    </Suspense>
  </MainLayout>
);

export default LandingPage;
