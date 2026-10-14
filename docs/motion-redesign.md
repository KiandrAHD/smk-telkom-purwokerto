# Hero, marquee, dan School Tour — 14 Oktober 2026

Hero otomatis tanpa tombol panah, indikator, atau pause. Keyboard tetap dapat mengganti slide. Panel pembuka asli, pencarian ekstrakurikuler, CTA, statistik, dan kartu akses cepat tetap digunakan. Carousel fasilitas Beranda, ornamen statis, dan route error tidak diganti.

## Penyebab dan perbaikan

1. Aset dengan rasio berbeda memakai framing yang sama, sedangkan komposisi lama menumpuk area gambar dan teks. Setiap slide kini diisolasi dan di-clip sebagai satu panel; foto memakai contain, dan foto biasa memiliki area tersendiri di kanan. Aset komposit tetap memakai identitas masing-masing. Tinggi desktop mengikuti token hero asli, dan slot gambar mobile mengikuti komposisi pembuka.
2. Layer kolase fasilitas dan logo harus mengikuti satu ukuran gambar. Lebar layer kini dibatasi juga oleh tinggi hero sehingga rasio 1144/679 tetap utuh.
3. Crop profil memakai individual CSS translate dari Tailwind. transform:none saja tidak menghapusnya. Override translate:none dan crop mobile Guru mencegah artwork keluar dari frame.
4. Wrapper baru memutus selector sibling akses cepat fasilitas. Selector berbasis data-facilities-quick-access mempertahankan target klik 44px.
5. School Tour sudah mengikuti pointer, tetapi tidak melakukan snapping setelah release. Posisi kamera kini menuju stop terdekat setelah threshold 24px. Fokus dari klik tidak lagi memindahkan pin sebelum click selesai; pemusatan saat fokus tetap tersedia untuk keyboard.
6. CTA fasilitas tambahan perlu memilih kategori yang memiliki anchor-nya. URL kini membawa kategori Laboratorium atau Perpustakaan sebelum menuju grup yang sesuai.
7. Decode gambar dapat selesai setelah tab disembunyikan, sebelum timeline dibuat. Guard setelah decode membatalkan transisi yang belum mulai; slide dan heading aktif tetap tersedia.

## Teknik animasi

- Hero: GSAP xPercent pada panel utuh, 800ms, power3.inOut, kedua panel berjalan bersamaan. Decode gambar sebelum masuk, satu timeout 6200ms setelah transisi, satu arah input tertunda, dan modulo untuk loop dua arah.
- Autoplay berhenti ketika tab tidak aktif, hero keluar viewport, fokus keyboard sedang digunakan, atau reduced motion aktif. Tidak ada kontrol pause baru.
- Marquee: MarqueeBadge sebagai elemen HTML/SVG dengan ikon bulb, rocket, medal, dan aset sekolah Group 891-1. Dua grup identik, linear translateX(-50%). Jarak berada dalam grup sehingga tidak ada gap di seam. Cabang RibbonDivider statis tetap memakai aset sebelumnya.
- School Tour: Pointer Events, pointer capture, satu requestAnimationFrame untuk drag, cubic-out 320ms untuk snap. touch-action:pan-y pinch-zoom mempertahankan scroll vertikal dan zoom. Slider, wheel, keyboard, label, garis konektor, dan pemusatan pin tetap bekerja.

## Cakupan

16 route: Beranda, Jurusan, Prestasi, Fasilitas, Profil Sekolah, BKK, Berita, Pengumuman, Profil Guru, Ekstrakurikuler, Kalender, SPMB, dan empat detail jurusan. Konfigurasi tambahan berada di pageHeroSlides.js; panel pembuka tetap berada di caller aslinya.

Daftar file lengkap untuk review dan staging berada di [motion-redesign-files.txt](motion-redesign-files.txt).

## Bukti verifikasi

Artefak lokal: ../outputs/motion-redesign-2026-10-14/

| Pemeriksaan | Hasil |
| --- | --- |
| Konfigurasi, route, anchor kategori, ID/EN | PASS, uji-motion-config.mjs |
| Hero responsive | PASS, 160 kasus: 16 route, 1440/1024/768/390/320px, ID/EN; ukuran pembuka dibanding fixture sebelum perubahan, teks/crop, gambar, inactive/inert, keyboard, overflow, tinggi tetap |
| Autoplay nyata | PASS, tiga putaran pada masing-masing 16 route, autoplay.json/autoplay.log |
| Manual gerakan normal | PASS, tiga putaran setiap arah pada 16 route; fase motion pada interactions.log. Uji link awal kemudian gagal karena resolusi anchor relatif di test, diperbaiki dan diuji terpisah |
| Hero Beranda | PASS, input cepat, loop dua arah, coverage frame, timer reset, hidden tab tersimulasi, reduced motion, 12 kasus responsive, lima CTA aktual, unmount saat transisi |
| Framing keseluruhan | PASS, 192 kasus uji-hero-full-bleed.mjs |
| Container/kartu/CTA | PASS, 154 kasus uji-hero-konsistensi.mjs |
| Fasilitas | PASS, routing/refresh/filter, 16 modal/Escape/fokus, 16 kasus viewport/bahasa, menu dan carousel fasilitas lama |
| School Tour | PASS, unit bounds/stop/threshold, mouse, touch CDP, scroll vertikal, wheel/keyboard, 12 pin/detail, resize, hint/storage failure, image/retry, 14 kasus viewport/bahasa |
| SPMB | PASS, route, sumber/empty state, 12 kasus viewport/bahasa, aset, ukuran hero/QAC, menu dan reduced motion |
| Link/anchor dan marquee | PASS, 29 tujuan aktual, query kategori, dua CTA fasilitas diklik melalui carousel, input pencarian tidak mengganti slide, seam marquee sebelum/sesudah wrap bergeser kurang dari 1px |
| Hidden tab saat decode | PASS, uji-motion-visibility.mjs; reproduksi sebelum guard mengganti index ke1, sesudah guard index tetap0 dan heading tetap dapat diakses |

Hasil akhir: lint dan production build PASS. git diff --check PASS dengan konfigurasi repository. Sampel rAF 16 route: rata-rata 56,2 FPS, rentang 40,4–60,0 FPS, median interval per route 16,6–16,7 ms, dan 10 frame melebihi 34 ms. Data ada di frame-timing.json. Ini sampel scheduler browser saat membuka route, bukan jaminan frame paint pada perangkat fisik.

Profil melalui Chrome DevTools Protocol pada satu transisi Beranda mencatat dua layout events untuk halaman, 50 style recalculations, script duration 25,3ms, task duration 123,0ms, dan tinggi hero tetap 464px sebelum/sesudah. Data ada di devtools-performance.json; sampel ini memakai fixture respons API kosong untuk mengurangi reflow dari data yang datang saat pengukuran.

Regresi terfokus dari reviewer juga PASS: crop Profil ID/EN pada 1440/1024px, target CTA 44px pada 1440/1024/390px, input panah cepat, dan pergantian reduced motion saat transisi.

Untuk menjalankan kembali pemeriksaan baru dari frontend:

```powershell
node scripts/uji-motion-config.mjs
node scripts/uji-motion-visibility.mjs
node scripts/uji-campus-explorer.mjs
node scripts/uji-motion-redesign.mjs
node scripts/uji-motion-redesign.mjs --autoplay
node scripts/uji-motion-interactions.mjs
```

PLAYWRIGHT_MODULE perlu menunjuk instalasi Playwright apabila paket tersebut tidak tersedia di Node resolution project. Pengujian sesi ini memakai Playwright bundled Codex dengan installed Chrome. Mode --links dan --frames memungkinkan pengujian ulang fase tersebut tanpa mengulang putaran manual yang sudah terekam.

## Keterbatasan

Pengujian menggunakan Chrome lokal headless dan emulasi touch/responsive, bukan perangkat Android/iOS fisik. Waktu requestAnimationFrame merupakan sampel pada mesin ini, bukan jaminan compositor 60 FPS pada semua perangkat. Hidden tab diuji melalui visibilitychange tersimulasi. Sebagian regresi lama memakai respons API fixture; audit backend dan deployment tidak termasuk cakupan ini.

Belum commit, push, atau deploy. Untuk staging hanya file task ini dari root repository:

```powershell
$taskFiles = Get-Content docs/motion-redesign-files.txt
git add -- $taskFiles
git commit -m "fix: unify hero motion and add school tour snapping"
git push origin feat/fasilitas-sekolah
```
