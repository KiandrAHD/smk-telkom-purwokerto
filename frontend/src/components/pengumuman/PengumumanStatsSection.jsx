import { AlarmClock, CalendarCheck, CalendarDays, Volume2 } from 'lucide-react';
import { pengumumanStats } from '../../data/dummyData';

const ikon = {
  megaphone: Volume2,
  kalender: CalendarDays,
  alarm: AlarmClock,
  agenda: CalendarCheck,
};

const PengumumanStatsSection = () => (
  <section className="bg-white py-4 lg:py-6">
    <div className="max-w-7xl mx-auto grid grid-cols-1 gap-5 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
      {pengumumanStats.map((stat) => {
        const Ikon = ikon[stat.icon];
        return (
        <div key={stat.label} className="rounded-2xl bg-white p-5 shadow-card">
          <div className="flex items-center gap-4">
            <span className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
              <Ikon className="h-6 w-6 text-primary" />
            </span>
            <p className="font-heading text-[1.75rem] font-extrabold leading-none text-dark-900">
              {stat.value}
            </p>
          </div>

          <p className="mt-4 font-heading text-xs font-bold text-dark-900">{stat.label}</p>
          <p className="mt-1.5 font-heading text-[11px] font-bold text-dark-900/[0.58]">
            {stat.desc}
          </p>
        </div>
        );
      })}
    </div>
  </section>
);

export default PengumumanStatsSection;
