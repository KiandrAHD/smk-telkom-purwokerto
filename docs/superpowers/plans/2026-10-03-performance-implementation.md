# Step 5 — Implementasi optimasi

Status: E1–E4 selesai, terverifikasi, dan lulus review akhir, 3 Oktober 2026. Target mobile 90 belum tercapai.

Acuan: performance-priorities.md; baseline ID tiga mobile/tiga desktop dari Step 3. HEAD awal b6117cc, branch feat/telkom-public-design. Checkpoint dan hasil mentah disimpan terpisah di D:\LombaTelkom\qa-output\performance-step5-2026-10-03.

## Rulings

- Tetap pada branch feature dan working tree yang dipakai baseline. Delapan perubahan lokal awal dicatat dan dipertahankan; worktree baru tanpa perubahan tersebut akan menghasilkan pembanding berbeda.
- Tidak commit/push otomatis; laporan dan template Git diberikan setelah verifikasi. Tidak menjalankan generator massal yang menghapus aset asli.
- E1 hero → E1 poster → E2 font → E3 background/lazy → E4 data prestasi; E5/E6 hanya bila bukti tambahannya tersedia. Setiap eksperimen diukur terpisah.

## Ledger

- Checkpoint: 464 file tracked, patch perubahan awal dan salinan AboutSection/AchievementsSection dicatat sebelum implementasi.
- E1 hero: tes rendered markup gagal karena tidak ada srcSet, lalu lulus setelah implementasi. Tiga varian 640/960/1440 px: 20776/35730/52378 byte; sumber 74220 byte tetap utuh. Lint/build/budget, bahasa (81 rendered views), artwork, desain publik, animasi (20 skenario) dan browser ID/EN 412/768/1350/1920 lulus.
- E1 hero: median mobile 68 (60–68), FCP 2644 ms, LCP 7045 ms, TBT 231 ms, CLS 0. Desktop 94 (91–94), FCP 679 ms, LCP 1497 ms, TBT 3,5 ms, CLS 0. Mobile score tidak berubah; delta LCP masih dalam variasi baseline. Manfaat transfer terkonfirmasi: kandidat mobile 20,8 KB vs 74,2 KB.
- E1 poster: tes gagal karena gambar belum responsif; setelah props opsional dan varian ditambahkan tes lulus. Pemanggil lain tidak diberi konfigurasi baru. Fallback menghapus srcSet agar kandidat gagal tidak dipilih ulang. Lint/build/budget lulus; enam browser view ID/EN tanpa error/overflow. Benchmark sedang berjalan.
- E1: rasio hero dikunci 1920/902 setelah ditemukan pembulatan tinggi varian 640 px menggeser kotak 0,1875 CSS px. Perbaikan ikut seri poster; CSS layout dan rasio asli tetap dipertahankan.
- E1 poster: median mobile 66 (65–67), LCP 6880 ms, TBT 291,5 ms; desktop 94 (91–94), LCP 1468 ms. Byte poster turun 145309 → 67324 untuk kandidat 960 px; LCP mobile turun tetapi TBT bervariasi naik, sehingga tidak diklaim meningkatkan skor. Poster fallback diuji dengan kandidat diblokir; poster asli tampil dan iframe baru dipasang setelah klik.
- E2: file font asli Google Inter v20, Poppins v24, Plus Jakarta Sans v12 disajikan lokal. Semua 19 kombinasi family/weight menghasilkan ukuran glyph canvas yang identik; tidak ada request Google. Font diblokir tetap menghasilkan judul terbaca. Enam view ID/EN mempunyai kotak h1/logo/hero sama dengan baseline; tidak ada overflow/gambar rusak/error.
- E2: mobile 73 (73–75), LCP sekitar 6190 ms; desktop 93 (92–94). Seri lengkap ada di e2-font/summary.json. Font lokal menghilangkan ketergantungan CSS font eksternal; tidak ada family, weight atau glyph yang dihapus. 32 file/font subset (644712 byte di repo) diunduh saat dibutuhkan, bukan seluruhnya pada Beranda; ketiga lisensi OFL dipertahankan.
- E3: tes gagal karena dekorasi mitra eager; generator lossless dan lazy/async terbatas ke tiga gambar dekorasi sedang diverifikasi.
- E3: median mobile 73 (73–75), FCP 2253 ms, LCP 6066 ms, TBT 142,5 ms, CLS 0; desktop 92 (92–92), FCP 573 ms, LCP 1728 ms, CLS 0. M1 transfer awal 1053937 byte/61 request dibanding baseline M1 1499006 byte/66 request. Jumlah gambar awal 19 → 16. Lazy tidak mengurangi total byte setelah seluruh halaman discroll.
- E3 ruling: lossless dibanding sebagai pixel tampak pada latar hitam/putih dan alpha, karena encoder WebP mengubah RGB pada 4151 pixel transparan penuh. Tidak ada pixel nontransparan atau alpha yang berubah; kedua hasil komposit dan alpha cocok persis.
- E4: tes browser komponen asli mula-mula gagal karena API diminta sebelum section didekati (dua request dalam StrictMode dev). Setelah observer/import dinamis, tujuh skenario lulus: sukses, kosong, API gagal, lambat, tanpa observer, gagal import, cleanup sebelum intersection. Tidak ada penulisan data produksi.
- E4: tes tambahan jaringan lambat gagal karena skeleton mobile menyusut 1208 px ketika data datang. Loading carousel kini menampilkan 1/2/4 placeholder sesuai breakpoint dan rasio 16:9; opsi ini hanya diaktifkan pada Beranda. Tes ulang lulus dengan selisih tinggi kurang dari 80 px; tidak diklaim sebagai CLS nol untuk semua kondisi scroll lambat.
- E4: lint, build, budget, gambar responsif, bahasa, animasi, bundle, artwork dan desain publik lulus. Entry 460085 byte (tetap di bawah 460800); tidak menaikkan budget. Enam view ID/EN lulus. Benchmark akhir masih berlangsung.
- E4: browser halaman penuh menemukan deadlock `/#prestasi`: ScrollToTop menunggu aria-busy, sementara observer membutuhkan scroll. Status deferred sekarang mempertahankan skeleton tetapi tidak memasang busy sampai request dimulai. Tujuh skenario komponen dan integrasi app anchor/history lulus; perbaikan ini tidak mengubah ScrollToTop atau halaman lain.
- E4: delapan kombinasi lebar/DPR (390/2, 412/1,75, 768/2, 1024/1, 1280/1,5, 1440/2, 1536/1,25, 1920/1) lulus pilihan resolusi dan rasio hero, tidak ada SDK Supabase pada startup, scroll sampai footer, deep link/history dan smoke check empat route lain. Ini emulasi geometri DPR/viewport; bukan perubahan scaling Windows atau uji TV fisik.

## Hasil akhir — median tiga run per perangkat

Lighthouse 13.5.0, Chrome 154, build produksi Vite di localhost:5191; mobile 412×823/DPR 1,75/CPU 4×, desktop 1350×940/DPR 1. Cache/reset dan preset sama seperti baseline. Semua 30 run baru selesai tanpa runtime error/run warning; raw laporan/trace tidak menimpa baseline. Variasi CPU host dan koneksi sumber eksternal tetap merupakan batas pengukuran lab.

| Metrik | Mobile baseline | Mobile akhir | Desktop baseline | Desktop akhir |
| --- | --- | --- | --- | --- |
| Skor | 68 (59–70) | 78 (77–79) | 91 (90–93) | 97 (96–97) |
| FCP | 2590 ms | 2220 ms | 667 ms | 566 ms |
| LCP | 7414 ms | 4930 ms | 1806 ms | 1235 ms |
| TBT | 219 ms | 36,5 ms | 5,5 ms | 0 ms |
| CLS | 0 | 0 | 0 | 0 |

Skor tersebut bukan skor Loadster sebelumnya dan bukan deployment Vercel. Penurunan LCP mobile sekitar 33,5%; TBT sekitar 83,3%. Metrik observed LCP pada trace tidak dicampur dengan simulated LCP pada tabel ini.

| Eksperimen kumulatif | Mobile skor | Mobile LCP/TBT | Desktop skor | Desktop LCP |
| --- | --- | --- | --- | --- |
| E1 hero | 68 | 7045 ms / 231 ms | 94 | 1497 ms |
| E1 poster + rasio hero | 66 | 6880 ms / 291,5 ms | 94 | 1468 ms |
| E2 font lokal | 73 | 6190 ms / 118,5 ms | 93 | 1702 ms |
| E3 background/lazy | 73 | 6066 ms / 142,5 ms | 92 | 1728 ms |
| E4 deferred prestasi | 78 | 4930 ms / 36,5 ms | 97 | 1235 ms |

E1 poster tidak dinyatakan meningkatkan skor mobile; TBT pada seri itu naik. Derivatif dipertahankan karena penghematan transfer terukur, visual/fungsi lulus, dan seri akhir gabungan memperbaiki kedua perangkat. Delta kecil antarseri E1/E2/E3 tidak dianggap efek kausal yang pasti.

Transfer median mobile awal 1499006 → 994824 byte (sekitar 33,6% lebih kecil); transfer skrip 335565 → 279718 byte. Deferral juga menunda sebagian gambar/API yang mengikuti data prestasi, terutama di desktop; total setelah pengguna menelusuri semua konten dapat lebih besar daripada angka startup ini. Entry raw masih 460085 byte, budget 460800 tidak dinaikkan.

Tiga run mobile akhir memiliki elemen LCP `nav.max-w-7xl > div.flex > a.flex > span.font-heading` (teks logo sekolah). Tiga run desktop akhir memiliki poster video Tentang. Rekomendasi optimasi berikutnya harus memakai elemen ini, bukan menganggap hero tetap LCP.

## Batas dan keputusan lanjutan

- E5 belum diubah: banner STELA EN tetap gambar asli; membutuhkan seri EN tiga mobile/tiga desktop sebelum klaim performa. Tidak ada janji skor EN berdasarkan seri ID.
- E6 belum mengubah entry, dictionary, atau animasi. Coverage akhir memperkirakan 36419 byte unused di entry dan 25026 byte di MainLayout pada satu sesi; itu bukan bukti dead code global. Teks navbar LCP berada di luar main yang dianimasikan, sehingga durasi animasi main tidak boleh dianggap penghematan LCP yang pasti. Eksperimen preload font kritis atau jalur render teks memerlukan A/B tersendiri; tidak dimasukkan tanpa ukur ulang.
- Semua sumber gambar asli tetap utuh; 453/464 file tracked awal tidak berubah. Sebelas file task berubah, tanpa perubahan tracked tak terduga. Perubahan layout awal pada AboutSection/AchievementsSection dibandingkan dengan salinan checkpoint dan dipertahankan.
- Tidak menjalankan generator aset massal, tidak menghapus profil browser, tidak menulis Supabase, tidak mengganti branch, tidak commit/push/deploy.
- Hasil mobile belum memenuhi aspirasi skor ≥90/LCP ≤2,5 s/FCP ≤1,8 s. Langkah berikutnya Step 6 adalah regresi menyeluruh dan penilaian kandidat lanjutan dari trace; hasil deployment baru diukur setelah publikasi pengguna.

## File implementasi

- `frontend/src/components/HeroSection.jsx`: kandidat 640/960/1440/original 1920, sizes grid dan rasio tetap.
- `AboutSection.jsx`, `VideoEmbed.jsx`: poster opsional 640/960/1440/original 1600, object-cover sizing, fallback kandidat gagal, facade tetap.
- `PartnersSection.jsx`: WebP lossless 960/1440/1847, lazy/async dan dimensi dekorasi tanpa mengubah crop atau marquee.
- `AchievementsSection.jsx`: observer 600 px, import/service saat diperlukan, single-start, cleanup, error/empty dan fallback tanpa observer.
- `ContentSkeleton.jsx`, `PublicDataState.jsx`: opsi carousel/deferred hanya diaktifkan pada Beranda, menjaga loader dan anchor dari deadlock.
- `frontend/src/assets/fonts/`, `index.html`, `src/index.css`, `vite.config.js`: font lokal dengan subset, weight, versi dan lisensi asli; font tidak di-inline/preload secara global.
- `frontend/src/assets/responsive/`, `scripts/buat-gambar-responsif.mjs`: derivatif dan petunjuk regenerasi terbatas.
- `scripts/uji-gambar-responsif.mjs`, `uji-performa.mjs`, `uji-prestasi-deferred.mjs`: gerbang markup, budget/dimensi/pixel tampak dan integrasi browser.

## Perintah verifikasi

Dari folder frontend:

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
```

Tes integrasi browser membutuhkan instalasi Playwright yang sudah tersedia, tidak menambah dependency aplikasi. Pada host ini:

```powershell
$env:PLAYWRIGHT_MODULE = 'file:///C:/Users/IDEAPAD%20SLIM%203/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'
$env:CHROME_PATH = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
node scripts/uji-prestasi-deferred.mjs
```

Di mesin lain, pasang/gunakan Playwright milik lingkungan pengujian; kosongkan PLAYWRIGHT_MODULE bila paket `playwright` sudah dapat di-resolve. Server fixture hanya mendengarkan localhost:5192 dan otomatis ditutup. Untuk metrik, gunakan benchmark.ps1 di direktori raw artifacts dengan folder seri baru; jangan menjalankan lint/build/browser QA bersamaan dengan Lighthouse.

## Review akhir dan rulings

Review read-only oleh reviewer terpisah: tidak ada temuan Critical/Important/Minor yang meminta perbaikan. Review memeriksa source, matematika sizes/crop, graph import, lifecycle, default komponen bersama, lisensi dan artefak; reviewer tidak mengulang tes runtime.

Hal yang dipertimbangkan reviewer dan dipertahankan:

- Request yang sudah berjalan tidak dibatalkan saat unmount: perilaku lama dipertahankan dan `active` menjaga state. Biaya bila koneksi lambat: request tersebut dapat tetap memakai jaringan setelah berpindah halaman.
- Browser launch gagal pada harness: tidak menjadi perubahan produksi atau temuan; proses gagal sebelum tes. Lingkungan harus menyediakan Playwright/Chrome yang valid, bukan menganggap tes telah lulus.
- Unmount dinamis saat import/request tertahan tidak diuji secara terpisah; cleanup sebelum intersection, slow request, gagal import serta guard setelah await telah diperiksa. Ini batas cakupan, bukan klaim semua interleaving sudah diuji.
- Target mobile 90 belum tercapai; hasil yang diterima adalah perbaikan terukur dan tidak adanya regresi desktop, bukan target yang diganti diam-diam.
- CLS seri startup 0 tidak dipakai untuk mengklaim semua scroll/jaringan lambat stabil; tes loader hanya memeriksa perbedaan tinggi fixture kurang dari 80 px. OS zoom/TV/deployment/INP belum dinilai.
- E5/E6 tidak digabung tanpa bukti tambahan; biaya keputusan ini adalah optimasi EN/jalur startup lanjutan masih tersisa.

Seluruh perubahan aplikasi tetap belum di-commit. Tidak ada minor review yang ditunda. Raw evidence dan checkpoint disimpan, tanpa pembersihan direktori yang diminta pengguna untuk dipertahankan.
