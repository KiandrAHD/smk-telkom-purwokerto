# Hero, marquee, dan School Tour

Arahan: hero otomatis tanpa tombol; pertahankan hero pembuka dan section lain, gunakan aset dan route asli, ID/EN, animasi horizontal. Tidak commit/push otomatis.

## Task 1: Hero bersama

- Rekam ukuran hero sebelum perubahan pada desktop/tablet/mobile.
- Tambahkan regresi browser untuk seluruh hero, framing, CTA, keyboard, tinggi tetap dan autoplay tiga putaran.
- Perluas HeroCarousel agar menerima panel pembuka asli. Konfigurasi tambahan per halaman memakai konten lokal; terapkan pada seluruh caller hero utama dan detail jurusan.
- Perbaiki isolasi tiap slide, rasio media, fit dan posisi gambar; jangan menambah navigasi hero.
- Expected: tiap halaman punya konten sesuai konteks; gambar dan teks tetap terpisah, tinggi tetap selama transisi, inactive inert.

## Task 2: Marquee

- RibbonDivider animated saja: reusable pill dengan ikon sesuai Group 891, jarak dalam grup, dua grup identik dan translateX(-50%). Static ribbon tidak berubah.
- Verifikasi kesamaan kedua grup, kecepatan linear, ID/EN, screenshot responsive dan reduced motion.

## Task 3: School Tour

- Uji helper nearest pan stop sebelum menambah implementasi; drag langsung mengikuti pointer lalu snap nearest stop, threshold membedakan klik, vertical scroll tetap native.
- Pertahankan peta, label/pin, slider, tombol, wheel, keyboard dan reduced motion.
- Expected: mouse/touch tidak memicu pin saat drag, release melakukan satu transisi, batas pan valid.

## Task 4: Verifikasi

- Browser desktop/tablet/mobile ID/EN, semua slide/CTA, tiga siklus autoplay dan keyboard, reduced motion, hidden tab, rapid input, resize, marquee wrap, mouse/touch/pin map serta fasilitas regression.
- npm.cmd run lint, npm.cmd run build, git diff --check; review keseluruhan perubahan.
- Simpan laporan dengan bukti dan keterbatasan; tampilkan Git handoff sempit tanpa commit otomatis.

## Ledger

- Ruling: School Tour adalah peta pan, bukan card carousel; snapping memakai posisi kamera merata yang mencakup kedua ujung. Slider/locate tetap pan kontinu supaya pin tetap bisa dipusatkan.
- Ruling: instruksi terakhir dari user mengonfirmasi tanpa tombol hero; Next/Previous diuji melalui keyboard. Fokus keyboard dan reduced motion tetap dihormati tanpa kontrol pause baru.
- Pre-flight: HeroCarousel memengaruhi seluruh caller; RibbonDivider hanya cabang animated; useCampusPan memengaruhi CampusExplorer dan CampusPreview sehingga keduanya harus diuji.
- Task 1: complete. 160 responsive cases, 192 framing cases, 154 consistency cases, three real autoplay cycles on 16 routes, three normal-motion manual cycles in each direction on 16 routes. Existing opening sizes retained. Reviewer crop/inert/touch-target regressions resolved.
- Task 2: complete. Reference pill/icon badges, identical halves, ID/EN and wraparound seam verified below 1px displacement. Static RibbonDivider branch untouched.
- Task 3: complete. Unit checks plus browser mouse/touch CDP, scroll/keyboard/wheel, 12 hotspots/previews, resize/hints/storage/image retries, 14 viewport/language cases passed.
- Task 4: complete. 29 CTA destinations including facility category queries, real clicks, search-key behavior and seam passed; SPMB and facilities regressions passed; lint/build passed. Frame samples averaged56.2 FPS, median16.6–16.7ms; physical device/compositor benchmark is outside recorded evidence.
- Ruling: related old QA selectors now use the active slide or viewport; their original dimensions/border/card assertions remain. Fixture records actual pre-change geometry. Filter anchors must carry their owning category.
- Final lifecycle fix: delayed decode while document.hidden reproduced unwanted transition (RED index1); after-decode guard verified GREEN index0 and accessible heading. Final lint/build repeated after this guard.
