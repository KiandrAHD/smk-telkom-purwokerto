import { useMemo, useState } from 'react';
import { ArrowRight, Bookmark, BriefcaseBusiness, ChevronLeft, ChevronRight, Search, Trophy, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import RibbonDivider from '../components/RibbonDivider';
import footerAccent from '../assets/landing/footer-accent.png';
import { ekstrakurikulerData } from '../data/dummyData';

const CATEGORY_ORDER = ['Organisasi', 'Prestasi', 'Sentra', 'Community'];
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
        className={carousel && index > 0 ? (index === 1 ? 'hidden h-full sm:block' : 'hidden h-full lg:block') : 'h-full'}
      >
        <ActivityCard item={item} />
      </div>
    ))}
  </div>
);

const CategorySection = ({ category, first, items, onSelect }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState('next');
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
      id={`kategori-${category.toLocaleLowerCase('id-ID')}`}
      data-category-section={category}
      className="relative scroll-mt-24 overflow-hidden bg-white py-8 lg:py-12"
    >
      {!first && <AccentPattern />}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CategoryTabs activeCategory={first ? 'Semua' : category} onSelect={onSelect} />
        <h2 className="mt-6 font-heading text-xl font-extrabold text-dark-900 sm:text-2xl">{category}</h2>
        <div
          className="mt-7 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          role="region"
          aria-label={`Carousel ${category}`}
          tabIndex={0}
          onKeyDown={handleCarouselKeyDown}
        >
          <div key={`${category}-${activeSlide}`} className="showcase-grid" data-direction={direction}>
            <CardGrid items={orderedItems} carousel />
          </div>
        </div>
        <div className="mt-8 flex items-center justify-center gap-3" aria-label={`Navigasi carousel ${category}`}>
          <button
            type="button"
            onClick={() => shiftSlide(-1)}
            aria-label={`Slide ${category} sebelumnya`}
            className="grid h-8 w-8 place-items-center rounded-full border border-primary/40 text-primary transition-colors hover:bg-primary hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-2">
            {items.map((item, dot) => (
              <button
                key={item.title}
                type="button"
                onClick={() => selectSlide(dot)}
                aria-label={`Tampilkan slide ${dot + 1} ${category}`}
                aria-current={dot === activeSlide ? 'true' : undefined}
                className={`h-2.5 w-2.5 rounded-full transition-all ${dot === activeSlide ? 'scale-110 bg-primary' : 'bg-dark-200 hover:bg-primary/50'}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => shiftSlide(1)}
            aria-label={`Slide ${category} berikutnya`}
            className="grid h-8 w-8 place-items-center rounded-full border border-primary/40 text-primary transition-colors hover:bg-primary hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-6 flex justify-center">
          <Link
            to="/berita"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold text-white transition-all duration-200 hover:bg-primary-800 hover:shadow-lg"
          >
            Lihat Semua <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

const EkstrakurikulerPage = () => {
  const [search, setSearch] = useState('');
  const keyword = search.trim().toLocaleLowerCase('id-ID');

  const searchResults = useMemo(() => ekstrakurikulerData.items.filter((item) => (
    `${item.title} ${item.category} ${item.description}`.toLocaleLowerCase('id-ID').includes(keyword)
  )), [keyword]);

  const scrollToCategory = (category) => {
    const target = category === 'Semua' ? CATEGORY_ORDER[0] : category;
    document.getElementById(`kategori-${target.toLocaleLowerCase('id-ID')}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

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

      {keyword ? (
        <section className="relative bg-white py-8 lg:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <CategoryTabs activeCategory="Semua" onSelect={scrollToCategory} />
            <h2 className="mt-6 font-heading text-xl font-extrabold text-dark-900 sm:text-2xl">Hasil Pencarian</h2>
            {searchResults.length > 0 ? (
              <div className="mt-7"><CardGrid items={searchResults} /></div>
            ) : (
              <p className="mt-7 rounded-2xl border border-dashed border-dark-200 py-16 text-center text-sm text-dark-500">
                Kegiatan yang dicari belum ditemukan.
              </p>
            )}
          </div>
        </section>
      ) : (
        CATEGORY_ORDER.map((category, index) => (
          <div key={category}>
            <CategorySection
              category={category}
              first={index === 0}
              items={ekstrakurikulerData.items.filter((item) => item.category === category)}
              onSelect={scrollToCategory}
            />
            {index < CATEGORY_ORDER.length - 1 && <RibbonDivider />}
          </div>
        ))
      )}
    </MainLayout>
  );
};

export default EkstrakurikulerPage;
