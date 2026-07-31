import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';

const partners = [
  { name: 'Telkom Indonesia', color: 'bg-red-100' },
  { name: 'Telkomsel', color: 'bg-red-100' },
  { name: 'IndiHome', color: 'bg-blue-100' },
  { name: 'Microsoft', color: 'bg-blue-100' },
  { name: 'Cisco', color: 'bg-blue-100' },
  { name: 'Oracle', color: 'bg-red-100' },
  { name: 'Google', color: 'bg-green-100' },
  { name: 'AWS', color: 'bg-orange-100' },
  { name: 'IBM', color: 'bg-blue-100' },
  { name: 'Dell', color: 'bg-gray-100' },
  { name: 'HP', color: 'bg-blue-100' },
  { name: 'Lenovo', color: 'bg-red-100' },
];

export default function PartnersSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  const duplicatedPartners = [...partners, ...partners, ...partners];

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= partners.length) {
            return 0;
          }
          return prev + 1;
        });
      }, 30);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPaused, partners.length]);

  return (
    <section id="mitra" className="relative py-24 lg:py-32 bg-dark-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Partner Industri"
          title="Mitra Kerja Sama"
          description="Bekerja sama dengan berbagai perusahaan teknologi terkemuka untuk mendukung pembelajaran dan penyaluran lulusan."
        />
      </div>

      {/* Auto Slider */}
      <div
        className="relative mt-8"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="flex gap-8 overflow-hidden">
          <motion.div
            className="flex gap-8"
            animate={{
              x: [0, -1920],
            }}
            transition={{
              x: {
                duration: 30,
                repeat: Infinity,
                ease: 'linear',
              },
            }}
            style={{ display: 'flex', gap: '2rem' }}
          >
            {[...partners, ...partners, ...partners, ...partners].map((partner, i) => (
              <div
                key={`${partner.name}-${i}`}
                className="flex-shrink-0 w-48 h-24 bg-white rounded-xl border border-dark-100 flex items-center justify-center px-6 hover:border-primary-100 hover:shadow-soft transition-all duration-300"
              >
                <div className="w-full h-full flex items-center justify-center">
                  <div className={`w-12 h-12 ${partner.color} rounded-lg flex items-center justify-center`}>
                    <span className="text-dark-700 font-heading font-bold text-xs text-center leading-tight">
                      {partner.name.split(' ').map(w => w[0]).join('')}
                    </span>
                  </div>
                  <span className="ml-3 text-dark-700 font-semibold text-sm whitespace-nowrap">
                    {partner.name}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Gradient overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-dark-50 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-dark-50 to-transparent pointer-events-none" />
      </div>
    </section>
  );
}