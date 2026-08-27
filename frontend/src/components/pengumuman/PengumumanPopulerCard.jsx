import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { pengumumanPopuler } from '../../data/dummyData';

const PengumumanPopulerCard = () => (
  <div className="rounded-xl bg-white p-4 shadow-card">
    <div className="flex items-center justify-between gap-3">
      <h2 className="font-heading text-[17px] font-extrabold text-dark-900">
        {pengumumanPopuler.title}
      </h2>
      <Link
        to="/pengumuman/populer"
        className="inline-flex items-center gap-2 rounded-lg border-2 border-[#bf0d1b] px-3 py-1.5 font-heading text-[14px] font-extrabold text-[#c72b37] transition-colors hover:bg-primary hover:text-white"
      >
        {pengumumanPopuler.linkText}
        <ArrowRight className="h-3 w-3" />
      </Link>
    </div>

    <ul className="mt-5 space-y-7">
      {pengumumanPopuler.items.map((item, i) => (
        <li key={item.title}>
          <Link to={`/pengumuman/${item.slug}`} className="flex items-start gap-4">
            <span
              className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full font-heading text-[2rem] font-bold ${item.badge}`}
            >
              {i + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-heading text-[17px] font-extrabold leading-snug text-dark-900">
                {item.title}
              </span>
              <span className="mt-1.5 flex flex-wrap items-center gap-2.5 font-heading text-[15px] font-extrabold text-dark-900/[0.68]">
                {item.date}
                <span className="h-[6px] w-[6px] rounded-full bg-[#525252]" />
                {item.views}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default PengumumanPopulerCard;
