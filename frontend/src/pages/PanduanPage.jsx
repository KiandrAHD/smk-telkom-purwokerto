import { Link } from 'react-router-dom';
import { ArrowRight, FileText } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import HalamanHeader from '../components/HalamanHeader';
import Reveal from '../components/Reveal';
import { panduanDetail, panduanIndex } from '../data/dummyData';

const JEDA = ['', 'delay-100', 'delay-200', 'delay-300'];

const PanduanPage = () => (
  <MainLayout>
    <HalamanHeader {...panduanIndex} />

    <section className="bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2">
        {panduanDetail.map((panduan, i) => (
          <Reveal key={panduan.slug} className={JEDA[i % JEDA.length]}>
            <Link
              to={`/bkk/panduan/${panduan.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-dark-100 bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:border-primary"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary">
                <FileText className="h-5 w-5" />
              </span>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-wide text-primary">
                {panduan.kategori}
              </p>
              <h2 className="mt-1.5 font-heading text-base font-extrabold leading-snug text-dark-900">
                {panduan.title}
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-dark-500">{panduan.lead}</p>
              <span className="mt-auto flex items-center gap-1.5 pt-5 text-[11px] font-bold text-primary">
                Baca Panduan
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  </MainLayout>
);

export default PanduanPage;
