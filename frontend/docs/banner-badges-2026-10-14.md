# Banner BKK/Berita dan konsistensi hashtag Hero

## Perubahan

Frame target kini tersedia pada file Figma yang diberikan: [HALAMAN BKK, 231:16259](https://www.figma.com/design/ca2iX76GpJSr0QC7Qyv9RV/Figma-MCP?node-id=231-16259) dan [HALAMAN BERITA, 231:16851](https://www.figma.com/design/ca2iX76GpJSr0QC7Qyv9RV/Figma-MCP?node-id=231-16851). Keduanya berada pada canvas `Telkom remake again`, node `221:2084`.

BKK menggunakan komposit foto siswa dengan beragam profesi, watermark BKK, dan gelombang merah dari group `231:16260`. Judul menjadi “Langkah Awal Menuju Karier Impian” dengan dua baris sesuai referensi. Deskripsi BKK yang menjelaskan lowongan, PKL, dan mitra industri dipertahankan karena relevan terhadap fungsi halaman.

Berita menggunakan komposit empat siswa, watermark BERITA, dan gelombang merah dari group `231:16852`. Judul desktop menjadi “Berita &” lalu “Kegiatan Terbaru”, dengan warna merah pada “Terbaru”. CTA tetap menuju kategori berita dan memiliki tinggi minimum 44 px.

Gambar diposisikan melalui pola full-bleed proyek, dengan wrapper visual 66% pada desktop, focal point kanan-tengah, mask asli Figma, dan gradient teks yang sudah tersedia. Rasio sumber 1106:656 dipertahankan pada layout tablet/mobile. Mobile menempatkan gambar sesudah teks; tidak memaksakan komposisi desktop atau mengubah Hero menjadi 100vh.

Container, border-radius, ukuran Hero desktop, typography, dan kartu statistik BKK mengikuti standar website. Data berita, lowongan, statistik BKK, navbar, footer, School Tour, galeri kelas, dan carousel guru tidak diubah.

Statistik pekerjaan pada contoh frame Berita belum ditambahkan: data statistik khusus Berita belum tersedia pada implementasi. Bilah statistik BKK yang sudah valid tetap dipertahankan.

## Audit hashtag

Ejaan yang digunakan adalah `#DigitalSmartSchool` dan `#GlobalTechnopreneur`, mengikuti screenshot dan identitas yang sudah digunakan website. Variasi salah eja pada beberapa layer Figma tidak disalin.

| Halaman | Sebelum | Sesudah |
|---|---|---|
| Beranda | Dua hashtag tersedia | Komponen bersama, pasangan tetap |
| Profil Sekolah | Belum tersedia | Dua hashtag |
| Profil Guru | Belum tersedia | Dua hashtag |
| Ekstrakurikuler | Eyebrow kategori | Dua hashtag |
| Fasilitas Sekolah | Hanya DigitalSmartSchool | Dua hashtag |
| Jurusan | Badge kategori | Dua hashtag |
| Prestasi | Badge kategori | Dua hashtag |
| BKK | Badge kategori | Dua hashtag |
| Berita | Badge kategori | Dua hashtag |
| Pengumuman | Badge kategori | Dua hashtag |
| Kalender | Dua hashtag tersedia | Komponen bersama, pasangan tetap |
| SPMB | Dua hashtag tersedia | Menggunakan shared Hero, pasangan tetap |
| Detail RPL/PG/TKJ/TJAT | Dua hashtag tersedia | Komponen bersama, pasangan tetap |

Ada sembilan Hero utama dengan pasangan hashtag yang ditambahkan/dilengkapi. Total 12 halaman utama dan empat detail jurusan menggunakan `HeroBadges`, dengan pill putih, border merah transparan, radius penuh, ukuran font 10 px, dan wrapping otomatis. Hashtag tidak diterjemahkan saat bahasa website berubah.

Badge kategori lama diganti pada Hero yang belum menggunakan identitas sekolah; judul, breadcrumb, dan data kategorinya tetap tersedia pada halaman. Tidak ada badge branding tambahan pada artikel detail, portal pendaftaran, dashboard, atau halaman aplikasi yang tidak memakai pola Hero sekolah ini.

## Aset dan optimasi

Gambar asli dari Figma berukuran 1106 × 656. Tiga varian WebP dibuat tanpa upscaling:

| Banner | PNG sumber | WebP 640 px | WebP 960 px | WebP 1106 px |
|---|---:|---:|---:|---:|
| BKK | 1.213.254 byte | 35.894 byte | 60.848 byte | 73.402 byte |
| Berita | 1.199.744 byte | 38.740 byte | 65.182 byte | 77.566 byte |

Varian terbesar berkurang sekitar 94% dibanding PNG sumber. `srcSet`/`sizes` memilih resolusi sesuai area visual; dimensi eksplisit, decoding async, dan fetch priority tinggi dipakai karena kedua gambar berada di Hero. Ini merupakan pengurangan ukuran aset, bukan pengukuran perubahan LCP/Lighthouse.

Mask SVG asli tetap memiliki root 1157 × 686 untuk BKK dan 1155 × 685 untuk Berita. Ukuran root file tidak diubah; mask mengikuti wrapper. Foto, watermark, dan gelombang sudah merupakan satu komposit sehingga tidak digandakan dengan dekorasi buatan.

## File source yang diubah

Path relatif terhadap `frontend/`:

- Baru: `src/components/HeroBadges.jsx`.
- Callsite shared: `src/components/HeroSection.jsx`, `src/components/tentang/TentangHeroSection.jsx`, `src/components/jurusan/JurusanHeroSection.jsx`, `src/components/jurusan/JurusanDetailHero.jsx`, `src/components/prestasi/PrestasiHeroSection.jsx`, `src/components/pengumuman/PengumumanHeroSection.jsx`.
- Banner: `src/components/bkk/BkkHeroSection.jsx`, `src/components/berita/BeritaHeroSection.jsx`, `src/styles/hero.css`.
- Halaman: `src/pages/GuruPage.jsx`, `src/pages/EkstrakurikulerPage.jsx`, `src/pages/FasilitasPage.jsx`, `src/pages/KalenderPage.jsx`.
- Data/terjemahan: `src/data/dummyData.js`, `src/data/translationsPublic.js`.
- Baru: enam gambar WebP dan dua mask SVG di `src/assets/banners/`.
- QA: `scripts/uji-hero-full-bleed.mjs`, dengan pemeriksaan pasangan hashtag, full-bleed Berita, dan empat route detail jurusan existing.
- Laporan: dokumen ini dan catatan lanjutan pada laporan sebelumnya.

## Hasil validasi

| Pemeriksaan | Hasil aktual |
|---|---|
| `npm.cmd run lint` | Lulus, exit 0; script QA juga diperiksa kembali setelah koreksi nama route test |
| `npm.cmd run build` | Lulus, exit 0; build akhir 2,91 detik |
| `git diff --check` | Lulus; hanya pemberitahuan LF/CRLF |
| `uji-hero-full-bleed.mjs` | Lulus 192 kombinasi viewport/bahasa untuk 12 halaman utama |
| Empat detail jurusan | Badge diperiksa pada route existing `/jurusan/rpl`, `/jurusan/pg`, `/jurusan/tkj`, `/jurusan/tjat`; lulus |
| Resolusi | 1920, 1847, 1440, 1280, 1024, 768, 390, dan 320 px, dalam ID/EN |
| Geometri Hero | Container, tinggi desktop, radius 32 px, dan jarak navbar tetap sesuai standar |
| Image coverage | BKK/Berita memenuhi tepi kanan/atas/bawah layer Hero desktop; layout mobile tidak bertabrakan dengan teks |
| Badge dan CTA | Pasangan tepat, tanpa duplikasi, tidak terpotong dan tanpa horizontal overflow |
| Floating cards | Posisi tengah dan overlap 40 px tetap benar pada halaman yang memilikinya |
| Aset/runtime | Gambar Hero termuat; 0 error runtime dalam pengujian |

Screenshot desktop dan mobile ditinjau langsung, termasuk komposisi subjek dan pemenggalan judul Berita. Asset mask lokal diperiksa dimensi root-nya dan dipakai pada banner yang sesuai. Pengujian menggunakan Chrome lokal serta mock respons kosong untuk layanan konten; koneksi/database produksi tidak diuji. Typecheck terpisah tidak tersedia dalam proyek JSX ini. Tidak dilakukan pengukuran LCP/CLS/Lighthouse baru.

## Bukti visual

- [BKK sebelum](../../outputs/banner-badges-2026-10-14/bkk-before.png) dan [BKK sesudah](../../outputs/banner-badges-2026-10-14/qa/bkk-1847.png).
- [Berita sebelum](../../outputs/banner-badges-2026-10-14/berita-before.png) dan [Berita sesudah](../../outputs/banner-badges-2026-10-14/qa/berita-1847.png).
- [BKK mobile](../../outputs/banner-badges-2026-10-14/qa/bkk-390.png) dan [Berita mobile](../../outputs/banner-badges-2026-10-14/qa/berita-390.png).
- [Hasil geometri seluruh Hero](../../outputs/banner-badges-2026-10-14/qa/results.json).
- [Log lint](../../outputs/banner-badges-2026-10-14/lint.log), [build](../../outputs/banner-badges-2026-10-14/build.log), dan [QA](../../outputs/banner-badges-2026-10-14/qa.log).

Komposisi visual dibandingkan dengan screenshot/context Figma. Font website, container standar, deskripsi BKK yang relevan, dan breadcrumb Berita dipertahankan. Hasil tidak diklaim pixel-perfect terhadap frame Figma yang menggunakan typography dan lebar halaman berbeda.

## Git handoff

Branch: `feat/fasilitas-sekolah`. Origin: `https://github.com/KiandrAHD/smk-telkom-purwokerto.git`. Perubahan belum di-commit atau di-push otomatis. Screenshot dan PNG sumber berada di `outputs/` dan tidak disertakan dalam staging source berikut.

```powershell
Set-Location 'D:\LombaTelkom\smk-telkom-purwokerto'
git add -- frontend/src/components/HeroBadges.jsx frontend/src/components/HeroSection.jsx frontend/src/components/tentang/TentangHeroSection.jsx frontend/src/components/jurusan/JurusanHeroSection.jsx frontend/src/components/jurusan/JurusanDetailHero.jsx frontend/src/components/prestasi/PrestasiHeroSection.jsx frontend/src/components/pengumuman/PengumumanHeroSection.jsx frontend/src/components/bkk/BkkHeroSection.jsx frontend/src/components/berita/BeritaHeroSection.jsx frontend/src/pages/GuruPage.jsx frontend/src/pages/EkstrakurikulerPage.jsx frontend/src/pages/FasilitasPage.jsx frontend/src/pages/KalenderPage.jsx frontend/src/styles/hero.css frontend/src/data/dummyData.js frontend/src/data/translationsPublic.js frontend/src/assets/banners frontend/scripts/uji-hero-full-bleed.mjs frontend/docs/banner-badges-2026-10-14.md frontend/docs/fasilitas-profil-banner-refinement-2026-10-14.md
git diff --cached --stat
git commit -m "Update Figma banners and standardize school hero badges"
git push origin feat/fasilitas-sekolah
```
