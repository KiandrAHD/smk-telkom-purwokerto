import { useLanguage } from '../context/LanguageContext';
import { useEffect, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import CTASection from '../components/CTASection';
import Reveal from '../components/Reveal';
import RibbonDivider from '../components/RibbonDivider';
import StelaAISection from '../components/StelaAISection';
import { guruData, kepalaSekolah, visiMisi } from '../data/dummyData';
import MainLayout from '../layouts/MainLayout';
import HeroBreadcrumb from '../components/HeroBreadcrumb';
import { slugify } from '../utils/slug';
import heroPhoto from '../assets/tentang/guru-page-hero.webp';
import SectionAccents from '../components/SectionAccents';
import headmasterAccent from '../assets/tentang/figma-guru-headmaster.svg';

const getPageSize = () => {
  if (typeof window === 'undefined') return 4;
  if (window.matchMedia('(min-width: 1024px)').matches) return 4;
  return window.matchMedia('(min-width: 640px)').matches ? 2 : 1;
};

function GuruCarousel() {
  const { t } = useLanguage();
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
    <section aria-labelledby="guru-list-title" className="relative overflow-hidden bg-white py-8 lg:py-12">
      <SectionAccents variant="teachers" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-8 text-center">
          <h2 id="guru-list-title" className="font-heading text-2xl font-extrabold leading-tight text-dark-900 sm:text-3xl">{t("Guru & Tenaga Pendidik")} </h2>
          <p className="mt-1 text-sm font-semibold text-primary sm:text-base">{t("SMK Telkom Purwokerto")}</p>
        </Reveal>

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
                  className="grid min-w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-14"
                  aria-hidden={pageIndex !== page}
                  inert={pageIndex !== page}
                >
                  {guruData.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize).map((guru, cardIndex) => (
                    <Reveal key={guru.nama} className={['', 'delay-100', 'delay-200', 'delay-300'][cardIndex]}>
                      <Link
                        to={'/profil-sekolah/guru/' + slugify(guru.nama)}
                        aria-label={t('Lihat profil {name}', { name: guru.nama })}
                        className="group relative block aspect-[322/426] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                      >
                        <article className="relative h-full bg-white p-[10px] transition-transform duration-300 group-hover:-translate-y-1">
                          <img src={guru.image} alt={t('Foto {name}', { name: guru.nama })} loading="lazy" className="h-full w-full rounded-[10px] object-cover object-top" />
                          <div aria-hidden="true" className="guru-accent-horizontal-top pointer-events-none absolute inset-x-0 top-0 h-5 bg-repeat-x" />
                          <div aria-hidden="true" className="guru-accent-horizontal pointer-events-none absolute inset-x-0 bottom-0 h-5 bg-repeat-x" />
                          <div aria-hidden="true" className="guru-accent-vertical pointer-events-none absolute inset-y-0 left-0 w-[21px] bg-repeat-y" />
                          <div aria-hidden="true" className="guru-accent-vertical pointer-events-none absolute inset-y-0 right-0 w-[21px] bg-repeat-y" />
                          <div className="absolute bottom-[12%] left-[6%] right-[6%] min-h-[70px] rounded-xl bg-white px-3 py-2 shadow-card sm:min-h-[78px]">
                            <h3 className="font-heading text-sm font-bold leading-snug text-dark-900 sm:text-base">{t(guru.nama)}</h3>
                            <p className="mt-1 text-[11px] leading-snug text-dark-500 sm:text-xs">{t(guru.jabatan)}</p>
                          </div>
                        </article>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <span className="sr-only" aria-live="polite">{t('Halaman {page} dari {total}', { page: page + 1, total: pageCount })}</span>

          {pageCount > 1 && (
            <nav aria-label={t("Navigasi profil guru")} className="mt-6 flex items-center justify-center gap-3 sm:mt-8">
              <button type="button" onClick={() => setPage((current) => Math.max(0, current - 1))} disabled={page === 0} aria-label={t("Guru sebelumnya")} className="grid h-10 w-10 place-items-center rounded-full bg-primary text-white transition-colors hover:bg-primary-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40">
                <ChevronLeft size={22} />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: pageCount }, (_, index) => (
                  <button key={index} type="button" onClick={() => setPage(index)} aria-label={t('Lihat halaman guru {number}', { number: index + 1 })} aria-current={page === index ? 'page' : undefined} className="grid h-8 w-8 place-items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                    <span aria-hidden="true" className={page === index ? 'h-3 w-3 rounded-full bg-primary' : 'h-3 w-3 rounded-full bg-dark-200'} />
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))} disabled={page === pageCount - 1} aria-label={t("Guru berikutnya")} className="grid h-10 w-10 place-items-center rounded-full bg-primary text-white transition-colors hover:bg-primary-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40">
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
  const { t } = useLanguage();
  return (
    <MainLayout>
      <section className="bg-white pb-6 pt-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative grid overflow-hidden rounded-[2rem] border border-primary/30 bg-white p-3 sm:p-4 lg:grid-cols-[38%_1fr] lg:gap-4">
            <div className="relative z-10 px-3 pb-6 pt-6 lg:pl-4">
              <HeroBreadcrumb current="Profil Guru" />
              <h1 className="font-heading text-3xl font-extrabold leading-[1.2] tracking-tight text-dark-900 sm:text-4xl lg:text-[1.75rem] xl:text-[2rem]">{t("Profil Guru")}<br /><span className="text-primary">{t("SMK Telkom")}<br />{t("Purwokerto")}</span>
              </h1>
              <p className="mt-4 max-w-md text-xs leading-relaxed text-dark-500 sm:text-sm">{t("Tim pengajar kami memadukan kurikulum berbasis teknologi terbaru dengan metode pembelajaran interaktif. Kami siap membimbing siswa menguasai logika, pemrograman, hingga mampu menciptakan solusi digital masa depan.")} </p>
              <Link to="/profil-sekolah" className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">{t("Lihat Profil Sekolah")} <ArrowRight size={17} />
              </Link>
            </div>
            <div className="relative min-h-[220px] self-stretch overflow-hidden rounded-[1.75rem] sm:min-h-[300px] lg:min-h-[390px]">
              <img src={heroPhoto} alt={t("Guru dan tenaga pendidik SMK Telkom Purwokerto")} width="2200" height="1033" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-center lg:[mask-image:linear-gradient(to_right,transparent,black_13%)]" />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="kepala-sekolah-title" className="relative overflow-hidden bg-white py-8 lg:py-12">
        <SectionAccents variant="headmaster" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto grid overflow-hidden rounded-[20px] border-2 border-[#cd091d] bg-white shadow-[0_0_24px_rgba(130,130,130,0.25)] md:grid-cols-[38%_62%]">
            <div className="relative min-h-[280px] overflow-hidden bg-white md:min-h-[420px]">
              <img src={headmasterAccent} alt="" aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 h-full w-auto max-w-none" />
              <img src={kepalaSekolah.image} alt={t('Foto {name}', { name: kepalaSekolah.name })} loading="lazy" className="absolute inset-0 h-full w-full object-contain object-bottom" />
            </div>
            <div className="flex flex-col justify-center px-6 py-8 sm:px-8 lg:px-10">
              <h2 id="kepala-sekolah-title" className="font-heading text-xl font-extrabold leading-tight text-dark-900 sm:text-2xl">{t("Kepala Sekolah")}</h2>
              <p className="mt-1 text-sm font-semibold text-primary sm:text-base">{t("SMK Telkom Purwokerto")}</p>
              <h3 className="mt-5 font-heading text-lg font-bold leading-tight text-dark-900 sm:text-xl">{t(kepalaSekolah.name)}</h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-dark-600">{t(kepalaSekolah.quoteFull)}</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="font-heading text-sm font-bold text-primary">{t("Jabatan/Posisi")}</p>
                  <p className="mt-1 flex items-start gap-1 text-xs leading-relaxed text-dark-600"><Quote aria-hidden="true" className="mt-0.5 h-3 w-3 shrink-0 fill-primary text-primary" /> {t("Kepala Sekolah")}</p>
                </div>
                <div>
                  <p className="font-heading text-sm font-bold text-primary">{t("Visi Sekolah")}</p>
                  <p className="mt-1 text-xs leading-relaxed text-dark-600">{t(visiMisi.visi)}</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <GuruCarousel />
      <Reveal><RibbonDivider /></Reveal>
      <Reveal><StelaAISection /></Reveal>
      <Reveal><CTASection /></Reveal>
    </MainLayout>
  );
}

export default GuruPage;
