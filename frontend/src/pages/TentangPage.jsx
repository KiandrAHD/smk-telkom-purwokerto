import MainLayout from '../layouts/MainLayout';
import TentangHeroSection from '../components/tentang/TentangHeroSection';
import TentangStatsSection from '../components/tentang/TentangStatsSection';
import TentangAboutSection from '../components/tentang/TentangAboutSection';
import TentangVisiMisiSection from '../components/tentang/TentangVisiMisiSection';
import TentangTimelineSection from '../components/tentang/TentangTimelineSection';
import RibbonDivider from '../components/RibbonDivider';
import TentangKepalaSekolahSection from '../components/tentang/TentangKepalaSekolahSection';
import StelaAISection from '../components/StelaAISection';
import CTASection from '../components/CTASection';

const TentangPage = () => (
  <MainLayout>
    <TentangHeroSection />
    <TentangStatsSection />
    <TentangAboutSection />
    <TentangVisiMisiSection />
    <TentangTimelineSection />
    <RibbonDivider />
    <TentangKepalaSekolahSection />
    <StelaAISection />
    <CTASection />
  </MainLayout>
);

export default TentangPage;
