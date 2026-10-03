# Step 3 — Baseline performa Beranda

Tanggal: 3 Oktober 2026, Asia/Jakarta. Status: baseline lokal selesai; belum ada optimasi aplikasi.

## Target dan integritas

| Item | Nilai |
| --- | --- |
| Repository | D:\LombaTelkom\smk-telkom-purwokerto |
| Branch | feat/telkom-public-design |
| HEAD | 3b3a4e4420e495449ba4c83c413d7f68c4b27ff5 |
| Target | http://127.0.0.1:5191/ — Beranda, bahasa Indonesia |
| Build | Produksi Vite, dilayani vite preview; bukan Vite dev server |
| Entry | index-DYhK2gRc.js, 460048 byte mentah |
| SHA-256 entry | 83df579916b2ab1b977a36d61d731743783e8faaa3c9c34ce4649a032a053703 |

Yang diuji adalah working tree, termasuk perubahan lokal yang sudah ada sebelum pengukuran. Hash 461 file tracked, HEAD, branch, patch tracked, index, dan entry build tidak berubah selama pengukuran. Perubahan baru tahap ini hanya laporan Markdown dan JSON; tidak ada source, aset, dependency proyek, commit, push, atau deployment yang diubah. Dua direktori profil browser lama tetap dipertahankan.

Build produksi lulus (exit 0). Tes `npm.cmd run animasi:uji --prefix frontend` juga lulus, mencakup 20 skenario. Catatan kegagalan harness pada laporan Step 2 adalah hasil historis sebelum perbaikannya; tidak menjadi status tes animasi saat baseline ini.

## Metode pengukuran

Lighthouse 13.5.0 dengan Chrome 154.0.8037.97 headless, host Windows dan Intel Core i5-13420H. Tiga run mobile dan tiga run desktop dijalankan bergantian tanpa pengujian browser berat lain secara bersamaan: M1, D1, M2, D2, M3, D3. Kategori yang diukur hanya performance. Semua run valid, tanpa runtime error, audit error, run warning, atau respons HTTP 400 ke atas yang tercatat di audit jaringan.

| Pengaturan | Mobile | Desktop |
| --- | --- | --- |
| Viewport CSS | 412 × 823 | 1350 × 940 |
| DPR | 1,75 | 1 |
| Profil | Default mobile Lighthouse | Preset desktop Lighthouse |
| Throttling | simulate | simulate |
| RTT model | 150 ms | 40 ms |
| Throughput model | 1638,4 Kbps | 10240 Kbps |
| CPU slowdown model | 4× | 1× |
| Browser storage/cache | Reset; proses Chrome baru per run | Reset; proses Chrome baru per run |

Detail seluruh setting asli tersedia dalam JSON. Cache OS, DNS/TLS, kondisi CPU host, serta layanan Google Fonts dan Supabase tidak diisolasi sepenuhnya. Median dihitung secara independen untuk tiap metrik, tanpa membuang run yang skornya rendah. Median gabungan tidak harus mewakili satu run tertentu.

Simulated throttling menghasilkan perkiraan performa dari trace. Waktu observed pada trace dan breakdown LCP tidak sama dengan metrik simulated yang dipakai untuk skor, sehingga tidak boleh dijumlahkan atau dibandingkan seolah-olah keduanya satu timeline. Lihat [dokumentasi throttling Lighthouse](https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md). Skor juga dipengaruhi variasi lingkungan dan bobot metrik; lihat [dokumentasi performance scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring).

## Hasil enam run

| Run | Waktu mulai WIB | Skor | FCP | LCP | TBT | CLS | Elemen LCP menurut Lighthouse |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Mobile 1 | 16:40:03 | 70 | 2,280 s | 7,300 s | 196,5 ms | 0 | Gambar hero header-jurusan |
| Desktop 1 | 16:41:03 | 91 | 0,667 s | 1,881 s | 2 ms | 0 | Poster video profil-hero pada Tentang |
| Mobile 2 | 16:41:26 | 59 | 4,171 s | 8,157 s | 267 ms | 0 | Teks logo navbar |
| Desktop 2 | 16:41:49 | 90 | 0,660 s | 1,806 s | 5,5 ms | 0 | Poster video profil-hero pada Tentang |
| Mobile 3 | 16:42:14 | 68 | 2,590 s | 7,414 s | 219 ms | 0 | Gambar hero header-jurusan |
| Desktop 3 | 16:42:36 | 93 | 0,678 s | 1,563 s | 30,5 ms | 0 | Gambar hero header-jurusan |

| Median | Mobile | Desktop |
| --- | --- | --- |
| Skor | 68 | 91 |
| FCP | 2,590 s | 0,667 s |
| LCP | 7,414 s | 1,806 s |
| Speed Index | 3,451 s | 1,299 s |
| TBT | 219 ms | 5,5 ms |
| CLS | 0 | 0 |
| Rentang skor | 59–70 | 90–93 |

Mobile mengalami keterlambatan munculnya konten utama pada model jaringan/CPU yang lebih lambat. CLS 0 tidak menunjukkan pergeseran layout pada keenam navigasi ini. Ini belum membuktikan seluruh interaksi atau seluruh halaman bebas masalah. Rentang skor mobile cukup lebar; hasil berikutnya harus tetap memakai tiga run dan median dengan konfigurasi yang sama.

## Temuan berdasarkan trace dan source

| Prioritas untuk analisis Step 4 | Status | Lokasi | Bukti | Tindak lanjut yang perlu diuji |
| --- | --- | --- | --- | --- |
| Tinggi | Terkonfirmasi | frontend/src/components/HeroSection.jsx:61–66 | Gambar hero menjadi LCP pada M1/M3/D3. Source 1920 × 902 ditampilkan 354 × 166 CSS px di mobile DPR 1,75; tidak ada srcSet/sizes. Sudah memiliki fetchPriority high dan tidak lazy, tetapi audit menyatakan request belum ditemukan dalam HTML awal. | Uji kandidat ukuran responsif dengan artwork yang sama serta penemuan request lebih awal. Verifikasi build URL dan pemilihan kandidat sebelum menambah preload; hindari preload global untuk semua route. |
| Tinggi | Terkonfirmasi; besar dampak perlu eksperimen | frontend/src/components/PartnersSection.jsx:15–31; frontend/src/components/VideoEmbed.jsx:35–45 | Gambar mengambil 1064216 dari 1499006 byte transfer M1, sekitar 71%. Background partners 284699 byte dan poster video 145309 byte sudah dimuat; tidak memiliki loading lazy. Audit memperkirakan penghematan gambar total 689467 byte (sekitar 673 KiB), bukan penghematan yang sudah tercapai. | Pisahkan gambar di luar viewport dari gambar LCP. Uji varian terkompresi/ukuran responsif dan penundaan gambar yang benar-benar di luar layar. Poster Tentang justru LCP pada D1/D2, sehingga jangan memberikan lazy kepada semua poster tanpa membedakan konteks. |
| Tinggi | Terkonfirmasi; penyebab tunggal belum dibuktikan | frontend/index.html:14–16; frontend/src/index.css:4–5; navbar span.font-heading | CSS Google Fonts dan CSS aplikasi tercatat render blocking. Estimasi penghematan FCP mobile 450/1350/450 ms. M2 mengidentifikasi teks logo sebagai LCP; observed render delay 1217,946 ms. CSS Fonts desktop D2 memerlukan sekitar 1003 ms pada jaringan aktual. | Uji penyajian font yang lebih stabil sambil mempertahankan Inter/Poppins dan seluruh weight yang benar-benar dipakai. Ukur ulang untuk membedakan pengaruh font, CPU, dan render aplikasi. Jangan menganggap font satu-satunya penyebab M2. |
| Sedang | Terkonfirmasi; bukan dead code global | frontend/src/components/AchievementsSection.jsx:17–22; frontend/src/services/prestasiService.js:getPrestasi | Supabase SDK dimuat dan prestasi di-fetch pada mount meski section jauh di bawah hero. M1 menunjukkan rantai document → entry → SDK → REST prestasi dengan ujung observed sekitar 1,476 s. Audit JS M1 memperkirakan 103235 byte tidak dipakai dalam sesi ini, termasuk 43094 byte dari SDK. | Tinjau urutan import, kebutuhan auth, cache, dan pemuatan data per section. Uji penundaan hanya bila tidak mengubah readiness, state/error, atau navigasi ke prestasi. Jangan menghapus SDK atau fungsi CRUD berdasarkan satu coverage Beranda. |
| Sedang | Terkonfirmasi | Entry JS dan audit resource-summary | Entry mentah 460048 byte hampir menyentuh budget 460800 byte; browser menerima sekitar 147062 byte transfer entry. Total script 37 request/335565 byte. 135 chunk build bukan 135 request awal. | Tinjau isi entry dan chunk yang benar-benar diminta sebelum memecah bundle. Pertahankan chunk route yang sudah ada dan uji interaksi setelah perubahan. |

Plus Jakarta Sans ada pada link font bersama, tetapi tidak dimuat sebagai font binary oleh keenam sesi Beranda ini. Font tersebut masih direferensikan oleh `frontend/src/components/pengumuman/PengumumanBantuanCard.jsx:10`; statusnya bukan dependency/aset global yang aman dihapus.

Estimasi penghematan audit tidak bersifat aditif dan tidak menjamin kenaikan skor. Belum ada optimasi yang diterapkan. Render delay pada poster desktop juga perlu dianalisis bersama `frontend/src/components/Reveal.jsx` sebelum mengubah animasi: wrapper tetap merender children dan hanya mengatur visibilitas; ia tidak menunda download gambar.

## Sampel breakdown yang harus dibaca terpisah

| Mobile 3 — observed, bukan simulated | Durasi |
| --- | --- |
| TTFB | 4,048 ms |
| Resource load delay | 300,538 ms |
| Resource load duration | 3,564 ms |
| Element render delay | 355,977 ms |
| Observed LCP, dibulatkan | 664 ms |
| Simulated LCP untuk skor | 7414,248 ms |

Selisih besar ini dipengaruhi model throttling Lighthouse dan origin aset lokal. Karena itu, breakdown observed bukan bukti gambar selesai dalam 3,6 ms pada ponsel/jaringan seluler sungguhan.

## Pemeriksaan tampilan pendukung

Pemeriksaan Playwright terpisah, tanpa throttling, setelah seluruh run Lighthouse selesai. Viewport ID: 412, 768, 1350, 1920 px; EN: 412 dan 1350 px. Pada keenam tampilan awal, document width sama dengan viewport, tidak ada gambar visible yang broken, page/console error, request gagal, atau respons HTTP 400 ke atas. Font heading dan teks logo tetap Poppins dengan fallback Inter. Screenshot ID mobile/desktop ditinjau secara visual.

Lingkupnya hanya smoke check tampilan awal Beranda. Tidak menguji semua route, footer setelah scroll, login, formulir, keyboard, seluruh gambar offscreen, animasi interaktif, atau skor EN. Ini bukan pengukuran TV atau ponsel fisik.

## Perbedaan dari deployment

HTML `https://smk-telkom-purwokerto.vercel.app/` diperiksa read-only dan merespons 200 dengan entry `index-j9KO-VtP.js`. Entry lokal `index-DYhK2gRc.js` berbeda; commit deployment tidak diketahui. Pengukuran enam run di atas adalah baseline lokal, bukan skor website online dan bukan perbandingan langsung dengan angka historis Desktop 99/Mobile 80/TV 100 atau PageSpeed sebelumnya. Latensi CDN/host publik dan metrik pengguna nyata belum diukur.

## Artefak dan pengulangan

Ringkasan terstruktur: `docs/superpowers/plans/2026-10-03-performance-baseline.json`. File ini mencatat setting, metrik seluruh run, node LCP, resource summary, hash artefak, dan batas pengujian tanpa header autentikasi.

Raw JSON, HTML, DevTools log, trace, checkpoint, dan screenshot disimpan di luar repository: `D:\LombaTelkom\qa-output\performance-2026-10-03`. Nama run `local-mobile-1` sampai `local-mobile-3`, serta `local-desktop-1` sampai `local-desktop-3`. Misalnya `local-mobile-3.report.html` dan `local-mobile-3-0.trace.json`. Jangan stage direktori raw ini atau direktori outputs lama.

Pengulangan dari repository root, menggunakan dua terminal PowerShell:

```powershell
# Terminal 1: production build and preview
npm.cmd run build --prefix frontend
npm.cmd run preview --prefix frontend -- --host 127.0.0.1 --port 5191 --strictPort
```

```powershell
# Terminal 2: use a new output directory for each measurement set
$env:CHROME_PATH = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$baselineOutput = 'D:\LombaTelkom\qa-output\[nama-seri-baru]'
New-Item -ItemType Directory -Path $baselineOutput -Force | Out-Null
for ($baselineRun = 1; $baselineRun -le 3; $baselineRun++) {
    npx.cmd --yes lighthouse@13.5.0 http://127.0.0.1:5191/ --only-categories=performance --output=json --output=html --output-path="$baselineOutput\local-mobile-$baselineRun" --chrome-flags="--headless --disable-gpu --no-first-run --no-default-browser-check" --save-assets --quiet
    if ($LASTEXITCODE -ne 0) { throw 'Mobile measurement failed' }
    npx.cmd --yes lighthouse@13.5.0 http://127.0.0.1:5191/ --preset=desktop --only-categories=performance --output=json --output=html --output-path="$baselineOutput\local-desktop-$baselineRun" --chrome-flags="--headless --disable-gpu --no-first-run --no-default-browser-check" --save-assets --quiet
    if ($LASTEXITCODE -ne 0) { throw 'Desktop measurement failed' }
}
```

Sebelum membandingkan, konfirmasi branch/HEAD/dirty patch, build hash, bahasa, Chrome, Lighthouse, throttling, dan status backend. Hentikan pengulangan jika preview bukan build yang dimaksud. Jangan menukar run yang rendah tanpa alasan kegagalan teknis yang dicatat.

## Gerbang tahap ini dan langkah berikutnya

- Enam laporan valid: lulus.
- Tiga run per mode dan median tiap metrik: lulus.
- LCP aktual yang diidentifikasi, preset, URL, build, dan variasi: dicatat.
- Source aplikasi dan staged index tetap utuh: lulus.
- Smoke check tampilan awal ID/EN: lulus dalam lingkup yang disebutkan.
- Kinerja deployment, ponsel/TV fisik, INP lapangan, dan regresi seluruh fitur: belum diuji.

Step 4 berikutnya adalah memilih urutan eksperimen dari bukti ini: penemuan dan ukuran gambar LCP, gambar nonkritis, font/render delay, lalu startup JS/data. Setiap perubahan harus berdiri sendiri, menjaga artwork/layout/font, lolos pemeriksaan yang relevan, kemudian dibandingkan dengan median baseline yang setara. Target skor dan dampak perbaikan belum boleh dijanjikan.
