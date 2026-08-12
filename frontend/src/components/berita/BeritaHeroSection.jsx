import { useEffect, useState } from 'react';
import { ArrowRight, Megaphone } from 'lucide-react';
import { beritaHero, breakingNews } from '../../data/dummyData';

const BeritaHeroSection = () => {
  const [i, setI] = useState(0);

  // Ticker berganti otomatis; dijeda saat kursor menyentuh baris berita.
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return undefined;
    const t = setInterval(() => setI((n) => (n + 1) % breakingNews.items.length), 5000);
    return () => clearInterval(t);
  }, [paused]);

  const item = breakingNews.items[i];

  return (
    <section className="bg-white pt-4 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-primary/30 bg-white p-3 sm:p-4">
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[38%_1fr] lg:gap-4">
            <div className="px-3 pt-6 lg:pb-6 lg:pl-4 lg:pt-4">
              <span className="text-[10px] font-bold text-primary">{beritaHero.badge}</span>

              <h1 className="mt-3 whitespace-pre-line font-heading text-3xl sm:text-4xl lg:text-[1.75rem] xl:text-[2rem] font-extrabold leading-[1.2] tracking-tight text-dark-900">
                {beritaHero.title}
                {'\n'}
                <span className="text-primary">{beritaHero.titleAccent}</span>
              </h1>

              <p className="mt-4 max-w-sm text-[11px] sm:text-xs leading-relaxed text-dark-500">
                {beritaHero.description}
              </p>

              <a
                href="#kategori-berita"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary-800"
              >
                {beritaHero.ctaText}
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <img
              src={beritaHero.image}
              alt="Siswa SMK Telkom Purwokerto"
              className="w-full rounded-[1.75rem] object-contain"
            />
          </div>
        </div>

        {/* Baris breaking news */}
        <div
          className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-3"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <span className="inline-flex flex-shrink-0 items-center gap-2 self-start rounded-lg bg-primary px-4 py-2.5 text-[11px] font-bold text-white sm:self-auto">
            <Megaphone className="h-3.5 w-3.5" />
            {breakingNews.label}
          </span>

          <div
            aria-live="polite"
            className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-1 rounded-lg bg-primary-50 px-4 py-2.5"
          >
            <span className="h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
            <p className="min-w-0 flex-1 text-[11px] font-semibold text-dark-800">{item.text}</p>
            <span className="text-[10px] text-dark-500">{item.date}</span>
            <a
              href="#berita-sorot"
              className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline"
            >
              {breakingNews.linkText}
              <ArrowRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeritaHeroSection;
