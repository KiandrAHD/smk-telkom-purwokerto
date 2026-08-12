import MainLayout from '../layouts/MainLayout';
import BeritaHeroSection from '../components/berita/BeritaHeroSection';
import BeritaSorotSection from '../components/berita/BeritaSorotSection';
import RibbonDivider from '../components/RibbonDivider';
import BeritaKategoriSection from '../components/berita/BeritaKategoriSection';
import BeritaAgendaSection from '../components/berita/BeritaAgendaSection';
import StelaAISection from '../components/StelaAISection';

const BeritaPage = () => (
  <MainLayout>
    <BeritaHeroSection />
    <BeritaSorotSection />
    <RibbonDivider />
    <BeritaKategoriSection />
    <BeritaAgendaSection />
    <StelaAISection />
  </MainLayout>
);

export default BeritaPage;
