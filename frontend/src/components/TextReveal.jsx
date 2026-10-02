import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function TextReveal({ text, className = '' }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(ref.current.querySelectorAll('[data-word]'), { opacity: 0.65 }, {
        opacity: 1,
        duration: 1,
        stagger: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          end: 'top 20%',
          scrub: true,
        },
      });
    });
    return () => media.revert();
  }, [text]);

  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.trim().split(/\s+/).map((word, index) => (
          <span key={index} data-word className="inline-block">{word}&nbsp;</span>
        ))}
      </span>
    </p>
  );
}
