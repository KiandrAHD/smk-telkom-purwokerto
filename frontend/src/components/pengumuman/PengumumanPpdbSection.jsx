import { useLanguage } from '../../context/LanguageContext';
import { ArrowRight, BellRing, CalendarDays, ClipboardList, Volume2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { infoPenting, ppdbBanner } from '../../data/dummyData';

// Lihat catatan tampilkanLihatSemua di PengumumanPopulerCard.
const PengumumanPpdbSection = ({ tampilkanLihatSemua = true }) => {
  const { t } = useLanguage();
  return (
  <section className="bg-white py-4 lg:py-6">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Kolom kiri 63% mengikuti lebar panel merah di Figma (1069 dari 1694). */}
      <div className="overflow-hidden rounded-2xl border-2 border-primary lg:grid lg:grid-cols-[63%_1fr]">
        {/* Panel PPDB */}
        <div className="flex items-center gap-5 bg-primary px-5 py-7 sm:px-8 lg:gap-7 lg:pb-7 lg:pl-[4.9%] lg:pt-[82px]">
          <span
            aria-hidden="true"
            className="hidden aspect-square w-[115px] flex-shrink-0 items-center justify-center rounded-full bg-white/[0.68] sm:flex"
          >
            <Volume2 className="h-14 w-14 text-white" strokeWidth={2.2} />
          </span>

          <div className="min-w-0">
            <h2 className="font-heading text-xl sm:text-2xl font-extrabold leading-[1.15] text-white lg:text-[1.75rem]">
              {t(ppdbBanner.title)}
              <br />
              {t(ppdbBanner.titleAccent)}
            </h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {ppdbBanner.chips.map((chip) => (
                <span
                  key={chip.label}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white px-3 py-1.5 text-[11px] font-semibold text-white"
                >
                  {chip.icon && <CalendarDays className="h-3 w-3 flex-shrink-0" />}
                  {t(chip.label)}
                </span>
              ))}
            </div>

            <p className="mt-4 max-w-sm text-[10px] leading-relaxed text-white">
              {t(ppdbBanner.description)}
            </p>

            <Link
              to={ppdbBanner.href}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-extrabold text-primary transition-colors hover:bg-primary-50"
            >
              {t(ppdbBanner.ctaText)}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Informasi Penting Hari ini */}
        <div className="bg-white px-5 py-7 sm:px-8 lg:pb-7 lg:pl-[5%] lg:pt-[64px]">
          <div className="flex items-center gap-2.5">
            <BellRing className="h-6 w-6 flex-shrink-0 text-primary" />
            <h2 className="font-heading text-base font-extrabold leading-tight text-primary lg:text-xl">
              {t(infoPenting.title)}
            </h2>
          </div>

          {tampilkanLihatSemua && (
            <Link
              to="/pengumuman/informasi-penting"
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-primary px-3 py-1.5 text-[11px] font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
            >
              {t(infoPenting.linkText)}
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}

          <ul className="mt-5 space-y-2.5">
            {infoPenting.items.map((item) => (
              <li key={item.href} className="flex items-start gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-primary">
                  <ClipboardList className="h-3 w-3 text-white" />
                </span>
                <div className="min-w-0">
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="font-heading text-[11px] font-semibold leading-snug text-dark-900 hover:text-primary hover:underline">
                    {t(item.title)}
                  </a>
                  <p className="mt-1 text-[10px] text-dark-500">{t(item.date)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
  );
};

export default PengumumanPpdbSection;
