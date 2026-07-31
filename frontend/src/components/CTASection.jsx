import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-primary">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
        {/* Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255,255,255,0.2) 1px, transparent 0)',
          backgroundSize: '50px 50px',
        }} />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white/90 text-sm font-medium rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Segera Daftar!
          </motion.span>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-[1.1]">
            Siap Bergabung dengan{' '}
            <span className="text-white/90">SMK Telkom Purwokerto?</span>
          </h2>

          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-10">
            Daftarkan dirimu sekarang dan jadilah bagian dari generasi teknologi
            handal yang siap bersaing di era digital.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#ppdb"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-primary font-semibold rounded-full hover:bg-primary-50 transition-all duration-300 shadow-soft hover:shadow-lg hover:scale-105 active:scale-95"
            >
              Daftar PPDB Sekarang
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#tentang"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-full border-2 border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              Pelajari Lebih Lanjut
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}