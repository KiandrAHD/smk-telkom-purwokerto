import { useLanguage } from '../../context/LanguageContext';
import { formatPublicDate } from '../../utils/publicContent';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// tampilkanLihatSemua dimatikan saat komponen ini menjadi isi halaman
// /pengumuman/populer itu sendiri. Di sana tombolnya akan menunjuk ke halaman
// yang sedang dibuka -- tombol yang diklik tapi tidak ke mana-mana.
const PengumumanPopulerCard = ({ items = [], tampilkanLihatSemua = true }) => {
  const { t, locale } = useLanguage();
  return (
  <div className="rounded-xl bg-white p-4 shadow-card">
    <div className="flex items-center justify-between gap-3">
      <h2 className="font-heading text-sm font-extrabold text-dark-900">{t("Pengumuman Terbaru")}</h2>
      {tampilkanLihatSemua && (
        <Link
          to="/pengumuman/populer"
          className="inline-flex items-center gap-1.5 rounded-full border border-primary px-2.5 py-1 font-heading text-[10px] font-extrabold text-primary transition-colors hover:bg-primary hover:text-white"
        >{t("Lihat Semua")}<ArrowRight className="h-2.5 w-2.5" />
        </Link>
      )}
    </div>

    <ul className="mt-4 space-y-4">
      {(tampilkanLihatSemua ? items.slice(0, 5) : items).map((item, i) => (
        <li key={item.slug}>
          <Link to={`/pengumuman/${item.slug}`} className="flex items-start gap-3">
            <span
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary-50 font-heading text-base font-bold text-primary"
            >
              {i + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-heading text-[11px] font-extrabold leading-snug text-dark-900">
                {item.title}
              </span>
              <span className="mt-1 flex flex-wrap items-center gap-2 font-heading text-[9px] font-extrabold text-dark-600">
                {formatPublicDate(item.iso, {}, locale)}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  </div>
  );
};

export default PengumumanPopulerCard;
