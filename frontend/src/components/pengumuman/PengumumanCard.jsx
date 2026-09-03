import { ArrowRight, CalendarDays, Info, Trophy, Volume2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { daftarPengumuman } from '../../data/dummyData';

const ikon = {
  megaphone: Volume2,
  kalender: CalendarDays,
  trofi: Trophy,
  info: Info,
};

const Tag = ({ children }) => (
  <span className="rounded bg-primary/20 px-2 py-0.5 font-heading text-[10px] font-extrabold text-primary-800">
    {children}
  </span>
);

const PengumumanCard = ({ item }) => {
  const Ikon = ikon[item.icon] || Info;

  return (
  <article className="flex gap-4 rounded-xl bg-white p-4 shadow-card">
    {/* Warna ikon mengikuti warna bloknya masing-masing. */}
    <span
      className={`hidden h-[92px] w-[86px] flex-shrink-0 items-center justify-center rounded-lg sm:flex ${item.thumb}`}
    >
      <Ikon className={`h-7 w-7 ${item.iconColor}`} />
    </span>

    <div className="flex min-w-0 flex-1 flex-col">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {(item.tags || [item.kategori || 'Pengumuman']).map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-heading text-[10px] font-extrabold text-dark-600">
            <CalendarDays className="h-3 w-3 flex-shrink-0" />
            {item.date}
          </span>
          {item.penting && <Tag>Penting!</Tag>}
        </div>
      </div>

      <div className="mt-3 flex flex-1 flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-sm font-extrabold leading-snug text-dark-900">
            {item.title}
          </h3>
          <p className="mt-1.5 max-w-[24rem] font-heading text-[10px] font-extrabold leading-relaxed text-dark-600">
            {item.desc}
          </p>
        </div>

        <Link
          to={`/pengumuman/${item.slug}`}
          className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-full border border-primary px-3 py-1.5 font-heading text-[10px] font-extrabold text-primary transition-colors hover:bg-primary hover:text-white"
        >
          {daftarPengumuman.detailText}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  </article>
  );
};

export default PengumumanCard;
