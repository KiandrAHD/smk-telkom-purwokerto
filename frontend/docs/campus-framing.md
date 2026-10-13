# Campus Explorer: framing, hotspot, slider dan motion

Referensi: Figma `ca2iX76GpJSr0QC7Qyv9RV`, frame `205:411` (FASILITAS SEKOLAH drag 1) dan `205:1177` (drag 2). Sesuai konfirmasi pengguna, frame dengan garis penghubung label–pin menjadi target, bukan screenshot tanpa garis.

## Root cause

1. Viewport lama dibatasi container 1280 px dan padding, sementara stage menggabungkan width 170%, min-width 1440 px dan max-width 2164 px. Rasio framing berubah ketika salah satu batas aktif: mobile menampilkan potongan terlalu sempit dan tinggi; layar besar tidak mengikuti proporsi frame Figma.
2. Offset awal memakai 6,4% dari rentang pan, bukan posisi gambar Figma. Perubahan rentang menyebabkan komposisi awal ikut berubah.
3. Pin memakai SVG 101,9 × 113 dengan padding shadow besar, dirender pada ukuran tetap; ukuran visual tidak mengikuti scale gambar. Label tidak mempunyai konektor dan menggunakan pointer-events none, sehingga area label di luar hitbox pin tidak dapat membuka informasi.
4. Slider belum memiliki progress merah dan ikon dua arah. Posisi slider lama berada di luar seluruh tinggi gambar, sedangkan Figma menempatkannya pada bagian bawah area dekorasi.
5. QA menemukan aturan reduced motion global yang memberi transition-duration 0,01 ms pada semua elemen. Karena transition-property default adalah all, transform peta masih mengalami transisi singkat. Geometri peta sekarang secara lokal memakai transition-property none; global CSS tidak diubah.

Aspect ratio aset asli 2164 × 727 tidak diubah. Cropping vertikal tidak diselesaikan dengan stretching atau overflow visible.

## Geometri baru

`campusGeometry(viewportWidth)` menggunakan:

```text
stageWidth = clamp(960, viewportWidth × 3142 / 1847, 3142)
stageHeight = stageWidth × 727 / 2164
maximumPan = max(0, stageWidth − viewportWidth)
initialPan = clamp(83 × stageWidth / 3142, 0, maximumPan)
```

Pada lebar frame Figma 1847 px, browser menghasilkan stage 3142 px, offset awal 83 px, dan maksimum 1295 px. Desktop mengikuti area peta lebar pada Figma; hero dan daftar fasilitas tetap memakai container existing. Minimum stage mobile 960 px memberi bangunan yang masih jelas, dengan tinggi sekitar 323 px, dibanding minimum lama 1440 px yang menghasilkan tinggi sekitar 484 px.

ResizeObserver menghitung ulang dimensi dan mempertahankan fraksi posisi kamera. Jika peta sepenuhnya muat, pan bernilai nol dan kontrol dinonaktifkan. Kasus ini diuji pada viewport 3840 px. Kedua ujung gambar dan seluruh 12 hotspot tetap dapat dijangkau melalui kontrol atau fokus keyboard.

Pemotongan sisi kanan/kiri pada state awal tetap merupakan bagian panning seperti Figma. Peta tidak diperkecil agar semua bangunan selalu tampil sekaligus. Beberapa label di ujung viewport perlu pan/fokus untuk ditampilkan penuh.

## Hotspot dan aset

Koordinat ujung pin yang sudah terverifikasi dipertahankan, dalam persentase terhadap gambar. Gedung A/B/C dan dua titik D memakai frame pertama. DLG, Perpustakaan dan Aula memakai posisi frame kedua; ini menghindari konflik posisi Perpustakaan/DLG antara kedua frame. Dua titik D tetap menuju profil yang sama. Tidak mengganti titik menjadi GOR atau menebak laboratorium baru tanpa referensi lokasi yang konsisten.

`campusAnnotations` menambahkan posisi dasar label, anchor, leader dan diagonal RPS dari node Figma. Label bergerak bersama peta dan dapat diklik langsung. RPS menampilkan keterangan Ruang Praktik Siswa. Active state, keyboard focus, panel, foto/fallback dan hubungan ke kartu tetap digunakan kembali.

18 SVG diekspor langsung dari child node Figma: pin dengan shadow compact 33,9 × 45, garis vertikal, dua konektor diagonal, anchor dan dua panah slider. Isi dan root dimensions SVG tidak diedit. Scaling dilakukan pada wrapper. Pin minimum sekitar 14 px secara visual untuk mobile, dengan hit target tetap 44 × 44 px. Di mobile, label/konektor hanya terlihat saat hover, focus atau aktif agar tidak bertumpuk.

## Panning, slider dan parallax

Panning menggunakan satu posisi numerik di controller: Pointer Events → requestAnimationFrame → translate3d pada stage. Tidak ada React render per pointer frame atau pembacaan layout berulang saat drag. Pengukuran layout dilakukan ketika resize. Threshold 8 px/axis lock membedakan klik dari drag; touch pan-y menjaga scroll vertikal. Wheel horizontal/Shift-wheel tetap tersedia.

Drag mengikuti pointer langsung. Tombol arah dan pemusatan fasilitas memakai cubic easing 320 ms; slider mengikuti input langsung. Tidak menambahkan inertia atau bounce agar batas dan pemilihan fasilitas tetap mudah dikontrol. Listener, observer, RAF dan pointer capture dibersihkan saat unmount.

Range native mempertahankan akses keyboard dan track click. Progress merah, nilai range, ikon handle dan tombol arah diperbarui dari posisi yang sama. Track 6 px, handle 56 px, dua ikon panah dari Figma, radius/shadow dari website. Slider diposisikan sekitar 93 unit gambar di atas ujung stage mengikuti Figma. Preview desktop berada di atas zona kontrol; tablet/mobile memakai alur dokumen dengan kontrol di bawah preview agar CTA tidak tertutup.

Parallax terbatas pada tekstur lantai: counter-offset 4% dari pan, maksimum 16 px. Bangunan, label, anchor dan pin tidak mendapat parallax independen. Efek nol saat prefers-reduced-motion. Ini merupakan adaptasi motion yang ringan; bukan simulasi kamera 3D atau replika seluruh pergeseran floor layer Figma.

Hint kini “Geser untuk Menjelajah”. Key localStorage lama tetap dipakai agar pengguna yang sudah belajar tidak mendapat hint lagi. Hint selesai setelah perpindahan drag/trackpad aktual minimal 24 px; tidak setelah hover, navigasi slider, atau menarik keluar batas tanpa bergerak. Storage gagal tetap ditangani selama sesi komponen.

## Validasi

- Unit geometry ditulis RED sebelum fungsi dibuat, lalu GREEN. Meliputi framing Figma, mobile, gambar muat, bounds, centering, gesture, hint/storage dan sumber data fasilitas.
- `uji-campus-explorer-browser.mjs`: lulus 14 kombinasi viewport/bahasa, mouse/touch emulasi CDP, wheel, keyboard, drag vs klik, seluruh hotspot, klik label, native track click, progress merah, batas, resize/orientasi, panel/fokus/close, hint persisten/storage blocked, gambar gagal/retry, list↔map, parallax capped dan reduced motion.
- `uji-halaman-fasilitas.mjs`: lulus routing/refresh/filter, 16 modal/Escape/fokus, 12 viewport/bahasa, navbar desktop/mobile dan carousel existing.
- `npm.cmd run bahasa:uji`: lulus.
- `npm.cmd run lint`: lulus.
- `npm.cmd run build`: lulus; notice timing Vite asset plugin tidak menggagalkan build.
- `git diff --check`: lulus. Tidak ada script typecheck terpisah pada proyek JS/JSX ini.

Screenshot Figma dan implementasi dibandingkan pada lebar 1439 px untuk kedua state. Screenshot mobile preview juga diperiksa. Bukti tersimpan di `D:/LombaTelkom/qa-output/campus-framing`, `campus-framing-regression`, log terkait, serta `figma-campus-state-1.png` dan `figma-campus-state-2.png`. Pengujian browser menggunakan production preview Chrome dan fixture REST read-only, tanpa menulis database hosted.

Perbedaan yang tersisa: Poppins/Inter mengikuti website; ukuran label dan handle mengikuti typography/component tokens, sehingga tidak menyalin semua ukuran Figma secara mentah. Gambar asli pengguna lebih tajam daripada gambar lama pada Figma. Minimum scale/label visibility mobile adalah adaptasi karena kedua frame merupakan desktop. Figma sendiri mempunyai beberapa nama/posisi yang tidak konsisten; pemetaan antarframe dijelaskan di atas. Safari/perangkat fisik dan pengukuran FPS belum diuji; tidak ada klaim kesamaan piksel penuh.

## File perubahan dan Git

Diubah: `src/components/fasilitas/CampusExplorer.jsx`, `CampusExplorer.css`, `src/hooks/useCampusPan.js`, `src/utils/campusPan.js`, `src/data/campusData.js`, `src/data/translationsSchool.js`, `scripts/uji-campus-explorer.mjs`, dan `scripts/uji-campus-explorer-browser.mjs` (semua di frontend). Ditambahkan: laporan ini dan 18 SVG di `src/assets/fasilitas/campus` dengan prefix nama node-205- dan ID 1109, 1113, 1115, 1116, 1117, 1118, 1119, 1121, 1122, 1137, 1142, 1149, 1150, 1164, 1166, 1903, 1922, 1928. Model/foto/deskripsi fasilitas existing tetap digunakan; tidak ada dependency, font global, API atau schema baru.

Branch: feat/fasilitas-sekolah. Remote origin: https://github.com/KiandrAHD/smk-telkom-purwokerto.git. Commit/push belum dilakukan. Jalankan dari root repository:

```powershell
git add -- frontend/src/components/fasilitas/CampusExplorer.jsx frontend/src/components/fasilitas/CampusExplorer.css frontend/src/hooks/useCampusPan.js frontend/src/utils/campusPan.js frontend/src/data/campusData.js frontend/src/data/translationsSchool.js frontend/scripts/uji-campus-explorer.mjs frontend/scripts/uji-campus-explorer-browser.mjs frontend/src/assets/fasilitas/campus frontend/docs/campus-framing.md frontend/docs/campus-explorer.md
git diff --cached --stat
git commit -m "fix: align campus framing hotspots and panning with Figma"
git push origin feat/fasilitas-sekolah
```
