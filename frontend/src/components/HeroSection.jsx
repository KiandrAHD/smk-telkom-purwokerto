import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, GraduationCap, Building2, Award, Users } from 'lucide-react';

const stats = [
  { icon: Users, value: '2200+', label: 'Siswa Aktif' },
  { icon: GraduationCap, value: '98%', label: 'Lulusan Bekerja' },
  { icon: Building2, value: '120+', label: 'Mitra Industri' },
  { icon: Award, value: '15+', label: 'Prestasi Nasional' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const statCardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 0.6 + i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen pt-20 lg:pt-0 overflow-hidden bg-gradient-to-br from-white via-dark-50 to-white">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-100/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-50/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen flex flex-col lg:flex-row items-center gap-12 lg:gap-16 py-20 lg:py-0">
          {/* Left Column */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 text-center lg:text-left pt-8 lg:pt-0"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-100 rounded-full mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-primary-700 text-sm font-medium">
                #1 SMK Teknologi di Purwokerto
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={itemVariants}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-dark-900 leading-[1.1] tracking-tight mb-6"
            >
              Cetak Generasi{' '}
              <span className="text-primary relative inline-block">
                Teknologi
                <svg className="absolute -bottom-2 left-0 right-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M0 6C70 0 180 0 300 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-primary-200" />
                </svg>
              </span>{' '}
              Handal & Berkarakter
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-dark-500 text-lg lg:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8"
            >
              Bergabunglah dengan SMK Telkom Purwokerto, sekolah kejuruan berbasis
              Teknologi Informasi dan Komunikasi dengan kurikulum industri terkini
              dan fasilitas modern.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            >
              <a
                href="#ppdb"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary-800 transition-all duration-300 shadow-soft hover:shadow-lg hover:scale-105 active:scale-95"
              >
                Masuk PPDB
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#jurusan"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-dark-700 font-semibold rounded-full border-2 border-dark-200 hover:border-primary hover:text-primary transition-all duration-300 hover:shadow-soft"
              >
                Lihat Jurusan
                <ChevronDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column - Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            className="flex-1 w-full max-w-lg lg:max-w-none"
          >
            <div className="relative">
              {/* Main Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-card">
                <img
                  src="/src/assets/hero.png"
                  alt="SMK Telkom Purwokerto"
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                      <div class="w-full aspect-[4/3] bg-gradient-to-br from-primary-100 to-primary-50 rounded-2xl flex items-center justify-center">
                        <div class="text-center p-8">
                          <div class="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span class="text-white font-heading font-bold text-2xl">SMK</span>
                          </div>
                          <h3 class="font-heading font-bold text-2xl text-dark-900">SMK Telkom Purwokerto</h3>
                          <p class="text-dark-500 mt-2">Sekolah TI Terbaik</p>
                        </div>
                      </div>
                    `;
                  }}
                />
                {/* Overlay badge */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-soft">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-dark-900 font-semibold text-sm">Akreditasi A</p>
                    <p className="text-dark-500 text-xs">Terakreditasi BAN-S/M</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="relative -mt-10 lg:-mt-20 pb-20 lg:pb-16"
        >
          <div className="bg-white rounded-2xl shadow-card border border-dark-100 p-6 lg:p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  custom={i}
                  variants={statCardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="text-center lg:text-left"
                >
                  <div className="flex items-center gap-3 mb-2 justify-center lg:justify-start">
                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-heading text-2xl lg:text-3xl font-bold text-dark-900">
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-dark-500 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}