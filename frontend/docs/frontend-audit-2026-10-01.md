# Audit frontend SMK Telkom — 1 Oktober 2026

Status keseluruhan: sebagian selesai. Perbaikan frontend yang dapat diverifikasi sudah diterapkan; foto, logo, dan informasi asli yang dijanjikan pengguna masih diperlukan. Hasil belum dinyatakan pixel-perfect terhadap seluruh Figma.

## 1. Lingkup dan keputusan pengguna

- Target pemeriksaan: checkout lokal `D:/LombaTelkom/smk-telkom-purwokerto`, aplikasi Vite di `http://127.0.0.1:5173`.
- Lima logo JHIC akan dikirim kemudian. Bagian Supported by belum ditambahkan supaya tidak memakai logo yang salah.
- Pengujian Gmail dibatalkan; tidak ada perubahan alur autentikasi, pengiriman email, atau database.
- Penerimaan baru menggunakan SPMB 2027/2028. URL `/ppdb`, nama tabel, dan kode error tetap dipertahankan untuk kompatibilitas.
- Foto Voli, Bela Diri, dan Hand Ball/Bola Tangan, serta sumber prestasi/testimoni/riwayat yang belum terbukti akan dikirim pengguna.
- Placeholder prestasi tetap ditampilkan sesuai keputusan pengguna.
- Layout grid dan tampilan flat ekstrakurikuler dipertahankan sesuai keputusan sebelumnya.
- Tidak ada commit, push, atau deployment yang dijalankan.

## 2. Perbaikan berurutan

### 1 — Gambar

Lokasi: `src/data/dummyData.js`, `src/utils/publicContent.js`, `src/components/ContentImage.jsx`, dan pemanggil gambar pada kartu/detail berita, prestasi, serta BKK.

- Web Technologies dan IT Software menggunakan foto praktik pemrograman RPL.
- Galeri empat jurusan diperbaiki: RPL menggunakan kegiatan pemrograman; PG menggunakan VR/3D art; TKJ menggunakan rak jaringan/INC/laboratorium; TJAT menggunakan praktik kabel/menara/laboratorium.
- Foto API kosong tidak lagi diganti dengan foto kegiatan lain. Komponen ContentImage menampilkan keterangan Foto belum tersedia ketika sumber kosong atau gagal dimuat; penggantian src memulai state gambar baru.
- Logo perusahaan kosong tidak lagi menggunakan merek Telkom. Logo gagal dimuat disembunyikan, sedangkan nama perusahaan tetap terlihat.
- Placeholder yang benar-benar disimpan di API tetap dirender. Memperbaiki penanganan gambar tidak membuktikan kebenaran isi fotonya.

Pemeriksaan browser pada sepuluh halaman publik menemukan nol elemen img gagal dimuat setelah gambar selesai didekode. Satu prestasi tidak memiliki URL foto; dua prestasi masih memakai placehold.co. Berita dan BKK masing-masing masih memiliki satu gambar placehold.co. Ketiga foto olahraga yang tidak relevan tetap menunggu foto asli.

### 2 — Footer Supported by

Belum diterapkan. Nama organisasi dan lima berkas logo JHIC belum diterima. Aksen footer yang ada dipertahankan. Pemeriksaan geometri pada lima halaman dan empat viewport tidak menemukan irisan antara kotak aksen footer dan teks/tautan footer yang diperiksa.

### 3 — Prestasi Membanggakan dan halaman detail

Lokasi: `src/components/AchievementsSection.jsx`, `PrestasiCarousel.jsx`, `AchievementCard.jsx`, `src/pages/PrestasiDetailPage.jsx`, `BeritaDetailPage.jsx`, `PengumumanDetailPage.jsx`.

- Beranda memakai layanan prestasi yang sama dengan daftar/detail, menggantikan empat kartu contoh yang sebelumnya tidak konsisten dengan API.
- Judul, slug, deskripsi, dan gambar kartu/detail berasal dari row yang sama.
- Pointer capture baru aktif setelah mouse bergeser lebih dari 5px; klik biasa tetap membuka tautan kartu.
- Jumlah indikator mengikuti jumlah kartu yang muat, termasuk kelompok terakhir yang parsial. Resize memperbarui jumlah indikator dan posisi aktif.
- State detail dimulai ulang per slug. Error dari slug sebelumnya tidak terbawa ke detail berikutnya.
- Kegagalan memuat daftar terkait tidak menggagalkan detail utama.
- Ringkasan tidak diulang sebagai paragraf pertama pada detail prestasi, berita, dan pengumuman. Pengantar yang berbeda dari isi tetap dipertahankan.

Tiga pasangan kartu/detail prestasi diperiksa. Klik kartu berhasil menuju detail. Indikator terakhir bekerja pada 390px dan 768px. Navigasi SPA dari slug invalid ke valid diuji pada ketiga jenis detail, dengan permintaan daftar terkait diblokir sementara; detail utama tetap muncul. Blokir jaringan dibersihkan setelah pengujian.

Kebenaran kompetisi, peserta, juara, dan foto asli belum dapat dinyatakan benar tanpa sumber asli.

### 4 — Informasi yang memiliki sumber resmi

Lokasi utama: `src/data/dummyData.js:367` (aboutStats), `:382` (visiMisi), `:432` (timelineData), `:461` (kepalaSekolah), `src/pages/GuruPage.jsx`, `src/App.jsx`, `index.html`, serta teks portal di `src/pages/ppdb` dan `src/components/ppdb/PpdbPortalLayout.jsx`.

- Tahun berdiri diperbaiki menjadi 1993, dengan tanggal pendirian 30 Januari.
- Profil memakai 1.030 siswa aktif, 57 guru, 59 prestasi nasional/internasional pada 2025, dan 45 ruang kelas/laboratorium. Angka diperiksa dari atribut counter data-to-value situs resmi, bukan nilai awal animasi 0.
- Visi dan misi mengikuti profil resmi. Kalimat visi sekolah menggantikan motto personal yang tidak memiliki sumber pada halaman guru.
- Sambutan kepala sekolah menggunakan kutipan singkat resmi. Versi panjang merupakan ringkasan yang diberi label Ringkasan sambutan; tombol menggunakan Baca Ringkasan.
- Penerimaan baru, CTA, banner, keterangan portal, dan metadata memakai SPMB 2027/2028. Informasi penting tentang pendaftaran memakai DIGITEST 1; tenggat Mei/Juni yang usang tidak lagi dipakai pada banner baru.
- Label BAN–SMK pada badge dihapus. Teks badge Mutu Pendidikan tidak mengarang lembaga akreditasi; contoh BAN-PT di Figma tidak disalin sebagai fakta sekolah.
- Klaim metadata terbaik di Purwokerto dihapus karena tidak mempunyai dasar yang digunakan dalam audit ini.
- Tahun 2026/2027 pada SK guru dan pengumuman semester berjalan tidak diubah menjadi tahun penerimaan baru.

Sumber:

- [Profil resmi sekolah](https://smktelkom-pwt.sch.id/profil/): pendirian, visi/misi, dan empat counter; dibaca ulang 1 Oktober 2026.
- [Beranda resmi sekolah](https://smktelkom-pwt.sch.id/): nama dan sambutan kepala sekolah.
- [SPMB DIGITEST 1 TA 2027/2028](https://smktelkom-pwt.sch.id/pengumuman/spmb-digitest-1-ta-2027-2028-smk-telkom-purwokerto-resmi-dibuka-saatnya-jadi-bagian-dari-nextgens-stematel/): pengumuman penerimaan baru, diterbitkan 25 September 2026.

### 5 — Desain dan video

Lokasi: `src/components/AboutSection.jsx`, `src/components/tentang/TentangAboutSection.jsx`, `TentangProfilVideoSection.jsx`, `src/components/prestasi/PrestasiDukunganSection.jsx`, `src/components/VideoEmbed.jsx`, `src/assets/tentang`.

- Beranda menempatkan video di kiri serta deskripsi/badge di kanan; empat badge memakai grid dua kolom dengan tinggi baris yang sama.
- Profil Sekolah memakai satu kartu putih dengan teks kiri dan video kanan, menggantikan susunan kartu bertumpuk yang berbeda dari Figma.
- Sampul bangunan dan tiga ikon badge diambil dari aset asli Figma. Badge keempat tidak memiliki ikon pada node referensi dan tidak diberi ikon rekaan.
- Sampul Figma sudah mengandung tombol play; overlay/play tambahan tidak lagi ditumpuk di atasnya.
- VideoEmbed tetap memakai facade: iframe dimuat setelah tombol play ditekan. Browser memverifikasi URL youtube-nocookie dengan video ID resmi w68QaEXd7iw. Pengujian ini memverifikasi pemasangan iframe, bukan seluruh pemutaran YouTube sampai selesai.
- Font Inter/Poppins, primary #c8102e, max-width 1280px, serta breakpoint proyek tetap dipakai untuk konsistensi. Perbedaan terhadap Figma dicatat di bawah.

Sampul asli Figma hanya 245×131px. Tampilan besar masih dibatasi kualitas sumber; foto resolusi tinggi diperlukan untuk mempertajamnya tanpa mengarang gambar baru.

### 6 — Icon URL / favicon

Lokasi: `public/favicon.svg`, referensi favicon pada `index.html`.

Logo Vite diganti dengan logo Telkom Schools dari aset proyek. Berkas SVG bersifat mandiri dan membungkus PNG logo asli; ini bukan hasil tracing menjadi vektor murni. Browser memverifikasi respons 200, MIME image/svg+xml, dan decode gambar yang berhasil.

### 7 — Gmail

Dibatalkan pengguna. Tidak diuji dan tidak diubah. Perubahan pada halaman portal hanya salinan teks SPMB, bukan handler autentikasi atau email.

### 8 — Crosscheck tautan dan konten

Lokasi: `src/components/berita/BeritaHeroSection.jsx`, `src/components/pengumuman/PengumumanDaftarSection.jsx`, `PengumumanPopulerCard.jsx`, `src/pages/KoleksiPage.jsx`, `src/components/bkk/BkkLowonganSection.jsx`, dan slug agenda pada `dummyData.js`.

- Lima tautan pengumuman contoh yang tidak cocok dengan row API diganti dengan items API yang sudah dimuat halaman. Sidebar menampilkan maksimal lima item; koleksi menampilkan semuanya dengan urutan layanan yang sama.
- Judul sidebar menjadi Pengumuman Terbaru; angka view count contoh 2.4k dihapus. URL koleksi lama /pengumuman/populer tetap kompatibel.
- Tautan ticker berita memakai Baca Berita, bukan Lihat Prestasi.
- Dua lowongan tanpa URL lamaran menampilkan Tautan lamaran belum tersedia; tidak ada tombol href="#" yang memberikan kesan dapat melamar.
- Typo slug semianar menjadi seminar diperbaiki pada daftar dan detail agenda. Deskripsi arsip agenda tidak lagi mengklaim acara 2025 berlangsung dalam waktu dekat.
- Browser menguji navigasi sidebar pengumuman ke koleksi lalu ke detail asli. Paragraf pengumuman tidak berulang.

### 9 — Perbandingan Figma

File referensi: ca2iX76GpJSr0QC7Qyv9RV. Frame yang diperiksa: Beranda 24:365, Profil Sekolah 24:867, Profil Guru 12:63, Jurusan 24:1827, Prestasi 24:2575, dan Ekstrakurikuler 59:133.

| Halaman | Bagian | Figma | Website setelah perbaikan | Rekomendasi / status |
| --- | --- | --- | --- | --- |
| Beranda | Tentang SMK Telkom | Video kiri, teks/badge kanan; badge 2×2 | Susunan dan aset native diterapkan; badge sama tinggi | Selesai pada struktur; ukuran mengikuti container proyek |
| Profil Sekolah | Tentang SMK Telkom | Satu kartu putih; teks kiri, video kanan | Struktur diterapkan, kartu tumpuk dihapus | Selesai pada struktur |
| Halaman publik | Font | Plus Jakarta Sans; beberapa heading 32–40px dan body 24–27px | Inter/Poppins dengan ukuran proyek yang lebih kecil | Belum sama persis; perubahan token font menyeluruh perlu lingkup migrasi yang konsisten |
| Halaman publik | Warna merah | #cd0b20 dan beberapa #cc0a22 | Token primary #c8102e | Tetap konsisten dengan situs; belum identik terhadap seluruh node Figma |
| Halaman publik | Container / ukuran | Frame desktop 1847px; beberapa hero 1751px | max-w-7xl = 1280px, padding responsif | Tidak mengklaim pixel-perfect pada ukuran frame Figma |
| Beranda / Profil Sekolah | Sampul video | Aset bangunan native 245×131px dengan ikon play | Aset yang sama; overlay play ganda dihilangkan | Minta sumber bangunan resolusi tinggi bila tampilan perlu lebih tajam |
| Jurusan | CTA | Explore Jurusan | Daftar Sekarang menuju portal pendaftaran | Perbedaan tujuan/copy; pertahankan perilaku situs sampai keputusan produk berikutnya |
| Prestasi | Dukungan video | Kartu video horizontal sekitar 789×167px | Pemutar 16:9 dengan caption | Belum identik; video highlight asli dan keputusan variasi kartu masih diperlukan |
| Prestasi | Kartu data | Lima contoh kartu dalam frame | Tiga row API yang tersedia | Mengikuti data nyata aplikasi; foto/bukti prestasi menunggu pengguna |
| Ekstrakurikuler | Daftar kegiatan | Shadow, pagination, dan Lihat Semua | Flat, semua kegiatan pada grid responsif | Dipertahankan sesuai perubahan pengguna sebelumnya |
| Seluruh halaman | Tablet / mobile | Tidak ada frame tablet/mobile yang terverifikasi dalam audit | Breakpoint 640/1024px dan layout mobile proyek | Diuji responsif; bukan klaim kecocokan pixel-perfect mobile Figma |

## 3. Informasi dan aset yang masih perlu dikirim/diverifikasi

Belum terverifikasi berarti bukti belum diterima, bukan kesimpulan bahwa semua datanya pasti salah. Data ini tidak diganti dengan fakta rekaan.

| Item | Lokasi / sumber | Bukti kebutuhan verifikasi | Tindak lanjut |
| --- | --- | --- | --- |
| Lima logo JHIC | Footer | Nama/logo organisasi belum diberikan | Kirim lima berkas logo, nama, urutan, dan URL jika logo harus berupa link |
| Voli, Bela Diri, Hand Ball/Bola Tangan | dummyData.js:277–279 | Foto sekarang menunjukkan laptop, VR, dan jaringan | Kirim tiga foto kegiatan asli |
| Tiga prestasi API | Tabel prestasi; prestasiService.js | YIC tidak punya URL foto; UI/UX dan LKS memakai placehold.co; perolehan juara/peserta belum memiliki bukti | Kirim foto, sumber lomba, tanggal, peserta, dan peringkat |
| Foto API lain | Berita dan BKK | Masing-masing masih satu gambar placehold.co | Sediakan dokumentasi berita/logo perusahaan sebenarnya |
| Typo konten API | Pengumuman libur dan prestasi YIC | Puworkerto dan menjuara masih berasal dari database | Koreksi melalui dashboard setelah naskah asli disepakati; database tidak dimutasi audit ini |
| Riwayat sekolah | timelineData, dummyData.js:432 | Tahun 2016/2020/2023/2026 belum memiliki sumber yang cocok | Dokumen riwayat asli |
| Statistik dan perjalanan prestasi | prestasiStats :658; perjalananPrestasi :759 | 150+/50+/15+/100+ dan angka per tahun merupakan konstanta, bukan agregasi API | Data rekap prestasi resmi |
| Hall of Fame | hallOfFame :771 | Enam nama, kompetisi, pekerjaan/perusahaan, dan avatar belum terbukti | Profil, foto, dan bukti prestasi/alumni |
| Testimoni BKK | kisahAlumni :988 | Tiga kutipan serta pekerjaan/tahun kelulusan belum terbukti | Testimoni dan profil alumni asli |
| Angka/waktu pengumuman | infoPenting :1052; pengumumanStats :1068; pengumumanTimeline :1082 | Workshop besok, deadline 3 hari, libur minggu depan, dan counter 45/12/5/8 serta 3/4/8/15 masih statis | Jadwal dan data asli atau mekanisme tanggal yang disepakati |
| Agenda dan dokumentasinya | agendaEvent :2231; agendaDetail :2704 | Acara Mei/Juni 2025 serta pemateri/jam/kuota/foto belum memiliki bukti kegiatan yang sesuai | Arsip jadwal dan foto acara asli |

Nomor baris mengacu checkout setelah perubahan audit ini. Statistik resmi pada Profil Sekolah berbeda lingkup dengan rekap dummy halaman Prestasi; keduanya belum boleh dianggap saling mengonfirmasi.

## 4. Hasil verifikasi

| Pemeriksaan | Hasil | Batas pemeriksaan |
| --- | --- | --- |
| ESLint | Lulus | npm.cmd run lint |
| Build produksi | Lulus | Ada peringatan chunk utama sekitar 579 kB, gzip sekitar 178 kB; bukan error build |
| Foto dan normalisasi konten | Lulus | Foto/logo kosong, foto valid, placeholder tetap, ringkasan tidak berulang |
| Geometri carousel | Lulus | 60 kombinasi geometri 1/2/4 kolom, termasuk ukuran pecahan dan halaman akhir parsial |
| Tautan pengumuman/berita | Lulus | Source API, urutan, limit sidebar, koleksi penuh, serta label tujuan |
| Aset Drive dan fasilitas | Lulus | Referensi aset utama dan tujuh foto fasilitas; tidak membuktikan semua keterangan faktual |
| Browser gambar | Lulus untuk pemuatan img pada sepuluh halaman | /, /profil-sekolah, /profil-sekolah/guru, /jurusan, /prestasi, /bkk, /berita, /pengumuman, /ekstrakurikuler, /galeri; placeholder/missing source tetap dicatat |
| Responsive | Tidak ada overflow horizontal pada kombinasi yang diuji | Lima halaman × 390/768/1094/911px; DPR 1/1/1.25/1.5 |
| Footer | Tidak ada irisan kotak aksen dengan teks/tautan yang diperiksa | Lima halaman × empat viewport; bukan pemeriksaan setiap pixel seluruh halaman |
| Klik carousel browser | Lulus | 390px: indikator ketiga aktif; 768px: indikator kedua aktif; 1366px: satu indikator |
| Klik kartu prestasi | Lulus | Detail sesuai slug data kartu |
| Pemulihan detail dan related error | Lulus | Prestasi, berita, pengumuman invalid → valid pada SPA; daftar terkait diblokir sementara |
| Favicon | Lulus | HTTP 200, MIME SVG, decode berhasil |
| Video profil | Lulus untuk pemasangan iframe | Domain youtube-nocookie dan ID w68QaEXd7iw; pemutaran sampai selesai tidak diuji |
| Console | Tidak ditemukan error/warning pada penelusuran normal awal | Uji sengaja memblokir network dan slug invalid menghasilkan error request yang diharapkan |
| git diff --check | Lulus | Tidak ada error whitespace |

Simulasi 125%/150% menggunakan viewport CSS dan DPR untuk laptop 1366px, bukan mengubah setting Windows atau zoom native browser. Pengujian backend, dashboard terautentikasi, alur email, dan deployment produksi tidak termasuk hasil lulus di atas.

Perintah ulang dari folder frontend:

```powershell
npm.cmd run lint
npm.cmd run build
node scripts/uji-foto-prestasi.mjs
node scripts/uji-carousel-prestasi.mjs
node scripts/uji-tautan-konten-publik.mjs
node scripts/uji-aset-drive.mjs
node scripts/uji-galeri-fasilitas.mjs
git diff --check
```

Bukti browser lokal disimpan di `D:/LombaTelkom/qa-output/`: frontend-images-2026-10-01.json, frontend-responsive-2026-10-01.json, frontend-achievement-details-2026-10-01.json, frontend-detail-recovery-2026-10-01.json, frontend-carousel-2026-10-01.json, frontend-favicon-2026-10-01.json, about-home-final.png, about-profile-final.png, dan about-profile-mobile-final.png. Berkas QA di luar repository tidak dimasukkan ke Git.

## 5. Status akhir dan langkah berikutnya

Perbaikan terverifikasi sudah siap ditinjau dan digunakan secara lokal. Semua tugas belum selesai: Supported by, foto asli, validasi konten yang masih statis, dan kesetaraan Figma menyeluruh masih terbuka. Gmail dikeluarkan dari lingkup sesuai permintaan pengguna.

Urutan berikutnya: menerima logo/foto/data asli; memperbarui source konten yang disepakati; menjalankan ulang pemeriksaan gambar/detail; memutuskan apakah font/warna/container harus dimigrasikan menyeluruh; baru memverifikasi deployment setelah pengguna melakukan commit/push.
