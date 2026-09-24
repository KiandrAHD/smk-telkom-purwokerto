import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Bookmark, BriefcaseBusiness, Search, Trophy, UsersRound, X } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import footerAccent from '../assets/landing/footer-accent.png';
import { ekstrakurikulerData } from '../data/dummyData';

const STAT_ICONS = [BriefcaseBusiness, Trophy, UsersRound, Bookmark];

const AccentPattern = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
    {[
      '-left-[108px] top-8',
      '-left-[82px] top-[265px]',
      '-left-[112px] top-[520px]',
      '-right-[105px] top-12',
      '-right-[72px] top-[285px]',
      '-right-[112px] top-[535px]',
    ].map((position) => (
      <img
        key={position}
        src={footerAccent}
        alt=""
        className={`absolute hidden h-[235px] w-[235px] max-w-none select-none opacity-30 lg:block ${position}`}
      />
    ))}
  </div>
);

const CategoryTabs = ({ activeCategory, onSelect }) => (
  <div className="mx-auto grid max-w-xl grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center">
    {ekstrakurikulerData.categories.map((name) => {
      const active = activeCategory === name;
      return (
        <button
          key={name}
          type="button"
          onClick={() => onSelect(name)}
          aria-pressed={active}
          className={`h-10 rounded-full border px-4 font-heading text-xs font-bold transition-colors duration-200 sm:min-w-[7.5rem] sm:px-5 ${
            active
              ? 'border-primary bg-primary text-white'
              : 'border-primary/45 bg-white text-primary hover:border-primary hover:bg-primary-50'
          }`}
        >
          {name}
        </button>
      );
    })}
  </div>
);

const ActivityCard = ({ item, onOpen }) => (
  <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-dark-100 bg-white transition-colors duration-200 hover:border-primary">
    <div className="aspect-[2/1] flex-none overflow-hidden">
      <img
        src={item.image}
        alt={`Kegiatan ${item.title}`}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    </div>
    <div className="flex min-h-0 flex-1 flex-col px-4 pb-4 pt-4">
      <h3 className="font-heading text-[13px] font-bold leading-snug text-primary">{item.title}</h3>
      <p className="mt-1.5 line-clamp-5 text-[10px] leading-relaxed text-dark-500">{item.description}</p>
      <button
        type="button"
        onClick={() => onOpen(item)}
        className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[10px] font-bold text-primary transition-colors hover:text-primary-800"
      >
        Selengkapnya <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
      </button>
    </div>
  </article>
);

const CardGrid = ({ items, onOpen }) => (
  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
    {items.map((item) => (
      <div key={item.title} className="h-full">
        <ActivityCard item={item} onOpen={onOpen} />
      </div>
    ))}
  </div>
);

const ActivityDetailDialog = ({ item, onClose }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (item && !dialogRef.current?.open) dialogRef.current?.showModal();
  }, [item]);

  if (!item) return null;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      aria-labelledby="judul-detail-kegiatan"
      className="m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-2xl overflow-hidden rounded-3xl border border-dark-200 bg-white p-0 backdrop:bg-dark-900/70"
    >
      <div className="relative max-h-[90vh] overflow-y-auto">
        <img src={item.image} alt={`Kegiatan ${item.title}`} className="aspect-[16/7] w-full object-cover" />
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          aria-label="Tutup penjelasan kegiatan"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-dark-200 bg-white text-dark-800 transition-colors hover:border-primary hover:bg-primary hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="p-5 sm:p-7">
          <span className="inline-flex rounded-full bg-primary-50 px-3 py-1 text-[10px] font-bold text-primary">
            {item.category}
          </span>
          <h2 id="judul-detail-kegiatan" className="mt-3 font-heading text-2xl font-extrabold text-dark-900 sm:text-3xl">
            {item.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-dark-600">{item.description}</p>
          <h3 className="mt-6 font-heading text-sm font-bold text-dark-900">Yang dipelajari dan dikembangkan</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {item.focus.map((focus) => (
              <li key={focus} className="flex items-center gap-2 rounded-xl bg-dark-50 px-3 py-2 text-xs font-medium text-dark-700">
                <span aria-hidden="true" className="h-2 w-2 flex-none rounded-full bg-primary" />
                {focus}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </dialog>
  );
};

const CategorySection = ({ activeCategory, title, items, onSelect, onOpen }) => {
  const visibleItems = items.slice(0, 4);

  return (
    <section
      id="daftar-ekstrakurikuler"
      className="relative overflow-hidden bg-white py-8 lg:py-12"
    >
      <AccentPattern />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CategoryTabs activeCategory={activeCategory} onSelect={onSelect} />
        <div className="mt-6 flex items-end justify-between gap-4">
          <h2 className="font-heading text-xl font-extrabold text-dark-900 sm:text-2xl">{title}</h2>
          <p className="text-xs text-dark-500">{visibleItems.length} kegiatan</p>
        </div>
        {items.length > 0 ? (
          <div className="mt-7">
            <CardGrid items={visibleItems} onOpen={onOpen} />
          </div>
        ) : (
          <p className="mt-7 rounded-2xl border border-dashed border-dark-200 py-16 text-center text-sm text-dark-500">
            Kegiatan yang dicari belum ditemukan.
          </p>
        )}
      </div>
    </section>
  );
};

const EkstrakurikulerPage = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Ekstrakurikuler');
  const [selectedItem, setSelectedItem] = useState(null);
  const keyword = search.trim().toLocaleLowerCase('id-ID');

  const filteredItems = useMemo(() => ekstrakurikulerData.items.filter((item) => (
    (activeCategory === 'Ekstrakurikuler' || item.category === activeCategory)
    && `${item.title} ${item.category} ${item.description}`.toLocaleLowerCase('id-ID').includes(keyword)
  )), [activeCategory, keyword]);

  const sectionTitle = keyword
    ? 'Hasil Pencarian'
    : activeCategory === 'Ekstrakurikuler' ? 'Semua Ekstrakurikuler' : activeCategory;

  return (
    <MainLayout>
      <section className="bg-white pb-6 pt-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] border border-primary/30 bg-white p-3 sm:p-4">
            <div className="grid overflow-hidden rounded-[1.75rem] lg:min-h-[390px] lg:grid-cols-[38%_1fr]">
            <div className="flex flex-col justify-center px-4 py-7 sm:px-6 lg:px-7 lg:py-8">
              <span className="w-fit rounded-full border border-primary/35 px-2 py-0.5 text-[8px] font-bold tracking-wide text-primary">
                {ekstrakurikulerData.eyebrow}
              </span>
              <h1 className="mt-4 font-heading text-3xl font-extrabold leading-[1.2] tracking-tight text-dark-900 sm:text-4xl lg:text-[1.75rem] xl:text-[2rem]">
                {ekstrakurikulerData.title}
              </h1>
              <p className="mt-2 text-sm font-medium text-dark-500">{ekstrakurikulerData.subtitle}</p>

              <label className="mt-5 flex h-11 w-full max-w-md items-center rounded-full border border-dark-200 bg-white pl-4 focus-within:border-primary">
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label="Cari kegiatan"
                  placeholder="Cari Kegiatan...."
                  className="min-w-0 flex-1 bg-transparent text-xs text-dark-700 outline-none placeholder:text-dark-400 sm:text-sm"
                />
                <span className="mr-1 grid h-9 w-9 flex-none place-items-center rounded-full bg-primary text-white">
                  <Search className="h-4 w-4" />
                </span>
              </label>

              <div className="mt-7 grid max-w-md grid-cols-2 gap-x-4 gap-y-5">
                {ekstrakurikulerData.stats.map((stat, index) => {
                  const Icon = STAT_ICONS[index];
                  return (
                    <div key={stat.label} className="flex min-w-0 items-center gap-2">
                      <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-primary text-white">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-medium leading-tight text-dark-600">{stat.label}</p>
                        <p className="mt-0.5 font-heading text-lg font-bold leading-none text-dark-900">{stat.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative min-h-[260px] overflow-hidden lg:min-h-0">
              <img
                src={ekstrakurikulerData.heroImage}
                alt="Siswa SMK Telkom Purwokerto mengeksplorasi teknologi"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
            </div>
          </div>
        </div>
        </div>
      </section>

      <CategorySection
        key={`${activeCategory}-${keyword}`}
        activeCategory={activeCategory}
        title={sectionTitle}
        items={filteredItems}
        onSelect={setActiveCategory}
        onOpen={setSelectedItem}
      />
      <ActivityDetailDialog item={selectedItem} onClose={() => setSelectedItem(null)} />
    </MainLayout>
  );
};

export default EkstrakurikulerPage;
