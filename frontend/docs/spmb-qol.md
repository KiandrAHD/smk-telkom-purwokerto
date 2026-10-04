# Perbaikan alur SPMB

Implementasi React, React Router, dan Tailwind; menggunakan layanan Supabase yang sudah ada. Tidak ada dependensi baru atau perubahan skema database.

## Alur pengguna

1. Buat akun dengan email aktif, sandi, dan konfirmasi sandi. Checklist persiapan tersedia sebelum mendaftar. Biodata dilengkapi setelah verifikasi email.
2. Lengkapi biodata dan 25 nilai dari lima mata pelajaran, semester 1–5. Di ponsel, pilih semester; di desktop, gunakan tabel. Bahasa tampilan tidak mengubah nilai pilihan atau key yang dikirim ke backend.
3. Draft disimpan ke akun setelah pengguna berhenti mengedit selama satu detik. Status, waktu penyimpanan, dan tombol coba lagi tersedia. Penyimpanan dilakukan berurutan agar draft lama tidak menimpa perubahan baru; identitas akun diperiksa sebelum menyimpan/mengirim.
4. Pilih satu PDF gabungan, maksimal 10 MB. Checklist berasal dari ketentuan yang sudah ada. Preview PDF memakai blob URL lokal yang dilepas saat file diganti atau komponen ditutup.
5. Klik Periksa Pendaftaran. Ringkasan menampilkan biodata, jurusan, semua nilai, nama dan ukuran PDF. Tautan pengeditan tersedia. Tombol kirim aktif setelah pengguna mengonfirmasi data.
6. Setelah terkirim, salin nomor registrasi, lihat status/catatan panitia, atau buka kartu peserta. Kartu mengambil data pendaftaran terkirim; tetap lengkap setelah refresh. Cetak Kartu membuka dialog cetak browser; pilih Save as PDF untuk menyimpan PDF.

## Jadwal dan berkas resmi

Jadwal seleksi dan PDF panduan SPMB 2027/2028 belum diberikan oleh panitia. Halaman dokumen menampilkan Belum tersedia, dengan tombol nonaktif. Jadwal Juli 2026 dihapus dari data tahapan agar tidak terlihat sebagai jadwal aktif. Pengingat kalender ditunda sampai tanggal resmi tersedia.

Ketika materi resmi diterima, tambahkan URL PDF yang benar dan jadwal yang telah disetujui panitia; jangan mengaktifkan tombol dengan placeholder.

## Penyimpanan dan batasan

- Biodata dan nilai tersimpan di tabel draft milik akun. Sandi dan data pribadi tidak disimpan ke localStorage.
- PDF belum diunggah sebelum finalisasi. Setelah refresh sebelum kirim, pengguna harus memilihnya kembali. Keterangan dan peringatan meninggalkan halaman disediakan.
- Unggah per dokumen tidak diaktifkan karena aturan saat ini mensyaratkan satu PDF gabungan.
- Pemeriksaan jenis/ukuran file tidak membuktikan kelengkapan isi dokumen; panitia tetap melakukan verifikasi.

## Pengujian

Jalankan dari folder frontend:

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd run ppdb:uji
npm.cmd run spmb:qol
npm.cmd run bahasa:uji
node scripts/uji-spmb.mjs
node scripts/uji-ppdb-contract.mjs
npm.cmd run performa:uji
```

Untuk UI dengan backend simulasi yang terpisah dari Supabase:

```powershell
npm.cmd run spmb:qa
```

Buka http://127.0.0.1:5175/spmb/formulir. Server ini hanya mendengarkan localhost, menggunakan data contoh di memori, dan menghapus data ketika proses berhenti. Tidak membuat akun atau mengirim data ke sekolah. Toolbar QA menyediakan PDF contoh valid, PDF 11 MB, file non-PDF, dan simulasi kegagalan penyimpanan. Komponen QA hanya diimpor oleh entry pengujian, tidak oleh aplikasi produksi. Reload halaman setelah mengubah kode karena HMR dinonaktifkan pada server QA.

Perilaku yang diperiksa melalui browser: fokus error sekolah asal, nilai nol, semester mobile, bahasa ID/EN, kegagalan/retry autosave, pemulihan draft setelah refresh, validasi PDF, review dan konfirmasi, pengeditan tanpa kehilangan PDF, pengiriman simulasi, salin nomor, kartu setelah refresh, serta CSS cetak yang hanya memuat kartu. Lebar mobile 390 px tidak menghasilkan overflow halaman.

Pemilih file asli belum diuji sampai selesai karena ekstensi Chrome belum memiliki izin akses URL file. Pengujian file memakai toolbar QA melalui event input file aplikasi. Pengiriman nyata, email verifikasi, RLS dan persistensi Supabase produksi belum diuji; tes kontrak SQL dan service memakai simulasi. Dialog printer/driver fisik tidak diuji; tampilan media cetak diverifikasi melalui browser.
