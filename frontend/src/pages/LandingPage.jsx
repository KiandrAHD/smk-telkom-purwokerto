import MainLayout from '../layouts/MainLayout';
import Reveal from '../components/Reveal';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import RibbonDivider from '../components/RibbonDivider';
import DepartmentsSection from '../components/DepartmentsSection';
import PartnersSection from '../components/PartnersSection';
import AchievementsSection from '../components/AchievementsSection';
import StelaAISection from '../components/StelaAISection';
import CTASection from '../components/CTASection';

// Hero sengaja tidak dibungkus <Reveal>: bagian itu sudah kelihatan sejak awal
// dan ikut animasi masuk halaman dari MainLayout, jadi membungkusnya lagi hanya
// membuat gerakannya dobel.
const LandingPage = () => (
  <MainLayout>
    <HeroSection />
    <Reveal>
      <AboutSection />
    </Reveal>
    <RibbonDivider />
    <Reveal>
      <DepartmentsSection />
    </Reveal>
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
  </MainLayout>
);

export default LandingPage;
