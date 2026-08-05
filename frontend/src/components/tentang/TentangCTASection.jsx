import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const TentangCTASection = () => {
  return (
    <section className="py-16 lg:py-20 bg-primary">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Background pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative text-center"
        >
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
            Siap Menjadi Bagian<br />
            dari SMK Telkom Purwokerto?
          </h2>
          <p className="text-white/80 text-sm lg:text-base max-w-lg mx-auto mb-8">
            Daftarkan dirimu sekarang dan wujudkan masa depanmu bersama kami!
          </p>
          <a
            href="#ppdb"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-primary font-semibold rounded-full hover:bg-primary-50 transition-all duration-300 shadow-soft hover:shadow-lg hover:scale-105 active:scale-95"
          >
            Daftar PPDB Sekarang
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default TentangCTASection;
