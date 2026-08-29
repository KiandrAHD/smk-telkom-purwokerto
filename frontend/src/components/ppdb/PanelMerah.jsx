import { BellRing, CheckCircle2, Radar } from 'lucide-react';
import fotoSiswa from '../../assets/jurusan/showcase-rpl.jpg';
import ribbon from '../../assets/landing/ribbon.png';
import watermark from '../../assets/landing/watermark-logo.png';

const ikon = {
  centang: CheckCircle2,
  kirim: BellRing,
  pantau: Radar,
};

// Panel merah bersisi kiri pada halaman Daftar dan Masuk.
//
// Revisi tim: panel ini semula rata merah dan terasa generik. Sekarang memakai
// tiga lapis identitas yang sudah dipakai situs utama — gradien merah Telkom,
// pita bermotif logo (ribbon.png) yang juga jadi pemisah section di beranda, dan
// watermark logo besar. Semuanya aria-hidden karena murni dekorasi.
const PanelMerah = ({ badge, judul, deskripsi, fitur = [], bantuanLabel, bantuanTeks, foto = true, className = '' }) => (
  <div
    className={`relative flex flex-col overflow-hidden bg-gradient-to-br from-primary-600 via-primary to-primary-800 p-8 text-white sm:p-10 ${className}`}
  >
    {/* Pita bermotif logo, dimiringkan supaya terbaca sebagai tekstur bukan garis */}
    <img
      src={ribbon}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute -left-10 -top-8 w-[140%] max-w-none rotate-[-8deg] opacity-[0.18] mix-blend-overlay"
    />
    <img
      src={ribbon}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute -bottom-10 -right-10 w-[140%] max-w-none rotate-[6deg] opacity-[0.12] mix-blend-overlay"
    />
    <img
      src={watermark}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute -right-6 bottom-1/4 w-40 opacity-[0.10]"
    />
    {/* Cahaya lembut di sudut atas supaya gradiennya tidak terasa datar */}
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl"
    />

    <div className="relative flex h-full flex-col">
      {badge && (
        <span className="inline-flex w-fit items-center rounded-full bg-white/20 px-4 py-1.5 text-[11px] font-bold backdrop-blur-sm">
          {badge}
        </span>
      )}

      <h2 className="mt-7 whitespace-pre-line font-heading text-3xl font-extrabold leading-tight sm:text-4xl">
        {judul}
      </h2>

      <p className="mt-4 max-w-sm text-xs leading-relaxed text-white/85 sm:text-sm">{deskripsi}</p>

      <ul className="mt-8 space-y-3">
        {fitur.map((f) => {
          const Ikon = ikon[f.icon] ?? CheckCircle2;
          return (
            <li
              key={f.teks}
              className="flex items-center gap-3 rounded-xl bg-white/12 px-4 py-3 text-xs font-medium backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <Ikon className="h-4 w-4 flex-shrink-0" />
              {f.teks}
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
            alt="Siswa SMK Telkom Purwokerto sedang belajar"
            className="h-full min-h-32 w-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
      )}

      {bantuanTeks && (
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-8 text-[11px]">
          <span className="text-white/70">{bantuanLabel}</span>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noreferrer"
            className="font-heading font-bold text-white underline-offset-4 hover:underline"
          >
            {bantuanTeks}
          </a>
        </div>
      )}
    </div>
  </div>
);

export default PanelMerah;
