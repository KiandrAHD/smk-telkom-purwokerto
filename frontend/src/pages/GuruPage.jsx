import { useEffect, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import CTASection from '../components/CTASection';
import RibbonDivider from '../components/RibbonDivider';
import StelaAISection from '../components/StelaAISection';
import { guruData, kepalaSekolah } from '../data/dummyData';
import MainLayout from '../layouts/MainLayout';
import { slugify } from '../utils/slug';
import heroPhoto from '../assets/tentang/guru-page-hero.webp';
import accent from '../assets/landing/telkom-accent.png';

const getPageSize = () => {
  if (typeof window === 'undefined') return 4;
  if (window.matchMedia('(min-width: 1024px)').matches) return 4;
  return window.matchMedia('(min-width: 640px)').matches ? 2 : 1;
};

function GuruCarousel() {
  const [pageSize, setPageSize] = useState(getPageSize);
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(guruData.length / pageSize);

  useEffect(() => {
    const small = window.matchMedia('(min-width: 640px)');
    const large = window.matchMedia('(min-width: 1024px)');
    const update = () => {
      setPageSize(getPageSize());
      setPage(0);
    };
    small.addEventListener('change', update);
    large.addEventListener('change', update);
    return () => {
      small.removeEventListener('change', update);
      large.removeEventListener('change', update);
    };
  }, []);

  return (
    <section aria-labelledby="guru-list-title" className="relative overflow-hidden bg-white py-14 sm:py-20">
      <img src={accent} alt="" aria-hidden="true" className="pointer-events-none absolute -left-20 top-12 w-40 opacity-20 sm:w-52" />
      <img src={accent} alt="" aria-hidden="true" className="pointer-events-none absolute -right-20 bottom-4 w-40 opacity-20 sm:w-52" />
      <div className="relative mx-auto max-w-[1546px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Profil Guru</p>
          <h2 id="guru-list-title" className="mt-2 font-heading text-2xl font-extrabold text-dark-900 sm:text-3xl lg:text-4xl">
            Guru &amp; Tenaga Pendidik
          </h2>
          <p className="mt-3 text-sm text-dark-500">Kenali tim yang mendampingi proses belajar di SMK Telkom Purwokerto.</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6" aria-live="polite">
          {guruData.slice(page * pageSize, (page + 1) * pageSize).map((guru) => (
            <Link
              key={guru.nama}
              to={`/profil-sekolah/guru/${slugify(guru.nama)}`}
              className="group block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              aria-label={`Lihat profil ${guru.nama}`}
            >
              <article className="relative h-full overflow-hidden rounded-2xl bg-[repeating-conic-gradient(#cd091d_0%_25%,#bcbcbc_0%_50%,#fff_0%_75%,#ab0a1b_0%_100%)] bg-[length:28px_28px] p-1.5 transition-transform duration-300 group-hover:-translate-y-1">
                <div className="relative h-full overflow-hidden rounded-xl bg-white">
                  <img src={guru.image} alt={`Foto ${guru.nama}`} loading="lazy" className="aspect-[4/5] w-full object-cover object-top" />
                  <div className="absolute inset-x-3 bottom-3 rounded-xl bg-white px-4 py-3 shadow-card">
                    <h3 className="font-heading text-sm font-bold leading-snug text-dark-900">{guru.nama}</h3>
                    <p className="mt-1 text-xs leading-snug text-dark-500">{guru.jabatan}</p>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {pageCount > 1 && (
          <nav aria-label="Navigasi profil guru" className="mt-8 flex items-center justify-center gap-4">
            <button type="button" onClick={() => setPage((current) => Math.max(0, current - 1))} disabled={page === 0} aria-label="Guru sebelumnya" className="grid h-9 w-9 place-items-center rounded-full border border-primary/40 text-primary transition-colors hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: pageCount }, (_, index) => (
                <button key={index} type="button" onClick={() => setPage(index)} aria-label={`Lihat halaman guru ${index + 1}`} aria-current={page === index ? 'page' : undefined} className="grid h-8 w-8 place-items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                  <span aria-hidden="true" className={`h-2.5 rounded-full transition-all ${page === index ? 'w-6 bg-primary' : 'w-2.5 bg-dark-200 hover:bg-primary/50'}`} />
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))} disabled={page === pageCount - 1} aria-label="Guru berikutnya" className="grid h-9 w-9 place-items-center rounded-full border border-primary/40 text-primary transition-colors hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              <ChevronRight size={18} />
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}

function GuruPage() {
  return (
    <MainLayout>
      <section className="bg-white pb-8 pt-6 sm:pb-12 sm:pt-10">
        <div className="mx-auto max-w-[1546px] px-4 sm:px-6 lg:px-8">
          <div className="relative grid min-h-[490px] overflow-hidden rounded-[2rem] border-[3px] border-primary/40 bg-white lg:grid-cols-[42%_58%] lg:items-center">
            <div className="relative z-10 px-6 pb-4 pt-10 sm:px-10 lg:px-12 lg:py-14">
              <nav aria-label="Breadcrumb" className="mb-10 flex items-center gap-2 text-xs text-dark-500 lg:mb-16">
                <Link to="/" className="hover:text-primary">Beranda</Link>
                <ChevronRight size={14} aria-hidden="true" />
                <span aria-current="page" className="font-semibold text-primary">Profil Guru</span>
              </nav>
              <p className="mb-3 inline-block rounded-md bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">#DigitalSmartSchool</p>
              <h1 className="font-heading text-[clamp(2.2rem,3vw,3.75rem)] font-extrabold leading-[1.08] text-dark-900">
                Profile Guru<br /><span className="text-primary">SMK Telkom</span><br />Purwokerto
              </h1>
              <p className="mt-5 max-w-md text-sm leading-7 text-dark-500 sm:text-base">
                Tim pengajar kami memadukan kurikulum berbasis teknologi terbaru dengan metode pembelajaran interaktif. Kami siap membimbing siswa menguasai logika, pemrograman, hingga mampu menciptakan solusi digital masa depan.
              </p>
              <Link to="/profil-sekolah" className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                Explore School <ArrowRight size={17} />
              </Link>
            </div>
            <div className="relative min-h-[260px] self-stretch sm:min-h-[350px] lg:min-h-[490px]">
              <img
                src={heroPhoto}
                alt="Guru dan tenaga pendidik SMK Telkom Purwokerto"
                width="2200"
                height="1033"
                fetchPriority="high"
                className="absolute inset-0 h-full w-full object-cover object-center lg:[mask-image:linear-gradient(to_right,transparent,black_15%)]"
              />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="kepala-sekolah-title" className="relative overflow-hidden bg-white py-12 sm:py-20">
        <img src={accent} alt="" aria-hidden="true" className="pointer-events-none absolute -left-20 top-8 w-48 opacity-20 sm:w-64" />
        <img src={accent} alt="" aria-hidden="true" className="pointer-events-none absolute -right-16 bottom-0 w-48 opacity-20 sm:w-64" />
        <div className="relative mx-auto max-w-[1546px] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-[1300px] overflow-hidden rounded-3xl border-2 border-primary bg-white shadow-card md:grid-cols-[38%_62%]">
            <div className="relative min-h-[320px] overflow-hidden bg-dark-50 sm:min-h-[420px]">
              <div aria-hidden="true" className="absolute inset-y-0 left-0 w-2/3 bg-[repeating-conic-gradient(#cd091d_0%_25%,#bcbcbc_0%_50%,#fff_0%_75%,#ab0a1b_0%_100%)] bg-[length:96px_96px]" />
              <div aria-hidden="true" className="absolute inset-x-8 bottom-0 h-4/5 rounded-t-[5rem] bg-white" />
              <img src={kepalaSekolah.image} alt={`Foto ${kepalaSekolah.name}`} loading="lazy" className="absolute inset-0 h-full w-full object-contain object-bottom" />
            </div>
            <div className="flex flex-col justify-center px-6 py-9 sm:px-10 sm:py-12 lg:px-16">
              <h2 id="kepala-sekolah-title" className="font-heading text-xl font-extrabold leading-tight text-dark-900 sm:text-2xl lg:text-3xl">Kepala SMK Telkom Purwokerto</h2>
              <p className="mt-1 font-heading text-base font-bold text-primary sm:text-lg">SMK Telkom Purwokerto</p>
              <h3 className="mt-6 font-heading text-xl font-extrabold leading-tight text-dark-900 sm:text-2xl lg:text-3xl">{kepalaSekolah.name}</h3>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-dark-600 sm:text-base sm:leading-7">{kepalaSekolah.quoteFull}</p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="font-heading text-base font-bold text-primary sm:text-lg">Jabatan/Posisi</p>
                  <p className="mt-1 flex items-start gap-1 text-xs text-dark-600 sm:text-sm"><Quote aria-hidden="true" className="mt-0.5 h-3 w-3 shrink-0 fill-primary text-primary" /> Kepala Sekolah</p>
                </div>
                <div>
                  <p className="font-heading text-base font-bold text-primary sm:text-lg">Motto</p>
                  <p className="mt-1 flex items-start gap-1 text-xs text-dark-600 sm:text-sm"><Quote aria-hidden="true" className="mt-0.5 h-3 w-3 shrink-0 fill-primary text-primary" /> Memimpin dengan Inovasi, Mencetak Talenta Digital Masa Depan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <GuruCarousel />
      <RibbonDivider />
      <StelaAISection />
      <CTASection />
    </MainLayout>
  );
}

export default GuruPage;
