import { ArrowRight } from 'lucide-react';
import { pklData } from '../../data/dummyData';

const BkkPklSection = () => (
  <section id="pkl" className="bg-white py-8 lg:py-12">
    <div className="max-w-7xl mx-auto grid grid-cols-1 gap-5 px-4 sm:px-6 lg:grid-cols-[1fr_26%] lg:px-8">
      {/* Kartu PKL */}
      <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-card">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {pklData.items.map((pkl) => (
            <article
              key={pkl.role}
              className="flex flex-col rounded-xl border border-dark-100 bg-white p-4 transition-all hover:-translate-y-1 hover:border-primary"
            >
              <img
                src={pkl.logo}
                alt={pkl.company}
                className="h-7 w-auto max-w-[6rem] self-start object-contain"
              />
              <h3 className="mt-3.5 font-heading text-xs font-bold text-dark-900">{pkl.role}</h3>
              <p className="mt-1 text-[9px] text-dark-500">{pkl.company}</p>
              <p className="text-[9px] text-dark-500">{pkl.location}</p>
              <p className="mt-3 text-[10px] font-bold text-primary">{pkl.kuota}</p>
              <p className="mt-0.5 text-[9px] text-primary">{pkl.kota}</p>
              <a
                href="#pkl"
                className="mt-3.5 inline-flex items-center justify-center gap-1.5 rounded-lg border border-dark-200 px-2.5 py-1.5 text-[8px] font-bold text-dark-500 transition-colors hover:border-primary hover:text-primary"
              >
                {pklData.ctaText}
                <ArrowRight className="h-2 w-2" />
              </a>
            </article>
          ))}
        </div>
      </div>

      {/* Ajakan tanya STELA */}
      <div className="flex flex-col items-center rounded-2xl bg-primary-100 px-5 py-6 text-center">
        <h2 className="whitespace-pre-line font-heading text-[11px] font-extrabold leading-snug text-primary-900">
          {pklData.stela.title}
        </h2>
        <img
          src={pklData.stela.mascot}
          alt=""
          aria-hidden="true"
          className="mt-4 h-28 w-28 rounded-full object-cover"
        />
        <a
          href="#stela"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-[11px] font-bold text-white transition-colors hover:bg-primary-800"
        >
          {pklData.stela.ctaText}
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  </section>
);

export default BkkPklSection;
