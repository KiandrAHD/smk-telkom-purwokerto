# Manajemen Calendar of Events

Implementasi 13 Oktober 2026. Route admin: `/dashboard/kalender`; publik: `/kalender`.

## Audit dan keputusan

Checkout awal belum memiliki halaman/route/model kalender admin. Kalender publik sudah tersedia, tetapi memakai tujuh contoh lokal dari Figma. Supabase, AuthContext, ProtectedRoute, tabel admins, fungsi is_admin, layanan CRUD, Storage content-images, Modal, FormInput, dan ImageUploadField sudah ada dan digunakan kembali. Tidak ditambahkan backend kedua, dependency, akun admin, atau data contoh ke database resmi.

Referensi Figma: https://www.figma.com/design/iNxyyPVdJb2mwgCQW3xOMN/telkom-remake?node-id=1124-1280. Node `Calender_Of_Event` tersebut ternyata menampilkan admin, sesuai screenshot lampiran. Implementasi mengikuti susunan header, tombol tambah, search/month/navigation, kalender kiri, serta agenda kanan. DashboardLayout, sidebar, header, Inter/Poppins, token primary/dark, dan Lucide existing dipertahankan. Ejaan heading menjadi Calendar of Events. Tambahan status filter, reload, feedback, form/detail, dan konfirmasi diperlukan untuk pengelolaan nyata. Kalender/agenda ditumpuk pada viewport kecil; marker menjadi ringkas dengan label aksesibel dan detail lengkap saat dipilih. Tidak mengklaim pixel-perfect.

Halaman publik mempertahankan hero, aset kalender/gelombang, ribbon, calendar/list, promo, navbar/footer, STELA, dan CTA sebelumnya. Perubahan hanya sumber data, rentang beberapa hari, detail informasi, serta loading/error/retry.

## Fitur

- Create Draft/Published, edit record yang sama, detail, dan delete dengan konfirmasi.
- Judul wajib, ringkasan, deskripsi lengkap, kategori, tanggal mulai wajib, waktu mulai, tanggal/waktu selesai, lokasi, penyelenggara, poster, tautan informasi, status publikasi.
- Form memiliki error per field, submit lock, loading state, dan notifikasi berdasarkan hasil API. Native dialog menyediakan Escape/fokus; penutupan ditahan saat mutation.
- Kalender Senin–Minggu, picker bulan, perpindahan bulan/tahun, indikator hari ini, event beberapa hari, maksimal dua badge per sel dan tombol +N lainnya.
- Search judul, nama/kode kategori, lokasi, ringkasan, deskripsi, penyelenggara; filter status; agenda mendatang/masih berlangsung diurutkan berdasarkan tanggal/waktu WIB. Kegiatan lama tetap dapat dibuka dari bulan/tanggal kalender.
- UUID form stabil dan upsert menangani retry setelah respons jaringan hilang tanpa duplikasi record. Edit/delete memakai single returning agar record tidak ditemukan tidak dianggap berhasil.
- Deskripsi dirender sebagai teks React, tidak memakai HTML mentah. Tautan hanya http/https; upload memakai helper validasi signature/format/batas 5 MB yang sudah tersedia.

## Database, API, dan sinkronisasi

Migration `supabase/migrations/010_calendar_events.sql` menambahkan tabel `public.events`: UUID, judul, ringkasan, deskripsi, kategori, tanggal_mulai, waktu_mulai, tanggal_selesai, waktu_selesai, lokasi, penyelenggara, gambar_url, link_informasi, status, created_at, updated_at.

DATE/TIME adalah nilai kalender Asia/Jakarta, bukan timestamp UTC. Constraint server memeriksa judul, batas panjang, tanggal valid/rentang 0100–9999, urutan tanggal/waktu, kategori/status, serta skema URL. Trigger set_updated_at dan fungsi is_admin existing digunakan kembali. Indeks mendukung tanggal Published serta akhir rentang kegiatan.

API menggunakan Supabase PostgREST melalui SDK existing, dengan anon key dan JWT sesi. RLS mengizinkan publik membaca Published saja; hanya anggota admins dapat membaca Draft dan melakukan mutation. ProtectedRoute membatasi halaman admin, tetapi perlindungan data tetap ada di database meski request dikirim langsung. Tidak ada service role secret di browser.

Kedua halaman memakai eventService/useEvents. Query publik selalu memfilter Published, termasuk ketika pengunjung juga login sebagai admin. Mutation menyegarkan halaman aktif dan mengirim sinyal antar-tab origin yang sama. Halaman terbuka melakukan refresh saat focus/visible dan setiap 30 detik ketika terlihat, sehingga perubahan dari perangkat lain dapat tampil tanpa reload manual. localStorage hanya menyimpan sinyal perubahan, bukan record event. Semua halaman mengambil ulang data dari Supabase; tidak ada persistence semu dalam browser.

Poster menggunakan bucket content-images yang sudah publik. Draft record tetap privat melalui RLS; URL poster bukan penyimpanan dokumen rahasia. Gambar lama tidak dihapus otomatis karena mungkin direferensikan konten lain, mengikuti helper existing. Upload ke Storage aktif belum diuji pada tugas ini.

## Penerapan yang masih diperlukan

Probe read-only Supabase aktif menghasilkan HTTP 404/PGRST205 untuk tabel events. Migration disiapkan dan diuji lokal, tetapi belum diterapkan ke project cloud. Tidak ada credential administratif untuk menerapkannya dalam sesi ini. Karena itu CRUD produksi belum dapat digunakan dan halaman menampilkan error/retry yang sebenarnya, bukan event contoh.

1. Pada Supabase project website yang benar, periksa migration existing. Jangan menjalankan ulang migration yang sudah terpasang.
2. Terapkan `010_calendar_events.sql` melalui SQL Editor atau alur migration repository. Prasyarat is_admin/set_updated_at/admins dari schema existing harus tersedia.
3. Pertahankan bucket content-images dan izin upload admin existing. Tidak perlu membuat bucket baru.
4. Login menggunakan administrator existing, tambah Draft, reload, lalu publish. Periksa dari browser anonim di `/kalender`; edit dan hapus lalu periksa kembali. Uji poster ke Storage aktif.
5. Jalankan lint/build sebelum frontend dirilis. Tidak ada commit, push, deploy, atau perubahan database cloud dalam tugas ini.

## Verifikasi yang dijalankan

| Area | Bukti | Batas |
| --- | --- | --- |
| Client | uji-events.mjs: required, leap dates, date/time order, URL aman, payload whitelist, multi-day/year, WIB agenda | Unit lokal |
| Service | uji-events-service.mjs: pagination 501 row, Published filter, abort, stable UUID, poster upload/cleanup failures, missing/denied writes | Client Supabase simulasi |
| SQL/RLS | uji-events-database.mjs: create/update/delete, Draft privacy, anon/nonadmin denial, constraints, close/reopen database | PGlite persisten lokal; bukan hosted Supabase atau tes konkurensi multi-connection |
| Admin browser | Create/reload/edit/delete/cancel, publication/demotion, antar-tab, retry/lost response/double submit, validation/failure, +N, search, leap/year, Escape, missing-table/retry | API/Auth simulasi; bukan akun/cloud mutation nyata |
| Responsive admin | 1440, 1024, 768, 375, 320 px, form dan kalender tanpa horizontal overflow; screenshot diperiksa | Chrome otomatis; bukan perangkat fisik |
| Public browser | Route/reload, menu, keyboard, detail/list/empty, Today, leap/year, 12 kombinasi ID/EN dan viewport 1920–320 px | REST fixture Published |
| Upload existing | uji-image-upload.mjs: lima format, signature, 5 MB, Storage/database failure, rollback handling | Tidak mengunggah ke bucket cloud |
| Kalender existing | uji-kalender.mjs: 2.412 bulan, posisi/continuity/leap/year/bounds | Unit lokal |
| Proyek | ESLint, production build, bahasa:uji, git diff --check | Proyek JS/JSX tidak menyediakan typecheck |

Screenshot dan JSON QA: `D:/LombaTelkom/qa-output/events-admin-2026-10-13` dan `D:/LombaTelkom/qa-output/events-public-2026-10-13`. Kesimpulan: kode dan pengujian lokal siap untuk penerapan migration; verifikasi cloud end-to-end masih belum dilakukan.

Jalankan dari frontend:

```powershell
node scripts/uji-events.mjs
node scripts/uji-events-service.mjs
node scripts/uji-events-database.mjs
node scripts/uji-events-browser.mjs
node scripts/uji-kalender.mjs
node scripts/uji-kalender-browser.mjs
npm.cmd run bahasa:uji
npm.cmd run lint
npm.cmd run build
```

Database test memerlukan `PGLITE_MODULE` menunjuk runtime PGlite existing (tidak menambah dependency proyek). Browser test memerlukan preview aktif pada 127.0.0.1:4173 atau QA_URL, serta PLAYWRIGHT_MODULE jika runtime Playwright berada di luar proyek. QA_OUTPUT mengatur lokasi screenshot. Skrip browser hanya memakai URL Supabase dari env dan credential fixture; tidak memakai password atau melakukan mutation cloud.

## Daftar file

| File | Perubahan |
| --- | --- |
| src/pages/admin/kalender/KalenderAdminPage.jsx | Route page, kalender, agenda, search/filter, modal CRUD, feedback |
| src/pages/admin/kalender/EventForm.jsx | Form validasi, poster, submit lock/UUID |
| src/services/eventService.js | PostgREST CRUD, pagination, image helper, invalidation, error |
| src/hooks/useEvents.js | Shared fetching/abort/focus/poll/antar-tab |
| src/utils/events.js | Contract, validasi, mapping, warna kategori, rentang, WIB agenda |
| src/components/kalender/EventDetails.jsx | Detail bersama admin/publik, plain text/safe links |
| src/components/kalender/CalendarBoard.jsx | Data API, event beberapa hari, agenda/detail terkini |
| src/pages/KalenderPage.jsx | Fetch Published dan state nyata |
| src/utils/calendar.js | Pemilahan bulan mencakup event lintas bulan |
| src/App.jsx | Lazy protected route admin |
| src/data/dummyData.js, src/components/dashboard/DashboardSidebar.jsx | Menu kalender admin dan ikon |
| src/components/dashboard/Modal.jsx | Accessible label dan busy cancel guard |
| src/data/translationsCalendar.js | Kamus informasi/detail/error kegiatan publik |
| scripts/uji-events.mjs, uji-events-service.mjs, uji-events-database.mjs, uji-events-browser.mjs | Unit, service, SQL/RLS/persistence, browser |
| scripts/uji-kalender-browser.mjs | REST fixture saat QA; tanpa fallback contoh produksi |
| docs/halaman-kalender.md, docs/manajemen-kalender.md | Asal data terbaru, laporan, penerapan dan batas QA |
| ../supabase/migrations/010_calendar_events.sql | Schema, constraints, RLS, trigger, indeks |
| ../supabase/README.md | Urutan migration dan panduan kalender |

## Git handoff

Branch diperiksa: `feat/fasilitas-sekolah`; remote origin: `https://github.com/KiandrAHD/smk-telkom-purwokerto.git`. Perintah berikut hanya menambahkan file tugas kalender, kemudian commit/push dilakukan oleh pengguna:

```powershell
Set-Location 'D:/LombaTelkom/smk-telkom-purwokerto'
$calendarFiles = @(
  'frontend/src/App.jsx',
  'frontend/src/components/dashboard/DashboardSidebar.jsx',
  'frontend/src/components/dashboard/Modal.jsx',
  'frontend/src/components/kalender/CalendarBoard.jsx',
  'frontend/src/components/kalender/EventDetails.jsx',
  'frontend/src/data/dummyData.js',
  'frontend/src/data/translationsCalendar.js',
  'frontend/src/hooks/useEvents.js',
  'frontend/src/pages/KalenderPage.jsx',
  'frontend/src/pages/admin/kalender/EventForm.jsx',
  'frontend/src/pages/admin/kalender/KalenderAdminPage.jsx',
  'frontend/src/services/eventService.js',
  'frontend/src/utils/calendar.js',
  'frontend/src/utils/events.js',
  'frontend/scripts/uji-events.mjs',
  'frontend/scripts/uji-events-service.mjs',
  'frontend/scripts/uji-events-database.mjs',
  'frontend/scripts/uji-events-browser.mjs',
  'frontend/scripts/uji-kalender-browser.mjs',
  'frontend/docs/halaman-kalender.md',
  'frontend/docs/manajemen-kalender.md',
  'supabase/migrations/010_calendar_events.sql',
  'supabase/README.md'
)
git add -- $calendarFiles
git diff --cached --check
git commit -m "feat: implement admin and public calendar event management"
git push origin feat/fasilitas-sekolah
```
