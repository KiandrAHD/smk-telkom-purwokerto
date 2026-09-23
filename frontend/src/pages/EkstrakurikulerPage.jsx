import { useMemo, useState } from 'react';
import { ArrowRight, Bookmark, BriefcaseBusiness, ChevronLeft, ChevronRight, Info, Search, Trophy, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
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
  <div className="mx-auto flex max-w-full gap-3 overflow-x-auto pb-2 [scrollbar-width:none] sm:justify-center [&::-webkit-scrollbar]:hidden">
    {ekstrakurikulerData.categories.map((name) => {
      const active = activeCategory === name;
      return (
        <button
          key={name}
          type="button"
          onClick={() => onSelect(name)}
          aria-pressed={active}
          aria-controls="penjelasan-kategori"
          className={`h-10 min-w-[7.5rem] flex-none rounded-full border px-5 font-heading text-xs font-bold transition-all duration-200 ${
            active
              ? 'border-primary bg-primary text-white shadow-[0_8px_20px_rgba(200,16,46,0.18)]'
              : 'border-primary/45 bg-white text-primary hover:border-primary hover:bg-primary-50'
          }`}
        >
          {name}
        </button>
      );
    })}
  </div>
);

const ActivityCard = ({ item }) => (
  <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-lg">
    <div className="aspect-[2/1] flex-none overflow-hidden">
      <img
        src={item.image}
        alt={`Kegiatan ${item.title}`}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
    </div>
    <div className="flex min-h-0 flex-1 flex-col px-4 pb-4 pt-4">
      <h3 className="font-heading text-[13px] font-bold leading-snug text-primary">{item.title}</h3>
      <p className="mt-1.5 line-clamp-5 text-[10px] leading-relaxed text-dark-500">{item.description}</p>
      <Link
        to="/berita"
        className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[10px] font-bold text-primary transition-colors hover:text-primary-800"
      >
        Selengkapnya <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </div>
  </article>
);

const CardGrid = ({ items, carousel = false }) => (
  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
    {items.map((item, index) => (
      <div
        key={item.title}
        className={carousel && index > 0
          ? (index === 1 ? 'hidden h-full sm:block' : index <= 3 ? 'hidden h-full lg:block' : 'hidden')
          : 'h-full'}
      >
        <ActivityCard item={item} />
      </div>
    ))}
  </div>
);

const CategorySection = ({ activeCategory, title, items, onSelect }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState('next');
  const categoryDetail = ekstrakurikulerData.categoryDetails[activeCategory];
  const orderedItems = items.map((_, offset) => items[(activeSlide + offset) % items.length]);

  const shiftSlide = (step) => {
    setDirection(step < 0 ? 'previous' : 'next');
    setActiveSlide((current) => (current + step + items.length) % items.length);
  };

  const selectSlide = (nextSlide) => {
    setDirection(nextSlide < activeSlide ? 'previous' : 'next');
    setActiveSlide(nextSlide);
  };

  const handleCarouselKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      shiftSlide(-1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      shiftSlide(1);
    }
  };

  return (
    <section
      id="daftar-ekstrakurikuler"
      className="relative overflow-hidden bg-white py-8 lg:py-12"
    >
      <AccentPattern />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CategoryTabs activeCategory={activeCategory} onSelect={onSelect} />
        <div
          id="penjelasan-kategori"
          aria-live="polite"
          aria-labelledby="judul-penjelasan-kategori"
          className="mt-5 overflow-hidden rounded-2xl border border-primary/20 bg-primary-50/60"
        >
          <div key={activeCategory} className="animate-masuk-halaman p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-primary text-white">
                <Info className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">Penjelasan kategori</p>
                <h2 id="judul-penjelasan-kategori" className="mt-1 font-heading text-lg font-extrabold text-dark-900 sm:text-xl">
                  {categoryDetail.title}
                </h2>
                <p className="mt-2 max-w-4xl text-xs leading-relaxed text-dark-600 sm:text-sm">
                  {categoryDetail.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2" aria-label={`Hal yang dikembangkan dalam ${categoryDetail.title}`}>
                  {categoryDetail.skills.map((skill) => (
                    <span key={skill} className="rounded-full border border-primary/20 bg-white px-3 py-1 text-[10px] font-semibold text-primary sm:text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-end justify-between gap-4">
          <h2 className="font-heading text-xl font-extrabold text-dark-900 sm:text-2xl">{title}</h2>
          <p className="text-xs text-dark-500">{items.length} kegiatan</p>
        </div>
        {items.length > 0 ? (
          <div
            className="mt-7 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            role="region"
            aria-label={`Carousel ${title}`}
            tabIndex={0}
            onKeyDown={handleCarouselKeyDown}
          >
            <div key={`${title}-${activeSlide}`} className="showcase-grid" data-direction={direction}>
              <CardGrid items={orderedItems} carousel />
            </div>
          </div>
        ) : (
          <p className="mt-7 rounded-2xl border border-dashed border-dark-200 py-16 text-center text-sm text-dark-500">
            Kegiatan yang dicari belum ditemukan.
          </p>
        )}
        {items.length > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3" aria-label={`Navigasi carousel ${title}`}>
            <button
              type="button"
              onClick={() => shiftSlide(-1)}
              aria-label={`Slide ${title} sebelumnya`}
              className="grid h-8 w-8 flex-none place-items-center rounded-full border border-primary/40 text-primary transition-colors hover:bg-primary hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-1.5">
              {items.map((item, dot) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => selectSlide(dot)}
                  aria-label={`Tampilkan slide ${dot + 1} ${title}`}
                  aria-current={dot === activeSlide ? 'true' : undefined}
                  className={`h-2.5 w-2.5 rounded-full transition-all ${dot === activeSlide ? 'scale-110 bg-primary' : 'bg-dark-200 hover:bg-primary/50'}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => shiftSlide(1)}
              aria-label={`Slide ${title} berikutnya`}
              className="grid h-8 w-8 flex-none place-items-center rounded-full border border-primary/40 text-primary transition-colors hover:bg-primary hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

const EkstrakurikulerPage = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Ekstrakurikuler');
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

              <label className="mt-5 flex h-11 w-full max-w-md items-center rounded-full border border-dark-200 bg-white pl-4 shadow-card focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
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
      />
    </MainLayout>
  );
};

export default EkstrakurikulerPage;
