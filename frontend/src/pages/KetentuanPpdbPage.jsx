import { ArrowRight, Check } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import HalamanHeader from '../components/HalamanHeader';
import Reveal from '../components/Reveal';
import { ketentuanPpdb, ppdbMeta } from '../data/dummyData';

const KetentuanPpdbPage = () => (
  <MainLayout>
    <HalamanHeader
      eyebrow={ketentuanPpdb.eyebrow}
      title={ketentuanPpdb.title}
      deskripsi={ketentuanPpdb.deskripsi}
    />

    <section className="bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="text-[11px] text-dark-400">{ketentuanPpdb.diperbarui}</p>

        <div className="mt-6 space-y-6">
          {ketentuanPpdb.bagian.map((bagian, i) => (
            <Reveal key={bagian.judul} className={i % 2 ? 'delay-100' : ''}>
              <div className="rounded-2xl border border-dark-100 bg-white p-6 shadow-card">
                <h2 className="flex items-center gap-3 font-heading text-sm font-extrabold text-dark-900">
                  <span aria-hidden="true" className="h-5 w-1 rounded-full bg-primary" />
                  {i + 1}. {bagian.judul}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {bagian.butir.map((butir) => (
                    <li key={butir} className="flex gap-3 text-xs leading-relaxed text-dark-600">
                      <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />
                      {butir}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-primary px-6 py-5 text-white">
          <p className="text-xs">{ketentuanPpdb.kontakTeks}</p>
          <a
            href={ppdbMeta.waHelpdesk}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-[11px] font-bold text-primary transition-transform hover:-translate-y-0.5"
          >
            {ketentuanPpdb.kontakCta}
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  </MainLayout>
);

export default KetentuanPpdbPage;
