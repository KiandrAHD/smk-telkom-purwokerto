import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function FeatureCard({ icon: Icon, title, description, href, index = 0 }) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
      className="group relative bg-white rounded-2xl p-8 border border-dark-100 hover:border-primary-100 transition-all duration-300 hover:shadow-card hover:-translate-y-1"
    >
      <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary transition-all duration-300">
        <Icon className="w-7 h-7 text-primary group-hover:text-white transition-all duration-300" />
      </div>
      <h3 className="font-heading text-xl font-bold text-dark-900 mb-3 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-dark-500 text-sm leading-relaxed mb-4">
        {description}
      </p>
      <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
        <span>Selengkapnya</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </div>
    </motion.a>
  );
}