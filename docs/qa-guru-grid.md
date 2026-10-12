# Laporan grid guru dan pagination

Tanggal: 12 Oktober 2026. Route: `/profil-sekolah/guru`. Pemeriksaan lokal menggunakan production preview Vite dan Chrome headless.

## Perubahan layout

| Ukuran layar | Sebelum | Sesudah | Jumlah halaman untuk 40 guru |
| --- | --- | --- | --- |
| Desktop ≥1200 px | Carousel satu baris, 4 guru | Grid 4 kolom × 2 baris, 8 guru | 5 |
| Tablet 768–1199 px | 2 atau 4 guru sesuai breakpoint lama | Grid 2 kolom × 2 baris, 4 guru | 10 |
| Mobile <768 px | 1 atau 2 guru sesuai breakpoint lama | Grid 1 kolom × 2 baris, 2 guru | 20 |

Dataset asli berisi 40 guru berbeda. Hanya kelompok halaman aktif dirender. Urutan, nama, jabatan, deskripsi, tautan detail, komponen TeacherPhoto, crop foto, dan empat sisi frame merah-abu dipertahankan. Navbar, hero, Kepala Sekolah, Footer, global CSS, dan dataset tidak diubah.

Grid memakai tinggi baris yang sama, ruang nama/jabatan dua baris, minimum tinggi area teks 208 px dari token spacing Tailwind, dan gap vertikal 32 px. Dua track grid tetap dicadangkan pada halaman terakhir agar pagination tidak bergeser; track kosong tidak berisi kartu atau placeholder guru. Tinggi minimum ini telah diperiksa terhadap seluruh data dan kedua bahasa saat ini.

## Penyebab animasi sebelumnya

Implementasi lama memakai state React dan CSS, tanpa Swiper atau Framer Motion. Track carousel menggeser seluruh halaman dengan translate3d selama 500 ms. Previous/Next memakai modulo sehingga dari akhir langsung kembali ke awal, melintasi panjang track.

Indikator hanya menampilkan empat dot dalam kelompok. Perubahan kelompok mereset posisi visual. Pill sebenarnya bukan satu elemen yang bergerak: setiap dot berganti antara lebar 12 px dan 24 px ketika aktif, sehingga tampak melompat. Wrapper Reveal pada setiap kartu juga menjalankan animasi masuk terpisah.

Solusi sekarang memakai satu pill persisten di atas slot dot berukuran tetap. Pill bergerak melalui transform selama 300 ms dengan cubic-bezier(0.22,1,0.36,1). Dot dasar tidak berubah ukuran atau posisi. Pagination finite menonaktifkan Previous pada halaman pertama dan Next pada halaman terakhir. Tidak ada autoplay maupun animasi track yang melintasi semua halaman.

Desktop/tablet menampilkan seluruh dot untuk dataset saat ini. Mobile menampilkan jendela lima dot yang bergeser bertahap, bukan reset per kelompok. Halaman aktif selalu sesuai data. Resize mempertahankan kelompok yang memuat guru pertama yang sebelumnya terlihat.

## File yang diubah

| File | Alasan |
| --- | --- |
| frontend/src/pages/GuruPage.jsx | Mengganti GuruCarousel dengan GuruGrid, pembagian 8/4/2, tinggi kartu, kontrol finite, pill persisten, reduced motion, dan empty state |
| frontend/src/data/translationsSchool.js | Menambahkan terjemahan empty state ID/EN |
| frontend/scripts/uji-grid-guru.mjs | Uji render awal delapan guru dan fixture 0/1/7/8/9 untuk kedua bahasa |
| frontend/scripts/uji-guru-grid-browser.mjs | QA browser seluruh data, breakpoint, pagination, fixture sisa data, keyboard, resize, dan interpolasi pill |
| docs/qa-guru-grid.md | Laporan implementasi, bukti, batas validasi, serta perintah handoff |

Tidak menambah dependency. Props teachers pada GuruGrid digunakan fixture untuk memeriksa dataset kecil dengan data asli.

## Cuplikan utama

Breakpoint dan ukuran kelompok:

```jsx
const getPageSize = () => {
  if (typeof window === 'undefined') return 8;
  if (window.matchMedia('(min-width: 75rem)').matches) return 8;
  return window.matchMedia('(min-width: 48rem)').matches ? 4 : 2;
};
```

Kelas grid dan pill yang digunakan:

```jsx
grid auto-rows-fr grid-cols-1 gap-y-8
md:grid-cols-2 md:gap-x-8
min-[75rem]:grid-cols-4 min-[75rem]:gap-x-14

pointer-events-none absolute left-1 top-1/2 z-10 h-3 w-6
rounded-full bg-primary transition-transform duration-300
ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none
```

Kontrol batas halaman:

```jsx
disabled={page === 0}
onClick={() => goToPage(page - 1)}
aria-controls="guru-grid"

disabled={page === pageCount - 1}
onClick={() => goToPage(page + 1)}
aria-controls="guru-grid"
```

Tombol menggunakan label i18n, aria-current pada dot aktif, focus-visible, dan live region nomor halaman. Kartu mempertahankan tautan profil serta label aksesibilitasnya.

## Hasil validasi

| Skenario | Hasil yang diverifikasi |
| --- | --- |
| Desktop 1440 dan 1200 px, ID/EN | 8 kartu, 4 kolom, 2 baris; seluruh 5 halaman lolos |
| Tablet 1199 dan 768 px, ID/EN | 4 kartu, 2 kolom, 2 baris; seluruh 10 halaman lolos |
| Mobile 767, 375, dan 320 px, ID/EN | 2 kartu, 1 kolom, 2 baris; seluruh 20 halaman lolos |
| Urutan seluruh dataset | Setiap konfigurasi menampilkan persis 40 nama sesuai urutan; 40 nama unik tanpa kehilangan/duplikasi |
| Overflow dan tinggi | Tidak ada horizontal overflow; tinggi kartu setara dan selisih tinggi grid antarhalaman 0 px pada seluruh 14 konfigurasi |
| Foto | Semua foto pada seluruh halaman berhasil decode di browser; komponen crop lama tetap digunakan |
| Previous/Next | Halaman berubah benar; tombol pertama/terakhir disabled sesuai batas; tidak wrap |
| Dot | Klik dot menampilkan kelompok yang sesuai; tepat satu aria-current; pusat pill sesuai pusat dot aktif |
| Keyboard | Previous bekerja dengan Enter; dot bisa difokuskan dan diaktifkan dengan Space |
| Fixture 0/1/7/8 guru | Empty state untuk 0; satu halaman tanpa pagination untuk 1/7/8 |
| Fixture 9/15 guru | Halaman kedua berisi 1/7 guru asli, tanpa duplikasi atau placeholder; tinggi grid tetap |
| Resize saat halaman 3 desktop | Kelompok baru tetap memuat guru yang sebelumnya berada pada awal kelompok, pada 375/768/1200 px |
| Animasi pill | Elemen tidak remount; sampel transform meningkat menuju 32 px tanpa overshoot; durasi computed 0.3s |
| Reduced motion | Durasi computed ≤1 ms; CSS global existing menetapkan 0.01 ms untuk reduced motion |
| Runtime JavaScript | Tidak ada pageerror selama suite browser |
| Pemeriksaan visual | Screenshot desktop 1440 ID, tablet 768 ID, mobile 375 EN diperiksa: frame/foto/teks tetap tertata, pagination di bawah seluruh grid |
| Lint | npm.cmd run lint: berhasil, exit 0 |
| Production build | npm.cmd run build: berhasil, exit 0; 2306 modules; Vite memberi informasi waktu plugin asset/CSS |
| Uji render | node scripts/uji-grid-guru.mjs: berhasil, exit 0, baseline desktop dan 10 fixture bahasa |
| Uji browser | node scripts/uji-guru-grid-browser.mjs: berhasil, exit 0, 14 konfigurasi dan seluruh edge checks |
| Uji bahasa existing | npm.cmd run bahasa:uji: berhasil |
| git diff --check | Berhasil |
| TypeScript check | Tidak tersedia: proyek JS/JSX tanpa tsconfig atau script typecheck |
| Tes aksen existing | node scripts/uji-arah-aksen.mjs gagal pada assertion matriks Footer node 90:508; Footer.jsx, index.css, dan script tersebut tidak diubah, diverifikasi melalui git diff |

Review kode terpisah tidak menemukan masalah yang memblokir caller produksi dengan dataset statis saat ini.

## Bukti visual dan data pengujian

- [Desktop 1440 ID](D:/LombaTelkom/qa-output/guru-grid-2026-10-12/section-1440-id.png)
- [Tablet 768 ID](D:/LombaTelkom/qa-output/guru-grid-2026-10-12/section-768-id.png)
- [Mobile 375 EN](D:/LombaTelkom/qa-output/guru-grid-2026-10-12/section-375-en.png)
- [Hasil pengukuran dan sampel transform](D:/LombaTelkom/qa-output/guru-grid-2026-10-12/results.json)

Jalankan lint/build/uji render dari D:/LombaTelkom/smk-telkom-purwokerto/frontend. Suite browser membutuhkan Chrome, Playwright yang tersedia di mesin QA, dan production preview pada 127.0.0.1:4173. Tidak menambahkan Playwright ke package proyek.

```powershell
$env:PLAYWRIGHT_MODULE='file:///C:/Users/IDEAPAD%20SLIM%203/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'
$env:QA_OUTPUT='D:/LombaTelkom/qa-output/guru-grid-2026-10-12'
node scripts/uji-guru-grid-browser.mjs
```

## Batas pemeriksaan

Visual diperiksa terhadap screenshot pengguna dan komponen/desain existing; tidak membuka atau mengukur node Figma langsung pada pekerjaan ini. Browser memakai emulasi viewport Chrome desktop, bukan perangkat fisik atau Safari. Request REST eksternal di-stub kosong agar QA fokus pada dataset guru lokal; integrasi backend tidak diuji.

Belum deploy, commit, atau push. Situs Vercel belum berubah oleh pekerjaan ini. Deskripsi baru yang lebih panjang perlu pemeriksaan tinggi ulang. Caller saat ini statis dan client rendered; perubahan dataset dinamis tanpa unmount serta hydration SSR mobile belum menjadi fitur dan belum divalidasi. Resize yang menghilangkan dot dari jendela dapat menghilangkan fokus dot tersebut; klik dot biasa mempertahankan fokus.

## Handoff Git

Branch diperiksa: feat/fasilitas-sekolah. Remote origin diperiksa: https://github.com/KiandrAHD/smk-telkom-purwokerto.git. Jalankan sendiri jika hasil sudah sesuai:

```powershell
Set-Location 'D:/LombaTelkom/smk-telkom-purwokerto'
git add -- frontend/src/pages/GuruPage.jsx frontend/src/data/translationsSchool.js frontend/scripts/uji-grid-guru.mjs frontend/scripts/uji-guru-grid-browser.mjs docs/qa-guru-grid.md
git commit -m "Improve teacher grid and finite sliding pagination"
git push origin feat/fasilitas-sekolah
```
