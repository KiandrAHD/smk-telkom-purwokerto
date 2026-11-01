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
      gsap.fromTo(root.querySelectorAll('[data-innovation-word]'), { opacity: 0.4, y: 8 }, {
        opacity: 1, y: 0, duration: 0.45, stagger: 0.07, ease: 'power2.out',
        scrollTrigger: { trigger: root, start: 'top 85%', toggleActions: 'play none none reverse' },
      });
      const reel = gsap.to(root.querySelector('[data-innovation-reel]'), {
        yPercent: -50, duration: 0.75, repeat: -1, repeatDelay: 2.25, ease: 'power3.inOut', paused: true,
      });
      let visible = false;
      const sync = () => reel.paused(!visible || document.hidden);
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
      observer.observe(root);
      document.addEventListener('visibilitychange', sync);
      return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); };
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
            <span data-innovation-word className="home-innovation-box">
              <span className="home-innovation-size">{phrase}</span>
              <span className="home-innovation-window"><span data-innovation-reel className="home-innovation-reel">
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
