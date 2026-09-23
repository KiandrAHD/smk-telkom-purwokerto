import { useState } from 'react';
import { ArrowRight, LockKeyhole, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { ctaMasukPpdb, navLinks } from '../data/dummyData';

const Navbar = () => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (link) =>
    location.pathname === link.href || location.pathname.startsWith(`${link.href}/`);

  const linkClass = (link) =>
    `relative py-1.5 text-sm font-medium transition-colors ${
      isActive(link) ? 'text-primary' : 'text-dark-600 hover:text-primary'
    }`;

  const activeBar = (link) =>
    isActive(link) ? (
      <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-primary" />
    ) : null;

  return (
    <header className="sticky top-0 z-50 bg-white">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-20 items-center justify-between gap-6">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <Logo className="w-9 h-9 lg:w-10 lg:h-10" />
            <span className="font-heading font-extrabold text-dark-900 leading-[1.1] text-[13px] lg:text-[15px]">
              SMK Telkom
              <br />
              Purwokerto
            </span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden lg:flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link key={link.label} to={link.href} className={linkClass(link)}>
                  {link.label}
                  {activeBar(link)}
                </Link>
              ))}
            </div>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-dark-500 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <LockKeyhole className="h-3 w-3" aria-hidden="true" />
              Login Admin
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <Link
              to={ctaMasukPpdb.href}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {ctaMasukPpdb.label}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setIsMobileOpen((open) => !open)}
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-lg text-dark-600 hover:bg-dark-50"
            aria-label={isMobileOpen ? 'Tutup menu' : 'Buka menu'}
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileOpen && (
          <div className="lg:hidden border-t border-dark-100 py-4">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-dark-700 hover:bg-dark-50"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 border-t border-dark-100 pt-3">
                <Link
                  to="/login"
                  onClick={() => setIsMobileOpen(false)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-dark-600 transition-colors hover:bg-dark-50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <LockKeyhole className="h-4 w-4" aria-hidden="true" />
                  Login Admin
                </Link>
              </div>
              <Link
                to={ctaMasukPpdb.href}
                onClick={() => setIsMobileOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {ctaMasukPpdb.label}
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
