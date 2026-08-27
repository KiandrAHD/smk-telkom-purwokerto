import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import bg from '../../assets/landing/partners-bg.png';
import { mitraIndustri, videoHighlight } from '../../data/dummyData';

const PrestasiDukunganSection = () => (
  <section className="bg-white py-8 lg:py-12">
    <div className="max-w-7xl mx-auto grid grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8">
      {/* Didukung & Diakui Oleh */}
      <div>
        <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-dark-900">
          {videoHighlight.sectionTitle}
        </h2>
        {/* Latar diletakkan absolut agar tinggi pita mengikuti barisan logo —
            di layar sempit logonya membungkus ke baris kedua, tidak terpotong. */}
        <div className="relative mt-6 overflow-hidden rounded-xl">
          <img
            src={bg}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="relative flex flex-wrap items-center justify-center gap-x-4 gap-y-3 px-4 py-5 sm:justify-between">
            {mitraIndustri.map((mitra) => (
              <img
                key={mitra.name}
                src={mitra.logo}
                alt={mitra.name}
                className="h-3.5 w-auto object-contain sm:h-4"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Video Highlight */}
      <div>
        <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-dark-900">
          {videoHighlight.title}
        </h2>
        <Link
          to="/galeri"
          className="mt-6 flex w-full items-center gap-4 rounded-xl border border-dark-100 bg-white px-5 py-4 text-left shadow-card transition-colors hover:border-primary"
        >
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary">
            <Play className="ml-0.5 h-4 w-4 text-white" fill="currentColor" />
          </span>
          <span className="min-w-0">
            <span className="block whitespace-pre-line font-heading text-[11px] font-bold leading-snug text-dark-900">
              {videoHighlight.videoTitle}
            </span>
            <span className="mt-1 block text-[9px] leading-relaxed text-dark-500">
              {videoHighlight.videoDesc}
            </span>
          </span>
        </Link>
      </div>
    </div>
  </section>
);

export default PrestasiDukunganSection;
