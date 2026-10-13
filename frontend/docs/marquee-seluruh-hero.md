# Animated Marquee di Bawah Hero Publik

Implementasi dan QA 13 Oktober 2026. Ruang lingkup: halaman dengan pola `school-hero` / bounded Hero publik. Tidak dipasang otomatis melalui MainLayout, sehingga portal, admin, artikel/detail, kebijakan, STELA, dan NextTel tidak ikut mendapat marquee.

## Audit halaman

| Halaman | Route | Sebelum | Sesudah |
| --- | --- | --- | --- |
| Beranda | / | Animated, setelah section Tentang | Satu animated marquee setelah Hero/QAC |
| Jurusan | /jurusan | Statis setelah daftar jurusan | Satu animated marquee setelah Hero/statistik |
| Profil Sekolah | /profil-sekolah | Statis setelah perjalanan sekolah | Satu animated marquee setelah Hero dan statistik terpisah |
| Profil Guru | /profil-sekolah/guru | Dua divider statis di bawah grid | Satu animated marquee setelah Hero |
| Fasilitas | /fasilitas | Tidak ada | Satu animated marquee setelah Hero |
| Ekstrakurikuler | /ekstrakurikuler | Tidak ada pill marquee | Satu animated marquee setelah Hero |
| Prestasi | /prestasi | Statis setelah prestasi unggulan | Satu animated marquee setelah Hero/statistik |
| BKK | /bkk | Tidak ada | Satu animated marquee setelah Hero/statistik |
| Berita | /berita | Statis setelah sorotan berita | Satu animated marquee setelah seluruh area Hero/breaking news |
| Pengumuman | /pengumuman | Tidak ada | Satu animated marquee setelah Hero/statistik |
| SPMB | /spmb | Animated setelah Hero/QAC | Penempatan tetap; styling/loop shared diperbarui |
| Calendar of Events | /kalender | Animated setelah Hero | Penempatan tetap; styling/loop shared diperbarui |

Halaman detail jurusan/artikel/guru, utility, portal SPMB, dan dashboard tidak memakai pola ini. NextTel adalah halaman alat pemilihan jurusan, bukan Hero publik dengan bounded media/floating cards. Tidak ada navbar/footer, heading, foto, CTA, Hero styles, ukuran QAC/statistik, atau konten section lain yang diubah. Divider lama dipindahkan/diganti; tidak disisakan ticker tambahan di tengah halaman.

## Shared component dan desain

Menggunakan `src/components/RibbonDivider.jsx` dan `RibbonDivider.css` existing dengan prop `animated`. Tidak dibuat komponen atau dependency animasi baru. Varian raster lama tetap tersedia untuk kompatibilitas pemanggil, tetapi semua 12 halaman Hero memakai varian animated.

Empat label mengikuti daftar existing, melalui kamus bahasa website: NEXT GENERATION, SMK PUSAT UNGGULAN, AKREDITASI A, GLOBAL TECHNOPRENEUR. Tidak ada slogan baru. Fill merah/putih bergantian, border merah, radius penuh, teks satu baris/center dan weight 800. Warna dipetakan ke token primary existing, font mengikuti website.

Empat kelopak memakai PNG asli `beranda-150-568.png`, `beranda-150-570.png`, `beranda-150-581.png`, `beranda-150-583.png`, dengan urutan grid kiri-atas, kanan-atas, kiri-bawah, kanan-bawah. Aset tidak diganti, digambar ulang, atau diedit.

Ukuran shared:

- Tinggi pill/kelopak: clamp(2.25rem, 4.4938vw, 5.1875rem).
- Ukuran teks: clamp(0.875rem, 1.7325vw, 2rem).
- Padding pill horizontal: 0.75em, border 2 px, gap antar pill/kelopak 0.5rem.
- Wrapper menyediakan ruang vertikal 1rem di atas dan bawah; tidak mempertahankan aspect-ratio raster yang sebelumnya menghasilkan ruang kosong tambahan. Jarak terhadap Hero mengikuti padding area Hero/Floating Cards existing.
- Overflow dibatasi pada wrapper ticker; tidak ditambahkan clipping global atau fixed height pada Hero.

## Teknik looping

Track terdiri dari dua grup identik. Setiap grup berisi empat siklus lengkap slogan/kelopak untuk menutupi viewport sampai 3840 px yang diuji. Track bergerak dengan transform translateX dari 0 ke -50%, linear, infinite, tanpa track gap. Semua spacing dimiliki masing-masing item sehingga sambungan grup sama dengan spacing normal.

Durasi tunggal 160 detik dipakai seluruh halaman. Jumlah siklus dan durasi sama-sama dua kali versi awal (dua siklus/80 detik), sehingga kecepatan pixel per detik pada viewport yang sama tetap seperti sebelumnya. Tidak ada duration berbeda menurut halaman. `will-change: transform` dipakai hanya pada track.

Track visual memakai aria-hidden. Satu daftar screen-reader berisi empat slogan, sehingga duplikasi tidak diumumkan berulang. Saat prefers-reduced-motion aktif, animasi berhenti dan keempat label terlihat satu kali: satu kolom pada mobile dan dua kolom mulai 640 px. Tidak ada slogan yang tersembunyi hanya karena berada di luar viewport statis.

## Validasi

`scripts/uji-hero-marquee-browser.mjs` dijalankan menggunakan Chrome otomatis pada production preview lokal:

- 12 halaman × viewport 1440, 768, 375, 320 px: tepat satu marquee, urutan setelah Hero/Floating Cards, tidak overlap section berikutnya, tidak ada raster lama, pill seragam, teks tidak terpotong, empat kelopak per aksen, aset termuat, dan tanpa horizontal overflow dokumen.
- Dua grup mempunyai konten identik dan lebar yang sama dengan toleransi rounding subpixel <1 px. Durasi 160s dan easing linear sama di seluruh halaman.
- Viewport 3840 px: track mencakup layar pada fase 0%, 25%, 50%, 75%, 99.9999%, dan 100%; tidak muncul area kosong atau clipping vertikal kelopak.
- Pixel comparison screenshot tepat sebelum/sesudah sambungan: rerata selisih kanal 1.366 dari skala 255, di bawah toleransi 2 untuk rasterisasi subpixel. Tidak diklaim identik per piksel.
- Reduced motion 1440/768/375/320 px: animation none, empat pill terlihat satu kali, tanpa clipping teks. Toggle bahasa tetap menjaga daftar aksesibel empat label.
- Portal login, dashboard anonim, kebijakan privasi, detail jurusan, dan NextTel tidak memiliki marquee.
- Tes browser SPMB existing diulang: 12 kombinasi viewport/bahasa, route/CTA, anchor, Hero/QAC dimensions, menu, motion, dan overflow tetap lulus.
- ESLint, `bahasa:uji`, production build, serta `git diff --check` lulus. Proyek JS/JSX tidak menyediakan typecheck.

Bukti: `D:/LombaTelkom/qa-output/hero-marquee-2026-10-13/results.json`, screenshot per halaman/viewport, reduced-motion, serta sebelum/sesudah seam. Regresi SPMB: `D:/LombaTelkom/qa-output/marquee-spmb-regression-2026-10-13`.

Screenshot desktop dan reduced-motion mobile diperiksa terhadap referensi lampiran. Tes konten REST memakai respons simulasi agar jaringan/data yang tidak berkaitan tidak memengaruhi audit marquee; tidak ada mutation database nyata. Belum diuji pada perangkat fisik, Safari, atau Firefox. Tidak ada commit/push/deploy dalam tugas ini.

## File yang berubah

- `src/components/RibbonDivider.jsx`, `RibbonDivider.css`: looping, tokens, marker QA, wrapper spacing, reduced motion.
- `src/pages/LandingPage.jsx`, `JurusanPage.jsx`, `TentangPage.jsx`, `GuruPage.jsx`, `PrestasiPage.jsx`, `BeritaPage.jsx`: memindahkan/mengganti divider existing.
- `src/pages/BkkPage.jsx`, `PengumumanPage.jsx`, `FasilitasPage.jsx`, `EkstrakurikulerPage.jsx`: menambahkan shared marquee setelah Hero.
- `scripts/uji-hero-marquee-browser.mjs`: audit layout, looping, seam comparison, responsive, reduced motion, exclusions.
- `docs/marquee-seluruh-hero.md`: laporan dan handoff.

SPMB dan Kalender tidak memerlukan edit JSX karena sudah memakai shared component di posisi yang benar.

## Menjalankan QA

Preview production harus aktif pada 127.0.0.1:4173, atau atur QA_URL. PLAYWRIGHT_MODULE dapat menunjuk runtime bundel existing; QA_OUTPUT mengatur direktori bukti. Sharp memakai dependency proyek yang sudah ada.

```powershell
node scripts/uji-hero-marquee-browser.mjs
npm.cmd run lint
npm.cmd run bahasa:uji
npm.cmd run build
```

## Git handoff

Jalankan setelah meninjau diff. Branch/remote diverifikasi: feat/fasilitas-sekolah dan origin https://github.com/KiandrAHD/smk-telkom-purwokerto.git.

```powershell
Set-Location 'D:/LombaTelkom/smk-telkom-purwokerto'
$marqueeFiles = @(
  'frontend/src/components/RibbonDivider.jsx', 'frontend/src/components/RibbonDivider.css',
  'frontend/src/pages/LandingPage.jsx', 'frontend/src/pages/JurusanPage.jsx',
  'frontend/src/pages/TentangPage.jsx', 'frontend/src/pages/GuruPage.jsx',
  'frontend/src/pages/PrestasiPage.jsx', 'frontend/src/pages/BeritaPage.jsx',
  'frontend/src/pages/BkkPage.jsx', 'frontend/src/pages/PengumumanPage.jsx',
  'frontend/src/pages/FasilitasPage.jsx', 'frontend/src/pages/EkstrakurikulerPage.jsx',
  'frontend/scripts/uji-hero-marquee-browser.mjs', 'frontend/docs/marquee-seluruh-hero.md'
)
git add -- $marqueeFiles
git diff --cached --check
git commit -m "feat: standardize animated marquee below public heroes"
git push origin feat/fasilitas-sekolah
```
