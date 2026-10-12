# Audit breadcrumb halaman publik — 12 Oktober 2026

Permintaan ini mengenai jejak halaman di dalam hero, bukan ikon dropdown navbar. Implementasi memakai kembali HeroBreadcrumb, ChevronRight lucide-react, warna/typography/spacing existing, dan sistem ID/EN.

| Route | Sebelum | Setelah |
| --- | --- | --- |
| /fasilitas | Belum ada | Tentang > Fasilitas Sekolah |
| /berita | Belum ada | Informasi > Berita |
| /pengumuman | Belum ada | Informasi > Pengumuman |
| /ekstrakurikuler | Tentang > Ekstrakurikuler | Sudah sesuai, dipertahankan |
| /profil-sekolah/guru | Tentang > Profil Guru | Sudah sesuai, dipertahankan |
| /profil-sekolah | Tentang > Profil Sekolah, induk menuju URL yang sama | Hierarki dipertahankan; induk menjadi teks, tanpa self-link |
| / | Tentang > Beranda | Dihapus karena Beranda bukan anak Tentang |

Tentang pada Fasilitas/Guru/Ekstrakurikuler tetap merupakan tautan menuju /profil-sekolah. Informasi adalah grup navbar tanpa halaman indeks /informasi; ditampilkan sebagai teks, tanpa membuat URL palsu. Item terakhir memakai aria-current=page, separator dekoratif disembunyikan dari pembaca layar, teks bisa wrap.

Audit source menunjukkan Jurusan, Prestasi, dan BKK merupakan menu tingkat utama tanpa grup dropdown induk; tidak diberi breadcrumb Tentang/Informasi yang keliru. DetailLayout existing menggunakan Beranda > kategori > judul, dengan backTo yang diberikan oleh halaman pemanggil. Halaman detail berita/pengumuman/prestasi/jurusan dan detail pelengkap memakai komponen tersebut. Sampel detail /jurusan/rpl diuji browser; detail lainnya diperiksa pada source, bukan seluruh data production. Breadcrumb dashboard terpisah dan tidak diubah.

## File berubah

- frontend/src/components/HeroBreadcrumb.jsx: mendukung induk teks tanpa link jika parentTo null.
- frontend/src/pages/FasilitasPage.jsx: menambahkan breadcrumb hero.
- frontend/src/components/berita/BeritaHeroSection.jsx: menambahkan Informasi > Berita.
- frontend/src/components/pengumuman/PengumumanHeroSection.jsx: menambahkan Informasi > Pengumuman.
- frontend/src/components/tentang/TentangHeroSection.jsx: menghapus self-link induk.
- frontend/src/components/HeroSection.jsx: menghapus Tentang > Beranda yang salah.
- docs/qa-breadcrumb.md: laporan ini.

## Validasi

- npm.cmd run lint dan npm.cmd run build: lulus, exit 0.
- node scripts/uji-footer-fasilitas.mjs: lulus ID/EN; footer dan terjemahan fasilitas tetap sesuai.
- npm.cmd run bahasa:uji: lulus.
- Browser production preview 127.0.0.1:4173: 32 kombinasi route/bahasa/viewport lulus, terdiri dari enam submenu + Beranda + detail Jurusan, masing-masing ID/EN pada 1440 dan 375 px.
- Hierarki, jumlah breadcrumb tepat satu, satu aria-current=page, separator ChevronRight, href induk, parent navigation/Back, dan tidak ada overflow/exception JavaScript: lulus pada skenario yang diperiksa.
- Screenshot Fasilitas desktop diperiksa; screenshot Berita/Pengumuman dan mobile tersedia pada D:/LombaTelkom/qa-output/breadcrumb-{route}-{width}.png.
- Request konten publik dimock array kosong agar pengujian fokus pada hero/breadcrumb; ini bukan pengujian API production.
- git diff --check: lulus. Tidak ada perubahan navbar, footer, token global, data route, atau dependency.

## Git handoff

Branch: feat/fasilitas-sekolah. Origin: https://github.com/KiandrAHD/smk-telkom-purwokerto.git. Belum commit/push/deploy.

Jalankan dari D:/LombaTelkom/smk-telkom-purwokerto:

```powershell
git add frontend/src/components/HeroBreadcrumb.jsx frontend/src/pages/FasilitasPage.jsx frontend/src/components/berita/BeritaHeroSection.jsx frontend/src/components/pengumuman/PengumumanHeroSection.jsx frontend/src/components/tentang/TentangHeroSection.jsx frontend/src/components/HeroSection.jsx docs/qa-breadcrumb.md
git commit -m "fix: complete public page breadcrumbs"
git push origin feat/fasilitas-sekolah
```
