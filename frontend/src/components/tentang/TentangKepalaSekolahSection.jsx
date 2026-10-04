import { useLanguage } from '../../context/LanguageContext';
import { useState, useSyncExternalStore } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { slugify } from '../../utils/slug';
import SectionAccents from '../SectionAccents';
import TeacherPhoto from '../TeacherPhoto';
import { guruData, kepalaSekolah } from '../../data/dummyData';

const subscribeViewport = (notify) => {
  window.addEventListener('resize', notify);
  return () => window.removeEventListener('resize', notify);
};
const getPageSize = () => window.innerWidth >= 1280 ? 4 : window.innerWidth >= 400 ? 2 : 1;

const TentangKepalaSekolahSection = () => {
  const { t } = useLanguage();
  const [page, setPage] = useState(0);
  const perPage = useSyncExternalStore(subscribeViewport, getPageSize, () => 4);

  const pages = Math.ceil(guruData.length / perPage);
  // Ketika viewport membesar, halaman terakhir tetap dibatasi ke rentang yang ada.
  const currentPage = Math.min(page, pages - 1);
  const shown = guruData.slice(currentPage * perPage, currentPage * perPage + perPage);

  return (
    <section id="guru" className="relative overflow-x-clip bg-white py-8 lg:py-12 min-[1660px]:py-14">
      <SectionAccents variant="schoolTeachers" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-stretch gap-6 px-4 sm:px-6 lg:grid-cols-[minmax(0,38%)_minmax(0,1fr)] lg:px-8 min-[1660px]:max-w-[1621px] min-[1660px]:grid-cols-[610px_964px] min-[1660px]:gap-[47px] min-[1660px]:px-0">
        {/* Kepala Sekolah */}
        <div className="flex min-w-0 flex-col rounded-2xl border border-dark-100 bg-white p-5 shadow-card min-[1660px]:min-h-[438px] min-[1660px]:rounded-[20px] min-[1660px]:border-0 min-[1660px]:bg-[#fffdfd] min-[1660px]:px-0">
          <h2 className="font-heading text-base font-extrabold text-primary min-[1660px]:ml-[42px] min-[1660px]:text-[32px] min-[1660px]:leading-[40px]">{t("Kepala Sekolah")} </h2>
          <div className="mt-4 flex-1 grid grid-cols-1 items-start gap-4 min-[400px]:grid-cols-[minmax(0,110px)_minmax(0,1fr)] lg:grid-cols-[minmax(0,120px)_minmax(0,1fr)] lg:items-center min-[1660px]:mt-[18px] min-[1660px]:grid-cols-[minmax(0,130px)_minmax(0,1fr)] min-[1660px]:gap-[13px] min-[1660px]:px-[34px]">
            <figure className="min-w-0 w-full max-w-24 min-[400px]:max-w-none">
              <img
                src={kepalaSekolah.image}
                alt={t(kepalaSekolah.name)}
                className="aspect-[3/4] w-full rounded-xl bg-dark-50 object-contain p-1 min-[1660px]:p-0"
              />
              <figcaption className="mt-2 [overflow-wrap:anywhere]">
                <p className="text-[10px] font-bold text-primary min-[1660px]:text-xs">{t(kepalaSekolah.name)}</p>
                <p className="text-[9px] text-dark-500 min-[1660px]:text-[11px]">{t(kepalaSekolah.title)}</p>
              </figcaption>
            </figure>
            <div className="min-w-0">
              <Quote className="h-4 w-4 text-primary min-[1660px]:h-6 min-[1660px]:w-6" fill="currentColor" />
              <p className="mt-1.5 text-[10px] leading-relaxed text-dark-600 min-[1660px]:text-[18px] min-[1660px]:leading-[1.55]">
                {t(kepalaSekolah.quoteFull)}
              </p>
            </div>
          </div>
        </div>

        {/* Guru & Tenaga Pendidik */}
        <div className="relative min-w-0 rounded-2xl border border-dark-100 bg-white p-5 shadow-card min-[1660px]:rounded-[20px] min-[1660px]:border-0 min-[1660px]:bg-[#fffdfd] min-[1660px]:pb-5">
          <h2 className="min-w-0 font-heading text-base font-extrabold text-primary min-[1660px]:text-[32px] min-[1660px]:leading-[40px]">{t("Guru & Tenaga Pendidik")} </h2>
          <p className="mt-2 text-[11px] leading-relaxed text-dark-500">{t("Mata pelajaran mengikuti informasi terbaru; jabatan organisasi mengacu pada SK Pengawakan 2026/2027.")} </p>

          {/* Key memulai ulang animasi masuk ketika halaman guru berubah. */}
          <div key={`${currentPage}-${perPage}`} className="mt-4 grid animate-masuk-halaman grid-cols-1 gap-4 motion-reduce:animate-none min-[400px]:grid-cols-2 xl:grid-cols-4 min-[1660px]:gap-5">
            {shown.map((guru, i) => (
              <Link
                key={guru.nama}
                to={`/profil-sekolah/guru/${slugify(guru.nama)}?from=profil-sekolah`}
                className="block min-w-0 rounded-xl transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transform-none"
              >
                <article className="h-full min-w-0">
                  <TeacherPhoto teacher={guru} alt={guru.nama} loading={i < 4 ? 'eager' : 'lazy'} />
                  <div className="px-1 pb-2 pt-2 [overflow-wrap:anywhere]">
                    <h3 className="font-heading text-xs font-bold leading-relaxed text-primary">
                      {t(guru.nama)}
                    </h3>
                    {guru.jabatan && <p className="mt-1 font-heading text-[11px] font-bold leading-relaxed text-dark-900">
                      {t(guru.jabatan)}
                    </p>}
                    {guru.bidang && <p className="mt-1 text-[11px] leading-relaxed text-dark-500">{t(guru.bidang)}</p>}
                  </div>
                </article>
              </Link>
            ))}
          </div>
          <span className="sr-only" aria-live="polite">{t('Halaman {page} dari {total}', { page: currentPage + 1, total: pages })}</span>

          {/* Indikator carousel — hanya muncul kalau gurunya lebih dari satu halaman */}
          {pages > 1 && (
          <div className="mt-5 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              aria-label={t('Guru sebelumnya')}
              className="mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-dark-200 bg-white text-primary transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            ><ChevronLeft className="h-5 w-5" aria-hidden="true" /></button>
            <div className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-2 sm:flex-none">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i)}
                aria-label={t('Halaman guru {number}', { number: i + 1 })}
                aria-current={i === currentPage}
                className={`relative h-2 rounded-full transition-all before:absolute before:-inset-2 before:content-[''] ${
                  i === currentPage ? 'w-5 bg-primary' : 'w-2 bg-dark-200 hover:bg-dark-300'
                }`}
              />
            ))}
            </div>
            <button
              type="button"
              onClick={() => setPage(Math.min(pages - 1, currentPage + 1))}
              disabled={currentPage === pages - 1}
              aria-label={t('Guru berikutnya')}
              className="ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-dark-200 bg-white text-primary transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            ><ChevronRight className="h-5 w-5" aria-hidden="true" /></button>
          </div>
          )}
          <div className="mt-4 flex min-w-0 justify-center">
            <Link
              to="/profil-sekolah/guru"
              className="inline-flex max-w-full items-center gap-2 rounded-full border border-dark-200 bg-white px-4 py-2.5 text-xs font-semibold text-dark-700 transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              {t("Lihat semua profil guru")}
              <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TentangKepalaSekolahSection;
