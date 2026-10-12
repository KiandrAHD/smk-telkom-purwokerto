# QA restrukturisasi Profil Guru dan Kesiswaan

Tanggal: 12 Oktober 2026. Route tetap /profil-sekolah/guru.

## Ringkasan

Dua section memakai GuruGrid yang sama, masing-masing dengan state pagination dan ID aksesibilitas independen. Urutan mengikuti referensi: Bidang Kesiswaan & Karakter, pita dekoratif existing, lalu Guru & Tenaga Pendidik. Hero, Kepala Sekolah, navbar, Footer, serta komponen Profil Sekolah tetap.

Ada 48 profil berbeda: seluruh 40 profil sebelumnya dipertahankan dan delapan profil ditambahkan dari SK/foto yang cocok. Pembagian unit kerja utama menghasilkan 15 Kesiswaan & Karakter dan 33 Guru & Tenaga Pendidik. Tugas PIC tambahan disimpan sebagai fakta detail, tanpa menggandakan orang dalam kedua kategori.

Desktop menampilkan maksimal delapan profil, 4 kolom × 2 baris. Tablet menampilkan empat profil, 2 kolom × 2 baris. Mobile menampilkan dua profil, 1 kolom × 2 baris. Halaman terakhir menampilkan data tersisa; track grid tetap menjaga tinggi tanpa kartu palsu. Pagination finite, pill persisten 300 ms, keyboard, dan reduced motion dipertahankan.

## Sumber dan pemetaan

- Dokumen utama: Out_1208_Pengawakan TP26-27(2).pdf, SK SKEP.1208/SDM000/KS-00/08/2026, tabel halaman 2–3. Ketiga halaman dibaca/dirender; halaman tabel berupa scan sehingga diperiksa secara visual.
- ZIP terbaru: drive-download-20261012T123143Z-1-001.zip, 36 foto. Seluruh foto diperiksa melalui contact sheet.
- 27 foto cocok dan dipakai sebagai 54 aset WebP ukuran 480/240 px, crop 4:5. Sebanyak 21 profil lainnya mempertahankan foto asli yang sudah tersedia di proyek.
- Nama diketik rapi pada data, bukan melalui CSS capitalize. Gelar, KS, QDPM, TJKT, PPLG, dan angka Romawi dipertahankan.
- Pengguna mengonfirmasi Gita Laras Pratama = Anggita Laras Pratama serta Ana = Anna Durrotul Isma. Ejaan Anna dan gelar mengikuti SK. Fendi Riawan pada foto dan SK cocok setelah tabel diperbesar; konfirmasi pengguna juga mengizinkan pencocokan ini.
- Jabatan utama Agung Restu Saputra diperbaiki menjadi Koord. Laboratorium; tugas PIC IT, Lab & Sarana Prasarana tetap menjadi fakta tambahan. Keksi memakai jabatan Staf PPDB dan Komunikasi pada data SK. Formatter penerimaan siswa existing dapat menampilkan istilah SPMB pada antarmuka.
- Deskripsi editorial lama dipertahankan. Profil baru hanya memuat informasi penugasan bersumber dari SK, tanpa biografi atau mata pelajaran yang dibuat-buat.
- Empat profil pembuka Kesiswaan mengikuti urutan visual Arif, Reza, Prasetyo, Andang. Jabatan Reza menggunakan Pembina Sekbid IX sesuai SK.

## Struktur halaman

Header → hero Profil Guru → Kepala Sekolah → Bidang Kesiswaan & Karakter → RibbonDivider → Guru & Tenaga Pendidik → pita penutup existing → shared STELA/SPMB → Footer.

Kesiswaan berisi seluruh anggota bidang yang memiliki profil/foto tersedia, sehingga lebih banyak dari empat contoh pada screenshot. Data personel lain pada SK belum memiliki foto dalam bahan yang tersedia, termasuk Enggar Ariwardani dan Faizal Anggriawan dari Kesiswaan; tidak dibuatkan kartu placeholder.

## Daftar profil terpasang

Kolom foto menunjukkan label foto ZIP terbaru; tanda “Foto existing” berarti mempertahankan sumber foto sebelumnya.

| Nama | Kategori | Jabatan utama dalam SK | Halaman SK | Foto |
| --- | --- | --- | --- | --- |
| Firda Ayu Nirmala, S.Kom. | Guru/Tenaga Pendidik | Staf Sinergi, Unit Produksi & Alumni | 3 | Firda Ayu Nirmala |
| Agus Indra Cahaya, S.Kom. | Guru/Tenaga Pendidik | Staf Teknologi Informasi | 3 | Foto existing |
| Bayu Aji Sukma, S.Si. | Guru/Tenaga Pendidik | Koord. Perencanaan KBM dan Perpustakaan | 2 | Foto existing |
| Herdiyanto, S.Sos.I., M.Pd. | Kesiswaan | Pembina Kerohanian | 3 | HERDIYANTO |
| Arif Munandar, S.Si. | Kesiswaan | Karakter | 3 | ARIF MUNANDAR |
| Ragil Rudi Priyanto, S.Si. | Guru/Tenaga Pendidik | Kaur Pelaksanaan dan Evaluasi KBM | 2 | RAGIL RUDI PRIYANTO |
| Andang Jaka Patrianta, S.Pd. | Kesiswaan | Kaur Bimbingan Konseling & Karakter | 2 | ANDANG JAKA PATRIANTA |
| Anggita Laras Pratama, S.Pd., M.Pd. | Kesiswaan | Pembina Sekbid IV | 2 | Gita Laras Pratama |
| Keksi Manik Setyawati, S.Pd. | Guru/Tenaga Pendidik | Staf PPDB dan Komunikasi | 3 | KEKSI MANIK SETYAWATI |
| Sutri Aniroh, S.Kom. | Guru/Tenaga Pendidik | Koord. HC, Logistik & Sekretariat | 2 | Foto existing |
| Desti Nurcahyani, S.Pd.Si. | Guru/Tenaga Pendidik | Waka Bid. Kurikulum | 2 | Foto existing |
| Finka Ayu Fitriani, S.Pd. | Guru/Tenaga Pendidik | Staf Sinergi, Unit Produksi & Alumni | 3 | Finka Ayu Fitriani |
| Reza Aditya Permana, S.Kom. | Kesiswaan | Pembina Sekbid IX | 2 | Reza Aditya Permana |
| Thoriq Abdul Azis M, S.Kom. | Guru/Tenaga Pendidik | Staf Sinergi, Unit Produksi & Alumni | 3 | Foto existing |
| Susi Listyarini, S.Pd. | Guru/Tenaga Pendidik | Koord. QDPM | 3 | Foto existing |
| Afhail Lucqi Sianggang, S.Kom. | Guru/Tenaga Pendidik | Kaur PPDB dan Komunikasi | 3 | Foto existing |
| Anisa Rizqi Utami, S.Pd. | Kesiswaan | Bimbingan Konseling | 2 | ANISA RIZQI UTAMI |
| Agus Widodo, S.Kom. | Guru/Tenaga Pendidik | Staf Sarana Prasarana | 3 | AGUS WIDODO |
| Nugrahani Puspitasari, S.I.Pust. | Guru/Tenaga Pendidik | Staf Perpustakaan | 2 | Foto existing |
| Arif Muttakin, S.T. | Kesiswaan | Waka Bid. Kesiswaan & Karakter | 2 | ARIF MUTTAKIN |
| Agung Restu Saputra, S.Kom. | Guru/Tenaga Pendidik | Koord. Laboratorium | 3 | AGUNG RESTU SAPUTRA |
| Princes Iqlima Kafilla, S.Kom. | Guru/Tenaga Pendidik | Koord. Program Keahlian PPLG | 2 | Foto existing |
| Lulu Zakiyah, S.Kom. | Kesiswaan | Pembina Sekbid X | 2 | LULU ZAKIYAH |
| Agustiana Dwi Nurcahyani, S.Pd., M.Pd. | Guru/Tenaga Pendidik | Staf PPDB dan Komunikasi | 3 | AGUSTIANA DWI NURCAHYANI |
| Imam Sugiharto, S.Pd.I. | Kesiswaan | Pembina Sekbid I (Rohis) | 2 | Foto existing |
| Saefullah S | Guru/Tenaga Pendidik | Laboran / Teknisi | 3 | Foto existing |
| Winda Yusmawardani Putri, S.Pd. | Guru/Tenaga Pendidik | Staf Perencanaan KBM dan Perpustakaan | 2 | Foto existing |
| Wahyuni Tri Widayati, S.Pd. | Guru/Tenaga Pendidik | Staf Pelaksanaan dan Evaluasi KBM | 2 | Foto existing |
| Teguh Arif Hidayatuloh, S.Kom. | Guru/Tenaga Pendidik | Staf Sarana Prasarana | 3 | Foto existing |
| Nia Yuliana, S.Ak. | Guru/Tenaga Pendidik | Staf Administrasi Keuangan | 2 | Foto existing |
| Prasetyo Adi Wibowo, S.Pd., M.Pd. | Kesiswaan | Koord. Ekskul & Pembina Prestasi | 2 | PRASETYO ADI WIBOWO |
| Tisna Eka Darwati, S.Psi., S.Sos. | Kesiswaan | Bimbingan Konseling | 3 | Foto existing |
| Bintang Nugraha KS, S.Kom. | Guru/Tenaga Pendidik | Staf Sinergi, Unit Produksi & Alumni | 3 | BINTANG NUGRAHA KASALURI S |
| Berlian Windasari, S.Kom. | Guru/Tenaga Pendidik | Staf Sinergi, Unit Produksi & Alumni | 3 | BERLIAN WINDASARI |
| Nina Wijiati, S.Pd. | Guru/Tenaga Pendidik | Staf Pelaksanaan dan Evaluasi KBM | 2 | NINA WIJIATI |
| Siti Mufsohah Muhimmati, S.Ag. | Kesiswaan | Pembina Sekbid VI | 2 | Foto existing |
| Sri Mulani Widayati, S.Pd., M.Pd. | Guru/Tenaga Pendidik | Kepala Administrasi | 2 | Foto existing |
| Yuli Opia Sari, S.E. | Guru/Tenaga Pendidik | Staf HC, Logistik & Sekretariat | 2 | Foto existing |
| Tofik Nurhadi, S.Pd. | Guru/Tenaga Pendidik | Staf Perencanaan KBM dan Perpustakaan | 2 | Foto existing |
| Krisma Dwi Brata, S.Kom. | Guru/Tenaga Pendidik | Waka Bid. Hubungan Industri & Komunikasi | 3 | Foto existing |
| Putra Utama Eka Sakti, S.T. | Guru/Tenaga Pendidik | Ketua Program Keahlian TJKT | 2 | PUTRA UTAMA EKA SAKTI |
| Dewi Arimbi Suprobowati, S.Pd. | Kesiswaan | Pembina Sekbid VIII | 2 | Dewi Arimbi Suprobowati |
| Irfan Nur Aziz, S.Psi. | Kesiswaan | Bimbingan Konseling | 2 | Irfan Nur Aziz |
| Bekti Abriyanti Dwi Laksani, S.Psi. | Kesiswaan | Bimbingan Konseling | 2 | BEKTI ABRIYANTI DWI LAKSANI |
| Shinta Pertiwi, S.Pd., M.Pd. | Guru/Tenaga Pendidik | Staf Pelaksanaan dan Evaluasi KBM | 2 | Shinta Pertiwi |
| Aravika Prakusiya, S.Kom. | Guru/Tenaga Pendidik | Staf PPDB dan Komunikasi | 3 | Aravika Prakusiya |
| Fendi Riawan, S.Kom. | Guru/Tenaga Pendidik | Dokumen dan Staf QDPM | 3 | Fendi Riawan |
| Anna Durrotul Isma, S.T., M.M. | Guru/Tenaga Pendidik | Dokumen dan Staf QDPM | 3 | Ana Durrotul Isma |

## Belum dimasukkan sesuai arahan pengguna

| Foto/nama | Informasi yang masih diperlukan |
| --- | --- |
| Sagita Mondesya Fajri | Jabatan dan kategori; belum ditemukan di SK |
| Iis Yuliani | Jabatan dan kategori; belum ditemukan di SK |
| Biebha Arya Wirawan | Jabatan dan kategori; belum ditemukan di SK |
| Dimas Cahyo | Jabatan dan kategori; belum ditemukan di SK |
| Dika Alim Mu’adin | Ejaan nama serta jabatan/kategori; belum ditemukan di SK |
| Gangsar | Nama lengkap, jabatan, kategori; belum ditemukan di SK |
| Ani Nurwijayanti | Jabatan dan kategori; belum ditemukan di SK |
| Aris R | Label nama dipertahankan sesuai arahan; jabatan/kategori belum terkonfirmasi, belum diasumsikan sebagai Aris Rianto |
| Foto berlabel Humas SMK Telkom Purwokerto | Identitas, jabatan, dan kategori individu belum tersedia |

Ejaan dua profil existing juga perlu konfirmasi: Saefullah S pada sumber foto lama dibanding Saefulloh S pada scan SK, serta Teguh Arif Hidayatuloh dibanding Hidayatulloh pada scan SK. Nama existing dipertahankan sementara; kategori dan jabatan telah dicocokkan. Tidak memperluas inisial KS pada Bintang Nugraha karena SK memakai KS.

## File yang diubah

| File | Alasan |
| --- | --- |
| frontend/src/pages/GuruPage.jsx | Dua pemanggilan grid reusable, ID/heading/aria-controls per kategori, pita pemisah |
| frontend/src/data/profilGuruData.js | Penggabungan profil existing dengan penugasan/foto baru, kategori, detail, i18n lokal, serta tugas tambahan |
| frontend/src/data/pengawakanGuruData.js | Data hasil pencocokan nama, gelar, jabatan, unit kerja, dan halaman SK |
| frontend/src/data/translationsSchool.js | Heading Kesiswaan dan label navigasi/fakta ID/EN |
| frontend/src/assets/tentang/guru/tp26-27/ | 54 WebP dari 27 foto asli, tanpa gambar AI/placeholder |
| frontend/scripts/uji-kategori-guru.mjs | Kelengkapan kategori, nama/slug/detail, 27 sumber foto dan ukuran crop, serta dua section ID/EN |
| frontend/scripts/uji-grid-guru.mjs | Baseline kini delapan profil per kategori |
| frontend/scripts/uji-guru-baru.mjs | Memperbarui jumlah profil dan memeriksa pemetaan detail efektif |
| frontend/scripts/uji-guru-grid-browser.mjs | Menguji seluruh data kedua kategori, state independen, sisa data dan animasi |
| docs/qa-guru-kesiswaan.md | Laporan data, validasi, dan daftar konfirmasi |

Tidak menambah dependency, route, perubahan global CSS, navbar, Footer, TeacherPhoto, atau daftar 13 guru pada komponen Profil Sekolah. Pemeriksaan git diff untuk file-file tersebut berhasil tanpa perubahan.

## Validasi

| Pemeriksaan | Hasil |
| --- | --- |
| Desktop 1440/1200 px, ID/EN | Kedua kategori 4 kolom × 2 baris pada halaman penuh; 2 halaman Kesiswaan dan 5 halaman Guru |
| Tablet 1199/768 px, ID/EN | Kedua kategori 2 kolom; 4 halaman Kesiswaan dan 9 halaman Guru |
| Mobile 767/375/320 px, ID/EN | Kedua kategori 1 kolom; 8 halaman Kesiswaan dan 17 halaman Guru |
| Seluruh pagination | Semua 48 nama sesuai urutan dataset tanpa duplikasi/kehilangan; Previous/Next finite, dot aktif dan pusat pill sesuai |
| State independen | Memindahkan kategori aktif tidak mengubah nama yang terlihat pada kategori lain |
| Layout | Tidak ada horizontal overflow; kartu sama tinggi; selisih tinggi grid antarhalaman 0 px pada 28 kombinasi kategori/viewport/bahasa |
| Sisa halaman | Kesiswaan desktop terakhir 7 orang, Guru desktop terakhir 1 orang; tidak ada kartu tiruan |
| Fixture 0/1/7/8/9/15 | Empty state/satu halaman/sisa data lolos |
| Foto | Semua foto grid berhasil decode pada seluruh halaman; semua 27 foto baru berukuran/crop 4:5 valid |
| Detail | Seluruh 48 URL detail berhasil dibuka dengan h1 nama yang benar dan foto berhasil decode; tidak ada runtime pageerror |
| Keyboard dan resize | Previous Enter, dot Space, serta mempertahankan kelompok guru saat resize lolos |
| Pill | Satu elemen persisten per kategori; interpolasi transform menuju target tanpa overshoot; 300 ms; reduced motion ≤1 ms |
| Visual | Screenshot desktop, tablet, mobile diperiksa; dua heading, urutan kategori/pita, frame, foto dan teks tetap tertata |
| Review terpisah | Tidak menemukan masalah penting; kategori/detail/i18n dan isolasi halaman lain lolos |
| Lint | npm.cmd run lint berhasil, exit 0 |
| Build | npm.cmd run build berhasil, exit 0; informasi waktu plugin Vite asset/CSS tanpa kegagalan |
| Typecheck | Tidak tersedia pada proyek JS/JSX; tanpa script typecheck/tsconfig |
| Automated tests | uji-kategori-guru, uji-grid-guru, uji-guru-baru, uji-detail-guru, dan bahasa:uji berhasil |
| Diff | git diff --check berhasil |

## Bukti dan reproduksi

- [Dua section desktop dengan pita](D:/LombaTelkom/qa-output/guru-kesiswaan-2026-10-12/browser/two-sections-desktop.png)
- [Kesiswaan desktop ID](D:/LombaTelkom/qa-output/guru-kesiswaan-2026-10-12/browser/kesiswaan-section-1440-id.png)
- [Kesiswaan mobile EN](D:/LombaTelkom/qa-output/guru-kesiswaan-2026-10-12/browser/kesiswaan-section-375-en.png)
- [Guru tablet ID](D:/LombaTelkom/qa-output/guru-kesiswaan-2026-10-12/browser/guru-section-768-id.png)
- [Hasil browser dan sampel transform](D:/LombaTelkom/qa-output/guru-kesiswaan-2026-10-12/browser/results.json)
- [Audit profil dalam JSON](D:/LombaTelkom/qa-output/guru-kesiswaan-2026-10-12/audit-profil.json)

Jalankan dari frontend: npm.cmd run lint, npm.cmd run build, node scripts/uji-kategori-guru.mjs, node scripts/uji-grid-guru.mjs, node scripts/uji-guru-baru.mjs, node scripts/uji-detail-guru.mjs, npm.cmd run bahasa:uji.

Suite browser memerlukan Chrome dan Playwright yang tersedia di runtime QA serta production preview pada 127.0.0.1:4173:

```powershell
$env:PLAYWRIGHT_MODULE='file:///C:/Users/IDEAPAD%20SLIM%203/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'
$env:QA_OUTPUT='D:/LombaTelkom/qa-output/guru-kesiswaan-2026-10-12/browser'
node scripts/uji-guru-grid-browser.mjs
```

## Batas pemeriksaan

Pengujian menggunakan Chrome desktop dengan emulasi viewport, belum perangkat fisik/Safari. REST eksternal di-stub agar QA fokus pada dataset lokal; integrasi backend tidak termasuk perubahan. Referensi visual pengguna dibandingkan dengan hasil browser; tidak membuka node Figma langsung. Data mapel yang belum tersedia tidak dibuat-buat. Perubahan belum deploy, commit, atau push.

## Git handoff

Branch: feat/fasilitas-sekolah. Origin: https://github.com/KiandrAHD/smk-telkom-purwokerto.git. Jalankan sendiri jika hasil sesuai:

```powershell
Set-Location 'D:/LombaTelkom/smk-telkom-purwokerto'
git add -- frontend/src/pages/GuruPage.jsx frontend/src/data/profilGuruData.js frontend/src/data/pengawakanGuruData.js frontend/src/data/translationsSchool.js frontend/src/assets/tentang/guru/tp26-27 frontend/scripts/uji-kategori-guru.mjs frontend/scripts/uji-grid-guru.mjs frontend/scripts/uji-guru-baru.mjs frontend/scripts/uji-guru-grid-browser.mjs docs/qa-guru-kesiswaan.md
git commit -m "Separate student affairs and teacher profiles from verified staffing data"
git push origin feat/fasilitas-sekolah
```
