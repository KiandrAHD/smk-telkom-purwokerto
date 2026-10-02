# Perbaikan publik dan audit foto — 2 Oktober 2026

Implementasi: React, React Router, Tailwind CSS, Vite, dan layanan Supabase yang sudah ada. Tidak ada perubahan database, commit, push, atau deployment dalam pekerjaan ini.

## 1. Showcase Project Siswa

Penyebab yang terlihat pada screenshot adalah carousel lama memutar keempat item menggunakan modulo sambil menampilkan empat kartu sekaligus. Data saat diperiksa sudah berisi empat proyek berbeda; tombol berikutnya hanya mengubah posisi proyek yang sama.

Sekarang showcase memakai `PrestasiCarousel` yang sudah ada: setiap proyek dirender sekali dan scroll berhenti di ujung. Kontrol disembunyikan jika seluruh kartu muat. Transisi smooth, swipe native, drag mouse, dan pengaturan reduced motion tetap tersedia.

`src/utils/publicContent.js` menambahkan `getUniqueProjects`. Baris dianggap salinan jika salah satu identitasnya sudah diterima: ID, slug, atau pasangan judul + pembuat. Judul, slug, dan pembuat dinormalisasi dengan trim, penggabungan spasi, dan huruf kecil. Judul sama dengan pembuat berbeda tetap dianggap karya berbeda, selama ID/slug berbeda. Jika semua identitas kosong, baris tidak ditampilkan. Salinan pertama dipertahankan; field-nya tidak digabungkan otomatis. Batas pendekatan ini: dua karya berbeda dengan judul dan pembuat yang persis sama akan dianggap duplikat; berikan judul/identitas karya yang jelas saat menambah konten.

```jsx
const items = getUniqueProjects(projectShowcase.items)
  .map(item => ({ ...item, slug: item.slug || slugify(item.title) }));

// Komponen yang sama dipakai untuk carousel prestasi dan proyek.
<PrestasiCarousel items={items} renderCard={renderProjectCard} />
```

Fungsi deduplikasi dipakai juga saat membentuk `projectDetail`, sehingga kartu dan detail berasal dari kumpulan karya yang sama.

## 2. Hapus tombol Lihat Sumber

Tombol di hero Prestasi dan Pengumuman dihapus. `DetailLayout` tidak merender tombol sumber pada detail Prestasi, Pengumuman, dan Project Jurusan yang juga terlihat pada screenshot. Tombol sumber berita berada di luar lingkup perubahan ini. Metadata atribusi tidak dihapus dari data.

## 3. Informasi Penting Hari Ini

Penyebab nyata: `infoPenting.items` berisi string, tetapi JSX mengakses `item.title`, `item.date`, dan `item.href`. Akibatnya hanya ikon muncul. Data tersebut diganti dengan daftar pengumuman terbit dari layanan Supabase yang sudah dipakai oleh halaman utama. Halaman `/pengumuman/informasi-penting` mengambil layanan yang sama.

Asumsi tanggal: “hari ini” berarti tanggal publikasi pengumuman, menggunakan `tanggal` dengan fallback `created_at`, dibandingkan dengan hari kalender Asia/Jakarta. Tanggal kegiatan di dalam teks bukan tanggal publikasi. Status publik adalah `published`.

```js
// Helper tanggal memakai Intl.DateTimeFormat dengan timeZone: 'Asia/Jakarta'.
const today = getPengumumanHariIni(items, new Date());
const latest = items
  .filter(item => item.status === 'published' && item.slug && item.title)
  .slice(0, 3);
const shown = today.length ? today : latest;
```

Saat audit ada 5 pengumuman terbit; tidak ada yang bertanggal 2 Oktober 2026. Halaman menyatakan “Belum ada pengumuman yang diterbitkan hari ini.” lalu menampilkan 3 pengumuman terbaru dengan judul terpisah. Data terbaru tidak dilabeli sebagai data hari ini. Loading, kegagalan mengambil data, dan data kosong memiliki pesan tersendiri. Ringkasan Hari Ini/Besok/Minggu Ini/Bulan Ini menggunakan batas kalender WIB yang sama.

Diagnosis untuk kasus berikutnya:

1. Di tab Network, pastikan permintaan pengumuman berhasil dan tidak terhalang izin/RLS.
2. Periksa struktur respons: `judul`, `slug`, `status`, `tanggal`, `created_at`. Mapper mengubah `judul` menjadi `title` dan tanggal menjadi `iso`.
3. Periksa status. Draf tidak seharusnya muncul di halaman publik.
4. Bandingkan hasil `getSchoolDateKey(item.iso)` dengan `getSchoolDateKey(new Date())`. Timestamp UTC menjelang tengah malam bisa masuk hari berikutnya di WIB.
5. Jika jumlah hasil nol, bedakan data kosong yang sah dari kegagalan jaringan. Terbitkan konten sungguhan melalui admin jika memang ada informasi baru; jangan mengubah tanggal arsip hanya untuk mengisi panel.

## 4. Spacing Cari Pengumuman

Bagian daftar memakai padding atas 24 px di ponsel / 32 px di desktop, scroll margin 96 px / 112 px, dan input minimal 44 px. Input selebar kontainer di ponsel dan 220 px mulai breakpoint sm. Implementasi menggunakan class Tailwind, tanpa inline CSS.

```jsx
<section id="daftar-pengumuman"
  className="scroll-mt-24 bg-white pb-8 pt-6 lg:scroll-mt-28 lg:pb-12 lg:pt-8">
  {/* Input: min-h-11 w-full ... sm:w-[220px] */}
</section>
```

Padanan CSS untuk menjelaskan ukuran, tidak perlu ditambahkan karena Tailwind sudah menerapkannya:

```css
#daftar-pengumuman { padding-top: 24px; scroll-margin-top: 96px; }
#daftar-pengumuman input[type="search"] { min-height: 44px; width: 100%; }
@media (min-width: 640px) {
  #daftar-pengumuman input[type="search"] { width: 220px; }
}
@media (min-width: 1024px) {
  #daftar-pengumuman { padding-top: 32px; scroll-margin-top: 112px; }
}
```

## 5. Audit Foto

Lingkup: data foto publik yang dipakai komponen utama, detail statis yang routenya masih terdaftar, serta respons layanan Prestasi (8 item), Berita (7), Pengumuman (5), dan BKK aktif (9). Daftar dummy berita/prestasi lama yang sudah digantikan API tidak dihitung sebagai kartu aktif. Hasil lengkap pemeriksaan berada di `D:/LombaTelkom/outputs/audit-foto-2026-10-02.json`.

143 referensi field gambar diperiksa; beberapa menunjuk ke aset yang sama. Terdapat 83 sumber gambar unik yang terisi (58 lokal, 25 HTTP), semuanya dapat diakses ketika diperiksa. Ada 21 slot logis dengan sumber kosong, termasuk 6 logo lowongan demo. Dua referensi tambahan berasal dari pengulangan ASISTANI/Senimart di data detail, sehingga tidak dihitung sebagai foto hilang baru.

“Template” di tabel berarti placeholder eksplisit atau ilustrasi umum yang dipakai sebagai pengganti dokumentasi spesifik; gambar tersebut tidak otomatis berarti hasil AI. Foto/penghargaan nyata yang belum menunjukkan produk ditandai kekurangan thumbnail produk.

| Nama/Lokasi Foto | Status (Kurang/Template/AI) | Rekomendasi Tindakan |
| --- | --- | --- |
| English Club — `/ekstrakurikuler` | Kurang | Tambahkan foto kegiatan English Club. |
| Paduan Suara — `/ekstrakurikuler` | Kurang | Tambahkan foto latihan atau penampilan kelompok. |
| Seni Musik — `/ekstrakurikuler` | Kurang | Tambahkan dokumentasi latihan/penampilan ekskul. |
| Seni Tari — `/ekstrakurikuler` | Kurang | Tambahkan dokumentasi penampilan tari. |
| Fotografi dan Videografi — `/ekstrakurikuler` | Kurang | Tambahkan foto kegiatan produksi atau karya siswa. |
| Web Technologies dan Bela Diri — `/ekstrakurikuler` | Template | Keduanya memakai `kegiatan-2.png`, foto siswa memakai VR di ruang pengembangan gim. Ganti dengan dokumentasi pengembangan web dan latihan bela diri yang sesuai. |
| IT Software — `/ekstrakurikuler` | Template | `kegiatan-4.png` menampilkan siswa memakai helm/harness di menara. Ganti dengan dokumentasi pembuatan atau pengujian perangkat lunak. |
| Cyber Security (EISS) — `/ekstrakurikuler` | Template | `kegiatan-1.png` menampilkan siswa di komputer tanpa penanda kegiatan EISS. Verifikasi konteksnya; jika hanya ilustrasi umum, ganti dengan dokumentasi ekskul EISS. |
| ASISTANI — showcase dan detail proyek | Kurang | Sumber gambar kosong. Minta tangkapan layar aplikasi/prototipe dari pembuat. |
| Senimart — showcase dan detail proyek | Kurang | Sumber gambar kosong. Minta screenshot aplikasi/prototipe dari pembuat. |
| Pengolahan Sampah Plastik Berbasis IoT dan Proyek Aplikasi DINACOM 2023 | Kurang | Foto yang ada merupakan poster penghargaan/tim nyata. Tambahkan foto produk atau screenshot aplikasi; tidak perlu mengganti dengan ilustrasi buatan. |
| Hall of Fame — Muhammad Iqbal, Aisyah Nur Fadillah, Rizky Pratama, Dewi Anggraini, Bagas Nugroho, Salsabila Putri | Kurang | Keenam `image` belum ada. Data juga tidak memiliki `sourceUrl`; verifikasi identitas/pencapaian sebelum memasang potret atau gunakan entri siswa yang sudah terverifikasi. |
| Shoope — Manager; Andre CORP — Full Stack Junior, BKK | Kurang | `logo_url` kosong. Verifikasi ejaan/nama perusahaan dan gunakan logo berizin yang benar. |
| Sagara Digital, Cakra Aplikasi, Lintas Jaringan Indonesia, Nusa Sistem Teknologi, Kreasi Visual Studio, Ruang Gim Studio — seluruhnya bertanda Demo | Kurang | Enam logo kosong. Tetap beri label Demo; gunakan inisial atau identitas demo, jangan memasang logo perusahaan nyata tanpa dasar. |
| PT Nusantara Digital Teknologi — Junior Web Developer, BKK | Template | URL `placehold.co/400x400/png?text=NDT`. Ganti dengan logo terverifikasi atau label demo yang jelas. |
| Galeri detail RPL, PG, TKJ, TJAT | Template | Foto jurusan, kelas, dan header dipakai ulang untuk klaim aplikasi, playtest, konfigurasi server, atau pengukuran fiber. Cocokkan setiap caption dengan foto praktik sebenarnya. |
| Detail PKL Telkom, Agate, Huawei | Template | Cover memakai foto kelas/jurusan umum. Gunakan dokumentasi penempatan PKL di perusahaan terkait. |
| Detail panduan CV, interview, latihan soal, pengembangan karier | Template | Cover kelas/sekolah dipakai sebagai ilustrasi. Gunakan contoh CV, proses interview, atau diagram yang sesuai; label ilustrasi bila tetap dipakai. |
| Detail galeri lama: Tim Siswa Berprestasi, Siswa di Studio Multimedia, Praktik Jaringan Siswa, Siswa Mengerjakan Proyek | Template | Route lama masih ada; beberapa caption tidak sesuai foto, misalnya studio multimedia memakai lab fiber. Cocokkan gambar/caption atau arahkan ke galeri berita aktif. Galeri utama sudah mengambil foto berita terbit. |
| Detail agenda lama: Seminar Cyber Security, Pelatihan UI/UX, Campus Hiring | Template | Memakai kelas/lab umum. Ganti dokumentasi acara yang sesuai jika route arsip tetap digunakan. |
| Video Highlight Prestasi 2024 | Template | Poster proyek IoT dan video profil umum belum merupakan reel prestasi tahun tersebut. Gunakan video/poster yang sesuai atau ubah label menjadi video profil. |
| Kartu Hasil Tes/Microteaching Calon Guru — Pengumuman | Template | `Next-Gens-1-768x461.jpg` adalah ilustrasi publikasi. Lampiran hasil seleksi atau poster yang spesifik lebih mewakili isi. |
| Hero megafon Pengumuman dan maskot/banner STELA | Template | Aset ilustrasi desain, bukan foto dokumentasi kegiatan. Boleh dipertahankan sebagai ilustrasi; minta riwayat pembuatan jika perlu verifikasi penggunaan AI. |

AI: tidak ada aset yang dapat dikonfirmasi sebagai hasil generasi AI dari metadata/kode/riwayat yang tersedia. Asal pembuatan ilustrasi STELA dan hero megafon belum dapat dipastikan. Foto kegiatan ekskul AI serta foto workshop tentang AI bukan bukti bahwa gambarnya dibuat AI.

Voli dan Handball sudah terisi. Foto alumni Moh. Khairudin, Tenia Wahyuningrum, dan Alfa Putra Kurnia juga sudah terisi. Kartu API Prestasi/Berita/Pengumuman saat audit tidak memiliki URL foto kosong atau placeholder `placehold.co`.

## Pengujian

```powershell
Set-Location -LiteralPath 'D:\LombaTelkom\smk-telkom-purwokerto\frontend'
npm.cmd run lint
npm.cmd run build
node scripts/uji-tautan-konten-publik.mjs
node scripts/uji-carousel-prestasi.mjs
npm.cmd run bahasa:uji
```

Lint, build, uji carousel, uji tautan/konten publik, dan uji bahasa lulus. `git diff --check` juga lulus dengan konfigurasi Git proyek. Uji logika mencakup ID ganda, judul/pembuat dengan variasi kapitalisasi/spasi, judul sama oleh pembuat berbeda, slug ganda, peralihan hari UTC–WIB, pengecualian draf, loading/error/kosong, serta hilangnya tombol sumber pada route yang diminta. Uji konten juga lulus ketika proses Node menggunakan zona `America/Los_Angeles`, memastikan batas WIB tidak mengikuti zona pengunjung.

Uji browser memeriksa jumlah kartu dan href unik, batas tombol carousel pada lebar 390/768 px dan desktop, ruang pencarian terhadap navbar, pencarian “seragam” yang menghasilkan satu kartu, serta tautan informasi menuju detail internal dan route informasi penting. Tidak ditemukan overflow horizontal pada tampilan yang diperiksa. Log browser menyertakan pesan koneksi “Receiving end does not exist”; tidak ada klaim bahwa seluruh konsol browser bersih. Data baru dari admin dapat diperiksa setelah memuat ulang halaman; tidak ada sinkronisasi realtime yang ditambahkan.
