import MainLayout from '../layouts/MainLayout';
import Reveal from '../components/Reveal';
import TentangHeroSection from '../components/tentang/TentangHeroSection';
import TentangStatsSection from '../components/tentang/TentangStatsSection';
import TentangAboutSection from '../components/tentang/TentangAboutSection';
import TentangProfilVideoSection from '../components/tentang/TentangProfilVideoSection';
import TentangVisiMisiSection from '../components/tentang/TentangVisiMisiSection';
import TentangTimelineSection from '../components/tentang/TentangTimelineSection';
import RibbonDivider from '../components/RibbonDivider';
import TentangKepalaSekolahSection from '../components/tentang/TentangKepalaSekolahSection';
import StelaAISection from '../components/StelaAISection';
import CTASection from '../components/CTASection';

const ProfileSekolahPage = () => (
  <MainLayout>
    <TentangHeroSection />
    <Reveal>
      <TentangStatsSection />
    </Reveal>
    <Reveal>
      <TentangAboutSection />
    </Reveal>
    <Reveal>
      <TentangProfilVideoSection />
    </Reveal>
    <Reveal>
      <TentangVisiMisiSection />
    </Reveal>
    <Reveal>
      <TentangTimelineSection />
    </Reveal>
    <RibbonDivider />
    <Reveal>
      <TentangKepalaSekolahSection />
    </Reveal>
    <Reveal>
      <StelaAISection />
    </Reveal>
    <Reveal>
      <CTASection />
    </Reveal>
  </MainLayout>
);

export default ProfileSekolahPage;
