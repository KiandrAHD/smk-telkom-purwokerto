# Step 6 — Regresi setelah optimasi

Tanggal: 3 Oktober 2026. Status: pemeriksaan otomatis lokal lulus; gerbang Step 6 belum ditutup penuh karena zoom browser langsung 125/150 persen belum terverifikasi. Step 7 belum dimulai.

## Hasil utama

Satu masalah navigasi ditemukan dan diperbaiki: setelah Beranda terbuka dan pengunjung berpindah ke fragment melalui URL browser, key riwayat dapat dipakai ulang. Komponen scroll menganggapnya pemulihan posisi lama sehingga anchor baru diabaikan. Perubahan sekarang mengikuti fragment baru, sambil mempertahankan posisi Back/Forward dengan key berbeda dan effect replay tanpa perubahan fragment. Desain, bahasa, font, aset, layanan, dan dependencies tidak diubah.

| Pemeriksaan final | Hasil | Bukti |
|---|---|---|
| Lint dan build produksi baru | Lulus | 20-lint.log; 19-final-build.log |
| Budget, markup responsif, bahasa, bundle, artwork, desain publik | Lulus | 21–27 .log |
| Scroll native/Lenis | 22/22 lulus | 24-animation.log |
| Lifecycle Prestasi dan integrasi app | 9/9 lulus | achievements-check.json; 28-deferred.log |
| 42 URL konkret, ID/EN, tiga viewport | 252/252 lulus | regression-results.json; route-matrix.csv; 32-routes.log |
| Interaksi produksi | 46/46 lulus | interaction-results.json; 29-interactions.log |
| Redirect legacy ID/EN | 14/14 lulus | redirect-results.json; 34-redirects.log |
| Console pada 42 URL ID/EN desktop | 84/84 lulus, nol console error | console-results.json; 33-console.log |
| Viewport/DPR dan pemilihan hero | Delapan kombinasi lulus | final-browser-check.json; 30-density.log |
| Perbandingan baseline judul/logo | Enam perbandingan lulus | visual-results.json; enam screenshot pembanding; 31-visual.log |
| Zoom browser langsung 125/150 persen | Belum terverifikasi | Shortcut kontrol tab tidak mengubah innerWidth/DPR |

## Build dan lingkungan

- Repository: D:\LombaTelkom\smk-telkom-purwokerto.
- Branch tetap feat/telkom-public-design; HEAD aefbe556d42c6d9a9b9d69e6bfbd9df41335277e.
- Perbaikan Step 6 masih di working tree. Build dibuat ulang dan server preview direstart setelah perubahan sumber.
- URL yang diuji: http://127.0.0.1:5196. Entry final index-CxXI7zYT.js: 460135 byte, di bawah budget 460800 byte; CSS index-C54AYsxj.css. SHA-256 entry FA0A052638AC12D295C2AEE288EA108FC7E1C32C2D4F0C461BD9B1C1B6232FA3.
- Playwright dari runtime Codex yang tersedia dan Chrome terpasang. Tidak menambah dependency aplikasi.
- Matriks utama: mobile 412×823/DPR 1,75 dengan touch, tablet 768×1024/DPR 2, desktop 1350×940/DPR 1.
- Kombinasi tambahan: 390/2, 412/1,75, 768/2, 1024/1, 1280/1,5, 1440/2, 1536/1,25, 1920/1. Ini emulasi viewport/DPR; bukan perubahan zoom browser, scaling Windows, atau perangkat fisik.
- Bukti mentah: [direktori QA](D:/LombaTelkom/qa-output/performance-step6-2026-10-03). Skrip dan semua hasil tersedia di sana.

## Cakupan route dan data

Matriks memakai akses langsung URL, heading, locale, status loading/error, gambar eager serta gambar di area atas/footer, dan overflow dokumen. Daftar meliputi halaman publik utama, koleksi, keempat detail Jurusan, tujuh jenis detail pelengkap termasuk Profil Guru, dan masing-masing satu detail Prestasi/Berita/Pengumuman yang dipilih dari tautan layanan publik saat run. Seluruh route family publik tersebut dicakup dengan URL representatif; ini bukan pemeriksaan setiap record database.

Respons GET publik dibaca dari layanan dan diputar ulang dalam run agar isi konsisten antarbasa/viewport. Semua respons pertama layanan berhasil; matriks mencatat nol HTTP error, nol request gagal yang tidak dibatalkan navigasi, nol runtime error, nol gambar eager/visible rusak, dan nol overflow dokumen. Request yang dibatalkan saat berpindah halaman dipisahkan dari kegagalan jaringan. Audit console tambahan mencatat nol console error pada 84 kasus desktop. Tidak ada request tulis ke tabel produksi.

Sembilan tes komponen/lifecycle memakai fixture Vite development: sukses, kosong, error API, lambat, tanpa observer, gagal import, unmount sebelum intersection, integrasi anchor/history, serta native fragment dengan key dipakai ulang. Tes produksi tersendiri menguji Prestasi sukses/kosong/lambat/error dalam ID/EN; hasilnya terpisah dari layanan live.

Halaman atur sandi yang dibuka tanpa sesi pemulihan dinyatakan lulus bila menampilkan error terjemahan, tautan pemulihan, dan tidak menampilkan input sandi. Form auth/pendaftaran tidak disubmit. Alur setelah login, upload, data peserta/admin, pemulihan sandi nyata, dan konfirmasi email tidak dicakup.

## Interaksi dan visual

- Keyboard: skip link memfokuskan main; menu terbuka dengan Enter, tertutup dengan Escape dan fokus kembali; indikator fokus menu diperiksa.
- Toggle bahasa berubah, tersimpan selama sesi, dan bertahan setelah refresh.
- Carousel berpindah dengan keyboard; marquee dapat dijeda/dilanjutkan; widget chat dimuat setelah dibuka, memfokuskan input, dan kembali ke tombol saat Escape.
- Iframe video baru dipasang setelah play. Dokumen YouTube disimulasikan; pemutaran/streaming video nyata tidak diklaim. Chat tidak mengirim pertanyaan ke AI eksternal.
- Tautan section, route langsung, refresh route, serta Back/Forward dalam SPA lulus dalam ID/EN pada mobile/desktop.
- Reduced motion mematikan marquee dan tetap mengizinkan navigasi/loading Prestasi.
- Baseline screenshot sebelum Step 5 berasal dari performance-2026-10-03; kiri sebelum optimasi, kanan build final. Teks, family/size/weight font serta width/height h1 dan logo sama; toleransi numerik 0,1 CSS px untuk pecahan transform. x/y dan geometri hero dicatat, bukan assertion kesamaan penuh.
- Perbandingan visual desktop ID dan mobile EN dibaca langsung; komposisi hero, line break, crop, dan spacing area atas tidak menunjukkan pergeseran yang tidak diminta. Resolusi raster responsif memang berubah. Ini bukan klaim pixel-identik seluruh halaman.
- Screenshot penuh ID/EN dan sampel Profil/Jurusan/Pengumuman/Guru, serta kondisi Prestasi, tersimpan. Gambar lazy yang tidak pernah mendekati viewport tidak dinyatakan telah diperiksa satu per satu.

[Perbandingan desktop ID](D:/LombaTelkom/qa-output/performance-step6-2026-10-03/screenshots/compare-id-1350.png) · [Perbandingan mobile EN](D:/LombaTelkom/qa-output/performance-step6-2026-10-03/screenshots/compare-en-412.png) · [Beranda penuh ID](D:/LombaTelkom/qa-output/performance-step6-2026-10-03/screenshots/home-full-id.png) · [Beranda penuh EN](D:/LombaTelkom/qa-output/performance-step6-2026-10-03/screenshots/home-full-en.png)

## Perbaikan dan reproduksi

1. Buka Beranda, scroll ke video, lalu arahkan URL browser ke /#prestasi pada dokumen yang sama.
2. Sebelum perbaikan: state history null, scroll 749 px, section Prestasi masih sekitar 3485,6 px di bawah viewport.
3. Tes reproduksi pada komponen nyata gagal: posisi 749, seharusnya offset anchor 2904. Bukti 16-anchor-red.log.
4. ScrollToTop kini membedakan fragment baru pada key yang sama dari POP yang memulihkan entry berbeda. Dua kasus baru native/Lenis lulus; total 22. Bukti 17-anchor-green.log dan 24-animation.log.
5. Tes browser permanen menambahkan perpindahan native fragment dari halaman yang telah discroll. Integrasi dan seluruh interaksi produksi terbaru lulus.

File tugas: frontend/src/components/ScrollToTop.jsx, frontend/scripts/uji-animasi.mjs, frontend/scripts/uji-prestasi-deferred.mjs, dan laporan ini. Pemeriksaan source menunjukkan ScrollToTop sama antara b6117cc dan aefbe55; masalah yang ditemukan bukan perubahan langsung pada komponen itu oleh Step 5. Build lama secara keseluruhan tidak dijalankan ulang.

Kesalahan harness awal diselesaikan secara terpisah: selector hero ID tidak berlaku pada EN; halaman atur sandi tanpa token memang harus error; teks kosong EN yang benar adalah “No achievements available yet.”; dimensi transform dapat berbeda pecahan kecil. Aplikasi tidak diubah untuk menyesuaikan asumsi tes tersebut. Run awal dan log diagnostik disimpan.

## Catatan yang belum ditutup

1. Zoom browser 125/150 persen belum dapat dibuktikan. Kontrol shortcut tab tidak mengubah skala terukur (innerWidth 1536, DPR 1,25 tetap); itu tidak dinyatakan sebagai keberhasilan zoom. Perlu pemeriksaan langsung melalui menu Chrome: ID/EN Beranda, Jurusan, Pengumuman, Profil/Guru; navbar, line break, artwork STELA, CTA/footer, overflow, dan keyboard. Kembalikan zoom setelah uji.
2. Back setelah full reload pada halaman lain kehilangan posisi scroll sebelumnya. Diagnostik live mobile: tanpa reload 5279→5279; dengan reload 5279→4139, kembali ke anchor Prestasi sekitar 95,6 px. Penyimpanan posisi berada di Map dalam memori. Komponen sebelum Step 5 mempunyai implementasi yang sama, tetapi keseluruhan build lama belum diputar ulang. Kasus ini tetap gagal dan dilaporkan; kelulusan SPA history tidak dipakai untuk menutupnya. Perbaikan fragment tidak menambahkan persistence lintas reload.
3. TV, Samsung Galaxy A07/perangkat fisik, scaling Windows, seluruh rekaman database, alur auth nyata, playback YouTube dan jawaban AI nyata belum diuji.
4. Tidak ada pengukuran Lighthouse baru, cache/compression deployment, Vercel preview/produksi, atau INP lapangan dalam Step 6. Target mobile skor90/LCP2,5s/FCP1,8s tetap belum terbukti tercapai. Skor Step 5 tidak diperbarui berdasarkan smoke test ini.

## Review dan keputusan

Reviewer terpisah membaca diff scoped dan menjalankan 22 tes. Tidak ada Critical/Important. Reviewer menguji empat kondisi tambahan di memori (native/Lenis): saved POP effect replay dan Back pada pathname sama dengan key/hash berbeda; semuanya lulus.

Minor ditunda: empat kondisi tambahan tersebut belum menjadi tes permanen. Tes StrictMode saat ini memeriksa initial PUSH/cleanup; saved POP replay belum dijaga kasus permanen tersendiri. Tidak ada perubahan kode untuk minor ini.

Rulings yang dipakai:

- Tetap pada branch dan working tree pengguna sesuai Step 6. Risikonya bukti berlaku untuk kondisi lokal tercatat, bukan HEAD bersih saja.
- Cakupan tetap Step 6; tidak mulai optimasi EN/render awal. Biayanya Step 7 menunggu gerbang regresi penuh.
- Perbaikan fragment dibatasi pada kondisi key/hash agar tes navigasi utama bisa lulus. Risiko perubahan semantik dicek oleh unit, browser, dan reviewer; tidak mengubah persistence reload.
- Respons GET publik diputar ulang untuk konsistensi matriks. Risikonya perubahan backend di tengah sesi tidak dicakup; layanan first-read dan fixture dipisahkan.
- Native zoom tetap belum terverifikasi; emulasi DPR tidak menggantikannya. Biayanya penutupan penuh Step 6 tertunda.
- Klaim visual dibatasi pada assertion judul/logo dan inspeksi screenshot yang dilakukan; bukan seluruh layout/pixel-identik. Biayanya QA manual tambahan mungkin menemukan hal di luar sampel.
- Masalah Back lintas reload dipertahankan sebagai catatan terbuka karena tidak diperbaiki oleh perubahan scoped fragment. Biayanya pengalaman pemulihan posisi setelah reload masih belum memenuhi perilaku normal browser.
- Tidak commit, push, merge, atau deploy; tidak membuat ulang worktree, tidak menjalankan generator massal, tidak menghapus aset. Pengguna menerima file konkret untuk staging terbatas.

Lima file komponen lokal sebelum tugas cocok SHA-256 awal/akhir. Harness uji-arah-aksen tercatat modified sejak awal, tetapi diff teks awal dan akhir kosong; file tersebut tidak diedit dalam tugas ini. Status awal, patch, hash, dan pemeriksaan integritas disimpan. Dokumen/output lama dipertahankan. Staging tetap kosong.

## Matriks route

| Route konkret | ID 412 | EN 412 | ID 768 | EN 768 | ID 1350 | EN 1350 |
|---|---|---|---|---|---|---|
| `/` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/profil-sekolah` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/profil-sekolah/guru` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/jurusan` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/prestasi` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/bkk` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/berita` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/pengumuman` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/galeri` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/bkk/panduan` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/jurusan/faq` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/jurusan/perbandingan` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/ketentuan-spmb` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/pengumuman/populer` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/pengumuman/semua` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/pengumuman/timeline` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/pengumuman/informasi-penting` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/berita/trending` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/berita/agenda` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/prestasi/galeri` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/stela` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/nexttel` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/ekstrakurikuler` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/lupa-sandi` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/spmb/masuk` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/spmb/daftar` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/spmb/atur-sandi` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/spmb/verifikasi` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/jurusan/rpl` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/jurusan/pg` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/jurusan/tkj` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/jurusan/tjat` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/galeri/tim-siswa-berprestasi` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/berita/agenda/semianar-cyber-security-bersama-telkom` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/bkk/panduan/download-template-cv-profesional` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/bkk/pkl/pkl-it-support-pt-telkom-indonesia` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/bkk/roadmap/rpl` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/jurusan/project/pengolahan-sampah-plastik-berbasis-iot` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/profil-sekolah/guru/firda-ayu-nirmala-s-kom` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/prestasi/siswa-smk-telkom-purwokerto-raih-awardee-fully-funded-green-environment-leadership-berkat-inovasi-pengolahan-sampah-plastik-berbasis-iot` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/berita/kunjungan-smk-darussalam-karangpucung-program-keahlian-pplg` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |
| `/pengumuman/pengumuman-hasil-seleksi-tes-tertulis-microteaching-calon-guru-pplg` | Lulus | Lulus | Lulus | Lulus | Lulus | Lulus |

## Perintah ulang

Dari frontend, jalankan berurutan dan periksa kegagalan sebelum lanjut:

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd run performa:uji
node scripts/uji-gambar-responsif.mjs --poster --partners
npm.cmd run bahasa:uji
npm.cmd run animasi:uji
node scripts/uji-bundle.mjs
node scripts/uji-localized-artwork.mjs
node scripts/uji-desain-publik.mjs
$env:PLAYWRIGHT_MODULE = 'file:///C:/Users/IDEAPAD%20SLIM%203/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'
$env:CHROME_PATH = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
node scripts/uji-prestasi-deferred.mjs
npm.cmd run preview -- --host 127.0.0.1 --port 5196 --strictPort
```

Pada terminal kedua, dengan preview aktif, skrip QA lokal dapat diulang: regression.mjs, interactions.mjs, density.mjs, visual.mjs, console-audit.mjs, redirects.mjs. Skrip ini memakai jalur host dan port di atas; hasil run disimpan di direktori QA yang sama, sehingga salin hasil lama sebelum ulang bila harus mempertahankannya. Ini bukan dependency aplikasi atau tes CI portabel.

## Git handoff

Tidak ada commit/push yang dilakukan dalam Step 6. Stage hanya empat file tugas berikut; enam file lokal awal tidak termasuk.

```powershell
Set-Location 'D:\LombaTelkom\smk-telkom-purwokerto'
git add -- frontend/src/components/ScrollToTop.jsx frontend/scripts/uji-animasi.mjs frontend/scripts/uji-prestasi-deferred.mjs docs/superpowers/plans/2026-10-03-performance-regression.md
git diff --cached --check
git commit -m "fix(frontend): follow native section anchors and verify regressions"
git push origin feat/telkom-public-design
```
