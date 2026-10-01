# Implementasi Footer dan Konten Resmi — 1 Oktober 2026

Kode di bawah merupakan salinan lengkap komponen Footer saat ini beserta CSS footer yang dipakai proyek. Gunakan pada stack React, React Router, dan Tailwind CSS v4 yang sudah terpasang; token warna dan font tetap mengikuti index.css proyek.

## Berkas dan dependensi lokal

| Berkas | Fungsi |
| --- | --- |
| frontend/src/components/Footer.jsx | Komponen footer lengkap; logo berada setelah ikon media sosial. |
| frontend/src/index.css | Gutter aksen samping, band bawah pada aliran normal, dan viewport sprite logo. |
| frontend/src/assets/footer/competition-supporters.png | Bitmap unggahan asli berukuran 1920 × 1080; tidak diedit atau dipotong. |
| frontend/src/assets/landing/figma-section-accent.png | Aset aksen native yang sudah dipakai website. |
| frontend/src/data/dummyData.js | footerData dan snapshot informasi resmi melalui officialContentAudit. |
| frontend/scripts/uji-footer-supporters.mjs | Pemeriksaan render jumlah logo, nama aksesibel, tautan, dimensi PNG, serta jumlah aksen. |

Lima logo memakai satu PNG sebagai sprite CSS. Wrapper masing-masing logo menampilkan area logo dengan tambahan 2 px tepi putih agar anti-alias tetap utuh; bentuk dan warna bitmap sumber dipertahankan. Grid dua kolom menempatkan badge JHIC di tengah baris terakhir. Hanya Jagoan Hosting memiliki tujuan tautan yang sudah terverifikasi; empat logo lain tidak diberi URL yang ditebak.

## Batas kesesuaian Figma

Group footer Figma 24:776 memiliki 9 motif dengan penempatan yang dapat menimbulkan clipping dan overlap. Website mempertahankan keputusan simetris sebelumnya: 2 motif kiri, 2 kanan, 3 bawah kiri, dan 3 bawah kanan, sehingga totalnya 10. Aset native, arah 0° dan −90°, serta opacity efektif 0,30 dipertahankan. Posisi responsif menggunakan gutter terpisah dan band bawah pada aliran normal agar dekorasi tidak memasuki area teks.

Implementasi ini tidak diklaim pixel-perfect terhadap jumlah dan koordinat group Figma tersebut. Perbedaannya disengaja untuk memenuhi permintaan simetri dan larangan overlap; CSS tidak menambahkan aksen di dalam teks footer.

## Komponen lengkap

Lokasi: frontend/src/components/Footer.jsx. Komentar di JSX menjelaskan pemisahan aksen dan penambahan logo. Kontak, menu, peta, serta tautan sosial tetap dirender dari footerData yang sudah ada.

```jsx
import { LockKeyhole, Mail, MapPin, Phone } from 'lucide-react';
import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { footerData } from '../data/dummyData';
import footerAccent from '../assets/landing/figma-section-accent.png';
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
    <div className="relative pt-7 lg:pt-9">
      {/* Area dekorasi samping tidak memasuki container teks saat layar menyempit. */}
      <div aria-hidden="true" className="footer-accent-side footer-accent-side-left pointer-events-none select-none">
        <img src={footerAccent} alt="" className="footer-accent" />
        <img src={footerAccent} alt="" className="footer-accent" />
      </div>
      <div aria-hidden="true" className="footer-accent-side footer-accent-side-right pointer-events-none select-none">
        <img src={footerAccent} alt="" className="footer-accent" />
        <img src={footerAccent} alt="" className="footer-accent" />
      </div>

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

    {/* Band ini mengikuti tinggi konten, bukan koordinat top tetap. */}
    <div aria-hidden="true" className="footer-accent-band pointer-events-none select-none">
      <div className="footer-accent-group">
        <img src={footerAccent} alt="" className="footer-accent footer-accent-turned" />
        <img src={footerAccent} alt="" className="footer-accent footer-accent-turned" />
        <img src={footerAccent} alt="" className="footer-accent" />
      </div>
      <div className="footer-accent-group justify-self-end">
        <img src={footerAccent} alt="" className="footer-accent footer-accent-turned" />
        <img src={footerAccent} alt="" className="footer-accent footer-accent-turned" />
        <img src={footerAccent} alt="" className="footer-accent" />
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

Lokasi: frontend/src/index.css. Tambahkan atau gantikan blok footer berikut dalam stylesheet proyek, bukan seluruh file index.css.

```css
/* Aksen footer memiliki area sendiri; zoom tidak dapat memindahkannya ke teks. */
.site-footer {
  --footer-accent-size: clamp(2rem, 8vw, 8rem);
  --footer-accent-gutter: clamp(1rem, 6.5vw, 8rem);
  isolation: isolate;
}

.footer-content {
  width: calc(100% - 2 * var(--footer-accent-gutter));
}

.footer-accent {
  display: block;
  width: var(--footer-accent-size);
  height: var(--footer-accent-size);
  max-width: none;
  flex-shrink: 0;
  object-fit: contain;
  /* Export asli memuat alpha 0.68; hasil akhir mengikuti fill footer Figma 0.30. */
  opacity: calc(0.3 / 0.68);
  transform: matrix(1, -1.1058862159352145e-16, 1.1058862159352145e-16, 1, 0, 0);
}

.footer-accent-turned {
  transform: matrix(-4.371139183945161e-8, -1, 1, -4.371139183945161e-8, 0, 0);
}

/* Motif muat utuh di gutter; tidak perlu dipotong untuk menghindari teks. */
.footer-accent-side {
  position: absolute;
  inset-block: 0;
  width: max(var(--footer-accent-gutter), calc((100% - 80rem) / 2));
  display: grid;
  grid-template-rows: repeat(2, minmax(0, 1fr));
  align-items: center;
  justify-items: center;
  gap: 1rem;
  padding-inline: clamp(0.25rem, 0.8vw, 1rem);
}

.footer-accent-side-left {
  left: 0;
}

.footer-accent-side-right {
  right: 0;
}

.footer-accent-side .footer-accent {
  width: min(100%, var(--footer-accent-size));
  height: auto;
}

/* Aliran normal menempatkan motif bawah setelah daftar Menu/Kontak selesai. */
.footer-accent-band {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: center;
  min-height: calc(var(--footer-accent-size) + 2rem);
  gap: 1rem;
  padding-block: 1rem;
  /* Inset kiri/kanan sama dan tetap memberi ruang untuk tombol STELA. */
  padding-inline: clamp(5rem, 8vw, 6rem);
}

.footer-accent-group {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.25rem;
  width: min(100%, calc(3 * var(--footer-accent-size) + 0.5rem));
}

.footer-accent-band .footer-accent {
  width: 100%;
  height: auto;
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
}
.footer-supporter-logo-jagoan img {
  width: 1032.258065%;
  left: -202.150538%;
  top: -760.655738%;
}

.footer-supporter-logo-komdigi {
  aspect-ratio: 128 / 111;
  max-width: 80px;
}
.footer-supporter-logo-komdigi img {
  width: 1500%;
  left: -489.0625%;
  top: -399.099099%;
}

.footer-supporter-logo-garuda {
  aspect-ratio: 179 / 96;
  max-width: 120px;
}
.footer-supporter-logo-garuda img {
  width: 1072.625698%;
  left: -450.837989%;
  top: -468.75%;
}

.footer-supporter-logo-ngalup {
  aspect-ratio: 376 / 63;
}
.footer-supporter-logo-ngalup img {
  width: 510.638298%;
  left: -273.404255%;
  top: -741.269841%;
}

.footer-supporter-logo-jhic {
  aspect-ratio: 319 / 176;
  max-width: 140px;
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
node scripts/uji-konten-resmi.mjs
npm run lint
npm run build
```

Pada pemeriksaan visual, ukur .footer-supporter-logo sebagai area logo yang terlihat. Bounding box img sprite lebih besar daripada wrapper karena memuat kelima logo dan ruang putih sumber; overflow:hidden membatasi tampilannya tanpa mengubah bitmap.

## Hasil verifikasi

| Pemeriksaan | Hasil |
| --- | --- |
| ESLint seluruh frontend | Lulus. |
| Build produksi Vite | Lulus; peringatan chunk utama sekitar 584 kB tetap ada dan berada di luar lingkup perubahan footer/konten. |
| Render footer | Tepat 5 logo bernama aksesibel dan 10 motif simetris. |
| Bukti prestasi dengan 0/1/3/4/6 data | Tidak crash atau menduplikasi kartu; navigasi muncul hanya jika lebih dari 4 data. |
| Footer pada lebar 390/768/911/1094/1366 CSS px | Tidak ada scroll horizontal, motif keluar viewport, atau perpotongan aksen dengan area teks. Kelima logo termuat. |
| Simulasi skala | Lebar 1094 px dengan DPR 1,25 dan 911 px dengan DPR 1,5 lulus pemeriksaan geometri. Pengaturan display Windows tidak diubah. |
| Empat section terkait | Profil Sekolah, BKK, Pengumuman dan rekapnya diperiksa pada 390/768/911/1094 px tanpa overflow horizontal. Prestasi diperiksa pada 390/768/1094/1366 px dengan empat foto bukti termuat. |
| Foto alumni | Ketiga foto resmi termuat tanpa fallback gambar. |
| Console browser lokal | Tidak ada error atau warning yang tertangkap selama pemeriksaan halaman terkait. |
| git diff --check | Lulus. |

Data prestasi yang dikelola melalui dashboard masih memuat placeholder dan satu foto yang belum tersedia. Data tersebut tetap dipertahankan sesuai keputusan pengguna sebelumnya, sehingga laporan ini tidak menyatakan seluruh informasi dan gambar di website sudah tervalidasi. Foto bukti baru dan avatar alumni memakai URL HTTPS situs resmi; jika sumber dihapus, ContentImage yang sudah ada menyediakan fallback.

Tangkapan footer lengkap tersedia di D:/LombaTelkom/qa-output/footer-supporters-complete.png. Perubahan hanya berada pada working tree; tidak ada commit atau push otomatis.
