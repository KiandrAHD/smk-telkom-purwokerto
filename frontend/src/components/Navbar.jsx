import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import useScrollPosition from '../hooks/useScrollPosition';

const navLinks = [
  { name: 'Tentang', href: '/tentang', isRoute: true },
  { name: 'Jurusan', href: '#jurusan' },
  { name: 'Prestasi', href: '#prestasi' },
  { name: 'BKK', href: '#bkk' },
];

const menuVariants = {
  closed: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
  open: {
    opacity: 1,
    height: 'auto',
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
};

const itemVariants = {
  closed: { opacity: 0, x: -20 },
  open: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.3, ease: 'easeOut' },
  }),
};

export default function Navbar() {
  const { isScrolled } = useScrollPosition();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const hashLinks = navLinks.filter((link) => !link.isRoute);
      const sections = hashLinks.map((link) => link.href.slice(1));
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (currentSection) {
        setActiveSection(`#${currentSection}`);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-lg shadow-nav'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
              <span className="text-white font-heading font-bold text-sm leading-none">
                SMK
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="font-heading font-bold text-sm text-dark-900 leading-tight">
                SMK Telkom
              </p>
              <p className="font-heading font-semibold text-[10px] text-dark-500 leading-tight">
                Purwokerto
              </p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    location.pathname === link.href
                      ? 'text-primary'
                      : 'text-dark-600 hover:text-dark-900'
                  }`}
                >
                  {link.name}
                  {location.pathname === link.href && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeSection === link.href
                      ? 'text-primary'
                      : 'text-dark-600 hover:text-dark-900'
                  }`}
                >
                  {link.name}
                  {activeSection === link.href && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              )
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="#ppdb"
              onClick={(e) => handleNavClick(e, '#ppdb')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-800 transition-all duration-300 shadow-soft hover:shadow-lg hover:scale-105 active:scale-95"
            >
              Masuk PPDB
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-lg text-dark-600 hover:text-dark-900 hover:bg-dark-50 transition-colors duration-200"
            aria-label={isMobileOpen ? 'Tutup menu' : 'Buka menu'}
          >
            {isMobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-16 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto py-6 px-4">
                  <div className="space-y-1">
                    {navLinks.map((link, i) => (
                      link.isRoute ? (
                        <motion.div
                          key={link.name}
                          custom={i}
                          variants={itemVariants}
                          initial="closed"
                          animate="open"
                          exit="closed"
                        >
                          <Link
                            to={link.href}
                            onClick={() => setIsMobileOpen(false)}
                            className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                              location.pathname === link.href
                                ? 'bg-primary-50 text-primary'
                                : 'text-dark-700 hover:bg-dark-50 hover:text-dark-900'
                            }`}
                          >
                            {link.name}
                          </Link>
                        </motion.div>
                      ) : (
                        <motion.a
                          key={link.name}
                          href={link.href}
                          onClick={(e) => handleNavClick(e, link.href)}
                          custom={i}
                          variants={itemVariants}
                          initial="closed"
                          animate="open"
                          exit="closed"
                          className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                            activeSection === link.href
                              ? 'bg-primary-50 text-primary'
                              : 'text-dark-700 hover:bg-dark-50 hover:text-dark-900'
                          }`}
                        >
                          {link.name}
                        </motion.a>
                      )
                    ))}
                  </div>

                  <div className="mt-6 px-4">
                    <a
                      href="#ppdb"
                      onClick={(e) => handleNavClick(e, '#ppdb')}
                      className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-primary text-white text-base font-semibold rounded-full hover:bg-primary-800 transition-all duration-300 shadow-soft"
                    >
                      Masuk PPDB
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 border-t border-dark-100">
                  <p className="text-xs text-dark-400 text-center">
                    &copy; 2026 SMK Telkom Purwokerto
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}