import MainLayout from '../layouts/MainLayout';
import HalamanHeader from '../components/HalamanHeader';
import Reveal from '../components/Reveal';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { faqLengkap } from '../data/dummyData';

const JurusanFaqPage = () => (
  <MainLayout>
    <HalamanHeader {...faqLengkap} />

    <section className="bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-10">
        {faqLengkap.kelompok.map((kelompok, k) => (
          <Reveal key={kelompok.nama} className={k === 0 ? '' : 'delay-100'}>
            <h2 className="flex items-center gap-3 font-heading text-lg font-extrabold text-dark-900">
              <span aria-hidden="true" className="h-5 w-1 rounded-full bg-primary" />
              {kelompok.nama}
            </h2>

            <div className="mt-4 space-y-3">
              {/* <details> bawaan browser: buka-tutup, dukungan papan ketik, dan
                  pencarian Ctrl+F sudah ditangani tanpa satu baris JavaScript. */}
              {kelompok.items.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border border-dark-100 bg-white px-5 py-4 shadow-card transition-colors open:border-primary/40"
                >
                  <summary className="flex list-none items-center justify-between gap-4 font-heading text-xs font-bold text-dark-900 marker:hidden sm:text-sm">
                    {item.q}
                    <ChevronDown className="h-4 w-4 flex-shrink-0 text-primary transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-xs leading-relaxed text-dark-500">{item.a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        ))}

        <Reveal>
          <div className="rounded-2xl bg-primary px-6 py-6 text-center text-white">
            <p className="font-heading text-sm font-extrabold">Masih ada yang ingin ditanyakan?</p>
            <p className="mt-1.5 text-xs text-white/80">
              STELA siap menjawab pertanyaanmu seputar jurusan kapan saja.
            </p>
            <Link
              to="/stela"
              className="mt-4 inline-flex rounded-full bg-white px-6 py-2.5 text-xs font-bold text-primary transition-transform hover:-translate-y-0.5"
            >
              Tanya STELA
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  </MainLayout>
);

export default JurusanFaqPage;
