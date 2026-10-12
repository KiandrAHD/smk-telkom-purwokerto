import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLenis } from 'lenis/react';
import { ArrowRight } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import Modal from '../components/dashboard/Modal';
import StelaAISection from '../components/StelaAISection';
import CTASection from '../components/CTASection';
import { useLanguage } from '../context/LanguageContext';
import { fasilitasData } from '../data/fasilitasData';
import { ctaMasukPpdb } from '../data/dummyData';
import hero from '../assets/landing/beranda-hero.webp';
import hero640 from '../assets/landing/beranda-hero-640.webp';
import hero960 from '../assets/landing/beranda-hero-960.webp';
import accent from '../assets/fasilitas/page-accent.png';
import './FasilitasPage.css';

const categories = ['Semua', 'Laboratorium', 'Kelas', 'Perpustakaan'];

export default function FasilitasPage() {
  const { t } = useLanguage();
  const [params, setParams] = useSearchParams();
  const requested = params.get('kategori');
  const category = categories.includes(requested) ? requested : 'Semua';
  const [selected, setSelected] = useState(null);
  const lenis = useLenis();
  const count = fasilitasData.filter(item => category === 'Semua' || item.category === category).length;
  const groups = categories.slice(1).filter(name => category === 'Semua' || category === name);
  const [titleStart, ...titleEnd] = t('Fasilitas Sekolah').split(' ');

  useEffect(() => {
    if (!selected) return undefined;
    lenis?.stop();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; lenis?.start(); };
  }, [selected, lenis]);

  const selectCategory = name => {
    const next = new URLSearchParams(params);
    if (name === 'Semua') next.delete('kategori');
    else next.set('kategori', name);
    setParams(next, { replace: true });
  };

  return (
    <MainLayout>
      <div className="facilities-page">
        <section aria-labelledby="fasilitas-hero-title" className="px-4 pb-10 pt-4 sm:px-6 lg:px-[2.27%] lg:pb-[3.8vw] lg:pt-[2.6vw]">
          <div className="relative mx-auto max-w-[1847px] overflow-hidden rounded-[20px] border border-[#ce0b21]/40 bg-white lg:min-h-[36.76vw]">
            <img src={hero} srcSet={`${hero640} 640w, ${hero960} 960w, ${hero} 1208w`} sizes="(min-width: 1024px) 65.4vw, 100vw" alt={t('Siswa SMK Telkom Purwokerto')} width="1208" height="679" fetchPriority="high" className="h-auto w-full lg:absolute lg:right-0 lg:top-0 lg:h-full lg:w-[68.5%] lg:object-cover" />
            <div className="relative z-10 px-5 py-7 sm:px-8 lg:w-[35%] lg:pl-[2%] lg:pr-0 lg:pt-[4%]">
              <span className="inline-block rounded-full border border-[#ce0b21]/25 px-2 py-1 text-[10px] font-extrabold tracking-[0.12em] text-[#cc0a22]">#DigitalSmartSchool</span>
              <h1 id="fasilitas-hero-title" className="mt-4 text-3xl font-extrabold leading-[1.25] tracking-[0.05em] text-black sm:text-4xl lg:text-[clamp(1.5rem,2.6vw,3rem)]">
                {t('Ruang Kelas Modern,')}<br /><span className="text-[#cc0a22]">{t('Tempat Inspirasi dan Inovasi Dimulai')}</span>
              </h1>
              <p className="mt-5 max-w-[467px] text-sm font-medium leading-relaxed tracking-[0.06em] text-black/70 lg:mt-[3vw] lg:max-w-[25.3vw] lg:text-[clamp(0.75rem,0.76vw,0.875rem)]">{t('Kami menghadirkan lingkungan belajar yang bersih, representatif, dan berbasis teknologi untuk memicu kreativitas serta produktivitas siswa dalam menguasai keahlian masa depan.')}</p>
              <div className="mt-6 flex flex-wrap gap-3 lg:mt-[2.4vw]">
                <Link to={ctaMasukPpdb.href} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 py-3 text-xs font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">{t(ctaMasukPpdb.label)}<ArrowRight aria-hidden="true" className="size-4" /></Link>
                <Link to="#daftar-fasilitas" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-dark-200 bg-white px-5 py-3 text-xs font-semibold text-dark-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">{t('Lihat Fasilitas')}<ArrowRight aria-hidden="true" className="size-4 text-primary" /></Link>
              </div>
            </div>
          </div>
        </section>
        <section id="daftar-fasilitas" aria-labelledby="fasilitas-title" className="relative isolate scroll-mt-28 pb-10 sm:pb-14 lg:pb-[4vw]">
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-[2.11%] overflow-hidden lg:block">
            {[0, 1, 2, 3].map(index => <img key={index} src={accent} alt="" width="39" height="564" className="block h-auto w-full" />)}
          </div>
          <div className="mx-auto w-[calc(100%-2rem)] max-w-[1607px] sm:w-[calc(100%-3rem)] lg:ml-[6.5%] lg:mr-auto lg:w-[84.65%]">
            <h2 id="fasilitas-title" className="font-heading text-3xl font-semibold tracking-[0.05em] text-black lg:text-[clamp(1.875rem,2.6vw,3rem)]"><span className="text-[#cd091d]">{titleStart}</span> {titleEnd.join(' ')}</h2>
            <div className="mt-6 flex flex-wrap gap-3 lg:mt-[2.1vw] lg:gap-[1.24vw]" role="group" aria-label={t('Filter fasilitas')}>
              {categories.map(name => <button key={name} type="button" aria-pressed={category === name} aria-controls="fasilitas-grid" onClick={() => selectCategory(name)} className={`min-h-11 rounded-full border px-5 py-2.5 font-heading text-sm font-semibold tracking-[0.05em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary lg:min-h-[3.46vw] lg:min-w-[9.25vw] lg:px-[1.2vw] lg:text-[clamp(0.875rem,1.3vw,1.5rem)] ${category === name ? 'border-[#cd0b20] bg-[#cd0b20] text-white' : 'border-[#cd0b20]/45 bg-white text-[#cd0b20] hover:bg-primary-50'}`}>{t(name)}</button>)}
            </div>
            <p className="sr-only" role="status">{t('{count} fasilitas dalam kategori {category}', { count, category: t(category) })}</p>
            <div id="fasilitas-grid" className="mt-9 space-y-12 lg:mt-[3.3vw] lg:space-y-[6.5vw]">
              {groups.map(group => <section key={group} aria-label={t(group)}>
                <h3 className="font-heading text-2xl font-semibold tracking-[0.05em] text-[#cd0b20] lg:text-[clamp(1.5rem,2.16vw,2.5rem)]">{t(group === 'Kelas' ? 'Ruang Kelas' : group)}</h3>
                <div data-facility-grid className="mt-5 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:mt-[0.65vw] lg:grid-cols-4 lg:gap-[2.5vw]">
                  {fasilitasData.filter(item => item.category === group).map(item => <article key={item.id} data-facility-card={item.id} className="flex flex-col overflow-hidden rounded-[20px] bg-[#fffdfd] shadow-[0_0_24px_rgba(130,130,130,0.25)]">
                    <img src={item.image} alt={t(item.name)} width="600" height="400" loading="lazy" className="aspect-[356/201] w-full object-cover" />
                    <div className="flex flex-1 flex-col px-5 pb-3 pt-4 lg:px-[1.35vw]">
                      <h4 className="text-xl font-bold leading-snug text-[#cd0b20] lg:text-[clamp(1rem,1.73vw,2rem)]">{t(item.name)}</h4>
                      <p className="mt-2 text-xs font-medium leading-relaxed text-black/70">{t(item.preview)}</p>
                      <button type="button" onClick={() => setSelected(item)} aria-label={t('Selengkapnya tentang {name}', { name: t(item.name) })} className="mt-auto inline-flex min-h-11 items-center gap-2 self-start pt-2 text-[13px] tracking-[0.08em] text-[#e8232a] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">{t('Selengkapnya')}<ArrowRight aria-hidden="true" className="size-4" /></button>
                    </div>
                  </article>)}
                </div>
              </section>)}
            </div>
          </div>
        </section>
        <StelaAISection variant="prestasi" />
        <CTASection variant="fasilitas" />
      </div>
      <Modal terbuka={selected !== null} onTutup={() => setSelected(null)} judul={selected ? t(selected.name) : ''} labelTutup={t('Tutup')} lebar="max-w-2xl">
        {selected && <div data-lenis-prevent className="max-h-[70dvh] overflow-y-auto overscroll-contain"><img src={selected.image} alt={t(selected.name)} width="900" height="600" className="aspect-[3/2] w-full rounded-xl object-cover" /><p className="mt-5 text-sm leading-7 text-dark-600">{t(selected.description)}</p></div>}
      </Modal>
    </MainLayout>
  );
}
