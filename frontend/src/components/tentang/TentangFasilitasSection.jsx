import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { fasilitasData } from '../../data/dummyData';

const TentangFasilitasSection = () => {
  return (
    <section className="py-14 lg:py-18 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <h2 className="font-heading text-2xl lg:text-3xl font-extrabold text-dark-900">
            Fasilitas Kami
          </h2>
          <a
            href="#"
            className="group inline-flex items-center gap-1.5 text-primary font-bold text-xs sm:text-sm hover:text-primary-800 transition-colors"
          >
            Lihat Semua
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>

        {/* Facilities Grid with Left/Right Arrows */}
        <div className="relative">
          {/* Left Arrow Button */}
          <button
            aria-label="Previous facility"
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-gray-200 shadow-md rounded-full flex items-center justify-center text-dark-600 hover:text-primary hover:border-primary transition-all duration-200 hidden sm:flex"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow Button */}
          <button
            aria-label="Next facility"
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-gray-200 shadow-md rounded-full flex items-center justify-center text-dark-600 hover:text-primary hover:border-primary transition-all duration-200 hidden sm:flex"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {fasilitasData.map((fasilitas, i) => (
              <motion.div
                key={fasilitas.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="group cursor-pointer"
              >
                <div className="relative rounded-2xl overflow-hidden mb-3 shadow-soft group-hover:shadow-md transition-shadow duration-300">
                  <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                      src={fasilitas.image}
                      alt={fasilitas.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <p className="font-heading font-bold text-dark-800 text-xs sm:text-sm text-center group-hover:text-primary transition-colors">
                  {fasilitas.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TentangFasilitasSection;
