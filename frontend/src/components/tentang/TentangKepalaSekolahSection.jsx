import { motion } from 'framer-motion';
import { ArrowRight, Mail, Quote } from 'lucide-react';
import { kepalaSekolah, guruData } from '../../data/dummyData';

const LinkedInIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

const TentangKepalaSekolahSection = () => {
  return (
    <section className="py-16 lg:py-20 bg-dark-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left - Kepala Sekolah */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-2xl lg:text-3xl font-bold text-dark-900 mb-8">
              Kepala Sekolah
            </h2>

            <div className="bg-white rounded-2xl border border-dark-100 p-6 lg:p-8 shadow-soft">
              {/* Quote */}
              <div className="mb-6">
                <Quote className="w-10 h-10 text-primary/20 mb-3" />
                <p className="text-dark-600 text-sm lg:text-base leading-relaxed italic">
                  {kepalaSekolah.quote}
                </p>
              </div>

              {/* Profile */}
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={kepalaSekolah.image}
                  alt={kepalaSekolah.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
                />
                <div>
                  <p className="font-heading font-bold text-dark-900 text-sm">
                    {kepalaSekolah.name}
                  </p>
                  <p className="text-dark-400 text-xs">{kepalaSekolah.title}</p>
                </div>
              </div>

              <a
                href="#"
                className="group inline-flex items-center gap-2 text-primary font-semibold text-sm hover:text-primary-800 transition-colors"
              >
                {kepalaSekolah.ctaText}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>

          {/* Right - Guru & Tenaga Pendidik */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading text-2xl lg:text-3xl font-bold text-dark-900">
                Guru & Tenaga Pendidik
              </h2>
              <a
                href="#"
                className="group inline-flex items-center gap-1 text-primary font-semibold text-sm hover:text-primary-800 transition-colors"
              >
                Lihat Semua
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {guruData.map((guru, i) => (
                <motion.div
                  key={guru.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="bg-white rounded-2xl border border-dark-100 overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 group"
                >
                  {/* Photo */}
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={guru.image}
                      alt={guru.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <p className="font-heading font-bold text-dark-900 text-sm truncate">
                      {guru.name}
                    </p>
                    <p className="text-dark-400 text-xs mb-3 truncate">{guru.position}</p>
                    <div className="flex items-center gap-2">
                      <a
                        href={guru.linkedin}
                        className="w-7 h-7 bg-dark-50 rounded-lg flex items-center justify-center text-dark-400 hover:bg-primary hover:text-white transition-all duration-200"
                      >
                        <LinkedInIcon className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`mailto:${guru.email}`}
                        className="w-7 h-7 bg-dark-50 rounded-lg flex items-center justify-center text-dark-400 hover:bg-primary hover:text-white transition-all duration-200"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TentangKepalaSekolahSection;
