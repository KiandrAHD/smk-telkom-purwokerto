# Audit Routing dan Error Handling SMK Telkom Purwokerto

Tanggal: 12 Oktober 2026, Asia/Jakarta. Implementasi dan pengujian pada checkout lokal, branch feat/fasilitas-sekolah. Tidak melakukan commit, push, atau deployment. Situs produksi belum memuat perbaikan ini.

## Root cause

Fallback routing sebelumnya memakai SegeraHadirPage untuk seluruh URL yang tidak dikenal. Komponen tersebut membentuk judul dari URL, sehingga typo fasilitas123 terlihat seperti halaman resmi yang sedang dikembangkan. Detail jurusan dan halaman pelengkap juga memakai placeholder saat slug tidak ada.

Detail berita, prestasi, dan pengumuman sebelumnya menampilkan missing data sebagai kotak error. Query single menggabungkan nol baris dan hasil tidak tunggal dalam PGRST116. Sekarang maybeSingle mengembalikan null untuk nol baris, sehingga hanya data yang benar-benar tidak ada menjadi 404; exception layanan tetap error dengan retry.

Render dan lazy import belum memiliki boundary bersama. Pemeriksaan admin juga menggabungkan tanpa sesi dan tanpa izin menjadi redirect login. Perbaikan sekarang membedakan render/chunk, jaringan, data, dan akses.

Review serta pengujian menangkap dan memperbaiki reset provider saat navigasi, 403 sementara ketika verifikasi token, request auth lama, dan metadata error saat Back/Forward. Provider SPMB/admin tetap hidup pada navigasi normal.

## Route yang diperbaiki

- Seluruh URL tak terdaftar, termasuk /fasilitas123, /jurusanabc, /random-page, nested URL tidak resmi dan URL lama PPDB tidak resmi: 404.
- /jurusan/:slug: 404 untuk slug tidak ada.
- /profil-sekolah/guru/:slug dan alias /tentang/guru/:slug: 404 untuk slug tidak ada.
- /galeri/:slug, /berita/agenda/:slug, /bkk/panduan/:slug, /bkk/pkl/:slug, /bkk/roadmap/:slug, /jurusan/project/:slug: 404 untuk slug tidak ada.
- /berita/:slug, /prestasi/:slug, /pengumuman/:slug: 404 hanya setelah query sukses tanpa data. API 503 atau koneksi gagal menampilkan error dengan retry.
- /dashboard dan halaman anak resmi: tanpa sesi diarahkan ke /login, user terautentikasi tanpa izin mendapat 403, gangguan verifikasi izin mendapat pesan error layanan.
- /fasilitas dan semua route resmi tetap terdaftar. Koleksi statis, route nested dan redirect legacy dipertahankan.

Tidak ditemukan route resmi yang masih direncanakan dan belum memiliki implementasi dalam App.jsx. Karena itu tidak menambahkan route Coming Soon baru. Komponennya tetap tersedia untuk route resmi yang nanti secara eksplisit didaftarkan; tidak digunakan sebagai fallback.

## Tampilan dan i18n

Halaman error memakai token merah, putih, hitam dan font-heading/font global, ikon lucide existing, serta MainLayout dengan Navbar/Footer bersama. Ada tombol beranda, tombol kembali ketika idx history React Router lebih dari nol, dan muat ulang untuk kegagalan aplikasi/chunk. Metadata judul/deskripsi dan noindex dibersihkan saat meninggalkan error.

ID/EN diuji pada 1440, 768, 390, 375 piksel tanpa reload dan tanpa overflow horizontal. Preferensi bahasa halaman admin tetap mengikuti aturan existing yang menggunakan bahasa Indonesia. Tidak mengubah CSS global, viewport, markup/style navbar atau footer. Navbar hanya diberi catch untuk prefetch gagal; MainLayout hanya diberi catch untuk optional SmoothScroll. Tidak menambahkan dependency.

## HTTP dan batasan deployment

Pemeriksaan GET langsung terhadap produksi menghasilkan:

| URL | Status HTTP | Content-Type |
| --- | --- | --- |
| / | 200 | text/html |
| /fasilitas | 200 | text/html |
| /fasilitas123 | 200 | text/html |
| /random-page | 200 | text/html |

frontend/vercel.json masih me-rewrite seluruh jalur ke index.html. Konfigurasi ini dipertahankan agar direct navigation dan refresh React Router berjalan. Halaman 404 dan 403 saat ini merupakan state UI; JavaScript client tidak dapat mengubah status HTTP dokumen yang sudah diterima.

Rekomendasi kompatibel Vercel: tambahkan Routing Middleware atau handler server yang memakai daftar route bersama, melewatkan aset/API serta route resmi, dan menyajikan shell SPA dengan status 404 untuk route tak dikenal. Untuk slug data dinamis, validasi data published di server; gangguan query harus tetap 5xx, bukan 404. Alternatifnya SSR/SSG dengan loader server. Ini memerlukan perubahan lapisan deployment tersendiri dan belum diimplementasikan pada task ini.

Referensi resmi: [Vercel rewrites](https://vercel.com/docs/routing/rewrites), [Routing Middleware](https://vercel.com/docs/routing-middleware).

Error boundary menangkap error render/effect dan lazy route setelah aplikasi dimuat. Kegagalan bootstrap JavaScript pertama atau membuka website saat sepenuhnya offline sebelum aplikasi dimuat masih ditangani browser; tidak menambahkan service worker/offline cache. Belum memverifikasi izin akun produksi atau deployment baru. Sesi dan respons API dalam uji browser adalah fixture lokal yang dicegat, tanpa pembuatan akun atau perubahan database produksi.

## Hasil verifikasi

Suite browser final: 101 skenario lulus, 0 gagal. Pemeriksaan tambahan: 3 lulus. Semua pengujian browser memakai Chrome headless pada production build lokal (Vite preview). 49 route statis resmi diakses langsung; route admin diuji sebagai redirect tanpa sesi dan dibuka ulang dengan sesi admin simulasi. Delapan jenis detail lokal menggunakan slug valid representatif, bukan seluruh record.

| Perintah | Hasil |
| --- | --- |
| npm.cmd run lint | Lulus, exit 0 |
| npm.cmd run build | Lulus, exit 0; warning informatif PLUGIN_TIMINGS |
| npm.cmd run bahasa:uji | Lulus; tes pertama sempat gagal karena ekspektasi navbar belum memasukkan fasilitas existing, lalu diperbarui |
| npm.cmd run security:uji | Lulus; provider/akses diuji melalui stub dan kontrak, bukan serangan ke produksi |
| npm.cmd run ppdb:uji | Lulus |
| npm.cmd run spmb:qol | Lulus |
| npm.cmd run bkk:uji | Lulus, 12 pemeriksaan |
| git diff --check | Lulus |

Tidak tersedia script npm test tunggal. Tidak mengklaim seluruh skrip benchmark/performa, integrasi database, semua akun produksi, atau seluruh record konten telah diuji.

Tes awal sebelum perbaikan gagal sesuai bug: heading /fasilitas123 adalah Fasilitas123, bukan 404. Iterasi suite juga memperbaiki selector bahasa, sinkronisasi assertion metadata, dan dependensi metadata route. Hasil di bawah berasal dari run final, bukan gabungan hasil parsial.

| Skenario | Hasil | Detail |
| --- | --- | --- |
| 404 /fasilitas123 | Lulus |  |
| 404 /jurusanabc | Lulus |  |
| 404 /random-page | Lulus |  |
| 404 /spmb/unknown | Lulus |  |
| 404 /dashboard/unknown | Lulus |  |
| 404 /fasilitas/extra | Lulus |  |
| 404 /jurusan/rpl/extra | Lulus |  |
| 404 /ppdb/unknown | Lulus |  |
| 404 /profil-sekolah/guru/tidak-ada | Lulus |  |
| 404 /tentang/guru/tidak-ada | Lulus |  |
| 404 /jurusan/tidak-ada | Lulus |  |
| 404 /galeri/tidak-ada | Lulus |  |
| 404 /berita/agenda/tidak-ada | Lulus |  |
| 404 /bkk/panduan/tidak-ada | Lulus |  |
| 404 /bkk/pkl/tidak-ada | Lulus |  |
| 404 /bkk/roadmap/tidak-ada | Lulus |  |
| 404 /jurusan/project/tidak-ada | Lulus |  |
| 404 refresh, query, hash, slash | Lulus |  |
| Direct access dan refresh route valid | Lulus |  |
| Data kosong /berita/tidak-ada | Lulus |  |
| Data kosong /prestasi/tidak-ada | Lulus |  |
| Data kosong /pengumuman/tidak-ada | Lulus |  |
| Detail tersedia berita | Lulus |  |
| 503 dan retry berita | Lulus |  |
| Detail tersedia prestasi | Lulus |  |
| 503 dan retry prestasi | Lulus |  |
| Detail tersedia pengumuman | Lulus |  |
| 503 dan retry pengumuman | Lulus |  |
| Network error dan offline pulih | Lulus |  |
| Offline tidak merusak halaman lokal | Lulus |  |
| Route resmi /dashboard | Lulus | {"finalPath": "/login", "heading": "Login Admin"} |
| Route resmi / | Lulus | {"finalPath": "/", "heading": "Bangun Masa Depanmu\nBersama Teknologi"} |
| Route resmi /fasilitas | Lulus | {"finalPath": "/fasilitas", "heading": "Ruang Kelas Modern,\nTempat Inspirasi dan Inovasi Dimulai"} |
| Route resmi /profil-sekolah | Lulus | {"finalPath": "/profil-sekolah", "heading": "Tempat Tumbuhnya\nPara Inovator\nMasa Depan."} |
| Route resmi /profil-sekolah/guru | Lulus | {"finalPath": "/profil-sekolah/guru", "heading": "Profil Guru\nSMK Telkom\nPurwokerto"} |
| Route resmi /tentang | Lulus | {"finalPath": "/profil-sekolah", "heading": "Tempat Tumbuhnya\nPara Inovator\nMasa Depan."} |
| Route resmi /jurusan | Lulus | {"finalPath": "/jurusan", "heading": "Temukan Jurusan\nPilihanmu"} |
| Route resmi /prestasi | Lulus | {"finalPath": "/prestasi", "heading": "Setiap Prestasi\nAdalah Bukti Nyata\nSemangat Berkarya"} |
| Route resmi /bkk | Lulus | {"finalPath": "/bkk", "heading": "Dari Ruang Kelas\nMenuju Dunia\nKerja Nyata"} |
| Route resmi /berita | Lulus | {"finalPath": "/berita", "heading": "Berita &\nKegiatan\nTerbaru"} |
| Route resmi /pengumuman | Lulus | {"finalPath": "/pengumuman", "heading": "Semua Kabar Resmi\nAda di Satu Tempat."} |
| Route resmi /spmb | Lulus | {"finalPath": "/spmb/masuk", "heading": "Selamat Datang\nKembali!"} |
| Route resmi /ketentuan-ppdb | Lulus | {"finalPath": "/ketentuan-spmb", "heading": "Ketentuan SPMB SMK Telkom Purwokerto"} |
| Route resmi /dashboard/ppdb | Lulus | {"finalPath": "/login", "heading": "Login Admin"} |
| Route resmi /galeri | Lulus | {"finalPath": "/galeri", "heading": "Galeri Kegiatan"} |
| Route resmi /bkk/panduan | Lulus | {"finalPath": "/bkk/panduan", "heading": "Panduan Karier"} |
| Route resmi /jurusan/faq | Lulus | {"finalPath": "/jurusan/faq", "heading": "FAQ Tentang Jurusan"} |
| Route resmi /jurusan/perbandingan | Lulus | {"finalPath": "/jurusan/perbandingan", "heading": "Perbandingan Jurusan"} |
| Route resmi /ketentuan-spmb | Lulus | {"finalPath": "/ketentuan-spmb", "heading": "Ketentuan SPMB SMK Telkom Purwokerto"} |
| Route resmi /lupa-sandi | Lulus | {"finalPath": "/lupa-sandi", "heading": "Lupa Kata Sandi?"} |
| Route resmi /spmb/daftar | Lulus | {"finalPath": "/spmb/daftar", "heading": "Mulai Masa Depan\nDigitalmu di Sini."} |
| Route resmi /spmb/atur-sandi | Lulus | {"finalPath": "/spmb/atur-sandi", "heading": "Atur Kata Sandi Baru"} |
| Route resmi /spmb/masuk | Lulus | {"finalPath": "/spmb/masuk", "heading": "Selamat Datang\nKembali!"} |
| Route resmi /spmb/verifikasi | Lulus | {"finalPath": "/spmb/masuk", "heading": "Selamat Datang\nKembali!"} |
| Route resmi /auth/confirm | Lulus | {"finalPath": "/auth/confirm", "heading": "Konfirmasi Email Gagal"} |
| Route resmi /spmb/formulir | Lulus | {"finalPath": "/spmb/masuk", "heading": "Selamat Datang\nKembali!"} |
| Route resmi /spmb/berkas | Lulus | {"finalPath": "/spmb/masuk", "heading": "Selamat Datang\nKembali!"} |
| Route resmi /spmb/selesai | Lulus | {"finalPath": "/spmb/masuk", "heading": "Selamat Datang\nKembali!"} |
| Route resmi /spmb/status | Lulus | {"finalPath": "/spmb/masuk", "heading": "Selamat Datang\nKembali!"} |
| Route resmi /spmb/dokumen-peserta | Lulus | {"finalPath": "/spmb/masuk", "heading": "Selamat Datang\nKembali!"} |
| Route resmi /pengumuman/populer | Lulus | {"finalPath": "/pengumuman/populer", "heading": "Pengumuman Terbaru"} |
| Route resmi /pengumuman/semua | Lulus | {"finalPath": "/pengumuman/semua", "heading": "Semua Pengumuman"} |
| Route resmi /pengumuman/timeline | Lulus | {"finalPath": "/pengumuman/timeline", "heading": "Timeline Pengumuman"} |
| Route resmi /pengumuman/informasi-penting | Lulus | {"finalPath": "/pengumuman/informasi-penting", "heading": "Informasi Penting"} |
| Route resmi /berita/trending | Lulus | {"finalPath": "/berita/trending", "heading": "Berita Trending"} |
| Route resmi /berita/agenda | Lulus | {"finalPath": "/berita/agenda", "heading": "Kategori Berita"} |
| Route resmi /prestasi/galeri | Lulus | {"finalPath": "/prestasi/galeri", "heading": "Galeri Prestasi"} |
| Route resmi /stela | Lulus | {"finalPath": "/stela", "heading": "Tanyakan apa saja ke STELA"} |
| Route resmi /nexttel | Lulus | {"finalPath": "/nexttel", "heading": "Temukan jurusan yang cocok dengan minatmu"} |
| Route resmi /ekstrakurikuler | Lulus | {"finalPath": "/ekstrakurikuler", "heading": "EKSTRAKURIKULER"} |
| Route resmi /kebijakan-privasi | Lulus | {"finalPath": "/kebijakan-privasi", "heading": "Kebijakan Privasi"} |
| Route resmi /login | Lulus | {"finalPath": "/login", "heading": "Login Admin"} |
| Route resmi /dashboard/berita | Lulus | {"finalPath": "/login", "heading": "Login Admin"} |
| Route resmi /dashboard/pengumuman | Lulus | {"finalPath": "/login", "heading": "Login Admin"} |
| Route resmi /dashboard/spmb | Lulus | {"finalPath": "/login", "heading": "Login Admin"} |
| Route resmi /dashboard/jurusan | Lulus | {"finalPath": "/login", "heading": "Login Admin"} |
| Route resmi /dashboard/prestasi | Lulus | {"finalPath": "/login", "heading": "Login Admin"} |
| Route resmi /dashboard/bkk | Lulus | {"finalPath": "/login", "heading": "Login Admin"} |
| Route resmi /dashboard/pengaturan | Lulus | {"finalPath": "/login", "heading": "Login Admin"} |
| Detail lokal /jurusan/ | Lulus | /jurusan/rpl |
| Detail lokal /galeri/ | Lulus | /galeri/tim-siswa-berprestasi |
| Detail lokal /berita/agenda/ | Lulus | /berita/agenda/semianar-cyber-security-bersama-telkom |
| Detail lokal /bkk/panduan/ | Lulus | /bkk/panduan/download-template-cv-profesional |
| Detail lokal /bkk/pkl/ | Lulus | /bkk/pkl/pkl-it-support-pt-telkom-indonesia |
| Detail lokal /bkk/roadmap/ | Lulus | /bkk/roadmap/rpl |
| Detail lokal /jurusan/project/ | Lulus | /jurusan/project/pengolahan-sampah-plastik-berbasis-iot |
| Detail lokal /profil-sekolah/guru/ | Lulus | /profil-sekolah/guru/firda-ayu-nirmala-s-kom |
| Browser Back/Forward dan tombol Kembali | Lulus |  |
| Responsive dan ID/EN 1440 | Lulus | {"scroll": 1440, "client": 1440} |
| Responsive dan ID/EN 768 | Lulus | {"scroll": 768, "client": 768} |
| Responsive dan ID/EN 390 | Lulus | {"scroll": 390, "client": 390} |
| Responsive dan ID/EN 375 | Lulus | {"scroll": 375, "client": 375} |
| Unauthenticated admin redirect | Lulus |  |
| Fallback chunk dan reload | Lulus |  |
| Fallback render dan reload | Lulus |  |
| Fallback offline dan reload | Lulus |  |
| State email SPMB bertahan pada navigasi SPA | Lulus |  |
| Akses admin dengan sesi simulasi | Lulus |  |
| Akses forbidden dengan sesi simulasi | Lulus |  |
| Akses server dengan sesi simulasi | Lulus |  |
| No unexpected JS exceptions | Lulus |  |
| Alias PPDB mempertahankan query dan hash | Lulus |  |
| Skip link keyboard pada 404 | Lulus |  |
| Noindex 404 dibersihkan saat kembali ke beranda | Lulus |  |

## File yang diubah

| File | Perubahan |
| --- | --- |
| frontend/src/App.jsx | Fallback route memakai ErrorPage; boundary melindungi halaman lazy; shell error tersedia sejak awal. |
| frontend/src/pages/ErrorPage.jsx | Halaman 404, 403, render, chunk, offline; Header/Footer bersama, i18n, tombol beranda/kembali/reload, metadata noindex. |
| frontend/src/components/RouteErrorBoundary.jsx | Menangkap render/chunk, reset error saat navigasi tanpa mereset provider, reload untuk retry lazy import. |
| frontend/src/pages/JurusanDetailPage.jsx | Slug jurusan yang tidak ada menampilkan 404. |
| frontend/src/pages/DetailPelengkapPage.jsx | Slug agenda, galeri, guru, panduan, PKL, roadmap, project yang tidak ada menampilkan 404. |
| frontend/src/pages/BeritaDetailPage.jsx | Data null menjadi 404; gangguan layanan tetap error dengan retry. |
| frontend/src/pages/PrestasiDetailPage.jsx | Data null menjadi 404; gangguan layanan tetap error dengan retry. |
| frontend/src/pages/PengumumanDetailPage.jsx | Data null menjadi 404; gangguan layanan tetap error dengan retry. |
| frontend/src/services/beritaService.js | Query detail memakai maybeSingle; nol baris dibedakan dari kegagalan query. |
| frontend/src/services/prestasiService.js | Query detail memakai maybeSingle; nol baris dibedakan dari kegagalan query. |
| frontend/src/services/pengumumanService.js | Query detail memakai maybeSingle; nol baris dibedakan dari kegagalan query. |
| frontend/src/components/PublicDataState.jsx | Pesan offline mengikuti online/offline event; retry existing dipertahankan. |
| frontend/src/context/AuthContext.jsx | Gangguan verifikasi izin memiliki accessError; request lama tidak menimpa hasil terbaru; refresh user sama menjaga state. |
| frontend/src/router/ProtectedRoute.jsx | Tanpa user ke login; user tanpa izin mendapat 403; gangguan pemeriksaan izin mendapat error layanan. |
| frontend/src/data/translationsSchool.js | Teks error ID/EN melalui dictionary existing. |
| frontend/src/pages/SegeraHadirPage.jsx | Komentar membatasi pemakaian pada route resmi yang direncanakan. |
| frontend/src/components/Navbar.jsx | Hanya catch kegagalan prefetch; markup, ukuran, tampilan, dan tujuan navigasi tetap. |
| frontend/src/layouts/MainLayout.jsx | Hanya catch optional SmoothScroll chunk; scrolling native tetap tersedia. |
| frontend/scripts/uji-bahasa.mjs | Memperbarui ekspektasi route fasilitas yang sudah ada sebelum perubahan ini. |
| frontend/scripts/uji-routing-browser.mjs | Regresi browser routing, detail, layanan, offline, bahasa, ukuran layar, auth, provider, chunk/render. |
| docs/routing-error-audit-2026-10-12.md | Laporan audit, bukti verifikasi, batasan dan perintah Git. |

## Bukti dan cara mengulang

- [Hasil lengkap JSON](D:/LombaTelkom/qa-output/routing-2026-10-12/results.json)
- [Pemeriksaan tambahan](D:/LombaTelkom/qa-output/routing-2026-10-12/extra-results.json)
- [404 ID desktop](D:/LombaTelkom/qa-output/routing-2026-10-12/404-id-1440.png)
- [404 EN desktop](D:/LombaTelkom/qa-output/routing-2026-10-12/404-en-1440.png)
- [404 ID mobile](D:/LombaTelkom/qa-output/routing-2026-10-12/404-id-390.png)
- [404 EN mobile](D:/LombaTelkom/qa-output/routing-2026-10-12/404-en-390.png)

Jalankan dari frontend setelah build, dengan preview di port 4173:

```powershell
npm.cmd run build
npm.cmd run preview -- --host 127.0.0.1 --port 4173
```

Di terminal lain, gunakan Playwright bundled yang sudah tersedia pada perangkat ini:

```powershell
Set-Location 'D:\LombaTelkom\smk-telkom-purwokerto\frontend'
$env:PLAYWRIGHT_MODULE = 'file:///C:/Users/IDEAPAD%20SLIM%203/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'
$env:QA_BASE_URL = 'http://127.0.0.1:4173'
$env:QA_OUTPUT = 'D:/LombaTelkom/qa-output/routing-2026-10-12'
node scripts/uji-routing-browser.mjs
```

PLAYWRIGHT_MODULE dapat diarahkan ke instalasi Playwright lain; script tidak menambahkan dependency ke proyek. QA_OUTPUT default berada di direktori temporer sistem.

## Perintah Git untuk dijalankan pengguna

Remote terverifikasi: https://github.com/KiandrAHD/smk-telkom-purwokerto.git. Branch terverifikasi: feat/fasilitas-sekolah. Perintah berikut belum dijalankan.

```powershell
Set-Location 'D:\LombaTelkom\smk-telkom-purwokerto'
$filesRouting = @(
  'frontend/src/App.jsx'
  'frontend/src/pages/ErrorPage.jsx'
  'frontend/src/components/RouteErrorBoundary.jsx'
  'frontend/src/pages/JurusanDetailPage.jsx'
  'frontend/src/pages/DetailPelengkapPage.jsx'
  'frontend/src/pages/BeritaDetailPage.jsx'
  'frontend/src/pages/PrestasiDetailPage.jsx'
  'frontend/src/pages/PengumumanDetailPage.jsx'
  'frontend/src/services/beritaService.js'
  'frontend/src/services/prestasiService.js'
  'frontend/src/services/pengumumanService.js'
  'frontend/src/components/PublicDataState.jsx'
  'frontend/src/context/AuthContext.jsx'
  'frontend/src/router/ProtectedRoute.jsx'
  'frontend/src/data/translationsSchool.js'
  'frontend/src/pages/SegeraHadirPage.jsx'
  'frontend/src/components/Navbar.jsx'
  'frontend/src/layouts/MainLayout.jsx'
  'frontend/scripts/uji-bahasa.mjs'
  'frontend/scripts/uji-routing-browser.mjs'
  'docs/routing-error-audit-2026-10-12.md'
)
git add -- $filesRouting
git diff --cached --stat
git commit -m "fix: routing 404 and error handling"
git push origin feat/fasilitas-sekolah
```
