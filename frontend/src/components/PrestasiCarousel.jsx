import { useCallback, useEffect, useRef, useState } from 'react';
import AchievementCard from './AchievementCard';
import { prestasiData } from '../data/dummyData';

// Lebar kartu disamakan persis dengan grid aslinya (gap-5 = 1.25rem):
// 1 kolom di mobile, 2 di sm, 4 di lg.
const CARD_WIDTH = 'w-full sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3.75rem)/4)]';

const PrestasiCarousel = () => {
  const trackRef = useRef(null);
  const drag = useRef({ down: false, moved: false, startX: 0, startLeft: 0 });

  const [groups, setGroups] = useState(1);
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);

  // Jumlah slide diturunkan dari geometri scroll itu sendiri: berapa layar penuh
  // isi track. Satu elemen, satu pembacaan — tidak perlu menyamakan lebar track
  // dengan lebar kartu yang breakpoint-nya berubah di waktu berbeda.
  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el || !el.clientWidth) return;
    setGroups(Math.max(1, Math.round(el.scrollWidth / el.clientWidth)));
  }, []);

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
  }, [measure]);

  // Dot aktif dibaca dari posisi scroll, bukan disimpan terpisah — jadi tetap
  // benar baik saat digeser lewat swipe, drag, scrollbar, maupun klik dot.
  const syncActive = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const i = el.clientWidth ? Math.round(el.scrollLeft / el.clientWidth) : 0;
    setActive(Math.min(Math.max(i, 0), groups - 1));
  }, [groups]);

  useEffect(() => {
    syncActive();
  }, [syncActive]);

  const goTo = (i) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };

  // Drag dengan mouse. Sentuh sengaja tidak ditangani di sini — swipe native
  // sudah lebih halus dan sudah dapat momentum dari browser.
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse') return;
    const el = trackRef.current;
    drag.current = { down: true, moved: false, startX: e.clientX, startLeft: el.scrollLeft };
    setDragging(true);
    // Penangkapan pointer bersifat pelengkap: kalau browser menolak pointerId-nya,
    // geseran tetap jalan lewat event biasa dan carousel tidak tersangkut di
    // keadaan "sedang digeser".
    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      /* pointer sudah tidak aktif */
    }
  };

  const onPointerMove = (e) => {
    if (!drag.current.down) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 5) drag.current.moved = true;
    trackRef.current.scrollLeft = drag.current.startLeft - dx;
  };

  const onPointerUp = (e) => {
    if (!drag.current.down) return;
    drag.current.down = false;
    setDragging(false);
    const el = trackRef.current;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);

    // Snap baru menyala lagi setelah drag selesai, lalu didorong ke slide terdekat.
    requestAnimationFrame(() => goTo(Math.round(el.scrollLeft / el.clientWidth)));
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
        onClickCapture={onClickCapture}
        className={`mt-7 -my-2 flex gap-5 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&_img]:pointer-events-none ${
          dragging
            ? 'cursor-grabbing select-none scroll-auto'
            : 'cursor-grab snap-x snap-mandatory scroll-smooth'
        }`}
      >
        {prestasiData.items.map((item, i) => (
          <div key={item.title} className={`shrink-0 snap-start ${CARD_WIDTH}`}>
            <AchievementCard {...item} highlight={i === 0} />
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
            aria-label={`Ke slide prestasi ${i + 1}`}
            aria-current={i === active}
            className={`relative h-2 w-2 rounded-full transition-colors before:absolute before:-inset-2 before:content-[''] ${
              i === active ? 'bg-primary' : 'bg-dark-200 hover:bg-dark-300'
            }`}
          />
        ))}
      </div>
    </>
  );
};

export default PrestasiCarousel;


