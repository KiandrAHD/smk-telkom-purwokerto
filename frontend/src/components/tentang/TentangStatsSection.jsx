import { motion } from 'framer-motion';
import { Users, GraduationCap, Building2, Briefcase } from 'lucide-react';
import { aboutStats } from '../../data/dummyData';

const iconMap = {
  users: Users,
  graduationCap: GraduationCap,
  building: Building2,
  briefcase: Briefcase,
};

const TentangStatsSection = () => {
  return (
    <section className="relative -mt-2 z-10 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-card border border-dark-100 p-6 lg:p-8"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {aboutStats.map((stat, i) => {
              const IconComponent = iconMap[stat.icon];
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-heading text-2xl lg:text-3xl font-bold text-dark-900">
                      {stat.value}
                    </p>
                    <p className="text-dark-400 text-sm">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TentangStatsSection;
