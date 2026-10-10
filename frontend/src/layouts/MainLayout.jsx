import { useLocation } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StelaWidget from '../components/stela/StelaWidget';
import { useLanguage } from '../context/LanguageContext';

export default function MainLayout({ children, busy = false }) {
  const { pathname } = useLocation();
  const { t } = useLanguage();
  const mainRef = useRef(null);
  const [SmoothScroll, setSmoothScroll] = useState(null);

  useEffect(() => {
    if (SmoothScroll) return;
    const load = () => import('../components/SmoothScroll').then(m => setSmoothScroll(() => m.default));
    if ('requestIdleCallback' in window) requestIdleCallback(load, { timeout: 2000 });
    else setTimeout(load, 1500);
  }, [SmoothScroll]);

  return (
    <div className="min-h-screen bg-white">
      {SmoothScroll && <SmoothScroll />}
      <a href="#main-content" className="sr-only z-[100] rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4" onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        mainRef.current?.focus({ preventScroll: true });
        mainRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
      }}>
        {t('Lewati ke konten utama')}
      </a>
      <Navbar />
      {/* key={pathname} memaksa <main> dipasang ulang tiap pindah route, supaya
          animasi masuknya ikut jalan saat berpindah antar halaman detail yang
          memakai komponen yang sama (mis. /berita/a -> /berita/b). */}
      <main ref={mainRef} id="main-content" tabIndex={-1} aria-busy={busy || undefined} key={pathname} className="animate-masuk-halaman scroll-mt-24">
        {children}
      </main>
      <Footer />
      {!busy && <StelaWidget />}
    </div>
  );
}
