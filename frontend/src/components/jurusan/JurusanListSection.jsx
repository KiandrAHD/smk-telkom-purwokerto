import { useState } from 'react';
import { ArrowRight, Code2, Gamepad2, Network, RadioTower } from 'lucide-react';
import { Link } from 'react-router-dom';
import { jurusanData, jurusanTags } from '../../data/dummyData';

const icons = { code: Code2, gamepad: Gamepad2, network: Network, tower: RadioTower };

const JurusanListSection = () => {
  const [active, setActive] = useState(0);

  return (
    <section id="daftar-jurusan" className="bg-white py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-dark-900">
          Explore Jurusan Kami
        </h2>

        <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {jurusanData.items.map((item, i) => {
            const Icon = icons[item.icon];
            const isActive = i === active;
            return (
              <article
                key={item.name}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className={`flex flex-col overflow-hidden rounded-2xl border bg-white shadow-card transition-all ${
                  isActive
                    ? '-translate-y-1 border-primary shadow-lg'
                    : 'border-dark-100 hover:border-primary/40'
                }`}
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full aspect-[2/1] object-cover object-top"
                  />
                  <span className="absolute -bottom-4 left-4 flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-md">
                    <Icon className="h-4 w-4 text-white" />
                  </span>
                </div>

                <div className="flex flex-1 flex-col px-4 pb-4 pt-7">
                  <h3 className="font-heading text-[13px] font-bold leading-snug text-primary">
                    {item.name}
                  </h3>
                  <p className="mt-1.5 text-[10px] leading-relaxed text-dark-500">{item.desc}</p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {jurusanTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-dark-50 px-2 py-1 text-[9px] font-bold text-dark-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/jurusan/${item.slug}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold text-primary hover:underline"
                  >
                    Selengkapnya
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default JurusanListSection;
