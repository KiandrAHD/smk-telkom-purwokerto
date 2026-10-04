import { useLanguage } from '../../context/LanguageContext';
import { useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';
import { ppdbLangkahPortal } from '../../data/dummyData';
import { usePpdb } from '../../context/PpdbContext';

// Indikator langkah untuk tahap portal. Langkah aktif dibaca dari URL, bukan
// dioper sebagai prop, supaya tidak ada halaman yang lupa memperbaruinya.
//
// Garis pengisi memakai transisi lebar, jadi saat pengguna menekan "Lanjut"
// perpindahannya terlihat bergerak, bukan meloncat.
const PpdbProgress = () => {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const { nomorRegistrasi } = usePpdb();
  const aktif = nomorRegistrasi && ['/spmb/status', '/spmb/dokumen-peserta'].includes(pathname) ? ppdbLangkahPortal.length - 1 : Math.max(
    0,
    ppdbLangkahPortal.findIndex((l) => pathname.startsWith(l.to))
  );
  const persen = ppdbLangkahPortal.length > 1 ? (aktif / (ppdbLangkahPortal.length - 1)) * 100 : 0;

  return (
    <nav aria-label={t("Progres pendaftaran")} className="mb-7 print:hidden">
      <ol className="relative flex items-start justify-between">
        {/* Rel abu + garis merah yang memanjang. Keduanya diletakkan di belakang
            titik langkah, sejajar dengan pusat lingkaran (h-9 -> 18px). */}
        <span
          aria-hidden="true"
          className="absolute left-0 right-0 top-[18px] h-0.5 -translate-y-1/2 rounded-full bg-dark-200"
        />
        <span
          aria-hidden="true"
          style={{ width: `${persen}%` }}
          className="absolute left-0 top-[18px] h-0.5 -translate-y-1/2 rounded-full bg-primary transition-[width] duration-700 ease-out"
        />

        {ppdbLangkahPortal.map((langkah, i) => {
          const selesai = i < aktif;
          const kini = i === aktif;
          return (
            <li key={langkah.id} className="relative flex flex-1 flex-col items-center gap-2 text-center">
              <span
                aria-current={kini ? 'step' : undefined}
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 font-heading text-[11px] font-bold transition-all duration-500 ${
                  selesai
                    ? 'border-primary bg-primary text-white'
                    : kini
                      ? 'bg-white scale-110 border-primary text-primary shadow-card'
                      : 'bg-white border-dark-200 text-dark-400'
                }`}
              >
                {selesai ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span
                className={`text-[10px] font-bold transition-colors duration-500 sm:text-[11px] ${
                  kini || selesai ? 'text-dark-900' : 'text-dark-400'
                }`}
              >
                {t(langkah.label)}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default PpdbProgress;
