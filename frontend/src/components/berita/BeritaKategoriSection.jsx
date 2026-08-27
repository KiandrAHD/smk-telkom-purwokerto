import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { kategoriBerita } from '../../data/dummyData';

const BeritaKategoriSection = () => {
  const [chip, setChip] = useState('Semua');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('terbaru');
  const [shownCount, setShownCount] = useState(kategoriBerita.perPage);

  const matched = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = kategoriBerita.items.filter((n) => {
      const byChip = chip === 'Semua' || n.kategori === chip;
      const byText =
        !q || n.title.toLowerCase().includes(q) || n.excerpt.toLowerCase().includes(q);
      return byChip && byText;
    });
    return [...list].sort((a, b) =>
      sort === 'terbaru' ? b.iso.localeCompare(a.iso) : a.iso.localeCompare(b.iso)
    );
  }, [chip, query, sort]);

  const shown = matched.slice(0, shownCount);
  const hasMore = shownCount < matched.length;

  // Setiap perubahan filter mengembalikan jumlah kartu ke halaman pertama,
  // supaya "Muat Lebih Banyak" tidak membawa sisa hitungan filter sebelumnya.
  const applyFilter = (fn) => (value) => {
    fn(value);
    setShownCount(kategoriBerita.perPage);
  };

  return (
    <section id="kategori-berita" className="bg-white py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-dark-900">
          {kategoriBerita.title}
        </h2>

        {/* Chip kategori + pencarian + urutan */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {kategoriBerita.chips.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => applyFilter(setChip)(c)}
              aria-pressed={chip === c}
              className={`rounded-full border px-3.5 py-1.5 text-[10px] font-semibold transition-colors ${
                chip === c
                  ? 'border-primary bg-primary text-white'
                  : 'border-dark-200 bg-white text-dark-600 hover:border-primary hover:text-primary'
              }`}
            >
              {c}
            </button>
          ))}

          <label className="relative ml-auto">
            <span className="sr-only">{kategoriBerita.searchPlaceholder}</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-dark-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => applyFilter(setQuery)(e.target.value)}
              placeholder={kategoriBerita.searchPlaceholder}
              className="w-40 rounded-full border border-dark-200 py-1.5 pl-8 pr-3 text-[10px] text-dark-700 outline-none transition-colors placeholder:text-dark-400 focus:border-primary"
            />
          </label>

          <label>
            <span className="sr-only">Urutkan berita</span>
            <select
              value={sort}
              onChange={(e) => applyFilter(setSort)(e.target.value)}
              className="rounded-full border border-dark-200 px-3 py-1.5 text-[10px] text-dark-600 outline-none transition-colors focus:border-primary"
            >
              {kategoriBerita.sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Kartu berita */}
        {shown.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {shown.map((n) => (
              <article
                key={n.title}
                className="flex flex-col overflow-hidden rounded-xl border border-dark-100 bg-white shadow-card transition-transform hover:-translate-y-1"
              >
                <div className="relative">
                  <img
                    src={n.image}
                    alt={n.title}
                    className="w-full aspect-[16/10] object-cover"
                    loading="lazy"
                  />
                  <span className="absolute bottom-1.5 left-1.5 rounded bg-primary px-1.5 py-0.5 text-[8px] font-bold text-white">
                    {n.kategori}
                  </span>
                </div>

                <div className="flex flex-1 flex-col px-3 py-3">
                  <h3 className="font-heading text-[11px] font-bold leading-snug text-dark-900">
                    {n.title}
                  </h3>
                  <p className="mt-1.5 text-[9px] text-dark-400">
                    {n.date} &nbsp;·&nbsp; {n.author}
                  </p>
                  <p className="mt-1.5 text-[9px] leading-relaxed text-dark-500">{n.excerpt}</p>
                  <Link
                    to={`/berita/${n.slug}`}
                    className="mt-auto pt-3 text-[10px] font-bold text-primary hover:underline"
                  >
                    Baca Selengkapnya
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-center text-xs text-dark-500">
            Tidak ada berita yang cocok dengan filter itu.
          </p>
        )}

        {/* Navigasi & muat lebih banyak */}
        <div className="mt-7 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => setShownCount(kategoriBerita.perPage)}
            disabled={shownCount <= kategoriBerita.perPage}
            aria-label="Kembali ke berita awal"
            className="relative text-primary transition-opacity before:absolute before:-inset-2 before:content-[''] disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setShownCount((c) => c + kategoriBerita.perPage)}
            disabled={!hasMore}
            className="inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-white px-4 py-2 text-[10px] font-bold text-primary transition-colors hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-primary"
          >
            {kategoriBerita.ctaText}
          </button>

          <button
            type="button"
            onClick={() => setShownCount((c) => c + kategoriBerita.perPage)}
            disabled={!hasMore}
            aria-label="Berita berikutnya"
            className="relative text-primary transition-opacity before:absolute before:-inset-2 before:content-[''] disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-3 text-center text-[9px] text-dark-400">
          Menampilkan {shown.length} dari {matched.length} berita
        </p>
      </div>
    </section>
  );
};

export default BeritaKategoriSection;
