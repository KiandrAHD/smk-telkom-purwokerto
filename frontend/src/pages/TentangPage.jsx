import MainLayout from '../layouts/MainLayout';
import Reveal from '../components/Reveal';
import TentangHeroSection from '../components/tentang/TentangHeroSection';
import TentangStatsSection from '../components/tentang/TentangStatsSection';
import TentangAboutSection from '../components/tentang/TentangAboutSection';
import TentangVisiMisiSection from '../components/tentang/TentangVisiMisiSection';
import TentangTimelineSection from '../components/tentang/TentangTimelineSection';
import RibbonDivider from '../components/RibbonDivider';
import TentangKepalaSekolahSection from '../components/tentang/TentangKepalaSekolahSection';

const ProfileSekolahPage = () => (
  <MainLayout>
    <TentangHeroSection />
    <Reveal>
      <TentangStatsSection />
    </Reveal>
    <RibbonDivider animated />
    <Reveal>
      <TentangAboutSection />
    </Reveal>
    <Reveal>
      <TentangVisiMisiSection />
    </Reveal>
    <Reveal>
      <TentangTimelineSection />
    </Reveal>
    <Reveal>
      <TentangKepalaSekolahSection />
    </Reveal>
  </MainLayout>
);

export default ProfileSekolahPage;
