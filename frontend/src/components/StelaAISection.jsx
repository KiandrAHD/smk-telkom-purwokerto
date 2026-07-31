import { motion } from 'framer-motion';
import { Bot, Send, Sparkles } from 'lucide-react';
import SectionHeading from './SectionHeading';

const chatBubbles = [
  {
    text: 'Halo! Apa saja jurusan di SMK Telkom Purwokerto?',
    isUser: true,
  },
  {
    text: 'Ada 4 jurusan unggulan: RPL, TKJ, Multimedia, dan Sistem Informasi. Semua jurusan berbasis TI! 🚀',
    isUser: false,
  },
  {
    text: 'Bagaimana cara mendaftar PPDB?',
    isUser: true,
  },
  {
    text: 'Pendaftaran dilakukan secara online melalui website resmi. Saya bisa bantu panduannya!',
    isUser: false,
  },
];

export default function StelaAISection() {
  return (
    <section id="stela" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-950" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeading
              badge="STELA AI"
              title="Asisten Cerdas SMK Telkom"
              description="STELA (SMK Telkom Intelligent Assistant) adalah asisten berbasis AI yang siap membantu Anda 24/7."
              light
              align="left"
            />

            <p className="text-gray-300 leading-relaxed mb-8">
              Tanyakan apa saja tentang SMK Telkom Purwokerto. Mulai dari informasi
              pendaftaran, jurusan, fasilitas, hingga kegiatan sekolah. STELA akan
              menjawab dengan cepat dan akurat.
            </p>

            <a
              href="#"
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary-800 transition-all duration-300 shadow-soft hover:shadow-lg hover:scale-105 active:scale-95"
            >
              <Bot className="w-5 h-5" />
              Tanya STELA Sekarang
              <Sparkles className="w-4 h-4" />
            </a>

            {/* Features */}
            <div className="flex flex-wrap gap-4 mt-10">
              {['24/7 Online', 'Jawaban Cepat', 'Informasi Akurat', 'Mudah Digunakan'].map((feature) => (
                <span
                  key={feature}
                  className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 text-sm rounded-full"
                >
                  {feature}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Chat Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Chat Window */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
              {/* Chat Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-4">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">STELA AI</p>
                  <p className="text-gray-400 text-xs flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Online
                  </p>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="space-y-4 mb-4">
                {chatBubbles.map((bubble, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2, duration: 0.3 }}
                    className={`flex ${bubble.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        bubble.isUser
                          ? 'bg-primary text-white rounded-br-md'
                          : 'bg-white/10 text-gray-200 rounded-bl-md'
                      }`}
                    >
                      {bubble.text}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                <input
                  type="text"
                  placeholder="Ketik pertanyaanmu..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                  readOnly
                />
                <button className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center hover:bg-primary-800 transition-colors">
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-500/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary-500/10 rounded-full blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}