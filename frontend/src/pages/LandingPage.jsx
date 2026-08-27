import MainLayout from '../layouts/MainLayout';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import RibbonDivider from '../components/RibbonDivider';
import DepartmentsSection from '../components/DepartmentsSection';
import PartnersSection from '../components/PartnersSection';
import AchievementsSection from '../components/AchievementsSection';
import StelaAISection from '../components/StelaAISection';
import CTASection from '../components/CTASection';

const LandingPage = () => (
  <MainLayout>
    <HeroSection />
    <AboutSection />
    <RibbonDivider />
    <DepartmentsSection />
    <PartnersSection />
    <AchievementsSection />
    <StelaAISection />
    <CTASection />
  </MainLayout>
);

export default LandingPage;
