# Audit dan implementasi full-bleed hero

Tanggal: 13 Oktober 2026. Sepuluh hero diperbaiki, dua hero dengan foto biasa diaudit dan dipertahankan. Seluruh panel tetap menggunakan dimensi design system website, bukan tinggi viewport.

## Referensi dan metode

Figma: [Telkom remake again](https://www.figma.com/design/ca2iX76GpJSr0QC7Qyv9RV/Figma-MCP?node-id=221-2084), page `221:2084`. Audit menggunakan metadata page, design context beserta render layer, enam screenshot pengguna, aset lokal, dan screenshot browser sebelum/sesudah. Tidak ada perubahan pada file Figma.

| Referensi | Frame | Layer visual yang diperiksa |
| --- | --- | --- |
| Beranda | `221:2085` | `221:2086`, composite siswa, gedung, TELKOM, gelombang dan fade |
| Profil Sekolah | `221:3169` | `221:3170`, gedung, panel merah dan tiga value propositions |
| Profil Guru | `221:3839` | `221:8999`, kelompok guru dan gelombang |
| Ekstrakurikuler | `221:9323` | `221:9326`, kolase lima siswa |
| Kalender | `221:2738` | `221:2739` gedung; `221:2809` ilustrasi; `221:3107` kolase; `221:3130` logo; `221:3165` gelombang |
| SPMB | `221:10192` | `221:10226`, kelompok siswa dan aksen merah |

Frame Figma berukuran lebar 1847px. Browser diperiksa juga pada viewport 1847px; container website tetap dibatasi design system 1280px. Komposisi Figma dinilai secara proporsional di dalam panel website. Ini bukan perbandingan pixel 1:1 karena container dan typography website sengaja dipertahankan.

## Root cause dan hasil setiap halaman

Ukuran berikut diukur pada viewport 1440px, bahasa Indonesia. Semua panel tetap 1216 × 464px. Selisih tepi 1px setelah perubahan merupakan border panel, bukan whitespace.

| Hero | Penyebab sebelum | Media sebelum → sesudah | Hasil |
| --- | --- | --- | --- |
| Beranda `/` | Gambar di grid 62%, padding 16px, radius gambar sendiri | 723 × 430 → 850 × 462px | Composite menjadi layer absolute yang menyentuh kanan, atas, bawah |
| Profil Sekolah `/profil-sekolah` | Background memiliki inset vertikal dan kanan 16px; crop window memiliki radius sendiri | 850 × 430 → 850 × 462px | Inset dibuang; gedung dan panel value propositions tetap satu aset |
| Profil Guru `/profil-sekolah/guru` | Wrapper gambar di grid dan mempunyai radius/padding; mask hanya memudar di tepi wrapper | 723 × 430 → 874 × 462px | Kelompok guru mengisi visual kanan; gradient memakai koordinat panel |
| Ekstrakurikuler `/ekstrakurikuler` | Grid/padding membatasi gambar; aset lokal berbeda dari Figma, terutama siswa paling kiri | 723 × 430 → 838 × 462px | Menggunakan aset Figma asli dengan siswa yang sesuai; statistik/search tetap di depan |
| Kalender `/kalender` | Layer gedung, kolase dan logo belum ada. PNG gelombang lama putih opak, sehingga menutup layer di belakang | Wrapper 1214 × 462px tetap | Layer Figma ditambahkan; gelombang transparan menjaga kolase tetap terlihat |
| SPMB `/spmb` | Shared HeroSection masih memakai gambar di kolom kanan | 723 × 430 → 874 × 462px | Konfigurasi admissions tersendiri, mask existing dipertahankan |
| Fasilitas `/fasilitas` | Background menggunakan inset 16px dan radius internal | 850 × 430 → 850 × 462px | Composite existing menyentuh panel; typography dan CTA tetap |
| Jurusan `/jurusan` | Composite siswa dan gelombang masih menjadi gambar terpisah di grid | 723 × 430 → 850 × 462px | Layer full-bleed dengan focal point kiri untuk mempertahankan kelompok siswa |
| BKK `/bkk` | Composite TELKOM/siswa/gelombang dibatasi grid dan padding | 723 × 430 → 850 × 462px | Visual kanan menyatu; subjek siswa/laptop tetap terlihat |
| Pengumuman `/pengumuman` | Composite ilustrasi/gelombang dibatasi grid dan padding | 723 × 430 → 850 × 462px | Ilustrasi dan gelombang menyatu dengan tepi panel |
| Prestasi `/prestasi` | Aset merupakan foto kegiatan biasa, memakai pola foto terpisah | 723 × 430px tetap | Tidak dipaksakan menjadi background; statistik dan foto dipertahankan |
| Berita `/berita` | Aset merupakan foto proyek biasa, memakai pola foto terpisah | 723 × 430px tetap | Tidak dipaksakan menjadi background; ticker dan layout dipertahankan |

Halaman detail, galeri/koleksi, FAQ, kebijakan, dashboard/admin, form pendaftaran, STELA dan NextTel menggunakan heading/antarmuka berbeda, sehingga tidak termasuk keluarga panel hero ini.

## Teknik dan konfigurasi komposisi

Standar reusable berada di `src/styles/hero.css`, sebagai modifier `hero-panel--bleed` di atas sistem hero yang sudah ada. Tidak menambahkan dependency atau wrapper React baru.

- Panel memakai position relative, overflow hidden, isolation isolate, radius panel existing.
- Media desktop memakai position absolute, inset-block 0, right 0 dan z-index 0. Copy tetap dalam alur dokumen dengan z-index 10; gradient z-index 1 serta pointer-events none.
- Radius internal media dibuang agar tidak terlihat sebagai kartu gambar kedua. Radius panel melakukan clipping luar.
- Floating cards tetap di luar panel, z-index 10, center dan overlap 40px. Markup, divider, ikon dan styling kartu tidak diubah.
- Tidak ada transform scale untuk memperbesar hero. Crop English Profil Sekolah existing tetap digunakan untuk membuang margin viewer sumber.

| Komposisi | Lebar visual desktop | Rasio sumber | Fit/focal point mulai 1280px | Fade putih panel |
| --- | --- | --- | --- | --- |
| Beranda/Fasilitas | 70% | 1208:679 | cover, right center | 28% → transparan 48% |
| Profil Sekolah | 70% | ID 1600:751; EN crop 1277:652 | Crop window natural ratio, right aligned; panel nilai tidak dipotong | Fade existing 30/40/62% dipertahankan |
| Profil Guru | 72% | 2200:1033 | cover, left center | 29% → transparan 42% |
| Ekstrakurikuler | 69% | 1920:902 | cover, right center | 31% → transparan 48% |
| SPMB | 72% | 1248:676 | cover, right center, mask existing | 28% → transparan 48% |
| Jurusan | 70% | 2300:1080 | cover, left center | 28% → transparan 48% |
| BKK | 70% | 1920:902 | cover, right center | 28% → transparan 48% |
| Pengumuman | 70% | 1600:751 | cover, right center | 28% → transparan 48% |
| Kalender | Wrapper seluruh panel | Layer terpisah | Gedung kanan 68,67%; kalender left 32%, width 31,16%; kolase kanan 38,14%; gelombang kanan 74,21% | Fade kiri dan gedung opacity 20% |

Pada 1024–1279px, gambar grid memakai contain/right bottom untuk menjaga seluruh kelompok guru/siswa terlihat. Wrapper tetap menempel ke panel; bagian atas menjadi area latar yang lebih tenang. Ini penyesuaian responsif yang disengaja, berbeda dari framing desktop Figma. Wrapper kelompok guru/ekskul memakai gradient background dark-100 menuju putih.

Di bawah 1024px, teks berada di atas gambar dan tinggi mengikuti konten. Gambar mempertahankan rasio sumber. Kalender memakai komposisi khusus dengan ilustrasi di kiri dan kolase di kanan, tanpa mengganggu CTA di atasnya.

## Design system dan performa

Max-width 80rem, radius panel 2rem, border primary opacity 30%, tinggi desktop 29rem, desktop sempit 34rem, gutter 1/1,5/2rem, jarak navbar 1rem, dan overlap 2,5rem dipertahankan. Tidak ada perubahan font, typography scale global, warna global, button styles, navbar, footer atau motion standards.

Lebar `sizes` Beranda/SPMB/Fasilitas disesuaikan untuk media yang lebih lebar. Width/height gambar serta rasio mobile menjaga ruang gambar saat dimuat. Aset original existing tidak dihapus; aset baru berupa WebP lokal dari Figma:

| Aset | Resolusi | Ukuran file |
| --- | --- | --- |
| `ekstrakurikuler/hero-figma.webp` | 1920 × 902 | 228726 bytes |
| `kalender/hero-building.webp` | 1200 × 900 | 222732 bytes |
| `kalender/hero-collage.webp` | 545 × 458 | 69782 bytes |
| `kalender/hero-logo.webp` | 600 × 172 | 27172 bytes |
| `kalender/hero-wave-figma.webp` | 649 × 385 | 11250 bytes |

Latar gedung ditampilkan dengan opacity 20%, sehingga dikompresi sesuai perannya. Kolase dan gelombang mengikuti resolusi sumber yang disediakan Figma; tidak dibuat detail atau sharpening palsu. Logo menggunakan crop dari aset logo asli, bukan gambar ulang.

## Validasi

Build produksi diuji melalui `http://127.0.0.1:4174`.

- `scripts/uji-hero-full-bleed.mjs`: 192 kombinasi lolos, yaitu 12 halaman × viewport 1920, 1847, 1440, 1280, 1024, 768, 390, 320 × ID/EN.
- Memeriksa image loading, width/height panel, radius, navbar gap, tepi full-bleed, controls clipping, mobile copy/media separation, floating overlap/centering, CTA clearance, horizontal overflow dan runtime errors.
- Tambahan pemeriksaan alpha memastikan gelombang Kalender tidak opak. Tes sebelum perbaikan gagal pada right edge gap Beranda; setelah perbaikan seluruh matriks lolos.
- `uji-kalender-browser.mjs` lolos: route/reload, menu, tanggal/tahun kabisat, tahun, pemilihan hari, modal/Escape, keyboard, Today, empty/list, 12 responsive/language checks dan reduced motion.
- `uji-localized-artwork.mjs` lolos: pilihan gambar ID/EN dan CTA. `uji-akses-cepat-hero.mjs` lolos: tiga akses utama.
- `uji-ekstrakurikuler.mjs` lolos: 34 kegiatan dan statistik dinamis. Pencarian hero dan CTA Lihat Event diuji interaktif pada 1440/390px, keduanya lolos.
- `npm.cmd run lint`, `npm.cmd run build`, `git diff --check` lolos. Build memberi informational warning waktu plugin asset; build berhasil.
- Tidak ada script TypeScript/typecheck pada proyek JS/JSX ini. Tidak dilakukan deployment atau pengujian perangkat fisik.

Screenshot sebelum: `D:/LombaTelkom/qa-output/hero-full-bleed-before`. Screenshot final build produksi dan `results.json`: `D:/LombaTelkom/qa-output/hero-full-bleed-production`. Final screenshot tersedia untuk 1847, 1440, 1024, 768, 390px pada seluruh 12 hero; viewport lainnya memiliki evidence geometri JSON.

Pemeriksaan visual langsung mencakup enam referensi utama serta Jurusan, BKK, Pengumuman dan Fasilitas. Face/subject preservation dinilai dari screenshot, bukan diasumsikan dari object-fit saja.

## Bukti sebelum dan sesudah

| Hero utama | Sebelum 1440px | Sesudah 1440px |
| --- | --- | --- |
| Beranda | [Screenshot](D:/LombaTelkom/qa-output/hero-full-bleed-before/beranda-1440.png) | [Screenshot](D:/LombaTelkom/qa-output/hero-full-bleed-production/beranda-1440.png) |
| Profil Sekolah | [Screenshot](D:/LombaTelkom/qa-output/hero-full-bleed-before/profil-sekolah-1440.png) | [Screenshot](D:/LombaTelkom/qa-output/hero-full-bleed-production/profil-sekolah-1440.png) |
| Profil Guru | [Screenshot](D:/LombaTelkom/qa-output/hero-full-bleed-before/profil-sekolah-guru-1440.png) | [Screenshot](D:/LombaTelkom/qa-output/hero-full-bleed-production/profil-sekolah-guru-1440.png) |
| Ekstrakurikuler | [Screenshot](D:/LombaTelkom/qa-output/hero-full-bleed-before/ekstrakurikuler-1440.png) | [Screenshot](D:/LombaTelkom/qa-output/hero-full-bleed-production/ekstrakurikuler-1440.png) |
| Kalender | [Screenshot](D:/LombaTelkom/qa-output/hero-full-bleed-before/kalender-1440.png) | [Screenshot](D:/LombaTelkom/qa-output/hero-full-bleed-production/kalender-1440.png) |
| SPMB | [Screenshot](D:/LombaTelkom/qa-output/hero-full-bleed-before/spmb-1440.png) | [Screenshot](D:/LombaTelkom/qa-output/hero-full-bleed-production/spmb-1440.png) |

## File yang berubah

| File | Perubahan |
| --- | --- |
| `src/styles/hero.css` | Modifier full-bleed dan konfigurasi tiap komposisi |
| `src/components/HeroSection.jsx` | Beranda dan shared SPMB; sizes responsive |
| `src/components/tentang/TentangHeroSection.jsx` | Background edge coverage, crop ID/EN |
| `src/components/jurusan/JurusanHeroSection.jsx` | Konfigurasi composite Jurusan |
| `src/components/bkk/BkkHeroSection.jsx` | Konfigurasi composite BKK |
| `src/components/pengumuman/PengumumanHeroSection.jsx` | Konfigurasi ilustrasi Pengumuman |
| `src/pages/GuruPage.jsx` | Konfigurasi kelompok guru |
| `src/pages/EkstrakurikulerPage.jsx` | Aset sesuai Figma dan konfigurasi komposisi |
| `src/pages/FasilitasPage.jsx` | Background full-bleed dan sizes |
| `src/pages/SpmbPage.jsx` | Konfigurasi admissions shared HeroSection |
| `src/pages/KalenderPage.jsx` | Susunan layer visual Figma |
| `src/pages/KalenderPage.css` | Posisi dan stacking tiap layer Kalender |
| Lima aset WebP pada tabel aset | Sumber visual lokal |
| `scripts/uji-hero-full-bleed.mjs` | QA browser dan alpha regression |
| `docs/hero-full-bleed.md` | Laporan ini |
| `docs/git-hero-full-bleed.md` | Template Git khusus file tugas |

## Perbedaan yang tersisa

Hasil tidak dinyatakan pixel-perfect. Font, text scale, max-width, radius, ukuran panel, copy dan label CTA tetap mengikuti website; Figma memiliki proporsi hero berbeda pada beberapa halaman. Pada desktop sempit, fit contain menampilkan lebih banyak latar di atas kelompok. Mobile menggunakan layout adaptif karena referensi yang diberikan berupa desktop.

Profil Guru dan Ekstrakurikuler belum memiliki floating quick-access cards pada implementasi existing meskipun screenshot Figma menampilkannya. Pekerjaan ini tidak menambah atau merancang ulang kartu; kartu existing pada halaman lain tetap dipertahankan. Data/statistik website juga tidak diganti dengan angka screenshot Figma.

Sumber kolase Kalender 545px dan gelombang 649px membatasi ketajaman pada layar DPR tinggi. Aset sumber Figma yang lebih besar diperlukan jika ingin meningkatkan detailnya lebih lanjut. Build/QA menggunakan data API yang disubstitusi untuk geometri dan kalender; validasi ini tidak menguji ketersediaan backend live.

Belum commit, push atau deploy. Branch aktif saat handoff: `feat/fasilitas-sekolah`; remote origin diverifikasi pada repo KiandrAHD/smk-telkom-purwokerto.
