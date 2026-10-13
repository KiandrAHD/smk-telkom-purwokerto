import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HeroBreadcrumb from '../components/HeroBreadcrumb';
import RibbonDivider from '../components/RibbonDivider';
import CalendarBoard from '../components/kalender/CalendarBoard';
import { useLanguage } from '../context/LanguageContext';
import calendar from '../assets/kalender/hero-calendar-source.png';
import wave from '../assets/kalender/hero-wave.png';
import './KalenderPage.css';

export default function KalenderPage() {
  const { t } = useLanguage();
  const [prefix, ...accent] = t('Kalender Kegiatan Sekolah').split(' ');
  return (
    <MainLayout>
      <section data-calendar-hero className="school-hero">
        <div className="hero-container">
          <div className="hero-panel hero-panel--calendar overflow-hidden">
            <div className="hero-copy">
              <HeroBreadcrumb parent="Informasi" parentTo={null} current="Kalender Kegiatan" />
              <div className="flex flex-wrap gap-1">
                {['#DigitalSmartSchool', '#GlobalTechnopreneur'].map(tag => <span key={tag} className="rounded-full border border-primary/25 bg-white px-2 py-1 text-[10px] font-bold tracking-wide text-primary">{tag}</span>)}
              </div>
              <h1 className="mt-4 font-heading text-3xl font-extrabold leading-tight tracking-tight text-dark-900 sm:text-4xl">{prefix} <span className="text-primary">{accent.join(' ')}</span></h1>
              <p className="mt-4 max-w-md text-xs leading-relaxed text-dark-500 sm:text-sm lg:max-w-xs">{t('Temukan jadwal kegiatan, lomba, dan acara terbaru di SMK Telkom Purwokerto.')}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/spmb" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-800">{t('Masuk SPMB')}<ArrowRight className="size-4" /></Link>
                <a href="#kalender" className="inline-flex items-center gap-2 rounded-full border border-dark-200 bg-white px-6 py-3 text-sm font-semibold text-dark-700 transition-colors hover:border-primary hover:text-primary">{t('Lihat Event')}<ArrowRight className="size-4 text-primary" /></a>
              </div>
            </div>
            <div aria-hidden="true" className="hero-calendar-art relative mt-5 aspect-[4/3] sm:aspect-[16/7] lg:absolute lg:inset-0 lg:mt-0 lg:aspect-auto">
              <img src={wave} width="1298" height="770" alt="" className="calendar-hero-wave absolute bottom-0 right-0 h-full w-full lg:-top-[13.4%] lg:h-[113.4%] lg:w-[74.21%]" />
              <div className="absolute left-[20%] top-0 h-full w-[60%] overflow-hidden sm:left-[35%] sm:w-[35%] lg:left-[32%] lg:h-[102.65%] lg:w-[31.16%]">
                <img src={calendar} width="1774" height="887" alt="" fetchPriority="high" className="absolute -left-[14.66%] -top-[0.09%] h-full w-[255.99%] max-w-none" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <RibbonDivider animated />
      <CalendarBoard />
    </MainLayout>
  );
}
