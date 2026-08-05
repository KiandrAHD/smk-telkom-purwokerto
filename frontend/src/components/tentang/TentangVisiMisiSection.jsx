import { motion } from 'framer-motion';
import { Eye, Target, Lightbulb, Shield, Cpu, Handshake } from 'lucide-react';
import { visiMisi, nilaiStematel } from '../../data/dummyData';

const nilaiIconMap = {
  lightbulb: Lightbulb,
  shield: Shield,
  cpu: Cpu,
  handshake: Handshake,
};

const TentangVisiMisiSection = () => {
  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left - Visi & Misi */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-2xl lg:text-3xl font-bold text-dark-900 mb-8">
              Visi & Misi
            </h2>

            <div className="space-y-4">
              {/* Visi Card */}
              <div className="bg-white rounded-2xl border border-dark-100 p-6 shadow-soft hover:shadow-card transition-shadow duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Eye className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-dark-900 text-lg mb-2">Visi</h3>
                    <p className="text-dark-500 text-sm leading-relaxed">{visiMisi.visi}</p>
                  </div>
                </div>
              </div>

              {/* Misi Card */}
              <div className="bg-white rounded-2xl border border-dark-100 p-6 shadow-soft hover:shadow-card transition-shadow duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-dark-900 text-lg mb-2">Misi</h3>
                    <p className="text-dark-500 text-sm leading-relaxed">{visiMisi.misi}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Nilai-Nilai Stematel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-2xl lg:text-3xl font-bold text-dark-900 mb-8">
              Nilai-Nilai Stematel
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {nilaiStematel.map((nilai, i) => {
                const IconComponent = nilaiIconMap[nilai.icon];
                return (
                  <motion.div
                    key={nilai.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="bg-white rounded-2xl border border-dark-100 p-5 shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mb-3">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-heading font-bold text-dark-900 text-sm mb-1">{nilai.title}</h3>
                    <p className="text-dark-400 text-xs leading-relaxed">{nilai.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TentangVisiMisiSection;
