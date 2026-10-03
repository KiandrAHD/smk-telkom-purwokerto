import { useLanguage } from '../../context/LanguageContext';
import { useLocation } from 'react-router-dom';
import { BellRing, CheckCircle2, Radar } from 'lucide-react';
import { buatLinkFlexBox } from '../../data/dummyData';
import fotoSiswa from '../../assets/ppdb/login-spmb-2027-2028.png';

const ikon = {
  centang: CheckCircle2,
  kirim: BellRing,
  pantau: Radar,
};

// Panel informasi pada halaman Daftar dan Masuk dengan latar gradien merah.
const PanelMerah = ({ badge, judul, deskripsi, fitur = [], bantuanLabel, bantuanTeks, foto = true, className = '' }) => {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  return (
  <div
    className={`relative flex flex-col overflow-hidden bg-gradient-to-br from-primary-600 via-primary to-primary-800 p-8 text-white sm:p-10 ${className}`}
  >
    <div className="relative flex h-full flex-col">
      {badge && (
        <span className="inline-flex w-fit items-center rounded-full bg-white/20 px-4 py-1.5 text-[11px] font-bold backdrop-blur-sm">
          {t(badge)}
        </span>
      )}

      <h2 className="mt-7 whitespace-pre-line font-heading text-3xl font-extrabold leading-tight sm:text-4xl">
        {t(judul)}
      </h2>

      <p className="mt-4 max-w-sm text-xs leading-relaxed text-white/85 sm:text-sm">{t(deskripsi)}</p>

      <ul className="mt-8 space-y-3">
        {fitur.map((f) => {
          const Ikon = ikon[f.icon] ?? CheckCircle2;
          return (
            <li
              key={f.teks}
              className="flex items-center gap-3 rounded-xl bg-white/12 px-4 py-3 text-xs font-medium backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <Ikon className="h-4 w-4 flex-shrink-0" />
              {t(f.teks)}
            </li>
          );
        })}
      </ul>

      {/* Revisi tim: sisa ruang di bawah daftar fitur sebelumnya kosong. Foto
          siswa ditaruh di sini dengan flex-1 supaya ia yang menyerap ruang lebih,
          bukan malah memaksa panel jadi lebih tinggi di layar pendek. */}
      {foto && (
        <div className="mt-7 hidden min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/25 sm:block">
          <img
            src={fotoSiswa}
            alt={t("Siswa SMK Telkom Purwokerto sedang belajar")}
            className="h-full min-h-32 w-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
      )}

      {bantuanTeks && (
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-8 text-[11px]">
          <span className="text-white/70">{t(bantuanLabel)}</span>
          <a
            // Nomor diambil dari ppdbMeta, bukan ditulis di sini. Sebelumnya
            // panel ini memuat nomor placeholder sendiri, sehingga tombol
            // bantuan di alur PPDB mengarah ke nomor yang tidak ada.
            href={buatLinkFlexBox('ppdb', { halaman: pathname })}
            target="_blank"
            rel="noreferrer"
            className="font-heading font-bold text-white underline-offset-4 hover:underline"
          >
            {t(bantuanTeks)}
          </a>
        </div>
      )}
    </div>
  </div>
);
};

export default PanelMerah;
