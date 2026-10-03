# Audit dan perapian nama aset gambar

Tanggal: 4 Oktober 2026. Proyek: frontend SMK Telkom Purwokerto.

36 aset di src/assets diberi nama berdasarkan isi, identitas pada data yang sudah ada, atau fungsi dekorasinya. Empat gambar eksternal dengan nama acak/WhatsApp disimpan sebagai berkas lokal. Empat cadangan ilustrasi guru ikut berganti nama agar konvensi pemulihan folder__filename tetap cocok. Satu backup dipindahkan keluar dari src/assets.

## Perubahan nama

| Sebelum | Sesudah |
|---|---|
| footer/figma-footer-mask.png | footer/footer-motif-mask.png |
| footer/figma-footer-fill.svg | footer/footer-motif-fill.svg |
| tentang/figma-guru-horizontal.png | tentang/guru-border-horizontal.png |
| tentang/figma-guru-horizontal.svg | tentang/guru-border-horizontal.svg |
| tentang/figma-guru-horizontal-top.png | tentang/guru-border-top.png |
| tentang/figma-guru-horizontal-top.svg | tentang/guru-border-top.svg |
| tentang/figma-guru-headmaster.svg | tentang/kepala-sekolah-motif.svg |
| tentang/figma-guru-vertical.png | tentang/guru-border-vertical.png |
| tentang/figma-guru-vertical.svg | tentang/guru-border-vertical.svg |
| tentang/figma-guru-photo-accent.png | tentang/guru-photo-motif.png |
| tentang/profil-video-figma.png | tentang/video-profil-thumbnail.png |
| tentang/guru/bu-firda.png | tentang/guru/firda-ayu-nirmala.png |
| tentang/guru/pak-aic.png | tentang/guru/agus-indra-cahaya.png |
| tentang/guru/pak-bayu.png | tentang/guru/bayu-aji-sukma.png |
| tentang/guru/pak-nandar.png | tentang/guru/arif-munandar.png |
| tentang/guru/pak-ragil.png | tentang/guru/ragil-rudi-priyanto.png |
| tentang/guru/pak-aris.png | tentang/guru/aris-puji-santoso.png |
| tentang/guru/pak-herdi.png | tentang/guru/potret-guru-salam.png |
| tentang/guru-1.png | tentang/ilustrasi-guru-pria-berkacamata.png |
| tentang/guru-2.png | tentang/ilustrasi-guru-perempuan.png |
| tentang/guru-3.png | tentang/ilustrasi-guru-perempuan-berhijab.png |
| tentang/guru-4.png | tentang/ilustrasi-guru-pria-menyambut.png |
| ekstrakurikuler/kegiatan-1.png | ekstrakurikuler/belajar-kelompok-laptop.png |
| ekstrakurikuler/kegiatan-2.png | ekstrakurikuler/praktik-virtual-reality.png |
| ekstrakurikuler/kegiatan-3.png | ekstrakurikuler/praktik-rak-jaringan.png |
| ekstrakurikuler/kegiatan-4.png | ekstrakurikuler/praktik-panjat-menara.png |
| drive/showcase-projek-a.png | drive/pameran-proyek-iot.png |
| drive/showcase-mobil.png | drive/proyek-garasi-otomatis.png |
| drive/showcase-library.jpg | drive/perpustakaan-komputer.jpg |
| drive/showcase-kabel.png | drive/praktik-kabel-fiber-optik.png |
| landing/figma-section-accent.png | landing/section-motif.png |
| landing/figma-ribbon.png | landing/ribbon-divider.png |
| landing/logo.png | landing/logo-smk-telkom-purwokerto.png |
| landing/map.jpg | landing/peta-lokasi-smk-telkom-purwokerto.jpg |
| pengumuman/figma-stela-panel.png | pengumuman/stela-help-panel.png |
| pengumuman/figma-card-pattern.png | pengumuman/card-background-pattern.png |

## Gambar eksternal yang dijadikan aset lokal

| Nama sumber | Aset lokal |
|---|---|
| WhatsApp-Image-2023-01-20-at-08.26.53.jpeg | showcase/tim-dinacom-2023.jpeg |
| aaass.jpg | alumni/moh-khairudin.jpg |
| asdaddd.jpg | alumni/tenia-wahyuningrum.jpg |
| asdasd.jpg | alumni/alfa-putra-kurnia.jpg |

URL asli, dimensi, dan SHA-256 disimpan dalam asset-image-sources.json sebagai catatan sumber. Nama orang mengikuti data yang sudah ada di dummyData.js dan guruData.js. Gambar tidak dipotong, dikompresi ulang, atau diganti. Foto potret-guru-salam.png tidak diberi nama pribadi karena identitas lengkapnya belum dipastikan.

## Cadangan yang dipertahankan

| Sebelum | Sesudah |
|---|---|
| frontend/scripts/foto-asli/tentang__guru-1.png | frontend/scripts/foto-asli/tentang__ilustrasi-guru-pria-berkacamata.png |
| frontend/scripts/foto-asli/tentang__guru-2.png | frontend/scripts/foto-asli/tentang__ilustrasi-guru-perempuan.png |
| frontend/scripts/foto-asli/tentang__guru-3.png | frontend/scripts/foto-asli/tentang__ilustrasi-guru-perempuan-berhijab.png |
| frontend/scripts/foto-asli/tentang__guru-4.png | frontend/scripts/foto-asli/tentang__ilustrasi-guru-pria-menyambut.png |
| frontend/src/assets/drive/jurusan-rpl.png.backup | frontend/scripts/cadangan-aset/jurusan-rpl-sebelum-pembaruan.png |

## Pemeriksaan kasus serupa

Seluruh 163 gambar di src/assets dan public dipindai. Tidak ditemukan lagi nama gambar produksi yang memakai pola acak aaass/asdasd, WhatsApp, screenshot/download/untitled, angka tanpa konteks guru-1/kegiatan-1, panggilan pak-/bu-, awalan figma-, atau ekstensi backup. Nomor resolusi hero-640/poster-960 dan nomor variasi ruang-kelas-1 tetap sesuai fungsi. Nama login-spmb-2027-2028 dipertahankan karena teks 2027/2028 memang ada dalam gambarnya.

Nama historis di dokumen audit lama dan cadangan foto-asli yang lain tetap menjadi catatan arsip. URL sumber dengan nama lama hanya disimpan untuk atribusi. Nama UUID unggahan admin tetap valid untuk menghindari benturan berkas; isi bucket/database dan deployment tidak diubah atau diaudit dalam tugas ini.

## Temuan isi gambar

Gambar yang sebelumnya bernama kegiatan-4.png menunjukkan praktik panjat menara, tetapi data masih memakainya pada kartu IT Software (src/data/dummyData.js). Nama berkas kini praktik-panjat-menara.png. Ketidakcocokan pemakaian foto dengan kartu dicatat; penamaan saja tidak memperbaiki kecocokan isi. Empat gambar guru bernomor adalah ilustrasi tanpa identitas terverifikasi, sehingga diberi nama berdasarkan tampilan tanpa mengarang nama guru.

## Validasi

- Semua 41 berkas yang dipindahkan dan 4 gambar unduhan memiliki SHA-256 yang sama dengan sumber sebelum perubahan.
- Semua 146 referensi gambar lokal dari import dan URL CSS menunjuk berkas yang tersedia.
- npm.cmd run lint: lulus.
- npm.cmd run build: lulus.
- node scripts/uji-aset-drive.mjs: lulus.
- node scripts/uji-footer-supporters.mjs: lulus.
- node scripts/uji-gambar-responsif.mjs --poster --partners: lulus.
- node --check scripts/uji-arah-aksen.mjs: lulus pemeriksaan sintaks.
- npm.cmd run performa:uji: lulus.
- git diff --check: lulus.
- Browser hasil build: Beranda, BKK (3 foto alumni), Profil Guru (6 foto yang diganti namanya, pada dua halaman carousel), dan Jurusan (gambar DINACOM) berhasil memuat gambar yang diperiksa; tidak ditemukan gambar selesai dimuat dengan naturalWidth 0 pada halaman yang diperiksa.

Tidak ada commit, push, atau deployment yang dijalankan.
