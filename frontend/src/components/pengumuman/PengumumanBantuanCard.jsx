import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { butuhBantuan } from '../../data/dummyData';

const PengumumanBantuanCard = () => (
  <div className="relative min-h-[330px] overflow-hidden rounded-xl bg-[#ffc9ce] p-4 shadow-card">
    <h2 className="font-heading text-[1.6rem] font-extrabold text-[#bf0d1b]">
      {butuhBantuan.title}
    </h2>
    <p className="mt-2 max-w-[19rem] font-heading text-[17px] font-extrabold leading-snug text-dark-900/[0.68]">
      {butuhBantuan.description}
    </p>

    <Link
      to="/stela"
      className="relative z-10 mt-7 inline-flex items-center gap-3 rounded-lg bg-white px-4 py-2.5 font-heading text-[17px] font-extrabold text-primary shadow-sm transition-colors hover:bg-primary-50"
    >
      {butuhBantuan.ctaText}
      <ArrowRight className="h-4 w-4" />
    </Link>

    <img
      src={butuhBantuan.mascot}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0 right-0 w-[177px] select-none object-contain"
    />
  </div>
);

export default PengumumanBantuanCard;
