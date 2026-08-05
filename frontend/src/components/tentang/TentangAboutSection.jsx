import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { aboutDescription } from '../../data/dummyData';
import schoolImg from '../../assets/tentang/school-building.png';

const TentangAboutSection = () => {
  return (
    <section id="tentang-detail" className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gray-100/70 border border-gray-200/80 rounded-3xl p-8 lg:p-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Left - Text */}
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-dark-900 leading-tight mb-6">
                Tentang<br />
                <span className="text-primary">SMK Telkom Purwokerto</span>
              </h2>
              <p className="text-dark-500 leading-relaxed mb-8 text-sm sm:text-base">
                {aboutDescription.text}
              </p>
              <a
                href="#"
                className="group inline-flex items-center gap-2 px-6 py-2.5 border border-dark-300 hover:border-primary text-dark-800 hover:text-primary font-semibold rounded-full bg-white transition-all duration-300 text-xs sm:text-sm shadow-sm"
              >
                {aboutDescription.ctaText}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Right - Video Container */}
            <div className="relative rounded-2xl overflow-hidden shadow-card cursor-pointer group">
              <img
                src={schoolImg}
                alt="Profil Sekolah Video"
                className="w-full aspect-[16/10] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                <div className="w-14 h-14 lg:w-16 lg:h-16 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-6 h-6 text-primary ml-1" fill="currentColor" />
                </div>
              </div>

              {/* Bottom overlay badge */}
              <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2.5 bg-primary text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg">
                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 text-white ml-0.5" fill="white" />
                </div>
                <span>Play Video &nbsp;•&nbsp; Profil Sekolah</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TentangAboutSection;
