import { motion } from 'framer-motion';

export default function SectionHeading({
  badge,
  title,
  description,
  align = 'center',
  light = false,
}) {
  const alignment =
    align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`max-w-2xl ${alignment} mb-12 lg:mb-16`}
    >
      {badge && (
        <span
          className={`inline-block px-4 py-2 text-sm font-medium rounded-full mb-4 ${
            light ? 'bg-white/10 text-white' : 'bg-primary-50 text-primary-700'
          }`}
        >
          {badge}
        </span>
      )}
      <h2
        className={`font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 ${
          light ? 'text-white' : 'text-dark-900'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`text-lg ${light ? 'text-gray-300' : 'text-dark-500'}`}>
          {description}
        </p>
      )}
    </motion.div>
  );
}