import { motion } from 'framer-motion';
import { ArrowRight, Award, CheckCircle, Monitor, Users } from 'lucide-react';
import SectionHeading from './SectionHeading';

const highlights = [
  { icon: Award, label: 'Akreditasi A', desc: 'Terakreditasi BAN-S/M' },
  { icon: Monitor, label: 'Fasilitas Modern', desc: 'Lab komputer, jaringan, multimedia' },
  { icon: Users, label: 'Guru Kompeten', desc: 'Bersertifikasi industri' },
  { icon: CheckCircle, label: 'Kurikulum Industri', desc: 'Berbasis IT & komunikasi' },
];

export default function AboutSection() {
  return (
    <section id="tentang" className="relative py-24 lg:py-32 bg-dark-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-card">
              <div className="aspect-[4/3] bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-heading font-bold text-3xl">SMK</span>
                  </div>
                  <h3 className="font-heading font-bold text-2xl text-dark-900">SMK Telkom Purwokerto</h3>
                  <p className="text-dark-500 mt-2">Berprestasi sejak 2000</p>
                </div>
              </div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center group cursor-pointer transition-all duration-300 hover:bg-black/30">
                <div className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-primary border-b-[12px] border-b-transparent ml-1" />
                </div>
              </div>
            </div>

            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary-100/50 rounded-2xl -z-10" />
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeading
              badge="Tentang Sekolah"
              title="Sekolah Teknologi Informasi Terbaik"
              description="SMK Telkom Purwokerto adalah sekolah menengah kejuruan berbasis Teknologi Informasi dan Komunikasi yang telah berdiri sejak tahun 2000."
              align="left"
            />

            <p className="text-dark-500 leading-relaxed mb-8">
              Kami berkomitmen untuk mencetak generasi muda yang handal di bidang
              teknologi, berkarakter, dan siap bersaing di era digital. Dengan
              dukungan tenaga pengajar profesional dan kurikulum yang selalu
              diperbarui sesuai kebutuhan industri, kami siap membangun masa depan
              cerah bagi siswa-siswi kami.
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-3 p-4 bg-white rounded-xl border border-dark-100"
                >
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-dark-900 text-sm">{item.label}</p>
                    <p className="text-dark-500 text-xs">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="#"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-800 transition-all duration-300 shadow-soft hover:shadow-lg"
            >
              Pelajari Selengkapnya
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}