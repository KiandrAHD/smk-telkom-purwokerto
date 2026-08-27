import MainLayout from '../layouts/MainLayout';
import PengumumanHeroSection from '../components/pengumuman/PengumumanHeroSection';
import PengumumanPpdbSection from '../components/pengumuman/PengumumanPpdbSection';
import PengumumanStatsSection from '../components/pengumuman/PengumumanStatsSection';
import PengumumanDaftarSection from '../components/pengumuman/PengumumanDaftarSection';
import CTASection from '../components/CTASection';

const PengumumanPage = () => (
  <MainLayout>
    <PengumumanHeroSection />
    <PengumumanPpdbSection />
    <PengumumanStatsSection />
    <PengumumanDaftarSection />
    <CTASection />
  </MainLayout>
);

export default PengumumanPage;
