import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import DepartmentCard from './DepartmentCard';
import SectionAccents from './SectionAccents';
import { jurusanData } from '../data/dummyData';

const DepartmentsSection = () => (
  <section id="jurusan" className="relative overflow-hidden bg-white py-8 lg:py-12">
    <SectionAccents variant="departments" />

    <div className="relative mx-auto max-w-[1546px] px-4 sm:px-6 lg:px-8">
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
