# Koreksi halaman Fasilitas — 12 Oktober 2026

Implementasi sebelumnya menggunakan delapan fasilitas umum dari data carousel Beranda. Referensi halaman lengkap memakai tujuh kategori, ruang per gedung, dan foto ilustrasi siswa belajar bersama. Akibatnya, menyamakan typography saja belum memperbaiki struktur dan foto halaman.

## Acuan yang diperiksa

- ZIP pengguna: `telkom-remake (4).zip`, tujuh PNG halaman fasilitas.
- Figma live berhasil dibaca melalui metadata, design context, dan screenshot: [Kelas](https://www.figma.com/design/ca2iX76GpJSr0QC7Qyv9RV/Telkom-remake?node-id=174-151). Frame lain: 174:534, 174:1001, 174:1296, 174:1568, 174:1805, 174:2042.
- Foto contoh cocok dengan aset existing `belajar-kelompok-laptop.png`; crop thumbnail diperbaiki melalui CSS lokal halaman.
- Label hasil salinan dan deskripsi contoh dipertahankan sesuai jawaban eksplisit pengguna. Untuk Parkiran, label mengikuti PNG ZIP yang diberikan; metadata Figma live berisi label olahraga yang berbeda. Data ini belum merupakan inventaris ruangan terverifikasi.

## Hasil implementasi

| Kategori | Susunan |
| --- | --- |
| Semua | Laboratorium, Ruang Kelas, Perpustakaan, Aula; masing-masing 4 card sesuai frame overview |
| Laboratorium | 6 card: Robotik, TKJ, TJA, RPL, RPS Utara, RPS Selatan |
| Kelas | Gedung A–D, masing-masing 4 ruang; total 16 card |
| Perpustakaan | Ruang Perpustakaan dan Digital Literasi Garden; masing-masing 4 card |
| Aula | 4 card sesuai contoh |
| GOR | 4 card sesuai contoh |
| Parkiran | 4 card sesuai contoh ZIP |

Hero memakai foto yang memenuhi tepi kanan bingkai, judul card merah, judul kelompok merah/hitam, tujuh chip filter, dan motif sisi sesuai kategori. Font Poppins/Inter, container max-w-7xl, warna primary, radius, shadow, tombol, dan grid 4/2/1 memakai design system existing. Global CSS, navbar, footer, data/carousel Beranda, dan shared banner tidak diubah. STELA → CTA SPMB → Footer tetap muncul satu kali.

## File yang diubah

- `frontend/src/pages/FasilitasPage.jsx`: hero, filter, kelompok/card, foto ilustrasi, detail modal.
- `frontend/src/data/fasilitasPageData.js`: data khusus halaman lengkap; terpisah dari carousel.
- `frontend/src/data/translationsFasilitas.js`: terjemahan label dan deskripsi baru.
- `frontend/src/data/translations.js`: menggabungkan kamus fasilitas.
- `frontend/scripts/uji-fasilitas-reference.mjs`: struktur tujuh tampilan ID/EN.
- `frontend/scripts/uji-fasilitas-design.mjs`: jumlah card baru, modal semua tampilan, visual tokens, fallback dan screenshot.
- `frontend/scripts/uji-footer-fasilitas.mjs`: regression carousel/footer dan cakupan terjemahan data halaman.
- `frontend/scripts/uji-halaman-fasilitas.mjs`: filter baru, navigasi, responsive, carousel Beranda.
- `docs/qa-fasilitas-reference.md`: laporan ini.

## Pengujian yang benar-benar dijalankan

| Pengujian | Hasil |
| --- | --- |
| `npm.cmd run lint` | Lulus, exit 0 |
| `npm.cmd run build` | Lulus, exit 0 |
| `npm.cmd run bahasa:uji` | Lulus; 81 view English pada suite konten existing |
| `node scripts/uji-fasilitas-reference.mjs` | 14 kombinasi kategori/bahasa lulus; jumlah kelompok/card/filter dan urutan shared sections |
| `node scripts/uji-footer-fasilitas.mjs` | Lulus ID/EN; footer Beranda/Prestasi identik, kamus lengkap, carousel terpisah |
| `node scripts/uji-fasilitas-design.mjs` | 16 skenario lulus, 0 gagal; semua kategori diuji pada 1920/1440/768/390/375 px dalam ID/EN |
| `node scripts/uji-halaman-fasilitas.mjs` | Lulus; navigasi SPA, refresh/filter, 16 modal overview, 12 viewport/bahasa, menu desktop/mobile, carousel loop/autoplay |
| QA tambahan | Query kategori tidak dikenal kembali ke Semua; browser Back/Forward Beranda ↔ Fasilitas/Kelas lulus |
| Visual consistency | Screenshot desktop, kategori Kelas, dan viewport mobile diperiksa; foto, kelompok, warna, grid sesuai acuan dengan token website |
| `git diff --check` | Lulus |

Browser QA menggunakan production preview `http://127.0.0.1:4173`. Detail modal diperiksa untuk 58 card tampilan pada masing-masing bahasa, termasuk Escape, pengembalian fokus dan pemulihan scroll. Kegagalan foto disimulasikan; placeholder ID/EN dan modal lulus. Hover reduced-motion, link Lihat Fasilitas dan Masuk SPMB juga lulus. Tidak ditemukan overflow atau exception JavaScript pada skenario tersebut. Sebagian request konten publik dalam suite visual dimock untuk mengisolasi halaman; ini bukan verifikasi API production. Tidak ada deployment/commit/push dilakukan.

Artefak lokal: `D:/LombaTelkom/qa-output/fasilitas-reference-2026-10-12/` berisi PNG referensi, `browser/results.json`, screenshot ID/EN, screenshot kategori, `navigation/`, `kelas-final.png`, `mobile-top-id.png`, dan log build.

## Git handoff

Branch diperiksa: `feat/fasilitas-sekolah`. Remote origin: `https://github.com/KiandrAHD/smk-telkom-purwokerto.git`.

Jalankan dari `D:/LombaTelkom/smk-telkom-purwokerto` jika ingin menyimpan dan mengirim perubahan:

```powershell
git add frontend/src/pages/FasilitasPage.jsx frontend/src/data/fasilitasPageData.js frontend/src/data/translationsFasilitas.js frontend/src/data/translations.js frontend/scripts/uji-fasilitas-reference.mjs frontend/scripts/uji-fasilitas-design.mjs frontend/scripts/uji-footer-fasilitas.mjs frontend/scripts/uji-halaman-fasilitas.mjs docs/qa-fasilitas-reference.md
git commit -m "fix: match facilities page to Figma reference"
git push origin feat/fasilitas-sekolah
```
