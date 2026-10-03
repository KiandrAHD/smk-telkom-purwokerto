import { useLanguage } from '../../context/LanguageContext';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, X } from 'lucide-react';
import maskot from '../../assets/pengumuman/stela-bot.png';

const StelaChat = lazy(() => import('./StelaChat'));

// Gelembung chat yang mengambang di seluruh halaman publik. Sengaja tidak
// dipasang di /stela karena di sana chat-nya sudah jadi isi halaman.
const StelaWidget = () => {
  const { t } = useLanguage();
  const [terbuka, setTerbuka] = useState(false);
  const [pernahDibuka, setPernahDibuka] = useState(false);
  const triggerRef = useRef(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== '/ekstrakurikuler') return undefined;
    const filters = document.getElementById('ekstrakurikuler-filters');
    if (!filters) return undefined;
    const observer = new IntersectionObserver(([entry]) => setFilterVisible(entry.isIntersecting));
    observer.observe(filters);
    return () => observer.disconnect();
  }, [pathname]);

  if (pathname === '/stela') return null;

  return (
    <div onKeyDown={(event) => {
      if (event.key !== 'Escape' || !terbuka) return;
      event.preventDefault();
      setTerbuka(false);
      triggerRef.current?.focus();
    }} className={`fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6 ${pathname === '/ekstrakurikuler' && filterVisible && !terbuka ? 'max-sm:invisible max-sm:pointer-events-none' : ''}`}>
      {pernahDibuka && (
        <div id="stela-widget-panel" role="region" aria-labelledby="stela-widget-title" className={`${terbuka ? 'motion-chat-enter flex' : 'hidden'} max-h-[calc(100dvh-10rem)] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl shadow-card sm:max-h-[calc(100dvh-11rem)]`}>
          <div className="flex shrink-0 items-center gap-2.5 bg-primary px-4 py-3">
            <img src={maskot} alt="" aria-hidden="true" className="h-7 w-7 object-contain" />
            <span id="stela-widget-title" className="font-heading text-xs font-bold text-white">{t("Tanya STELA")}</span>
          </div>
          <Suspense fallback={<div role="status" className="flex h-96 items-center justify-center bg-white text-xs text-dark-600">{t("Memuat obrolan...")}</div>}>
            <StelaChat focusInput={terbuka} className="min-h-0 h-96 max-h-[calc(100dvh-13rem)] rounded-none border-0 sm:max-h-[calc(100dvh-14rem)]" />
          </Suspense>
        </div>
      )}

      <button
        type="button"
        ref={triggerRef}
        onClick={() => {
          setPernahDibuka(true);
          setTerbuka((open) => !open);
        }}
        aria-expanded={terbuka}
        aria-controls="stela-widget-panel"
        aria-label={t(terbuka ? 'Tutup obrolan STELA' : 'Buka obrolan dengan STELA')}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-card transition-transform duration-300 hover:scale-105"
      >
        {terbuka ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
};

export default StelaWidget;
