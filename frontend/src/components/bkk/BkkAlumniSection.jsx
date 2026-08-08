import { ArrowRight, GraduationCap, Lightbulb } from 'lucide-react';
import { kisahAlumni } from '../../data/dummyData';

const BkkAlumniSection = () => (
  <section className="bg-white py-8 lg:py-12">
    <div className="max-w-7xl mx-auto grid grid-cols-1 gap-5 px-4 sm:px-6 lg:grid-cols-[1fr_26%] lg:px-8">
      {/* Testimoni alumni */}
      <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-card">
        <h2 className="font-heading text-base font-extrabold text-dark-900">{kisahAlumni.title}</h2>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {kisahAlumni.items.map((alum) => (
            <figure
              key={alum.name}
              className="rounded-xl border border-dark-100 bg-white p-4 transition-all hover:-translate-y-1 hover:border-primary"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-50">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </span>
                <figcaption className="min-w-0">
                  <p className="font-heading text-[11px] font-bold text-dark-900">{alum.name}</p>
                  <p className="text-[8px] text-dark-500">{alum.meta}</p>
                  <p className="text-[8px] text-dark-500">{alum.role}</p>
                </figcaption>
              </div>
              <blockquote className="mt-3 text-[9px] italic leading-relaxed text-dark-600">
                “{alum.quote}”
              </blockquote>
            </figure>
          ))}
        </div>
      </div>

      {/* Sumber daya karier */}
      <div className="flex flex-col rounded-2xl border border-dark-100 bg-white p-5 shadow-card">
        <ul className="space-y-4">
          {kisahAlumni.resources.map((item) => (
            <li key={item}>
              <a
                href="#lowongan"
                className="group flex items-center gap-2.5 text-[10px] text-dark-600 transition-colors hover:text-primary"
              >
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-primary/30">
                  <Lightbulb className="h-3.5 w-3.5 text-primary" />
                </span>
                {item}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#lowongan"
          aria-label="Lihat semua sumber daya karier"
          className="mt-auto flex items-center justify-end rounded-lg border border-primary/40 px-4 py-2 text-primary transition-colors hover:bg-primary hover:text-white"
        >
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  </section>
);

export default BkkAlumniSection;
