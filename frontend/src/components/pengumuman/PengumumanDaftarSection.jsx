import { useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PengumumanFilterBar from './PengumumanFilterBar';
import PengumumanTimelineBar from './PengumumanTimelineBar';
import PengumumanCard from './PengumumanCard';
import PengumumanPopulerCard from './PengumumanPopulerCard';
import PengumumanBantuanCard from './PengumumanBantuanCard';
import { daftarPengumuman } from '../../data/dummyData';

const PengumumanDaftarSection = () => {
  const [chip, setChip] = useState('Semua');
  const [query, setQuery] = useState('');

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return daftarPengumuman.items.filter((item) => {
      const byChip = chip === 'Semua' || item.kategori === chip;
      const byText =
        !q || item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q);
      return byChip && byText;
    });
  }, [chip, query]);

  return (
    <section className="bg-white pb-8 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PengumumanFilterBar chip={chip} onChip={setChip} query={query} onQuery={setQuery} />

        <div className="mt-7">
          <PengumumanTimelineBar />
        </div>

        {/* Kolom kartu 65,5% dan sidebar 34,5%, mengikuti pembagian di Figma. */}
        <div className="mt-9 grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_34%] lg:gap-12">
          <div>
            {shown.length > 0 ? (
              <div className="space-y-5">
                {shown.map((item, i) => (
                  <PengumumanCard key={`${item.title}-${i}`} item={item} />
                ))}
              </div>
            ) : (
              <p className="py-12 text-center text-xs text-dark-500">
                Tidak ada pengumuman yang cocok dengan filter itu.
              </p>
            )}

            <div className="mt-9 flex justify-center">
              <Link
                to="/pengumuman/semua"
                className="inline-flex items-center gap-4 rounded-lg border-2 border-[#bf0d1b] px-10 py-5 font-heading text-[17px] font-extrabold text-[#c72b37] transition-colors hover:bg-primary hover:text-white"
              >
                {daftarPengumuman.ctaText}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <PengumumanPopulerCard />
            <PengumumanBantuanCard />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PengumumanDaftarSection;
