import MainLayout from '../layouts/MainLayout';
import Reveal from '../components/Reveal';
import PengumumanHeroSection from '../components/pengumuman/PengumumanHeroSection';
import PengumumanPpdbSection from '../components/pengumuman/PengumumanPpdbSection';
import PengumumanStatsSection from '../components/pengumuman/PengumumanStatsSection';
import PengumumanDaftarSection from '../components/pengumuman/PengumumanDaftarSection';
import CTASection from '../components/CTASection';

const PengumumanPage = () => (
  <MainLayout>
    <PengumumanHeroSection />
    <Reveal>
      <PengumumanPpdbSection />
    </Reveal>
    <Reveal>
      <PengumumanStatsSection />
    </Reveal>
    <Reveal>
      <PengumumanDaftarSection />
    </Reveal>
    <Reveal>
      <CTASection />
    </Reveal>
  </MainLayout>
);

export default PengumumanPage;
