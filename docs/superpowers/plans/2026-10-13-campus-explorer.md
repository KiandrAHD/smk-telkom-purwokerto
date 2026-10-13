# Interactive Campus Explorer

Scope: menambahkan School Tour di antara marquee dan daftar fasilitas `/fasilitas`, tanpa mengubah hero/navbar/footer/carousel/filter existing. Referensi dibaca: Figma 205:411 dan 205:1177; gambar sama, offset horizontal -83 ke -1253. Label/pin belum mempunyai prototype reactions; state digunakan sebagai referensi panning, bukan halaman baru.

Kontrak: React JS/JSX, Tailwind/token website, CSS scoped untuk motion; tanpa dependency/font global baru. Native scrollLeft + Pointer Events + RAF, threshold8px/axis lock, hint selesai setelah24px perpindahan aktual, localStorage opsional. Touch pan-y/pinch-zoom, trackpad horizontal/Shift-wheel tanpa konversi wheel vertikal. Bounds/resizing melalui ResizeObserver, fraction dipertahankan. Tidak membuat rotasi/loop/zoom/inertia dekoratif.

Data: foto/model asli pengguna 2164×727 dipertahankan, lossless WebP/alpha. Koordinat pin = ujung SVG relatif terhadap gambar Figma 3142×1051; dua Gedung D menunjuk satu ID fasilitas. A/B/C/D dan perpustakaan memakai fasilitasData existing. RPS/DLG memakai nama/keterangan yang terbaca; tempat tanpa dokumentasi/deskripsi memakai fallback. Tidak menebak lokasi GOR/lab. Beberapa label frame2 tidak konsisten, sehingga A/B/C dari state1 dipertahankan; library/DLG/Aula dari state2. Daftar existing tidak dirombak; hubungan ke kategori/kartu hanya yang diketahui.

- [x] Unit RED: clamp, center, gesture axis/threshold, hint storage failure, identifier/data relations.
- [x] GREEN data/utilities/hook native scrolling, RAF cancellation, click suppression, resize and accessible controls.
- [x] Explorer: aset lokal/dekorasi/pin, label/active states, hint persisten, floating preview dengan crossfade/exit280ms, mobile flow, fallbacks.
- [x] FasilitasPage integration: hotspot ke kategori/group/item; tindakan kembali ke peta dari modal kelas/RPS yang diketahui.
- [x] Browser: mouse/touch/vertical-scroll/trackpad/keyboard/drag-click, bounds/resize/orientation, repeated selection/close, hint refresh/storageblocked, image/data failure, canonical shared info, reduced motion; visual ID/EN320–1920.
- [x] Regresi fasilitas, lint/build/bahasa/diff, audit font actual, laporan sumber/file/limits dan Git handoff user-controlled.

Hasil dan batas pengujian: frontend/docs/campus-explorer.md. Production Chrome QA lulus14 viewport/bahasa explorer dan12 regresi fasilitas. Touch melalui emulasi CDP, belum perangkat fisik/Safari. Resize fraction bug diperbaiki, juga race tes filter dengan jumlah kartu sama serta hover/click menu desktop; navbar tidak diubah. Data/foto fasilitas yang belum ada menggunakan fallback, lokasi GOR/lab tidak ditebak.

Review focus: gesture yang hanya menarik ke luar batas tidak menyelesaikan hint; klik baru sesudah drag tidak terblokir; wheel vertikal tidak ditahan; close/resize/selection tidak reset panning; koordinat bukan viewport; gambar rusak tidak meninggalkan pan kosong; marker yang tidak punya data tidak diberi informasi fiktif; programmatic pan dibatalkan ketika pengguna mengambil kontrol. Implementasi inline pada checkout bersih yang sudah digunakan pengguna; tidak commit/push/deploy otomatis.
