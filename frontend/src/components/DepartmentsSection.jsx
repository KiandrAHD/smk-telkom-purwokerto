import { motion } from 'framer-motion';
import { Code, Network, Camera, Monitor } from 'lucide-react';
import SectionHeading from './SectionHeading';
import DepartmentCard from './DepartmentCard';

const departments = [
  {
    icon: Code,
    name: 'Rekayasa Perangkat Lunak',
    description: 'Belajar pengembangan aplikasi web, mobile, dan desktop. Menguasai berbagai bahasa pemrograman dan framework terkini.',
  },
  {
    icon: Network,
    name: 'Teknik Komputer & Jaringan',
    description: 'Mendalami jaringan komputer, administrasi server, keamanan jaringan, dan infrastruktur TI.',
  },
  {
    icon: Camera,
    name: 'Multimedia',
    description: 'Kreatif dalam desain grafis, animasi, video editing, fotografi, dan produksi konten digital.',
  },
  {
    icon: Monitor,
    name: 'Sistem Informasi',
    description: 'Mengelola database, sistem informasi perusahaan, dan analisis data untuk kebutuhan bisnis.',
  },
];

export default function DepartmentsSection() {
  return (
    <section id="jurusan" className="relative py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Program Keahlian"
          title="Pilih JurusanImpianmu"
          description="Empat jurusan unggulan berbasis Teknologi Informasi dan Komunikasi yang siap membentuk karir masa depanmu."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {departments.map((dept, i) => (
            <DepartmentCard
              key={dept.name}
              icon={dept.icon}
              name={dept.name}
              description={dept.description}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}