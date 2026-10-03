import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../context/LanguageContext';
import { ctaMasukPpdb, navLinks } from '../data/dummyData';
import { isSectionRoute } from '../utils/navigation';

const prefetchByHref = {
  '/profil-sekolah': () => import('../pages/TentangPage'),
  '/profil-sekolah/guru': () => import('../pages/GuruPage'),
  '/jurusan': () => import('../pages/JurusanPage'),
  '/prestasi': () => import('../pages/PrestasiPage'),
  '/bkk': () => import('../pages/BkkPage'),
  '/berita': () => import('../pages/BeritaPage'),
  '/pengumuman': () => import('../pages/PengumumanPage'),
  '/nexttel': () => import('../pages/NextTelPage'),
  '/ppdb': () => import('../pages/ppdb/LoginPage'),
};

const prefetchRoute = (href) => {
  prefetchByHref[href]?.();
};

const Navbar = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isTentangOpen, setIsTentangOpen] = useState(false);
  const headerRef = useRef(null);
  const desktopMenuRef = useRef(null);
  const desktopTriggerRef = useRef(null);
  const mobileTriggerRef = useRef(null);

  useEffect(() => {
    if (!isMobileOpen && !isTentangOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setIsMobileOpen(false);
      setIsTentangOpen(false);
      (isMobileOpen ? mobileTriggerRef : desktopTriggerRef).current?.focus();
    };
    const onPointerDown = (event) => {
      const container = isMobileOpen ? headerRef.current : desktopMenuRef.current;
      if (container?.contains(event.target)) return;
      setIsMobileOpen(false);
      setIsTentangOpen(false);
    };
    const onFocusIn = (event) => {
      if (!isMobileOpen && !desktopMenuRef.current?.contains(event.target)) setIsTentangOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('focusin', onFocusIn);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('focusin', onFocusIn);
    };
  }, [isMobileOpen, isTentangOpen]);

  const isActive = (link) =>
    link.children
      ? link.children.some((child) => isSectionRoute(location.pathname, child.href))
      : isSectionRoute(location.pathname, link.href);

  const currentPage = (href) => location.pathname === href ? 'page' : isSectionRoute(location.pathname, href) ? 'location' : undefined;

  const linkClass = (link) =>
    `relative py-1.5 text-sm font-medium transition-colors ${
      isActive(link) ? 'text-primary' : 'text-dark-600 hover:text-primary'
    }`;

  const activeBar = (link) =>
    isActive(link) ? (
      <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-primary" />
    ) : null;

  return (
    <header ref={headerRef} className="sticky top-0 z-[60] bg-white">
      <nav aria-label={t('Navigasi utama')} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-20 items-center justify-between gap-3">
          {/* Brand */}
          <Link to="/" aria-current={currentPage('/')} className="flex items-center gap-2.5 flex-shrink-0">
            <Logo className="w-9 h-9 lg:w-10 lg:h-10" />
            <span className="font-heading font-extrabold text-dark-900 leading-[1.1] text-[13px] lg:text-[15px]">
              SMK Telkom
              <br />
              Purwokerto
            </span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden xl:flex items-center gap-5">
            {navLinks.map((link) => {
              if (!link.children) {
                return (
                  <Link key={link.label} to={link.href} aria-current={currentPage(link.href)} className={linkClass(link)} onFocus={() => prefetchRoute(link.href)} onMouseEnter={() => prefetchRoute(link.href)}>
                    {t(link.label)}
                    {activeBar(link)}
                  </Link>
                );
              }

              return (
                <div
                  key={link.label}
                  ref={desktopMenuRef}
                  className="relative"
                  onMouseEnter={() => link.children.forEach((child) => prefetchRoute(child.href))}
                >
                  <button
                    type="button"
                    ref={desktopTriggerRef}
                    onClick={() => setIsTentangOpen((open) => !open)}
                    className={`${linkClass(link)} inline-flex items-center gap-1`}
                    aria-expanded={isTentangOpen}
                    aria-controls="desktop-about-links"
                  >
                    {t(link.label)}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform ${isTentangOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                    {activeBar(link)}
                  </button>

                  {isTentangOpen && (
                    <div
                      className="motion-menu-enter absolute left-1/2 top-full z-20 w-48 -translate-x-1/2 rounded-xl border border-dark-100 bg-white p-2"
                      id="desktop-about-links"
                      aria-label={t('Submenu Tentang')}
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          aria-current={currentPage(child.href)}
                          onFocus={() => prefetchRoute(child.href)}
                          onMouseEnter={() => prefetchRoute(child.href)}
                          onClick={() => setIsTentangOpen(false)}
                          className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                            location.pathname === child.href
                              ? 'bg-primary-50 text-primary'
                              : 'text-dark-700 hover:bg-dark-50 hover:text-primary'
                          }`}
                        >
                          {t(child.label)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="ml-auto flex items-center gap-2 xl:ml-0">
            <LanguageToggle />
            <Link
              to={ctaMasukPpdb.href}
              className="hidden xl:inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {t(ctaMasukPpdb.label)}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            ref={mobileTriggerRef}
            onClick={() => setIsMobileOpen((open) => !open)}
            className="xl:hidden flex h-11 w-11 items-center justify-center rounded-lg text-dark-600 hover:bg-dark-50"
            aria-expanded={isMobileOpen}
            aria-controls="mobile-nav"
            aria-label={t(isMobileOpen ? 'Tutup menu' : 'Buka menu')}
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileOpen && (
          <div id="mobile-nav" data-lenis-prevent className="motion-menu-enter max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain lg:max-h-[calc(100dvh-5rem)] xl:hidden border-t border-dark-100 py-4">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                if (!link.children) {
                  return (
                    <Link
                      key={link.label}
                      to={link.href}
                      aria-current={currentPage(link.href)}
                      onFocus={() => prefetchRoute(link.href)}
                      onMouseEnter={() => prefetchRoute(link.href)}
                      onClick={() => setIsMobileOpen(false)}
                      className={`min-h-11 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-dark-50 ${isActive(link) ? 'text-primary' : 'text-dark-700'}`}
                    >
                      {t(link.label)}
                    </Link>
                  );
                }

                return (
                  <div key={link.label}>
                    <button
                      type="button"
                      onClick={() => setIsTentangOpen((open) => !open)}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-dark-700 hover:bg-dark-50"
                      aria-expanded={isTentangOpen}
                      aria-controls="mobile-about-links"
                    >
                      {t(link.label)}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${isTentangOpen ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                      />
                    </button>
                    {isTentangOpen && (
                      <div id="mobile-about-links" className="motion-menu-enter ml-3 border-l border-dark-100 py-1 pl-2">
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            to={child.href}
                            aria-current={currentPage(child.href)}
                            onFocus={() => prefetchRoute(child.href)}
                            onMouseEnter={() => prefetchRoute(child.href)}
                            onClick={() => {
                              setIsTentangOpen(false);
                              setIsMobileOpen(false);
                            }}
                            className="block min-h-11 rounded-lg px-3 py-3 text-sm font-medium text-dark-600 hover:bg-dark-50 hover:text-primary"
                          >
                            {t(child.label)}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <Link
                to={ctaMasukPpdb.href}
                onClick={() => setIsMobileOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {t(ctaMasukPpdb.label)}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
