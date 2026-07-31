import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function DepartmentCard({ icon: Icon, name, description, image, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
      className="group bg-white rounded-2xl overflow-hidden border border-dark-100 hover:border-primary-100 transition-all duration-300 hover:shadow-card"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary-100 to-dark-100 overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon className="w-16 h-16 text-primary-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4 -mt-10 relative z-10 border-4 border-white">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="font-heading text-xl font-bold text-dark-900 mb-2 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="text-dark-500 text-sm leading-relaxed mb-4 line-clamp-3">
          {description}
        </p>
        <a
          href="#"
          className="inline-flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all"
        >
          Selengkapnya
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </motion.div>
  );
}