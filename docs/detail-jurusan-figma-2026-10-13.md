# Detail Jurusan — 13 Oktober 2026

Empat halaman detail existing telah disesuaikan dengan struktur Figma pada page `telkom remake again`. Tombol Selengkapnya dan route sudah berfungsi sebelum perubahan, sehingga mapping tersebut dipertahankan. Halaman Jurusan utama dan data `dummyData.js` tidak diubah.

## Audit dan route

| Jurusan | Route existing | Frame Figma | Sebelum | Sesudah |
|---|---|---|---|---|
| RPL | `/jurusan/rpl` | `225:10916`, Selengkapnya Jurusan (RPL) | Layout artikel `max-w-4xl`, gambar terpisah di bawah judul | Hero foto siswa RPL, ringkasan, fasilitas dan perjalanan belajar |
| PG | `/jurusan/pg` | `225:12486`, Selengkapnya Jurusan PG | Layout artikel; galeri memakai beberapa foto ilustrasi yang kurang relevan | Hero praktik game/VR, laboratorium, DLG, studio multimedia dan materi PG |
| TKJ | `/jurusan/tkj` | `225:11486`, Selengkapnya Jurusan TKJ | Layout artikel dan foto berbeda dari komposisi frame | Hero dua siswa praktik jaringan, fasilitas serta materi jaringan |
| TJA/TJAT | `/jurusan/tjat` | `225:11972`, Selengkapnya Jurusan TJA | Layout artikel dan foto praktik menara | Hero dua siswa membawa perangkat jaringan akses, fasilitas serta materi telekomunikasi |

Penyebab utamanya adalah penggunaan `DetailLayout`, yaitu template artikel bersama untuk berita dan halaman detail lain. Template tersebut tidak memuat susunan halaman jurusan di Figma. Komponen itu tetap digunakan oleh halaman lain; perubahan hanya dilakukan pada halaman detail jurusan.

[Referensi Figma](https://www.figma.com/design/ca2iX76GpJSr0QC7Qyv9RV/Figma-MCP?node-id=221-2084)

## Struktur dan komponen

Urutan semua halaman: hero → Animated Marquee → tentang jurusan dan kutipan tim → panel jenjang/sertifikasi/karier/pengajar → strip dekoratif → tiga fasilitas → perjalanan kelas X, XI, XII → STELA AI → CTA SPMB → footer.

`JurusanDetailPage` memilih identitas existing berdasarkan slug dan konfigurasi visual dari `jurusanDetailDesign`. `JurusanDetailHero` menjadi hero bersama dengan foto dan komposisi per jurusan. `JurusanDetailKonten` existing diperbarui untuk menampilkan ringkasan, fasilitas, dan perjalanan belajar.

Komponen yang dipakai kembali: `MainLayout`, `RibbonDivider`, `Reveal`, `StelaAISection`, `CTASection`, `Footer`, dan `ErrorPage`. STELA/CTA/footer dipasang melalui MainLayout, sehingga masing-masing hanya muncul sekali. Link hero menuju `/spmb`, link Lihat Fasilitas menuju `#fasilitas-jurusan`, CTA STELA menuju `/stela`, dan CTA terakhir menuju `/spmb` sesuai komponen website.

## Hero dan design system

Container memakai token website `max-w-7xl` / 80rem. Hero menggunakan `school-hero`, `hero-panel--bleed`, dan `hero-panel--background` yang sudah tersedia. Foto dipisahkan dari gelombang transparan, aksen merah, wordmark dekoratif, dan gradient putih. Isi teks tetap berada di layer atas dan semua visual mengikuti clipping border-radius panel.

| Jurusan | Resolusi sumber hero | Fitting | Posisi pada desktop mulai 1280px |
|---|---|---|---|
| RPL | 445 × 347 | `contain` | `right center` |
| PG | 469 × 366 | `contain` | `right top` |
| TKJ | 489 × 373 | `contain` | `right center` |
| TJAT | 485 × 377 | `contain` | `right top` |

Lebar layer foto desktop adalah 50% panel. Di bawah 1280px posisi dasar `right bottom`; di bawah 1024px foto ditempatkan setelah isi teks, memakai rasio sekitar 445:347. `contain` mempertahankan seluruh area aset sumber; cropping yang sudah ada di aset Figma tidak direkonstruksi. Gradient desktop melebur dari putih pada 44% panel menuju transparan pada 58%. Gelombang menggunakan alpha mask agar tepi kirinya tidak membentuk batas persegi panjang.

Tinggi hero mengikuti token existing: minimum 464px mulai 1280px dan 544px pada 1024–1279px; mobile mengikuti tinggi konten. Tidak memakai 100vh. Font heading tetap Poppins, body Inter; warna, spacing, shadow, tombol dan breakpoint mengikuti website. CSS baru hanya menargetkan kelas detail jurusan. Font global, navbar dan footer tidak diubah.

Animasi memakai Reveal dan motion standards existing: heading tertunda 100ms, CTA/kartu berikutnya 200ms, card lift dan image zoom ringan saat hover. Shared marquee menggunakan dua kelompok identik dan loop existing. `prefers-reduced-motion` mematikan marquee dan reveal; efek hover baru memakai `motion-safe`.

## Foto fasilitas dan optimasi

| Halaman | Kartu pertama | Kartu kedua | Kartu ketiga |
|---|---|---|---|
| RPL | Laboratorium Komputer — `rpl-lab.webp` | Perpustakaan — `library.webp` | Ruang Kelas — `rpl-class.webp` |
| PG | Laboratorium Komputer — `pg-lab.webp` | DLG — `pg-dlg.webp` | Studio Multimedia — `pg-studio.webp` |
| TKJ | Laboratorium — `tkj-lab.webp` | Ruang Praktik TKJ — `rpl-lab.webp` | Ruang Kelas — `tkj-class.webp` |
| TJAT | Laboratorium — `tjat-lab.webp` | Perpustakaan — `library.webp` | Ruang Kelas — `tjat-class.webp` |

Foto laboratorium RPL dipakai juga untuk Ruang Praktik TKJ karena kedua frame Figma menggunakan foto yang sama. Foto perpustakaan juga sama pada frame RPL/TJA. Identitas ruang mengikuti sumber Figma, belum diperiksa langsung di lokasi sekolah.

Ada 15 aset baru: empat hero, sepuluh foto fasilitas unik, dan satu strip dekoratif. Total ukuran 1.040 MB desimal. Foto fasilitas dikonversi dari 1600×1200 menjadi WebP 960×720, kualitas 88; ukuran 57–118KB per foto. Hero dikonversi ke WebP 17–27KB tanpa menaikkan resolusi sumber. Strip dekoratif diekspor dari node Figma `225:11164` dan dikompresi WebP. Gelombang dan dekorasi sisi memakai aset website existing.

Foto fasilitas memakai native lazy loading, async decoding, dimensi eksplisit, dan card image ratio 5:2. Hero memakai fetch priority tinggi dan dimensi eksplisit. Vite memproses import menjadi asset URL production; gambar jurusan lain tidak ikut diminta sebagai hero ketika membuka satu detail.

## Validasi

| Pemeriksaan | Hasil |
|---|---|
| Empat tombol Selengkapnya | Membuka detail dengan nama jurusan yang benar, tanpa reload |
| Direct access, refresh, Back/Forward | Lolos untuk keempat route |
| Scroll setelah navigasi | Kembali ke atas saat membuka detail |
| Anchor fasilitas, CTA STELA dan SPMB | Lolos; tujuan link dibuka dalam browser |
| Struktur | Tiga fasilitas, tiga tingkat, satu STELA, satu CTA dan satu footer per halaman |
| Responsif ID | 28 kombinasi: empat jurusan × 1847, 1440, 1280, 1024, 768, 390, 360px |
| Responsif EN | Delapan kombinasi: empat jurusan × 1280 dan 390px |
| Gambar | Tidak ada gambar gagal setelah section dikunjungi; pemetaan 12 kartu diperiksa ulang |
| TKJ setelah koreksi pemetaan foto | Tujuh ukuran ID dan dua ukuran EN diperiksa kembali |
| Typography | Computed font heading sesuai token website |
| Overflow | Tidak ditemukan horizontal overflow pada kombinasi yang diperiksa |
| Reveal dan marquee | Konten terlihat setelah scroll, marquee bergerak, dua half sesuai dalam toleransi subpiksel |
| Reduced motion | Marquee berhenti dan transform reveal dihapus |
| Slug tidak dikenal | Halaman 404 existing; bukan detail generik |
| Runtime / asset HTTP | Tidak ada pageerror atau asset HTTP ≥400 selama gate browser |
| Lint | `npm.cmd run lint`, exit 0 |
| Production build | `npm.cmd run build`, exit 0; Vite melaporkan informasi waktu plugin asset |
| Diff | `git diff --check`, lolos |
| Typecheck / npm test | Tidak tersedia script tersebut pada proyek JSX ini; pengujian browser khusus ditambahkan |

Gate lengkap dijalankan pada production preview Chrome lokal. Setelah perubahan terakhir berupa koreksi dua mapping foto TKJ dan penghapusan key terjemahan yang bertabrakan, build/lint dijalankan ulang, mapping semua foto diperiksa, dan tampilan TKJ diuji kembali pada seluruh breakpoint serta ID/EN.

Script uji: `frontend/scripts/uji-detail-jurusan.mjs`. Memakai Playwright yang sudah tersedia melalui `PLAYWRIGHT_MODULE`; tidak menambah dependency proyek. URL dan lokasi output bisa diatur dengan `QA_URL` dan `QA_OUTPUT`.

## Pengukuran lokal

Satu sampel per halaman/viewport pada Chrome production preview, context baru, tanpa throttling. Ini bukan pengukuran pengguna production. Baseline performa sebelumnya yang sebanding tidak tersedia, sehingga perubahan performa terhadap versi sebelumnya belum dapat disimpulkan.

| Halaman | LCP desktop 1280px | LCP mobile 390px | CLS desktop | CLS mobile |
|---|---|---|---|---|
| RPL | 1792ms | 1300ms | 0.000198 | 0 |
| PG | 352ms | 1404ms | 0.000198 | 0 |
| TKJ | 364ms | 1228ms | 0.000198 | 0 |
| TJAT | 372ms | 1404ms | 0.000198 | 0 |

Transfer gambar awal seluruh halaman, termasuk aset shared: 542–711KB pada desktop, 258–369KB pada mobile dalam sampel tersebut. Hanya satu file hero sesuai slug diminta pada setiap kasus. Native lazy loading mengikuti jarak preload browser, sehingga sebagian gambar di luar layar dapat dimuat lebih awal.

## Perbedaan dan konfirmasi data

1. Typography dan ukuran container mengikuti design system website. Frame Figma berukuran 1847×4586 dengan panel lebih lebar; hasil website memakai max-width 1280px. Perbandingan dilakukan pada viewport 1847px, serta crop hero yang dinormalisasi lebarnya untuk menilai komposisi. Tidak diklaim pixel-perfect.
2. Screenshot lampiran memperlihatkan gelombang merah di semua hero. Ekspor node frame PG/TKJ/TJA tidak menyertakan gelombang itu; metadata menunjukkan grup visual terpisah di page, misalnya `225:12445` di atas area hero TKJ. Implementasi mempertahankan gelombang sesuai referensi lampiran dan pola full-bleed website.
3. Nama TKJ dan TJAT, slug `/jurusan/tjat`, sertifikasi dan prospek karier memakai data website existing. Figma menulis “Teknik Jaringan Komputer”, “Teknik Jaringan Akses (TJA)”, serta beberapa sertifikasi berbeda. Informasi sertifikasi baru dari Figma memerlukan verifikasi sekolah sebelum menggantikan data existing.
4. Deskripsi laboratorium TJA pada Figma menyebut pengembangan software. Implementasi memakai informasi fusion splicer/OTDR/power meter dari data TJAT existing. Salah ketik PG/TJA dan kalimat DLG yang terpotong dirapikan tanpa menambah klaim baru.
5. Isi tahapan belajar mengikuti teks frame masing-masing dalam konfigurasi tampilan baru. Data kurikulum existing tidak dihapus atau ditulis ulang. Validitas resmi kurikulum Figma belum dikonfirmasi kepada sekolah.
6. Aset hero Figma hanya 445–489px lebar. Ketajaman desktop dibatasi sumber tersebut; versi asli beresolusi lebih tinggi masih diperlukan untuk peningkatan kualitas.
7. Ikon dan wordmark menggunakan komponen/font website. Garis biru pada bidang hero Figma tidak ditambahkan; styling memakai token brand. STELA, CTA dan footer memakai komponen website existing, sehingga metrik/spacings tidak persis sama dengan frame.
8. Kartu fasilitas mengikuti foto di Figma. Identitas laboratorium TKJ pada foto belum diverifikasi terhadap fasilitas fisik sekolah.

## File source

Diubah: `frontend/src/pages/JurusanDetailPage.jsx`, `frontend/src/components/jurusan/JurusanDetailKonten.jsx`, `frontend/src/data/translations.js`.

Ditambahkan: `frontend/src/components/jurusan/JurusanDetailHero.jsx`, `frontend/src/data/jurusanDetailDesign.js`, `frontend/src/data/translationsJurusanDetail.js`, `frontend/src/styles/jurusan-detail.css`, `frontend/scripts/uji-detail-jurusan.mjs`, 15 file WebP di `frontend/src/assets/jurusan-detail/`, dan laporan ini.

Bukti browser lokal berada di `outputs/detail-jurusan/`: `hasil.json` untuk gate lengkap, `foto-final.json` untuk mapping akhir, `performa.json`, screenshot tujuh ukuran setiap jurusan, ID/EN, screenshot sebelum, ekspor Figma dan perbandingan hero. Crop perbandingan meletakkan Figma di atas, website di bawah. Ekspor frame PG/TKJ/TJA memiliki keterbatasan layer terpisah yang dijelaskan di atas.

Branch tetap `feat/fasilitas-sekolah`. Belum dilakukan commit, push atau deploy. Tidak ada dependency baru.

## Perintah Git manual

Jalankan dari PowerShell jika ingin menyimpan dan mengirim perubahan implementasi beserta laporan:

```powershell
Set-Location 'D:\LombaTelkom\smk-telkom-purwokerto'
git add -- frontend/src/pages/JurusanDetailPage.jsx frontend/src/components/jurusan/JurusanDetailKonten.jsx frontend/src/components/jurusan/JurusanDetailHero.jsx frontend/src/data/jurusanDetailDesign.js frontend/src/data/translationsJurusanDetail.js frontend/src/data/translations.js frontend/src/styles/jurusan-detail.css frontend/src/assets/jurusan-detail frontend/scripts/uji-detail-jurusan.mjs docs/detail-jurusan-figma-2026-10-13.md
git commit -m "feat: align department detail pages with Figma"
git push origin feat/fasilitas-sekolah
```
