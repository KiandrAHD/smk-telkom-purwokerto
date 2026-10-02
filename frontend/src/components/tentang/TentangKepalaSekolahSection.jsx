import { useLanguage } from '../../context/LanguageContext';
import { useState, useSyncExternalStore } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { slugify } from '../../utils/slug';
import SectionAccents from '../SectionAccents';
import { guruData, kepalaSekolah } from '../../data/dummyData';
import photoAccent from '../../assets/tentang/figma-guru-photo-accent.png';

const subscribeViewport = (notify) => {
  window.addEventListener('resize', notify);
  return () => window.removeEventListener('resize', notify);
};
const getPageSize = () => window.innerWidth >= 1280 ? 4 : window.innerWidth >= 400 ? 2 : 1;

const TentangKepalaSekolahSection = () => {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const [page, setPage] = useState(0);
  const perPage = useSyncExternalStore(subscribeViewport, getPageSize, () => 4);

  const pages = Math.ceil(guruData.length / perPage);
  // Ketika viewport membesar, halaman terakhir tetap dibatasi ke rentang yang ada.
  const currentPage = Math.min(page, pages - 1);
  const shown = guruData.slice(currentPage * perPage, currentPage * perPage + perPage);

  return (
    <section id="guru" className="relative overflow-x-clip bg-white py-8 lg:py-12 min-[1660px]:py-14">
      <SectionAccents variant="schoolTeachers" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-[minmax(0,38%)_minmax(0,1fr)] lg:px-8 min-[1660px]:max-w-[1621px] min-[1660px]:grid-cols-[610px_964px] min-[1660px]:gap-[47px] min-[1660px]:px-0">
        {/* Kepala Sekolah */}
        <div className="self-start rounded-2xl border border-dark-100 bg-white p-5 shadow-card min-[1660px]:min-h-[438px] min-[1660px]:rounded-[20px] min-[1660px]:border-0 min-[1660px]:bg-[#fffdfd] min-[1660px]:p-0">
          <h2 className="font-heading text-base font-extrabold text-primary min-[1660px]:ml-[42px] min-[1660px]:mt-[14px] min-[1660px]:text-[32px] min-[1660px]:leading-[40px]">{t("Kepala Sekolah")} </h2>
          <div className="mt-4 flex flex-col gap-4 min-[400px]:flex-row min-[1660px]:mt-[18px] min-[1660px]:gap-[13px] min-[1660px]:px-[34px]">
            <img
              src={kepalaSekolah.image}
              alt={t(kepalaSekolah.name)}
              className="h-32 w-24 flex-shrink-0 rounded-xl bg-dark-50 object-contain p-1 min-[1660px]:h-[321px] min-[1660px]:w-[257px] min-[1660px]:p-0"
            />
            <div className="min-w-0">
              {!expanded && <Quote className="h-4 w-4 text-primary min-[1660px]:h-6 min-[1660px]:w-6" fill="currentColor" />}
              <p className="mt-1.5 text-[10px] leading-relaxed text-dark-600 min-[1660px]:text-[18px] min-[1660px]:leading-[1.45]">
                {t(expanded ? kepalaSekolah.quoteFull : kepalaSekolah.quote)}
              </p>
              <p className="mt-2 text-[10px] font-bold text-primary min-[1660px]:text-xs">{t(kepalaSekolah.name)}</p>
              <p className="text-[9px] text-dark-500 min-[1660px]:text-[11px]">{t(kepalaSekolah.title)}</p>

              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-dark-200 px-3 py-1.5 text-[10px] font-semibold text-dark-700 transition-colors hover:border-primary hover:text-primary"
              >
                {t(expanded ? 'Tutup Ringkasan' : kepalaSekolah.ctaText)}
                <ArrowRight
                  className={`h-3 w-3 transition-transform ${expanded ? 'rotate-90' : ''}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Guru & Tenaga Pendidik */}
        <div className="relative min-w-0 rounded-2xl border border-dark-100 bg-white p-5 shadow-card min-[1660px]:h-[438px] min-[1660px]:rounded-[20px] min-[1660px]:border-0 min-[1660px]:bg-[#fffdfd] min-[1660px]:p-0">
          <h2 className="font-heading text-base font-extrabold text-primary min-[1660px]:ml-[51px] min-[1660px]:mt-[14px] min-[1660px]:text-[32px] min-[1660px]:leading-[40px]">{t("Guru & Tenaga Pendidik")} </h2>
          <p className="mt-2 text-[11px] leading-relaxed text-dark-500 min-[1660px]:sr-only">{t("Jabatan organisasi mengikuti SK Pengawakan 2026/2027; mata pelajaran tidak tercantum dalam SK.")} </p>

          {/* Key memulai ulang animasi masuk ketika halaman guru berubah. */}
          <div key={`${currentPage}-${perPage}`} className="mt-4 grid animate-masuk-halaman grid-cols-1 gap-4 motion-reduce:animate-none min-[400px]:grid-cols-2 xl:grid-cols-4 min-[1660px]:ml-[45px] min-[1660px]:mt-[38px] min-[1660px]:grid-cols-[repeat(4,206px)] min-[1660px]:gap-5">
            {shown.map((guru, i) => (
              <Link
                key={guru.nama}
                to={`/profil-sekolah/guru/${slugify(guru.nama)}`}
                className="block min-w-0 rounded-xl transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transform-none min-[1660px]:w-[206px]"
              >
                <article className="h-full min-w-0">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-dark-50 min-[1660px]:h-[172px] min-[1660px]:w-[206px] min-[1660px]:aspect-auto">
                    <img
                      src={guru.image}
                      alt={t(guru.nama)}
                      className="absolute inset-0 h-full w-full object-cover object-top"
                      loading={i < 4 ? 'eager' : 'lazy'}
                    />
                    <img src={photoAccent} alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full select-none mix-blend-multiply" />
                  </div>
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
          <div className="mt-5 flex items-center justify-center gap-2 min-[1660px]:absolute min-[1660px]:bottom-5 min-[1660px]:left-1/2 min-[1660px]:mt-0 min-[1660px]:-translate-x-1/2">
            <button
              type="button"
              onClick={() => setPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              aria-label={t('Guru sebelumnya')}
              className="mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-dark-200 bg-white text-primary transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            ><ChevronLeft className="h-5 w-5" aria-hidden="true" /></button>
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
            <button
              type="button"
              onClick={() => setPage(Math.min(pages - 1, currentPage + 1))}
              disabled={currentPage === pages - 1}
              aria-label={t('Guru berikutnya')}
              className="ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-dark-200 bg-white text-primary transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            ><ChevronRight className="h-5 w-5" aria-hidden="true" /></button>
          </div>
          )}
        </div>
      </div>
      <div className="relative mt-6 flex justify-center px-4">
        <Link
          to="/profil-sekolah/guru"
          className="inline-flex items-center gap-2 rounded-full border border-dark-200 bg-white px-6 py-2.5 text-xs font-semibold text-dark-700 transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >{t("Lihat semua profil guru")} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
};

export default TentangKepalaSekolahSection;
