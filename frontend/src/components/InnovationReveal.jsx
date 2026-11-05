import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { TextRevealByWord, TextRevealWord } from './ui/text-reveal';
import { useLanguage } from '../context/LanguageContext';
import './HomeMotion.css';



export default function InnovationReveal() {
  const { t, language } = useLanguage();
  const ref = useRef(null);
  const phrase = t('Digital Innovation');
  const lead = t('Bukan sekadar belajar Teknologi').split(/\s+/);
  const tail = t('Kami bikin karya nyata').split(/\s+/);
  const count = lead.length + tail.length + 1;
  const [active, setActive] = useState(false);
  const words = (list, progress, offset = 0) => list.map((word, index) => (
    <TextRevealWord key={index} progress={progress} range={[(offset + index) / count, (offset + index + 1) / count]}>{word}</TextRevealWord>
  ));

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio >= 0.25) setActive(true);
      else if (!entry.isIntersecting) setActive(false);
    }, { threshold: [0, 0.25] });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const root = ref.current;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const track = root.querySelector('[data-innovation-reel]');
      const reel = gsap.timeline({ repeat: -1, paused: true })
        .to(track, { xPercent: -100, duration: 1.2, ease: 'power1.inOut' }, 1.8)
        .set(track, { xPercent: 0 });
      let visible = false;

      const sync = () => {
        reel.paused(!visible || document.hidden);
      };
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
      observer.observe(root);
      document.addEventListener('visibilitychange', sync);
      return () => {
        observer.disconnect();
        document.removeEventListener('visibilitychange', sync);
      };
    }, root);
    return () => media.revert();
  }, [language, active]);

  return (
    <section ref={ref} data-innovation-reveal className="home-innovation bg-white" aria-labelledby="innovation-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="innovation-title" className="home-innovation-title">
          <span className="sr-only">{t('Bukan sekadar belajar Teknologi')}. {phrase}. {t('Kami bikin karya nyata')}.</span>
          <TextRevealByWord text={[...lead, phrase, ...tail].join(' ')} targetRef={ref} render={progress => <>
          <span aria-hidden="true" className="home-innovation-line">{words(lead, progress)}</span>
          <span aria-hidden="true" className="home-innovation-line">
            <span className="home-innovation-box">
              <span className="home-innovation-size">{phrase}</span>
              <span className="home-innovation-window"><span data-innovation-reel className="home-innovation-reel">
                <span>{phrase}</span><span>{phrase}</span>
              </span></span>
            </span>
            {words(tail, progress, lead.length + 1)}
          </span>
          </>} />
        </h2>
      </div>
    </section>
  );
}
