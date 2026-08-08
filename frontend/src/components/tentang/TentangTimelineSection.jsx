import { useState } from 'react';
import { Award, Building2, Cpu, Handshake, MonitorSmartphone } from 'lucide-react';
import { timelineData } from '../../data/dummyData';

const icons = [Building2, Award, Handshake, MonitorSmartphone, Cpu];

const TentangTimelineSection = () => {
  const [active, setActive] = useState(0);

  return (
    <section id="perjalanan" className="bg-white py-6 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-xl font-extrabold text-primary">Perjalanan Kami</h2>

        <ol className="relative mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
          {/* Garis putus-putus penghubung (desktop) */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 top-[4.25rem] hidden border-t border-dashed border-dark-200 lg:block"
          />

          {timelineData.map((item, i) => {
            const Icon = icons[i] ?? Building2;
            const isActive = i === active;
            return (
              <li key={item.year} className="relative">
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  aria-current={isActive ? 'step' : undefined}
                  className="w-full text-left"
                >
                  <p
                    className={`font-heading text-2xl font-extrabold transition-colors ${
                      isActive ? 'text-primary' : 'text-dark-900'
                    }`}
                  >
                    {item.year}
                  </p>

                  <span
                    className={`relative z-10 mt-3 flex h-9 w-9 items-center justify-center rounded-lg transition-all ${
                      isActive ? 'scale-110 bg-primary' : 'bg-primary/85'
                    }`}
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </span>

                  <h3 className="mt-3 font-heading text-xs font-bold text-dark-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 max-w-[15rem] text-[10px] leading-relaxed text-dark-500">
                    {item.desc}
                  </p>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

export default TentangTimelineSection;
