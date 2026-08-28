import MainLayout from '../layouts/MainLayout';
import Reveal from '../components/Reveal';
import PrestasiHeroSection from '../components/prestasi/PrestasiHeroSection';
import PrestasiUnggulanSection from '../components/prestasi/PrestasiUnggulanSection';
import RibbonDivider from '../components/RibbonDivider';
import PrestasiGaleriSection from '../components/prestasi/PrestasiGaleriSection';
import PrestasiPerjalananSection from '../components/prestasi/PrestasiPerjalananSection';
import PrestasiDukunganSection from '../components/prestasi/PrestasiDukunganSection';
import CTASection from '../components/CTASection';

const PrestasiPage = () => (
  <MainLayout>
    <PrestasiHeroSection />
    <Reveal>
      <PrestasiUnggulanSection />
    </Reveal>
    <RibbonDivider />
    <Reveal>
      <PrestasiGaleriSection />
    </Reveal>
    <Reveal>
      <PrestasiPerjalananSection />
    </Reveal>
    <Reveal>
      <PrestasiDukunganSection />
    </Reveal>
    <Reveal>
      <CTASection />
    </Reveal>
  </MainLayout>
);

export default PrestasiPage;
