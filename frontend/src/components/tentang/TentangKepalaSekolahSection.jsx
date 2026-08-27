import { useState } from 'react';
import { ArrowRight, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { slugify } from '../../utils/slug';
import watermark from '../../assets/landing/watermark-logo.png';
import { guruData, kepalaSekolah } from '../../data/dummyData';

const PER_PAGE = 4;

const TentangKepalaSekolahSection = () => {
  const [expanded, setExpanded] = useState(false);
  const [page, setPage] = useState(0);

  const pages = Math.ceil(guruData.length / PER_PAGE);
  const shown = guruData.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <section className="relative overflow-hidden bg-white py-8 lg:py-12">
      <img
        src={watermark}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 top-16 hidden w-28 select-none opacity-40 lg:block"
      />
      <img
        src={watermark}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 bottom-10 hidden w-32 select-none opacity-40 lg:block"
      />

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-[38%_1fr] lg:px-8">
        {/* Kepala Sekolah */}
        <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-card">
          <h2 className="font-heading text-base font-extrabold text-primary">Kepala Sekolah</h2>
          <div className="mt-4 flex gap-4">
            <img
              src={kepalaSekolah.image}
              alt={kepalaSekolah.name}
              className="h-32 w-24 flex-shrink-0 rounded-xl bg-dark-50 object-cover object-top"
            />
            <div className="min-w-0">
              <Quote className="h-4 w-4 text-primary" fill="currentColor" />
              <p className="mt-1.5 text-[10px] leading-relaxed text-dark-600">
                {expanded ? kepalaSekolah.quoteFull : kepalaSekolah.quote}
              </p>
              <p className="mt-2 text-[10px] font-bold text-primary">{kepalaSekolah.name}</p>
              <p className="text-[9px] text-dark-500">{kepalaSekolah.title}</p>

              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-dark-200 px-3 py-1.5 text-[10px] font-semibold text-dark-700 transition-colors hover:border-primary hover:text-primary"
              >
                {expanded ? 'Tutup Sambutan' : kepalaSekolah.ctaText}
                <ArrowRight
                  className={`h-3 w-3 transition-transform ${expanded ? 'rotate-90' : ''}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Guru & Tenaga Pendidik */}
        <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-card">
          <h2 className="font-heading text-base font-extrabold text-primary">
            Guru &amp; Tenaga Pendidik
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {shown.map((guru, i) => (
              <Link
                key={`${page}-${guru.category}`}
                to={`/tentang/guru/${slugify(guru.category)}`}
                className="block overflow-hidden rounded-xl transition-transform hover:-translate-y-0.5"
              >
                <article>
                  <div className="flex h-28 items-end justify-center overflow-hidden rounded-xl bg-primary">
                    <img
                      src={guru.image}
                      alt={`${guru.title} ${guru.subtitle}`}
                      className="h-full w-auto object-contain object-bottom"
                      loading={i < 4 ? 'eager' : 'lazy'}
                    />
                  </div>
                  <h3 className="mt-2 font-heading text-[11px] font-bold leading-snug text-primary">
                    {guru.title}
                    <br />
                    {guru.subtitle}
                  </h3>
                  <p className="mt-0.5 text-[9px] text-dark-500">{guru.category}</p>
                </article>
              </Link>
            ))}
          </div>

          {/* Indikator carousel — berfungsi */}
          <div className="mt-5 flex items-center justify-center gap-2">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i)}
                aria-label={`Halaman guru ${i + 1}`}
                aria-current={i === page}
                className={`relative h-2 rounded-full transition-all before:absolute before:-inset-2 before:content-[''] ${
                  i === page ? 'w-5 bg-primary' : 'w-2 bg-dark-200 hover:bg-dark-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TentangKepalaSekolahSection;
