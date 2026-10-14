# Perbaikan carousel, chevron, dan GOR

Tanggal: 14 Oktober 2026. Branch: `feat/fasilitas-sekolah`.

## Root cause dan perbaikan

1. Card memakai GSAP 500 ms dengan `power3.out`, sedangkan pill guru memakai transisi CSS 300 ms dengan easing berbeda. Galeri fasilitas mengubah lebar pill langsung dan hanya mentransisikan warna. Hook juga menunggu `image.decode()` sebelum menggerakkan card. Uji sebelum perbaikan menunjukkan card sekitar 12% sementara pill sudah 44%.
   Card dan indikator sekarang membaca state halaman yang sama, lalu bergerak dalam satu timeline GSAP, mulai pada posisi waktu 0, dengan duration 500 ms dan easing `power3.out`. Decode foto tidak lagi menahan timeline. Lock navigasi yang sudah ada tetap mencegah klik berulang membuat transisi bertabrakan. Penyelesaian animasi menghapus snapshot dan mengembalikan styling indikator milik React.
2. Aturan reduced motion global mengatur duration CSS pada semua elemen. Karena default transition-property adalah `all`, menghapus kelas transisi saja masih menyisakan transisi CSS singkat. `transition-none` pada indikator meniadakan transisi CSS yang bersaing dengan timeline.
3. Panah galeri sebelumnya memosisikan SVG pada pojok kiri atas dengan skala `.54`; tombol kanan memutar seluruh tombol yang juga sudah memakai translate untuk centering. SVG sekarang memenuhi tombol 44 px dan hanya gambarnya yang diputar. Geometri path chevron juga dicenter terhadap lingkarannya. Dropdown kelas memakai chevron Lucide 16 px yang diposisikan eksplisit di tengah tinggi container. Chevron navbar dan navigasi guru dibuat tidak menyusut; ukuran existing dipertahankan.
4. Dua titik GOR pada peta diberi label Gedung D dan diarahkan ke data serta dropdown kelas D. Keduanya sekarang memakai data `gor`, label GOR, detail Gedung Olahraga, dan filter GOR. ID internal pin tetap dipertahankan agar koordinat dan anotasi existing tidak berubah. Translation ID/EN memakai GOR/Gedung Olahraga dan Sports Hall. Detail lapangan GOR juga bisa kembali ke titik GOR di peta.

Nama Kelas D 1.2, D 2.1, D 2.2, D 3.1 dan grup Kelas Gedung D tetap dipertahankan karena merupakan inventaris ruang kelas terpisah dengan dokumentasi foto. Ruang kelas D tidak lagi diarahkan ke pin yang sebenarnya adalah GOR. Tidak ada perubahan font, palet, layout section, ukuran card, atau fitur lain.

## File yang diubah

Path berikut relatif terhadap root repository:

| File | Perubahan |
| --- | --- |
| `frontend/src/hooks/useSlidingPage.js` | Timeline bersama card dan indikator; lifecycle dan lock navigasi |
| `frontend/src/pages/GuruPage.jsx` | Menghubungkan pill ke timeline dan merapikan chevron |
| `frontend/src/components/tentang/TentangKepalaSekolahSection.jsx` | Menyesuaikan caller hook yang sama pada profil sekolah |
| `frontend/src/components/fasilitas/CampusPreview.jsx` | Indikator foto pada timeline bersama dan chevron dropdown |
| `frontend/src/components/fasilitas/CampusExplorer.css` | Memusatkan gambar panah tanpa memutar posisi tombol |
| `frontend/src/assets/fasilitas/campus/detail/carousel-arrow.svg` | Memusatkan path chevron terhadap lingkaran |
| `frontend/src/components/Navbar.jsx` | Chevron navbar tidak menyusut dan memakai display block |
| `frontend/src/data/campusData.js` | Pemetaan GOR, detail, filter, serta tautan dari lapangan ke peta |
| `frontend/src/data/translationsFasilitas.js` | Terjemahan Gedung Olahraga |
| `frontend/scripts/uji-carousel-sync.mjs` | Regresi per frame, navigasi, alignment, GOR, dan autoplay |
| `frontend/scripts/uji-guru-grid-browser.mjs` | Ekspektasi timeline 500 ms tanpa transisi CSS terpisah |
| `frontend/scripts/uji-campus-explorer-browser.mjs` | Ekspektasi pin GOR |
| `frontend/scripts/uji-fasilitas-refinement-browser.mjs` | GOR tanpa dropdown kelas, cakupan kelas A–C, dan validasi foto terdecode |
| `docs/perbaikan-carousel-gor-2026-10-14.md` | Laporan dan handoff Git |

## Hasil pengujian

Browser: Chrome lokal melalui Playwright. Request daftar REST pada pengujian browser memakai respons fixture kosong; carousel guru dan fasilitas membaca data lokal existing. Pengujian ini menilai frontend, bukan database/deployment publik.

| Pengujian | Hasil |
| --- | --- |
| Uji sebelum perbaikan | Gagal pada perbedaan progress card dan pill; reproduksi root cause |
| `uji-carousel-sync.mjs` pada dev server | Lulus: 12 rekaman Next/Previous per frame di 1440/390 px, kedua grid guru, galeri fasilitas, burst 12 klik, loop foto dua arah, alignment panah/dropdown, reduced motion, GOR ID/EN, overflow, runtime, loop Beranda, autoplay nyata, resume setelah manual |
| `uji-guru-grid-browser.mjs` | Lulus: 1440/1200/1199/768/767/375/320 px, ID/EN, seluruh halaman kedua kelompok guru, tinggi stabil, pagination independen, keyboard, resize, fixture 0/1/7/8/9/15 guru, pill 500 ms, reduced motion |
| `uji-fasilitas-refinement-browser.mjs` | Lulus: 12 pilihan kelas A–C (10 memiliki foto), 12 kasus responsif/bahasa, 13 foto guru terdecode, swipe mobile, error runtime dan aset kosong |
| `uji-campus-explorer-browser.mjs` | Lulus: 12 pin/shared preview, 14 kasus viewport/bahasa, mouse/touch/trackpad/keyboard, batas pan/resize, pemisahan drag/klik, list/map, fallback/retry foto |
| `uji-carousel-sync.mjs` pada production preview | Lulus pada 1440/390 px: seluruh pemeriksaan sync, rapid clicks, loop, autoplay/resume, dropdown, chevron navbar saat hover/toggle, dan GOR ID/EN termasuk detail lapangan → peta |
| `npm.cmd run lint` | Lulus, exit 0 |
| `npm.cmd run build` | Lulus, exit 0; build terbaru 5.92 detik. Ada peringatan informasional waktu plugin `vite:asset` |
| `git diff --check` | Lulus, exit 0 |

Bukti lokal:

- `outputs/carousel-sync/results.json`
- `outputs/carousel-sync/gallery-1440.png`
- `outputs/carousel-sync/gallery-390.png`
- `outputs/carousel-sync/build.log`
- `outputs/carousel-sync/lint.log`
- `outputs/guru-grid-sync/results.json`
- `outputs/refinement-sync/refinement-results.json`
- `outputs/campus-sync/results.json`
- `outputs/carousel-sync-production/results.json`

## Menjalankan ulang

Dari `D:\LombaTelkom\smk-telkom-purwokerto\frontend`, jalankan dev server di terminal terpisah:

```powershell
npm.cmd run dev -- --host 127.0.0.1 --port 4174 --strictPort
```

Lalu:

```powershell
$env:PLAYWRIGHT_MODULE='file:///C:/Users/IDEAPAD%20SLIM%203/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'
$env:QA_URL='http://127.0.0.1:4174'
$env:QA_BASE_URL='http://127.0.0.1:4174'
node scripts/uji-carousel-sync.mjs
node scripts/uji-guru-grid-browser.mjs
node scripts/uji-fasilitas-refinement-browser.mjs
node scripts/uji-campus-explorer-browser.mjs
npm.cmd run lint
npm.cmd run build
git diff --check
```

## Handoff Git

Status diperiksa pada branch `feat/fasilitas-sekolah`, remote `origin` mengarah ke `https://github.com/KiandrAHD/smk-telkom-purwokerto.git`. Belum ada commit, push, atau deployment dari pengerjaan ini. Folder `outputs/` sudah untracked sebelum pengerjaan dan tidak dimasukkan dalam perintah staging berikut.

Jalankan dari root repository setelah meninjau perubahan:

```powershell
Set-Location 'D:\LombaTelkom\smk-telkom-purwokerto'
$carouselFiles = @(
  'frontend/src/hooks/useSlidingPage.js'
  'frontend/src/pages/GuruPage.jsx'
  'frontend/src/components/tentang/TentangKepalaSekolahSection.jsx'
  'frontend/src/components/fasilitas/CampusPreview.jsx'
  'frontend/src/components/fasilitas/CampusExplorer.css'
  'frontend/src/assets/fasilitas/campus/detail/carousel-arrow.svg'
  'frontend/src/components/Navbar.jsx'
  'frontend/src/data/campusData.js'
  'frontend/src/data/translationsFasilitas.js'
  'frontend/scripts/uji-carousel-sync.mjs'
  'frontend/scripts/uji-guru-grid-browser.mjs'
  'frontend/scripts/uji-campus-explorer-browser.mjs'
  'frontend/scripts/uji-fasilitas-refinement-browser.mjs'
  'docs/perbaikan-carousel-gor-2026-10-14.md'
)
git add -- $carouselFiles
git diff --cached --stat
git commit -m "fix: synchronize carousels and correct GOR mapping"
git push origin feat/fasilitas-sekolah
```

Perangkat mobile fisik dan deployment publik belum diuji. Foto khusus GOR belum tersedia; detail menggunakan fallback existing, bukan foto ruang kelas D.
