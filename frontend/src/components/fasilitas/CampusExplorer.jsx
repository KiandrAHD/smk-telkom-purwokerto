import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowLeftRight, ArrowRight, Check, ImageOff } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import useCampusPan from '../../hooks/useCampusPan';
import { campusAnnotations, campusFacilities, campusHotspots } from '../../data/campusData';
import { readCampusHint, saveCampusHint } from '../../utils/campusPan';
import CampusPreview from './CampusPreview';
import map from '../../assets/fasilitas/campus/campus-map.webp';
import floor from '../../assets/fasilitas/campus/floor-0.png';
import motif from '../../assets/fasilitas/campus/motif.svg';
import leftPetal from '../../assets/fasilitas/campus/heading-left.svg';
import leftTop from '../../assets/fasilitas/campus/heading-left-top.svg';
import rightPetal from '../../assets/fasilitas/campus/heading-right.svg';
import rightTop from '../../assets/fasilitas/campus/heading-right-top.svg';
import pin from '../../assets/fasilitas/campus/node-205-1109.svg';
import dot from '../../assets/fasilitas/campus/node-205-1142.svg';
import sliderLeft from '../../assets/fasilitas/campus/node-205-1164.svg';
import sliderRight from '../../assets/fasilitas/campus/node-205-1166.svg';
import decorA from '../../assets/fasilitas/campus/decor-a.svg';
import decorB from '../../assets/fasilitas/campus/decor-b.svg';
import decorC from '../../assets/fasilitas/campus/decor-c.svg';
import decorD from '../../assets/fasilitas/campus/decor-d.svg';
import './CampusExplorer.css';

function CampusDecorations() {
  return <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
    <img src={floor} alt="" className="campus-floor absolute h-full w-full object-cover" />
    <img src={motif} alt="" width="711" height="226" className="absolute left-[2.67%] top-[8.75%] h-auto w-[22.63%]" />
    <div className="absolute left-[40.293%] top-[68.03%] aspect-[331/297] w-[10.534%] bg-dark-300/50" />
    <div className="campus-diamond-large absolute left-[45.741%] top-[67.926%] aspect-square w-[7.133%] bg-white/50" />
    <div className="campus-diamond-large absolute left-[45.472%] top-[76.102%] aspect-square w-[3.046%] bg-primary/50" />
    {['left-[30.618%] top-[90.67%]', 'left-[30.618%] top-[75.55%]', 'left-[35.677%] top-[90.67%]', 'left-[35.677%] top-[75.55%]'].map(position => <div key={position} className={`campus-diamond-small absolute aspect-square w-[3.577%] bg-dark-300/50 ${position}`} />)}
    {[decorA, decorB, decorC, decorD].map((src, index) => <img key={src} src={src} alt="" className={`absolute top-[81.54%] h-auto w-[4.94%] ${index < 2 ? 'left-[50.827%]' : 'left-[61.267%]'}`} />)}
  </div>;
}

export default function CampusExplorer({ request, onViewFacilities }) {
  const { t } = useLanguage();
  const [learned, setLearned] = useState(readCampusHint);
  const [active, setActive] = useState(null), [closing, setClosing] = useState(false), [ready, setReady] = useState(false), [failed, setFailed] = useState(false), [retry, setRetry] = useState(0), [located, setLocated] = useState(null);
  const root = useRef(null), closeTimer = useRef(null), highlightTimer = useRef(null), lastTrigger = useRef(null), restoringFocus = useRef(false);
  const viewport = useRef(null), stage = useRef(null), slider = useRef(null), previous = useRef(null), next = useRef(null);
  const learn = useCallback(() => { saveCampusHint(); setLearned(true); }, []);
  const pan = useCampusPan({ viewport, stage, slider, previous, next }, learn);
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const select = useCallback((point, trigger) => { clearTimeout(closeTimer.current); setClosing(false); lastTrigger.current = trigger; setActive(point); }, []);
  const close = (restoreFocus = true) => {
    if (!active) return;
    clearTimeout(closeTimer.current); setClosing(true);
    closeTimer.current = setTimeout(() => {
      setActive(null); setClosing(false);
      if (restoreFocus && lastTrigger.current) {
        const pinBounds = lastTrigger.current.getBoundingClientRect(), viewBounds = viewport.current.getBoundingClientRect();
        restoringFocus.current = true;
        (pinBounds.right > viewBounds.left && pinBounds.left < viewBounds.right ? lastTrigger.current : viewport.current).focus({ preventScroll: true });
        restoringFocus.current = false;
      }
    }, reduced() ? 0 : 280);
  };
  useEffect(() => { pan.refresh(); }, [ready, failed, pan]);
  useEffect(() => () => { clearTimeout(closeTimer.current); clearTimeout(highlightTimer.current); }, []);
  useEffect(() => {
    if (!request || !ready) return;
    const point = campusHotspots.find(point => point.facilityId === request.id);
    if (!point) return;
    const trigger = root.current.querySelector(`[data-campus-hotspot="${point.id}"]`);
    root.current.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
    pan.locate(point.x, () => {
      trigger?.focus({ preventScroll: true }); select(point, trigger);
      clearTimeout(highlightTimer.current); setLocated(point.id);
      highlightTimer.current = setTimeout(() => setLocated(null), 1500);
    });
  }, [request, ready, pan, select]);
  return <section ref={root} id="school-tour" aria-labelledby="school-tour-title" data-campus-explorer className="campus-explorer scroll-mt-28 bg-white py-8 lg:py-12" onKeyDown={event => { if (event.key === 'Escape' && active) { event.preventDefault(); close(); } }}>
    <div>
      <header className="mb-5 text-center">
        <div className="flex items-center justify-center gap-3"><span aria-hidden="true" className="relative block h-8 w-4"><img src={leftTop} alt="" className="campus-petal-left-top absolute left-0 top-0 size-4" /><img src={leftPetal} alt="" className="campus-petal-left-bottom absolute bottom-0 left-0 size-4" /></span><h2 id="school-tour-title" className="font-heading text-2xl font-extrabold leading-tight text-primary sm:text-3xl">School Tour</h2><span aria-hidden="true" className="relative block h-8 w-4"><img src={rightTop} alt="" className="campus-petal-right-top absolute right-0 top-0 size-4" /><img src={rightPetal} alt="" className="campus-petal-right-bottom absolute bottom-0 right-0 size-4" /></span></div>
        <p className="mt-2 text-sm font-semibold text-dark-800">{t('Menjelajahi Stematel')}</p>
      </header>
      <p id="campus-instructions" className="sr-only">{t('Geser peta ke kiri atau kanan. Gunakan tombol arah, slider, atau tombol panah pada keyboard. Pilih titik untuk melihat informasi fasilitas.')}</p>
      <div className="relative">
        <div ref={viewport} className="campus-viewport relative focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" role="region" aria-label={t('Peta kampus SMK Telkom Purwokerto')} aria-describedby="campus-instructions" tabIndex={ready ? 0 : -1} data-map-ready={ready && !failed} data-map-failed={failed} data-lenis-prevent-horizontal>
          <div ref={stage} data-campus-stage className={failed ? 'relative h-56 w-full' : 'campus-stage relative mx-auto aspect-[2164/727] w-[960px]'}>
            {!failed && <><CampusDecorations /><img key={retry} src={map} alt={t('Peta isometrik sekolah dengan bangunan beratap merah')} width="2164" height="727" loading="lazy" decoding="async" draggable="false" className="pointer-events-none relative z-10 block h-full w-full select-none" onLoad={() => setReady(true)} onError={() => { setFailed(true); setReady(false); }} />
              {ready && campusHotspots.map(point => {
                const annotation = campusAnnotations[point.id];
                return <button key={point.id} type="button" data-campus-hotspot={point.id} data-located={located === point.id} data-active={active?.id === point.id && !closing} aria-label={t('Lihat fasilitas {name}', { name: t(point.label) })} aria-controls={active ? 'campus-preview' : undefined} aria-expanded={active?.id === point.id && !closing} onFocus={() => { if (!restoringFocus.current) pan.reveal(point.x); }} onClick={event => select(point, event.currentTarget)} className={`campus-hotspot group absolute z-20 grid size-11 -translate-x-1/2 -translate-y-full items-end justify-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${point.position} ${annotation.classes}`}>
                  <span className="campus-pin-art pointer-events-none absolute"><img src={pin} alt="" className="max-w-none" /></span>
                  <span className="campus-leader pointer-events-none absolute"><img src={annotation.line} alt="" className="max-w-none" /></span>
                  {annotation.diagonal && <span className="campus-diagonal pointer-events-none absolute"><img src={annotation.diagonal} alt="" className="max-w-none" /></span>}
                  <span className="campus-anchor pointer-events-none absolute"><img src={dot} alt="" className="max-w-none" /></span>
                  <span className="campus-hotspot-label absolute whitespace-nowrap rounded border border-white bg-primary px-2 py-1 text-xs font-semibold text-white shadow-soft sm:text-sm lg:text-base xl:text-xl"><span>{t(point.label)}</span>{active?.id === point.id && <Check className="ml-1 inline size-3" aria-hidden="true" />}{annotation.subtitle && <span className="block text-[10px] font-normal leading-tight">({t(annotation.subtitle)})</span>}</span>
                </button>;
              })}</>}
            {failed && <div role="status" className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl bg-dark-50 px-6 text-center text-sm text-dark-500"><ImageOff className="size-9" aria-hidden="true" /><p>{t('Peta belum tersedia. Daftar fasilitas tetap dapat dibuka di bawah.')}</p><button type="button" onClick={() => { setFailed(false); setRetry(value => value + 1); }} className="min-h-11 rounded-lg border border-dark-200 px-4 text-xs font-semibold text-primary">{t('Coba lagi')}</button></div>}
          </div>
        </div>
        {active && <CampusPreview facility={campusFacilities[active.facilityId]} closing={closing} onClose={close} onList={list => { close(false); onViewFacilities(list); }} />}
      </div>
      <div data-map-failed={failed} data-preview-open={active !== null} className="campus-controls relative z-30 mx-auto w-[88%] max-w-5xl sm:w-[72.22%]">
        <div className="flex items-center gap-3 rounded-2xl border border-dark-200 bg-white px-2 shadow-soft">
          <button ref={previous} type="button" disabled={!ready} onClick={() => pan.by(-0.45)} aria-label={t('Geser peta ke kiri')} className="grid size-11 shrink-0 place-items-center rounded-full text-primary hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-primary disabled:text-dark-300"><ArrowLeft className="size-4" /></button>
          <div className="relative min-w-0 flex-1">
            <input ref={slider} type="range" min="0" max="1000" step="1" defaultValue="64" disabled={!ready} aria-label={t('Posisi peta sekolah')} className="campus-slider block w-full" onChange={event => pan.fraction(Number(event.target.value) / 1000)} />
            <span aria-hidden="true" className="campus-slider-arrows pointer-events-none absolute"><span className="campus-slider-arrow-left absolute"><img src={sliderLeft} alt="" className="max-w-none" /></span><span className="campus-slider-arrow-right absolute"><img src={sliderRight} alt="" className="max-w-none" /></span></span>
          </div>
          <button ref={next} type="button" disabled={!ready} onClick={() => pan.by(0.45)} aria-label={t('Geser peta ke kanan')} className="grid size-11 shrink-0 place-items-center rounded-full text-primary hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-primary disabled:text-dark-300"><ArrowRight className="size-4" /></button>
        </div>
        <div className="mt-3 flex min-h-9 justify-center"><span data-campus-hint data-dismissed={learned || failed} aria-hidden={learned || failed} className="campus-hint pointer-events-none inline-flex items-center gap-2 rounded-lg border border-dark-100 bg-white px-3 py-1.5 text-xs font-semibold text-primary shadow-soft"><ArrowLeftRight className="campus-hint-icon size-4" aria-hidden="true" />{t('Geser untuk Menjelajah')}</span></div>
      </div>
    </div>
  </section>;
}
