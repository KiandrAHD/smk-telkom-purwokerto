import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import DepartmentCard from './DepartmentCard';
import watermark from '../assets/landing/telkom-accent.png';
import { jurusanData } from '../data/dummyData';

// Posisi relatif dari frame Figma 78:3, area aksen y=1243..2170.
// Aset 119:95 sudah diputar 90 derajat; rotasi di sini adalah selisihnya.
const accentPositions = [
  '-left-[11.33cqh] top-0 -rotate-90',
  'left-[11.97cqh] top-0',
  '-left-[11.14cqh] top-[21.252%] rotate-[0.44deg]',
  '-left-[11.33cqh] top-[44.521%] rotate-[90.47deg]',
  '-right-[1.34cqh] top-[15.102%] rotate-[0.44deg]',
  '-right-[1.17cqh] top-[38.372%] rotate-[90.47deg]',
  '-right-[1.21cqh] top-[61.525%] rotate-[90.6deg]',
  'right-[22.06cqh] top-[61.273%] rotate-[-179.36deg]',
];

const DepartmentsSection = () => (
  <section id="jurusan" className="relative overflow-hidden bg-white py-8 lg:py-12">
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden overflow-hidden [container-type:size] 2xl:block">
      {accentPositions.map((position) => (
        <img
          key={position}
          src={watermark}
          alt=""
          className={`absolute size-[25.134cqh] select-none object-contain ${position}`}
        />
      ))}
    </div>

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
