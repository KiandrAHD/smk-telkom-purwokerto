import { useEffect } from 'react';
import { applyPageMetadata } from '../utils/seo';
import { useParams, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import MainLayout from '../layouts/MainLayout';
import RibbonDivider from '../components/RibbonDivider';
import JurusanDetailHero from '../components/jurusan/JurusanDetailHero';
import JurusanDetailKonten from '../components/jurusan/JurusanDetailKonten';
import ErrorPage from './ErrorPage';
import { jurusanDetail } from '../data/dummyData';
import { jurusanDetailDesign } from '../data/jurusanDetailDesign';
import '../styles/jurusan-detail.css';

export default function JurusanDetailPage() {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const { slug } = useParams();
  const item = jurusanDetail.find(entry => entry.slug === slug);
  const design = Object.hasOwn(jurusanDetailDesign, slug) ? jurusanDetailDesign[slug] : undefined;
  useEffect(() => {
    if (!item || !design) return;
    applyPageMetadata({ pathname, title: `${t(item.title)} | SMK Telkom Purwokerto`, description: t(design.description), indexable: true });
  }, [pathname, item, design, t]);
  if (!item || !design) return <ErrorPage />;
  return (
    <MainLayout>
      <JurusanDetailHero item={item} design={design} />
      <RibbonDivider animated />
      <JurusanDetailKonten item={item} design={design} />
    </MainLayout>
  );
}
