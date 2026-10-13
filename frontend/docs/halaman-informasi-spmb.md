# Halaman Informasi SPMB

Pembaruan 13 Oktober 2026: sumber operasional gelombang, timeline, skema, berkas dan syarat sekarang memakai Supabase `spmb_information`, melalui hook/service yang sama dengan admin `/dashboard/informasi-spmb`. Statistik memakai RPC agregat `ppdb` dan kuota nullable. Migration 012 diperlukan sebelum aktivasi hosted. Audit, sumber seed, CRUD, QA terbaru, batas aktivasi dan Git handoff tersedia di [agenda-spmb-admin.md](agenda-spmb-admin.md). Bagian di bawah mendokumentasikan implementasi publik sebelumnya; gunakan handoff terbaru untuk perubahan tugas lanjutan.

Implementasi 13 Oktober 2026. Halaman publik tersedia di `/spmb` dan submenu Informasi → SPMB pada desktop/mobile. Login tetap di `/spmb/masuk`, daftar akun di `/spmb/daftar`. Bookmark `/ppdb` serta callback lama tetap mempertahankan query/hash dan tujuan portal sebelumnya.

## Audit dan referensi

Figma `iNxyyPVdJb2mwgCQW3xOMN`, frame `1054:2118` / Halaman SPMB, berukuran 1847 × 5279. Design context lengkap dan screenshot diperiksa; hero node `1153:844` juga diperiksa terpisah. Kode Figma memakai Plus Jakarta Sans, posisi absolut, primary #cd0b20, dan sejumlah data contoh.

Sebelum implementasi, `/spmb` hanya redirect ke login. Portal dan admin pendaftaran sudah menggunakan Supabase. Pengaturan admin menyatakan jadwal operasional belum tersedia dari server; tidak ditemukan API publik jadwal gelombang ataupun jumlah pendaftar. Tidak dibuat backend, schema, credential, atau sistem pendaftaran kedua. Data pribadi tabel ppdb tidak dibaca oleh halaman publik.

Komponen existing yang digunakan: HeroSection beserta QAC, HeroBreadcrumb, MainLayout, Reveal, RibbonDivider, PartnersSection, StelaAISection, CTASection, Navbar, Footer, dan StelaWidget. HeroSection menerima konten/media/links opsional, dengan default Beranda dipertahankan. PartnersSection menerima enam logo statis khusus SPMB; default marquee halaman lain tetap sama. MainLayout/CTASection menerima tujuan CTA opsional; hanya final CTA SPMB menuju daftar akun. Reveal dapat meneruskan atribut aksesibilitas section. Navbar hanya mendapat prefetch route dan menu dari data, tidak diubah styling/layout-nya.

## Section dan perilaku

1. Hero: Informasi → SPMB, dua badge, heading, tahun mengikuti metadata portal, foto siswa asli Figma dengan mask, daftar akun dan jurusan.
2. QAC: Alur SPMB ke anchor timeline, STELA ke `/stela`, NextTel ke `/nexttel`. Divider dan struktur internal sama dengan Beranda.
3. Marquee: varian chip existing, dua grup identik, horizontal linear/infinite dengan reduced motion.
4. Informasi: status, gelombang/countdown, jumlah pendaftar, dan WhatsApp panitia. Nilai yang tidak tersedia memakai empty state.
5. Timeline: tujuh tahap sesuai susunan Figma, ikon SVG asli, garis penghubung, vertikal pada mobile. Tautan tahapan portal memakai perlindungan login existing. Pilihan jurusan dalam portal sebenarnya diisi bersama biodata; penjelasan ini ditampilkan agar timeline visual tidak menyesatkan.
6. Skema: EASY, DIGITEST, One Day Service. Height/stretch, padding, red cap, dan posisi link sejajar. EASY/DIGITEST membuka sumber resmi; One Day Service menuju panitia dengan keterangan jadwal/ketentuan belum tersedia.
7. Gelombang: tiga baris, tanggal yang tersedia dari sumber, status, dan link sumber. Scroll horizontal dibatasi di wrapper tabel; halaman tidak melebar.
8. Berkas/persyaratan: data dokumen portal digunakan kembali, format unggah terkini satu PDF gabungan maksimal 10 MB. Identitas dan rapor mengacu pada form existing. Persyaratan kesehatan/tes yang belum terverifikasi diminta dikonfirmasi, tidak dijadikan syarat resmi baru.
9. Enam logo mitra, banner STELA, final CTA pendaftaran, dan shared footer.

## Sumber data dan batas integrasi

- EASY: https://smktelkom-pwt.sch.id/berita/spmb-smk-telkom-purwokerto-2027-2028-jalur-easy/ — publikasi 13 Agustus 2026, batas pendaftaran 31 Agustus 2026, Stematel Digital Class, dan kontak panitia. Tanggal publikasi tidak dipakai sebagai tanggal pembukaan. Batas hari disimpan dengan offset WIB; tidak diklaim sebagai jam penutupan resmi. Karena tanggal tersebut sudah lewat, arsip EASY ditandai Ditutup.
- DIGITEST 1 dan kontak: https://smktelkom-pwt.sch.id/pengumuman/spmb-digitest-1-ta-2027-2028-smk-telkom-purwokerto-resmi-dibuka-saatnya-jadi-bagian-dari-nextgens-stematel/ — jalur 2027/2028 dan nomor 0812-2970-1800 / 0812-2970-1900. WhatsApp halaman memakai nomor pertama, bukan nomor Tim FlexBox sebagai panitia.
- Jadwal seleksi, pengumuman, penutupan DIGITEST, dan One Day Service belum memiliki data lengkap terverifikasi.
- `spmbRegistration` sengaja berisi null untuk jadwal aktif, gelombang, dan angka pendaftar. Ini bukan API dan bukan data operasional dari admin. Struktur UI/validasi countdown siap menerima data jadwal terverifikasi, tetapi sumber server belum terintegrasi. Tidak menampilkan angka 150 atau tanggal/countdown contoh Figma sebagai data produksi.
- `spmbWaves` hanya arsip informasi terbatas dari sumber di atas, bukan konfigurasi manajemen gelombang baru. Jika endpoint jadwal publik tersedia, ganti sumber ini dengan fetch endpoint tersebut; jangan membuka SELECT publik untuk tabel ppdb yang berisi data pribadi.
- Perhitungan countdown memerlukan timestamp valid dengan timezone eksplisit, memeriksa kalender/leap day dan urutan tanggal, serta menangani upcoming/open/closed/unknown. Timer hanya berjalan bila tanggal tersedia, tidak melakukan render tick pada tab tersembunyi, dan menyegarkan saat tab kembali terlihat.

## Pemetaan design system dan visual

Font body Inter, heading Poppins; primary/dark, shadow-card/soft, breakpoint 40/64/80 rem, dan ukuran container mengikuti website. Tidak ada font/dependency baru. Hero dan floating memakai styles terpusat existing, bukan tinggi/overlap baru.

Pengukuran browser pada 1440 px:

| Komponen | Beranda | SPMB |
| --- | --- | --- |
| Hero panel | 1216 × 464 px | 1216 × 464 px |
| Tinggi QAC | 86,5 px | 86,5 px |
| Overlap | 40 px | 40 px |

Dekorasi outline timeline/table diekspor dari node asli. Ornamen berwarna disusun dari SVG asli node 1165:4828–4856; rectangle/diamond memakai CSS dengan token website. SVG source/root dimensions tidak diedit. Hero memakai source photo 916 × 496, mask Figma 1248 × 676, dan WebP responsif 640/960/1248. Hero utama WebP sekitar 87 KB; source PNG hanya disimpan untuk provenance, tidak diimpor runtime. Tidak ada URL aset Figma sementara di kode produksi.

Perbedaan yang sengaja dipertahankan: hero/QAC mengikuti standar ukuran website, warna/font dipetakan ke tokens, data resmi yang kosong berbeda dari contoh Figma, petunjuk upload mengikuti portal, dan shared footer berisi informasi/pendukung existing yang lebih lengkap. Pada mobile cards ditumpuk, timeline vertikal, ornamen samping disembunyikan agar tidak mengganggu konten. Tidak mengklaim pixel-perfect.

## Motion

Hero text/badge/CTA fade-up 500 ms dengan stagger ringan, gambar hero tidak dianimasikan. QAC icon lift 2 px/200 ms; Reveal existing 550 ms; timeline line reveal 600 ms dan indikator berurutan 500 ms; skema lift 3 px/300 ms serta transisi border/shadow. Marquee chip existing berjalan linear 80 detik. Animasi tidak mengubah ukuran layout. Semua entrance/hover/line/marquee mengikuti prefers-reduced-motion; line dan isi tetap terlihat saat print.

## QA yang dijalankan

- `uji-spmb-information.mjs`: timezone WIB, countdown, leap day, upcoming/open/closed, invalid/reversed/missing date, arsip EASY lewat, serta tidak ada angka pendaftar fiktif.
- `uji-spmb-information-browser.mjs`: route/reload, daftar/login/legacy, query preservation, anchor Alur, submenu desktop/mobile, enam logo, source/empty states, shared Hero/QAC dimensions, image loading, single shared layout, reduced motion, marquee linear/infinite, dan reveal timeline melalui observer sebenarnya.
- Viewport ID/EN: 1920, 1440, 1024, 768, 375, 320 px; seluruhnya tanpa horizontal overflow halaman. Wrapper tabel tetap dapat digulir pada layar kecil. Screenshot desktop/mobile diperiksa terhadap Figma/screenshot referensi.
- `npm.cmd run bahasa:uji`: bahasa website, portal, dan 81 rendered views lulus.
- `uji-spmb.mjs` dan `uji-spmb-qol.mjs`: route legacy, istilah, tautan portal, form/review, dan jadwal kosong tetap lulus.
- ESLint, production build, `git diff --check` lulus. Proyek JS/JSX tidak menyediakan typecheck.

Bukti: `D:/LombaTelkom/qa-output/spmb-information-2026-10-13/results.json` dan 12 screenshot; build log `D:/LombaTelkom/qa-output/spmb-build.log`. QA memakai Chrome otomatis pada preview lokal. Tidak menguji submit pendaftaran nyata, pengiriman WhatsApp, endpoint jadwal/count yang belum ada, atau perangkat fisik. Tidak ada perubahan database, commit, push, atau deploy.

## File

| File | Fungsi |
| --- | --- |
| src/pages/SpmbPage.jsx, SpmbPage.css | Halaman publik, section, responsif, motion dan dekorasi scoped |
| src/data/spmbInfo.js | Sumber resmi, kontak, arsip gelombang, empty state, skema/timeline |
| src/utils/spmbSchedule.js | Validasi waktu, status dan countdown |
| src/data/translationsSpmbInfo.js, translations.js | Konten dan integrasi ID/EN |
| src/assets/spmb/ | Foto/mask/WebP, SVG ikon, ekspor outline dan vektor ornamen asli |
| src/components/ppdb/SpmbOrnaments.jsx | Penempatan ornamen sesuai frame |
| src/components/HeroSection.jsx | Props opsional; default Beranda tetap sama |
| src/components/PartnersSection.jsx | Props logo/static; default halaman lain tetap sama |
| src/components/Reveal.jsx | Meneruskan atribut section |
| src/layouts/MainLayout.jsx, src/components/CTASection.jsx | Tujuan final CTA opsional |
| src/App.jsx | Route informasi, metadata, public loading state |
| src/data/dummyData.js, src/components/Navbar.jsx | Submenu Informasi → SPMB dan prefetch, tanpa redesign navbar |
| scripts/uji-spmb-information.mjs, uji-spmb-information-browser.mjs | Unit/countdown dan UI/visual/responsive |
| scripts/uji-bahasa.mjs | Ekspektasi menu terbaru |
| docs/halaman-informasi-spmb.md | Audit, keputusan sumber, QA, dan handoff |

## Git handoff

Branch/remote diperiksa: feat/fasilitas-sekolah, origin https://github.com/KiandrAHD/smk-telkom-purwokerto.git. Perintah terbatas pada file tugas ini:

```powershell
Set-Location 'D:/LombaTelkom/smk-telkom-purwokerto'
$spmbFiles = @(
  'frontend/src/pages/SpmbPage.jsx', 'frontend/src/pages/SpmbPage.css',
  'frontend/src/data/spmbInfo.js', 'frontend/src/utils/spmbSchedule.js',
  'frontend/src/data/translationsSpmbInfo.js', 'frontend/src/data/translations.js',
  'frontend/src/assets/spmb', 'frontend/src/components/ppdb/SpmbOrnaments.jsx',
  'frontend/src/components/HeroSection.jsx', 'frontend/src/components/PartnersSection.jsx',
  'frontend/src/components/Reveal.jsx', 'frontend/src/layouts/MainLayout.jsx',
  'frontend/src/components/CTASection.jsx', 'frontend/src/components/Navbar.jsx',
  'frontend/src/App.jsx', 'frontend/src/data/dummyData.js',
  'frontend/scripts/uji-spmb-information.mjs', 'frontend/scripts/uji-spmb-information-browser.mjs',
  'frontend/scripts/uji-bahasa.mjs', 'frontend/docs/halaman-informasi-spmb.md'
)
git add -- $spmbFiles
git diff --cached --check
git commit -m "feat: implement public SPMB information page"
git push origin feat/fasilitas-sekolah
```
