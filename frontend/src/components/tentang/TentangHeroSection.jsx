import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { heroData } from '../../data/dummyData';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const TentangHeroSection = () => {
  return (
    <section className="relative pt-24 lg:pt-28 pb-8 overflow-hidden bg-white">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-50/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-50/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 text-sm text-dark-500 mb-6"
        >
          {heroData.breadcrumb.map((item, i) => (
            <span key={item.label} className="flex items-center gap-2">
              {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-dark-400" />}
              {i === heroData.breadcrumb.length - 1 ? (
                <span className="text-primary font-semibold">{item.label}</span>
              ) : (
                <Link to={item.href} className="hover:text-primary transition-colors">
                  {item.label}
                </Link>
              )}
            </span>
          ))}
        </motion.nav>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pb-12">
          {/* Left Column - Text */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-5"
          >
            <motion.h1
              variants={itemVariants}
              className="font-heading text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-5xl font-extrabold text-dark-900 leading-[1.08] tracking-tight mb-6"
            >
              Discover <br />
              the Place <br />
              <span className="text-primary">Where Future</span> <br />
              <span className="text-primary">Innovators Grow.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-dark-500 text-sm sm:text-base leading-relaxed mb-8 max-w-md"
            >
              {heroData.description}
            </motion.p>

            <motion.div variants={itemVariants}>
              <a
                href="#tentang-detail"
                className="group inline-flex items-center gap-3 px-6 py-3.5 bg-primary text-white font-semibold text-sm rounded-full hover:bg-primary-800 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
              >
                {heroData.ctaText}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column - Image + Badges */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            className="relative lg:col-span-7"
          >
            {/* Background Red Curve Overlay */}
            <div className="absolute -inset-4 lg:-inset-6 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 rounded-3xl -z-10 opacity-95 transform lg:rotate-1" />

            {/* Content Container */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={heroData.image}
                alt="SMK Telkom Purwokerto"
                className="w-full h-auto aspect-[16/10] object-cover"
              />

              {/* Hashtag tag overlay top right */}
              <div className="absolute top-4 right-4 z-10">
                <span className="inline-flex items-center px-3.5 py-1.5 bg-black/40 backdrop-blur-md text-white text-xs font-medium rounded-full border border-white/20">
                  {heroData.hashtag}
                </span>
              </div>

              {/* Floating feature cards overlay right */}
              <div className="absolute right-4 bottom-6 top-16 flex flex-col justify-center gap-3 z-10 max-w-[210px] hidden sm:flex">
                {heroData.badges.map((badge, i) => (
                  <motion.div
                    key={badge.title}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.15, duration: 0.5 }}
                    className="flex items-center gap-3 bg-white/90 backdrop-blur-md rounded-xl p-3 shadow-lg border border-white/50"
                  >
                    <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                    </div>
                    <div>
                      <p className="font-semibold text-dark-900 text-xs">{badge.title}</p>
                      <p className="text-dark-500 text-[10px]">{badge.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TentangHeroSection;
