import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HalamanHeader from '../components/HalamanHeader';
import Reveal from '../components/Reveal';
import StatusBadge from '../components/dashboard/StatusBadge';
import { galeriDetail, galeriIndex } from '../data/dummyData';

const JEDA = ['', 'delay-100', 'delay-200', 'delay-300'];

const GaleriPage = () => (
  <MainLayout>
    <HalamanHeader {...galeriIndex} />

    <section className="bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {galeriDetail.map((foto, i) => (
          <Reveal key={foto.slug} className={JEDA[i % JEDA.length]}>
            <Link
              to={`/galeri/${foto.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-card transition-transform hover:-translate-y-1"
            >
              <img
                src={foto.image}
                alt={foto.title}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
              />
              <div className="flex flex-1 flex-col px-5 py-4">
                <StatusBadge nilai={foto.kategori} nada="merah" />
                <h2 className="mt-3 font-heading text-sm font-bold leading-snug text-dark-900">
                  {foto.title}
                </h2>
                <p className="mt-1.5 text-[11px] leading-relaxed text-dark-500">{foto.subtitle}</p>
                <p className="mt-auto pt-3 text-[11px] font-bold text-primary">Lihat Detail</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  </MainLayout>
);

export default GaleriPage;
