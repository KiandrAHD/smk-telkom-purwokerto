import MainLayout from '../layouts/MainLayout';
import TentangHeroSection from '../components/tentang/TentangHeroSection';
import TentangStatsSection from '../components/tentang/TentangStatsSection';
import TentangAboutSection from '../components/tentang/TentangAboutSection';
import TentangVisiMisiSection from '../components/tentang/TentangVisiMisiSection';
import TentangTimelineSection from '../components/tentang/TentangTimelineSection';
import TentangKepalaSekolahSection from '../components/tentang/TentangKepalaSekolahSection';
import TentangFasilitasSection from '../components/tentang/TentangFasilitasSection';
import TentangBottomBannersSection from '../components/tentang/TentangBottomBannersSection';

const TentangPage = () => {
  return (
    <MainLayout>
      <TentangHeroSection />
      <TentangStatsSection />
      <TentangAboutSection />
      <TentangVisiMisiSection />
      <TentangTimelineSection />
      <TentangKepalaSekolahSection />
      <TentangFasilitasSection />
      <TentangBottomBannersSection />
    </MainLayout>
  );
};

export default TentangPage;
