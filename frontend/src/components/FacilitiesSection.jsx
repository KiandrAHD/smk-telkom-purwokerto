import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { useLenis } from 'lenis/react';
import { ArrowRight, BookOpen, Bot, Building2, Monitor, Network, School } from 'lucide-react';
import { fasilitasData } from '../data/fasilitasData';
import { useLanguage } from '../context/LanguageContext';
import Modal from './dashboard/Modal';
import motifLeft from '../assets/fasilitas/motif-left.svg';
import motifTop from '../assets/fasilitas/motif-top.svg';
import backgroundLeft from '../assets/fasilitas/background-left.png';
import backgroundRight from '../assets/fasilitas/background-right.png';
import arrowPrev from '../assets/fasilitas/arrow-prev.svg';
import arrowNext from '../assets/fasilitas/arrow-next.svg';

gsap.registerPlugin(Flip);

const filters = ['Semua', 'Laboratorium', 'Kelas', 'Perpustakaan'];
const slides = [
  { name: 'Lab Jaringan', title: 'Laboratorium Jaringan', image: fasilitasData[5].image, category: 'Laboratorium', Icon: Network },
  { name: 'Ruang Kelas', image: fasilitasData[2].image, category: 'Kelas', Icon: School },
  { name: 'Perpustakaan', image: fasilitasData[7].image, category: 'Perpustakaan', Icon: BookOpen },
  { name: 'Lab Komputer', image: fasilitasData[4].image, category: 'Laboratorium', Icon: Monitor },
  { name: 'Lab Robotik', image: fasilitasData[6].image, category: 'Laboratorium', Icon: Bot },
  { name: 'Fasilitas Lainnya', image: fasilitasData[0].image, category: 'Semua', Icon: Building2 },
];
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function FacilitiesSection() {
  const { t } = useLanguage();
  // Both supported translations have two words; keep the existing accent on the last word.
  const [titleStart, titleEnd] = t('Fasilitas Sekolah').split(' ');
  const root = useRef(null);
  const carousel = useRef(null);
  const detail = useRef(null);
  const heading = useRef(null);
  const grid = useRef(null);
  const animation = useRef(null);
  const slideAnimation = useRef(null);
  const slideState = useRef(null);
  const turning = useRef(false);
  const direction = useRef(1);
  const mounted = useRef(true);
  const [active, setActive] = useState(0);
  const [filter, setFilter] = useState('Semua');
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState(null);
  const lenis = useLenis();

  useEffect(() => {
    const node = root.current;
    mounted.current = true;
    const finishSlide = () => slideAnimation.current?.progress(1);
    window.addEventListener('resize', finishSlide);
    return () => {
      window.removeEventListener('resize', finishSlide);
      mounted.current = false;
      animation.current?.kill();
      slideAnimation.current?.kill();
      turning.current = false;
      gsap.killTweensOf(node?.querySelectorAll('*') ?? []);
    };
  }, []);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const nodes = detail.current.querySelectorAll('[data-facility-reveal]');
      gsap.fromTo(nodes, { opacity: 0, y: 20, scale: 0.985, filter: 'blur(2px)' }, {
        opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.55, stagger: 0.05,
        ease: 'power3.out', scrollTrigger: { trigger: detail.current, start: 'top 85%', once: true },
      });
    }, root);
    return () => media.revert();
  }, []);

  const navigate = (next) => {
    if (turning.current || next === active) return;
    direction.current = (next - active + slides.length) % slides.length <= slides.length / 2 ? 1 : -1;
    if (!reducedMotion()) {
      slideState.current = Flip.getState(carousel.current.querySelectorAll('[data-slide]'));
      turning.current = true;
    }
    setActive((next + slides.length) % slides.length);
  };

  useLayoutEffect(() => {
    if (!slideState.current) return;
    const state = slideState.current;
    slideState.current = null;
    slideAnimation.current = Flip.from(state, {
      targets: carousel.current.querySelectorAll('[data-slide]'),
      absoluteOnLeave: true, duration: 0.45, ease: 'power3.inOut',
      onEnter: elements => {
        gsap.set(elements, { clearProps: 'transform,translate,rotate,scale' });
        return gsap.fromTo(elements, { x: direction.current * 32, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: 'power3.out' });
      },
      onLeave: elements => gsap.to(elements, { opacity: 0, duration: 0.25, ease: 'power2.out' }),
      onComplete: () => {
        gsap.set(carousel.current.querySelectorAll('[data-slide]'), { clearProps: 'all' });
        turning.current = false;
      },
      onInterrupt: () => { turning.current = false; },
    });
  }, [active]);

  const changeFilter = (next) => {
    if (busy || next === filter) return;
    if (reducedMotion()) { setFilter(next); return; }
    setBusy(true);
    const cards = [...grid.current.querySelectorAll('[data-facility-card]')];
    gsap.killTweensOf(cards);
    const outgoing = cards.filter(card => !card.classList.contains('hidden') && next !== 'Semua' && card.dataset.category !== next);
    animation.current = gsap.timeline().to(outgoing, {
      opacity: 0, scale: 0.96, duration: 0.16, ease: 'power2.in',
    }).call(() => {
      if (!mounted.current) return;
      const state = Flip.getState(cards.filter(card => !card.classList.contains('hidden')));
      flushSync(() => setFilter(next));
      gsap.set(cards, { clearProps: 'opacity,transform' });
      animation.current = Flip.from(state, {
        targets: cards.filter(card => !card.classList.contains('hidden')),
        duration: 0.45, ease: 'back.out(0.35)', scale: true,
        onEnter: elements => gsap.fromTo(elements, { opacity: 0, y: 16, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.25, stagger: 0.025 }),
        onComplete: () => { if (mounted.current) { gsap.set(cards, { clearProps: 'opacity,transform' }); setBusy(false); lenis?.resize(); } },
      });
    });
  };

  const showDetails = (category = 'Semua') => {
    if (busy) return;
    flushSync(() => setFilter(category));
    heading.current.focus({ preventScroll: true });
    lenis?.resize();
    if (lenis) lenis.scrollTo(detail.current, { offset: -110, duration: 1, immediate: reducedMotion() });
    else detail.current.scrollIntoView({ behavior: reducedMotion() ? 'instant' : 'smooth', block: 'start' });
  };

  const visibleCount = fasilitasData.filter(item => filter === 'Semua' || item.category === filter).length;
  return (
    <section ref={root} id="fasilitas" aria-label={t('Fasilitas Sekolah')} className="overflow-hidden bg-white [font-family:'Plus_Jakarta_Sans',sans-serif]">
      <div ref={carousel} className="relative isolate bg-[#484848] py-10 sm:py-12 lg:py-14 [container-type:inline-size]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <img src={backgroundLeft} alt="" className="absolute left-0 top-0 h-full w-1/2 object-cover opacity-10" />
          <img src={backgroundRight} alt="" className="absolute right-0 top-0 h-full w-3/5 object-cover opacity-15" />
          <div className="absolute left-[-0.54%] top-[-1.62%] origin-top-left [transform:scale(calc(100cqw/1847px))]"><img src={motifTop} alt="" className="max-w-none rotate-180" /></div>
          <div className="absolute left-[-5.57%] top-0 h-[493.607px] w-[179px] origin-top-left [transform:scale(calc(100cqw/1847px))]"><img src={motifLeft} alt="" className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 rotate-90" /></div>
        </div>
        <div className="mx-auto max-w-[1800px] px-6 sm:px-12 lg:px-20">
          <p className="text-sm tracking-[0.12em] text-white/80">{t('Fasilitas Kelas')} —</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-[0.08em] text-white sm:text-4xl lg:text-5xl">{titleStart} <span className="text-[#f01932]">{titleEnd}</span></h2>
          <p className="mt-4 max-w-lg text-xs leading-relaxed tracking-wide text-white/85 sm:text-sm">{t('Fasilitas sekolah adalah sarana dan prasarana yang disediakan untuk mendukung kegiatan belajar mengajar, supaya siswa bisa belajar dengan nyaman, aman, dan maksimal.')}</p>
        </div>
        <div className="relative mx-auto mt-9 max-w-[1800px] px-12 sm:px-16 lg:px-16" aria-roledescription={t('Karusel')} aria-label={t('Pilihan fasilitas')}>
          <div className="relative mb-6 flex aspect-[611/354] items-center justify-center gap-0 sm:mb-8 sm:aspect-[611/134.52]">
            {[-2, -1, 0, 1, 2, 3].map(offset => {
              const index = (active + offset + slides.length) % slides.length;
              const slide = slides[index];
              return (
                <button key={index} type="button" data-slide data-flip-id={`facility-${index}`} aria-hidden={Math.abs(offset) > 1 || undefined} disabled={Math.abs(offset) > 1} onClick={() => offset === 0 ? showDetails(slide.category) : navigate(index)}
                  aria-label={offset === 0 ? t('Lihat detail {name}', { name: t(slide.name) }) : t('Tampilkan {name}', { name: t(slide.name) })}
                  className={`relative aspect-[611/354] shrink-0 rounded-xl border-[3px] border-white bg-white shadow-card focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-primary ${Math.abs(offset) > 1 ? 'hidden' : offset === 0 ? 'z-10 w-full sm:w-[38%]' : `hidden sm:block sm:w-[33%] ${offset < 0 ? '-mr-4 -rotate-2' : '-ml-4 rotate-2'}`}`}>
                  <img src={slide.image} alt={t(slide.name)} width="611" height="354" loading="lazy" className="h-full w-full rounded-lg object-cover" />
                  {offset === 0 ? <span className="absolute -bottom-5 left-[7%] flex min-h-16 w-[86%] items-center justify-center rounded-xl bg-white/90 px-3 py-4 text-sm font-semibold text-dark-900 shadow-card sm:text-base lg:text-xl">{t(slide.title ?? slide.name)}</span>
                    : <span className="absolute inset-0 flex items-end rounded-lg bg-gradient-to-t from-primary/85 to-transparent p-4 text-left text-base font-semibold text-white lg:text-xl">{t(slide.name)}</span>}
                </button>
              );
            })}
          </div>
          <button type="button" aria-label={t('Fasilitas sebelumnya')} onClick={() => navigate((active - 1 + slides.length) % slides.length)} className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full sm:left-4"><img src={arrowPrev} alt="" className="max-w-none" /></button>
          <button type="button" aria-label={t('Fasilitas berikutnya')} onClick={() => navigate((active + 1) % slides.length)} className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full sm:right-4"><img src={arrowNext} alt="" className="max-w-none rotate-180" /></button>
          <p aria-live="polite" className="sr-only">{String(active + 1).padStart(2, '0')} — {t(slides[active].name)}</p>
        </div>
        <div className="mt-4 flex justify-center text-xs font-semibold text-white">
          <button type="button" onClick={() => showDetails()} className="min-h-11 rounded-lg px-3 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-white">{t('Lihat semua fasilitas')}</button>
        </div>
      </div>
      <div className="mx-auto max-w-[1240px] overflow-x-auto px-6 py-9" data-lenis-prevent-horizontal>
        <ol className="relative flex min-w-[620px] justify-between gap-3 before:absolute before:left-12 before:right-12 before:top-6 before:h-px before:bg-dark-300">
          {slides.map(({ name, Icon }, index) => <li key={name} className="relative flex-1 text-center">
            <button type="button" aria-pressed={active === index} onClick={() => navigate(index)} className={`group w-full text-xs ${active === index ? 'font-bold text-primary' : 'text-dark-500'}`}>
              <span className={`relative mx-auto flex size-12 items-center justify-center rounded-full border-2 ${active === index ? 'border-primary bg-primary text-white' : 'border-dark-400 bg-white group-hover:border-primary group-hover:text-primary'}`}><Icon className="size-5" /></span>
              <span className="mt-3 block">{t(name)}</span><span className="mt-1 block text-[10px] text-dark-500">{String(index + 1).padStart(2, '0')}</span>
            </button>
          </li>)}
        </ol>
      </div>
      <section ref={detail} id="fasilitas-sekolah" aria-labelledby="fasilitas-title" className="scroll-mt-28 px-4 pb-14 pt-7 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1736px]">
          <h2 ref={heading} id="fasilitas-title" tabIndex={-1} data-facility-reveal className="text-center text-2xl font-extrabold text-dark-900 outline-none sm:text-3xl">{titleStart} <span className="text-primary">{titleEnd}</span></h2>
          <div className="mt-6 flex gap-2 overflow-x-auto pb-2 sm:justify-center" aria-label={t('Filter fasilitas')} data-lenis-prevent-horizontal>
            {filters.map(category => <button key={category} type="button" data-facility-reveal aria-pressed={filter === category} aria-controls="fasilitas-grid" disabled={busy} onClick={() => changeFilter(category)} className={`shrink-0 rounded-full border px-5 py-2.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:text-sm ${filter === category ? 'border-primary bg-primary text-white' : 'border-dark-200 bg-white text-dark-600 hover:border-primary hover:text-primary'}`}>{t(category)}</button>)}
          </div>
          <p className="sr-only" role="status">{t('{count} fasilitas dalam kategori {category}', { count: visibleCount, category: t(filter) })}</p>
          <div ref={grid} id="fasilitas-grid" className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {fasilitasData.map(item => <article key={item.id} data-facility-card data-category={item.category} className={`overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-soft ${filter !== 'Semua' && item.category !== filter ? 'hidden' : ''}`}>
              <div data-facility-reveal className="flex h-full flex-col">
                <img src={item.image} alt={t(item.name)} width="600" height="400" loading="lazy" className="aspect-[3/2] w-full object-cover" />
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-base font-bold text-primary">{t(item.name)}</h3>
                  <p className="mb-5 mt-3 text-xs leading-6 text-dark-500">{t(item.preview)}</p>
                  <button type="button" onClick={() => setSelected(item)} aria-label={t('Selengkapnya tentang {name}', { name: t(item.name) })} className="mt-auto flex items-center gap-2 self-start text-xs font-semibold text-primary hover:underline">{t('Selengkapnya')} <ArrowRight className="size-4" /></button>
                </div>
              </div>
            </article>)}
          </div>
        </div>
      </section>
      <Modal terbuka={selected !== null} onTutup={() => setSelected(null)} judul={t(selected?.name)} labelTutup={t('Tutup')} lebar="max-w-2xl">
        {selected && <div data-lenis-prevent className="max-h-[70dvh] overflow-y-auto overscroll-contain"><img src={selected.image} alt={t(selected.name)} width="900" height="600" className="aspect-[3/2] w-full rounded-xl object-cover" /><p className="mt-5 text-sm leading-7 text-dark-600">{t(selected.description)}</p></div>}
      </Modal>
    </section>
  );
}
