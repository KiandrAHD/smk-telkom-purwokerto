import MainLayout from '../layouts/MainLayout';
import Reveal from '../components/Reveal';
import BkkHeroSection from '../components/bkk/BkkHeroSection';
import BkkLowonganSection from '../components/bkk/BkkLowonganSection';
import BkkPklSection from '../components/bkk/BkkPklSection';
import BkkJalurKarierSection from '../components/bkk/BkkJalurKarierSection';
import BkkAlumniSection from '../components/bkk/BkkAlumniSection';
import CTASection from '../components/CTASection';

const BkkPage = () => (
  <MainLayout>
    <BkkHeroSection />
    <Reveal>
      <BkkLowonganSection />
    </Reveal>
    <Reveal>
      <BkkPklSection />
    </Reveal>
    <Reveal>
      <BkkJalurKarierSection />
    </Reveal>
    <Reveal>
      <BkkAlumniSection />
    </Reveal>
    <Reveal>
      <CTASection />
    </Reveal>
  </MainLayout>
);

export default BkkPage;
