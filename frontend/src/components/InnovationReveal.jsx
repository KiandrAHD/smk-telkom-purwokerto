import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { TextRevealByWord, TextRevealWord } from './ui/text-reveal';
import { useLanguage } from '../context/LanguageContext';
import './HomeMotion.css';



export default function InnovationReveal() {
  const { t, language } = useLanguage();
  const ref = useRef(null);
  const phrase = t('Digital Innovation');
  const syncRef = useRef(null);
  const revealedRef = useRef(false);
  const lead = t('Bukan sekadar belajar Teknologi').split(/\s+/);
  const tail = t('Kami bikin karya nyata').split(/\s+/);
  const count = lead.length + tail.length + 1;
  const words = (list, progress, offset = 0) => list.map((word, index) => <TextRevealWord key={index} progress={progress} range={[(offset + index) / count, (offset + index + 1) / count]}>{word}</TextRevealWord>);
  const onRevealChange = complete => { revealedRef.current = complete; syncRef.current?.(); };

  useLayoutEffect(() => {
    const root = ref.current;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const reel = gsap.fromTo(root.querySelector('[data-innovation-reel]'), { xPercent: 0, yPercent: 0 }, {
        xPercent: -50, duration: 0.85, repeat: -1, repeatDelay: 2.5, ease: 'power3.inOut', paused: true,
      });
      let visible = false;

      const sync = () => {
        if (!revealedRef.current) reel.pause(0);
        else reel.paused(!visible || document.hidden);
      };
      syncRef.current = sync;
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
      observer.observe(root);
      document.addEventListener('visibilitychange', sync);
      return () => {
        observer.disconnect();
        syncRef.current = null;
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
          <TextRevealByWord text={[...lead, phrase, ...tail].join(' ')} targetRef={ref} onRevealChange={onRevealChange} render={progress => <>
          <span aria-hidden="true" className="home-innovation-line">{words(lead, progress)}</span>
          <span aria-hidden="true" className="home-innovation-line">
            <span className="home-innovation-box">
              <span className="home-innovation-size">{phrase}</span>
              <TextRevealWord ghost={false} progress={progress} range={[lead.length / count, (lead.length + 1) / count]} className="home-innovation-window"><span data-innovation-reel className="home-innovation-reel">
                <span>{phrase}</span><span>{phrase}</span>
              </span></TextRevealWord>
            </span>
            {words(tail, progress, lead.length + 1)}
          </span>
          </>} />
        </h2>
      </div>
    </section>
  );
}
