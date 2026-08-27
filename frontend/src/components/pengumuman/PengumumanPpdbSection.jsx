import { ArrowRight, BellRing, CalendarDays, ClipboardList, Volume2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { infoPenting, ppdbBanner } from '../../data/dummyData';

const PengumumanPpdbSection = () => (
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
              {ppdbBanner.title}
              <br />
              {ppdbBanner.titleAccent}
            </h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {ppdbBanner.chips.map((chip) => (
                <span
                  key={chip.label}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white px-3 py-1.5 text-[11px] font-semibold text-white"
                >
                  {chip.icon && <CalendarDays className="h-3 w-3 flex-shrink-0" />}
                  {chip.label}
                </span>
              ))}
            </div>

            <p className="mt-4 max-w-sm text-[10px] leading-relaxed text-white">
              {ppdbBanner.description}
            </p>

            <Link
              to={ppdbBanner.href}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-extrabold text-primary transition-colors hover:bg-primary-50"
            >
              {ppdbBanner.ctaText}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Informasi Penting Hari ini */}
        <div className="bg-white px-5 py-7 sm:px-8 lg:pb-7 lg:pl-[5%] lg:pt-[64px]">
          <div className="flex items-center gap-2.5">
            <BellRing className="h-6 w-6 flex-shrink-0 text-primary" />
            <h2 className="font-heading text-base font-extrabold leading-tight text-primary lg:text-xl">
              {infoPenting.title}
            </h2>
          </div>

          <Link
            to="/pengumuman/informasi-penting"
            className="mt-3 inline-flex items-center gap-2 rounded-lg border border-primary px-3 py-1.5 text-[11px] font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            {infoPenting.linkText}
            <ArrowRight className="h-3 w-3" />
          </Link>

          <ul className="mt-5 space-y-2.5">
            {infoPenting.items.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-primary">
                  <ClipboardList className="h-3 w-3 text-white" />
                </span>
                <span className="font-heading text-[11px] font-semibold leading-snug text-dark-900">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export default PengumumanPpdbSection;
