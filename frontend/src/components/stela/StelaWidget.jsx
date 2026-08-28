import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, X } from 'lucide-react';
import StelaChat from './StelaChat';
import maskot from '../../assets/pengumuman/stela-bot.png';

// Gelembung chat yang mengambang di seluruh halaman publik. Sengaja tidak
// dipasang di /stela karena di sana chat-nya sudah jadi isi halaman.
const StelaWidget = () => {
  const [terbuka, setTerbuka] = useState(false);
  const { pathname } = useLocation();

  if (pathname === '/stela') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {terbuka && (
        <div className="w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl shadow-card">
          <div className="flex items-center gap-2.5 bg-primary px-4 py-3">
            <img src={maskot} alt="" aria-hidden="true" className="h-7 w-7 object-contain" />
            <span className="font-heading text-xs font-bold text-white">Tanya STELA</span>
          </div>
          <StelaChat className="h-96 rounded-none border-0" />
        </div>
      )}

      <button
        type="button"
        onClick={() => setTerbuka((t) => !t)}
        aria-expanded={terbuka}
        aria-label={terbuka ? 'Tutup obrolan STELA' : 'Buka obrolan dengan STELA'}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-card transition-transform duration-300 hover:scale-105"
      >
        {terbuka ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
};

export default StelaWidget;
