import MainLayout from '../layouts/MainLayout';
import HeroSection from '../components/HeroSection';
import FeatureSection from '../components/FeatureSection';
import AboutSection from '../components/AboutSection';
import DepartmentsSection from '../components/DepartmentsSection';
import PartnersSection from '../components/PartnersSection';
import AchievementsSection from '../components/AchievementsSection';
import StelaAISection from '../components/StelaAISection';
import CTASection from '../components/CTASection';

export default function LandingPage() {
  return (
    <MainLayout>
      <HeroSection />
      <FeatureSection />
      <AboutSection />
      <DepartmentsSection />
      <PartnersSection />
      <AchievementsSection />
      <StelaAISection />
      <CTASection />

      {/* Section anchors for navbar links */}
      <div id="ppdb" className="relative -top-20" />
      <div id="bkk" className="relative -top-20" />
      <div id="berita" className="relative -top-20" />
      <div id="pengumuman" className="relative -top-20" />
    </MainLayout>
  );
}