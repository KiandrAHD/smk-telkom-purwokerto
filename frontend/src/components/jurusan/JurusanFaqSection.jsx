import { useState } from 'react';
import { ArrowRight, Plus } from 'lucide-react';
import stelaCard from '../../assets/landing/stela-card.jpg';
import { jurusanFaq, stelaData } from '../../data/dummyData';

const JurusanFaqSection = () => {
  const [open, setOpen] = useState(null);

  return (
    <section id="faq-jurusan" className="bg-white py-8 lg:py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_40%] lg:px-8">
        {/* Akordeon FAQ */}
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-primary">
            {jurusanFaq.title} <span className="text-dark-900">{jurusanFaq.titleAccent}</span>
          </h2>

          <div className="mt-6 space-y-3">
            {jurusanFaq.items.map((item, i) => {
              const isOpen = i === open;
              return (
                <div
                  key={item.q}
                  className={`rounded-xl border bg-white transition-colors ${
                    isOpen ? 'border-primary' : 'border-dark-200'
                  }`}
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
                    >
                      <span className="text-xs font-medium text-dark-800">{item.q}</span>
                      <Plus
                        className={`h-4 w-4 flex-shrink-0 text-primary transition-transform ${
                          isOpen ? 'rotate-45' : ''
                        }`}
                      />
                    </button>
                  </h3>
                  {isOpen && (
                    <p
                      id={`faq-panel-${i}`}
                      className="border-t border-dark-100 px-4 py-3 text-[11px] leading-relaxed text-dark-500"
                    >
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <a
            href="#faq-jurusan"
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
          >
            {jurusanFaq.ctaText}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Kartu STELA — potongan kiri dari aset kartu penuh, sesuai crop di Figma */}
        <div className="relative overflow-hidden rounded-2xl">
          <img
            src={stelaCard}
            alt=""
            aria-hidden="true"
            className="h-full min-h-[10rem] w-full object-cover object-left"
          />
          <span className="sr-only">
            {stelaData.title.replace('\n', ' ')}. {stelaData.description}
          </span>
        </div>
      </div>
    </section>
  );
};

export default JurusanFaqSection;
