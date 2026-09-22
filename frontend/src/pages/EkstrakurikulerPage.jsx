import { useMemo, useState } from 'react';
import { ArrowRight, Bookmark, BriefcaseBusiness, Search, Trophy, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import RibbonDivider from '../components/RibbonDivider';
import footerAccent from '../assets/landing/footer-accent.png';
import { ekstrakurikulerData } from '../data/dummyData';

const CATEGORY_ORDER = ['Organisasi', 'Prestasi', 'Sentra', 'Community'];
const STAT_ICONS = [BriefcaseBusiness, Trophy, UsersRound, Bookmark];
const TAB_WIDTHS = {
  Semua: 'lg:w-[187px]',
  Organisasi: 'lg:w-[187px]',
  Prestasi: 'lg:w-[179px]',
  Sentra: 'lg:w-[160px]',
  Community: 'lg:w-[206px]',
};

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
  <div className="mx-auto flex max-w-full gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:justify-center lg:gap-[23px] [&::-webkit-scrollbar]:hidden">
    {ekstrakurikulerData.categories.map((name) => {
      const active = activeCategory === name;
      return (
        <button
          key={name}
          type="button"
          onClick={() => onSelect(name)}
          aria-pressed={active}
          className={`h-12 flex-none rounded-full border px-6 font-heading text-sm font-bold transition-all duration-200 lg:h-16 lg:text-xl ${TAB_WIDTHS[name]} ${
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
  <article className="group flex h-full min-h-[390px] flex-col overflow-hidden rounded-[14px] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.13)] transition-transform duration-300 hover:-translate-y-1 lg:h-[416px] lg:min-h-0">
    <div className="h-[180px] flex-none overflow-hidden lg:h-[201px]">
      <img
        src={item.image}
        alt={`Kegiatan ${item.title}`}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
    </div>
    <div className="flex min-h-0 flex-1 flex-col px-6 pb-6 pt-4 lg:px-7 lg:pb-7">
      <h3 className="font-heading text-xl font-bold leading-tight text-primary lg:text-[22px]">{item.title}</h3>
      <p className="mt-3 line-clamp-5 text-[11px] leading-[1.35] text-dark-600 lg:text-xs">{item.description}</p>
      <Link
        to="/berita"
        className="mt-auto inline-flex items-center gap-6 pt-4 text-xs font-bold text-primary transition-colors hover:text-primary-800"
      >
        Selengkapnya <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </div>
  </article>
);

const CardGrid = ({ items }) => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-9">
    {items.map((item) => <ActivityCard key={item.title} item={item} />)}
  </div>
);

const CategorySection = ({ category, first, items, onSelect }) => (
  <section
    id={`kategori-${category.toLocaleLowerCase('id-ID')}`}
    data-category-section={category}
    className="relative scroll-mt-24 overflow-hidden bg-white lg:min-h-[930px]"
  >
    {!first && <AccentPattern />}
    <div className="relative z-10 mx-auto max-w-[1565px] px-4 pt-7 sm:px-6 lg:px-0">
      <CategoryTabs activeCategory={first ? 'Semua' : category} onSelect={onSelect} />
      <h2 className="mt-7 font-heading text-3xl font-bold text-black lg:mt-[29px] lg:text-[34px]">{category}</h2>
      <div className="mt-7 lg:mt-[22px]">
        <CardGrid items={items} />
      </div>
      <div aria-hidden="true" className="mt-14 flex justify-center gap-3 lg:mt-[74px]">
        {[0, 1, 2, 3].map((dot) => (
          <span key={dot} className={`h-3.5 w-3.5 rounded-full ${dot === 0 ? 'bg-primary' : 'bg-dark-200'}`} />
        ))}
      </div>
      <div className="mt-10 flex justify-center">
        <Link
          to="/berita"
          className="inline-flex h-14 items-center justify-center gap-5 rounded-lg bg-primary px-8 font-heading text-sm font-bold tracking-[0.12em] text-white transition-all duration-200 hover:bg-primary-800 hover:shadow-lg lg:h-16 lg:w-[187px] lg:px-0 lg:text-base"
        >
          Lihat Semua <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  </section>
);

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
      <section className="bg-white pb-0 pt-8 lg:pt-[78px]">
        <div className="mx-auto w-[calc(100%-32px)] max-w-[1763px] overflow-hidden rounded-[20px] border-2 border-[#efa2ad] bg-white lg:h-[522px] lg:w-[calc(100%-84px)]">
          <div className="grid h-full lg:grid-cols-[37.7%_62.3%]">
            <div className="flex flex-col justify-center px-6 py-9 sm:px-10 lg:justify-start lg:px-10 lg:pb-8 lg:pt-16">
              <span className="w-fit rounded-full border border-primary/35 px-2 py-0.5 text-[8px] font-bold tracking-wide text-primary">
                {ekstrakurikulerData.eyebrow}
              </span>
              <h1 className="mt-7 font-heading text-[1.8rem] font-extrabold leading-none tracking-[0.08em] text-black sm:text-4xl lg:-ml-1 lg:mt-8 lg:text-[50px] lg:tracking-[0.105em]">
                {ekstrakurikulerData.title}
              </h1>
              <p className="mt-2 text-base font-medium text-dark-500 lg:text-xl">{ekstrakurikulerData.subtitle}</p>

              <label className="mt-6 flex h-12 w-full max-w-[562px] items-center rounded-full border border-dark-200 bg-white pl-5 shadow-[0_2px_6px_rgba(15,23,42,0.12)] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label="Cari kegiatan"
                  placeholder="Cari Kegiatan...."
                  className="min-w-0 flex-1 bg-transparent text-sm text-dark-700 outline-none placeholder:text-dark-400 lg:text-lg"
                />
                <span className="mr-1.5 grid h-[41px] w-[41px] flex-none place-items-center rounded-full bg-primary text-white">
                  <Search className="h-5 w-5" />
                </span>
              </label>

              <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 lg:mt-[46px] lg:max-w-[540px] lg:grid-cols-[215px_1fr] lg:gap-x-4 lg:gap-y-9">
                {ekstrakurikulerData.stats.map((stat, index) => {
                  const Icon = STAT_ICONS[index];
                  return (
                    <div key={stat.label} className="flex min-w-0 items-center gap-2">
                      <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-primary text-white lg:h-[50px] lg:w-[50px]">
                        <Icon className="h-5 w-5 lg:h-6 lg:w-6" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-medium leading-tight text-dark-700 lg:text-sm">{stat.label}</p>
                        <p className="mt-0.5 font-heading text-lg font-bold leading-none text-black lg:text-2xl">{stat.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative min-h-[330px] overflow-hidden lg:min-h-0">
              <img
                src={ekstrakurikulerData.heroImage}
                alt="Siswa SMK Telkom Purwokerto mengeksplorasi teknologi"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {keyword ? (
        <section className="relative bg-white py-10 lg:min-h-[850px]">
          <div className="mx-auto max-w-[1565px] px-4 sm:px-6 lg:px-0">
            <CategoryTabs activeCategory="Semua" onSelect={scrollToCategory} />
            <h2 className="mt-8 font-heading text-3xl font-bold text-black">Hasil Pencarian</h2>
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
