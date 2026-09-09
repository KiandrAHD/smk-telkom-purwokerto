import { useState } from 'react';
import { ArrowRight, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { slugify } from '../../utils/slug';
import watermark from '../../assets/landing/telkom-accent.png';
import { guruData, kepalaSekolah } from '../../data/dummyData';

const PER_PAGE = 4;

const TentangKepalaSekolahSection = () => {
  const [expanded, setExpanded] = useState(false);
  const [page, setPage] = useState(0);

  const pages = Math.ceil(guruData.length / PER_PAGE);
  const shown = guruData.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <section id="guru" className="relative overflow-hidden bg-white py-8 lg:py-12">
      <img
        src={watermark}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-8 hidden w-32 rotate-180 select-none object-contain 2xl:block"
      />
      <img
        src={watermark}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-8 right-0 hidden w-32 select-none object-contain 2xl:block"
      />

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-[minmax(0,38%)_minmax(0,1fr)] lg:px-8">
        {/* Kepala Sekolah */}
        <div className="self-start rounded-2xl border border-dark-100 bg-white p-5 shadow-card">
          <h2 className="font-heading text-base font-extrabold text-primary">Kepala Sekolah</h2>
          <div className="mt-4 flex flex-col gap-4 min-[400px]:flex-row">
            <img
              src={kepalaSekolah.image}
              alt={kepalaSekolah.name}
              className="h-32 w-24 flex-shrink-0 rounded-xl bg-dark-50 object-contain p-1"
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
        <div className="min-w-0 rounded-2xl border border-dark-100 bg-white p-5 shadow-card">
          <h2 className="font-heading text-base font-extrabold text-primary">
            Guru &amp; Tenaga Pendidik
          </h2>
          <p className="mt-2 text-[11px] leading-relaxed text-dark-500">
            Deskripsi sementara; jabatan dan bidang mengajar belum diverifikasi.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {shown.map((guru, i) => (
              <Link
                key={guru.nama}
                to={`/profil-sekolah/guru/${slugify(guru.nama)}`}
                className="block min-w-0 rounded-xl transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transform-none"
              >
                <article className="h-full min-w-0">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-dark-50">
                    <img
                      src={guru.image}
                      alt={guru.nama}
                      className="absolute inset-0 h-full w-full object-cover object-top"
                      loading={i < 4 ? 'eager' : 'lazy'}
                    />
                  </div>
                  <div className="px-1 pb-2 pt-2 [overflow-wrap:anywhere]">
                    <h3 className="font-heading text-xs font-bold leading-relaxed text-primary">
                      {guru.nama}
                    </h3>
                    {guru.jabatan && <p className="mt-1 font-heading text-[11px] font-bold leading-relaxed text-dark-900">
                      {guru.jabatan}
                    </p>}
                    {guru.bidang && <p className="mt-1 text-[11px] leading-relaxed text-dark-500">{guru.bidang}</p>}
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Indikator carousel — hanya muncul kalau gurunya lebih dari satu halaman */}
          {pages > 1 && (
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
          )}
        </div>
      </div>
    </section>
  );
};

export default TentangKepalaSekolahSection;
