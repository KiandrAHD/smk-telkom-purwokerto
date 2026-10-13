# Standarisasi hero publik

Sebelas hero mengikuti `src/styles/hero.css`, dimuat oleh MainLayout. Navbar, footer, font global, teks utama, CTA, gambar sumber, data statistik dan fungsi halaman dipertahankan.

## Audit dan dimensi

Ukuran dalam px, diukur pada viewport 1440 px. Lebar panel seluruh halaman 1216 px, yaitu container 1280 px dikurangi padding kiri/kanan 32 px.

| Halaman | Tinggi sebelum | Tinggi sesudah | Radius sebelum → sesudah |
| --- | ---: | ---: | --- |
| Beranda `/` | 463,5 | 464 | 32 → 32 |
| Jurusan | 370,6 | 464 | 32 → 32 |
| Prestasi | 511,6 | 464 | 32 → 32 |
| BKK | 427,4 | 464 | 32 → 32 |
| Pengumuman | 429,0 | 464 | 32 → 32 |
| Berita | 511,6 | 464 | 32 → 32 |
| Profil Sekolah | 408 | 464 | 20 → 32 |
| Profil Guru | 424 | 464 | 32 → 32 |
| Ekstrakurikuler | 430,4 | 464 | 32 → 32 |
| Fasilitas | 472,1 | 464 | 32 → 32 |
| Kalender | 472,1 | 464 | 32 → 32 |

Perbedaan sebelumnya berasal dari rasio/tinggi intrinsik aset, grid 34/38/40 persen, padding per halaman, serta tinggi/aspect ratio lokal. Aturan layout tersebut kini dipusatkan; utility lama yang bertentangan dihapus dari markup hero.

## Standar

- Container maksimum 80rem; padding horizontal 1rem / 1,5rem / 2rem pada breakpoint existing 0 / 40rem / 64rem.
- Jarak navbar ke panel 1rem; border 1px dengan primary opacity 30%; radius 2rem.
- Desktop mulai 64rem: tinggi minimum 34rem (544px). Mulai 80rem: 29rem (464px), mendekati tinggi Beranda sebelumnya. Menggunakan min-height agar konten tetap dapat tumbuh pada pengaturan font pengguna.
- Di bawah 64rem: tinggi berdasarkan konten, teks di atas gambar. Judul panjang dapat membungkus; tidak dipotong oleh overflow.
- Grid desktop 38:62 dengan gap 1rem; area gambar memiliki tinggi seragam dan radius 1,75rem. Gambar memakai cover/center tanpa stretching; crop hasilnya diperiksa secara visual.
- Hero dengan latar komposit (Profil Sekolah/Fasilitas/Kalender) mempertahankan overlay, mask, dan crop sumber. Kolom teks 40 persen, inset teks sejajar dengan hero grid. Variasi ini mempertahankan identitas aset dan bukan perubahan dimensi panel.
- Floating cards tetap di luar panel dalam alur dokumen, overlap 2,5rem, center. Statistik empat kartu memakai lebar panel dikurangi 10rem di desktop; QAC tiga kartu memakai 70,53 persen seperti Beranda. Di tablet lebar 92 persen; mobile lebar panel dikurangi 2rem.
- Statistik: 4 kolom desktop, 2 tablet, 1 mobile; ikon 40px, gap 12px, padding 20px/24px. Divider mengikuti susunan kolom/baris. QAC mempertahankan tinggi adaptif karena memuat deskripsi dan tautan tambahan.
- Tinggi kartu tidak dipaksa sama antara statistik dan QAC; keterbacaan diprioritaskan. Tidak menambahkan floating cards pada halaman yang sebelumnya tidak memilikinya.

## Catatan yang dihapus

Sesuai tiga browser comments pengguna: banner contoh Figma di atas kalender, catatan rekap statistik Prestasi, dan catatan rekap Pengumuman. Penghapusan ini tidak mengubah data. Agenda kalender masih contoh Figma; detail tetap berlabel contoh.

## File

| File | Perubahan |
| --- | --- |
| `src/styles/hero.css` | Aturan dan variabel layout hero/floating cards terpusat |
| `src/layouts/MainLayout.jsx` | Import stylesheet khusus hero |
| `src/components/HeroSection.jsx` | Beranda menggunakan shared classes, konten QAC dipertahankan |
| `src/components/HeroStatsBar.jsx` | Shared floating stats |
| `src/components/jurusan/JurusanHeroSection.jsx` | Hero Jurusan |
| `src/components/prestasi/PrestasiHeroSection.jsx` | Hero Prestasi dan penghapusan catatan |
| `src/components/bkk/BkkHeroSection.jsx` | Hero BKK |
| `src/components/pengumuman/PengumumanHeroSection.jsx` | Hero Pengumuman dan penghapusan catatan |
| `src/components/berita/BeritaHeroSection.jsx` | Hero Berita; ticker tetap bekerja |
| `src/components/tentang/TentangHeroSection.jsx` | Panel dan overlay Profil Sekolah |
| `src/components/tentang/TentangStatsSection.jsx` | Statistik Profil Sekolah, count-up dipertahankan |
| `src/pages/GuruPage.jsx` | Hero Profil Guru; grid/pagination guru dipertahankan |
| `src/pages/EkstrakurikulerPage.jsx` | Hero dan search/stats, tanpa perubahan filter |
| `src/pages/FasilitasPage.jsx` | Panel hero dan overlay; filter/modal dipertahankan |
| `src/pages/KalenderPage.jsx` | Dimensi hero; mask ilustrasi dipertahankan |
| `src/components/kalender/CalendarBoard.jsx` | Banner contoh dihapus (sudah termasuk commit kalender pengguna saat pekerjaan berjalan) |
| `scripts/uji-hero-konsistensi.mjs` | QA geometri, gambar, wrapping, catatan, ID/EN dan screenshot |
| `scripts/uji-floating-hero.mjs` | Selector shared class dan ekspektasi overlap 40px |
| `docs/halaman-kalender.md` | Mencatat perubahan banner |
| `docs/standar-hero.md` | Laporan audit ini |

## Validasi

`uji-hero-konsistensi.mjs`: 11 halaman × 7 viewport (1920, 1440, 1280, 1024, 768, 375, 320) × ID/EN = 154 checks. Memeriksa ukuran panel, radius, border, jarak navbar, overflow, gambar rusak, clipping kontrol, isi kartu, overlap dan centering. Screenshot desktop/tablet/mobile tersimpan pada `D:/LombaTelkom/qa-output/hero-consistency-2026-10-13`.

Hasil 13 Oktober 2026: 154 checks berhasil. Pengujian tambahan berhasil: 70 checks floating hero, kalender interaktif (12 kombinasi viewport/bahasa dan keyboard/detail/navigasi), tiga akses cepat, tes bahasa (81 rendered views), ESLint, production build, dan diff-check. Proyek memakai JS/JSX tanpa script TypeScript/typecheck. Tidak ditemukan overflow, kontrol tertutup, gambar rusak, atau runtime error pada matriks tersebut.

## Pengecualian

Halaman detail artikel/guru/jurusan, daftar galeri/koleksi, FAQ/panduan, kebijakan, form SPMB/admin, STELA dan NextTel memiliki heading atau antarmuka aplikasi tersendiri, bukan panel hero promosi sejenis. Mengubahnya menjadi hero tinggi 464px akan menjadi redesign di luar scope. Tidak ada keputusan yang perlu menghalangi implementasi sebelas hero ini.

Belum dilakukan deploy atau pengujian pada perangkat fisik. Referensi visual berasal dari screenshot pengguna serta baseline Beranda/Jurusan lokal; laporan ini tidak mengklaim pixel-perfect untuk setiap frame Figma.
