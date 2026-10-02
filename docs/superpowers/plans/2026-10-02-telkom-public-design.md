# Rencana dan hasil implementasi desain publik Telkom

Tanggal: 2 Oktober 2026. Branch: feat/telkom-public-design, dibuat dari feat/telkom-animations.

Revisi lanjutan sesuai anotasi pengguna: banner STELA memakai kembali artwork merah ID/EN yang lengkap, termasuk pada Berita; FAQ menyediakan lebar penuh tanpa crop. Terjemahan profil dilengkapi, aksen disusun lurus di gutter, dan Hall of Fame mengambil profil/foto dari Kisah Sukses Alumni. Catatan tahap native STELA di bawah adalah hasil implementasi sebelumnya yang digantikan oleh revisi ini. Pemeriksaan bahasa dan desain diperbarui mengikuti hasil akhir tersebut; lint, build dan kedua pemeriksaan lulus.

## Tujuan dan keputusan

Mengadopsi hierarki Kora, presentasi STELA dari arah Sadewa, serta keterbacaan profil dari ClearPath. Pola tersebut diterapkan pada komponen React yang sudah tersedia; bukan migrasi template Framer.

Asumsi: permintaan implementasi meliputi bagian publik yang dibahas dalam rekomendasi sebelumnya. Konten sekolah, urutan bagian, tautan, aset asli, HeroSection, Navbar, Footer, dashboard, dan perilaku Lenis/GSAP dipertahankan. Tidak menambah dependency, backend, FAQ, testimoni, statistik, maupun klaim sekolah.

## Spesifikasi tampilan

- Container utama max-w-7xl; padding horizontal 16/24/32 px pada base/sm/lg.
- Jarak bagian utama 48/64/80 px pada base/sm/lg.
- Judul utama 28/32/40 px; isi utama 16/18 px; deskripsi kartu 14 px.
- Grid jurusan 1 kolom pada ponsel, 2 pada sm, 4 pada xl. Grid nilai sekolah maksimal 2 kolom.
- Area aksi minimal 44 px; tombol STELA/PPDB minimal 48 px dan memenuhi lebar pada ponsel.
- Teks terjemahan tidak dipotong atau dipaksa ke tinggi tetap.
- Warna merah/putih dan font proyek dipakai kembali. Styling melalui Tailwind.
- Preview video tetap berupa gambar dan tombol play; iframe baru dimuat setelah interaksi.
- Fokus keyboard, reduced motion, Reveal dan kontrol animasi yang sudah ada dipertahankan.

## File yang dikerjakan

Semua lokasi di bawah relatif terhadap D:\LombaTelkom\smk-telkom-purwokerto.

| Lokasi | Perubahan spesifik |
| --- | --- |
| frontend/src/components/AboutSection.jsx | Panel pengenalan, video 16:9, badge ringkas, judul dan isi yang terbaca |
| frontend/src/components/DepartmentsSection.jsx | Skala judul, jarak dan breakpoint grid jurusan |
| frontend/src/components/DepartmentCard.jsx | Judul 18 px, isi 14 px, area link dan fokus keyboard |
| frontend/src/components/AchievementsSection.jsx | Skala judul/isi dan container; carousel serta data tetap |
| frontend/src/components/StelaAISection.jsx | Ganti gambar promosi bertulisan dengan judul, isi dan dua pesan contoh dalam HTML |
| frontend/src/components/CTASection.jsx | Banner PPDB responsif dengan tombol lebar pada ponsel |
| frontend/src/components/tentang/TentangAboutSection.jsx | Panel cerita/video dengan isi 16/18 px |
| frontend/src/components/tentang/TentangVisiMisiSection.jsx | Kartu visi, misi dan nilai dengan grid yang lebih longgar |
| frontend/src/data/translations.js | Label contoh percakapan, identitas asisten, deskripsi STELA dan aksi PPDB Inggris |
| frontend/scripts/uji-desain-publik.mjs | Pemeriksaan SSR untuk konten nyata, terjemahan dan tujuan tautan |

## Tahap 1 — Uji sebelum implementasi

1. Pakai pola Vite middleware dan SSR dari uji-bahasa.mjs.
2. Render STELA dengan LanguageContext dan MemoryRouter dalam ID/EN.
3. Periksa judul HTML, isi lengkap, dua pesan, tautan /stela dan tidak adanya iframe.
4. Pastikan teks tidak lagi hanya sr-only atau disimpan dalam gambar promosi.

Status: selesai. Uji awal gagal pada teks sr-only sesuai masalah awal. Setelah implementasi lulus. Pemeriksaan tambahan memastikan konten STELA Inggris tidak jatuh kembali ke bahasa Indonesia.

## Tahap 2 — Hierarki Beranda

1. Terapkan skala judul dan spacing pada pengenalan, jurusan dan prestasi.
2. Pertahankan badge, foto, dekorasi, ID bagian, carousel dan sumber data.
3. Periksa empat tujuan jurusan: /jurusan/rpl, /jurusan/pg, /jurusan/tkj, /jurusan/tjat.
4. Pastikan kartu tetap menampung judul panjang dan isi lengkap.

Status: selesai. Empat tautan dipertahankan; navigasi RPL diuji langsung. Pada desktop empat kartu memiliki tinggi yang sama tanpa memotong isi.

## Tahap 3 — STELA dalam HTML

1. Pakai panel merah/putih dua kolom pada desktop dan satu kolom pada ponsel.
2. Pakai mascot yang sudah tersedia, judul, deskripsi dan dua pesan dari data asli.
3. Beri label Contoh percakapan agar tidak menyiratkan percakapan langsung.
4. Sediakan satu aksi menuju /stela dan lengkapi label ID/EN.

Status: selesai. Konten Inggris diperiksa langsung di browser. Tombol membuka halaman asisten yang benar; tidak ada input palsu pada preview.

## Tahap 4 — Profil sekolah dan PPDB

1. Perbaiki ukuran isi, padding dan grid pada profil, visi/misi dan nilai.
2. Pertahankan seluruh informasi sekolah dan aksi PPDB.
3. Periksa poster video terisi, ikon play terlihat dan aktivasi melalui Enter.
4. Pastikan iframe berjumlah nol sebelum interaksi dan satu setelah aktivasi.

Status: selesai. Poster lokal berhasil dimuat, tombol keyboard bekerja. Aksi /ppdb mengikuti redirect proyek ke /ppdb/masuk.

## Tahap 5 — Validasi dan review

Jalankan dari D:\LombaTelkom\smk-telkom-purwokerto\frontend:

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd run bahasa:uji
npm.cmd run animasi:uji
node scripts/uji-desain-publik.mjs
```

Status: semua perintah lulus. Build dan lint diulang setelah perbaikan terakhir.

Browser diperiksa pada 390x844, 872x604 dan 1366x900. Tidak ditemukan overflow horizontal pada tampilan yang diperiksa. Konten STELA ID/EN, kartu jurusan, profil video, tautan STELA/RPL/PPDB diperiksa. Emulasi prefers-reduced-motion menunjukkan judul tetap terlihat; preferensi emulasi dan ukuran viewport dipulihkan setelah pengujian. Tidak ditemukan log error pada tab pengujian.

Review independen menemukan kontras teks AboutSection terlalu rendah saat opacity reveal 0.65. Warna isi diubah kembali menjadi dark-900; warna terhitung rgb(17,24,39) di atas rgb(249,250,251) diperiksa di browser.

Bukti tampilan tersimpan di D:\LombaTelkom\outputs: telkom-design-stela-desktop.png, telkom-design-stela-mobile.png dan telkom-design-profile-mobile.png.

Batas validasi: pemeriksaan ini merupakan uji lokal tampilan dan regresi. Tidak mengukur skor Lighthouse baru, tidak mengirim pendaftaran, dan tidak menguji respons backend asisten. Konten/terjemahan lama di luar komponen yang diubah tetap mengikuti implementasi proyek.

## Tahap 6 — Serah terima

Branch sudah dibuat. git diff --check lulus; remote origin dan status diperiksa. File docs/content serta dokumen lain yang sebelumnya belum dilacak tidak dimasukkan ke template staging.

Template Git: D:\LombaTelkom\outputs\git-telkom-public-design.ps1. Template hanya memasukkan sembilan file sumber, satu script pemeriksaan dan dokumen rencana ini. Commit dan push belum dijalankan.

## Penanganan kegagalan

Jika lint/build gagal setelah perubahan berikutnya, perbaiki komponen terkait sebelum publikasi. Jika breakpoint meluber, perbaiki grid atau batas lebar penyebabnya, bukan menyembunyikan teks. Jika label Inggris kembali ke bahasa Indonesia, tambahkan key terjemahan persis dan jalankan kembali pemeriksaan. Jangan mengubah data sekolah/API hanya untuk meluluskan pemeriksaan tampilan.
