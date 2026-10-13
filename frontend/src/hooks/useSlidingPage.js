import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

// A decorative snapshot keeps the outgoing page visible while React renders the next one.
export default function useSlidingPage(pageKey) {
  const viewport = useRef(null);
  const indicators = useRef(null);
  const pending = useRef(null);
  const animation = useRef(null);

  const goTo = (next, current, commit, direction = next > current ? 1 : -1) => {
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
    const indicatorStyles = new Map([...(indicators.current?.querySelectorAll('[data-slide-indicator]') || [])].map(element => {
      const style = getComputedStyle(element);
      return [element, { transform: style.transform, width: style.width, backgroundColor: style.backgroundColor }];
    }));
    pending.current = { snapshot, direction, indicatorStyles };
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
    images.forEach(image => { image.loading = 'eager'; image.decode().catch(() => {}); });
    const indicatorTargets = [...state.indicatorStyles.keys()].filter(element => element.isConnected);
    const destinations = indicatorTargets.map(element => {
      const style = getComputedStyle(element);
      return { transform: style.transform, width: style.width, backgroundColor: style.backgroundColor, inline: element.getAttribute('style') };
    });
    // Cards and indicators share the same clock; image decoding must not delay either.
    animation.current = gsap.timeline({ defaults: { duration: 0.5, ease: 'power3.out' }, onComplete: () => {
      state.snapshot.remove();
      gsap.set(incoming, { clearProps: 'transform,willChange' });
      indicatorTargets.forEach((element, index) => {
        const inline = destinations[index].inline;
        if (inline === null) element.removeAttribute('style'); else element.setAttribute('style', inline);
      });
      pending.current = null;
      animation.current = null;
    } })
      .to(state.snapshot, { x: -state.direction * node.clientWidth, force3D: true }, 0)
      .to(incoming, { x: 0, force3D: true }, 0);
    const from = {}, to = { autoRound: false };
    for (const property of ['transform', 'width', 'backgroundColor']) {
      from[property] = index => state.indicatorStyles.get(indicatorTargets[index])[property];
      to[property] = index => destinations[index][property];
    }
    if (indicatorTargets.length) animation.current.fromTo(indicatorTargets, from, to, 0);
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

  return { viewport, indicators, goTo };
}
