import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { useLenis } from 'lenis/react';

const positions = new Map();

// Posisi milik history entry, bukan pathname. Search-only updates tidak
// menggeser fokus, dan Back menunggu tinggi konten setelah data selesai dimuat.
const ScrollToTop = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const previousRef = useRef(null);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);

  useEffect(() => { lenisRef.current = lenis; }, [lenis]);

  useEffect(() => {
    const remember = () => {
      // A route commit can shrink the old document before effect cleanup.
      // Ignore that clamp once history already points at another entry.
      if ((window.history.state?.key || 'default') !== location.key) return;
      positions.set(location.key, window.scrollY);
      if (positions.size > 100) positions.delete(positions.keys().next().value);
    };
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    window.addEventListener('scroll', remember, { passive: true });
    document.addEventListener('pointerdown', remember, true);
    document.addEventListener('keydown', remember, true);
    return () => {
      window.removeEventListener('scroll', remember);
      document.removeEventListener('pointerdown', remember, true);
      document.removeEventListener('keydown', remember, true);
      window.history.scrollRestoration = previous;
    };
  }, [location.key]);

  useEffect(() => {
    const previous = previousRef.current;
    previousRef.current = location;
    const replay = previous?.key === location.key;
    if (!replay && previous?.pathname === location.pathname && (previous.hash === location.hash || previous.search !== location.search)) {
      positions.set(location.key, window.scrollY);
      return undefined;
    }
    // Native fragment navigation may reuse the current history key. Follow the
    // new anchor; only an actual return or unchanged effect replay restores it.
    const fragmentNavigation = replay && previous.pathname === location.pathname && previous.hash !== location.hash;
    const returning = navigationType === 'POP' && positions.has(location.key) && !fragmentNavigation;
    const savedTop = returning ? positions.get(location.key) : 0;
    let stopped = false;
    let frame;
    let focused = false;

    const scroll = (target) => {
      let top = typeof target === 'number' ? target : -96;
      // Layout offsets avoid counting CSS scroll-margin or reveal transforms
      // twice when Lenis receives an element target.
      if (typeof target !== 'number') {
        for (let node = target; node; node = node.offsetParent) top += node.offsetTop;
      }
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.resize();
        lenis.scrollTo(Math.max(0, top), { immediate: true, force: true });
      } else window.scrollTo({ top: Math.max(0, top), left: 0, behavior: 'instant' });
    };
    const followContent = () => {
      if (stopped) return;
      let id = location.hash.slice(1);
      try { id = decodeURIComponent(id); } catch { /* Invalid fragments remain safe. */ }
      const main = [...document.querySelectorAll('main')].find((node) => node.getClientRects().length);
      const target = id && !returning ? [...document.querySelectorAll('[id]')].find((node) => node.id === id && node.getClientRects().length) : null;
      if (id && !returning && !target) return;
      const heading = main?.querySelector('h1');
      if (previous && !replay && !returning && !focused && heading?.getClientRects().length && !id) {
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
        focused = true;
      }
      if (main?.getAttribute('aria-busy') === 'true' || [...(main?.querySelectorAll('[aria-busy="true"]') || [])].some((node) => node.getClientRects().length)) return;
      // Async data can take longer than a fixed timeout. Keep observing until
      // content is ready, or the user takes control of scrolling/focus.
      if (!main && [...document.querySelectorAll('[role="status"]')].some((node) => node.getClientRects().length)) return;
      scroll(target || savedTop);
      stop();
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(followContent);
    };
    const root = document.getElementById('root');
    const mutations = new MutationObserver(schedule);
    const resize = new ResizeObserver(schedule);
    if (root) {
      mutations.observe(root, { childList: true, subtree: true });
      resize.observe(root);
    }
    const events = ['wheel', 'pointerdown', 'touchstart', 'keydown'];
    const stop = () => {
      stopped = true;
      cancelAnimationFrame(frame);
      mutations.disconnect();
      resize.disconnect();
      events.forEach((event) => window.removeEventListener(event, stop));
    };
    events.forEach((event) => window.addEventListener(event, stop, { passive: true }));
    schedule();
    return stop;
  }, [location, navigationType]);

  return null;
};

export default ScrollToTop;
