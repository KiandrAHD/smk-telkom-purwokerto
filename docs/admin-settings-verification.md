Pengaturan Admin — implementasi dan verifikasi, 2 November 2026

Penyebab awal: PengaturanPage hanya menampilkan konfigurasi/dummy data dan identitas sesi secara readonly. Belum ada tabel pengaturan, service update, atau alur konfirmasi penyimpanan.

Integrasi:

- Profil dan pengaturan umum disimpan pada singleton public.site_settings. RLS memakai public.is_admin() existing; anon hanya SELECT dan authenticated hanya UPDATE kolom yang diizinkan jika tercatat sebagai admin. INSERT/DELETE dan perubahan revision langsung tidak diizinkan.
- CHECK constraints memvalidasi NPSN, kontak, URL, tahun ajaran dan angka. Trigger menaikkan revision; update memakai revision awal untuk mendeteksi konflik. Setelah update, service membaca ulang database dan membandingkan hasil sebelum memberi notifikasi sukses.
- Nama akun memakai Supabase Auth user_metadata.full_name. Email memakai auth.updateUser, mengikuti konfirmasi Supabase; role tidak dikirim atau diedit. Callback Auth dijalankan di luar callback sinkron agar query pemeriksaan admin tidak menunggu lock Auth yang sama.
- Logo memakai bucket content-images dan validasi unggahan existing. Konfirmasi dilakukan sebelum upload/update. Logo sekarang memakai berkas logo sekolah existing yang diunggah melalui form, bukan gambar baru.
- Modal memuat nilai sebelum/sesudah. Tombol dikunci selama save. Draf dilindungi saat klik link, back, refresh, pencarian header dan logout; perubahan tab pengaturan tetap menyimpan draf masing-masing.
- Provider publik membaca pengaturan pada awal buka, sesudah simpan, antar-tab, saat fokus dan berkala. Binding meliputi logo navbar/footer, identitas/kontak/website footer, jumlah berita, tahun ajaran dan status SPMB. Penutupan SPMB juga dijaga trigger INSERT ppdb di database.

Migration 014_site_settings.sql dan 015_settings_url_validation.sql sudah diterapkan melalui SQL Editor pada proyek jxrcbkseudollokdtfxy. Keduanya juga tercatat pada supabase_migrations.schema_migrations, sehingga tidak perlu dijalankan ulang pada proyek tersebut.

Hasil pengujian:

| Pemeriksaan | Hasil dan batas bukti |
| --- | --- |
| Simpan pengaturan umum dari form | 5 → 6 berhasil dikonfirmasi/disimpan dan tetap 6 sesudah refresh; akhirnya dipulihkan menjadi 5. |
| Integrasi publik antar-tab | Halaman Berita berubah menjadi “Menampilkan 6 dari 13 berita” tanpa ubah source; kembali 5 setelah pemulihan. |
| Profil/logo | File logo existing berhasil diunggah ke Supabase Storage melalui form, URL tersimpan, gambar dimuat pada preview dan halaman publik. HTTP fetch gambar berhasil 200 image/png. |
| Akun | Nama “Admin SMK Telkom Purwokerto” sesuai pilihan pengguna disimpan, dibaca ulang dari Auth dan tampil pada header. |
| Refresh dan login ulang | Pengguna login, logout melalui UI, lalu login ulang; nama, logo dan pengaturan tetap terbaca. |
| Konfirmasi/validasi | Batal tidak menyimpan. NPSN “abc” ditolak sebelum konfirmasi. Loading mengunci tombol selama request. |
| RLS hosted | Anon REST UPDATE ditolak; revision tidak berubah. SQL dengan role authenticated dan sub non-admin menghasilkan nol update, diperiksa dengan assertion dan rollback. Ini pengujian RLS database, bukan login browser akun siswa. |
| SQL lokal nyata | PGlite/PostgreSQL menguji admin write/readback, buka ulang database di disk, anon/non-admin, constraints, revision basi dan pendaftaran saat ditutup. Tidak menggantikan pengujian Auth/Storage hosted. |
| Service error handling | Boundary test menguji network rejection, konflik, payload allowlist, readback mismatch dan email pending. Kegagalan jaringan ini disimulasikan, bukan memutus koneksi produksi. |
| Navigation guard | Boundary test menguji pembatalan link dan navigasi programatis, busy lock, serta cleanup. Uji logout dengan draf di browser tetap berada pada form. |
| Responsif | Lebar 390, 768 dan 1440; tidak ada horizontal overflow, field tetap dalam viewport. Override viewport sudah dipulihkan. |
| Pemeriksaan kode | Lint, typecheck, production build (146 route prerender), test settings/service/navigation, serta seluruh ppdb:uji lulus. Review kode akhir tidak menemukan bug penting tambahan. |

Perintah reproduksi dari frontend:

```powershell
npm run lint
npm run typecheck
npm run build
npm run ppdb:uji
node scripts/uji-admin-settings.mjs
node scripts/uji-site-settings-service.mjs
node scripts/uji-settings-navigation.mjs
node scripts/uji-site-settings-hosted.mjs
# Untuk SQL lokal, set PGLITE_MODULE ke instalasi @electric-sql/pglite/dist/index.js:
node scripts/uji-site-settings-db.mjs
```

Berkas yang diubah/ditambahkan, relatif terhadap repository:

```text
supabase/migrations/014_site_settings.sql
supabase/migrations/015_settings_url_validation.sql
frontend/src/utils/siteSettings.js
frontend/src/services/siteSettingsService.js
frontend/src/services/ppdbService.js
frontend/src/context/AuthContext.jsx
frontend/src/context/SiteSettingsContext.jsx
frontend/src/hooks/useUnsavedSettings.js
frontend/src/pages/dashboard/PengaturanPage.jsx
frontend/src/pages/SpmbPage.jsx
frontend/src/components/dashboard/DashboardHeader.jsx
frontend/src/components/Footer.jsx
frontend/src/components/Logo.jsx
frontend/src/components/Navbar.jsx
frontend/src/components/berita/BeritaKategoriSection.jsx
frontend/src/components/ppdb/PpdbAuthLayout.jsx
frontend/src/main.jsx
frontend/scripts/uji-admin-settings.mjs
frontend/scripts/uji-ppdb-service.mjs
frontend/scripts/uji-site-settings-db.mjs
frontend/scripts/uji-site-settings-service.mjs
frontend/scripts/uji-site-settings-hosted.mjs
frontend/scripts/uji-settings-navigation.mjs
docs/admin-settings-verification.md
```

Batas verifikasi: alamat email admin dipertahankan. Pengiriman dan penyelesaian konfirmasi email baru belum diuji dengan perubahan alamat nyata. Tidak ada role/keanggotaan admin yang diubah. Frontend teruji dari localhost terhadap Supabase hosted; kode frontend pada branch ini belum di-merge atau dideploy ke produksi.

Bukti visual lokal: D:/LombaTelkom/outputs/admin-settings-2026-11-02/account-readback.png. Log build: outputs/admin-settings-build.log. Nilai akhir database: tahun ajaran 2027/2028, SPMB dibuka, berita per halaman 5, revision 6.
