import MainLayout from '../layouts/MainLayout';
import Reveal from '../components/Reveal';
import BeritaHeroSection from '../components/berita/BeritaHeroSection';
import BeritaSorotSection from '../components/berita/BeritaSorotSection';
import RibbonDivider from '../components/RibbonDivider';
import BeritaKategoriSection from '../components/berita/BeritaKategoriSection';
import BeritaAgendaSection from '../components/berita/BeritaAgendaSection';
import StelaAISection from '../components/StelaAISection';

const BeritaPage = () => (
  <MainLayout>
    <BeritaHeroSection />
    <Reveal>
      <BeritaSorotSection />
    </Reveal>
    <RibbonDivider />
    <Reveal>
      <BeritaKategoriSection />
    </Reveal>
    <Reveal>
      <BeritaAgendaSection />
    </Reveal>
    <Reveal>
      <StelaAISection />
    </Reveal>
  </MainLayout>
);

export default BeritaPage;
