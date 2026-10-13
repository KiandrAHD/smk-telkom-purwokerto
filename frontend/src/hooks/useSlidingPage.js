import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

// A decorative snapshot keeps the outgoing page visible while React renders the next one.
export default function useSlidingPage(pageKey) {
  const viewport = useRef(null);
  const pending = useRef(null);
  const animation = useRef(null);

  const goTo = (next, current, commit) => {
    if (next === current || pending.current) return;
    const node = viewport.current;
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      commit(next);
      return;
    }
    const snapshot = node.firstElementChild.cloneNode(true);
    snapshot.removeAttribute('id');
    snapshot.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
    snapshot.setAttribute('aria-hidden', 'true');
    snapshot.inert = true;
    snapshot.dataset.motionOutgoing = '';
    gsap.set(snapshot, { position: 'absolute', inset: '0 auto auto 0', width: node.clientWidth, pointerEvents: 'none' });
    node.appendChild(snapshot);
    pending.current = { snapshot, direction: next > current ? 1 : -1 };
    commit(next);
  };

  useLayoutEffect(() => {
    const state = pending.current;
    if (!state) return;
    const node = viewport.current;
    const incoming = node.firstElementChild;
    node.style.minHeight = `${Math.max(node.clientHeight, state.snapshot.offsetHeight)}px`;
    gsap.set(incoming, { x: state.direction * node.clientWidth, willChange: 'transform' });
    const images = [...incoming.querySelectorAll('img')];
    images.forEach(image => { image.loading = 'eager'; });
    Promise.allSettled(images.map(image => image.decode())).then(() => {
      if (pending.current !== state || !viewport.current) return;
      animation.current = gsap.timeline({ onComplete: () => {
        state.snapshot.remove();
        gsap.set(incoming, { clearProps: 'transform,willChange' });
        pending.current = null;
        animation.current = null;
      } })
        .to(state.snapshot, { x: -state.direction * node.clientWidth, duration: 0.5, ease: 'power3.out', force3D: true }, 0)
        .to(incoming, { x: 0, duration: 0.5, ease: 'power3.out', force3D: true }, 0);
    });
  }, [pageKey]);

  useEffect(() => {
    const node = viewport.current;
    const finish = () => {
      animation.current?.progress(1);
      if (pending.current) {
        pending.current.snapshot.remove();
        gsap.set(node.firstElementChild, { clearProps: 'transform,willChange' });
        pending.current = null;
      }
      node.style.minHeight = '';
    };
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reduce = () => { if (media.matches) finish(); };
    window.addEventListener('resize', finish);
    media.addEventListener('change', reduce);
    return () => {
      window.removeEventListener('resize', finish);
      media.removeEventListener('change', reduce);
      animation.current?.kill();
      pending.current?.snapshot.remove();
      pending.current = null;
    };
  }, []);

  return { viewport, goTo };
}
