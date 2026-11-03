import MainLayout from '../layouts/MainLayout';
import RibbonDivider from '../components/RibbonDivider';
import WaveMarquee from '../components/WaveMarquee';
import Reveal from '../components/Reveal';
import TentangHeroSection from '../components/tentang/TentangHeroSection';
import TentangAboutSection from '../components/tentang/TentangAboutSection';
import TentangVisiMisiSection from '../components/tentang/TentangVisiMisiSection';
import TentangTimelineSection from '../components/tentang/TentangTimelineSection';
import TentangKepalaSekolahSection from '../components/tentang/TentangKepalaSekolahSection';

const ProfileSekolahPage = () => (
  <MainLayout showOpeningMarquee={false}>
    <TentangHeroSection />
    <RibbonDivider />
    <Reveal>
      <TentangAboutSection />
    </Reveal>
    <WaveMarquee />
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
