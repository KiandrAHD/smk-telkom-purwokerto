# Step 4 — Prioritas optimasi berdasarkan baseline

Tanggal: 3 Oktober 2026, Asia/Jakarta. Status: analisis dan urutan eksperimen selesai; perubahan aplikasi belum diterapkan.

## Ruang lingkup dan versi acuan

Dokumen ini menjalankan Step 4 dari urutan kerja terbaru: checkpoint → pemeriksaan → baseline → prioritas → implementasi satu per satu → regresi → pengukuran deployment. Ini berbeda dari penomoran delapan tahap pada rencana 1 Oktober. Implementasi optimasi menjadi pekerjaan Step 5.

| Item | Acuan terverifikasi |
| --- | --- |
| Repository | D:\LombaTelkom\smk-telkom-purwokerto |
| Branch | feat/telkom-public-design |
| HEAD saat analisis | 56745b0e1cd371bd5a117f47b57defaaf609e553 |
| HEAD saat baseline | 3b3a4e4420e495449ba4c83c413d7f68c4b27ff5 |
| Perubahan antar-commit | Hanya dua laporan baseline; tidak ada perubahan frontend |
| Working tree | Delapan file tracked sudah berubah sebelum tahap ini; seluruhnya dipertahankan |
| Integritas baseline | 461 hash file acuan masih sama; 24 hash artefak baseline cocok |
| Seri performa acuan | Beranda ID, produksi Vite, localhost:5191, Lighthouse 13.5.0/Chrome 154.0.8037.97 |
| Median mobile | Skor 68; FCP 2,590 s; LCP 7,414 s; TBT 219 ms; CLS 0 |
| Median desktop | Skor 91; FCP 0,667 s; LCP 1,806 s; TBT 5,5 ms; CLS 0 |

Source yang belum di-commit merupakan bagian dari baseline. Jangan menjalankan checkout/restore/reset pada perubahan tersebut untuk membuat pengujian terlihat lebih bersih. Build publik berbeda dari lokal; skor historis atau deployment tidak dipakai sebagai pembanding langsung.

## Koreksi terhadap rencana lama

1. Plus Jakarta Sans harus dipertahankan. Sekarang dipakai pada PengumumanBantuanCard.jsx:10, PengumumanCard.jsx:20, PengumumanDaftarSection.jsx:99, dan PengumumanPopulerCard.jsx:21. Instruksi lama untuk menghapus family bila tidak dipakai tidak lagi berlaku.
2. Banner STELA sudah menggunakan `loading="lazy"` di StelaAISection.jsx:14. DepartmentCard.jsx:25–27 juga sudah memiliki lazy/async. Jangan mencatat penambahan atribut yang sudah ada sebagai optimasi baru.
3. Poster Tentang menjadi LCP pada dua run desktop. Jangan menerapkan lazy secara global ke VideoEmbed; kontrak semua pemanggil harus dipertahankan.
4. AuthProvider sudah lazy dan dibatasi ke route admin di App.jsx:33/191. Tidak ada dasar untuk membongkar autentikasi sebagai perbaikan Beranda. Pada jalur source Beranda yang diperiksa, import prestasiService berada di AchievementsSection.jsx.
5. Entry raw 460048 byte berbeda dari transfer entry sekitar 147062 byte. Budget raw dan transfer jaringan merupakan dua ukuran berbeda; 135 chunk build juga bukan jumlah request awal.

## Tabel prioritas dan bukti

| Urutan | Prioritas | Kandidat dan lokasi | Status bukti | Dampak yang dituju | Risiko |
| --- | --- | --- | --- | --- | --- |
| E1 | Tinggi | Jalur gambar LCP: frontend/src/components/HeroSection.jsx:61–66; AboutSection.jsx:24–30; VideoEmbed.jsx:35–45 | Hero adalah LCP M1/M3/D3; poster adalah LCP D1/D2. Hero tidak mempunyai srcSet/sizes; request hero tidak ditemukan dalam HTML awal menurut audit. | Memperkecil gambar yang dipilih mobile dan mengurangi keterlambatan penemuan request; mengukur render delay secara terpisah. | Rendah untuk varian hero; sedang untuk poster bersama atau preload. |
| E2 | Tinggi | Delivery font: frontend/index.html:14–16; frontend/src/index.css:4–5 | Stylesheet Fonts/CSS render blocking; estimasi FCP audit 450/1350/450 ms mobile. Teks logo menjadi LCP M2. | Menstabilkan FCP dan LCP teks, mempertahankan family/weight serta line break. | Sedang: font, glyph, fallback, CLS, dan seluruh halaman dapat terpengaruh. |
| E3 | Tinggi | Gambar nonkritis: frontend/src/components/PartnersSection.jsx:15–31; aset background mitra | Transfer gambar M1 sekitar 71% dari total 1499006 byte. Background mitra 284699 byte; audit memperkirakan 250628 byte dapat dihemat pada aset itu. Belum ada lazy/dimensi eksplisit pada tiga gambar dekorasi mitra. | Mengurangi byte awal dan persaingan resource; mempertahankan visual saat scroll. | Rendah–sedang: object-cover, posisi dekorasi, marquee, dan ruang layout. |
| E4 | Sedang | Startup data prestasi: frontend/src/components/AchievementsSection.jsx:8/17–22; services/prestasiService.js:getPrestasi | Fetch dimulai saat mount, section berada jauh di bawah hero. SDK muncul di jaringan awal; audit coverage M1 menunjukkan 43094 byte SDK tidak dipakai dalam sesi itu. | Menunda API/import sampai mendekati section; menguji apakah chunk SDK ikut tertunda. | Sedang: deep link, scroll cepat, cleanup, loading/error/empty, dan carousel. |
| E5 | Sedang; seri EN tersendiri | Artwork STELA EN: frontend/src/components/StelaAISection.jsx:14; assets/landing/stela-card-en.png | File lokal terverifikasi 1536011 byte, 2172 × 724; sudah lazy. Baseline performa Step 3 hanya ID. | Mengurangi transfer EN dengan varian gambar yang tetap terbaca. | Sedang: teks bitmap, rasio berbeda dari ID, dan pemanggil di Jurusan/Pengumuman. |
| E6 | Bersyarat | Isi entry/chunk dan render: frontend/src/App.jsx; layouts/MainLayout.jsx:29; index.css:40/269/348; Reveal.jsx:18–28 | Entry hampir menyentuh budget 450 KiB, sisa 752 byte. Animasi main 0,4 s dan reveal 0,55 s ada; kontribusinya terhadap LCP belum terisolasi. | Mengurangi startup JS atau render delay bila masih dominan setelah E1–E4. | Sedang–tinggi bila dilakukan tanpa trace/import map; berisiko mengubah animasi, routing, atau terjemahan. |

Mengurangi ukuran gambar saja tidak menjamin LCP turun bila resource discovery atau render masih menahannya. Prioritas E1 membedakan ketiganya, sesuai [panduan diagnosis LCP](https://web.dev/articles/optimize-lcp). Estimasi penghematan dari audit bukan hasil yang sudah dicapai dan tidak dijumlahkan menjadi janji skor.

## E1 — Perubahan pertama pada Step 5

Kerjakan hero terlebih dahulu, ukur, lalu poster sebagai perubahan terpisah. Background mitra mempunyai potensi byte lebih besar, tetapi hero/poster lebih langsung terkait LCP yang terukur.

1. Tambahkan generator terbatas `frontend/scripts/buat-gambar-responsif.mjs` dan output `frontend/src/assets/responsive/`. Input awal hanya drive/header-jurusan.webp. Sumber asli tidak dihapus, diganti, dipotong, atau disusun ulang; Sharp sudah tersedia.
2. Kandidat hero awal: lebar 640, 960, 1440, serta sumber 1920 px. Mobile 412 px menampilkan hero 354 px; pada DPR 1,75 kebutuhan lebar sekitar 620 px, sehingga 480 px bukan kandidat utama yang cukup tajam. Nilai akhir ditentukan dari currentSrc, ukuran nyata, dan QA DPR 2/zoom.
3. Pasang srcSet/sizes hanya pada HeroSection, memakai URL import hasil bundler. `sizes` harus mengikuti container dan grid yang benar-benar ada; tidak mengganti kelas CSS, rasio, gambar, posisi, atau CTA. Pertahankan fallback sumber, width/height 1920/902, serta fetchPriority high; hero tidak lazy.
4. Pastikan varian mobile lebih kecil dari sumber 74220 byte. Jika quality percobaan menimbulkan artefak visual, naikkan kualitas atau pakai lossless. Tidak ada target ukuran yang mengizinkan kerusakan wajah, teks, atau artwork.
5. Setelah hasil hero terpisah diterima, buat varian poster profil-hero.jpg (sumber 1600 × 751, 145309 byte). Salurkan konfigurasi poster hanya dari AboutSection melalui props opsional VideoEmbed. Pemanggil lain tetap memakai perilaku awal; jangan mengubah sumber global dummyData hanya untuk Beranda.
6. Untuk poster object-cover, kebutuhan source pixel adalah DPR dikali nilai terbesar antara lebar kotak dan tinggi kotak dikali rasio sumber. Pertahankan crop yang sudah ada; jangan memilih kandidat hanya dari lebar viewport.
7. Bila trace sesudah varian masih menunjukkan discovery delay, uji preload sebagai eksperimen tersendiri. Preload harus memilih aset/resolusi yang sama dengan img dan khusus halaman yang membutuhkannya. HTML SPA dipakai semua route; jangan memasang preload hero global yang mengunduh gambar Beranda saat membuka Pengumuman/login. Jangan melakukan SSR/prerender atau menambah plugin hanya untuk mengejar audit hijau sebelum manfaatnya dibuktikan.

Pemilihan kandidat oleh browser menggunakan srcSet, sizes, serta kepadatan pixel; sizes sendiri tidak mengubah ukuran CSS gambar. Rujukan: [responsive images](https://web.dev/articles/serve-responsive-images).

Verifikasi E1: currentSrc/naturalWidth/dimensi kotak pada ID/EN; semua varian 200 tanpa download duplikat karena preload; rasio dan crop tetap; video baru memasang iframe setelah klik; screenshot pada 412/768/1350/1920 px, DPR 1/1,75/2 dan zoom 125%/150%. Tambahkan 390/1440 px sebagai smoke check tambahan, jangan campur hasilnya dengan profil Lighthouse.

## E2 — Pemuatan font, tanpa mengganti tipografi

1. Catat family/weight/font binary yang dipakai pada Beranda, Profil Sekolah, Guru, Pengumuman, dan login/admin. Inter dan Poppins wajib tetap; Plus Jakarta Sans juga tetap di pemanggil yang memakainya.
2. Uji alternatif penyajian WOFF2 dari family/versi yang sama beserta lisensi. Pertahankan unicode-range/glyph yang dibutuhkan, font-display swap, fallback, dan weight mapping yang benar; hindari synthetic weight yang mengubah hasil visual.
3. Jangan menyatakan self-host otomatis lebih cepat. Bandingkan koneksi/transfer dan FCP/LCP dengan origin lokal yang sama, kemudian verifikasi pada deployment ketika tersedia. Jangan preload semua family/weight; hanya kandidat yang terbukti kritis, tanpa request ganda.
4. Uji font diblokir/lambat: teks tetap terbaca; setelah font tersedia, family, ketebalan, line break, navbar, tombol, dan CLS harus sesuai. Perubahan index.html/index.css bersifat bersama, sehingga uji publik dan admin secara read-only.

Pemilihan self-host harus dibuktikan lewat pengukuran delivery, bukan asumsi. Rujukan: [best practices for fonts](https://web.dev/articles/font-best-practices).

## E3 — Background dan gambar di bawah viewport

1. Setelah E1/E2 dibandingkan, buat varian background mitra dengan ratio/alpha/warna yang sama. Untuk object-cover, hitung kebutuhan lebar berdasarkan tinggi banner serta DPR; jangan membuat gambar tipis menjadi buram.
2. Tambahkan native lazy/async dan ruang stabil pada gambar yang memang nonkritis di PartnersSection. Uji browser memulai download sebelum pengguna tiba; lazy menunda request dan belum tentu mengurangi total byte setelah seluruh halaman discroll.
3. Jangan memberi lazy pada hero atau poster desktop yang menjadi LCP. STELA dan kartu jurusan sudah lazy; fokus pada payload terpilih bila audit berikutnya masih menandainya.
4. Uji scroll cepat sampai footer, marquee/jeda/reduced motion, arah dekorasi, dan ukuran banner. Jangan mengganti aksen Figma atau menghapus logo untuk mengurangi transfer.

## E4 — Request prestasi saat diperlukan

1. Lakukan import dinamis prestasiService ketika section mendekati viewport; observer guard hanya boleh memulai pemuatan satu kali. Root margin 600 px dari rencana lama merupakan titik awal yang perlu diuji pada scroll cepat/jaringan lambat.
2. Pertahankan mapping toPrestasiItem, data asli, CTA/detail, carousel, loading/error/empty, cleanup saat unmount, dan fallback bila IntersectionObserver tidak tersedia. Tidak ada perubahan schema, RLS, kredensial, atau CRUD produksi.
3. Periksa graph/network sesudah build. Menunda getPrestasi belum tentu menunda SDK jika dependensi lain masih membutuhkannya. Auth admin tidak perlu dibongkar.
4. Uji /#prestasi, navigasi riwayat, scroll cepat, kunjungan ulang, API kosong/500/lambat, gagal import, dan unmount. Simulasikan respons/error dalam tes; jangan menulis data produksi. Ruang loading tidak boleh menimbulkan CLS baru yang konsisten.

## E5/E6 — Perbaikan lanjutan yang memerlukan bukti tambahan

E5 membutuhkan baseline EN tersendiri sebelum klaim performa: mobile dan desktop tiga run masing-masing dengan sessionStorage bahasa EN yang ditetapkan sebelum navigasi. Banner tetap gambar, locale ID/EN tidak tertukar, CTA tetap /stela, dan pemanggil Jurusan/Pengumuman tetap cocok. Mulai kompresi artwork dengan lossless; jangan menurunkan keterbacaan teks. Tes artwork saat ini memeriksa nama file stela-card.jpg/stela-card-en. Bila asset berubah, perbarui fixture menjadi pemeriksaan locale/perilaku yang benar dan uji browser; jangan melemahkan assertion sekadar agar lulus.

E6 meninjau hanya modul yang terbukti diminta saat startup. Audit 103235 byte unused JS pada M1 merupakan coverage satu sesi, bukan dead code global. Jangan menghapus package, memecah seluruh dummyData/terjemahan, atau membuat manualChunks secara spekulatif. Animasi masuk main/reveal boleh diuji A/B sementara di browser untuk memisahkan render delay; keberadaan durasi 0,4/0,55 s belum membuktikan durasi tersebut sama dengan penghematan LCP. Jangan menghapus animasi secara global.

## Gerbang per eksperimen pada Step 5

| Gerbang | Pemeriksaan | Kriteria dan penanganan gagal |
| --- | --- | --- |
| Source | Diff eksperimen, hash sumber asli, branch/HEAD/index | Hanya file eksperimen berubah; perubahan lokal sebelumnya utuh. Perbaiki atau lepaskan hanya perubahan eksperimen yang dibuat agen, tidak memakai git restore massal. |
| Statis/build | Lint, build, performa:uji, uji-bundle | Lulus dan tidak menaikkan budget untuk menyembunyikan kegagalan. Budget sekarang tidak mencakup hero/banner tersebut; tambah pemeriksaan kandidat baru bila dipasang. |
| Bahasa/artwork | bahasa:uji; uji-localized-artwork; uji-desain-publik | Locale, gambar utuh, alt/accessibility, dan CTA tetap benar. Fixture nama aset perlu disesuaikan secara bermakna jika source baru menggantikannya. |
| Animasi/navigasi | animasi:uji; browser deep link/history; reduced motion | Observer dibersihkan, scroll/navigasi tetap benar; tes harness saja tidak menggantikan browser. |
| Visual | Screenshot kondisi sama; currentSrc; ukuran kotak; console/network | Layout, family, warna, crop, aksen, dan fungsi tidak berubah; tidak ada gambar broken/overflow/error baru. |
| Performa | Produksi, tiga mobile + tiga desktop, preset/versi sama | Laporkan run/median/rentang dan delta FCP/LCP/TBT/CLS/transfer. Skor bukan satu-satunya gerbang. Bila perubahan berada dalam variasi run dan manfaat belum jelas, tandai inconclusive; jangan klaim peningkatan. |
| Desktop | Bandingkan terhadap median lokal 91/LCP 1,806 s/FCP 0,667 s | Jangan menerima regresi konsisten demi skor mobile. Nilai sekali turun tidak otomatis membuktikan regresi; periksa trace dan seri setara. |
| Publikasi | Git hanya file eksperimen yang sudah lolos | Tidak ada commit/push/deploy otomatis. Pengukuran publik baru dilakukan setelah build deployment terverifikasi. |

Perintah gerbang dari root repository, dijalankan ketika source eksperimen berubah. Script SSR harus berjalan dengan working directory frontend agar root Vite benar:

```powershell
Push-Location '.\frontend'
try {
    npm.cmd run lint
    if ($LASTEXITCODE -ne 0) { throw 'Lint failed' }
    npm.cmd run build
    if ($LASTEXITCODE -ne 0) { throw 'Build failed' }
    npm.cmd run performa:uji
    if ($LASTEXITCODE -ne 0) { throw 'Performance budget failed' }
    npm.cmd run bahasa:uji
    if ($LASTEXITCODE -ne 0) { throw 'Language checks failed' }
    npm.cmd run animasi:uji
    if ($LASTEXITCODE -ne 0) { throw 'Animation checks failed' }
    node scripts/uji-bundle.mjs
    if ($LASTEXITCODE -ne 0) { throw 'Bundle check failed' }
    node scripts/uji-localized-artwork.mjs
    if ($LASTEXITCODE -ne 0) { throw 'Localized artwork check failed' }
    node scripts/uji-desain-publik.mjs
    if ($LASTEXITCODE -ne 0) { throw 'Public design check failed' }
    git diff --check
    if ($LASTEXITCODE -ne 0) { throw 'Diff check failed' }
} finally {
    Pop-Location
}
```

Gunakan prosedur tiga run/preset dari performance-baseline.md dengan direktori seri baru. Jangan overwrite raw baseline. Profil ID/EN, cache dingin/hangat, observed/simulated, dan localhost/deployment adalah seri berbeda.

Target aspirasi rencana lama tetap mobile ≥90, LCP ≤2,5 s, FCP ≤1,8 s, CLS mendekati 0 dan desktop ≥95; target tersebut belum tercapai atau dijamin. Jangan mengubahnya menjadi klaim hasil. TV fisik dan INP lapangan memerlukan pengukuran terpisah.

## Rulings dan verifikasi tahap analisis

- Ruling: menjalankan Step 4 saja — batas yang diminta pengguna dan langkah berikutnya pada laporan Step 3 adalah prioritasi. Optimasi source dilakukan pada Step 5.
- Ruling: tetap pada checkout saat ini — hanya analisis/laporan; kode yang akan menjadi pembanding harus tetap identik dengan baseline, tanpa worktree/branch baru pada tahap ini.
- Ruling: mempertahankan Plus Jakarta Sans — empat pemanggil sekarang memakai family tersebut; rencana lama bersyarat sudah tidak memenuhi syarat penghapusan.
- Ruling: hero/poster didahulukan dibanding background terbesar — keterkaitan LCP terukur lebih kuat, dan perubahan pertama dapat diisolasi.
- Ruling: tidak mengulang seluruh build/benchmark — tidak ada source aplikasi yang berubah sejak baseline; verifikasi hash dan artefak cukup untuk tahap prioritas. Build/test baru wajib pada implementasi.
- Verifikasi: isi baseline dan seluruh hash artefak diperiksa; lima aset diukur ulang dengan Sharp metadata/stat; import, lazy, font, animasi, serta route auth diperiksa dari source.
- Batas: belum ada delta performa setelah optimasi, tes delivery font A/B, hasil EN Lighthouse, atau bukti animasi menyebabkan LCP. Tidak ada klaim bahwa perubahan yang belum diterapkan sudah mempercepat website.

Hasil yang siap dipakai: backlog E1–E6, urutan perubahan E1 hero → E1 poster → E2 font → E3 background/lazy → E4 prestasi → E5/E6 bersyarat, beserta file, risiko, dan gerbang pengujiannya. Langkah implementasi pertama adalah varian responsif hero Beranda dengan sumber asli dipertahankan.
