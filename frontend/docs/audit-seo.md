# Audit SEO — 14 Oktober 2026

## 1. Confirmed issues dari screenshot

- Canonical dan JSON-LD belum tersedia.
- OG image dan Twitter Card belum tersedia; og:url menunjuk ke smktelkom-pwt.sch.id, sedangkan deployment project dan adminProfilSekolah menunjuk ke smk-telkom-purwokerto.vercel.app.
- Carousel memakai H1 untuk setiap slide, termasuk slide yang tidak aktif.
- HTML awal deployment hanya berisi div root kosong. Profil, program keahlian, fasilitas, dan berita baru muncul setelah JavaScript berjalan. Bukti HTML sebelum perubahan: D:/LombaTelkom/outputs/seo-live-before.html.
- Metadata detail belum menyinkronkan seluruh OG/canonical/description. Login dan portal belum memiliki kebijakan noindex terpusat.
- robots.txt dan sitemap.xml belum tersedia. Ketiadaan robots.txt sendiri bukan bukti bahwa indexing diblokir.

## 2. False positives / sudah benar / tidak relevan

| Klaim tool | Hasil pemeriksaan |
| --- | --- |
| Homepage hanya tiga kata | Salah untuk website yang sudah menjalankan JavaScript. Source berisi profil, empat jurusan, fasilitas, mitra, prestasi, dan kontak. Masalah sebenarnya adalah HTML awal kosong. |
| Tidak ada H1 | Salah untuk DOM React. H1 ada, tetapi carousel justru membuat lebih dari satu H1. |
| Tidak ada artikel | Berita dan halaman detail sudah tersedia. API publik saat audit mengembalikan 13 berita, 11 pengumuman, dan 21 prestasi. |
| Title/description/OG tidak ada | Title, description, og:title, og:description, og:type, dan og:url dasar sudah ada. Kekurangannya adalah image, canonical, dan sinkronisasi antarhalaman. |
| Struktur hanya div | header, nav, main, section, article, footer, dan breadcrumb sudah dipakai di komponen utama. Tidak diperlukan penggantian semua div. |
| Customer story, founder voice, case study wajib | Tidak sesuai kebutuhan website sekolah. Tidak dibuat konten palsu untuk memenuhi skor. |
| Tampilan seperti template lama | Penilaian subjektif. Design system, aset, ukuran teks, dan tata letak tetap dipertahankan. |

Gambar hero dan kartu jurusan sudah memiliki alt, dimensi atau aspect ratio, WebP, serta srcSet/sizes pada aset yang sesuai. Aset dekoratif tetap memakai alt kosong. Pengujian HTML memeriksa keberadaan alt pada semua img; tidak mengklaim hasil pengukuran CLS/Lighthouse.

## 3. Perubahan

- Build Vite menghasilkan HTML awal dari komponen React yang sudah ada, tanpa mengganti framework atau menambah dependency.
- 146 rute publik dirender pada build terakhir: 101 halaman dari rute/data lokal, ditambah 45 detail dari API publik.
- Homepage dan daftar berita/pengumuman/prestasi menggunakan snapshot data publik saat build. Snapshot tidak menggunakan daftar berita/prestasi dummy.
- Jika pembacaan API publik gagal pada build berikutnya, script memberi peringatan dan tidak membuat detail/sitemap dari data yang gagal dibaca. Website tetap menggunakan fetch client seperti sebelumnya.
- CSS halaman ikut disertakan; konten Reveal dapat dibaca saat JavaScript dimatikan.

## 4. Metadata

Satu title, description, canonical, robots, og:title, og:description, og:image, og:url, dan Twitter Card per halaman publik. Metadata browser diperbarui lewat sistem DOM/effect yang sudah digunakan project, dengan upsert agar tidak duplikatif. Metadata halaman detail berasal dari judul dan konten item yang nyata.

URL dasar: https://smk-telkom-purwokerto.vercel.app. Variabel VITE_SITE_URL dapat dipakai saat migrasi domain; canonical, sitemap, OG, dan schema menggunakan nilai yang sama. Query tracking dan trailing slash tidak ikut canonical.

OG image 1200 × 630 dihasilkan dari src/assets/tentang/profil-hero.jpg, foto profil sekolah yang sudah dipakai website. Tidak ada gambar buatan atau identitas baru.

## 5. Structured data

Satu script JSON-LD dengan graph School, WebSite, WebPage, dan BreadcrumbList pada halaman selain beranda. School merupakan tipe khusus EducationalOrganization. ID stabil menghubungkan entitas; tidak dibuat dua entitas sekolah terpisah.

Alamat, telepon, email, dan sameAs berasal dari footerData yang sudah tersedia. Tidak ditambahkan founder, rating, review, atau informasi sekolah yang tidak ada. JSON.parse, tipe graph, ID unik, URL WebPage, dan jumlah script diuji pada seluruh 146 HTML produksi. Validator eksternal Google belum dijalankan; hasil tes tidak menjamin rich result atau ranking.

## 6. Semantic HTML

- Hanya slide pembuka memakai H1; slide lain H2 dengan class visual yang sama.
- H1 beranda mencantumkan identitas sekolah lewat teks sr-only.
- Section mitra industri memiliki H2 dan aria-labelledby, memakai terjemahan yang sudah ada.
- Semua 146 HTML yang diuji memiliki satu H1, satu main, dan tidak melewati level heading secara berurutan.

## 7. Indexability

- robots.txt mengizinkan crawling dan mencantumkan sitemap yang dihasilkan build.
- Sitemap berisi URL publik yang berhasil dirender, tanpa route legacy, login, dashboard, atau langkah portal SPMB.
- Halaman publik memakai index, follow. Login, dashboard, portal akun, dan error memakai noindex; error tidak membawa canonical halaman sebelumnya.
- Fallback SPA memakai app.html non-indexable agar URL tidak dikenal tidak memperoleh metadata homepage.
- Vercel mempertahankan filesystem-first routing dan menormalkan trailing slash. Apache fallback diselaraskan lewat .htaccess. Dasar perilaku filesystem-first: https://vercel.com/docs/project-configuration/vercel-json.
- Redirect client lama tetap tersedia. Tidak ditambahkan alias baru.

## 8. File yang diubah

Semua path di bawah relatif terhadap D:/LombaTelkom/smk-telkom-purwokerto/frontend:

```text
index.html
package.json
vite.config.js
vercel.json
public/.htaccess
src/App.jsx
src/utils/seo.js
src/index.css
src/components/HeroPanel.jsx
src/components/HeroCarousel.jsx
src/components/PartnersSection.jsx
src/components/AchievementsSection.jsx
src/components/DetailLayout.jsx
src/pages/LandingPage.jsx
src/pages/BeritaPage.jsx
src/pages/PengumumanPage.jsx
src/pages/PrestasiPage.jsx
src/pages/JurusanDetailPage.jsx
src/pages/ErrorPage.jsx
scripts/prerender-seo.mjs
scripts/uji-seo.mjs
scripts/uji-seo-browser.mjs
docs/audit-seo.md
```

robots.txt, sitemap.xml, og-school.jpg, app.html, dan HTML tiap rute merupakan output dist, bukan file source yang di-commit.

## 9. Lint

npm.cmd run lint: exit 0, tanpa error. Log: D:/LombaTelkom/outputs/seo-lint.log.

## 10. Build dan verifikasi

- npm.cmd run build: exit 0; Vite selesai dan prerender menghasilkan 146 rute publik. Log: D:/LombaTelkom/outputs/seo-build.log.
- npm.cmd run seo:uji: PASS 146 HTML produksi. Metadata tunggal, canonical, JSON-LD, H1/hierarchy, main, alt, URL aset produksi, sitemap, robots, fallback, dan dimensi OG terverifikasi. Log: D:/LombaTelkom/outputs/seo-html-test.log.
- node scripts/uji-seo-browser.mjs: PASS 13 halaman publik, navigasi client, query canonical, 404 ke halaman publik, login noindex, bahasa Inggris, lebar 390/768/1440, konten tanpa JavaScript, tanpa runtime error. Log: D:/LombaTelkom/outputs/seo-browser.log.
- git diff --check: exit 0.

Pengujian browser memakai Chrome headless dan server lokal yang meniru filesystem-first + fallback produksi. Deployment baru belum diterbitkan atau diverifikasi di Vercel/Apache. Fallback URL tidak dikenal masih berstatus HTTP 200 sesuai arsitektur SPA; noindex sudah masuk HTML awal.

Snapshot HTML dan sitemap diperbarui saat build/deploy. Publikasi atau penghapusan artikel setelah build membutuhkan build ulang agar crawler tanpa JavaScript menerima konten terbaru. Data kalender/BKK dan langkah portal tetap mengikuti pengambilan data client yang sudah ada.

## Git handoff

Branch saat audit: feat/fasilitas-sekolah. Remote origin: https://github.com/KiandrAHD/smk-telkom-purwokerto.git. Tidak dilakukan commit/push. Folder outputs yang sudah ada tidak ikut staging.

Jalankan dari D:/LombaTelkom/smk-telkom-purwokerto jika perubahan sudah disetujui:

```powershell
git add -- frontend/index.html frontend/package.json frontend/vite.config.js frontend/vercel.json frontend/public/.htaccess frontend/src/App.jsx frontend/src/utils/seo.js frontend/src/index.css frontend/src/components/HeroPanel.jsx frontend/src/components/HeroCarousel.jsx frontend/src/components/PartnersSection.jsx frontend/src/components/AchievementsSection.jsx frontend/src/components/DetailLayout.jsx frontend/src/pages/LandingPage.jsx frontend/src/pages/BeritaPage.jsx frontend/src/pages/PengumumanPage.jsx frontend/src/pages/PrestasiPage.jsx frontend/src/pages/JurusanDetailPage.jsx frontend/src/pages/ErrorPage.jsx frontend/scripts/prerender-seo.mjs frontend/scripts/uji-seo.mjs frontend/scripts/uji-seo-browser.mjs frontend/docs/audit-seo.md
git commit -m "fix: render public SEO metadata and school structured data"
git push origin feat/fasilitas-sekolah
```
