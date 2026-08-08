import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { projectShowcase } from '../../data/dummyData';

const JurusanShowcaseSection = () => {
  const items = projectShowcase.items;
  const [start, setStart] = useState(0);

  // Geser satu kartu; indeks berputar supaya panah tidak pernah jadi jalan buntu.
  const move = (step) => setStart((s) => (s + step + items.length) % items.length);
  const ordered = items.map((_, i) => items[(start + i) % items.length]);

  return (
    <section className="bg-white py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-dark-900">
          {projectShowcase.title}{' '}
          <span className="text-primary">{projectShowcase.titleAccent}</span>{' '}
          {projectShowcase.titleTail}
        </h2>

        <div className="relative mt-7">
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Project sebelumnya"
            className="absolute -left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-dark-100 bg-white text-dark-600 shadow-md transition-colors hover:text-primary lg:-left-5"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Project berikutnya"
            className="absolute -right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-dark-100 bg-white text-dark-600 shadow-md transition-colors hover:text-primary lg:-right-5"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ordered.map((item) => (
              <article
                key={item.tag}
                className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-card transition-transform hover:-translate-y-1"
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.title.replace('\n', ' ')}
                    className="w-full aspect-[16/10] object-cover"
                  />
                  <span
                    className={`absolute bottom-2 left-2 rounded px-2 py-1 text-[9px] font-bold text-white ${item.tagClass}`}
                  >
                    {item.tag}
                  </span>
                </div>
                <h3 className="whitespace-pre-line px-4 py-3 font-heading text-xs font-bold leading-snug text-dark-900">
                  {item.title}
                </h3>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {items.map((item, i) => (
            <button
              key={item.tag}
              type="button"
              onClick={() => setStart(i)}
              aria-label={`Mulai dari project ${item.tag}`}
              aria-current={i === start}
              className={`h-2 rounded-full transition-all ${
                i === start ? 'w-5 bg-primary' : 'w-2 bg-dark-200 hover:bg-dark-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default JurusanShowcaseSection;
