import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

export default function AchievementCard({ title, category, description, image, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
      className="group bg-white rounded-2xl overflow-hidden border border-dark-100 hover:border-primary-100 transition-all duration-300 hover:shadow-card hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary-100 to-yellow-100 overflow-hidden">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Trophy className="w-16 h-16 text-yellow-400" />
          </div>
        )}
        {/* Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary-700 text-xs font-semibold rounded-full">
            {category}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-heading text-lg font-bold text-dark-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-dark-500 text-sm leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>
    </motion.div>
  );
}