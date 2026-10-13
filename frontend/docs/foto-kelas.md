# Integrasi foto ruang kelas

Tanggal: 13 Oktober 2026. Sumber: `Foto Kelas-20261013T143740Z-1-001.zip`. Foto dipasangkan berdasarkan identitas folder ZIP, pemeriksaan seluruh 207 foto melalui contact sheet, serta konfirmasi pengguna untuk C 2.2. Tidak ada foto buatan atau pergantian nama kelas.

## Hasil audit dan keputusan pengguna

| Pemeriksaan | Hasil |
| --- | ---: |
| Foto dalam ZIP | 207 |
| Ukuran total foto sumber ZIP | 542604338 bytes |
| Format | Semua JPEG, ekstensi .jpg/.jpeg |
| Resolusi sumber | 4032×3024, 4080×3060, 3264×2448 |
| Rentang ukuran file | 1391873–5185909 bytes |
| Duplikat byte identik (SHA-256) | 0 |
| Kelas existing | 16 |
| Kelas existing yang mendapat foto | 13 |
| Foto yang diintegrasikan | 91 |
| Kelas existing tanpa foto asli | 3 |
| Foto kelas tambahan yang belum masuk inventaris | 51, untuk 9 kelas |
| Foto fasilitas selain ruang kelas | 60 |
| Foto dengan identitas kelas belum jelas | 5 |
| File nonfoto | 1 DOCX kosong dalam folder Gor |

Ada sejumlah foto dengan sudut hampir sama atau nama berakhiran `_1`, tetapi tidak ada duplikat file identik. Foto tersebut tetap tersedia sebagai dokumentasi sesuai permintaan, bukan dipakai untuk kelas lain.

Pengguna memilih hanya 13 kelas existing; sembilan kelas tambahan tidak ditambahkan. Pengguna juga mengonfirmasi C 2.2 hanya menggunakan delapan foto kursi merah berformat .jpeg. Lima foto kursi kayu di folder yang sama tidak dipasangkan secara paksa.

Metadata nama, format, ukuran, dimensi, orientasi dan hash seluruh foto terdapat pada [foto-kelas-audit.json](foto-kelas-audit.json). Pemetaan 91 foto serta ukuran setiap hasil optimasi terdapat pada [foto-kelas-integrasi.json](foto-kelas-integrasi.json). ZIP dan foto original tidak diubah.

## Kelengkapan kelas

Urutan dan nama kelas website dipertahankan. Nama file berikut adalah foto utama; seluruh foto lain untuk kelas yang sama dapat dipilih pada modal detail.

| Nama Kelas | Status Foto | Nama File Utama | Keterangan |
| --- | --- | --- | --- |
| Kelas A 1.4 | Tersedia | IMG_2421.jpeg | 6 foto, terintegrasi |
| Kelas A 2.2 | Tersedia | IMG_20261013_161445.jpg | 6 foto, terintegrasi |
| Kelas A 3.4 | Tersedia | IMG_20261013_161621.jpg | 6 foto, terintegrasi |
| Kelas A 3.6 | Tersedia | IMG_20261013_161743.jpg | 6 foto, terintegrasi |
| Kelas B 1.4 | Tersedia | IMG_20261012_061545.jpg | 7 foto, terintegrasi |
| Kelas B 1.5 | Tersedia | IMG_20261012_061318.jpg | 6 foto, terintegrasi |
| Kelas B 2.3 | Tersedia | IMG_2450.jpeg | 7 foto, terintegrasi |
| Kelas B 2.5 | Tersedia | IMG_2459.jpeg | 6 foto, terintegrasi |
| Kelas C 2.2 | Tersedia | IMG_2464.jpeg | 8 foto kursi merah; dikonfirmasi pengguna |
| Kelas C 2.3 | Belum | belajar-kelompok-laptop.png | Fallback existing dipertahankan; perlu foto asli |
| Kelas C 3.2 | Tersedia | IMG_20261012_065812.jpg | 5 foto, terintegrasi |
| Kelas C 3.3 | Belum | belajar-kelompok-laptop.png | Fallback existing dipertahankan; perlu foto asli |
| Kelas D 1.2 | Tersedia | IMG_20261012_061054.jpg | 9 foto, terintegrasi |
| Kelas D 2.1 | Tersedia | IMG_2470.jpeg | 7 foto, terintegrasi |
| Kelas D 2.2 | Belum | belajar-kelompok-laptop.png | Fallback existing dipertahankan; perlu foto asli |
| Kelas D 3.1 | Tersedia | IMG_20261012_070008.jpg | 12 foto, terintegrasi |

Daftar lengkap yang masih memerlukan foto: Kelas C 2.3, Kelas C 3.3, dan Kelas D 2.2.

## Foto yang belum dipasangkan

Lima foto berikut berada di folder `Foto Kelas/C2.2`, tetapi pengguna menyatakan hanya set kursi merah yang benar untuk C 2.2. Identitas kelas set kursi kayu masih perlu dikonfirmasi:

| Nama File | Status |
| --- | --- |
| IMG_20261012_070333.jpg | Belum diketahui kelasnya |
| IMG_20261012_070343.jpg | Belum diketahui kelasnya |
| IMG_20261012_070357.jpg | Belum diketahui kelasnya |
| IMG_20261012_070404.jpg | Belum diketahui kelasnya |
| IMG_20261012_070410.jpg | Belum diketahui kelasnya |

Foto kelas tambahan berikut jelas nama foldernya, tetapi sengaja belum digunakan karena pengguna memilih mempertahankan inventaris existing:

| Kelas tambahan | Foto |
| --- | ---: |
| A 2.5 | 7 |
| A 2.6 | 5 |
| B 3.1 | 5 |
| B 3.2 | 5 |
| B 3.3 | 5 |
| B 3.4 | 5 |
| B 3.5 | 5 |
| C 3.1 | 6 |
| D 1.1 | 8 |

Sebanyak 60 foto di luar ruang kelas dipisahkan dari pekerjaan ini: Aula 9, DLG 7, Gor 12, Kopsis 2, Lab TJA 6, Lab TKJ 5, Lapangan Upacara 8, Parkiran 5, Perpustakaan 6. Foto tersebut tidak digunakan sebagai pengganti ruang kelas. Nama file lengkap tetap tersedia dalam audit JSON.

## Integrasi dan optimasi

Kartu memakai satu foto utama. Modal existing menyediakan foto besar dan thumbnail untuk memilih seluruh foto kelas. Alt gambar memakai nama fasilitas; catatan “foto ilustrasi” hanya tampil jika ruangan masih memakai fallback. Tampilan ID/EN disediakan untuk penghitung dan tombol foto.

- WebP 320/640/960/1280px dari sumber JPEG, quality 78 pada ukuran kecil dan 82 pada ukuran besar.
- Aspect ratio sumber 4:3 dipertahankan; tidak ada upscaling. Auto-orientation diterapkan sebelum resize.
- Total 364 varian: 20911352 bytes, dibanding 243677398 bytes untuk 91 foto original yang digunakan. Seluruh varian bersama-sama 91,4% lebih kecil; angka ini bukan ukuran unduhan awal halaman.
- Srcset/sizes memilih resolusi sesuai lebar kartu/modal dan DPR. Kartu desktop memakai ukuran render sekitar 284px; mobile mengikuti lebar konten.
- IntersectionObserver dengan rootMargin 200px membatasi pemuatan gambar kartu hingga mendekati viewport; img tetap loading lazy dan decoding async.
- Katalog galeri lengkap dimuat melalui dynamic import hanya saat modal dibuka. Gambar selain foto terpilih menggunakan thumbnail 320px, loading lazy.
- Rasio container kartu tetap 16:9, radius 16px, spacing, font, hover scale dan animasi existing dipertahankan. Foto asli memakai object-cover/center pada kartu, object-contain pada modal supaya seluruh komposisi bisa dilihat.
- Intrinsic width/height serta container aspect ratio mencegah perubahan ruang layout saat gambar dimuat.

Tidak ada dependency tambahan. Hero, Campus Explorer, navbar, footer, data fasilitas landing carousel dan inventaris/nama/urutan kelas tidak diubah. Foto kelas yang sama pada kategori Kelas dan Semua memakai sumber yang sama karena identitas ruangannya sama; satu foto tidak dipakai untuk kelas berbeda.

## File source dan artefak

| File | Perubahan |
| --- | --- |
| `src/data/fasilitasPageData.js` | Menghubungkan foto utama ke nama kelas, fallback tetap |
| `src/data/translationsFasilitas.js` | Dua terjemahan untuk galeri |
| `src/pages/FasilitasPage.jsx` | Lazy image cards, galeri detail, alt dan catatan fallback |
| `src/data/classroomPhotoManifest.json` | Nama kelas, identitas setiap foto dan path sumber ZIP |
| `src/data/classroomPhotoCovers.js` | Import varian foto utama untuk kartu |
| `src/data/classroomPhotos.js` | Katalog galeri yang dimuat saat diperlukan |
| `src/assets/fasilitas/kelas/` | 364 WebP teroptimasi |
| `scripts/optimasi-foto-kelas.mjs` | Pipeline resize/kompresi dan manifest, dengan self-check |
| `scripts/uji-foto-kelas.mjs` | QA metadata, mapping dan browser |
| `docs/foto-kelas-audit.json` | Metadata seluruh 207 foto |
| `docs/foto-kelas-integrasi.json` | Provenance dan ukuran seluruh 91 foto terpakai |
| `docs/foto-kelas.md` | Laporan ini |
| `docs/git-foto-kelas.md` | Perintah Git terbatas pada file tugas |

## Validasi

`uji-foto-kelas.mjs` memvalidasi identitas folder/nama kelas, delapan JPEG C 2.2, 91 hash unik, metadata/ukuran 364 WebP, pilihan resolusi, source yang benar ketika thumbnail dipilih, fallback tiga kelas, keterbacaan ID/EN, Escape/focus dan overflow. Seluruh 91 foto galeri dicoba pada desktop; foto pertama/terakhir setiap kelas dicoba pada tablet/mobile. Kartu mempertahankan rasio 16:9/radius 16px pada 1440, 768, 390 dan 320px.

Uji regresi halaman existing juga lolos: route/refresh, kategori, 16 modal/Escape/fokus, 12 kombinasi viewport/bahasa (1920, 1440, 1366, 768, 390, 375), carousel loop/autoplay, menu desktop/mobile dan runtime. Pengujian ini dilakukan sebelum pemisahan katalog galeri; QA foto dijalankan kembali setelah pemisahan untuk memvalidasi asynchronous loading.

Lint dan production build berhasil. Proyek memakai JS/JSX tanpa script TypeScript/typecheck. Screenshot dan JSON QA tersimpan di `D:/LombaTelkom/qa-output/foto-kelas-2026-10-13/browser`; contact sheet seluruh foto, original hasil ekstraksi dan pengukuran performa berada di folder induknya. Tidak ada deployment atau pengujian perangkat fisik.

Kendala yang masih memerlukan input: tiga foto kelas yang belum tersedia dan identitas lima foto kursi kayu. Kelas tambahan serta fasilitas nonkelas ditunda sesuai keputusan pengguna, bukan dianggap hilang.

## Pengukuran performa sebelum dan sesudah

Build produksi lokal, browser Chrome, cold cache, latency 150ms, download 200000 bytes/s, CPU slowdown 4×, viewport tinggi 900px. Masing-masing viewport memakai tiga run; tabel memakai median. Data API disubstitusi konsisten. Pengukuran dilakukan saat halaman dibuka tanpa scroll, lalu setelah daftar fasilitas mendekati viewport. Hasil ini merupakan pengukuran lab, bukan Core Web Vitals pengguna produksi.

| Metrik | Desktop 1440 sebelum | Desktop sesudah | Mobile 390 sebelum | Mobile sesudah |
| --- | ---: | ---: | ---: | ---: |
| LCP | 6284ms | 6332ms | 4808ms | 5064ms |
| CLS | 0,0001566 | 0,0001566 | 0 | 0 |
| Foto kelas diminta sebelum scroll | 0 | 0 | 0 | 0 |
| Transfer gambar awal yang sudah selesai | 307139 bytes | 475614 bytes | 132246 bytes | 300721 bytes |
| Transfer gambar setelah scroll yang sudah selesai | 475614 bytes | 642078 bytes | 595819 bytes | 700237 bytes |
| Request gagal pada pengukuran | 0 | 0 | 0 | 0 |

LCP median berbeda +48ms desktop dan +256ms mobile; tidak diklaim identik atau sepenuhnya bebas penurunan. Rentang tiga run: desktop sebelum 6116–6384ms/sesudah 6172–6380ms, mobile sebelum 4780–4956ms/sesudah 4836–5068ms. Jumlah sampel kecil dan pengukuran lokal membatasi kesimpulan.

Transfer menggunakan snapshot 2,5 detik setelah load dan setelah scroll; resource yang masih berjalan belum ikut dihitung. Selisih transfer awal 168475 bytes berasal dari gambar STELA existing yang selesai pada fase berbeda, bukan foto kelas. Aset STELA tidak diubah. Karena window pengukuran tersebut, angka transfer total ini tidak boleh dibaca sebagai ukuran seluruh halaman selesai diunduh.

Pada implementasi awal, native lazy loading masih mengambil empat foto kelas desktop/satu mobile sebelum scroll; LCP median 7092ms/5184ms. Optimasi IntersectionObserver menghilangkan unduhan kelas awal. Pemisahan katalog menurunkan chunk halaman Fasilitas dari 98919 menjadi 50202 bytes; chunk galeri 54154 bytes baru diminta saat modal dibuka. Full gallery tidak memperbesar entry JavaScript global secara signifikan.

Setelah daftar digulir, permintaan foto kartu yang muncul menggunakan varian 320px pada desktop DPR 1 dan 640px pada mobile DPR 1 dalam pengukuran ini. Permintaan galeri baru terjadi saat pengguna membuka detail. Semua asset build dan foto terpilih didekode dalam QA terpisah, sehingga validitas asset tidak hanya disimpulkan dari snapshot transfer.

Bukti mentah: `D:/LombaTelkom/qa-output/foto-kelas-2026-10-13/perf-before.json`, `perf-after.json` (native lazy awal), `perf-after-final.json` (IntersectionObserver), dan `perf-after-lazy-catalog.json` (implementasi final). Skrip pengukuran: `measure-performance.mjs` pada folder yang sama. Pengujian produksi hosted dan perangkat fisik belum dilakukan; LCP halaman tetap perlu evaluasi tersendiri sebelum menyatakan performa keseluruhan baik.
