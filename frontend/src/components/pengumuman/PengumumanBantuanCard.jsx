import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { butuhBantuan } from '../../data/dummyData';

const PengumumanBantuanCard = () => (
  <div className="relative min-h-[210px] overflow-hidden rounded-xl bg-primary-200 p-4 shadow-card">
    <h2 className="font-heading text-base font-extrabold text-primary-800">
      {butuhBantuan.title}
    </h2>
    <p className="mt-1.5 max-w-[13rem] font-heading text-[10px] font-extrabold leading-snug text-dark-900/[0.68]">
      {butuhBantuan.description}
    </p>

    <Link
      to="/stela"
      className="relative z-10 mt-5 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 font-heading text-[11px] font-extrabold text-primary shadow-sm transition-colors hover:bg-primary-50"
    >
      {butuhBantuan.ctaText}
      <ArrowRight className="h-3.5 w-3.5" />
    </Link>

    <img
      src={butuhBantuan.mascot}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute bottom-3 right-3 w-[112px] select-none object-contain"
    />
  </div>
);

export default PengumumanBantuanCard;
