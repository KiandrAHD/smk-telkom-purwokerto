import { motion } from 'framer-motion';
import { Building2, Award, Handshake, Monitor, Cpu } from 'lucide-react';
import { timelineData } from '../../data/dummyData';

const milestoneIcons = [Building2, Award, Handshake, Monitor, Cpu];

const TentangTimelineSection = () => {
  return (
    <section className="py-14 lg:py-18 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-heading text-2xl lg:text-3xl font-extrabold text-dark-900 mb-10">
            Perjalanan Kami
          </h2>
        </motion.div>

        {/* Timeline - Horizontal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
          {timelineData.map((item, i) => {
            const IconComp = milestoneIcons[i % milestoneIcons.length];
            return (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white border border-gray-200/70 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 relative group"
              >
                {/* Icon box */}
                <div className="w-10 h-10 bg-red-50 text-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                  <IconComp className="w-5 h-5" />
                </div>

                <p className="font-heading text-xl lg:text-2xl font-extrabold text-dark-900 mb-1">
                  {item.year}
                </p>
                <h3 className="font-heading font-bold text-dark-800 text-sm mb-1.5">
                  {item.title}
                </h3>
                <p className="text-dark-500 text-xs leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TentangTimelineSection;
