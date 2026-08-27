import { Megaphone } from 'lucide-react';
import { pengumumanStats } from '../../data/dummyData';

const PengumumanStatsSection = () => (
  <section className="bg-white py-6 lg:py-8">
    <div className="max-w-7xl mx-auto grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
      {pengumumanStats.map((stat) => (
        <div key={stat.label} className="rounded-2xl bg-white p-6 shadow-card">
          <div className="flex items-center gap-5">
            {/* Hanya kartu pertama yang berikon di Figma; sisanya lingkaran kosong. */}
            <span className="flex h-[82px] w-[82px] flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
              {stat.icon && <Megaphone className="h-9 w-9 text-primary" />}
            </span>
            <p className="font-heading text-[2.8rem] font-extrabold leading-none text-dark-900">
              {stat.value}
            </p>
          </div>

          <p className="mt-5 font-heading text-[17px] font-bold text-dark-900">{stat.label}</p>
          <p className="mt-2 font-heading text-[17px] font-bold text-dark-900/[0.58]">
            {stat.desc}
          </p>
        </div>
      ))}
    </div>
  </section>
);

export default PengumumanStatsSection;
