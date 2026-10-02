import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLenis } from 'lenis/react';

// Router tidak mengembalikan posisi scroll saat berpindah halaman. Tanpa ini,
// klik dari tengah halaman mendarat di tengah halaman berikutnya.
// Instance Lenis baru juga memicu efek ini setelah route lazy selesai dimuat.
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    let target = 0;
    if (hash) {
      let id = hash.slice(1);
      try { id = decodeURIComponent(id); } catch { /* Hash tidak valid tetap aman. */ }
      target = document.getElementById(id);
      if (!target) return;
    }

    if (lenis) {
      // Hapus momentum, termasuk saat tujuan lama sudah sama dengan target.
      lenis.stop();
      lenis.start();
      lenis.scrollTo(target, { immediate: !hash, force: true });
    } else if (target) {
      target.scrollIntoView({ block: 'start', behavior: 'instant' });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }

    if (!hash) return undefined;
    const main = target.closest('main') ?? target;
    let height = main.clientHeight;
    const observer = new ResizeObserver(() => {
      if (main.clientHeight === height) return;
      height = main.clientHeight;
      if (lenis) {
        lenis.resize();
        lenis.scrollTo(target, { immediate: true, force: true });
      } else target.scrollIntoView({ block: 'start', behavior: 'instant' });
    });
    observer.observe(main);
    const events = ['wheel', 'pointerdown', 'touchstart', 'keydown'];
    const stopFollowing = () => {
      observer.disconnect();
      events.forEach((event) => window.removeEventListener(event, stopFollowing));
    };
    events.forEach((event) => window.addEventListener(event, stopFollowing, { passive: true }));
    return stopFollowing;
  }, [pathname, hash, lenis]);

  return null;
};

export default ScrollToTop;
