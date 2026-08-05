import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import schoolBuildingImg from '../../assets/tentang/school-building.png';
import guruGroupImg from '../../assets/tentang/guru-group.png';

const TentangBottomBannersSection = () => {
  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Banner - Virtual Tour */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-3xl overflow-hidden shadow-card group cursor-pointer min-h-[300px] flex flex-col justify-between p-8 text-white"
          >
            {/* Background image & dark overlay */}
            <img
              src={schoolBuildingImg}
              alt="Virtual Tour"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/50" />

            {/* Content */}
            <div className="relative z-10">
              <span className="text-white/80 text-xs font-semibold uppercase tracking-wider block mb-2">
                Virtual Tour
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-extrabold leading-tight mb-3">
                Jelajahi Sekolah <br />
                Tanpa Batas
              </h3>
              <p className="text-white/80 text-xs sm:text-sm leading-relaxed max-w-xs mb-6">
                Lihat lingkungan sekolah, fasilitas, dan suasana belajar dalam tur virtual 360°.
              </p>
            </div>

            {/* Bottom Row - CTA & Center Play Button */}
            <div className="relative z-10 flex items-center justify-between mt-auto">
              <a
                href="#"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-dark-900 hover:bg-gray-100 font-semibold text-xs rounded-full transition-all duration-300 shadow-md"
              >
                Mulai Tour
                <ArrowRight className="w-3.5 h-3.5 text-primary" />
              </a>

              {/* Big Play button */}
              <div className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                <Play className="w-5 h-5 text-primary ml-0.5" fill="currentColor" />
              </div>
            </div>
          </motion.div>

          {/* Right Banner - PPDB CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="relative rounded-3xl overflow-hidden bg-primary shadow-card flex flex-col justify-between p-8 text-white min-h-[300px]"
          >
            {/* Background student photo */}
            <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-40 lg:opacity-60 overflow-hidden pointer-events-none">
              <img
                src={guruGroupImg}
                alt="Siswa SMK Telkom"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-transparent" />

            {/* Content */}
            <div className="relative z-10 max-w-sm">
              <h3 className="font-heading text-2xl sm:text-3xl font-extrabold leading-tight mb-3">
                Siap Menjadi Bagian <br />
                dari SMK Telkom Purwokerto?
              </h3>
              <p className="text-white/90 text-xs sm:text-sm leading-relaxed mb-6">
                Daftarkan dirimu sekarang dan wujudkan masa depanmu bersama kami!
              </p>
            </div>

            {/* Bottom CTA Button */}
            <div className="relative z-10">
              <a
                href="#ppdb"
                className="inline-flex items-center gap-2.5 px-6 py-3 bg-white text-primary hover:bg-red-50 font-bold text-xs sm:text-sm rounded-full transition-all duration-300 shadow-md hover:scale-105"
              >
                Daftar PPDB Sekarang
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TentangBottomBannersSection;
