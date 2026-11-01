import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';
import './HomeMotion.css';

gsap.registerPlugin(ScrollTrigger);

export default function InnovationReveal() {
  const { t, language } = useLanguage();
  const ref = useRef(null);
  const phrase = t('Digital Innovation');
  const words = text => t(text).split(/\s+/).map((word, index) => <span key={index} data-innovation-word>{word}</span>);

  useLayoutEffect(() => {
    const root = ref.current;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const reel = gsap.fromTo(root.querySelector('[data-innovation-reel]'), { xPercent: 0, yPercent: 0 }, {
        xPercent: -50, duration: 0.85, repeat: -1, repeatDelay: 2.5, ease: 'power3.inOut', paused: true,
      });
      let visible = false;
      let revealed = false;
      const sync = () => {
        if (!revealed) reel.pause(0);
        else reel.paused(!visible || document.hidden);
      };
      const highlight = node => node.hasAttribute('data-innovation-highlight');
      const reveal = gsap.fromTo(root.querySelectorAll('[data-innovation-word]'), {
        opacity: 0.7, color: (_, node) => highlight(node) ? '#fff' : '#999',
      }, {
        opacity: 1, color: (_, node) => highlight(node) ? '#fff' : '#000',
        duration: 0.7, stagger: 0.12, ease: 'none',
        onUpdate() { revealed = this.progress() >= 0.99; sync(); },
        scrollTrigger: {
          trigger: root, start: 'clamp(top 88%)', end: 'clamp(top 48%)',
          scrub: 0.35, invalidateOnRefresh: true,
        },
      });
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
      observer.observe(root);
      // Lazy sections above can change height after ScrollTrigger's initial measurement.
      let refreshFrame;
      const layoutObserver = new ResizeObserver(() => {
        cancelAnimationFrame(refreshFrame);
        refreshFrame = requestAnimationFrame(() => reveal.scrollTrigger.refresh());
      });
      layoutObserver.observe(root.parentElement);
      document.addEventListener('visibilitychange', sync);
      return () => {
        observer.disconnect();
        layoutObserver.disconnect();
        cancelAnimationFrame(refreshFrame);
        document.removeEventListener('visibilitychange', sync);
      };
    }, root);
    return () => media.revert();
  }, [language]);

  return (
    <section ref={ref} data-innovation-reveal className="home-innovation bg-white" aria-labelledby="innovation-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="innovation-title" className="home-innovation-title">
          <span className="sr-only">{t('Bukan sekadar belajar Teknologi')}. {phrase}. {t('Kami bikin karya nyata')}.</span>
          <span aria-hidden="true" className="home-innovation-line">{words('Bukan sekadar belajar Teknologi')}</span>
          <span aria-hidden="true" className="home-innovation-line">
            <span className="home-innovation-box">
              <span className="home-innovation-size">{phrase}</span>
              <span data-innovation-word data-innovation-highlight className="home-innovation-window"><span data-innovation-reel className="home-innovation-reel">
                <span>{phrase}</span><span>{phrase}</span>
              </span></span>
            </span>
            {words('Kami bikin karya nyata')}
          </span>
        </h2>
      </div>
    </section>
  );
}
