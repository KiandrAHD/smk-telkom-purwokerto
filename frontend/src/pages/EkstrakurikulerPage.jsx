import { useMemo, useState } from 'react';
import { ArrowRight, Building2, Search, Sparkles, Trophy, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import RibbonDivider from '../components/RibbonDivider';
import { ekstrakurikulerData } from '../data/dummyData';

const STAT_ICONS = [Building2, Trophy, UsersRound, Sparkles];

const EkstrakurikulerPage = () => {
  const [kategori, setKategori] = useState('Semua');
  const [pencarian, setPencarian] = useState('');
  const [tampilkanSemua, setTampilkanSemua] = useState(false);

  const filteredItems = useMemo(() => {
    const kataKunci = pencarian.trim().toLocaleLowerCase('id-ID');
    return ekstrakurikulerData.items.filter((item) => {
      const sesuaiKategori = kategori === 'Semua' || item.category === kategori;
      const sesuaiPencarian = !kataKunci
        || `${item.title} ${item.description}`.toLocaleLowerCase('id-ID').includes(kataKunci);
      return sesuaiKategori && sesuaiPencarian;
    });
  }, [kategori, pencarian]);

  const visibleItems = tampilkanSemua ? filteredItems : filteredItems.slice(0, 4);
  const judulBagian = pencarian.trim() ? 'Hasil Pencarian' : kategori === 'Semua' ? 'Organisasi' : kategori;

  const pilihKategori = (nama) => {
    setKategori(nama);
    setTampilkanSemua(false);
  };

  const lihatSemua = () => {
    if (kategori !== 'Semua') {
      setKategori('Semua');
      setTampilkanSemua(true);
      return;
    }
    setTampilkanSemua((nilai) => !nilai);
  };

  return (
    <MainLayout>
      <section className="px-4 pb-12 pt-7 sm:px-6 lg:px-8 lg:pb-16 lg:pt-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[26px] border border-primary/35 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.08)]">
          <div className="relative z-10 grid min-h-[430px] lg:grid-cols-[0.88fr_1.12fr]">
            <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14 lg:py-12">
              <p className="text-xs font-semibold text-primary">{ekstrakurikulerData.eyebrow}</p>
              <h1 className="mt-3 font-heading text-[1.8rem] font-extrabold leading-none tracking-tight text-primary sm:text-5xl lg:text-[3.35rem]">
                {ekstrakurikulerData.title}
              </h1>
              <p className="mt-3 text-base font-semibold text-dark-700 sm:text-lg">{ekstrakurikulerData.subtitle}</p>

              <label className="mt-8 flex max-w-md items-center rounded-full border border-dark-200 bg-white p-1.5 pl-5 shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
                <input
                  type="search"
                  value={pencarian}
                  onChange={(event) => setPencarian(event.target.value)}
                  aria-label="Cari kegiatan"
                  placeholder="Cari Kegiatan...."
                  className="min-w-0 flex-1 bg-transparent text-sm text-dark-800 outline-none placeholder:text-dark-400"
                />
                <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-primary text-white">
                  <Search className="h-4 w-4" />
                </span>
              </label>

              <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-6">
                {ekstrakurikulerData.stats.map((stat, index) => {
                  const Icon = STAT_ICONS[index];
                  return (
                    <div key={stat.label} className="flex items-start gap-3">
                      <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-primary-50 text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="font-heading text-xl font-extrabold leading-none text-primary">{stat.value}</p>
                        <p className="mt-1 max-w-[150px] text-[10px] font-medium leading-snug text-dark-500">{stat.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative min-h-[285px] lg:min-h-0">
              <img
                src={ekstrakurikulerData.heroImage}
                alt="Siswa SMK Telkom Purwokerto mengeksplorasi teknologi"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="daftar-ekstrakurikuler" className="bg-white px-4 pb-14 sm:px-6 lg:px-8 lg:pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex gap-2 overflow-x-auto pb-2 sm:justify-center">
            {ekstrakurikulerData.categories.map((nama) => (
              <button
                key={nama}
                type="button"
                onClick={() => pilihKategori(nama)}
                aria-pressed={kategori === nama}
                className={`flex-none rounded-full border px-5 py-2.5 text-xs font-semibold transition-colors ${
                  kategori === nama
                    ? 'border-primary bg-primary text-white'
                    : 'border-dark-200 bg-white text-dark-600 hover:border-primary hover:text-primary'
                }`}
              >
                {nama}
              </button>
            ))}
          </div>

          <h2 className="mt-9 text-center font-heading text-2xl font-extrabold text-dark-900 sm:text-3xl">{judulBagian}</h2>

          {visibleItems.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {visibleItems.map((item) => (
                <article key={item.title} className="group overflow-hidden rounded-2xl bg-white shadow-[0_12px_32px_rgba(15,23,42,0.10)]">
                  <div className="overflow-hidden">
                    <img
                      src={item.image}
                      alt={`Kegiatan ${item.title}`}
                      loading="lazy"
                      className="aspect-[2.08/1] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex min-h-[198px] flex-col px-5 py-5">
                    <p className="text-[10px] font-semibold text-dark-400">{item.category}</p>
                    <h3 className="mt-1 font-heading text-lg font-extrabold text-primary">{item.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-dark-500">{item.description}</p>
                    <Link to="/berita" className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-bold text-primary hover:underline">
                      Selengkapnya <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-8 rounded-2xl border border-dashed border-dark-200 py-12 text-center text-sm text-dark-500">
              Kegiatan yang dicari belum ditemukan.
            </p>
          )}

          <div aria-hidden="true" className="mt-8 flex justify-center gap-2">
            {[0, 1, 2, 3].map((dot) => (
              <span key={dot} className={`h-2 rounded-full ${dot === 0 ? 'w-7 bg-primary' : 'w-2 bg-dark-200'}`} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={lihatSemua}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-xs font-bold text-white transition-colors hover:bg-primary-800"
            >
              {tampilkanSemua ? 'Tampilkan Lebih Sedikit' : 'Lihat Semua'}
              <ArrowRight className={`h-4 w-4 transition-transform ${tampilkanSemua ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </section>

      <RibbonDivider />
    </MainLayout>
  );
};

export default EkstrakurikulerPage;
