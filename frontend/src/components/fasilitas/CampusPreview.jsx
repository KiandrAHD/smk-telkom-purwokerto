import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ImageOff, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function CampusPreview({ facility, closing, onClose, onList }) {
  const { t } = useLanguage();
  const close = useRef(null), fadeTimer = useRef(null);
  const [loaded, setLoaded] = useState(null), [previous, setPrevious] = useState(null), [failed, setFailed] = useState(null);
  const item = facility.content, src = item.image;
  const hasPhoto = Boolean(src && failed !== src);
  const behind = loaded !== src ? loaded : previous;
  useEffect(() => { close.current?.focus({ preventScroll: true }); return () => clearTimeout(fadeTimer.current); }, []);
  const photoReady = async event => {
    const image = event.currentTarget;
    await image.decode().catch(() => {});
    if (!image.isConnected) return;
    clearTimeout(fadeTimer.current); setPrevious(loaded); setLoaded(src);
    fadeTimer.current = setTimeout(() => setPrevious(null), 320);
  };
  return <aside id="campus-preview" role="dialog" aria-modal="false" aria-labelledby="campus-preview-title" data-campus-preview={item.id} data-closing={closing} className="campus-preview overflow-hidden rounded-2xl border border-dark-200 bg-white shadow-card">
    <div className="relative h-40 overflow-hidden bg-dark-50">
      {behind && <img src={behind} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />}
      {hasPhoto ? <img key={src} src={src} alt={t('Foto fasilitas {name}', { name: t(item.name) })} onLoad={photoReady} onError={() => setFailed(src)} className={`campus-preview-photo absolute inset-0 h-full w-full object-cover ${loaded === src ? 'opacity-100' : 'opacity-0'}`} /> :
        <div data-campus-photo-fallback className="campus-photo-fallback absolute inset-0 flex flex-col items-center justify-center gap-2 bg-dark-50 px-5 text-center text-xs text-dark-500"><ImageOff className="size-8" aria-hidden="true" /><span>{t('Dokumentasi fasilitas ini belum tersedia.')}</span></div>}
      <button ref={close} type="button" onClick={onClose} aria-label={t('Tutup informasi fasilitas')} className="absolute right-2 top-2 grid size-11 place-items-center rounded-full bg-white text-dark-700 shadow-soft hover:bg-dark-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"><X className="size-5" aria-hidden="true" /></button>
    </div>
    <div className="p-4">
      <h3 id="campus-preview-title" className="font-heading text-base font-bold text-primary" aria-live="polite" aria-atomic="true">{t(item.name)}</h3>
      <p className="mt-2 min-h-14 text-xs leading-relaxed text-dark-600">{t(item.preview || 'Informasi fasilitas ini belum tersedia. Nama dan titik lokasi mengikuti referensi peta sekolah.')}</p>
      {item.image && <p className="mt-2 text-[10px] leading-relaxed text-dark-500">{t('Foto dari koleksi fasilitas website.')}</p>}
      {facility.list && <button type="button" onClick={() => onList(facility.list)} className="mt-3 inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">{t('Lihat daftar fasilitas')}<ArrowRight className="size-4" aria-hidden="true" /></button>}
    </div>
  </aside>;
}
