# Interactive Campus Explorer — 13 Oktober 2026

Pembaruan framing/motion: [Campus framing](campus-framing.md) menjelaskan geometri baru, transform-based pan, label–pin connectors, slider progress dan subtle floor parallax. Uraian native scrollLeft, minimum 1440 px, ukuran pin dan hint di bawah merekam implementasi awal yang telah diperbarui. Daftar file perubahan terbaru mencakup laporan ini.

School Tour sekarang tersedia di `/fasilitas`, setelah marquee dan sebelum daftar fasilitas. Perubahan terbatas pada peta, preview, hubungan ke daftar fasilitas, terjemahan, aset, dan pengujian. Tidak ada dependency, perubahan font global, database, API, atau deployment.

## Audit referensi dan keputusan

Figma utama: https://www.figma.com/design/ca2iX76GpJSr0QC7Qyv9RV/Figma-MCP?node-id=205-411

Frame `205:411` — `FASILITAS SEKOLAH drag 1` dan `205:1177` — `FASILITAS SEKOLAH drag 2` diperiksa. Keduanya menggunakan gambar yang sama pada ukuran 3142 × 1051, dengan offset horizontal -83 dan -1253. Tidak ditemukan prototype reaction pada label atau kontrol yang diperiksa. Implementasi memperlakukan kedua frame sebagai state satu peta, bukan dua halaman atau sudut kamera berbeda.

Checkout awal belum memiliki komponen School Tour. Hero, navbar, marquee, footer, daftar, filter, dan modal yang sudah ada digunakan kembali. Frame kedua memiliki label Gedung A di lokasi yang dilabeli Gedung B pada frame pertama dan tidak menampilkan C. Implementasi memakai A/B/C dari frame pertama serta DLG, Perpustakaan, dan Aula dari frame kedua. Dua titik Gedung D tetap tampil dan menggunakan satu profil fasilitas. Ejaan Perpustakaan mengikuti data website.

Gambar berasal dari lampiran pengguna `C:/Users/IDEAPAD SLIM 3/Downloads/Model Kampus Isometrik Beratap Merah.png`, 2164 × 727. Salinan WebP lossless dengan alpha berukuran 891.018 byte, dibanding PNG 1.361.216 byte. Perbandingan RGBA dengan Sharp memastikan alpha dan piksel terlihat tetap sama. Orientasi, bangunan, atap, dan proporsi tidak direkonstruksi. Dekorasi, pin, dan ikon slider diekspor dari Figma dan disimpan lokal.

## Drag, batas, dan kontrol

Panning memakai `scrollLeft` native dengan Pointer Events dan requestAnimationFrame. Gambar dan hotspot berada pada stage yang sama. Perubahan per frame melalui refs/DOM, tanpa merender ulang seluruh halaman selama drag. Tidak ada rotasi, loop, atau inertia buatan. Pointer release menghentikan peta di posisi terakhir; navigasi tombol dan pemusatan lokasi memakai easing 320 ms.

Gesture horizontal mulai setelah 8 px dan arah horizontal dominan. Gesture vertikal dibiarkan untuk scroll halaman melalui `touch-action: pan-y pinch-zoom`. Klik setelah drag diblokir; klik berikutnya dan aktivasi keyboard tetap bekerja. Wheel horizontal/Shift-wheel menggeser peta, wheel vertikal tetap menggulir halaman, dan Ctrl-wheel tidak dicegat.

Batas posisi adalah `0 … max(0, lebar stage - lebar viewport)`. ResizeObserver mengukur kembali dan mempertahankan proporsi posisi. Penanganan resize juga menjaga proporsi ketika browser lebih dulu menjepit scrollLeft. Stage memakai aspect ratio 2164:727, lebar 170%, minimum 1440 px untuk eksplorasi, dan maksimum 2164 px agar tidak membesarkan aset melebihi ukuran aslinya. Overflow terbatas di viewport peta.

Tombol arah, range slider, ArrowLeft/ArrowRight/Home/End, dan fokus hotspot menyediakan navigasi non-drag. Kontrol tersinkron dengan posisi aktual. Tombol dan hotspot memiliki target minimal 44 × 44 px.

## Hint satu kali

Teks awal: “Geser untuk melihat”. Hint tidak menerima pointer dan tidak menutupi interaksi. Status dipenuhi setelah peta benar-benar berpindah minimal 24 px melalui drag atau gesture horizontal trackpad; hover, klik, navigasi programatis, dan menarik keluar batas tanpa perpindahan tidak menyelesaikannya.

Status disimpan pada localStorage `smk-campus-drag-understood-v1=1`. Kunjungan berikutnya tidak menampilkan hint. Jika storage ditolak, hint tetap hilang selama komponen aktif. Ikon bergerak horizontal ±3 px secara lembut, lalu berhenti setelah hint ditutup. Fade hint 220 ms dan seluruh motion menghormati prefers-reduced-motion.

## Hotspot dan sumber data

Koordinat adalah ujung pin relatif terhadap gambar, bukan viewport. Pin mengikuti scale dan panning stage. Posisi kode memakai persentase Tailwind statis; angka yang sama digunakan untuk pemusatan melalui kontrol. Uji browser memeriksa koordinat relatif sebelum/sesudah panning dan resize.

| Hotspot | ID profil | x / y (%) | Node Figma | Sumber informasi dan hubungan daftar |
|---|---|---|---|---|
| Gedung D, titik 1 | kelas-d | 13,461 / 43,102 | 205:1108 | Profil kelas-d existing → grup Kelas D |
| Gedung D, titik 2 | kelas-d | 21,704 / 41,199 | 205:1114 | Profil yang sama, tidak menggandakan data |
| Parkiran | parkiran | 16,357 / 49,382 | 205:1107 | Nama/lokasi Figma; foto/deskripsi belum tersedia |
| Gedung C | kelas-c | 25,714 / 34,158 | 205:1136 | Profil kelas-c existing → grup Kelas C |
| Gedung B | kelas-b | 33,148 / 36,061 | 205:1109 | Profil kelas-b existing → grup Kelas B |
| RPS Selatan | rps-selatan | 41,344 / 44,910 | 205:1111 | Nama/keterangan referensi → kartu RPS Selatan existing |
| RPS Utara | rps-utara | 41,582 / 54,139 | 205:1148 | Nama/keterangan referensi → kartu RPS Utara existing |
| Lapangan Apel | lapangan-apel | 33,116 / 52,141 | 205:1112 | Nama/lokasi Figma; foto/deskripsi belum tersedia |
| Gedung A | kelas-a | 51,144 / 34,919 | 205:1110 | Profil kelas-a existing → grup Kelas A |
| DLG | dlg | 55,759 / 44,053 | 205:1921 | Digital Literacy Garden → grup literasi existing |
| Perpustakaan | perpustakaan | 61,106 / 53,473 | 205:1902 | Profil perpustakaan existing → grup Perpustakaan |
| Aula | aula | 75,778 / 41,579 | 205:1927 | Nama/lokasi Figma; foto/deskripsi belum tersedia |

`campusData.js` menggunakan referensi objek asli `fasilitasData.js` untuk gedung A/B/C/D dan perpustakaan. Nama, foto, dan preview canonical tidak disalin ke data baru. Data inventory `fasilitasPageData.js` tetap dipertahankan; contoh ruangan/foto ilustrasi di inventory tidak diubah menjadi klaim dokumentasi ruangan resmi.

Tindakan “Lihat daftar fasilitas” memilih kategori dan menuju grup/kartu yang diketahui. Modal kartu kelas A–D dan RPS memiliki “Lihat lokasi di peta”, memusatkan hotspot secara smooth serta memberi highlight 1,5 detik. Kartu lainnya tidak mendapat lokasi yang belum terverifikasi. Posisi GOR dan laboratorium lain tidak ditebak.

## Preview dan aksesibilitas

Desktop/tablet memakai floating card di dalam area peta; di bawah 768 px preview mengikuti alur halaman dengan lebar container. Card berisi nama, foto atau fallback, preview dari data, close, serta tindakan ke daftar jika hubungan tersedia.

Preview adalah dialog nonmodal agar titik lain tetap dapat digunakan. Nama hotspot menjadi accessible label, state aktif memakai outline, label teks dan tanda centang. Tombol Close mendapat fokus saat panel pertama dibuka, Escape menutupnya, dan fokus kembali ke pemicu yang masih terlihat atau viewport peta. Menutup panel tidak memusatkan ulang peta. Modal daftar yang sudah ada tetap menggunakan komponen native dialog existing.

Entrance/exit panel 280 ms, translateY 8 px; pergantian foto crossfade 300 ms setelah decode, dengan foto sebelumnya tetap berada di belakang. Ukuran area foto tetap. Gambar gagal dimuat memakai fallback yang jujur; kegagalan gambar peta menampilkan pesan, menonaktifkan kontrol dan menyediakan Coba lagi. Daftar fasilitas tetap dapat digunakan.

## Typography dan design system

Audit kode dan font yang benar-benar dirender di Chrome menunjukkan Poppins untuk `font-heading` dan Inter untuk body `--font-main`. Figma menggunakan Plus Jakarta Sans; font tersebut tidak ditambahkan. Komponen memakai heading text-2xl/sm:text-3xl, preview text-base, body text-sm/text-xs dan leading-relaxed, sesuai pola existing. Container max-w-7xl, padding px-4/sm:px-6/lg:px-8, primary/neutral tokens, rounded-2xl, shadow-card/shadow-soft, lucide-react, dan breakpoint 768 px digunakan kembali. CSS animasi/gesture dibatasi pada kelas campus. Konfigurasi global tetap sama.

## Validasi yang dijalankan

Production preview Chrome: `http://127.0.0.1:5199/fasilitas`. Browser tests menggunakan fixture REST read-only dan tidak mengubah database hosted.

| Pemeriksaan | Hasil |
|---|---|
| `node scripts/uji-campus-explorer.mjs` | Lulus: bounds, center, axis/threshold, hint/storage failure, 12 hotspot/11 ID dan referensi data |
| `node scripts/uji-campus-explorer-browser.mjs` | Lulus: mouse, touch emulasi CDP, wheel/trackpad, keyboard, klik vs drag, bounds, resize/orientasi, seluruh hotspot, hint/refresh/storage blocked, panel/fokus, list↔map, gambar gagal/retry, motion dan font aktual |
| Responsivitas explorer | Lulus 14 kombinasi: 1920, 1440, 1024, 768, 390, 375, 320 px × ID/EN; aspect ratio, target 44 px, koordinat dan tidak ada overflow dokumen |
| Pemeriksaan visual screenshot | Desktop 1440, tablet 768 dan mobile 390 diperiksa; screenshot state kiri/kanan tersedia untuk seluruh kombinasi di atas |
| `node scripts/uji-halaman-fasilitas.mjs` | Lulus: routing/refresh, grid/filter, 16 modal/Escape/fokus, 12 viewport/bahasa, navbar/menu, carousel/loop/autoplay dan runtime |
| `npm.cmd run bahasa:uji` | Lulus termasuk 81 rendered views, 4 content records, preservation paragraf/URL, FAQ dan cache language |
| `npm.cmd run lint` | Lulus |
| `npm.cmd run build` | Lulus, 3,61 detik; ada notice Vite asset plugin timing, tidak menggagalkan build |
| Typecheck | Tidak ada script typecheck pada proyek JS/JSX ini |
| `git diff --check` | Lulus |

Bukti disimpan di `D:/LombaTelkom/qa-output/campus-explorer` (browser.log, regression.log, language.log, build.log, results.json, screenshot explorer dan referensi Figma) dan `D:/LombaTelkom/qa-output/campus-facilities-regression`. Unit dijalankan RED sebelum implementation lalu GREEN. Temuan resize dari browser QA telah diperbaiki dan diuji ulang. Dua race condition tes regresi existing juga diperbaiki: menunggu filter terpilih ketika jumlah kartu sama, dan membuka menu desktop melalui ArrowDown agar hover lalu klik tidak menutup dropdown. Komponen navbar/filter tidak diubah untuk mengatasi race tes tersebut.

Pengujian touch menggunakan Chrome emulation, belum perangkat fisik Android/iOS atau Safari. Tidak ada klaim pengukuran FPS/Lighthouse atau regresi seluruh route website. Perbedaan visual tersisa: font mengikuti website, label mobile disembunyikan sampai hover/focus/aktif untuk menghindari tumpukan, dan preview dirancang lokal karena dua frame yang diperiksa tidak menentukan pola detail.

## File perubahan

Diubah:

- `frontend/src/pages/FasilitasPage.jsx`: pemasangan explorer, navigasi daftar↔peta, ID grup, metadata/tindakan pada modal terkait.
- `frontend/src/data/translationsSchool.js`: teks baru ID/EN.
- `frontend/docs/halaman-fasilitas.md`: catatan perkembangan dan tautan laporan ini.
- `frontend/scripts/uji-halaman-fasilitas.mjs`: penantian state filter dan urutan pembukaan menu desktop pada tes regresi.

Ditambahkan:

- `frontend/src/components/fasilitas/CampusExplorer.jsx`, `CampusPreview.jsx`, `CampusExplorer.css`.
- `frontend/src/hooks/useCampusPan.js`.
- `frontend/src/utils/campusPan.js`.
- `frontend/src/data/campusData.js`.
- `frontend/scripts/uji-campus-explorer.mjs`, `uji-campus-explorer-browser.mjs`.
- `frontend/docs/campus-explorer.md`.
- `docs/superpowers/plans/2026-10-13-campus-explorer.md`.
- `frontend/src/assets/fasilitas/campus/`: campus-map.webp, floor-0.png, floor-1.svg, floor-2.svg, motif.svg, pin.svg, slider-arrow.svg, heading-left.svg, heading-left-top.svg, heading-right.svg, heading-right-top.svg, decor-a.svg, decor-b.svg, decor-c.svg, decor-d.svg.

## Git handoff

Branch diperiksa: `feat/fasilitas-sekolah`. Remote origin: `https://github.com/KiandrAHD/smk-telkom-purwokerto.git`. Tidak melakukan commit/push otomatis. Jalankan dari root repository; staging hanya file tugas ini:

```powershell
Set-Location 'D:\LombaTelkom\smk-telkom-purwokerto'
git add -- frontend/src/pages/FasilitasPage.jsx frontend/src/data/translationsSchool.js frontend/src/data/campusData.js frontend/src/utils/campusPan.js frontend/src/hooks/useCampusPan.js frontend/src/components/fasilitas/CampusExplorer.jsx frontend/src/components/fasilitas/CampusPreview.jsx frontend/src/components/fasilitas/CampusExplorer.css frontend/src/assets/fasilitas/campus frontend/scripts/uji-campus-explorer.mjs frontend/scripts/uji-campus-explorer-browser.mjs frontend/scripts/uji-halaman-fasilitas.mjs frontend/docs/campus-explorer.md frontend/docs/halaman-fasilitas.md docs/superpowers/plans/2026-10-13-campus-explorer.md
git diff --cached --stat
git commit -m "feat: add interactive campus explorer to facilities page"
git push origin feat/fasilitas-sekolah
```

Untuk menjalankan browser QA, set PLAYWRIGHT_MODULE ke paket Playwright yang tersedia, QA_URL ke production preview, dan QA_OUTPUT ke direktori bukti. Script explorer memakai dynamic import (module URL jika absolute Windows), sedangkan script regresi existing memakai createRequire (directory paket). Tidak ada dependency baru di package.json.
