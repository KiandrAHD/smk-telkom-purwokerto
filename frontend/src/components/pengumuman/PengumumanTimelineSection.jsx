import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { formatPublicDate, sortPengumumanTimeline } from '../../utils/publicContent';

const PengumumanTimelineSection = ({ items = [] }) => {
  const { t, locale } = useLanguage();
  if (!items.length) return null;

  return (
    <section className="bg-white py-8 lg:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <p className="mb-6 text-sm text-dark-500">{t('Dari pengumuman terlama hingga terbaru.')}</p>
        {/* Daftar panjang memakai scroll halaman native; setiap entri menuju detailnya. */}
        <ol className="ml-2 space-y-6 border-l-2 border-primary/20 pl-6 sm:pl-8">
          {sortPengumumanTimeline(items).map((item) => (
            <li key={item.id || item.slug} className="relative">
              <span aria-hidden="true" className="absolute -left-[33px] top-5 h-4 w-4 rounded-full border-4 border-white bg-primary sm:-left-[41px]" />
              <article className="rounded-2xl border border-dark-100 bg-white p-5 shadow-card sm:p-6">
                <time dateTime={Number.isFinite(Date.parse(item.iso)) ? item.iso : undefined} className="text-xs font-semibold text-primary">
                  {formatPublicDate(item.iso, {}, locale)}
                </time>
                <h2 className="mt-2 font-heading text-base font-bold leading-relaxed text-dark-900">
                  <Link to={`/pengumuman/${item.slug}`} className="hover:text-primary focus-visible:outline-2 focus-visible:outline-primary">{item.title}</Link>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-dark-600">{item.lead || item.desc}</p>
                <Link to={`/pengumuman/${item.slug}`} className="mt-4 inline-flex min-h-11 items-center gap-2 text-xs font-bold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary">
                  {t('Lihat Detail')}<ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default PengumumanTimelineSection;
