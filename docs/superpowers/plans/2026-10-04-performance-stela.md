# Step 7 — Optimasi artwork STELA Inggris

Status: implementasi, QA dan pengukuran Step 7 selesai; gate performa belum lulus. Rencana berasal dari Step 7 pada handoff pengguna; Step 8 belum dimulai.

Tujuan: kurangi transfer banner Inggris melalui WebP lossless dan kandidat responsif, dengan file sumber, locale, geometri/crop, CTA, alt text dan prioritas pemuatan tetap sesuai kondisi awal.

Pemanggil: StelaAISection pada Beranda, Profil Sekolah, Guru dan Berita; JurusanFaqSection pada Jurusan; PengumumanBantuanCard pada Pengumuman.

## Task 1: Verifikasi baseline dan ukuran tampil

- Cocokkan HEAD, dirty diff dan hash build dengan seri Lighthouse sebelum Step 7. Gunakan enam run EN seri tersebut jika identik.
- Simpan median skor, FCP, LCP, TBT, CLS, transfer, request dan elemen LCP.
- Rekam currentSrc, DPR, ukuran dan crop di enam pemanggil pada mobile DPR 1,75/2, tablet dan desktop.
- Simpan hash sumber dan lima file perubahan sebelumnya.

## Task 2: Varian lossless dan pemilihan responsif

- Tulis dan jalankan tes kontrak gambar yang gagal saat kandidat EN belum tersedia.
- Generator hanya menulis daftar varian EN yang eksplisit, tanpa crop/upscale atau penghapusan sumber.
- Gunakan kandidat dengan ukuran yang didukung source, sizes berdasarkan geometri nyata, dan fallback PNG saat kandidat gagal.
- Pertahankan jalur ID, lazy/eager, geometri dan CTA pada tiga komponen.

## Task 3: Regresi, pengukuran dan review

- Jalankan lint, build, budget, bahasa, artwork, gambar responsif, animasi dan desain publik.
- Rekam kembali semua pemanggil. Periksa source selection, crop, keyboard CTA, pergantian locale dan fallback.
- Bandingkan screenshot dan keterbacaan; uji browser zoom 125/150 jika tersedia dengan bukti bahwa zoom benar-benar berubah.
- Ukur ulang tiga EN mobile dan tiga EN desktop pada build baru. Simpan semua run dan median.
- Review read-only hasil Step 7; perbaiki temuan penting dan laporkan batas hasil.

## Review Focus

Periksa sizes untuk gambar Pengumuman yang lebarnya 156% dari kolomnya; batas resolusi asli pada layar padat; fallback kandidat gagal dan pergantian locale setelah fallback; pelestarian pixel lossless ukuran penuh dan semua sumber; perbedaan observed versus simulated metrics; klaim score/zoom/transfer yang melebihi bukti.

## Keputusan pelaksanaan

- Ruling: lanjut pada checkout fitur saat ini — pengguna meminta meneruskan kondisi yang baru diukur, termasuk perubahan lokal sebelumnya — risiko perubahan lain tercampur ditangani dengan snapshot/hash dan staging terbatas.
- Ruling: gunakan baseline EN dari seri tepat sebelumnya bila build dan diff identik — konfigurasi, versi, cache reset dan locale sudah tercatat — risiko variasi host tetap dilaporkan; penghematan byte diuji secara langsung.

## Hasil Step 7, 4 Oktober 2026

Artwork Inggris kini menggunakan lima kandidat WebP lossless melalui `srcSet`/`sizes` pada ketiga komponen dan enam halaman pemanggil. PNG asli tetap menjadi fallback. Generator hanya menulis lima nama varian yang eksplisit. File sumber ID, PNG Inggris, prioritas pemuatan dan crop bitmap tetap sesuai baseline.

Ukuran PNG sumber: 2172×724, 1.536.011 byte. Metadata sumber RGB tanpa alpha/profile. Varian ukuran penuh mempertahankan seluruh decoded pixel asli; varian kecil memakai resize satu kali lalu encoding lossless. Seluruh varian tepat 3:1 dan tidak melampaui resolusi sumber.

| Varian | Dimensi | Byte file | Penghematan terhadap PNG |
|---|---|---:|---:|
| WebP 720 | 720×240 | 170.368 | 88,91% |
| WebP 960 | 960×320 | 281.678 | 81,66% |
| WebP 1440 | 1440×480 | 590.874 | 61,53% |
| WebP 1920 | 1920×640 | 984.168 | 35,93% |
| WebP 2172 | 2172×724 | 1.154.318 | 24,85% |

Pada konteks baru, Pengumuman desktop memilih WebP 720 untuk bitmap selebar sekitar 630 CSS px. Seri navigasi enam halaman dapat memakai kandidat 1440 yang sudah tersedia dari halaman sebelumnya. Ini dicatat sebagai penggunaan cache browser, bukan dianggap pemilihan terkecil pada setiap navigasi.

| Viewport / DPR | Bitmap penuh: lebar CSS / kandidat | Pengumuman: lebar CSS / kandidat |
|---|---|---|
| 320 / 1 | 288 / 720 | 449,27 / 720 |
| 390 / 2 | 358 / 720 | 558,47 / 1440 |
| 412 / 1,75 | 380 / 720 | 592,80 / 1440 |
| 768 / 2 | 720 / 1440 | 1123,19 / 2172 |
| 1350 / 1 | 1216 / 1440 | 629,72 / 720 pada konteks baru; 1440 pada seri navigasi |
| 1920 / 1 | 1216 / 1440 | 629,72 / 720 pada konteks baru; 1440 pada seri navigasi |

Pengumuman tetap memakai crop/rasio tampil lama: gambar EN selebar 156% dan offset kiri -56% pada panel 565:265. `sizes` memperhitungkan gambar tersebut, termasuk proporsi kolom 565/1630 dan gap 4,23%. Batas kandidat 2172 tetap berlaku ketika kebutuhan pixel, misalnya panel tablet DPR 2, melebihi sumber. Tidak ada janji ketajaman melampaui PNG asli.

## Lighthouse sebelum dan sesudah

Metode: Beranda EN, tiga mobile dan tiga desktop per seri; Chrome 154.0.8037.97, Lighthouse 13.5.0; preset standar dan simulated throttling. Setiap run memakai proses Chrome baru, storage reset aktif, locale diinisialisasi sebelum navigasi. Tidak ada intersepsi/fixture pada benchmark. OS/DNS/TLS dan respons backend live tidak diisolasi.

Baseline seri tepat sebelum Step 7 berhasil dicocokkan dengan HEAD, diff dan hash build awal. Enam run terakhir memakai build production `2e62318` yang dibekukan dan disajikan Vite preview. Berkas HTML serta entry yang disajikan identik dengan disk; source tetap sama selama masing-masing seri pengukuran.

| Median | EN mobile sebelum | EN mobile sesudah | EN desktop sebelum | EN desktop sesudah |
|---|---:|---:|---:|---:|
| Skor | 75 | 65 | 96 | 95 |
| Rentang skor | 74–77 | 60–67 | 96–96 | 94–95 |
| FCP simulated, ms | 1961 | 2381 | 579 | 609 |
| LCP simulated, ms | 5107 | 5679 | 1315 | 1405 |
| TBT simulated, ms | 180,5 | 416 | 5 | 43,5 |
| Speed Index simulated, ms | 3128 | 3545 | 1092 | 1318 |
| CLS | 0 | 0 | 0 | 0 |
| Transfer total, byte | 995.001 | 995.773 | 2.853.131 | 1.908.765 |
| Transfer gambar, byte | 618.570 | 618.570 | 2.476.700 | 1.531.562 |
| Request resource-summary | 56 | 56 | 62 | 62 |
| Item network audit | 64 | 64 | 70 | 70 |

Run skor utama terbaru: mobile sebelum 74/75/77, sesudah 67/60/65; desktop sebelum 96/96/96, sesudah 94/95/95. Tidak ada HTTP error, runtime error, run warning atau audit error pada enam run terakhir.

Desktop memuat banner dalam jangkauan lazy loading meskipun letaknya di bawah fold. Banner berubah dari PNG 1.536.282 byte transfer menjadi WebP 1440 sebesar 591.144 byte transfer: hemat 945.138 byte. Total navigasi desktop turun 944.366 byte atau sekitar 33,1%. Mobile tidak memuat banner saat navigasi awal pada kedua seri; penghematan banner mobile berlaku ketika gambar dimuat setelah scroll. Jangan menyatakan bahwa semua kandidat atau fallback PNG diunduh pada satu navigasi.

Elemen LCP tetap teks logo navbar pada mobile dan poster video About pada desktop. Median observed trace dibedakan dari metrik simulated: mobile observed FCP 161→314 ms dan LCP 600→779 ms; desktop observed FCP 191→338 ms dan LCP 1287→1617 ms. Nilai tersebut tidak dipakai sebagai pengganti skor simulated.

## Pemeriksaan tambahan penurunan mobile

Perubahan paralel menambahkan CTA STELA, mengubah badge About dan menghapus kontrol pause Partners selama pekerjaan ini. HEAD baseline `2e1e9ba` dan HEAD saat pengukuran terakhir `2e62318` berbeda. Selisih seri utama tidak membuktikan kontribusi tunggal Step 7.

Seri antara pada snapshot `3f790b6` memperoleh median mobile 73 (75/73/73) dan desktop 96. Karena mobile turun dua poin, dilakukan tiga pasangan pengukuran tambahan bergantian. Build kontrol mempertahankan UI snapshot tersebut; plugin Vite khusus pengukuran hanya mengganti import helper STELA dengan PNG dan menghapus `srcSet`, `sizes`, `onError` pada tiga pemanggil. Checkout sumber tidak diubah. Probe ketiga komponen mengonfirmasi PNG tanpa `srcset`; kedua build dan seluruh run menggunakan metode/versi yang sama.

| Mobile EN, pasangan tambahan | Tanpa Step 7, UI terbaru | Dengan Step 7, UI terbaru |
|---|---:|---:|
| Skor run 1 / 2 / 3 | 77 / 74 / 76 | 77 / 75 / 73 |
| Median skor | 76 | 75 |
| FCP simulated, ms | 2193 | 2269 |
| LCP simulated, ms | 5094 | 5160 |
| TBT simulated, ms | 183,5 | 183 |
| Speed Index simulated, ms | 3183 | 3114 |
| CLS | 0 | 0 |

Selisih skor per pasangan snapshot `3f790b6`: 0, +1, -3. LCP pasangan pertama/kedua lebih cepat dengan Step 7, pasangan ketiga lebih lambat. Ini tidak menunjukkan arah konsisten pada snapshot tersebut, tetapi median optimasi tetap satu poin lebih rendah dan jumlah sampelnya kecil. Hasil antara dan seluruh artefaknya tetap disimpan.

Setelah seri tersebut, pekerjaan eksternal `2e62318` mengubah CTA EN menjadi link transparan di atas tombol bitmap dan menghapus CTA EN kedua di bawah gambar. Lint/build/budget, artwork, gambar responsif, desain publik, 36 capture, 27 interaksi/fallback dan 13 native zoom diulang pada build baru. Enam run Lighthouse terbaru pada build yang sama menghasilkan median 65 mobile dan 95 desktop seperti tabel utama.

Untuk memeriksa penurunan terbaru, dilakukan tiga pasangan kontrol tambahan pada UI `2e62318` yang identik, bergantian dan dengan Chrome baru pada setiap run. Ini merupakan pemeriksaan gate terakhir; semua hasil dipertahankan.

| Mobile EN, snapshot terbaru `2e62318` | Tanpa Step 7 | Dengan Step 7 |
|---|---:|---:|
| Skor run 1 / 2 / 3 | 67 / 67 / 67 | 62 / 65 / 66 |
| Median skor | 67 | 65 |
| FCP simulated, ms | 2160 | 2370 |
| LCP simulated, ms | 5342 | 5319 |
| TBT simulated, ms | 403,5 | 447 |
| Speed Index simulated, ms | 3406 | 3504 |
| CLS | 0 | 0 |

Selisih skor terbaru -5/-2/-1 konsisten negatif. Median LCP optimasi sedikit lebih cepat, tetapi FCP/TBT dan skor lebih buruk. Karena itu, kriteria tanpa regresi performa konsisten belum lulus dan Step 7 belum dinyatakan tuntas. Implementasi tetap tersedia untuk ditinjau; Step 8 belum dimulai.

Nilai kalibrasi `benchmarkIndex` pada seri utama juga berubah: baseline EN 1815,5–2134, seri terbaru 707–1155,5. Ini membatasi kesetaraan perbandingan antarseri. Kontrol terbaru pun hanya memperoleh 67; penurunan penuh dari baseline 75 belum dapat dikaitkan seluruhnya dengan Step 7. Pemeriksaan long task pasangan kedua menunjukkan biaya style/layout sekitar 994 ms pada kontrol dan 993 ms pada optimasi; script evaluation sekitar 1293 versus 1328 ms. Data ini belum mengisolasi akar penyebab selisih skor. Jangan menyebut CPU host atau satu fungsi tertentu sebagai penyebab yang sudah terbukti.

Manfaat yang langsung terbukti tetap pengurangan byte banner. Menuntaskan gate membutuhkan akar penyebab selisih mobile yang dapat diisolasi atau pengukuran ulang dengan kondisi host yang setara; belum ada perbaikan CPU di luar scope artwork yang diterapkan.

Pemeriksaan Windows sesudah benchmark menunjukkan PowerLineStatus Offline, baterai sekitar 45% dan profil Balanced. Kondisi daya baseline tidak direkam, sehingga data ini hanya menyatakan status saat diperiksa dan tidak membuktikan penyebab skor. Klarifikasi perubahan daya/pekerjaan berat selama pengujian sudah diminta kepada pengguna; informasi tersebut belum tersedia saat laporan disimpan.

## Hasil QA dan review

| Pemeriksaan | Hasil akhir |
|---|---|
| Lint dan build production | Lulus |
| Budget aset dan JavaScript | Lulus: entry 460.136 byte di bawah batas 460.800; 14 varian lebih kecil dari sumber; full STELA pixel identik |
| Bahasa / konten / artwork ID–EN | Lulus, termasuk Pengumuman |
| Gambar responsif `--poster --stela` | Lulus untuk tiga komponen; fallback, ukuran, locale, loading dan CTA |
| Suite penuh `--poster --partners --stela` | Gagal pada assertion `aria-controls="mitra-logo-track"` karena tombol pause dihapus pekerjaan paralel |
| Animasi scroll | Lulus 22 skenario native/Lenis, history, anchor, fokus, cleanup |
| Bundle dan desain publik | Lulus |
| EN responsif enam halaman × enam layar | Lulus 36 kasus; tidak ada overflow/JS error; ukuran/crop bitmap cocok baseline |
| Locale dan keyboard CTA | Lulus 24 kasus ID/EN, mobile/desktop; Tab/fokus/Enter mencapai `/stela` |
| Fallback | Lulus tiga komponen: WebP diblokir, PNG berhasil decode; ID→EN dan pemulihan WebP diuji |
| Native Chrome zoom | Lulus 13 kasus: referensi 100%, enam halaman pada 125% dan 150%, bukti viewport/DPR/pixel screenshot |
| Cold Pengumuman | Lulus empat konteks baru; memilih WebP sesuai DPR, tidak mengunduh PNG lebih dahulu |
| Integritas sumber/perubahan lama | Delapan hash tetap identik: tiga artwork asli dan lima file perubahan sebelum Step 7 |

Screenshot awal zoom yang putih ditolak tes visual: fraksi pixel merah 0 dan deviasi warna 0. Harness diperbaiki dengan profil sementara unik, cache mati, scroll CDP dan screenshot viewport, tanpa mengubah produk. Saat mengulang QA terbaru, observer ScrollToTop dapat memulihkan posisi selama konten asynchronous masih sibuk; keyboard Shift native lebih dahulu menandakan pengguna mengambil kontrol, tanpa scroll bawaan tambahan. Pemeriksaan pixel dilakukan pada bagian bitmap yang benar-benar terlihat, lalu screenshot terbaru enam halaman pada 125/150% diperiksa. Screenshot final menampilkan artwork; geometri dan crop tetap sesuai baseline. Teks kecil pada mobile tetap dibatasi desain bitmap sumber.

Native zoom memakai preferensi Chrome pada profil QA tersendiri. Bukti live: outerWidth tetap 1350; innerWidth 1332→1066→888 dan DPR 1→1,25→1,5; visualViewport scale serta CSS zoom tetap 1. Mekanisme dirujuk dari [pref_names.h Chromium](https://chromium.googlesource.com/chromium/src/+/main/chrome/common/pref_names.h) dan [ChromeZoomLevelPrefs Chromium](https://chromium.googlesource.com/chromium/src/+/114.0.5735.90/chrome/browser/ui/zoom/chrome_zoom_level_prefs.cc), lalu diverifikasi pada Chrome yang terpasang. Ini bukan uji perangkat fisik atau tampilan melalui panel zoom manual.

Review independen menemukan tidak ada masalah produk Critical/Important pada `sizes`, crop, fallback atau pixel aset. Temuan Important bukti zoom dan identitas snapshot sudah diperbaiki; reviewer mengonfirmasi 36/27/13 kasus dan screenshot terbaru `2e62318` valid, tanpa gambar kosong/duplikasi CTA. Perintah reproduksi yang salah juga dibetulkan. Review tersebut mengonfirmasi aset/QA, bukan memberi persetujuan gate skor yang masih gagal. Assertion Partners tetap dilaporkan sebagai masalah integrasi terpisah, bukan diam-diam dihapus atau diklaim lulus. Tidak ada perubahan produk pada Partners, badge About atau desain CTA oleh Step 7 ini.

Pada snapshot antara `3f790b6`, CTA eksternal menambah tinggi wrapper EN mobile. Pada versi terbaru `2e62318`, CTA EN kedua dihapus: capture 412 px menunjukkan bitmap dan wrapper sama-sama 380×126,66 CSS px. Ukuran/crop bitmap tetap sesuai baseline; perubahan ID/CTA eksternal tetap dipertahankan. Lima file perubahan lokal sebelumnya dilindungi hash. Commit eksternal `e833682` memasukkan perubahan `StelaAISection`, `3f790b6` memasukkan helper/lima aset responsif, dan `2e62318` memasukkan koreksi CTA/tes localized. Saya tidak menjalankan commit, push atau deploy.

## Artefak dan reproduksi

- [Perbandingan terbaru dan pemilihan kandidat](D:/LombaTelkom/qa-output/performance-step7-2026-10-04/comparison-latest.json); [perbandingan snapshot antara](D:/LombaTelkom/qa-output/performance-step7-2026-10-04/comparison.json).
- [Baseline yang terverifikasi](D:/LombaTelkom/qa-output/performance-step7-2026-10-04/baseline.json); laporan HTML/JSON dan trace baseline berada pada [folder pengukuran sebelum](D:/LombaTelkom/qa-output/performance-before-step7-2026-10-04/report.md).
- [Enam run terbaru dan environment](D:/LombaTelkom/qa-output/performance-step7-2026-10-04/latest-lighthouse/summary.json); [seri antara](D:/LombaTelkom/qa-output/performance-step7-2026-10-04/after-lighthouse/summary.json). Setiap run menyimpan HTML, JSON, trace dan devtools log pada folder yang sama.
- [Kontrol mobile terbaru](D:/LombaTelkom/qa-output/performance-step7-2026-10-04/paired-mobile-latest/summary.json) dan [config kontrol terbaru](D:/LombaTelkom/qa-output/performance-step7-2026-10-04/control-latest.vite.config.mjs); [kontrol snapshot antara](D:/LombaTelkom/qa-output/performance-step7-2026-10-04/paired-mobile/summary.json).
- [Geometri dan 36 screenshot](D:/LombaTelkom/qa-output/performance-step7-2026-10-04/after-rendered.json), [27 pemeriksaan interaksi/fallback](D:/LombaTelkom/qa-output/performance-step7-2026-10-04/behavior-results.json), [native zoom dan screenshot](D:/LombaTelkom/qa-output/performance-step7-2026-10-04/zoom-results.json), [cold Pengumuman](D:/LombaTelkom/qa-output/performance-step7-2026-10-04/cold-help-results.json), [hash terakhir](D:/LombaTelkom/qa-output/performance-step7-2026-10-04/final-integrity.json).
- [Log kegagalan suite Partners terbaru](D:/LombaTelkom/qa-output/performance-step7-2026-10-04/latest-2e62318-responsive-all.log), [RED screenshot kosong](D:/LombaTelkom/qa-output/performance-step7-2026-10-04/red-zoom-visual.log), [zoom terbaru yang lulus](D:/LombaTelkom/qa-output/performance-step7-2026-10-04/latest-2e62318-zoom.log).

Reproduksi dari frontend: `node scripts/buat-gambar-responsif.mjs stela`, `npm.cmd run lint`, `npm.cmd run build`, `npm.cmd run performa:uji`, `npm.cmd run bahasa:uji`, `node scripts/uji-localized-artwork.mjs`, `node scripts/uji-gambar-responsif.mjs --poster --stela`, `npm.cmd run animasi:uji`, `node scripts/uji-bundle.mjs`, `node scripts/uji-desain-publik.mjs`. Opsi `--partners` masih memicu kegagalan integrasi yang dicatat.

Harness QA memuat path absolut Chrome dan dependency lokal agar sesuai host pengujian. `capture.mjs after`, `behavior.mjs`, `zoom.mjs`, `cold-help.mjs` memakai preview immutable pada 5198. `latest-lighthouse/benchmark.mjs` menyimpan enam audit terbaru; `paired-mobile-latest.mjs` juga membutuhkan preview kontrol pada 5199. Build terbaru berada di `verified-dist-2e62318` dan kontrol di `control-dist-2e62318`. Simpan kedua build saat reproduksi; jangan menimpa dist yang sedang diukur. QA/screenshot snapshot sebelumnya disalin ke `snapshot-3f790b6`.

Build baseline entry `index-BP_A4v7A.js`: 460.137 byte, SHA256 `ae2a7255e4cc122e1d7228bc8e1b3e4e79430ffb673f7270c4bcf11c07ac50fb`. Build antara `index-BaTjUoSn.js`: 460.136 byte, SHA256 `6424ab4c408f8081c91f008d6d980a03f02130ca1b13ba747b3f459299a31e3d`. Build terbaru `index-eEoLJumm.js`: 460.136 byte, SHA256 `ad466cf0deed0fac9a9528a3970660ab8c00f651a1a66ecd0be912548ace38dc`. Build normal terakhir dan salinan immutable terbaru memakai entry yang sama.

Hasil ini merupakan lab lokal production build Beranda EN. Performa deployment, kondisi jaringan/perangkat fisik, cache CDN dan field INP belum diukur. Step 9/10 nanti mencakup konteks tersebut.

## Git handoff

Branch terverifikasi `feat/telkom-public-design`, origin `https://github.com/KiandrAHD/smk-telkom-purwokerto.git`. Template ini hanya menambahkan sisa file Step 7; aset/helper/StelaAISection dan tes localized sudah masuk commit eksternal yang disebut di atas. Gate performa masih gagal; template disediakan untuk peninjauan dan hanya dijalankan jika pengguna memilih menyimpan hasil ini. Jangan menambahkan lima perubahan lama, Partners atau index.css bersama pekerjaan ini tanpa meninjau scope.

```powershell
Set-Location 'D:\LombaTelkom\smk-telkom-purwokerto'
git add -- frontend/scripts/buat-gambar-responsif.mjs frontend/scripts/uji-gambar-responsif.mjs frontend/scripts/uji-performa.mjs frontend/src/components/jurusan/JurusanFaqSection.jsx frontend/src/components/pengumuman/PengumumanBantuanCard.jsx docs/superpowers/plans/2026-10-04-performance-stela.md
git diff --cached --check
git commit -m "perf: lengkapi optimasi responsif artwork STELA Inggris"
git push origin feat/telkom-public-design
```
