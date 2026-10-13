# Agenda Sekolah dan Informasi SPMB Admin

Implementasi 13 Oktober 2026. Publik: `/kalender`, `/spmb`. Admin: `/dashboard/kalender`, `/dashboard/informasi-spmb`.

## Hasil dan batas aktivasi

Frontend, migration, dan QA lokal selesai. Database hosted belum diubah: pembacaan anonim menemukan tabel `events` tersedia, sedangkan `spmb_information` mengembalikan 404/PGRST205. Terapkan `012_spmb_information.sql` bersama frontend ini untuk mengaktifkan Informasi SPMB pada hosted. Akses administratif database/CLI tidak tersedia pada sesi ini. Error schema ditampilkan jujur, tanpa data contoh atau sukses palsu.

Hosted memiliki dua event Published, keduanya kategori lama `lomba`, tanpa foto. Agenda menampilkan data aktual tersebut dengan fallback, bukan mengisi kartu ketiga dengan kegiatan fiktif. Admin perlu mengunggah foto dan meninjau kategori lama. Contoh PSTS, AKABARA, dan Pancasila pada Figma tidak dijadikan event produksi tanpa tanggal/data resmi. Upload storage hosted dan CRUD akun nyata belum diuji pada sesi ini.

## Audit referensi dan implementasi

- [Figma Calendar/Agenda 200:901](https://www.figma.com/design/ca2iX76GpJSr0QC7Qyv9RV/Figma-MCP?node-id=200-901) dibaca langsung melalui Figma MCP. Referensi: heading merah/hitam, tiga kartu, bingkai merah transparan, rasio gambar 477:346, body putih.
- [Figma Informasi SPMB 198:782](https://www.figma.com/design/ca2iX76GpJSr0QC7Qyv9RV/Figma-MCP?node-id=198-782) dibaca bersama screenshot pengguna. Grid panel pada Figma berupa gambar yang diratakan. Implementasi mengikuti struktur 4 statistik, 2 panel atas, 3 panel bawah memakai komponen website.
- Event sudah mempunyai judul, ringkasan/deskripsi, tanggal/waktu mulai-akhir, lokasi, kategori, foto, Draft/Published, upload `content-images`, CRUD Supabase dan authorization admin. Semua digunakan kembali; tidak menambah model/tabel/API event.
- Informasi SPMB publik sebelumnya memakai array `spmbInfo.js`, `ppdbDokumen`, dan syarat inline; admin belum mempunyai tabel/layanan persisten setara. Ditambahkan satu tabel konten bertipe pada Supabase existing.
- Tidak mengubah navbar/footer/layout/font global atau aturan teknis portal pendaftar. Sidebar hanya mendapat menu Informasi SPMB yang terkait tugas.

## Kalender dan Agenda Sekolah

Promo “Ingin tahu lebih banyak?” dihapus seluruhnya, beserta lima aset khusus promo. Agenda Terdekat dan tombol Lihat Semua/Lihat Semua Agenda di bagian lain tetap tersedia. Tidak meninggalkan wrapper promo kosong.

`KalenderPage` mengambil Published event sekali lewat `useEvents(true)`, lalu memberikan hasil adapter yang sama kepada kalender dan `SchoolAgendaSection`. Detail memakai `EventDetails` existing. Tidak ada data agenda hardcoded atau request kedua.

Pemilihan maksimal tiga kegiatan: berlangsung/mendatang berdasarkan tanggal/waktu mulai, kemudian kegiatan lampau terbaru berdasarkan tanggal/waktu akhir jika belum penuh. ID dideduplikasi, Draft ditolak, input tidak dimutasi. Jika Published kurang dari tiga, jumlah kartu mengikuti data aktual. Data kosong memakai empty state.

Foto berasal dari `events.gambar_url` melalui upload admin existing. Foto kosong/URL tidak sesuai/gagal dimuat memakai ikon dan teks fallback. Gambar `object-cover` rasio 477:346, kartu seragam. Ringkasan berasal dari `ringkasan` lalu `deskripsi`; teks kartu dibatasi baris, informasi lengkap tersedia di modal. Tanggal, kategori dan label detail tetap ditampilkan.

Grid: lg 3 kolom, sm 2, mobile 1. Container max-w-7xl, padding/radius/border/shadow/focus mengikuti token existing. Section setelah kalender sebelum STELA. Reveal existing menjalankan fade/translate sekali 550 ms; stagger 0/100/200 ms, hover lift 4 px/shadow 200 ms. Reduced motion mematikan gerak/transisi.

## Kategori yang dipertahankan

Registry existing `src/data/eventCategories.js` tetap menjadi sumber admin/publik/Agenda. Event menyimpan ID pada `kategori`, bukan warna acak/kolom baru. Kategori lama tetap netral dengan label jelas, tidak dikonversi otomatis.

| Urutan | Kategori Figma | HEX |
| --- | --- | --- |
| 1 | Upacara Hari Nasional | #FF0033 |
| 2 | Penilaian Siswa (TKA, PSAS, PSAJ) | #0080FF |
| 3 | Libur Tahun Pelajaran | #A22828 |
| 4 | Awal praktek kerja industri | #B5651D |
| 5 | Hari Pertama masuk sekolah | #F2FF00 |
| 6 | HUT SMK | #CFB53B |
| 7 | Libur Akhir Semester | #B300FF |
| 8 | Perkiraan Kelulusan | #FF9500 |
| 9 | Cuti bersama | #16B900 |
| 10 | Libur awal Ramadhan | #8CF97D |

Audit asli node/SVG/warna dan kompatibilitas: [kategori-kalender.md](kategori-kalender.md). Registry dan migration kategori tidak diubah tugas lanjutan ini.

## Model, sumber dan keamanan SPMB

Migration 012 menambahkan `public.spmb_information`: UUID stabil; jenis `jadwal`, `timeline`, `skema`, `persyaratan`, `syarat`, dan satu record `statistik`. Lima kelompok mendukung judul, deskripsi, urutan, Draft/Published serta sumber. Gelombang/timeline mendukung tanggal mulai/akhir; gelombang juga seleksi/pengumuman; timeline/skema mendukung ikon dan tautan. Tanggal belum diketahui nullable. Statistik menyimpan kuota resmi nullable.

Seed memindahkan konten existing: 3 gelombang, 7 tahapan, 3 skema EASY/DIGITEST/One Day Service, 4 nama berkas dari `ppdbDokumen`, 3 persiapan portal dari SPMB lama, dan 1 statistik. Tanggal arsip EASY 31 Agustus 2026 mengikuti sumber existing; tanggal lain dan kuota tidak memakai angka screenshot. Layanan yang belum diketahui tetap menyatakan perlunya konfirmasi panitia. `spmbInfo.js` dipertahankan sebagai arsip sumber/kontak dan fixture regresi; halaman publik tidak lagi membaca array operasionalnya.

Constraint SQL memeriksa jenis, identitas statistik tunggal, panjang teks, urutan, tanggal/rentang, seleksi-pengumuman, ikon, URL http(s)/internal, sumber wajib untuk Published, dan kuota hanya pada statistik. Trigger `set_updated_at` existing digunakan kembali. Migration tidak mengubah/menghapus event maupun pendaftar.

RLS: anonim/authenticated membaca Published; admin `is_admin()` membaca Draft dan melakukan mutasi. Statistik tunggal tidak dapat dihapus. RPC `get_spmb_statistics()` hanya mengembalikan agregat, tanpa nama/email/identitas pendaftar. Policy `ppdb` tidak diubah.

Total pendaftar = semua record `ppdb`. Database belum mempunyai kolom periode penerimaan, sehingga bukan angka per tahun/gelombang. Keterangan admin menjelaskan cakupan ini. Kuota tersedia = max(0, kuota total − jumlah berstatus Diterima). Kuota NULL berarti Belum tersedia, bukan 0. Tidak membuat angka pertumbuhan/countdown palsu.

Ringkasan status/waktu berasal dari tanggal WIB Published, dengan prioritas: aktif, pembukaan terdekat, jadwal belum lengkap, lalu gelombang terakhir yang tutup. Arsip tutup tidak membuat seluruh penerimaan disebut tutup ketika gelombang Published tanpa jadwal lengkap masih tersedia.

## Form, CRUD dan sinkronisasi

Lima panel memakai form/panel reusable dan `FormInput`, `Modal`, `StatCard` existing. Tambah/Edit menampilkan data tersimpan; update mempertahankan ID. Nama/urutan/tanggal/URL/source/status divalidasi client dan SQL. Published membutuhkan sumber, tanggal boleh kosong. Delete menggunakan konfirmasi yang dapat dibatalkan. Kuota memiliki modal terpisah dan dapat dikosongkan. Loading/error/success mengikuti hasil SDK; gagal tulis tetap membuka form dan tidak dinyatakan sukses. Lock mutasi mencegah submit bersamaan; UUID create stabil memungkinkan retry tanpa duplikasi.

Service membatasi payload/kolom, pagination 500 row, abort request, update/delete berdasarkan ID dan pemeriksaan `.single()`. Admin/publik memakai hook/service yang sama. Query publik tetap memfilter Published saat sesi admin login. Mutasi sukses memicu custom event pada tab yang sama dan localStorage pada tab lain; focus/visibility/polling 30 detik menangani kunjungan kembali/perangkat lain. Tidak menambah subscription realtime.

Kalender/Agenda memakai mekanisme event invalidation existing. QA membuktikan judul/ringkasan/gambar/kategori/Published-Draft/delete dari admin tercermin di Agenda. `/spmb` membaca tabel/RPC yang sama untuk gelombang, tahapan, skema, berkas, syarat dan statistik; kartu/hero/ornamen existing dipertahankan. Error/empty state jelas. CRUD informasi tidak otomatis mengubah aturan teknis formulir/upload pendaftar, yang berada di luar scope konten ini.

## Typography dan design system

Inter untuk font utama, Poppins untuk heading, dari font lokal/token `index.css`. Plus Jakarta Sans pada Figma tidak diimpor. Chrome platform-font inspection membuktikan glyph Poppins untuk heading Agenda dan Inter untuk ringkasan, bukan hanya computed font-family. Global CSS/font/dependency tidak berubah.

Agenda: heading text-2xl/sm:text-3xl extrabold, judul text-lg bold leading-7, ringkasan text-sm leading-6, metadata text-xs. Admin mengikuti skala card/table/form existing. Primary #C8102E, radius/shadow/spacing/breakpoint/motion mengikuti website. Indikator kategori tetap registry resmi dengan label teks.

## Hasil QA

Browser memakai Chrome desktop pada build production preview lokal. REST/Auth fixture memastikan tidak ada mutasi hosted; SQL asli diuji melalui PGlite, termasuk restart database, role/RLS dan constraint. Ini bukan bukti CRUD pada hosted/perangkat fisik.

| Pemeriksaan | Hasil |
| --- | --- |
| `uji-school-agenda.mjs` | Lulus Published, tanggal/waktu WIB, max3, dedupe dan tanpa mutasi |
| `uji-school-agenda-browser.mjs` | Lulus foto/fallback, keyboard/modal/focus, detail, edit/unpublish/delete, error/retry/reload, 12 kombinasi 1920/1440/1024/768/375/320 × ID/EN, grid3/2/1, tinggi/rasio/posisi, stagger/hover/reduced motion, glyph Inter/Poppins |
| `uji-events-browser.mjs` | Lulus CRUD event/kategori/foto dan sinkronisasi kartu Agenda |
| Regresi kalender | Browser lulus; unit mencakup 2412 bulan |
| `uji-spmb-management.mjs` | Lulus lima jenis, payload, tanggal/URL/order/source, nullable quota, gelombang unknown |
| `uji-spmb-management-service.mjs` | Lulus pagination 501 row, Published, abort, UUID, update ID/payload, stats null, error izin/schema/record |
| `uji-spmb-management-database.mjs` | Lulus migration/CRUD/persistensi/RLS/Draft/constraint/agregat/kuota/statistik terlindungi/pelestarian pendaftar |
| `uji-spmb-management-browser.mjs` | Lulus CRUD lima panel, sync antar-tab/refresh/Draft, validasi, quota, gagal simpan/retry, delete/cancel, auth, 5 viewport admin/publik/form 1440/1024/768/375/320 dan tinggi statistik desktop |
| `uji-spmb-information-browser.mjs` | Lulus route/reload/portal/anchor, 12 viewport/bahasa, real assets, hero/QAC dimensions, menu, reduced/normal motion |
| Unit SPMB existing, database event, `bahasa:uji`, `security:uji` | Lulus regresi terkait |
| `npm.cmd run lint`, `npm.cmd run build`, `git diff --check` | Lulus |
| Typecheck | Tidak tersedia: JS/JSX, tanpa script typecheck |

Screenshot desktop/tablet/mobile Agenda serta admin/form/publik SPMB diinspeksi. Tabel mobile dapat digulir di container tanpa overflow halaman. Tidak mengklaim perbandingan pixel-perfect seluruh halaman atau semua browser/perangkat.

Bukti lokal: `D:/LombaTelkom/qa-output/school-agenda-final`, `spmb-management-final`, `spmb-public-regression`, `event-agenda-integration`; log `agenda-spmb-build.log`. Gambar/angka bertanda QA pada screenshot hanya fixture, bukan data produksi.

## File yang ditambah/diubah

Path relatif terhadap root repository. Beberapa label file dalam satu baris memakai direktori yang sama.

| Area | File |
| --- | --- |
| Calendar/Agenda | `frontend/src/components/kalender/CalendarBoard.jsx`, `SchoolAgendaSection.jsx`; `frontend/src/pages/KalenderPage.jsx`; `frontend/src/utils/events.js`; `frontend/src/data/translationsCalendar.js` |
| SPMB data | `frontend/src/utils/spmbInformation.js`; `frontend/src/services/spmbInformationService.js`; `frontend/src/hooks/useSpmbInformation.js`; `supabase/migrations/012_spmb_information.sql` |
| SPMB admin | `frontend/src/pages/admin/spmb/SpmbInformationPage.jsx`, `SpmbInformationPanel.jsx`, `SpmbInformationForm.jsx` |
| Route/shared | `frontend/src/App.jsx`; `frontend/src/data/dummyData.js`; `frontend/src/components/dashboard/DashboardSidebar.jsx`, `StatCard.jsx` |
| SPMB publik | `frontend/src/pages/SpmbPage.jsx`; `frontend/src/data/translationsSpmbInfo.js` |
| QA | `frontend/scripts/uji-school-agenda.mjs`, `uji-school-agenda-browser.mjs`, `uji-events-browser.mjs`, `uji-spmb-management.mjs`, `uji-spmb-management-service.mjs`, `uji-spmb-management-database.mjs`, `uji-spmb-management-browser.mjs`, `uji-spmb-information-browser.mjs` |
| Dokumentasi | `frontend/docs/agenda-spmb-admin.md`, `halaman-kalender.md`, `halaman-informasi-spmb.md`; `supabase/README.md`; `docs/superpowers/plans/2026-10-13-agenda-spmb-information.md` |

Dihapus hanya aset promo: `frontend/src/assets/kalender/agenda-calendar.png`, `petal-center-a.svg`, `petal-center-b.svg`, `petal-left.svg`, `petal-right.svg`.

## Aktivasi dan Git handoff

Terapkan migration yang belum terpasang berurutan melalui Supabase SQL Editor/CLI. 012 membutuhkan schema/fungsi existing; kategori event resmi memerlukan 010/011 jika belum terpasang. Jangan menjalankan ulang migration yang sudah tercatat. Setelah aktivasi, lakukan smoke test dengan admin nyata dan record Draft sebelum menerbitkan informasi resmi.

Branch/remote diperiksa: `feat/fasilitas-sekolah`, origin `https://github.com/KiandrAHD/smk-telkom-purwokerto.git`. Tidak commit/push/deploy otomatis. Perintah berikut hanya men-stage file tugas, termasuk penghapusan promo:

```powershell
Set-Location 'D:/LombaTelkom/smk-telkom-purwokerto'
$agendaSpmbFiles = @(
  'frontend/src/components/kalender/CalendarBoard.jsx',
  'frontend/src/components/kalender/SchoolAgendaSection.jsx',
  'frontend/src/pages/KalenderPage.jsx', 'frontend/src/utils/events.js',
  'frontend/src/data/translationsCalendar.js',
  'frontend/src/utils/spmbInformation.js',
  'frontend/src/services/spmbInformationService.js',
  'frontend/src/hooks/useSpmbInformation.js',
  'frontend/src/pages/admin/spmb/SpmbInformationPage.jsx',
  'frontend/src/pages/admin/spmb/SpmbInformationPanel.jsx',
  'frontend/src/pages/admin/spmb/SpmbInformationForm.jsx',
  'frontend/src/App.jsx', 'frontend/src/data/dummyData.js',
  'frontend/src/components/dashboard/DashboardSidebar.jsx',
  'frontend/src/components/dashboard/StatCard.jsx',
  'frontend/src/pages/SpmbPage.jsx', 'frontend/src/data/translationsSpmbInfo.js',
  'frontend/src/assets/kalender/agenda-calendar.png',
  'frontend/src/assets/kalender/petal-center-a.svg',
  'frontend/src/assets/kalender/petal-center-b.svg',
  'frontend/src/assets/kalender/petal-left.svg',
  'frontend/src/assets/kalender/petal-right.svg',
  'frontend/scripts/uji-school-agenda.mjs',
  'frontend/scripts/uji-school-agenda-browser.mjs',
  'frontend/scripts/uji-events-browser.mjs',
  'frontend/scripts/uji-spmb-management.mjs',
  'frontend/scripts/uji-spmb-management-service.mjs',
  'frontend/scripts/uji-spmb-management-database.mjs',
  'frontend/scripts/uji-spmb-management-browser.mjs',
  'frontend/scripts/uji-spmb-information-browser.mjs',
  'supabase/migrations/012_spmb_information.sql', 'supabase/README.md',
  'frontend/docs/agenda-spmb-admin.md', 'frontend/docs/halaman-kalender.md',
  'frontend/docs/halaman-informasi-spmb.md',
  'docs/superpowers/plans/2026-10-13-agenda-spmb-information.md'
)
git add -- $agendaSpmbFiles
git diff --cached --check
git commit -m "feat: sync school agenda and SPMB information management"
git push origin feat/fasilitas-sekolah
```
