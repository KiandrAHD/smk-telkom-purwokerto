import { useLanguage } from '../context/LanguageContext';
import { useCallback, useEffect, useRef, useState } from 'react';
import AchievementCard from './AchievementCard';

// Lebar kartu disamakan persis dengan grid aslinya (gap-5 = 1.25rem):
// 1 kolom di mobile, 2 di sm, 4 di lg.
const CARD_WIDTH = 'w-full sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3.75rem)/4)]';

const getCarouselMetrics = (width, cardWidth, gap, count) => {
  const perPage = Math.max(1, Math.round((width + gap) / (cardWidth + gap)));
  return { groups: Math.max(1, Math.ceil(count / perPage)), step: perPage * (cardWidth + gap) };
};

const getCarouselIndex = (scrollLeft, maxScroll, step, groups) => {
  const left = Math.max(0, Math.min(scrollLeft, maxScroll));
  const previous = Math.min(Math.floor(left / step), groups - 1);
  const next = Math.min(previous + 1, groups - 1);
  // Halaman terakhir bisa lebih pendek; gunakan posisi scroll sebenarnya.
  return left - Math.min(previous * step, maxScroll) <= Math.min(next * step, maxScroll) - left
    ? previous : next;
};

const PrestasiCarousel = ({ items }) => {
  const { t } = useLanguage();
  const trackRef = useRef(null);
  const stepRef = useRef(1);
  const drag = useRef({ down: false, moved: false, startX: 0, startLeft: 0 });

  const [groups, setGroups] = useState(1);
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);

  // Gap ikut dihitung agar halaman terakhir tidak hilang atau menjadi dot tambahan.
  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el?.clientWidth || !el.firstElementChild) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const metrics = getCarouselMetrics(el.clientWidth, el.firstElementChild.getBoundingClientRect().width, gap, items.length);
    stepRef.current = metrics.step;
    setGroups(metrics.groups);
    setActive(getCarouselIndex(el.scrollLeft, Math.max(0, el.scrollWidth - el.clientWidth), metrics.step, metrics.groups));
  }, [items.length]);

  useEffect(() => {
    measure();
    // Kartu ikut dipantau, bukan cuma track: lebar kartu punya breakpoint sendiri
    // dan bisa berubah tanpa lebar track berubah. Kalau hanya track yang dipantau,
    // pengukuran bisa tersangkut di keadaan transisi dan jumlah dot jadi salah.
    const ro = new ResizeObserver(measure);
    const el = trackRef.current;
    if (el) {
      ro.observe(el);
      if (el.firstElementChild) ro.observe(el.firstElementChild);
    }
    // Pengaman kedua: sebagian lingkungan tidak memanggil ResizeObserver saat
    // viewport berubah, dan jumlah dot ikut tersangkut di nilai lama.
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure, items]);

  // Dot aktif dibaca dari posisi scroll, bukan disimpan terpisah — jadi tetap
  // benar baik saat digeser lewat swipe, drag, scrollbar, maupun klik dot.
  const syncActive = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setActive(getCarouselIndex(el.scrollLeft, Math.max(0, el.scrollWidth - el.clientWidth), stepRef.current, groups));
  }, [groups]);

  const goTo = (i) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * stepRef.current, behavior: 'smooth' });
  };

  // Drag dengan mouse. Sentuh sengaja tidak ditangani di sini — swipe native
  // sudah lebih halus dan sudah dapat momentum dari browser.
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse') return;
    const el = trackRef.current;
    drag.current = { down: true, moved: false, startX: e.clientX, startLeft: el.scrollLeft };
  };

  const onPointerMove = (e) => {
    if (!drag.current.down) return;
    const dx = e.clientX - drag.current.startX;
    if (!drag.current.moved) {
      if (Math.abs(dx) <= 5) return;
      drag.current.moved = true;
      setDragging(true);
      // Capture hanya setelah drag: klik biasa harus tetap menuju Link kartu.
      try { trackRef.current.setPointerCapture(e.pointerId); } catch { /* pointer tidak aktif */ }
    }
    trackRef.current.scrollLeft = drag.current.startLeft - dx;
  };

  const onPointerUp = (e) => {
    if (!drag.current.down) return;
    drag.current.down = false;
    setDragging(false);
    const el = trackRef.current;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);

    // Snap baru menyala lagi setelah drag selesai, lalu didorong ke slide terdekat.
    if (drag.current.moved) requestAnimationFrame(() => goTo(getCarouselIndex(el.scrollLeft, Math.max(0, el.scrollWidth - el.clientWidth), stepRef.current, groups)));
  };

  // Menggeser bukan mengeklik. Klik dicegat di fase capture supaya <Link> di
  // dalam kartu tidak ikut membuka halaman detail setelah kartu digeser.
  const onClickCapture = (e) => {
    if (!drag.current.moved) return;
    drag.current.moved = false;
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <>
      {/* py/-my saling meniadakan: memberi ruang bayangan kartu tanpa menggeser
          jarak vertikal section. */}
      <div
        ref={trackRef}
        onScroll={syncActive}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerUp}
        onClickCapture={onClickCapture}
        className={`mt-7 -my-2 flex gap-5 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&_img]:pointer-events-none ${
          dragging
            ? 'cursor-grabbing select-none scroll-auto'
            : 'cursor-grab snap-x snap-mandatory scroll-smooth'
        }`}
      >
        {items.map((item, i) => (
          <div key={item.id || item.slug} className={`shrink-0 snap-start ${CARD_WIDTH}`}>
            <AchievementCard {...item} category={item.kategori} highlight={i === 0} />
          </div>
        ))}
      </div>

      {/* Indikator carousel */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {Array.from({ length: groups }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={t('Ke slide prestasi {number}', { number: i + 1 })}
            aria-current={i === active}
            className={`relative h-2 w-2 rounded-full transition-colors before:absolute before:-inset-2 before:content-[''] ${
              i === active ? 'w-6 bg-primary' : 'bg-dark-200 hover:bg-primary/50'
            }`}
          />
        ))}
      </div>
    </>
  );
};

export default PrestasiCarousel;
