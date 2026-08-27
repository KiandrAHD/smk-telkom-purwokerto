import { ArrowRight, BellRing, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';
import { infoPenting, ppdbBanner } from '../../data/dummyData';

const PengumumanPpdbSection = () => (
  <section className="bg-white py-6 lg:py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Kolom kiri 63% mengikuti lebar panel merah di Figma (1069 dari 1694). */}
      <div className="overflow-hidden rounded-2xl border-[3px] border-primary lg:grid lg:grid-cols-[63%_1fr]">
        {/* Panel PPDB */}
        <div className="flex items-center gap-6 bg-primary px-5 py-8 sm:px-8 lg:gap-11 lg:pb-10 lg:pl-[4.9%] lg:pt-[133px]">
          {/* Lingkaran polos, sama seperti di desain */}
          <span
            aria-hidden="true"
            className="hidden aspect-square w-[184px] flex-shrink-0 rounded-full bg-white/[0.68] sm:block"
          />

          <div className="min-w-0">
            <h2 className="font-heading text-3xl font-extrabold leading-[1.15] text-white lg:text-[2.5rem]">
              {ppdbBanner.title}
              <br />
              {ppdbBanner.titleAccent}
            </h2>

            <div className="mt-6 flex flex-wrap gap-3">
              {ppdbBanner.chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-lg border border-white px-4 py-2 text-sm font-semibold text-white"
                >
                  {chip}
                </span>
              ))}
            </div>

            <p className="mt-5 max-w-md text-[11px] leading-relaxed text-white">
              {ppdbBanner.description}
            </p>

            <Link
              to={ppdbBanner.href}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-extrabold text-primary transition-colors hover:bg-primary-50"
            >
              {ppdbBanner.ctaText}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Informasi Penting Hari ini */}
        <div className="bg-white px-5 py-8 sm:px-8 lg:pb-10 lg:pl-[5%] lg:pt-[103px]">
          <div className="flex items-center gap-3">
            <BellRing className="h-9 w-9 flex-shrink-0 text-primary" />
            <h2 className="font-heading text-xl font-extrabold leading-tight text-primary lg:text-[1.6rem]">
              {infoPenting.title}
            </h2>
          </div>

          <Link
            to="/pengumuman/informasi-penting"
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            {infoPenting.linkText}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <ul className="mt-7 space-y-[15px]">
            {infoPenting.items.map((item) => (
              <li key={item} className="flex items-center gap-4">
                <span className="flex h-[27px] w-[28px] flex-shrink-0 items-center justify-center rounded-lg bg-primary">
                  <ClipboardList className="h-3.5 w-3.5 text-white" />
                </span>
                <span className="font-heading text-[17px] font-semibold leading-snug text-dark-900">
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
