import MainLayout from '../layouts/MainLayout';
import BkkHeroSection from '../components/bkk/BkkHeroSection';
import BkkLowonganSection from '../components/bkk/BkkLowonganSection';
import BkkPklSection from '../components/bkk/BkkPklSection';
import BkkJalurKarierSection from '../components/bkk/BkkJalurKarierSection';
import BkkAlumniSection from '../components/bkk/BkkAlumniSection';
import CTASection from '../components/CTASection';

const BkkPage = () => (
  <MainLayout>
    <BkkHeroSection />
    <BkkLowonganSection />
    <BkkPklSection />
    <BkkJalurKarierSection />
    <BkkAlumniSection />
    <CTASection />
  </MainLayout>
);

export default BkkPage;
