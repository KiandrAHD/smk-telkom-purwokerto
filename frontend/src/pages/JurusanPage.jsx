import MainLayout from '../layouts/MainLayout';
import Reveal from '../components/Reveal';
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
    <Reveal>
      <JurusanListSection />
    </Reveal>
    <RibbonDivider />
    <Reveal>
      <JurusanQuizSection />
    </Reveal>
    <Reveal>
      <PartnersSection />
    </Reveal>
    <Reveal>
      <JurusanCompareSection />
    </Reveal>
    <Reveal>
      <JurusanShowcaseSection />
    </Reveal>
    <Reveal>
      <JurusanFaqSection />
    </Reveal>
    <Reveal>
      <CTASection />
    </Reveal>
  </MainLayout>
);

export default JurusanPage;
