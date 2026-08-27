import { ArrowRight, Megaphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { daftarPengumuman } from '../../data/dummyData';

const Tag = ({ children }) => (
  <span className="rounded-lg bg-primary/20 px-[7px] py-[2px] font-heading text-[17px] font-extrabold text-[#9b0011]">
    {children}
  </span>
);

const PengumumanCard = ({ item }) => (
  <article className="flex gap-5 rounded-xl bg-white p-6 shadow-card">
    {/* Thumbnail di Figma memang blok warna polos — hanya kartu pertama yang berikon. */}
    <span
      className={`hidden h-[148px] w-[137px] flex-shrink-0 items-center justify-center rounded-lg sm:flex ${item.thumb}`}
    >
      {item.icon && <Megaphone className="h-12 w-12 text-primary" />}
    </span>

    <div className="flex min-w-0 flex-1 flex-col">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2.5">
          {item.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <span className="font-heading text-[14px] font-extrabold text-dark-900/[0.68]">
            {item.date}
          </span>
          {item.penting && <Tag>Penting!</Tag>}
        </div>
      </div>

      <div className="mt-4 flex flex-1 flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-[17px] font-extrabold leading-snug text-dark-900">
            {item.title}
          </h3>
          <p className="mt-2 max-w-[27rem] font-heading text-[14px] font-extrabold leading-relaxed text-dark-900/[0.68]">
            {item.desc}
          </p>
        </div>

        <Link
          to={`/pengumuman/${item.slug}`}
          className="inline-flex flex-shrink-0 items-center gap-2 rounded-lg border-2 border-[#bf0d1b] px-4 py-2.5 font-heading text-[14px] font-extrabold text-primary transition-colors hover:bg-primary hover:text-white"
        >
          {daftarPengumuman.detailText}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  </article>
);

export default PengumumanCard;
