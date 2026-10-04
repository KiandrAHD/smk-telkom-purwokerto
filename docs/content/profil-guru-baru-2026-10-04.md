# Penambahan Profil Guru — 4 Oktober 2026

Sumber: drive-download-20261004T070053Z-1-001.zip (27 foto). Data baru hanya diimpor oleh halaman Profil Guru dan detail guru. Profil Sekolah tetap memakai 13 entri lama.

Status mapel: 26 belum tersedia pada file dan menunggu konfirmasi pengguna. Label Guru Sejarah terlihat pada foto Nina Wijiati; label ini dicatat sesuai foto, belum memverifikasi pembagian mapel terbaru. Jangan menyimpulkan mapel dari gelar, jabatan, atau kegiatan dalam foto.

Nama dan jabatan mengikuti nama berkas dengan perapian spasi, tanda baca gelar, dan singkatan sarana/prasarana. Deskripsi adalah ringkasan editorial peran, bukan biografi atau klaim pencapaian pribadi.

## Foto dan optimisasi

Sumber asli: 37904191 byte. Versi detail: 288332 byte total. Versi kartu 240 px: 128554 byte total. Semua foto rasio 4:5, WebP, tanpa memperbesar sumber kecil. Potret Prasetyo berukuran 300×375 karena sumber hanya memungkinkan crop selebar 300 px.

Koordinat crop dan nama berkas sumber tersimpan di profilGuruData.js. ZIP asli tidak diubah. Kartu/detail memakai srcset, decoding async, loading lazy, ukuran intrinsik, dan ruang aspect-ratio tetap. Foto halaman carousel yang jauh tidak dipasang ke DOM. Terjemahan baru berada di chunk rute guru, bukan kamus global.

## Daftar data

| Nama | Jabatan | Mapel dalam file | Potret / thumbnail (byte) |
| --- | --- | --- | --- |
| Thoriq Abdul Azis M, S.Kom. | Staf Sinergi, Unit Produksi & Alumni | Menunggu konfirmasi | 12838 / 5692 |
| Susi Listyarini, S.Pd. | Koord. QDPM | Menunggu konfirmasi | 11150 / 4844 |
| Afhail Lucqi Sianggang, S.Kom. | Kaur PPDB dan Komunikasi | Menunggu konfirmasi | 14530 / 6846 |
| Anisa Rizqi Utami, S.Pd. | Bimbingan Konseling | Menunggu konfirmasi | 10634 / 4828 |
| Agus Widodo, S.Kom. | Staf Sarana Prasarana | Menunggu konfirmasi | 8840 / 3804 |
| Nugrahani Puspitasari, S.I.Pust. | Staf Perpustakaan | Menunggu konfirmasi | 11964 / 5162 |
| Arif Muttakin, S.T. | Waka Bid. Kesiswaan | Menunggu konfirmasi | 12476 / 5584 |
| Agung Restu Saputra, S.Kom. | PIC IT, Lab & Sarana Prasarana | Menunggu konfirmasi | 8602 / 3686 |
| Princes Iqlima Kafilla, S.Kom. | Koord. Program Keahlian PPLG | Menunggu konfirmasi | 10156 / 4554 |
| Lulu Zakiyah, S.Kom. | Pembina Sekbid X | Menunggu konfirmasi | 10292 / 4400 |
| Agustiana Dwi Nurcahyani, S.Pd., M.Pd. | Staf PPDB dan Komunikasi | Menunggu konfirmasi | 10522 / 4494 |
| Imam Sugiharto, S.Pd.I. | Pembina Sekbid I (Rohis) | Menunggu konfirmasi | 9798 / 4210 |
| Saefullah S | Laboran / Teknisi | Menunggu konfirmasi | 12664 / 5768 |
| Winda Yusmawardani Putri, S.Pd. | Staf Perencanaan KBM dan Perpustakaan | Menunggu konfirmasi | 8178 / 3512 |
| Wahyuni Tri Widayati, S.Pd. | Staf Pelaksanaan dan Evaluasi KBM | Menunggu konfirmasi | 8218 / 3588 |
| Teguh Arif Hidayatuloh, S.Kom. | Staf Sarana Prasarana | Menunggu konfirmasi | 12786 / 5610 |
| Nia Yuliana, S.Ak. | Staf Administrasi Keuangan | Menunggu konfirmasi | 12642 / 5662 |
| Prasetyo Adi Wibowo, S.Pd., M.Pd. | Koord. Ekskul & Pembina Prestasi | Menunggu konfirmasi | 5402 / 3830 |
| Tisna Eka Darwati, S.Psi., S.Sos. | Bimbingan Konseling | Menunggu konfirmasi | 10280 / 4472 |
| Bintang Nugraha KS, S.Kom. | Staf Sinergi, Unit Produksi & Alumni | Menunggu konfirmasi | 11622 / 5356 |
| Berlian Windasari, S.Kom. | Staf Sinergi, Unit Produksi & Alumni | Menunggu konfirmasi | 9990 / 4046 |
| Nina Wijiati, S.Pd. | Staf Pelaksanaan dan Evaluasi KBM | Sejarah | 12216 / 5182 |
| Siti Mufsohah Muhimmati, S.Ag. | Pembina Sekbid VI | Menunggu konfirmasi | 9038 / 4048 |
| Sri Mulani Widayati, S.Pd., M.Pd. | Kepala Administrasi | Menunggu konfirmasi | 7406 / 3176 |
| Yuli Opia Sari, S.E. | Staf HC, Logistik & Sekretariat | Menunggu konfirmasi | 13526 / 6220 |
| Tofik Nurhadi, S.Pd. | Staf Perencanaan KBM dan Perpustakaan | Menunggu konfirmasi | 11452 / 5018 |
| Krisma Dwi Brata, S.Kom. | Waka Bid. Hubungan Industri & Komunikasi | Menunggu konfirmasi | 11110 / 4962 |

## Pemeriksaan

Jalankan node scripts/uji-guru-baru.mjs, node scripts/uji-detail-guru.mjs, npm.cmd run lint, npm.cmd run build, dan npm.cmd run performa:uji. Metrik build serta pemeriksaan browser dilaporkan terpisah; anggaran ukuran berkas tidak membuktikan skor Lighthouse atau performa server produksi.

## Hasil validasi lokal

Lint, build, uji-guru-baru, uji-detail-guru, dan uji-performa lulus. JavaScript entry: 460140 → 460378 byte (+238 byte; sekitar 0,052 persen). Chunk Profil Sekolah: 17448 byte sebelum dan sesudah. Chunk dummyData: 123466 byte sebelum dan sesudah. Data guru baru: 28637 byte pada chunk rute guru (gzip 7030 byte). Foto baru tidak di-inline ke JavaScript agar pemuatan dapat ditunda.

Browser build produksi lokal: empat kartu desktop, satu kartu pada viewport 390 px, navigasi halaman ke-14, detail Thoriq, tombol kembali ke Profil Guru, serta terjemahan ID/EN diperiksa. Tidak ada overflow horizontal pada pemeriksaan ponsel. Profil Sekolah tetap menggunakan daftar lama; foto baru tidak muncul di sana. h1, alt foto, URL slug, dan judul detail dipertahankan. Semua 27 crop ditinjau pada lembar preview lokal. Skor Lighthouse dan deployment produksi belum diukur.

Arif Muttakin dan Krisma Dwi Brata terdapat pada ZIP terbaru sehingga ditambahkan kembali khusus ke Profil Guru; keduanya tetap tidak ditambahkan ke daftar Profil Sekolah.

Baris Mata Pelajaran pada kartu dan detail guru baru hanya ditampilkan jika datanya tersedia. Mapel kosong tetap disimpan sebagai null tanpa menampilkan penanda perlu konfirmasi, baik dalam bahasa Indonesia maupun Inggris. Mapel Sejarah milik Nina tetap ditampilkan.

Catatan konfirmasi pada profil lama Arif Munandar juga dihapus dari tampilan Profil Guru, termasuk detail dan terjemahannya. Data bersama yang dipakai Profil Sekolah tetap dipertahankan. Setelah penyesuaian ini, lint, build, kedua uji guru, dan anggaran performa kembali lulus. Browser memverifikasi kartu dan detail tanpa mapel pada ID/EN serta mapel History yang tetap terlihat pada detail Nina.
