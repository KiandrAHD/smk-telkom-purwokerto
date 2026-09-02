import { useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PengumumanFilterBar from './PengumumanFilterBar';
import PengumumanTimelineBar from './PengumumanTimelineBar';
import PengumumanCard from './PengumumanCard';
import PengumumanPopulerCard from './PengumumanPopulerCard';
import PengumumanBantuanCard from './PengumumanBantuanCard';
import { daftarPengumuman } from '../../data/dummyData';

// Lihat catatan tampilkanLihatSemua di PengumumanPopulerCard.
const PengumumanDaftarSection = ({ items = [], tampilkanLihatSemua = true }) => {
  const [chip, setChip] = useState('Semua');
  const [query, setQuery] = useState('');

  // Sama seperti di Berita: tabel `pengumuman` tidak punya kolom kategori,
  // jadi barisan chip-nya dulu berisi sepuluh kategori yang tak satu pun bisa
  // cocok. Sempat ditambal dengan chips={['Semua']} -- satu tombol yang tidak
  // menyaring apa-apa. Sekarang diturunkan dari data, dan hilang selama belum
  // ada yang bisa dibedakan.
  const kategoriChips = useMemo(() => {
    const unik = [...new Set(items.map((item) => item.kategori).filter(Boolean))].sort();
    return unik.length > 1 ? ['Semua', ...unik] : [];
  }, [items]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const byChip = chip === 'Semua' || item.kategori === chip;
      const byText =
        !q || item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q);
      return byChip && byText;
    });
  }, [chip, query, items]);

  return (
    <section className="bg-white pb-8 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PengumumanFilterBar
          chip={chip}
          onChip={setChip}
          query={query}
          onQuery={setQuery}
          chips={kategoriChips}
        />

        <div className="mt-5">
          <PengumumanTimelineBar />
        </div>

        {/* Kolom kartu 65,5% dan sidebar 34,5%, mengikuti pembagian di Figma. */}
        <div className="mt-7 grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_34%] lg:gap-8">
          <div>
            {shown.length > 0 ? (
              <div className="space-y-4">
                {shown.map((item, i) => (
                  <PengumumanCard key={`${item.title}-${i}`} item={item} />
                ))}
              </div>
            ) : (
              <p className="py-12 text-center text-xs text-dark-500">
                Tidak ada pengumuman yang cocok dengan filter itu.
              </p>
            )}

            {tampilkanLihatSemua && (
              <div className="mt-7 flex justify-center">
                <Link
                  to="/pengumuman/semua"
                  className="inline-flex items-center gap-3 rounded-full border border-primary px-7 py-3 font-heading text-xs font-extrabold text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  {daftarPengumuman.ctaText}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>

          <div className="space-y-5">
            <PengumumanPopulerCard />
            <PengumumanBantuanCard />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PengumumanDaftarSection;
