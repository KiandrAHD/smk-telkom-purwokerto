# Pemulihan tipografi navbar dan audit font

Tanggal: 12 Oktober 2026. Audit source mencakup 216 file JavaScript/JSX/CSS di seluruh `frontend/src`, termasuk halaman publik, SPMB, dan dashboard. Runtime diuji pada halaman Fasilitas, Prestasi, dan Pengumuman; bukan seluruh route atau halaman yang memerlukan akun.

## Bukti Git dan sebelum/sesudah

`git show 61ec64e:frontend/src/components/Navbar.jsx` menunjukkan menu desktop `text-sm font-medium`. `index.css` pada commit yang sama menetapkan Inter/Poppins untuk sans dan Poppins/Inter untuk heading. Commit `fb8ce50` mengubah menu menjadi `font-semibold tracking-[0.12em]`. Commit `546e5ee` menambahkan `font-main` sebagai alias stack existing dan `font-sans` pada header; perubahan ini tidak mengganti keluarga font. Layout pusat dari `b69634b` dipertahankan.

| Properti menu desktop | Sebelum | Sesudah, sesuai 61ec64e |
| --- | --- | --- |
| Font-family | Inter, Poppins, system-ui, sans-serif | Sama, diwarisi dari token font-sans |
| Font-size | 14 px / text-sm | 14 px / text-sm |
| Font-weight | 600 / font-semibold | 500 / font-medium |
| Line-height | 20 px | 20 px |
| Letter-spacing | 0,12em = 1,68 px | normal / tracking-normal |

Chrome DevTools Protocol mengonfirmasi glyph navbar sebelum perubahan memakai Inter-SemiBold. Setelah perubahan font aktual tetap Inter dengan weight computed 500. Mobile menu, dropdown, CTA, language toggle, dan logo tidak diseragamkan weight-nya; masing-masing tetap mengikuti peran existing.

## Temuan dan perbaikan aman

Tujuh override Jakarta hanya menetapkan `Plus Jakarta Sans`. Stylesheet aktif `font-faces-optimized.css` hanya memuat Inter dan Poppins, normal, weight 400–800. Browser sebelumnya mengonfirmasi Times New Roman pada heading video Prestasi dan CTA bantuan Pengumuman. Perbaikan mempertahankan pilihan Jakarta dan menambahkan `var(--font-sans)` sebagai fallback; tidak menambah font, dependency, atau mengubah CSS global.

| Lokasi | Nilai ditemukan | Nilai setelah perbaikan | Status |
| --- | --- | --- | --- |
| frontend/src/components/Navbar.jsx:77 | 600, tracking 0,12em | 500, tracking normal | Sudah diperbaiki sesuai Git |
| frontend/src/components/CTASection.jsx:12 | Jakarta tanpa fallback, variant prestasi | Jakarta + token font-sans | Sudah diperbaiki; variant tidak diuji visual karena tidak dipakai layout utama saat ini |
| frontend/src/components/prestasi/PrestasiPerjalananSection.jsx:37 | Jakarta tanpa fallback | Jakarta + token font-sans | Sudah diperbaiki |
| frontend/src/components/prestasi/PrestasiDukunganSection.jsx:9 | Jakarta tanpa fallback | Jakarta + token font-sans | Sudah diperbaiki |
| frontend/src/components/pengumuman/PengumumanBantuanCard.jsx:10 | Jakarta tanpa fallback | Jakarta + token font-sans | Sudah diperbaiki |
| frontend/src/components/pengumuman/PengumumanCard.jsx:20 | Jakarta tanpa fallback | Jakarta + token font-sans | Sudah diperbaiki |
| frontend/src/components/pengumuman/PengumumanDaftarSection.jsx:99 | Jakarta tanpa fallback | Jakarta + token font-sans | Sudah diperbaiki |
| frontend/src/components/pengumuman/PengumumanPopulerCard.jsx:21 | Jakarta tanpa fallback | Jakarta + token font-sans | Sudah diperbaiki |

Kode relevan:

```diff
- text-sm font-semibold tracking-[0.12em]
+ text-sm font-medium tracking-normal
- font-['Plus_Jakarta_Sans']
+ font-[family-name:'Plus_Jakarta_Sans',var(--font-sans)]
```

Ukuran, weight, line-height, margin, padding, grid, dan breakpoint tujuh komponen di luar navbar tetap. Lebar/wrapping teks di komponen yang sebelumnya memakai Times New Roman dapat berubah sebagai konsekuensi fallback Inter; tidak ditemukan overflow pada runtime yang diuji. Heading Poppins, teks Inter, logo bitmap, dan artwork dekoratif sengaja dipertahankan; perbedaan ukuran menurut peran bukan otomatis bug.

## Perlu keputusan desain, belum diubah

| Lokasi | Nilai ditemukan | Nilai yang disarankan/keputusan | Status |
| --- | --- | --- | --- |
| Tujuh override pada tabel di atas | Jakarta merupakan pilihan eksplisit dari implementasi Figma, tetapi font belum dimuat | Pilih memuat Jakarta lokal atau mengganti ke token Inter/Poppins; fallback sekarang aman | Perlu konfirmasi |
| frontend/src/components/pengumuman/PengumumanCard.jsx:50 | Deskripsi 800, 11 px → clamp hingga 20 px; heading juga 800 | Deskripsi 400/500 agar hirarki lebih jelas; ukuran perlu disetujui sesuai desain card | Perlu konfirmasi |
| frontend/src/components/stela/StelaChat.jsx:43 dan font-faces-optimized.css | Markdown memakai em, font-face aktif hanya normal | Sediakan face italic jika ingin italic asli; penekanan Markdown tetap dipertahankan | Perlu konfirmasi; belum diverifikasi glyph italic di browser |

Ada 26 penggunaan eksplisit 9 px pada 16 file berikut. Sebagian merupakan badge/metadata yang dapat disengaja, sehingga belum dinyatakan semuanya salah. Untuk teks pendukung yang perlu dibaca, usulan memakai `text-xs` (12 px) atau `text-sm` (14 px) sesuai peran. Ini membutuhkan keputusan karena dapat mengubah wrapping dan tinggi card.

| File, di bawah frontend/src | Baris | Nilai | Status |
| --- | --- | --- | --- |
| components/berita/BeritaAgendaSection.jsx | 50, 60, 125 | 9 px | Perlu konfirmasi |
| components/berita/BeritaDetailKonten.jsx | 56, 62 | 9 px | Perlu konfirmasi |
| components/berita/BeritaKategoriSection.jsx | 152 | 9 px | Perlu konfirmasi |
| components/berita/BeritaSorotSection.jsx | 28, 69 | 9 px | Perlu konfirmasi |
| components/bkk/BkkJalurKarierSection.jsx | 56, 63 | 9 px | Perlu konfirmasi |
| components/bkk/BkkLowonganSection.jsx | 163, 176 | 9 px | Perlu konfirmasi |
| components/bkk/BkkPklSection.jsx | 26, 27, 29 | 9 px | Perlu konfirmasi |
| components/jurusan/JurusanCompareSection.jsx | 82 | 9 px | Perlu konfirmasi |
| components/jurusan/JurusanListSection.jsx | 46 | 9 px | Perlu konfirmasi |
| components/jurusan/JurusanQuizSection.jsx | 92, 119 | 9 px | Perlu konfirmasi |
| components/jurusan/JurusanShowcaseSection.jsx | 38 | 9 px | Perlu konfirmasi |
| components/pengumuman/PengumumanTimelineBar.jsx | 20 | 9 px | Perlu konfirmasi |
| components/prestasi/PrestasiDetailKonten.jsx | 28, 80 | 9 px; baris 28 menjadi 10 px pada sm | Perlu konfirmasi |
| components/prestasi/PrestasiGaleriSection.jsx | 96 | 9 px | Perlu konfirmasi |
| components/prestasi/PrestasiUnggulanSection.jsx | 31 | 9 px | Perlu konfirmasi |
| pages/ppdb/RegistrationFormPage.jsx | 240 | 9 px | Perlu konfirmasi |

Tidak dilakukan normalisasi otomatis semua ukuran/weight. Tidak ditemukan override keluarga font lain pada source aplikasi selain tujuh Jakarta dan token global yang disebutkan. File font-faces.css lama tidak diimpor stylesheet aktif; bukan alasan mengubah deklarasi global saat ini.

## Validasi

| Pemeriksaan | Hasil |
| --- | --- |
| npm.cmd run lint | Lulus, exit 0 |
| npm.cmd run build | Lulus, exit 0 |
| TypeScript | Tidak tersedia: frontend memakai JS/JSX, tanpa tsconfig atau script typecheck |
| Runtime | 24 kombinasi: Fasilitas/Prestasi/Pengumuman × 1440/1280/768/375 px × ID/EN, semua lulus |
| Font aktual | CDP mengonfirmasi Inter pada navbar, heading video Prestasi, CTA bantuan Pengumuman; tidak memakai Times New Roman pada sampel setelah perbaikan |
| Layout navbar | Pusat menu desktop berbeda kurang dari 1 px dari pusat viewport; tinggi header tetap 80/64 px |
| Interaksi | Dropdown desktop, menu mobile, Escape lulus; ID/EN lulus; tanpa overflow/exception JavaScript pada skenario yang diuji |
| Visual regression | Screenshot sebelum/sesudah Fasilitas 1440 px memiliki ukuran sama 1440×3465; konten di bawah header, logo, language toggle dan CTA identik piksel |
| git diff --check | Lulus |

Request konten publik dimock: Pengumuman menggunakan satu record fixture, halaman lain menggunakan array kosong. Ini memverifikasi font/komponen dalam kondisi tersebut, bukan data production atau route authenticated. Screenshot Prestasi dan Pengumuman tersedia untuk perbandingan fallback; belum ada visual baseline otomatis seluruh aplikasi. Tidak ada commit/push/deploy.

Artefak: `D:/LombaTelkom/qa-output/navbar-typography-2026-10-12/` berisi before.json, after.json, screenshot sebelum/sesudah dan ID/EN, serta small-text-source.json. Script QA berada di `D:/LombaTelkom/qa-output/navbar-typography-before.mjs` dan `navbar-typography-after.mjs`.

## File berubah dan Git handoff

Delapan file komponen pada tabel perbaikan berubah masing-masing satu baris, serta dokumen laporan ini. Navbar memulihkan weight/tracking lama; tujuh file lain menambah fallback existing. Branch: feat/fasilitas-sekolah. Remote origin: https://github.com/KiandrAHD/smk-telkom-purwokerto.git.

Jalankan dari `D:/LombaTelkom/smk-telkom-purwokerto` bila ingin menyimpan dan mengirim perubahan:

```powershell
git add frontend/src/components/Navbar.jsx frontend/src/components/CTASection.jsx frontend/src/components/prestasi/PrestasiPerjalananSection.jsx frontend/src/components/prestasi/PrestasiDukunganSection.jsx frontend/src/components/pengumuman/PengumumanBantuanCard.jsx frontend/src/components/pengumuman/PengumumanCard.jsx frontend/src/components/pengumuman/PengumumanDaftarSection.jsx frontend/src/components/pengumuman/PengumumanPopulerCard.jsx docs/qa-navbar-typography.md
git commit -m "fix: restore navbar typography and safe font fallbacks"
git push origin feat/fasilitas-sekolah
```
