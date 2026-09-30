import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import watermark from '../assets/landing/figma-section-accent.png';
import { guruData } from '../data/dummyData';
import { slugify } from '../utils/slug';

const GuruPreviewSection = () => {
  const previewData = guruData.slice(0, 4);

  return (
    <section aria-labelledby="guru-preview-title" className="relative overflow-hidden bg-white py-8 lg:py-12 font-['Plus_Jakarta_Sans']">
      <img src={watermark} alt="" aria-hidden="true" data-figma-node="24:759" className="pointer-events-none absolute -left-20 top-4 w-48 sm:w-60 [transform:matrix(-1,8.742278367890322e-8,-8.742278367890322e-8,-1,0,0)]" />
      <div className="relative mx-auto max-w-[1546px] px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-bold text-primary">#TenagaPendidik</p>
          <h2 id="guru-preview-title" className="mt-1 font-heading text-2xl sm:text-3xl font-extrabold text-dark-900">
            Guru &amp; Tenaga Pendidik
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-dark-500 max-w-xl mx-auto">
            Tim pengajar profesional dan berpengalaman SMK Telkom Purwokerto yang siap membimbing talenta digital masa depan.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {previewData.map((guru) => (
            <Link
              key={guru.nama}
              to={'/profil-sekolah/guru/' + slugify(guru.nama)}
              aria-label={'Lihat profil ' + guru.nama}
              className="group relative block aspect-[322/426] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              <article className="relative h-full bg-white p-[10px] transition-transform duration-300 group-hover:-translate-y-1">
                <img
                  src={guru.image}
                  alt={'Foto ' + guru.nama}
                  loading="lazy"
                  className="h-full w-full rounded-[10px] object-cover object-top"
                />
                <div aria-hidden="true" className="guru-accent-horizontal-top pointer-events-none absolute inset-x-0 top-0 h-5 bg-repeat-x" />
                <div aria-hidden="true" className="guru-accent-horizontal pointer-events-none absolute inset-x-0 bottom-0 h-5 bg-repeat-x" />
                <div aria-hidden="true" className="guru-accent-vertical pointer-events-none absolute inset-y-0 left-0 w-[21px] bg-repeat-y" />
                <div aria-hidden="true" className="guru-accent-vertical pointer-events-none absolute inset-y-0 right-0 w-[21px] bg-repeat-y" />
                <div className="absolute bottom-[10%] left-[6%] right-[6%] min-h-[72px] rounded-[14px] bg-white px-3 py-2.5 shadow-[0_0_18px_rgba(0,0,0,0.14)] sm:min-h-[80px]">
                  <h3 className="text-sm font-extrabold leading-snug tracking-wide text-black sm:text-base">{guru.nama}</h3>
                  <p className="mt-0.5 text-[11px] font-medium leading-snug text-black/65 sm:text-xs">{guru.jabatan}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            to="/profil-sekolah/guru"
            className="inline-flex items-center gap-2 rounded-full border border-dark-200 bg-white px-6 py-2.5 text-xs font-semibold text-dark-700 transition-colors hover:border-primary hover:text-primary"
          >
            Lihat Semua Profil Guru
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GuruPreviewSection;
