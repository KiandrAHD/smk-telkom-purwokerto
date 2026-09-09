import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import DepartmentCard from './DepartmentCard';
import watermark from '../assets/landing/telkom-accent.png';
import { jurusanData } from '../data/dummyData';

const DepartmentsSection = () => (
  <section id="jurusan" className="relative overflow-hidden bg-white py-8 lg:py-12">
    {/* Watermark logo dekoratif */}
    <img
      src={watermark}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute left-2 top-4 hidden w-40 rotate-180 select-none object-contain 2xl:block"
    />
    <img
      src={watermark}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute right-2 top-12 hidden w-40 select-none object-contain 2xl:block"
    />
    <img
      src={watermark}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute bottom-12 left-2 hidden w-40 -rotate-90 select-none object-contain 2xl:block"
    />
    <img
      src={watermark}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute bottom-4 right-2 hidden w-40 rotate-90 select-none object-contain 2xl:block"
    />

    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <p className="text-center text-xs font-bold text-primary">
        {jurusanData.eyebrow}
      </p>
      <h2 className="mt-2 text-center font-heading text-2xl sm:text-3xl font-extrabold text-dark-900">
        {jurusanData.title}
      </h2>

      <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {jurusanData.items.map((item) => (
          <DepartmentCard key={item.name} {...item} />
        ))}
      </div>

      <div className="mt-7 flex justify-center">
        <Link
          to="/jurusan"
          className="inline-flex items-center gap-2 rounded-full border border-dark-200 bg-white px-6 py-2.5 text-xs font-semibold text-dark-700 transition-colors hover:border-primary hover:text-primary"
        >
          {jurusanData.ctaText}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  </section>
);

export default DepartmentsSection;
