import { useState } from 'react';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';
import { hallOfFame, perjalananPrestasi } from '../../data/dummyData';

const PER_PAGE = 4;

const PrestasiPerjalananSection = () => {
  const [year, setYear] = useState(perjalananPrestasi.defaultYear);
  const [start, setStart] = useState(0);

  const move = (step) =>
    setStart((s) => (s + step + hallOfFame.items.length) % hallOfFame.items.length);
  const shown = Array.from(
    { length: PER_PAGE },
    (_, i) => hallOfFame.items[(start + i) % hallOfFame.items.length]
  );

  return (
    <section className="bg-white py-8 lg:py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-[38%_1fr] lg:gap-10 lg:px-8">
        {/* Perjalanan Prestasi */}
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-dark-900">
            {perjalananPrestasi.title}
          </h2>

          <div className="mt-6 flex items-end gap-2">
            {perjalananPrestasi.years.map((y) => {
              const on = y.year === year;
              return (
                <button
                  key={y.year}
                  type="button"
                  onClick={() => setYear(y.year)}
                  aria-pressed={on}
                  className="flex flex-1 flex-col items-center gap-1.5"
                >
                  <span
                    className={`text-[10px] font-semibold transition-colors ${
                      on ? 'text-primary' : 'text-dark-400'
                    }`}
                  >
                    {y.year}
                  </span>
                  <span
                    className={`flex w-full flex-col items-center rounded-xl border py-3 transition-all ${
                      on
                        ? 'scale-105 border-primary bg-white shadow-card'
                        : 'border-dark-100 bg-white hover:border-primary/40'
                    }`}
                  >
                    <span
                      className={`font-heading text-lg font-extrabold ${
                        on ? 'text-primary' : 'text-dark-900'
                      }`}
                    >
                      {y.count}
                    </span>
                    <span
                      className={`text-[8px] ${on ? 'text-primary' : 'text-dark-400'}`}
                    >
                      {y.label}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hall of Fame */}
        <div className="relative">
          <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-dark-900">
            {hallOfFame.title}
          </h2>

          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Alumni sebelumnya"
            className="absolute -left-3 top-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-dark-100 bg-white text-dark-500 shadow-md transition-colors hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Alumni berikutnya"
            className="absolute -right-3 top-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-dark-100 bg-white text-dark-500 shadow-md transition-colors hover:text-primary"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {shown.map((person) => (
              <article
                key={person.name}
                className="rounded-xl border border-dark-100 bg-white p-3 text-center shadow-card"
              >
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-dark-200">
                  <User className="h-6 w-6 text-dark-400" />
                </span>
                <h3 className="mt-2.5 font-heading text-[10px] font-bold text-dark-900">
                  {person.name}
                </h3>
                <p className="mt-1 text-[8px] leading-snug text-dark-500">{person.achievement}</p>
                <div className="mt-2.5 flex items-center gap-1.5 border-t border-dark-100 pt-2 text-left">
                  <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-primary">
                    <User className="h-2.5 w-2.5 text-white" />
                  </span>
                  <span className="min-w-0 text-[8px] leading-tight text-dark-600">
                    {person.role}
                    <br />
                    {person.company}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrestasiPerjalananSection;
