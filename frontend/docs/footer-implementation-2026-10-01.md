# Implementasi Footer dan Perbaikan Tampilan — 1 Oktober 2026

Dokumen ini merupakan arsip implementasi footer sebelum perbaikan overlap terbaru. Canvas absolut dan kode di bawah sudah digantikan oleh margin dekoratif serta baris aksen dalam alur normal. Implementasi aktif berada di src/components/Footer.jsx dan src/index.css; hasil verifikasi terbaru dicatat di [public-ui-update-2026-10-01.md](public-ui-update-2026-10-01.md). Bentuk, warna, dan aset native tetap dipertahankan.

## Status lima perbaikan

| Poin | Status implementasi | Lokasi |
| --- | --- | --- |
| 1. Logo yang hilang | Menunggu gambar logo khusus dari pengguna; belum mengganti spacer dengan simbol yang ditebak. | src/components/AboutSection.jsx, badge Kurikulum Industri. |
| 2. Empat aksen Beranda | Variant achievements menggunakan pola posisi relatif, batas ukuran, aset, dan matriks orientasi yang sama dengan empat motif kanan schoolTeachers. Tinggi kedua section dapat berbeda sehingga koordinat global halaman tidak sama. | src/components/SectionAccents.jsx. |
| 3. Section video duplikat | Dihapus dari /profil-sekolah berdasarkan konfirmasi pengguna. Video pada Tentang SMK Telkom, komponen video/galeri shared, dan aset shared tetap dipertahankan. | src/pages/TentangPage.jsx, src/data/dummyData.js. |
| 4. Logo pendukung | Lima logo diperkecil dengan batas lebar 100/60/85/100/100 px. | src/index.css, .footer-supporter-logo-<id>. |
| 5. Aksen footer | Susunan simetris 10 motif dan band tambahan diganti dengan 9 node native dari frame footer Figma 90:496. Pemeriksaan browser ulang masih harus diselesaikan sebelum klaim final. | src/components/Footer.jsx, src/index.css. |

## Berkas dan dependensi lokal

| Berkas | Fungsi |
| --- | --- |
| frontend/src/components/Footer.jsx | Komponen footer lengkap; logo pendukung tetap setelah ikon media sosial. |
| frontend/src/index.css | Canvas aksen 1847 × 350, matriks setiap node, mask, serta viewport sprite logo. |
| frontend/src/assets/footer/competition-supporters.png | Unggahan asli 1920 × 1080, tanpa perubahan bitmap. |
| frontend/src/assets/footer/figma-footer-mask.png | Mask native Figma yang membentuk motif Telkom. |
| frontend/src/assets/footer/figma-footer-fill.svg | Fill native Figma #CECECE dengan fill-opacity 0.3. |
| frontend/src/data/dummyData.js | footerData dan metadata officialContentAudit yang sudah digunakan. |
| frontend/scripts/uji-footer-supporters.mjs | Pemeriksaan render 5 logo, 9 node, ukuran canvas, fill, dan mask. |
| frontend/scripts/uji-galeri-fasilitas.mjs | Menjaga video utama dan galeri RPL setelah section duplikat dihapus. |

Kelima logo memakai satu PNG sebagai sprite CSS. Wrapper mempertahankan tambahan 2 px tepi putih untuk anti-alias; grid dua kolom tetap menempatkan badge JHIC di tengah baris terakhir. Tautan logo tetap mengikuti sumber yang sebelumnya diverifikasi, tanpa menambahkan tujuan baru.

## Ukuran lima logo

Dimensi merupakan batas maksimum wrapper; logo dapat lebih kecil jika kolom footer lebih sempit. Tinggi dihitung dari aspect-ratio asli viewport sprite, bukan dipaksa sama.

| Logo | Batas lebar sebelumnya | Batas lebar sekarang | Tinggi pada batas baru |
| --- | --- | --- | --- |
| Jagoan Hosting | 100% lebar kolom, tanpa max-width | 100 px | 32.8 px |
| KOMDIGI | 80 px | 60 px | 52.0 px |
| Garuda Spark | 120 px | 85 px | 45.6 px |
| NGALUP.CO | 100% lebar kolom, tanpa max-width | 100 px | 16.8 px |
| JHIC | 140 px | 100 px | 55.2 px |

## Referensi literal Figma dan batas kesesuaian

Sumber saat ini adalah frame footer 90:496 pada file Figma ca2iX76GpJSr0QC7Qyv9RV. Canvas lokal berukuran 1847 × 350 px. Sembilan node berikut mengikuti urutan render yang sama dengan daftar footerAccentNodes; warna fill seluruh motif #CECECE, fill-opacity 0.3. Grup setiap motif berukuran 232.934326171875 × 232.934326171875 px.

X/Y pada tabel merupakan origin translasi matriks lokal, bukan bounding box setelah rotasi. Angka desimal dan matriks lengkap dipertahankan dalam CSS di bawah.

| Urutan | Node | X lokal (px) | Y lokal (px) | Orientasi CSS |
| --- | --- | --- | --- | --- |
| 0 | 90:508 | 274 | 222.99951171875 | 0°, epsilon native dipertahankan |
| 1 | 90:511 | 1585 | 226.99951171875 | 0°, epsilon native dipertahankan |
| 2 | 90:514 | 93 | 453.9345703125 | −90°, epsilon native dipertahankan |
| 3 | 90:517 | 1404 | 457.9345703125 | −90°, epsilon native dipertahankan |
| 4 | 90:520 | 1203 | 453.9345703125 | −90°, epsilon native dipertahankan |
| 5 | 90:523 | 333.934326171875 | 620.9345703125 | 180°, epsilon native dipertahankan |
| 6 | 90:536 | −140 | 0 | 0°, epsilon native dipertahankan |
| 7 | 90:539 | 1695 | 39 | 0°, epsilon native dipertahankan |
| 8 | 90:542 | −130 | 185 | 0°, epsilon native dipertahankan |

Fill SVG berukuran 187.121 × 187.414 px, dengan offset lokal 28.31273078918457 / 13.199074745178223 px dan mask berukuran 232.934326171875 px pada kedua sumbu. Motif yang berada di luar canvas mengikuti clipping sumber; jumlah node DOM tidak sama dengan jumlah motif yang terlihat utuh. Tidak ada penambahan motif atau band yang mengubah tinggi layout.

Canvas mengikuti lebar footer melalui scale(100cqw / 1847px) dan ditambatkan ke bawah footer. Pada lebar 1847 CSS px, skala canvas menjadi 1 sehingga koordinat lokal identik dengan tabel. Posisi Y absolut halaman tetap mengikuti tinggi konten website yang sudah ada, termasuk logo tambahan dan section lain; implementasi ini tidak menyatakan koordinat global halaman identik dengan Figma. Pada breakpoint lain, geometri canvas diskalakan secara proporsional, bukan mempertahankan ukuran pixel desktop.

Layer aksen bersifat pointer-events:none dan aria-hidden. Konten menggunakan relative z-10 agar dekorasi tidak mengambil interaksi atau menutupi teks. Kesamaan path/mask/fill dan koordinat lokal perlu dibedakan dari jaminan pixel-perfect seluruh footer pada semua ukuran layar. Pengujian geometri serta perbandingan screenshot masih diperlukan.

## Komponen lengkap

Lokasi: frontend/src/components/Footer.jsx. Gunakan aset lokal dan footerData yang sudah tersedia di proyek.

```jsx
import { LockKeyhole, Mail, MapPin, Phone } from 'lucide-react';
import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { footerData } from '../data/dummyData';
import footerAccentFill from '../assets/footer/figma-footer-fill.svg';
import competitionSupporters from '../assets/footer/competition-supporters.png';

const socialIcons = {
  instagram: FaInstagram,
  youtube: FaYoutube,
  tiktok: FaTiktok,
};

const supporterLogos = [
  { id: 'jagoan', name: 'Jagoan Hosting', href: 'https://www.jagoanhosting.com/' },
  { id: 'komdigi', name: 'Kementerian Komunikasi dan Digital Republik Indonesia' },
  { id: 'garuda', name: 'Garuda Spark Innovation Hub' },
  { id: 'ngalup', name: 'NGALUP.CO' },
  { id: 'jhic', name: 'Jagoan Hosting Innovation Competition 2026' },
];

const footerAccentNodes = ['90:508', '90:511', '90:514', '90:517', '90:520', '90:523', '90:536', '90:539', '90:542'];

const LinkColumn = ({ title, links }) => (
  <div className="min-w-0">
    <h3 className="font-heading text-xs font-bold text-dark-900">{title}</h3>
    <ul className="mt-3 space-y-2">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            to={link.href}
            className="text-[11px] text-dark-500 transition-colors hover:text-primary"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => (
  <footer className="site-footer bg-white">
    {/* Native Figma mask and fill retain the original nine motifs and clipping. */}
    <div aria-hidden="true" className="footer-accent-layer pointer-events-none select-none">
      <div className="footer-accent-canvas" data-figma-node="90:496" data-figma-width="1847" data-figma-height="350">
        {footerAccentNodes.map((node) => (
          <div key={node} className="footer-accent" data-figma-node={node}>
            <img src={footerAccentFill} alt="" className="footer-accent-shape" />
          </div>
        ))}
      </div>
    </div>
    <div className="relative pt-7 lg:pt-9">

      <div className="footer-content relative z-10 mx-auto max-w-7xl px-4 pb-7 sm:px-6 lg:px-8 lg:pb-9">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr_1.4fr]">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <Logo className="h-11 w-11" />
              <span className="font-heading text-base font-extrabold leading-[1.15] text-dark-900">
                SMK Telkom
                <br />
                Purwokerto
              </span>
            </div>
            <p className="mt-3 max-w-xs text-[11px] leading-relaxed text-dark-500">
              {footerData.tagline}
            </p>
            <div className="mt-4 flex items-center gap-3">
              {footerData.socials.map((social) => {
                const Icon = socialIcons[social.icon];
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${social.name} SMK Telkom Purwokerto`}
                    className="relative text-dark-500 transition-colors hover:text-primary before:absolute before:-inset-2 before:content-['']"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>

            {/* Lima logo memakai bitmap asli; CSS hanya membatasi area putih tiap logo. */}
            <div className="mt-6 max-w-[280px]">
              <h3 className="font-heading text-xs font-bold text-dark-900">Supported by</h3>
              <ul className="footer-supporters mt-3" aria-label="Pendukung lomba">
                {supporterLogos.map(({ id, name, href }) => {
                  const logo = (
                    <span className={`footer-supporter-logo footer-supporter-logo-${id}`}>
                      <img src={competitionSupporters} alt={name} loading="lazy" decoding="async" width="1920" height="1080" />
                    </span>
                  );
                  return (
                    <li key={id} className={id === 'jhic' ? 'col-span-2' : undefined}>
                      {href ? (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="footer-supporter-link" aria-label={`Kunjungi ${name}`}>
                          {logo}
                        </a>
                      ) : logo}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <LinkColumn title="Menu" links={footerData.menu} />
          <LinkColumn title="Informasi" links={footerData.informasi} />

          {/* Kontak */}
          <div className="min-w-0 [overflow-wrap:anywhere]">
            <h3 className="font-heading text-xs font-bold text-dark-900">Kontak</h3>
            <ul className="mt-3 space-y-2 text-[11px] text-dark-500">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3 w-3 flex-shrink-0" />
                {footerData.kontak.address}
              </li>
              <li>
                <a
                  href={`tel:${footerData.kontak.phone.replace(/[^+\d]/g, '')}`}
                  className="flex items-start gap-2 transition-colors hover:text-primary"
                >
                  <Phone className="mt-0.5 h-3 w-3 flex-shrink-0" />
                  {footerData.kontak.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${footerData.kontak.email}`}
                  className="flex items-start gap-2 transition-colors hover:text-primary"
                >
                  <Mail className="mt-0.5 h-3 w-3 flex-shrink-0" />
                  {footerData.kontak.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Peta lokasi */}
          <div className="col-span-2 lg:col-span-1">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                footerData.kontak.mapsQuery ?? footerData.kontak.address
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Buka lokasi SMK Telkom Purwokerto di Google Maps"
              className="block overflow-hidden rounded-xl transition-transform hover:scale-[1.01]"
            >
              <img
                src={footerData.map}
                alt="Peta lokasi SMK Telkom Purwokerto"
                loading="lazy"
                className="w-full rounded-xl border border-dark-100 object-cover"
              />
            </a>
          </div>
        </div>
      </div>
    </div>

    <div className="footer-bottom-bar relative bg-primary text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-2 text-[10px] sm:flex-row sm:px-6 lg:px-8">
        <p>© 2026 SMK Telkom Purwokerto. All Rights Reserved.</p>
        <div className="flex items-center gap-3">
          <span className="underline underline-offset-2">Kebijakan Privasi</span>
          <span aria-hidden="true" className="h-3 border-l border-white/60" />
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 underline-offset-2 transition-opacity hover:opacity-80 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <LockKeyhole className="h-3 w-3" aria-hidden="true" />
            Akses Staf & Admin
          </Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
```

## CSS lengkap yang relevan

Lokasi: frontend/src/index.css. Gantikan blok footer yang lama dengan potongan ini; jangan mengganti seluruh stylesheet.

```css
/* Figma footer: nine native motifs on the original 1847 × 350 canvas. */
.site-footer {
  --footer-accent-gutter: clamp(1rem, 6.5vw, 8rem);
  position: relative;
  container-type: inline-size;
  isolation: isolate;
}

.footer-content {
  width: calc(100% - 2 * var(--footer-accent-gutter));
}

.footer-accent-layer {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.footer-accent-canvas {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 1847px;
  height: 350px;
  transform-origin: left bottom;
  transform: scale(calc(100cqw / 1847px));
}

.footer-accent {
  position: absolute;
  left: 0;
  top: 0;
  width: 232.934326171875px;
  height: 232.934326171875px;
  transform-origin: top left;
}

.footer-accent-shape {
  position: absolute;
  left: 28.31273078918457px;
  top: 13.199074745178223px;
  max-width: none;
  mask-image: url('./assets/footer/figma-footer-mask.png');
  mask-size: 232.934326171875px 232.934326171875px;
  mask-position: -28.31273078918457px -13.199074745178223px;
  mask-repeat: no-repeat;
}

.footer-accent[data-figma-node='90:508'] {
  transform: matrix(1, -1.1058862159352145e-16, 1.1058862159352145e-16, 1, 274, 222.99951171875);
}
.footer-accent[data-figma-node='90:511'] {
  transform: matrix(1, -1.1058862159352145e-16, 1.1058862159352145e-16, 1, 1585, 226.99951171875);
}
.footer-accent[data-figma-node='90:514'] {
  transform: matrix(-4.371139183945161e-8, -1, 1, -4.371139183945161e-8, 93, 453.9345703125);
}
.footer-accent[data-figma-node='90:517'] {
  transform: matrix(-4.371139183945161e-8, -1, 1, -4.371139183945161e-8, 1404, 457.9345703125);
}
.footer-accent[data-figma-node='90:520'] {
  transform: matrix(-4.371139183945161e-8, -1, 1, -4.371139183945161e-8, 1203, 453.9345703125);
}
.footer-accent[data-figma-node='90:523'] {
  transform: matrix(-1, 8.742278367890322e-8, -8.742278367890322e-8, -1, 333.934326171875, 620.9345703125);
}
.footer-accent[data-figma-node='90:536'] {
  transform: matrix(1, -1.1058862159352145e-16, 1.1058862159352145e-16, 1, -140, 0);
}
.footer-accent[data-figma-node='90:539'] {
  transform: matrix(1, -1.1058862159352145e-16, 1.1058862159352145e-16, 1, 1695, 39);
}
.footer-accent[data-figma-node='90:542'] {
  transform: matrix(1, -1.1058862159352145e-16, 1.1058862159352145e-16, 1, -130, 185);
}

/* Sprite logo memakai unggahan asli 1920 × 1080, tanpa mengubah gambar sumber.
   Setiap area menyertakan 2px tepi putih agar anti-alias logo tetap utuh. */
.footer-supporters {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: center;
  gap: 1rem 0.75rem;
}

.footer-supporter-logo {
  position: relative;
  display: block;
  overflow: hidden;
  margin-inline: auto;
  width: 100%;
}

.footer-supporter-logo img {
  position: absolute;
  display: block;
  max-width: none;
  height: auto;
}

.footer-supporter-link {
  display: block;
}

.footer-supporter-logo-jagoan {
  aspect-ratio: 186 / 61;
  max-width: 100px;
}
.footer-supporter-logo-jagoan img {
  width: 1032.258065%;
  left: -202.150538%;
  top: -760.655738%;
}

.footer-supporter-logo-komdigi {
  aspect-ratio: 128 / 111;
  max-width: 60px;
}
.footer-supporter-logo-komdigi img {
  width: 1500%;
  left: -489.0625%;
  top: -399.099099%;
}

.footer-supporter-logo-garuda {
  aspect-ratio: 179 / 96;
  max-width: 85px;
}
.footer-supporter-logo-garuda img {
  width: 1072.625698%;
  left: -450.837989%;
  top: -468.75%;
}

.footer-supporter-logo-ngalup {
  aspect-ratio: 376 / 63;
  max-width: 100px;
}
.footer-supporter-logo-ngalup img {
  width: 510.638298%;
  left: -273.404255%;
  top: -741.269841%;
}

.footer-supporter-logo-jhic {
  aspect-ratio: 319 / 176;
  max-width: 100px;
}
.footer-supporter-logo-jhic img {
  width: 601.880878%;
  left: -457.366771%;
  top: -230.113636%;
}
```

## Empat section konten resmi

Informasi ini berada di halaman terkait, bukan pada footer. Pembaruannya disetujui secara terpisah dan tetap memakai struktur komponen yang sudah ada.

| Halaman / section | Data dan pembaruan | Sumber resmi |
| --- | --- | --- |
| Prestasi / Bukti Prestasi | Empat bukti prestasi beserta foto dan tautan sumber: Muhammad Daffa Izzati pada LKS 2024; tim Aicademy pada JHIC 2025; English Fest UMP 2026; Hanif Rizki Ardianto pada Green Environment Leadership. Angka arsip diberi label artikel agar tidak dianggap jumlah gelar. | [LKS 2024](https://smktelkom-pwt.sch.id/uncategorized/stematel-boyong-medali-lks-2024/), [JHIC 2025](https://smktelkom-pwt.sch.id/berita/6197/), [English Fest UMP 2026](https://smktelkom-pwt.sch.id/berita/stematel-raih-prestasi-english-fest-ump-2026/), [Hanif](https://smktelkom-pwt.sch.id/prestasi-siswa/siswa-smk-telkom-purwokerto-raih-awardee-fully-funded-green-environment-leadership-berkat-inovasi-pengolahan-sampah-plastik-berbasis-iot/) |
| Profil Sekolah / Riwayat | Berdiri 30 Januari 1993; SMK Pusat Keunggulan 2023; prestasi delapan bidang LKS 2024; dua penghargaan CABDIN AWARD 2025; IHT AI Agentic Teacher pada 23–24 September 2026. | [Profil resmi](https://smktelkom-pwt.sch.id/profil/), [Situs sekolah](https://smktelkom-pwt.sch.id/), [CABDIN AWARD](https://smktelkom-pwt.sch.id/berita/stematel-raih-2-penghargaan-dalam-cabdin-award-2025/), [IHT](https://smktelkom-pwt.sch.id/berita/smk-telkom-purwokerto-gelar-iht-ai-agentic-teacher-guru-kembangkan-beragam-solusi-pembelajaran-berbasis-ai/) |
| BKK / Kisah Sukses Alumni | Profil Moh. Khairudin, Tenia Wahyuningrum, dan Alfa Putra Kurnia, disertai foto resmi dan ringkasan testimoni; ringkasan tidak ditampilkan sebagai kutipan verbatim. | [Beranda resmi dan testimoni alumni](https://smktelkom-pwt.sch.id/) |
| Pengumuman / Informasi Resmi dan Rekap | Jadwal psikotes calon guru PPLG 3 Oktober 2026, SPMB DIGITEST 1 2027/2028, STEMATEL Next Pathway, serta tanggal penutupan lowongan guru Pengembangan Gim. Rekap 259 artikel arsip dan 1 artikel pada 1 Oktober 2026 diberi tanggal pemeriksaan. | [Kategori pengumuman resmi](https://smktelkom-pwt.sch.id/wp-json/wp/v2/posts?categories=8), [Hasil seleksi](https://smktelkom-pwt.sch.id/pengumuman/pengumuman-hasil-seleksi-tes-tertulis-microteaching-calon-guru-pplg/), [SPMB](https://smktelkom-pwt.sch.id/pengumuman/spmb-digitest-1-ta-2027-2028-smk-telkom-purwokerto-resmi-dibuka-saatnya-jadi-bagian-dari-nextgens-stematel/) |

Metadata sumber berada di officialContentAudit dalam frontend/src/data/dummyData.js:

```js
export const officialContentAudit = {
  checkedAt: '1 Oktober 2026',
  prestasiSourceUrl: 'https://smktelkom-pwt.sch.id/wp-json/wp/v2/posts?categories=5',
  pengumumanSourceUrl: 'https://smktelkom-pwt.sch.id/wp-json/wp/v2/posts?categories=8',
  alumniSourceUrl: 'https://smktelkom-pwt.sch.id/',
};
```

Angka dan informasi tersebut merupakan snapshot 1 Oktober 2026, bukan pembacaan otomatis setiap kunjungan. Data dashboard dan foto placeholder yang sebelumnya diminta untuk dipertahankan tidak diubah oleh komponen footer.

## Pemeriksaan terarah

Jalankan dari direktori frontend:

```bash
node scripts/uji-footer-supporters.mjs
node scripts/uji-galeri-fasilitas.mjs
node scripts/uji-konten-resmi.mjs
npm run lint
npm run build
```

Pada pemeriksaan logo, ukur .footer-supporter-logo sebagai area yang terlihat. Bounding box img sprite lebih besar daripada wrapper karena juga memuat logo lain dan ruang putih sumber; overflow:hidden pada wrapper membatasi tampilan.

## Hasil tiga putaran verifikasi

Pemeriksaan berikut dijalankan pada implementasi sembilan motif ini, menggunakan preview lokal React/Vite di Chromium. Simulasi DPR bukan penggantian pengaturan Windows atau pengujian browser zoom nyata.

| Putaran | Pemeriksaan | Hasil |
| --- | --- | --- |
| 1 | Jumlah 9 node, ukuran canvas, fill #CECECE / 0.3, mask native, dan matriks setiap node terhadap metadata Figma. | Lulus SSR dan pemeriksaan source; mask PNG asli 466 × 466, fill SVG asli 187.121 × 187.414, sembilan ID sesuai. |
| 2 | Perbandingan bentuk, clipping, posisi lokal, ukuran, urutan layer, serta keterbacaan teks pada viewport 1847 CSS px. | Screenshot dibandingkan dengan crop footer frame Beranda 90:85; delapan motif memotong area terlihat, satu berada di luar area seperti sumber. Canvas mengikuti lebar footer yang tersedia setelah scrollbar; bukan pemaksaan posisi Y halaman Figma. |
| 3 | Breakpoint mobile/tablet/laptop dan simulasi DPR 1.25/1.5; periksa overflow, pembacaan teks, serta lima logo. | Lulus lebar 390, 768, 1094, 1366 CSS px; tidak ada overflow horizontal. Sembilan node dan lima logo termuat. Simulasi 1094/DPR 1.25 serta 1024/DPR 1.5 juga lulus. Dekorasi di bawah konten z-index 10. |

Selisih koordinat setelah normalisasi skala tercatat paling besar 0.042 px pada canvas sumber (kurang dari 0.009 CSS px pada ukuran layar), akibat pembulatan rendering. SVG native juga membulatkan dimensi metadata ke tiga desimal. Karena tinggi konten, typography/footer grid existing, dan posisi Y seluruh halaman berbeda dari Figma, hasil ini tidak diklaim sebagai perbandingan screenshot seluruh halaman yang 100% pixel-identical. Aset, jumlah, orientasi, matriks, dan clipping lokal mengikuti sumber; layout konten tetap mengikuti website.

Video utama dan galeri fasilitas shared lulus scripts/uji-galeri-fasilitas.mjs; halaman /profil-sekolah menampilkan satu tombol video utama dan tidak memuat teks section duplikat. Empat class posisi, ukuran relatif, dan transform aksen Prestasi dibandingkan dengan empat aksen kanan schoolTeachers dan identik. Pemeriksaan npm run lint, npm run build, dan SSR footer lulus. Build masih memberi peringatan chunk utama sekitar 620 kB, di luar lingkup lima perbaikan ini. Tidak ditemukan console error/warning pada preview yang diperiksa.

Bukti screenshot berada di D:/LombaTelkom/qa-output/footer-after-1366.jpg dan footer-after-390.jpg; referensi Figma di footer-figma-reference.png. Pengaturan viewport, DPR, dan reduced motion sementara dikembalikan setelah pengujian.

Data dashboard yang sebelumnya memakai placeholder tetap dipertahankan sesuai keputusan pengguna; tidak ada klaim seluruh informasi atau gambar website sudah tervalidasi. Ringkasan sumber resmi di atas dipertahankan sebagai provenance pekerjaan sebelumnya. Tidak ada commit atau push otomatis.
