Fasilitas Sekolah — pembaruan 14 Oktober 2026

Referensi: frame FASILITAS SEKOLAH NEW (242:499), page Telkom remake again, file ca2iX76GpJSr0QC7Qyv9RV.

Perubahan:
- Katalog Semua memiliki 24 kartu dalam urutan Laboratorium, Ruang Kelas, Perpustakaan, Aula, GOR, Parkiran.
- Judul tengah, filter pill merah/putih, ukuran filter, spacing, tipografi Poppins/Plus Jakarta Sans, radius 20 px, dan panel kartu yang bertumpuk mengikuti frame.
- Filter Kelas tetap memiliki empat kelompok gedung. C 2.3 menjadi C 2.1; C 3.3 menjadi C 3.1.
- Label peta yang ditandai menjadi Gedung D dan membuka kelas gedung D. Foto RPS Selatan/Utara tersedia di detail peta dan filter Laboratorium.
- Foto kartu memakai cover; modal memakai rasio 4:3 untuk mempertahankan komposisi asli. Galeri tetap mendukung thumbnail, Escape, dan pengembalian fokus.
- Menggunakan foto ZIP serta tiga JPEG RPS dan P1250087.JPG yang diberikan kemudian. Tidak memakai foto eksternal atau ilustrasi pengisi slot.
- Frame referensi hanya menyediakan desktop. Breakpoint proyek dipertahankan: satu kolom di bawah 640 px, dua kolom mulai 640 px, empat kolom mulai 1024 px.

Aset yang belum lengkap:
- C 2.1 memakai dokumentasi C 2.2; D 2.2 memakai D 2.1; Lab RPL memakai Lab TKJ. Sumber pengisi slot disebutkan pada modal dan detail kelas.
- Arah empat foto Parkiran belum dapat dipastikan dari nama file; detailnya mencantumkan catatan tersebut.
- Foto RPS Utara berukuran 588 × 393 px; versi WebP tidak diperbesar secara buatan.

Verifikasi:
- npm.cmd run lint dan npm.cmd run build.
- node scripts/uji-fasilitas-layout.mjs dan node scripts/uji-fasilitas-reference.mjs.
- node scripts/uji-foto-kelas.mjs: dimensi/provenance 91 foto kelas lama dan 53 foto fasilitas tambahan, dilanjutkan browser QA.
- Browser QA: tujuh filter pada 1847, 1440, 1024, 768, 390, dan 320 px, masing-masing ID/EN; foto cover, URL kategori, overflow, 46 detail/galeri, Escape/fokus, tujuan Gedung D, serta foto RPS Selatan/Utara di peta. Semua lolos.
- 140 hash foto sumber cocok dengan ZIP terbaru yang diberikan. Empat sumber lainnya adalah lampiran RPS dan foto Robotik.
- Bukti lokal: D:/LombaTelkom/qa-output/fasilitas-layout-2026-10-14.

Perintah Git berikut hanya memasukkan perubahan tugas ini. Belum dijalankan; branch saat pemeriksaan adalah feat/fasilitas-sekolah, remote origin adalah KiandrAHD/smk-telkom-purwokerto.

```powershell
Set-Location 'D:\LombaTelkom\smk-telkom-purwokerto'
git add -- frontend/src/pages/FasilitasPage.jsx frontend/src/pages/FasilitasPage.css frontend/src/data/fasilitasPageData.js frontend/src/data/facilityPhotoCovers.js frontend/src/data/campusData.js frontend/src/data/translationsFasilitas.js frontend/src/components/fasilitas/CampusPreview.jsx frontend/src/assets/fasilitas/dokumentasi frontend/docs/fasilitas-photo-sources.json frontend/docs/fasilitas-layout.md frontend/scripts/uji-fasilitas-layout.mjs frontend/scripts/uji-fasilitas-layout-browser.mjs frontend/scripts/uji-fasilitas-reference.mjs frontend/scripts/uji-foto-kelas.mjs frontend/scripts/uji-halaman-fasilitas.mjs frontend/scripts/uji-fasilitas-design.mjs frontend/scripts/uji-fasilitas-refinement-browser.mjs
git commit -m "Sesuaikan layout dan foto fasilitas sekolah dengan Figma"
git push origin feat/fasilitas-sekolah
```

Perbaikan galeri detail peta:
- Semua 12 titik peta kini memiliki foto, termasuk GOR, Parkiran, DLG, Perpustakaan, Aula, dan Lapangan Apel.
- Foto Lapangan Apel berasal dari 8 foto folder Lapangan Upacara dalam ZIP; seluruh hash cocok dengan ZIP yang diberikan. Dibuat 32 varian WebP tanpa mengubah file asli.
- Browser QA foto peta lolos pada 1440, 1018, dan 390 px dalam ID/EN: 16 pilihan kelas dan 43 foto galeri nonkelas per skenario, tanpa placeholder kosong, error gambar, atau overflow.
- Bukti: D:/LombaTelkom/qa-output/campus-photos-2026-10-14/results.json dan screenshot GOR, DLG, Parkiran, Aula, Perpustakaan, Lapangan Apel.

Perintah Git khusus perbaikan galeri peta (belum dijalankan):

```powershell
Set-Location 'D:\LombaTelkom\smk-telkom-purwokerto'
git add -- frontend/src/data/campusData.js frontend/src/data/campusFieldPhotos.js frontend/src/assets/fasilitas/dokumentasi frontend/docs/campus-field-photo-sources.json frontend/docs/fasilitas-layout.md frontend/scripts/uji-fasilitas-layout.mjs frontend/scripts/uji-campus-photos-browser.mjs frontend/scripts/uji-campus-explorer.mjs frontend/scripts/uji-campus-explorer-browser.mjs
git commit -m "Lengkapi foto galeri pada semua titik peta fasilitas"
git push origin feat/fasilitas-sekolah
```
