# Pembaruan Prestasi dan perbaikan batas JavaScript CI

Implementasi serta pemeriksaan lokal selesai pada 14 Oktober 2026. Tidak ada commit, push, atau perubahan batas CI dalam task ini.

## Halaman Prestasi

Referensi: [HALAMAN PRESTASI, node 236:17638](https://www.figma.com/design/ca2iX76GpJSr0QC7Qyv9RV/Figma-MCP?node-id=236-17638), pada canvas `Telkom remake again`.

Hero sebelumnya menggunakan foto pameran IoT dalam wrapper terpisah dengan padding dan radius gambar. Hero sekarang menggunakan komposit terbaru dari group Figma `236:17639`: kolase peraih prestasi, watermark PRESTASI, bangunan sekolah, dan gelombang merah. Semua elemen tersebut sudah berada dalam satu aset; dekorasinya tidak digandakan.

Layer gambar mengikuti tepi Hero, memakai mask asli `236:17642`, focal point kanan-tengah, dan lebar visual desktop 65,2% berdasarkan proporsi frame. Container, tinggi standar 464/544 px pada breakpoint desktop, border-radius 32 px, serta floating statistics tetap mengikuti website. Mobile menempatkan gambar sesudah teks dan memakai rasio sumber 1106:656.

Pengguna mengonfirmasi bahwa “kotak-kotak” yang dimaksud adalah empat kotak merah pada Floating Statistics Cards. Keempatnya tetap tampil sesuai group `236:18222`, dengan ikon dan ukuran dari shared `HeroStatsBar`. Implementasi sudah sesuai konfirmasi ini; tidak diperlukan dekorasi kotak tambahan.

Judul, deskripsi, CTA Prestasi, serta nilai statistik yang sudah tersedia dipertahankan. Tulisan “Berita & Kegiatan Terbaru”/“Jelajahi Berita” pada contoh Figma tidak disalin ke halaman Prestasi.

## Prestasi Unggulan

Penyebab foto tidak tampil adalah komponen sebelumnya hanya merender teks, walaupun sumber data sudah menyediakan `gambar_url`.

Foto sekarang dirender melalui shared `ContentImage` dari entri yang sama dengan judul, tingkat, deskripsi, dan slug. Daftar tetap mengikuti urutan layanan Prestasi terbaru. Komposisi menjadi satu prestasi utama dan tiga pilihan samping, sesuai referensi. Memilih kartu samping memperbarui foto, judul, deskripsi, dan link secara bersamaan.

Foto memakai lazy loading, async decoding, frame rasio 535:393, dan `object-contain` agar dokumentasi atau teks dalam poster tidak terpotong. Fallback jujur dipakai saat foto tidak tersedia. Tidak ada data prestasi, foto pengganti acak, atau penulisan ke database.

Empat entri aktual yang diverifikasi saat pemeriksaan:

| Prestasi | Tanggal data | Foto yang dipakai |
|---|---|---|
| Atlet Pencak Silat STEMATEL — DPRD Championship 2026 | 14 Oktober 2026 | `410bc146-6401-4aea-9cb7-fa6b93652983.webp` |
| Siswa SMK Telkom Purwokerto Raih Juara MotoSport | 30 September 2026 | `cf72c28e-6f86-4c53-a2ba-81dfef1664db.webp` |
| Siswa terpilih menjadi pemain Persibas Junior u17 dan Popda Banyumas | 25 September 2026 | `ef3bf095-f7dd-4e56-916e-f818e2d7dcf7.webp` |
| GLOBAL GAME JAM AI siswa SMK Telkom Purwokerto | 14 September 2026 | `2270a6f2-45bb-4830-9e36-b566a101d7e8.webp` |

Nama lengkap, slug, dan URL sumber dicatat di [verified-records.json](../../outputs/prestasi-ci-2026-10-14/browser/verified-records.json). Foto LKS Nasional 2025 dalam contoh Figma tidak dipasangkan ke entri prestasi lain; entri tersebut tidak terdapat pada daftar layanan Prestasi yang diaudit.

## Penyebab kegagalan GitHub Actions

[Job GitHub Actions yang ditunjukkan pengguna](https://github.com/KiandrAHD/smk-telkom-purwokerto/actions/runs/38446412815/job/115465859552) diperiksa melalui log job. Checkout, build, dan security berjalan; `npm run performa:uji` kemudian gagal karena entry JavaScript sekitar 455 KB melebihi batas 450 KiB. Ini kegagalan pemeriksaan CI setelah push diterima, bukan kegagalan Git push.

Kegagalan direproduksi lokal pada source yang sudah mencakup pembaruan banner sebelumnya: entry berukuran 468.439 byte, dibulatkan oleh tes menjadi 457 KB. Perbedaan terhadap angka screenshot berasal dari snapshot source yang berbeda.

Analisis source map menunjukkan kontribusi besar dari data bersama dan kamus terjemahan, serta sekitar 19 KB dari empat logo PNG kecil yang tertanam sebagai Base64: AWS, Microsoft, Cisco, dan Astra. Bundle telah memakai tree shaking dan pemisahan route, menghasilkan 149 chunk JavaScript. Besar file sumber `react-icons/fa` pada source map tidak berarti seluruh library tersebut ikut dikirim; atribusi dipastikan dari posisi kode hasil build.

Perubahan minimum yang memperbaiki penyebabnya adalah memperluas aturan `assetsInlineLimit` agar PNG/JPEG, seperti WebP/AVIF dan font yang sebelumnya sudah dipisahkan, menjadi aset eksternal yang dapat di-cache. SVG kecil tetap mengikuti perilaku sebelumnya. Foto/logo tidak lagi menambah string Base64 pada JavaScript awal. Tidak ada dependency baru atau refactor kamus/route yang berisiko mengubah perilaku bahasa dan navigasi.

| Ukuran entry JavaScript | Sebelum lokal | Sesudah lokal |
|---|---:|---:|
| Byte | 468.439 | 449.679 |
| KiB | 457,46 | 439,14 |
| Hasil `performa:uji` | Gagal | Lulus |

Pengurangan bersih: 18.760 byte, sekitar 18,32 KiB/4%. Batas tetap `450 × 1024 = 460.800` byte. `uji-performa.mjs`, batas `uji-bundle.mjs`, dan workflow `.github/workflows/frontend-ci.yml` tidak diubah atau dinonaktifkan.

Angka tersebut mengukur entry JavaScript, sesuai pemeriksaan CI; bukan total seluruh vendor/chunk jaringan dan bukan skor LCP/Lighthouse.

## Optimasi gambar

PNG komposit Figma berukuran 1.244.288 byte dan 1106 × 656 px. Varian WebP tanpa upscaling:

| Varian Hero | Ukuran |
|---|---:|
| 640 px | 45.384 byte |
| 960 px | 76.952 byte |
| 1106 px | 91.972 byte |

Varian terbesar sekitar 92,6% lebih kecil daripada PNG sumber. `srcSet`/`sizes`, dimensi eksplisit, fetch priority tinggi, dan decoding async digunakan pada Hero. Foto unggulan yang tersedia di storage proyek sudah WebP: 56.318, 44.732, 163.616, dan 97.448 byte; semuanya di bawah 350 KiB. Hanya foto prestasi aktif yang dirender, sementara tiga pilihan samping tetap berupa teks.

Mask SVG asli mempertahankan root 1140 × 676. Tidak ada URL aset Figma sementara dalam source. PNG sumber disimpan sebagai bukti di `outputs/` dan tidak dimasukkan ke runtime atau perintah staging source.

## Design system dan hasil visual

Heading mengikuti Poppins, isi mengikuti Inter, dan utility/token warna `primary`, `dark`, shadow, spacing, radius, breakpoint `md`/`lg`, serta hover lift yang sudah tersedia tetap digunakan. Tidak ada font baru, navbar/footer baru, atau perubahan global typography.

Komposisi Hero dibandingkan dengan screenshot/context Figma. Foto unggulan mengikuti data sekolah terbaru, sehingga isi dan gambar berbeda dari contoh LKS di Figma. Perbedaan tersebut menjaga ketepatan data; hasil tidak diklaim pixel-perfect.

- [Hero sebelum](../../outputs/prestasi-ci-2026-10-14/hero-before.png) dan [sesudah pada 1847 px](../../outputs/prestasi-ci-2026-10-14/hero-regression/prestasi-1847.png).
- [Foto unggulan desktop](../../outputs/prestasi-ci-2026-10-14/browser/featured-1440-id.png) dan [mobile](../../outputs/prestasi-ci-2026-10-14/browser/featured-390-id.png).
- [Hasil pemeriksaan foto](../../outputs/prestasi-ci-2026-10-14/photo-measurements.json), [QA Prestasi](../../outputs/prestasi-ci-2026-10-14/browser/results.json), dan [QA seluruh Hero](../../outputs/prestasi-ci-2026-10-14/hero-regression/results.json).

Pada ekspor screenshot section unggulan desktop/mobile, navbar fixed disembunyikan hanya selama pengambilan gambar agar tidak menutupi potongan section. Navbar pada aplikasi tidak diubah.

## Hasil pengujian

| Perintah/pemeriksaan | Hasil |
|---|---|
| `npm.cmd run lint` | Lulus; script QA baru dan test foto juga diperiksa ESLint |
| `npm.cmd run build` | Lulus; build akhir 8,09 detik |
| `node scripts/uji-kredensial.mjs --build` | Lulus |
| `npm.cmd run security:uji` | Lulus |
| `npm.cmd run performa:uji` | Lulus: entry 439 KB dan pemeriksaan aset/lossless tetap berlaku |
| `node scripts/uji-bundle.mjs` | Lulus: 449.679 byte, 149 chunk |
| `npm.cmd run ppdb:uji` | Lulus |
| `node scripts/uji-spmb.mjs` | Lulus |
| `node scripts/uji-content-image.mjs` | Lulus: pasangan foto/judul, source/fallback, empat pilihan, dan data kosong |
| Pengujian bahasa utama/portal/konten | Lulus; termasuk 81 rendered views pada pengujian konten |
| `uji-prestasi-update-browser.mjs` | Lulus 12 kombinasi viewport/bahasa, empat pasangan foto aktual, pergantian pilihan, link, lazy loading, layout, empat kotak statistik, empty/fallback |
| `uji-hero-full-bleed.mjs` | Lulus 192 kombinasi viewport/bahasa: image coverage, dimensi, CTA, floating cards, aset, dan runtime |
| `git diff --check` | Lulus; hanya pemberitahuan LF/CRLF |

Viewport Hero yang diperiksa: 1920, 1847, 1440, 1280, 1024, 768, 390, dan 320 px dalam ID/EN. QA foto unggulan memeriksa 1847, 1440, 1024, 768, 390, dan 320 px dalam ID/EN, tanpa horizontal overflow. Data foto diambil dari layanan publik saat persiapan, lalu dipakai sebagai fixture deterministik selama QA browser. Tidak ada error runtime pada kedua QA browser.

Log: [hasil job check lokal](../../outputs/prestasi-ci-2026-10-14/ci-checks.json), [lint](../../outputs/prestasi-ci-2026-10-14/lint.log), [build](../../outputs/prestasi-ci-2026-10-14/build.log), [performa sebelum](../../outputs/prestasi-ci-2026-10-14/performa-before.log), dan [performa sesudah](../../outputs/prestasi-ci-2026-10-14/performa.log).

## Batas validasi dan masalah baseline

Tes tambahan `uji-prestasi-remake.mjs`, yang bukan langkah workflow CI, gagal pada assertion `Keep the official profile source accessible`. Hall of Fame memang belum merender tautan `sourceUrl` untuk tiga alumni. Reproduksi menggunakan komponen dan data dari HEAD (`4b04272`) menunjukkan masalah sudah ada sebelum task ini; [bukti baseline](../../outputs/prestasi-ci-2026-10-14/hall-baseline.log). Komponen Hall of Fame dan test tersebut tidak diubah.

Job Deno `edge-types`, database-security dengan Postgres 16, dan CodeQL tidak dijalankan lokal karena runtime tersebut tidak tersedia. Pengujian job frontend dilakukan dengan Node 24.16 pada Windows; workflow GitHub memakai Node 22 di Linux. Log security menampilkan peringatan port HMR dari server test bersamaan, tetapi seluruh assertion dan exit status lulus.

Workflow GitHub baru belum dijalankan karena task ini tidak melakukan commit/push. Tidak dilakukan pengukuran LCP/CLS/Lighthouse atau pengujian perangkat fisik.

## File yang diubah/ditambahkan

Path relatif terhadap `frontend/`:

| File | Perubahan |
|---|---|
| `vite.config.js` | Mengeluarkan bitmap kecil dari inline JavaScript |
| `src/components/prestasi/PrestasiHeroSection.jsx` | Komposisi full-bleed dan responsive Hero image |
| `src/components/prestasi/PrestasiUnggulanSection.jsx` | Foto terpasang pada entri yang benar; satu utama/tiga pilihan |
| `src/data/dummyData.js` | Aset dan alt text Hero terbaru |
| `src/data/translationsPublic.js` | Alt text Hero dalam bahasa Inggris |
| `src/styles/hero.css` | Rasio, proporsi dan mask khusus Hero Prestasi |
| `src/assets/banners/prestasi-640.webp` | Baru: gambar responsive |
| `src/assets/banners/prestasi-960.webp` | Baru: gambar responsive |
| `src/assets/banners/prestasi-1106.webp` | Baru: gambar ukuran sumber |
| `src/assets/banners/prestasi-mask.svg` | Baru: mask asli Figma |
| `scripts/uji-content-image.mjs` | Validasi gambar unggulan, fallback dan jumlah pilihan |
| `scripts/uji-hero-full-bleed.mjs` | Memeriksa coverage Prestasi sebagai komposisi full-bleed |
| `scripts/uji-prestasi-update-browser.mjs` | Baru: QA Prestasi dengan data/foto aktual |
| `docs/prestasi-ci-2026-10-14.md` | Laporan ini |

## Git handoff manual

Branch terverifikasi: `feat/fasilitas-sekolah`. Origin: `https://github.com/KiandrAHD/smk-telkom-purwokerto.git`. Jalankan setelah meninjau diff:

```powershell
Set-Location 'D:\LombaTelkom\smk-telkom-purwokerto'
git add -- frontend/vite.config.js frontend/src/components/prestasi/PrestasiHeroSection.jsx frontend/src/components/prestasi/PrestasiUnggulanSection.jsx frontend/src/data/dummyData.js frontend/src/data/translationsPublic.js frontend/src/styles/hero.css frontend/src/assets/banners/prestasi-640.webp frontend/src/assets/banners/prestasi-960.webp frontend/src/assets/banners/prestasi-1106.webp frontend/src/assets/banners/prestasi-mask.svg frontend/scripts/uji-content-image.mjs frontend/scripts/uji-hero-full-bleed.mjs frontend/scripts/uji-prestasi-update-browser.mjs frontend/docs/prestasi-ci-2026-10-14.md
git diff --cached --stat
git commit -m "Update achievement visuals and reduce initial JavaScript below CI budget"
git push origin feat/fasilitas-sekolah
```
