# Penyempurnaan label, spacing, dan marquee — 13 Oktober 2026

Koreksi referensi terbaru: pita sesudah Tentang di Beranda adalah aksen merah bermotif, bukan pill teks. Implementasi menggunakan varian non-animated RibbonDivider dan aset existing ribbon-divider.png. Aksen yang sama ditambahkan setelah kontrol carousel Kesiswaan, sebelum Guru & Tenaga Pendidik pada Profil Guru. Marquee pill sesudah hero tetap tersedia. Uraian penambahan marquee kedua di bawah merekam hasil sebelum koreksi ini.

Validasi koreksi: lint/build lulus (build 3,50 detik), tes shared marquee 12 halaman × 4 viewport lulus dengan satu marquee hero serta aksen pada dua lokasi yang diminta; pemeriksaan tambahan pada 1440/768/390/320 px memastikan placement, tidak ada overflow, dan tombol carousel Kesiswaan tetap mengganti daftar. Screenshot: D:/LombaTelkom/qa-output/ribbon-accent/placement-guru-1440.png dan varian ukuran lainnya. File koreksi: RibbonDivider.jsx, LandingPage.jsx, GuruPage.jsx, uji-hero-marquee-browser.mjs serta laporan ini. Browser Chrome, belum perangkat fisik/Safari.

## Perubahan

- Sumber bersama `quickLinks` mengubah label NextTel AI menjadi NextTel. Tidak ada string NextTel AI yang tersisa di `frontend/src`. Route `/nexttel`, deskripsi, CTA, fungsi layanan, serta nama STELA AI dipertahankan.
- Sumber bersama `navLinks` mengubah Guru menjadi Profil Guru. Desktop dan mobile mengambil konfigurasi yang sama; route tetap `/profil-sekolah/guru`. Terjemahan Teacher Profiles sudah tersedia dan digunakan kembali.
- `RibbonDivider` tetap memakai pill, empat kelopak, font, warna, ukuran dan animasi existing. Gap pill↔kelopak serta jarak ke pill berikutnya naik dari 8 px menjadi 16 px pada mobile / 24 px mulai breakpoint sm. Padding atas/bawah menjadi 24 px / 32 px. Implementasi memakai gap-4/pr-4/sm:gap-6/sm:pr-6 dan py-6/sm:py-8 dari skala Tailwind website.
- Padding kartu akses cepat desktop menjadi 12 px vertikal / 16 px horizontal, gap ikon 12 px, dan jarak judul/deskripsi/CTA menjadi 8 px. Fixed height dan fixed text rows diganti minimum height dengan grid auto agar deskripsi ID/EN tetap muat dan CTA sejajar. Ukuran teks, ikon, border, shadow, container, dan overlap hero tetap memakai standar existing.
- Beranda menggunakan kembali `RibbonDivider animated` tepat setelah AboutSection dan sebelum DepartmentsSection. Pita setelah hero tetap tersedia; tidak ada dua pita pada posisi yang sama.

## Integrasi antarhalaman

Spacing pita otomatis berlaku pada seluruh 12 pemakai shared component: Beranda, Jurusan, Profil Sekolah, Profil Guru, Fasilitas, Ekstrakurikuler, Prestasi, BKK, Berita, Pengumuman, SPMB, dan Kalender. Beranda memiliki dua penempatan berbeda; halaman lainnya masing-masing satu. Portal, dashboard, halaman detail dan NextTel tidak ditambahkan pita.

HeroSection dan stylesheet shared hero menerapkan spacing akses cepat pada pemakai panel yang sama. Statistik hero, kartu agenda, School Tour, navbar layout, footer, gambar, konten, font global dan warna dasar tidak dirombak. Spacing tambahan hanya pada komponen/pola yang diminta.

## Animasi dan aksesibilitas

Track tetap terdiri dari dua grup identik, tanpa gap di antara separuh track. Gap berada di dalam item yang ikut diulang sehingga translateX(-50%) tetap menyambung. Durasi 160 detik, linear, infinite tetap digunakan. Overflow terkurung di komponen. Reduced motion tetap menghentikan animasi dan menampilkan empat label satu kali, bukan menyembunyikan slogan yang berada di luar viewport.

## Validasi aktual

- `node scripts/uji-akses-cepat-hero.mjs`: lulus label dan route tiga akses cepat.
- `npm.cmd run bahasa:uji`: lulus; mencakup label navigasi, brand, route, terjemahan, serta 81 rendered content views.
- `node scripts/uji-hero-marquee-browser.mjs`: lulus 12 halaman × 4 viewport (1440/768/375/320), spacing bersama, jumlah dan posisi pita, alignment, pill/kelopak, coverage, tidak ada overflow/clipping. Pemeriksaan siklus 4K dan perbandingan piksel sebelum/sesudah loop lulus; selisih rata-rata sekitar 1 tingkat intensitas per channel. Reduced motion lulus empat ukuran layar.
- `node scripts/uji-hero-konsistensi.mjs`: lulus 154 pemeriksaan (11 halaman × 7 viewport × ID/EN), termasuk container, navbar gap, floating panel, gambar, teks, CTA clearance dan overflow.
- Pemeriksaan browser label/menu: lulus 5 viewport (1835/1440/768/390/320) × ID/EN; label NextTel, STELA AI, Profil Guru/Teacher Profiles, route navigasi asli, ukuran dropdown dan alignment kartu.
- Screenshot diperiksa untuk spacing hero desktop serta penempatan pita/section mobile; screenshot desktop/tablet/mobile tambahan tersimpan pada direktori QA.
- `npm.cmd run lint`: lulus setelah perubahan kode dan tes.
- `npm.cmd run build`: lulus, 3,28 detik. Notice timing plugin Vite tidak menggagalkan build.
- `git diff --check`: lulus. Typecheck terpisah tidak tersedia pada proyek JS/JSX ini.

Browser menggunakan production preview `http://127.0.0.1:5199` dengan fixture REST read-only. Bukti: `D:/LombaTelkom/qa-output/ui-spacing-marquee`, `ui-spacing-hero`, `ui-spacing-labels`, serta log terkait di `D:/LombaTelkom/qa-output`. Tidak ada perubahan data hosted.

Tes bahasa diperbarui mengikuti nama baru. Tes marquee kini mengharapkan dua penempatan pada Beranda dan memeriksa jarak actual. Tes konsistensi hero mereset scroll sebelum mengukur bahasa berikutnya karena screenshot elemen mobile yang tinggi dapat menggulir halaman; aturan navbar tidak diubah untuk mengatasi kondisi tes tersebut.

Batas pemeriksaan: Chrome desktop dengan ukuran viewport emulasi; belum Safari, Firefox, atau perangkat fisik. Tidak mengklaim regresi seluruh fitur website. Tidak ada detail desain yang memerlukan konfirmasi untuk perubahan ini.

## File yang diubah

1. `frontend/src/data/dummyData.js`
2. `frontend/src/components/RibbonDivider.jsx`
3. `frontend/src/components/RibbonDivider.css`
4. `frontend/src/pages/LandingPage.jsx`
5. `frontend/src/styles/hero.css`
6. `frontend/scripts/uji-akses-cepat-hero.mjs`
7. `frontend/scripts/uji-bahasa.mjs`
8. `frontend/scripts/uji-hero-marquee-browser.mjs`
9. `frontend/scripts/uji-hero-konsistensi.mjs`
10. `frontend/docs/ui-spacing-marquee.md` (baru)

## Git handoff

Branch dan remote sudah diperiksa: feat/fasilitas-sekolah, origin https://github.com/KiandrAHD/smk-telkom-purwokerto.git. Commit/push belum dilakukan. Staging hanya file tugas ini:

```powershell
Set-Location 'D:\LombaTelkom\smk-telkom-purwokerto'
git add -- frontend/src/data/dummyData.js frontend/src/components/RibbonDivider.jsx frontend/src/components/RibbonDivider.css frontend/src/pages/LandingPage.jsx frontend/src/styles/hero.css frontend/scripts/uji-akses-cepat-hero.mjs frontend/scripts/uji-bahasa.mjs frontend/scripts/uji-hero-marquee-browser.mjs frontend/scripts/uji-hero-konsistensi.mjs frontend/docs/ui-spacing-marquee.md
git diff --cached --stat
git commit -m "fix: refine shared spacing navigation labels and home marquee"
git push origin feat/fasilitas-sekolah
```
