import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import navbarLogo from '../assets/landing/beranda-navbar-logo.png';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../context/LanguageContext';
import { ctaMasukPpdb, navLinks } from '../data/dummyData';
import { isSectionRoute } from '../utils/navigation';

const prefetchByHref = {
  '/fasilitas': () => import('../pages/FasilitasPage'),
  '/profil-sekolah': () => import('../pages/TentangPage'),
  '/profil-sekolah/guru': () => import('../pages/GuruPage'),
  '/ekstrakurikuler': () => import('../pages/EkstrakurikulerPage'),
  '/jurusan': () => import('../pages/JurusanPage'),
  '/prestasi': () => import('../pages/PrestasiPage'),
  '/bkk': () => import('../pages/BkkPage'),
  '/berita': () => import('../pages/BeritaPage'),
  '/pengumuman': () => import('../pages/PengumumanPage'),
  '/nexttel': () => import('../pages/NextTelPage'),
  '/spmb': () => import('../pages/ppdb/LoginPage'),
  '/spmb/masuk': () => import('../pages/ppdb/LoginPage'),
};

const prefetchRoute = (href) => {
  prefetchByHref[href]?.()?.catch(() => {}); // RouteErrorBoundary handles failures when navigating.
};

const Navbar = () => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const headerRef = useRef(null);
  const desktopMenuRef = useRef(null);
  const desktopTriggerRef = useRef(null);
  const mobileTriggerRef = useRef(null);

  useEffect(() => {
    if (!isMobileOpen && !openDropdown) return undefined;
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setIsMobileOpen(false);
      setOpenDropdown(null);
      (isMobileOpen ? mobileTriggerRef : desktopTriggerRef).current?.focus();
    };
    const onPointerDown = (event) => {
      const container = isMobileOpen ? headerRef.current : desktopMenuRef.current;
      if (container?.contains(event.target)) return;
      setIsMobileOpen(false);
      setOpenDropdown(null);
    };
    const onFocusIn = (event) => {
      if (!isMobileOpen && !desktopMenuRef.current?.contains(event.target)) setOpenDropdown(null);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('focusin', onFocusIn);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('focusin', onFocusIn);
    };
  }, [isMobileOpen, openDropdown]);

  const navLabel = (link) => t(language === 'en' && link.label === 'Jurusan' ? 'Navigasi jurusan' : link.label);

  const isActive = (link) =>
    link.children
      ? link.children.some((child) => isSectionRoute(location.pathname, child.href))
      : isSectionRoute(location.pathname, link.href);

  const currentPage = (href) => location.pathname === href ? 'page' : isSectionRoute(location.pathname, href) ? 'location' : undefined;

  const linkClass = (link) =>
    `relative whitespace-nowrap py-1.5 text-sm font-semibold tracking-[0.12em] transition-colors ${
      isActive(link) ? 'text-primary' : 'text-dark-600 hover:text-primary'
    }`;

  const activeBar = (link) =>
    isActive(link) ? (
      <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-primary" />
    ) : null;

  return (
    <header ref={headerRef} className="sticky top-0 z-[60] w-full bg-white font-sans">
      <nav aria-label={t('Navigasi utama')} className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-[2.625rem]">
        <div className="flex h-16 lg:h-20 items-center justify-between gap-3 xl:grid xl:grid-cols-[auto_1fr_auto]">
          {/* Brand */}
          <Link to="/" aria-current={currentPage('/')} className="flex items-center gap-2.5 flex-shrink-0">
            <img src={navbarLogo} alt="SMK Telkom Purwokerto" width={257} height={74} className="h-auto w-40 object-contain lg:w-[11.25rem]" />
          </Link>

          {/* Desktop menu */}
          <div className="hidden xl:ml-16 xl:flex items-center gap-6">
            {navLinks.map((link) => {
              if (!link.children) {
                return (
                  <Link key={link.label} to={link.href} aria-current={currentPage(link.href)} className={linkClass(link)} onClick={() => setOpenDropdown(null)} onFocus={() => prefetchRoute(link.href)} onMouseEnter={() => prefetchRoute(link.href)}>
                    {navLabel(link)}
                    {activeBar(link)}
                  </Link>
                );
              }

              return (
                <div
                  key={link.label}
                  ref={openDropdown === link.label ? desktopMenuRef : undefined}
                  className="relative"
                  onMouseEnter={() => link.children.forEach((child) => prefetchRoute(child.href))}
                >
                  <button
                    type="button"
                    ref={openDropdown === link.label ? desktopTriggerRef : undefined}
                    onClick={() => setOpenDropdown((open) => open === link.label ? null : link.label)}
                    className={`${linkClass(link)} inline-flex items-center gap-1`}
                    aria-expanded={openDropdown === link.label}
                    aria-controls={`desktop-${link.label.toLowerCase()}-links`}
                  >
                    {navLabel(link)}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform ${openDropdown === link.label ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                    {activeBar(link)}
                  </button>

                  {openDropdown === link.label && (
                    <div
                      className="motion-menu-enter absolute left-1/2 top-full z-20 w-48 -translate-x-1/2 rounded-xl border border-dark-100 bg-white p-2"
                      id={`desktop-${link.label.toLowerCase()}-links`}
                      aria-label={t(`Submenu ${link.label}`)}
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          aria-current={currentPage(child.href)}
                          onFocus={() => prefetchRoute(child.href)}
                          onMouseEnter={() => prefetchRoute(child.href)}
                          onClick={() => setOpenDropdown(null)}
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
            onClick={() => { setIsMobileOpen((open) => !open); setOpenDropdown(null); }}
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
                      onClick={() => { setIsMobileOpen(false); setOpenDropdown(null); }}
                      className={`min-h-11 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-dark-50 ${isActive(link) ? 'text-primary' : 'text-dark-700'}`}
                    >
                      {navLabel(link)}
                    </Link>
                  );
                }

                return (
                  <div key={link.label}>
                    <button
                      type="button"
                      onClick={() => setOpenDropdown((open) => open === link.label ? null : link.label)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-dark-50 ${isActive(link) ? 'text-primary' : 'text-dark-700'}`}
                      aria-expanded={openDropdown === link.label}
                      aria-controls={`mobile-${link.label.toLowerCase()}-links`}
                    >
                      {navLabel(link)}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${openDropdown === link.label ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                      />
                    </button>
                    {openDropdown === link.label && (
                      <div id={`mobile-${link.label.toLowerCase()}-links`} className="motion-menu-enter ml-3 border-l border-dark-100 py-1 pl-2">
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            to={child.href}
                            aria-current={currentPage(child.href)}
                            onFocus={() => prefetchRoute(child.href)}
                            onMouseEnter={() => prefetchRoute(child.href)}
                            onClick={() => {
                              setOpenDropdown(null);
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
