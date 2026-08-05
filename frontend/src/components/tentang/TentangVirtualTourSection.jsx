import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';

const TentangVirtualTourSection = () => {
  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 lg:p-12 items-center">
            {/* Left - Text */}
            <div>
              <span className="inline-block px-3 py-1.5 bg-white/10 text-white/90 text-xs font-medium rounded-full mb-4">
                Virtual Tour
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
                Jelajahi Sekolah<br />
                Tanpa Batas
              </h2>
              <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-sm">
                Lihat lingkungan sekolah, fasilitas, dan suasana belajar dalam tur virtual 360°.
              </p>
              <a
                href="#"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-semibold rounded-full hover:bg-primary-50 transition-all duration-300 text-sm shadow-soft"
              >
                Mulai Tour
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Right - Play Button Area */}
            <div className="flex items-center justify-center">
              <div className="relative cursor-pointer group">
                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Play className="w-6 h-6 text-primary ml-1" fill="currentColor" />
                  </div>
                </div>
                {/* Pulse animation */}
                <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TentangVirtualTourSection;
