# Penyempurnaan Fasilitas, Profil Sekolah, dan Status Banner

Tanggal pemeriksaan: 14 Oktober 2026. Implementasi dan pengujian dilakukan lokal pada production preview `http://127.0.0.1:4174`.

Facility Detail Card, ukuran School Tour, dekorasi mirror, dan sinkronisasi foto guru sudah diimplementasikan dan diuji. Banner BKK dan Berita belum diubah karena node referensinya belum ditemukan. Pengguna menyatakan akan memberikan tautan node Figma yang tepat.

## 1. Referensi dan batas perubahan

File Figma: [Figma-MCP](https://www.figma.com/design/ca2iX76GpJSr0QC7Qyv9RV/Figma-MCP?node-id=221-2084).

- Canvas yang diaudit: `Telkom remake again`, node `221:2084`.
- Card: frame `FASILITAS SEKOLAH 1`, node `229:14479`; panel referensi berukuran 1599 × 656.
- School Tour dan dekorasi: frame `FASILITAS SEKOLAH 2`, node `229:15290`.
- Profil Sekolah: frame `221:3169` dan data Profil Guru yang sudah tersedia dalam proyek.
- Metadata seluruh file juga diperiksa untuk menemukan banner BKK/Berita. Frame yang sesuai belum teridentifikasi.

Dekorasi card diekspor dari node Figma `229:15246`, `229:15279`, `229:15281`, dan `229:15271`. Foto contoh di card Figma tidak dipakai: identitas Gedung A/B.21 dan foto aktivitas jaringan pada contoh tidak membuktikan kecocokan ruang kelas. Implementasi memakai identitas dan foto dari data fasilitas proyek.

Navbar, footer, font global, Hero, marquee, Quick Access Cards, dan daftar fasilitas tidak didesain ulang. Tidak ada dependency baru, commit, push, atau deployment.

## 2. Sebelum dan sesudah

| Bagian | Penyebab/kondisi sebelumnya | Perubahan |
|---|---|---|
| Detail fasilitas | Preview kecil menampilkan satu gambar; hotspot gedung belum memberi pemilihan ruang dan seluruh galeri | Card dua kolom dengan informasi, pemilih ruang terverifikasi, galeri bertumpuk, navigasi, indikator, dan dekorasi Figma |
| School Tour | Lebar stage dihitung dari viewport penuh sampai 3142 px; tinggi mengikuti rasio sehingga mencapai sekitar 1056 px | Wrapper mengikuti container 1280 px; stage maksimum 1600 px dan tinggi sekitar 538 px |
| Dekorasi | Motif kiri berada dalam stage yang ikut berpanning | Dua motif identik berada di background viewport; motif kanan dicerminkan secara horizontal |
| Foto guru | Profil Sekolah menggunakan sumber foto lama yang berbeda dari Profil Guru | Pencocokan nama lengkap terhadap sumber Profil Guru; hanya properti foto yang disalin |
| Reopening card | Permintaan lokasi dari daftar dapat diproses kembali ketika dependency berubah | Permintaan dikonsumsi sekali dan callback lama dibatalkan dengan nomor intent |
| Banner BKK/Berita | Node target belum terverifikasi | Dipertahankan sampai tautan node tersedia |

Pada viewport 1920 px:

| Pengukuran | Sebelum | Sesudah |
|---|---:|---:|
| Lebar viewport peta | 1920 px | 1280 px |
| Lebar stage peta | 3142 px | 1600 px |
| Tinggi visual peta | 1055,55 px | 537,52 px |
| Rasio sumber | 2164:727 | 2164:727 |

Tinggi berkurang sekitar 49%. Ini berasal dari dimensi layout, bukan transform scale seluruh peta. Pada mobile, stage minimum 960 px dan tinggi sekitar 323 px tetap bisa dipanning di dalam viewport. Posisi hotspot tetap memakai koordinat relatif terhadap stage, sedangkan ukuran pin/tombol mempertahankan keterjangkauan interaksi.

## 3. Detail Card, state, Close, dan reopening

Card berada sesudah kontrol panning agar peta dan hotspot tetap dapat digunakan ketika informasi terbuka. Pada breakpoint `md` ke atas, informasi dan galeri memakai dua kolom dengan proporsi 2:3. Mobile memakai satu kolom.

State posisi peta tetap dikelola oleh `useCampusPan`. Pilihan hotspot (`active`) terpisah dari status keluar (`closing`), pilihan ruang, dan indeks foto galeri. Callback panning tidak menjadi sumber visibility card.

- Klik hotspot menetapkan fasilitas dan active state.
- Pemilih ruang menampilkan hanya empat ruang existing pada gedung tersebut.
- Permintaan dari tombol “Lihat lokasi di peta” membawa nama ruang, sehingga card membuka ruang yang sama dengan modal daftar.
- Tombol X dan Escape memulai exit fade/translate/scale ringan selama 280 ms. Setelah selesai, card dilepas dari DOM.
- Close mempertahankan posisi pan, lalu mengembalikan fokus ke hotspot yang masih terlihat atau viewport peta.
- Nomor intent membatalkan callback lokasi yang kedaluwarsa. Timer Close lama dibatalkan jika pengguna memilih hotspot baru.
- Permintaan lokasi eksternal dikonsumsi sekali; rerender atau pergantian bahasa tidak membukanya kembali.
- Tidak ada localStorage untuk visibility card. Penyimpanan hint drag yang sudah ada tetap dipertahankan.
- Pergantian fasilitas mempertahankan konten lama sebagai layer inert/aria-hidden selama crossfade 260 ms.

Card memakai dialog nonmodal, nama yang diumumkan melalui `aria-live`, kontrol berlabel, status foto, dan pemulihan fokus. Peta tidak dikunci oleh dialog.

## 4. Galeri dan kelengkapan foto

Galeri memakai kembali hook `useSlidingPage`/GSAP yang sudah tersedia. Parameter arah opsional ditambahkan agar navigasi melingkar tetap bergerak sesuai tombol Previous/Next. Pemanggil lama tetap memakai perilaku default.

- Sliding horizontal 500 ms dengan easing `power3.out`.
- Previous, Next, indikator aktif yang dapat diklik, tombol arah keyboard, serta swipe horizontal mobile.
- Transisi yang masih berjalan tidak ditumpuk oleh rapid clicking.
- Swipe galeri tidak menggerakkan peta; gesture vertikal tetap menggulir halaman.
- Satu foto menyembunyikan navigasi dan indikator yang tidak diperlukan.
- Foto utama dan foto samping memakai ukuran container tetap serta `object-contain`; rasio dan seluruh foto tetap terjaga.
- Metadata galeri kelas dimuat melalui dynamic import setelah kelas yang memiliki foto dipilih. Aset WebP responsive yang sudah tersedia tetap digunakan melalui `srcSet`/`sizes`.
- Foto samping lazy; foto aktif dimuat segera setelah card dibuka. Tidak ada unduhan semua 91 foto saat halaman pertama dibuka.
- Foto gagal dimuat atau belum tersedia menampilkan fallback yang jelas, bukan foto fasilitas lain.

| Ruang existing | Foto relevan | Status card |
|---|---:|---|
| Kelas A 1.4 | 6 | Galeri asli |
| Kelas A 2.2 | 6 | Galeri asli |
| Kelas A 3.4 | 6 | Galeri asli |
| Kelas A 3.6 | 6 | Galeri asli |
| Kelas B 1.4 | 7 | Galeri asli |
| Kelas B 1.5 | 6 | Galeri asli |
| Kelas B 2.3 | 7 | Galeri asli |
| Kelas B 2.5 | 6 | Galeri asli |
| Kelas C 2.2 | 8 | Hanya set kursi merah `.jpeg`, sesuai konfirmasi pengguna |
| Kelas C 2.3 | 0 | Belum memiliki dokumentasi |
| Kelas C 3.2 | 5 | Galeri asli |
| Kelas C 3.3 | 0 | Belum memiliki dokumentasi |
| Kelas D 1.2 | 9 | Galeri asli |
| Kelas D 2.1 | 7 | Galeri asli |
| Kelas D 2.2 | 0 | Belum memiliki dokumentasi |
| Kelas D 3.1 | 12 | Galeri asli |

Total: 16 ruang existing, 13 ruang dengan 91 foto, 3 ruang tanpa foto. Ruang tambahan dari ZIP tidak ditambahkan. Fasilitas lain menggunakan gambar terverifikasi yang sudah ada jika tersedia; hotspot yang hanya memiliki nama/lokasi tanpa dokumentasi tetap menggunakan fallback.

## 5. Aksen mirror dan design system

Motif merah/abu-abu menggunakan aset `motif.svg` yang sama pada kiri dan kanan. Keduanya memiliki ukuran yang sama, berada di belakang gambar peta dan hotspot, dan tidak menangkap pointer. Hanya gambar kanan menggunakan `scaleX(-1)` melalui utility Tailwind; teks, hotspot, dan kontrol tidak dicerminkan.

Heading memakai token font Poppins proyek; isi mengikuti font utama Inter. Warna memakai token `primary`/`dark`, shadow memakai `shadow-card`/`shadow-soft`, border-radius dan jarak memakai utility yang sudah tersedia. Container peta mengikuti `max-w-7xl`; card maksimum 72 rem. CSS tambahan dibatasi pada selector `campus-*`.

Dekorasi SVG mempertahankan bentuk dan ukuran root ekspor Figma; wrapper menyesuaikan ukuran tampil. Tombol Close memakai ikon dan focus styling proyek. Reduced motion menonaktifkan entrance/crossfade/slide animasi, tanpa mematikan fungsi navigasi.

## 6. Sinkronisasi foto guru

`schoolTeacherData` mencocokkan nama lengkap terhadap `profilGuruData`, lalu menyalin hanya `image`, `thumbnail`, dimensi, responsive sizing, dan crop. Nama, jabatan, bidang, deskripsi, dan urutan 13 guru pada carousel Profil Sekolah tetap sama.

| Guru | Hasil |
|---|---|
| Firda Ayu Nirmala, S.Kom. | Foto terbaru dari Profil Guru |
| Herdiyanto, S.Sos.I., M.Pd. | Foto terbaru dari Profil Guru |
| Arif Munandar, S.Si. | Foto terbaru dari Profil Guru |
| Ragil Rudi Priyanto, S.Si. | Foto terbaru dari Profil Guru |
| Andang Jaka Patrianta, S.Pd. | Foto terbaru dari Profil Guru |
| Anggita Laras Pratama, S.Pd., M.Pd. | Foto terbaru dari Profil Guru |
| Keksi Manik Setyawati, S.Pd. | Foto terbaru dari Profil Guru |
| Finka Ayu Fitriani, S.Pd. | Foto terbaru dari Profil Guru |
| Reza Aditya Permana, S.Kom. | Foto terbaru dari Profil Guru |
| Agus Indra Cahaya, S.Kom. | Foto sebelumnya dipertahankan; tidak ada nama cocok pada sumber terbaru |
| Bayu Aji Sukma, S.Si. | Foto sebelumnya dipertahankan; tidak ada nama cocok pada sumber terbaru |
| Sutri Aniroh, S.Kom. | Foto sebelumnya dipertahankan; tidak ada nama cocok pada sumber terbaru |
| Desti Nurcahyani, S.Pd.Si. | Foto sebelumnya dipertahankan; tidak ada nama cocok pada sumber terbaru |
| Aris Puji Santoso, S.Kom., M.M. — Kepala Sekolah | Foto sebelumnya dipertahankan; tidak tersedia pada dataset Profil Guru |

Sembilan foto terbaru memakai WebP dan sumber responsive 240/480 px yang sudah tersedia. Crop 4:5 mengikuti komponen `TeacherPhoto`; foto lama tetap memakai framing sebelumnya. Tidak ada pencocokan berdasarkan kemiripan wajah atau penggantian orang secara asumtif.

## 7. Hasil validasi

| Pemeriksaan aktual | Hasil |
|---|---|
| `npm.cmd run lint` | Lulus, exit 0 |
| `npm.cmd run build` | Lulus, exit 0; 19,16 detik |
| `git diff --check` | Lulus; hanya pemberitahuan konversi LF/CRLF dari Git |
| `uji-campus-explorer.mjs` | Lulus: dimensi/batas pan, threshold gesture, hint/storage failure, ID hotspot, shared room data |
| `uji-sinkronisasi-foto-guru.mjs` | Lulus: urutan dan metadata tetap, 9 foto diperbarui/4 dipertahankan, responsive source dan crop sesuai canonical data |
| `uji-campus-explorer-browser.mjs` | Lulus: 12 hotspot, mouse/touch/trackpad/keyboard/slider, bounded movement, resize, drag versus click, hint, lokasi dari daftar, error/retry, 14 kasus viewport/bahasa, reduced motion |
| `uji-fasilitas-refinement-browser.mjs` | Lulus: semua 16 ruang, galeri asli, arah navigasi, dots, rapid click, Close/reopening, tidak reopen setelah drag/slider/pergantian bahasa, swipe horizontal dan scroll vertikal, 13 guru/4 halaman |
| Responsivitas card | Lulus 12 kasus: 1920/1440/1024/768/390/360 px × ID/EN; tanpa horizontal overflow |
| Regresi `uji-halaman-fasilitas.mjs` | Lulus: route/refresh/scroll atas, filter, 16 modal/Escape/fokus, 12 viewport/bahasa, carousel Beranda, menu desktop/mobile, runtime |
| Foto guru tablet/mobile | Lulus pemeriksaan tambahan 768/390 px: foto termuat, frame 4:5, tanpa horizontal overflow |
| Error runtime/gambar dalam QA refinement | 0 error runtime dan 0 asset gambar gagal dimuat |
| Typecheck terpisah | Tidak tersedia: proyek JSX dan tidak memiliki script typecheck |

Preview yang diuji berasal dari production build. Pemeriksaan visual dilakukan pada screenshot desktop/mobile, termasuk perbandingan komposisi card terhadap referensi Figma. Hasil mengikuti struktur referensi, tetapi tidak dinyatakan pixel-perfect: font website, pemilih ruang, kontrol aksesibilitas, dan foto asli berbeda dari contoh Figma. Tinggi card mengikuti konten dan breakpoint, bukan ukuran frame yang dipaksakan.

Pengujian touch menggunakan Chrome/CDP emulasi perangkat, bukan perangkat fisik. Tidak ada pengukuran Lighthouse/LCP/CLS baru; laporan ini tidak menyimpulkan perubahan skor performa.

## 8. Bukti visual dan log

- [School Tour sebelum](../../outputs/refinements-2026-10-14/school-tour-before.png) dan [sesudah pada 1920 px](../../outputs/refinements-2026-10-14/school-tour-1920-id.png).
- [Detail Card sebelum](../../outputs/refinements-2026-10-14/facility-card-before.png), [sesudah desktop](../../outputs/refinements-2026-10-14/facility-card-1440-id.png), dan [mobile](../../outputs/refinements-2026-10-14/facility-card-390-id.png).
- [Guru sebelum](../../outputs/refinements-2026-10-14/teachers-before.png), [sesudah desktop](../../outputs/refinements-2026-10-14/teachers-after.png), [tablet](../../outputs/refinements-2026-10-14/teachers-768.png), dan [mobile](../../outputs/refinements-2026-10-14/teachers-390.png).
- [Hasil card/room/responsive/guru](../../outputs/refinements-2026-10-14/refinement-results.json), [hasil panning](../../outputs/refinements-2026-10-14/pan/results.json), dan [hasil foto tablet/mobile](../../outputs/refinements-2026-10-14/teacher-responsive-results.json).
- [Log lint](../../outputs/refinements-2026-10-14/lint.log), [build](../../outputs/refinements-2026-10-14/build.log), [card](../../outputs/refinements-2026-10-14/card-qa.log), [panning](../../outputs/refinements-2026-10-14/pan-qa.log), dan [regresi](../../outputs/refinements-2026-10-14/regression.log).

## 9. File yang ditambahkan/diubah

Path berikut relatif terhadap `frontend/`.

| File | Perubahan |
|---|---|
| `src/components/fasilitas/CampusExplorer.jsx` | Container peta, mirror, lokasi card, pengamanan Close/reopening dan permintaan ruang |
| `src/components/fasilitas/CampusExplorer.css` | Card responsif, crossfade, stacked gallery, dekorasi, reduced motion |
| `src/components/fasilitas/CampusPreview.jsx` | Informasi fasilitas, pemilih ruang, galeri/carousel, fallback dan aksesibilitas |
| `src/utils/campusPan.js` | Dimensi stage compact, rasio tetap dan batas pan |
| `src/data/campusData.js` | Hubungan gedung dengan ruang existing dan foto terverifikasi |
| `src/data/translationsFasilitas.js` | Label galeri/pemilih ruang ID/EN |
| `src/pages/FasilitasPage.jsx` | Permintaan lokasi membawa nama ruang yang dipilih |
| `src/hooks/useSlidingPage.js` | Parameter arah opsional untuk wrap carousel |
| `src/data/schoolTeacherData.js` | Baru: sinkronisasi properti foto dari sumber Profil Guru |
| `src/components/tentang/TentangKepalaSekolahSection.jsx` | Menggunakan data foto tersinkronisasi |
| `src/data/profilGuruData.js` | Komentar cakupan diperbarui agar sesuai sinkronisasi foto yang diminta |
| `src/assets/fasilitas/campus/detail/card-accent.svg` | Baru: dekorasi asli Figma |
| `src/assets/fasilitas/campus/detail/corner-top.svg` | Baru: dekorasi sudut asli Figma |
| `src/assets/fasilitas/campus/detail/corner-bottom.svg` | Baru: dekorasi sudut asli Figma |
| `src/assets/fasilitas/campus/detail/carousel-arrow.svg` | Baru: panah galeri asli Figma |
| `scripts/uji-campus-explorer.mjs` | Harapan dimensi dan data ruang diperbarui |
| `scripts/uji-campus-explorer-browser.mjs` | QA mengikuti ukuran peta dan struktur galeri baru |
| `scripts/uji-fasilitas-refinement-browser.mjs` | Baru: QA card, galeri, room mapping, Close, responsive, touch dan guru |
| `scripts/uji-sinkronisasi-foto-guru.mjs` | Baru: validasi kecocokan foto dan metadata guru |
| `docs/fasilitas-profil-banner-refinement-2026-10-14.md` | Laporan ini |

Screenshot/log QA berada di `outputs/refinements-2026-10-14/` pada root repository dan tidak dimasukkan dalam perintah commit source di bawah.

## 10. Item yang masih memerlukan data

1. Banner BKK dan Berita: menunggu tautan node Figma sesuai jawaban pengguna. Keduanya belum diubah.
2. Foto terbaru untuk empat guru yang tidak ada dalam dataset Profil Guru dan kepala sekolah, jika ingin ikut diperbarui.
3. Foto Kelas C 2.3, C 3.3, dan D 2.2 serta dokumentasi hotspot fasilitas yang belum memiliki foto terverifikasi.

## 11. Git handoff manual

Branch terverifikasi: `feat/fasilitas-sekolah`. Remote origin terverifikasi: `https://github.com/KiandrAHD/smk-telkom-purwokerto.git`. Tidak ada commit/push otomatis.

Jalankan setelah meninjau perubahan:

```powershell
Set-Location 'D:\LombaTelkom\smk-telkom-purwokerto'
git add -- frontend/src/components/fasilitas/CampusExplorer.jsx frontend/src/components/fasilitas/CampusExplorer.css frontend/src/components/fasilitas/CampusPreview.jsx frontend/src/utils/campusPan.js frontend/src/data/campusData.js frontend/src/data/translationsFasilitas.js frontend/src/pages/FasilitasPage.jsx frontend/src/hooks/useSlidingPage.js frontend/src/data/schoolTeacherData.js frontend/src/components/tentang/TentangKepalaSekolahSection.jsx frontend/src/data/profilGuruData.js frontend/src/assets/fasilitas/campus/detail/card-accent.svg frontend/src/assets/fasilitas/campus/detail/corner-top.svg frontend/src/assets/fasilitas/campus/detail/corner-bottom.svg frontend/src/assets/fasilitas/campus/detail/carousel-arrow.svg frontend/scripts/uji-campus-explorer.mjs frontend/scripts/uji-campus-explorer-browser.mjs frontend/scripts/uji-fasilitas-refinement-browser.mjs frontend/scripts/uji-sinkronisasi-foto-guru.mjs frontend/docs/fasilitas-profil-banner-refinement-2026-10-14.md
git diff --cached --stat
git commit -m "Refine campus facility details and synchronize school teacher photos"
git push origin feat/fasilitas-sekolah
```
