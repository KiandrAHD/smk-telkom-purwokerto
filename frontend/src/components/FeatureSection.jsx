import { motion } from 'framer-motion';
import { ClipboardList, BookOpen, Briefcase, Bot } from 'lucide-react';
import FeatureCard from './FeatureCard';

const features = [
  {
    icon: ClipboardList,
    title: 'PPDB',
    description: 'Daftar sekarang! Proses pendaftaran peserta didik baru secara online mudah dan cepat.',
    href: '#ppdb',
  },
  {
    icon: BookOpen,
    title: 'Jurusan',
    description: 'Empat jurusan unggulan berbasis Teknologi Informasi dan Komunikasi terkini.',
    href: '#jurusan',
  },
  {
    icon: Briefcase,
    title: 'BKK',
    description: 'Bursa Kerja Khusus yang menghubungkan lulusan dengan mitra industri terpercaya.',
    href: '#bkk',
  },
  {
    icon: Bot,
    title: 'STELA AI',
    description: 'Asisten AI cerdas yang siap menjawab pertanyaan seputar SMK Telkom Purwokerto.',
    href: '#stela',
  },
];

export default function FeatureSection() {
  return (
    <section id="layanan" className="relative py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 bg-primary-50 text-primary-700 text-sm font-medium rounded-full mb-4">
            Layanan Kami
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-900 mb-4">
            Akses Cepat Informasi
          </h2>
          <p className="text-dark-500 text-lg">
            Temukan informasi yang Anda butuhkan dengan cepat dan mudah melalui layanan digital kami.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, i) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              href={feature.href}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}