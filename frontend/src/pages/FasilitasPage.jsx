import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLenis } from 'lenis/react';
import { ArrowRight } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import Modal from '../components/dashboard/Modal';
import ContentImage from '../components/ContentImage';
import HeroBreadcrumb from '../components/HeroBreadcrumb';
import RibbonDivider from '../components/RibbonDivider';
import CampusExplorer from '../components/fasilitas/CampusExplorer';
import { campusFacilities, campusIdForCard } from '../data/campusData';
import { useLanguage } from '../context/LanguageContext';
import { fasilitasCategories as categories, fasilitasViews } from '../data/fasilitasPageData';
import { ctaMasukPpdb } from '../data/dummyData';
import hero from '../assets/landing/beranda-hero.webp';
import hero640 from '../assets/landing/beranda-hero-640.webp';
import hero960 from '../assets/landing/beranda-hero-960.webp';
import accent from '../assets/fasilitas/page-accent.png';

function GroupTitle({ title, t }) {
  const [first, ...rest] = t(title).split(' ');
  return <h3 className="font-heading text-xl font-bold leading-tight text-dark-900 sm:text-2xl"><span className="text-primary">{first}</span> {rest.join(' ')}</h3>;
}

export default function FasilitasPage() {
  const { t } = useLanguage();
  const [params, setParams] = useSearchParams();
  const requested = params.get('kategori');
  const category = categories.includes(requested) ? requested : 'Semua';
  const [selected, setSelected] = useState(null);
  const [mapRequest, setMapRequest] = useState(null);
  const campusActionFrame = useRef(null);
  const selectedCampusId = selected ? campusIdForCard(selected) : null;
  const selectedCampus = selectedCampusId ? campusFacilities[selectedCampusId].content : null;
  const lenis = useLenis();
  const groups = fasilitasViews[category];
  const count = groups.reduce((total, group) => total + group.items.length, 0);
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
  useEffect(() => () => cancelAnimationFrame(campusActionFrame.current), []);
  const viewCampusList = list => {
    selectCategory(list.category);
    cancelAnimationFrame(campusActionFrame.current);
    campusActionFrame.current = requestAnimationFrame(() => {
      const target = list.item ? document.querySelector(`[data-facility-card="${list.item}"]`) : document.getElementById(`fasilitas-${list.group}`);
      (target || document.getElementById('daftar-fasilitas'))?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      target?.querySelector('button')?.focus({ preventScroll: true });
    });
  };
  const locateCampus = () => {
    setSelected(null);
    cancelAnimationFrame(campusActionFrame.current);
    campusActionFrame.current = requestAnimationFrame(() => setMapRequest(current => ({ id: selectedCampusId, sequence: (current?.sequence || 0) + 1 })));
  };

  return (
    <MainLayout>
      <div>
        <section aria-labelledby="fasilitas-hero-title" className="school-hero hero-container">
          <div className="hero-panel hero-panel--background hero-panel--bleed hero-panel--students">
            <img src={hero} srcSet={`${hero640} 640w, ${hero960} 960w, ${hero} 1208w`} sizes="(min-width: 1280px) 850px, (min-width: 1024px) 70vw, 100vw" alt={t('Siswa SMK Telkom Purwokerto')} width="1208" height="679" fetchPriority="high" className="hero-background object-cover" />
            <div className="hero-copy">
              <HeroBreadcrumb current="Fasilitas Sekolah" />
              <span className="inline-block self-start rounded-full border border-primary/25 px-2.5 py-1 text-[10px] font-bold text-primary">#DigitalSmartSchool</span>
              <h1 id="fasilitas-hero-title" className="mt-4 font-heading text-3xl font-extrabold leading-[1.2] tracking-tight text-dark-900 sm:text-4xl lg:text-[1.75rem] xl:text-[2rem]">
                {t('Ruang Kelas Modern,')}<br /><span className="text-primary">{t('Tempat Inspirasi dan Inovasi Dimulai')}</span>
              </h1>
              <p className="mt-4 max-w-md text-xs leading-relaxed text-dark-500 sm:text-sm">{t('Kami menghadirkan lingkungan belajar yang bersih, representatif, dan berbasis teknologi untuk memicu kreativitas serta produktivitas siswa dalam menguasai keahlian masa depan.')}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to={ctaMasukPpdb.href} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">{t(ctaMasukPpdb.label)}<ArrowRight aria-hidden="true" className="size-4" /></Link>
                <Link to="#daftar-fasilitas" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-dark-200 bg-white px-6 py-3 text-sm font-semibold text-dark-700 transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">{t('Lihat Fasilitas')}<ArrowRight aria-hidden="true" className="size-4" /></Link>
              </div>
            </div>
          </div>
        </section>
        <RibbonDivider animated />
        <CampusExplorer request={mapRequest} onViewFacilities={viewCampusList} />
        <section id="daftar-fasilitas" aria-labelledby="fasilitas-title" className="relative isolate scroll-mt-28 bg-white py-8 lg:py-12">
        {['right', 'left'].map(side => <div key={side} aria-hidden="true" className={`pointer-events-none absolute inset-y-0 ${side === 'right' ? 'right-0' : 'left-0 rotate-180'} -z-10 hidden w-[2.11%] overflow-hidden lg:block`}>
            {[0, 1, 2, 3].map(index => <img key={index} src={accent} alt="" width="39" height="564" className="block h-auto w-full" />)}
          </div>)}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 id="fasilitas-title" className="font-heading text-2xl font-extrabold leading-tight tracking-tight text-dark-900 sm:text-3xl"><span className="text-primary">{titleStart}</span> {titleEnd.join(' ')}</h2>
            <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label={t('Filter fasilitas')}>
              {categories.map(name => <button key={name} type="button" aria-pressed={category === name} aria-controls="fasilitas-grid" onClick={() => selectCategory(name)} className={`min-h-11 rounded-full border px-5 py-2.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${category === name ? 'border-primary bg-primary text-white hover:bg-primary-800' : 'border-dark-200 bg-white text-dark-600 hover:border-primary hover:text-primary'}`}>{t(name)}</button>)}
            </div>
            <p className="sr-only" role="status">{t('{count} fasilitas dalam kategori {category}', { count, category: t(category) })}</p>
            <div id="fasilitas-grid" className="mt-7 space-y-8 lg:space-y-12">
              {groups.map(group => <section key={group.id} id={`fasilitas-${group.id}`} className="scroll-mt-28" aria-label={t(group.title || category)}>
                {group.title && <GroupTitle title={group.title} t={t} />}
                <div data-facility-grid className={`${group.title ? 'mt-5 ' : ''}grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4`}>
                  {group.items.map(item => <article key={item.id} data-facility-card={item.id} className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-card transition-colors hover:border-primary">
                    <div className="aspect-video shrink-0 overflow-hidden bg-dark-50">
                      <ContentImage src={item.image} alt={t('Ilustrasi kegiatan belajar')} width="712" height="402" loading="lazy" decoding="async" className="block h-full w-full object-cover object-top [&:is(img)]:h-[110%] motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col px-4 pb-3 pt-4">
                      <h4 className="font-heading text-base font-bold leading-snug text-primary">{t(item.name)}</h4>
                      <p className="mt-1.5 text-xs leading-relaxed text-dark-500">{t(item.preview)}</p>
                      <button type="button" onClick={() => setSelected(item)} aria-label={t('Selengkapnya tentang {name}', { name: t(item.name) })} className="mt-auto inline-flex min-h-11 items-center gap-2 self-start pt-3 text-xs font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">{t('Selengkapnya')}<ArrowRight aria-hidden="true" className="size-3.5" /></button>
                    </div>
                  </article>)}
                </div>
              </section>)}
            </div>
          </div>
        </section>
      </div>
      <Modal terbuka={selected !== null} onTutup={() => setSelected(null)} judul={selected ? t(selected.name) : ''} labelTutup={t('Tutup')} lebar="max-w-2xl">
        {selected && <div data-lenis-prevent className="max-h-[70dvh] overflow-y-auto overscroll-contain"><ContentImage src={selected.image} alt={t('Ilustrasi kegiatan belajar')} width="712" height="402" className="aspect-video w-full rounded-xl object-cover" /><p className="mt-5 text-sm leading-relaxed text-dark-600">{t(selected.preview)}</p><p className="mt-3 text-xs leading-relaxed text-dark-500">{t('Foto merupakan ilustrasi kegiatan belajar. Dokumentasi khusus ruangan ini belum tersedia.')}</p>
          {selectedCampus && <div className="mt-4 rounded-xl bg-dark-50 p-4"><h3 className="font-heading text-sm font-bold text-primary">{t(selectedCampus.name)}</h3><p className="mt-2 text-xs leading-relaxed text-dark-600">{t(selectedCampus.preview || 'Informasi fasilitas ini belum tersedia. Nama dan titik lokasi mengikuti referensi peta sekolah.')}</p><button type="button" onClick={locateCampus} className="mt-3 inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary">{t('Lihat lokasi di peta')}<ArrowRight className="size-4" aria-hidden="true" /></button></div>}
        </div>}
      </Modal>
    </MainLayout>
  );
}
