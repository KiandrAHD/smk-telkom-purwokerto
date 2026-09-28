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
import watermark from '../assets/landing/telkom-accent.png';
import headmasterAccent from '../assets/tentang/guru-accent-headmaster.svg';

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
    <section aria-labelledby="guru-list-title" className="relative overflow-hidden bg-white pb-12 pt-12 font-['Plus_Jakarta_Sans'] sm:pb-16 sm:pt-16">
      <img src={watermark} alt="" aria-hidden="true" className="pointer-events-none absolute -left-24 top-4 w-48 opacity-35 sm:w-60" />
      <div className="relative mx-auto max-w-[1519px] px-5 sm:px-6 lg:px-8 2xl:px-0">
        <div className="mb-10 text-center sm:mb-10">
          <h2 id="guru-list-title" className="text-2xl font-bold leading-tight text-black sm:text-3xl lg:text-[48px]">
            Guru &amp; Tenaga Pendidik
          </h2>
          <p className="mt-1 text-base font-bold text-[#cd0b20] sm:text-xl lg:text-[32px]">SMK Telkom Purwokerto</p>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              key={pageSize}
              className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
              style={{ transform: `translate3d(-${page * 100}%, 0, 0)` }}
            >
              {Array.from({ length: pageCount }, (_, pageIndex) => (
                <div
                  key={pageIndex}
                  className="grid min-w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12"
                  aria-hidden={pageIndex !== page}
                  inert={pageIndex !== page}
                >
                  {guruData.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize).map((guru) => (
                    <Link
                      key={guru.nama}
                      to={'/profil-sekolah/guru/' + slugify(guru.nama)}
                      aria-label={'Lihat profil ' + guru.nama}
                      className="group relative block aspect-[322/426] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#cd091d]"
                    >
                      <article className="relative h-full bg-white p-[10px] transition-transform duration-300 group-hover:-translate-y-1">
                        <img src={guru.image} alt={'Foto ' + guru.nama} loading="lazy" className="h-full w-full rounded-[10px] object-cover object-top" />
                        <div aria-hidden="true" className="guru-accent-horizontal pointer-events-none absolute inset-x-0 top-0 h-5 bg-repeat-x" />
                        <div aria-hidden="true" className="guru-accent-horizontal pointer-events-none absolute inset-x-0 bottom-0 h-5 bg-repeat-x" />
                        <div aria-hidden="true" className="guru-accent-vertical pointer-events-none absolute inset-y-0 left-0 w-[21px] bg-repeat-y" />
                        <div aria-hidden="true" className="guru-accent-vertical pointer-events-none absolute inset-y-0 right-0 w-[21px] bg-repeat-y" />
                        <div className="absolute bottom-[12%] left-[8%] right-[8%] min-h-[76px] rounded-[16px] bg-white px-4 py-3 shadow-[0_0_18px_rgba(0,0,0,0.16)] sm:min-h-[86px]">
                          <h3 className="text-sm font-extrabold leading-snug tracking-wide text-black sm:text-base xl:text-xl">{guru.nama}</h3>
                          <p className="mt-1 text-[11px] font-medium leading-snug text-black/65 sm:text-xs xl:text-sm">{guru.jabatan}</p>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <span className="sr-only" aria-live="polite">Halaman {page + 1} dari {pageCount}</span>

          {pageCount > 1 && (
            <nav aria-label="Navigasi profil guru" className="mt-8 flex items-center justify-center gap-3 sm:mt-14">
              <button type="button" onClick={() => setPage((current) => Math.max(0, current - 1))} disabled={page === 0} aria-label="Guru sebelumnya" className="grid h-10 w-10 place-items-center rounded-full bg-[#cd091d] text-white transition-colors hover:bg-[#ab0a1b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#cd091d] disabled:cursor-not-allowed disabled:opacity-40 2xl:absolute 2xl:-left-14 2xl:top-[42%]">
                <ChevronLeft size={22} />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: pageCount }, (_, index) => (
                  <button key={index} type="button" onClick={() => setPage(index)} aria-label={'Lihat halaman guru ' + (index + 1)} aria-current={page === index ? 'page' : undefined} className="grid h-8 w-8 place-items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#cd091d]">
                    <span aria-hidden="true" className={page === index ? 'h-3 w-3 rounded-full bg-[#cd091d]' : 'h-3 w-3 rounded-full bg-[#d9d9d9]'} />
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))} disabled={page === pageCount - 1} aria-label="Guru berikutnya" className="grid h-10 w-10 place-items-center rounded-full bg-[#cd091d] text-white transition-colors hover:bg-[#ab0a1b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#cd091d] disabled:cursor-not-allowed disabled:opacity-40 2xl:absolute 2xl:-right-14 2xl:top-[42%]">
                <ChevronRight size={22} />
              </button>
            </nav>
          )}
        </div>
      </div>
    </section>
  );
}

function GuruPage() {
  return (
    <MainLayout>
      <section className="bg-white pb-8 pt-6 sm:pb-12 sm:pt-10">
        <div className="mx-auto max-w-[1847px] px-4 sm:px-6 lg:px-[42px]">
          <div className="relative grid min-h-[508px] overflow-hidden rounded-[24px] border-2 border-[#f09aa3] bg-white lg:grid-cols-[40%_60%]">
            <div className="relative z-10 px-6 pb-8 pt-10 sm:px-10 lg:px-[40px] lg:pt-[58px]">
              <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 font-['Plus_Jakarta_Sans'] text-xs text-black/60">
                <Link to="/" className="hover:text-[#cd091d]">Beranda</Link>
                <ChevronRight size={13} aria-hidden="true" />
                <span aria-current="page" className="font-bold text-[#cd091d]">Profil Guru</span>
              </nav>
              <h1 className="font-heading text-[clamp(2.25rem,3.47vw,4rem)] font-semibold leading-[1.08] tracking-[0.05em] text-black">
                Profile Guru<br /><span className="text-[#cd091d]">SMK Telkom<br />Purwokerto</span>
              </h1>
              <p className="mt-8 max-w-[568px] font-['Plus_Jakarta_Sans'] text-sm font-medium leading-relaxed tracking-[0.06em] text-black/70 sm:text-base">
                Tim pengajar kami memadukan kurikulum berbasis teknologi terbaru dengan metode pembelajaran interaktif. Kami siap membimbing siswa menguasai logika, pemrograman, hingga mampu menciptakan solusi digital masa depan.
              </p>
              <Link to="/profil-sekolah" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#cd091d] px-5 py-3 font-heading text-sm font-semibold tracking-wide text-white transition-colors hover:bg-[#ab0a1b]">
                Explore School <ArrowRight size={17} />
              </Link>
            </div>
            <div className="relative min-h-[260px] self-stretch sm:min-h-[350px] lg:min-h-[508px]">
              <img src={heroPhoto} alt="Guru dan tenaga pendidik SMK Telkom Purwokerto" width="2200" height="1033" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-center lg:[mask-image:linear-gradient(to_right,transparent,black_13%)]" />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="kepala-sekolah-title" className="relative overflow-hidden bg-white pb-0 pt-24 font-['Plus_Jakarta_Sans'] sm:pt-32 lg:pt-[120px]">
        <img src={watermark} alt="" aria-hidden="true" className="pointer-events-none absolute -right-12 top-0 w-48 opacity-35 sm:w-64" />
        <img src={watermark} alt="" aria-hidden="true" className="pointer-events-none absolute -left-20 bottom-0 w-48 opacity-35 sm:w-64" />
        <div className="relative mx-auto max-w-[1603px] px-4 sm:px-8 lg:px-[42px]">
          <div className="mx-auto grid min-h-[573px] overflow-hidden rounded-[20px] border-2 border-[#cd091d] bg-white shadow-[0_0_24px_rgba(130,130,130,0.25)] md:grid-cols-[39%_61%]">
            <div className="relative min-h-[350px] overflow-hidden bg-white md:min-h-[573px]">
              <img src={headmasterAccent} alt="" aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 h-full w-auto max-w-none" />
              <img src={kepalaSekolah.image} alt={'Foto ' + kepalaSekolah.name} loading="lazy" className="absolute inset-0 h-full w-full object-contain object-bottom" />
            </div>
            <div className="flex flex-col justify-center px-6 py-9 sm:px-10 lg:px-8 xl:px-10">
              <h2 id="kepala-sekolah-title" className="text-[clamp(1.5rem,2.17vw,2.5rem)] font-bold leading-tight text-black">Kepala SMK Telkom Purwokerto</h2>
              <p className="font-bold text-[#cd0b20] sm:text-xl lg:text-[clamp(1.25rem,1.73vw,2rem)]">SMK Telkom Purwokerto</p>
              <h3 className="mt-6 text-[clamp(1.5rem,2.17vw,2.5rem)] font-bold leading-tight text-black">{kepalaSekolah.name}</h3>
              <p className="mt-1 max-w-[716px] text-base font-medium leading-snug text-black/70 lg:text-[clamp(1rem,1.3vw,1.5rem)]">{kepalaSekolah.quoteFull}</p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-lg font-bold text-[#cd0b20] lg:text-2xl">Jabatan/Posisi</p>
                  <p className="mt-1 flex items-start gap-1 text-sm text-black/70"><Quote aria-hidden="true" className="mt-0.5 h-3 w-3 shrink-0 fill-[#cd091d] text-[#cd091d]" /> Kepala Sekolah</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-[#cd0b20] lg:text-2xl">Motto</p>
                  <p className="mt-1 flex items-start gap-1 text-sm text-black/70"><Quote aria-hidden="true" className="mt-0.5 h-3 w-3 shrink-0 fill-[#cd091d] text-[#cd091d]" /> Memimpin dengan Inovasi, Mencetak Talenta Digital Masa Depan</p>
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
