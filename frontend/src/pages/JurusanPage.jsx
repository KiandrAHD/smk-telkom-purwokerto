import MainLayout from '../layouts/MainLayout';
import JurusanHeroSection from '../components/jurusan/JurusanHeroSection';
import JurusanListSection from '../components/jurusan/JurusanListSection';
import RibbonDivider from '../components/RibbonDivider';
import JurusanQuizSection from '../components/jurusan/JurusanQuizSection';
import PartnersSection from '../components/PartnersSection';
import JurusanCompareSection from '../components/jurusan/JurusanCompareSection';
import JurusanShowcaseSection from '../components/jurusan/JurusanShowcaseSection';
import JurusanFaqSection from '../components/jurusan/JurusanFaqSection';
import CTASection from '../components/CTASection';

const JurusanPage = () => (
  <MainLayout>
    <JurusanHeroSection />
    <JurusanListSection />
    <RibbonDivider />
    <JurusanQuizSection />
    <PartnersSection />
    <JurusanCompareSection />
    <JurusanShowcaseSection />
    <JurusanFaqSection />
    <CTASection />
  </MainLayout>
);

export default JurusanPage;
