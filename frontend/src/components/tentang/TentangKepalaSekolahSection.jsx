import { useState } from 'react';
import { ArrowRight, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { slugify } from '../../utils/slug';
import watermark from '../../assets/landing/footer-accent.png';
import { guruData, kepalaSekolah } from '../../data/dummyData';

const PER_PAGE = 4;

const accentPositions = [
  'right-[min(99px,5.36vw)] top-0',
  'right-[max(-86px,-4.66vw)] top-[min(163px,8.83vw)]',
  'right-[min(89px,4.82vw)] top-[min(420px,22.74vw)] -rotate-90',
  'left-[min(188px,10.18vw)] top-[min(494px,26.75vw)]',
  'left-[min(372px,20.14vw)] top-[min(658px,35.63vw)] rotate-90',
  'left-[max(-55px,-2.98vw)] top-[min(683px,36.98vw)] -rotate-90',
];

const TentangKepalaSekolahSection = () => {
  const [expanded, setExpanded] = useState(false);
  const [page, setPage] = useState(0);

  const pages = Math.ceil(guruData.length / PER_PAGE);
  const shown = guruData.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <section id="guru" className="relative overflow-x-clip bg-white py-8 lg:py-12 min-[1660px]:py-14">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden overflow-x-clip min-[1660px]:block">
        {accentPositions.map((position) => (
          <img
            key={position}
            src={watermark}
            alt=""
            className={`absolute size-[min(235px,12.72vw)] max-w-none select-none opacity-30 ${position}`}
          />
        ))}
      </div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-[minmax(0,38%)_minmax(0,1fr)] lg:px-8 min-[1660px]:max-w-[1621px] min-[1660px]:grid-cols-[610px_964px] min-[1660px]:gap-[47px] min-[1660px]:px-0">
        {/* Kepala Sekolah */}
        <div className="self-start rounded-2xl border border-dark-100 bg-white p-5 shadow-card min-[1660px]:min-h-[438px] min-[1660px]:rounded-[20px] min-[1660px]:border-0 min-[1660px]:bg-[#fffdfd] min-[1660px]:p-0">
          <h2 className="font-heading text-base font-extrabold text-primary min-[1660px]:ml-[42px] min-[1660px]:mt-[14px] min-[1660px]:text-[32px] min-[1660px]:leading-[40px]">
            Kepala Sekolah
          </h2>
          <div className="mt-4 flex flex-col gap-4 min-[400px]:flex-row min-[1660px]:mt-[18px] min-[1660px]:gap-[13px] min-[1660px]:px-[34px]">
            <img
              src={kepalaSekolah.image}
              alt={kepalaSekolah.name}
              className="h-32 w-24 flex-shrink-0 rounded-xl bg-dark-50 object-contain p-1 min-[1660px]:h-[321px] min-[1660px]:w-[257px] min-[1660px]:p-0"
            />
            <div className="min-w-0">
              <Quote className="h-4 w-4 text-primary min-[1660px]:h-6 min-[1660px]:w-6" fill="currentColor" />
              <p className="mt-1.5 text-[10px] leading-relaxed text-dark-600 min-[1660px]:text-[18px] min-[1660px]:leading-[1.45]">
                {expanded ? kepalaSekolah.quoteFull : kepalaSekolah.quote}
              </p>
              <p className="mt-2 text-[10px] font-bold text-primary min-[1660px]:text-xs">{kepalaSekolah.name}</p>
              <p className="text-[9px] text-dark-500 min-[1660px]:text-[11px]">{kepalaSekolah.title}</p>

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
        <div className="relative min-w-0 rounded-2xl border border-dark-100 bg-white p-5 shadow-card min-[1660px]:h-[438px] min-[1660px]:rounded-[20px] min-[1660px]:border-0 min-[1660px]:bg-[#fffdfd] min-[1660px]:p-0">
          <h2 className="font-heading text-base font-extrabold text-primary min-[1660px]:ml-[51px] min-[1660px]:mt-[14px] min-[1660px]:text-[32px] min-[1660px]:leading-[40px]">
            Guru &amp; Tenaga Pendidik
          </h2>
          <p className="mt-2 text-[11px] leading-relaxed text-dark-500 min-[1660px]:sr-only">
            Jabatan organisasi mengikuti SK Pengawakan 2026/2027; mata pelajaran tidak tercantum dalam SK.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 min-[1660px]:ml-[45px] min-[1660px]:mt-[38px] min-[1660px]:grid-cols-[repeat(4,206px)] min-[1660px]:gap-5">
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
          <div className="mt-5 flex items-center justify-center gap-2 min-[1660px]:absolute min-[1660px]:bottom-5 min-[1660px]:left-1/2 min-[1660px]:mt-0 min-[1660px]:-translate-x-1/2">
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
