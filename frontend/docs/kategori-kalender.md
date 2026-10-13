# Event Category dan Color Legend

Implementasi 13 Oktober 2026. Admin `/dashboard/kalender`, publik `/kalender`.

## Audit referensi

Sumber utama: [Figma terbaru, node 196:371](https://www.figma.com/design/ca2iX76GpJSr0QC7Qyv9RV/Figma-MCP?node-id=196-371). Node memiliki nama `Calender Of Event` dan berada pada page `Telkom remake` dalam respons API. Nama, posisi label, font, fill, ukuran dot, dan aset SVG dibaca langsung melalui Figma MCP. Tidak dilakukan perubahan pada Figma.

Legenda berada di bawah promo kalender, terdiri dari lima kolom dan dua baris. Urutan dibaca dari kiri ke kanan pada baris atas, lalu baris bawah. Node label `196:568–577`, dot `196:752–761`, ukuran dot asli 18 × 18 px. SVG asli disimpan lokal agar tidak bergantung pada URL sementara Figma.

| Urutan | ID tersimpan | Nama sesuai Figma | HEX indikator | Node dot |
| --- | --- | --- | --- | --- |
| 1 | upacara-nasional | Upacara Hari Nasional | #FF0033 | 196:752 |
| 2 | penilaian-siswa | Penilaian Siswa (TKA, PSAS, PSAJ) | #0080FF | 196:754 |
| 3 | libur-tahun-pelajaran | Libur Tahun Pelajaran | #A22828 | 196:756 |
| 4 | awal-pkl | Awal praktek kerja industri | #B5651D | 196:758 |
| 5 | hari-pertama-sekolah | Hari Pertama masuk sekolah | #F2FF00 | 196:760 |
| 6 | hut-smk | HUT SMK | #CFB53B | 196:753 |
| 7 | libur-akhir-semester | Libur Akhir Semester | #B300FF | 196:755 |
| 8 | perkiraan-kelulusan | Perkiraan Kelulusan | #FF9500 | 196:757 |
| 9 | cuti-bersama | Cuti bersama | #16B900 | 196:759 |
| 10 | libur-ramadhan | Libur awal Ramadhan | #8CF97D | 196:761 |

HEX mengacu pada fill SVG asli yang diekspor Figma terbaru dan diuji dari piksel tengah dot di browser. Khusus ungu: fill API bernilai sekitar r=0.7, sementara SVG terbaru diekspor menjadi #B300FF. Screenshot lampiran memiliki #B200FF; implementasi mengikuti ekspor Figma terbaru sesuai prioritas pengguna.

Audit awal kode menemukan lima kategori umum pada `utils/events.js`, tiga kelompok warna, form kategori yang sudah tersedia, tabel `events.kategori` bertipe TEXT, validasi client/server, layanan Supabase CRUD, serta hook pembaruan bersama. Tidak ada legenda pada kedua kalender. Model, field kategori, API, status publikasi, layout, dan komponen form yang tersedia digunakan kembali.

## Implementasi dan kompatibilitas

Registry `src/data/eventCategories.js` menjadi sumber kategori untuk legenda, dropdown, label, dot, badge, pencarian, validasi, dan kalender admin/publik. Setiap entri berisi ID stabil (`value`), label, HEX, urutan, aset indikator, serta kelas badge. Warna badge memakai tint 10% dan teks `dark-800` agar nama tetap terbaca pada warna terang.

Event tetap menyimpan `kategori` yang sama; adapter publik mengubah nama field menjadi `category`. Tidak ditambah kolom warna atau tabel event lain. `eventPayload` tetap membatasi field yang boleh dikirim. Tambah wajib memilih kategori secara eksplisit. Edit mengisi kategori sebelumnya dan memperbarui record menggunakan ID yang sama tanpa mengganti field event lain.

`FormInput` mendapat dukungan komponen input khusus dengan label, ID, gaya, dan hubungan error yang sama. `EventCategorySelect` memakai dukungan ini untuk dropdown berisi dot dan teks setiap pilihan. Arrow Up/Down, Home/End, huruf awal, Enter/Space, Tab, dan Escape didukung. Escape pertama menutup dropdown; Escape berikutnya menutup dialog. Pilihan yang aktif disampaikan melalui `aria-activedescendant`; field wajib dan error memakai atribut aksesibilitas. Tidak ditambah dependency.

Lima ID lama (`kegiatan`, `akademik`, `lomba`, `karier`, `lainnya`) tetap valid untuk mempertahankan event tersimpan. Ditampilkan dengan label kategori lama dan indikator netral dari token dark-500 (#6B7280), tanpa menebak kategori resmi. Form edit menyediakan kategori lama yang sedang tersimpan serta 10 pilihan resmi; form tambah hanya menawarkan kategori resmi. Nilai tidak dikenal/kosong memiliki label fallback yang jelas dan harus diperbaiki sebelum disimpan. Admin menampilkan jumlah event yang perlu ditinjau.

Pembacaan anonim Supabase hosted pada saat audit menemukan dua event Published, keduanya dengan kategori `lomba`. Draft tidak dapat dihitung melalui pembacaan publik. Tidak dilakukan mutasi data hosted.

## Database dan sinkronisasi

Migration `011_event_categories.sql` dijalankan sesudah `010`. Transaksi mengganti constraint kategori agar menerima 10 ID resmi dan lima ID lama, serta menghapus default `kegiatan` agar kategori baru harus eksplisit. Tidak ada UPDATE/DELETE terhadap row event, tidak ada penggantian ID, dan RLS/trigger/indeks tetap dipertahankan.

Supabase PostgREST dan `eventService` existing menyimpan kategori. Setelah mutation berhasil, event `school-events-changed` memperbarui halaman pada tab yang sama; sinyal localStorage memperbarui tab lain. Hook existing juga refresh saat focus/visibility dan polling 30 detik. Perangkat lain mengikuti refresh/polling, bukan subscription realtime baru. Publik tetap memakai query status Published dan RLS; bahkan sesi admin pada halaman publik hanya mengambil Published.

Migration hosted belum dijalankan dari sesi ini. CLI repository belum terhubung, token CLI dan akses administrator database tidak tersedia. Terapkan hanya migration yang belum terpasang melalui SQL Editor Supabase sebelum menggunakan kategori baru. Jika tabel `events` belum ada, terapkan `010` terlebih dahulu. Kesalahan constraint ditampilkan dengan petunjuk pemeriksaan isian/migration, tanpa melaporkan simpan berhasil.

## Typography dan layout

Website menggunakan Inter sebagai font utama dan Poppins sebagai heading, melalui token yang sudah ada pada `src/index.css`. Label Figma memakai Plus Jakarta Sans SemiBold 8 px; komponen baru mengikuti website, tanpa mengimpor font tersebut.

- Legenda/badge: Inter, 10 px, weight 600, line-height 16.25 px.
- Pilihan dropdown: Inter, token text-sm (14 px), weight 600, leading-relaxed.
- Label form: token text-xs (12 px), weight 600, dari FormInput existing.
- Border, radius, jarak, shadow, warna focus/hover, dan breakpoint memakai utility/token existing.
- Dot SVG tetap 18 × 18 px. Legenda lima kolom pada desktop dan membungkus menjadi tiga, dua, atau satu kolom pada lebar kecil.
- Navbar, sidebar, footer, primary color, font global, hero, dan aset dekorasi existing tidak diubah. Teks kategori serta deskripsi aksesibel menyertai warna.

## QA dan batasnya

Test kategori baru dijalankan sebelum implementasi dan gagal karena ID resmi belum diterima. Setelah registry dan validasi diimplementasikan, test tersebut lulus.

| Pemeriksaan | Hasil dan cakupan |
| --- | --- |
| uji-event-categories.mjs | 10 kategori resmi, payload/adapter, wajib memilih, unknown ditolak, kategori lama dipertahankan, fallback netral |
| uji-events.mjs | Validasi tanggal/waktu/URL/payload, leap date, multi-day dan agenda WIB |
| uji-events-service.mjs | Pagination, Published filter, update kategori dan informasi lainnya, ID stabil, poster/error/cleanup |
| uji-events-database.mjs | PGlite persisten: migration mempertahankan semua field lima record lama; 10 ID resmi diterima; kategori edit bertahan setelah restart; RLS, Draft privacy, constraint dan CRUD |
| uji-events-browser.mjs | Chrome dengan API/Auth fixture: 10 label/warna di legenda admin/publik dan dropdown, pixel SVG, keyboard, tambah/reload/edit/delete, kategori terpilih, warna kalender/agenda/detail, antar-tab, Draft privacy, retry/no duplicate, edit legacy |
| Responsive browser | Admin/publik/form pada 1440, 1024, 768, 375, 320 px; legenda/listbox tidak overflow, dot konsisten, pemilihan dropdown berfungsi, font/size/weight/line-height diperiksa |
| uji-kalender.mjs | 2.412 bulan, leap/year, alignment, dan fixture lama |
| uji-kalender-browser.mjs | 12 kombinasi ID/EN dan 1920–320 px, menu, route/reload, list/detail, keyboard, Today, leap/year, reduced motion, tinggi kalender stabil |
| bahasa:uji | Default/persistence/interpolation, portal, dan 81 rendered views konten |
| Proyek | ESLint, production build, git diff --check; JS/JSX tidak menyediakan script typecheck atau npm test |

Screenshot admin, publik, dan dropdown pada kelima viewport diperiksa. Artefak browser berada pada `D:/LombaTelkom/qa-output/event-categories`, regresi publik pada `D:/LombaTelkom/qa-output/event-categories-public`, log build pada `D:/LombaTelkom/qa-output/event-categories-build.log`.

QA browser memakai API/Auth fixture; QA database memakai database PGlite lokal terpisah. Hasil ini tidak membuktikan CRUD hosted dengan akun admin nyata, konkurensi multi-koneksi, atau perangkat mobile fisik. Pembacaan dua record Published hosted hanya memverifikasi akses baca/schema dasar. Full cloud end-to-end perlu dijalankan setelah migration diterapkan.

## File diubah/ditambahkan

| File | Perubahan |
| --- | --- |
| src/data/eventCategories.js | Registry 10 kategori resmi, kompatibilitas kategori lama dan fallback |
| src/assets/kalender/categories/ | 10 SVG dot asli Figma; nama file mengikuti ID kategori pada tabel |
| src/utils/events.js | Validasi/payload, default kosong dan shared color lookup |
| src/components/kalender/EventCategoryLegend.jsx | Legenda responsive bersama |
| src/components/kalender/EventCategoryLabel.jsx | Label/badge/dot bersama |
| src/components/kalender/CalendarBoard.jsx | Legenda, indikator, badge tanggal, agenda dan deskripsi aksesibel publik |
| src/components/kalender/EventDetails.jsx | Kategori berwarna pada detail admin/publik |
| src/pages/admin/kalender/KalenderAdminPage.jsx | Legenda, indikator/agenda/day list, pencarian kategori dan penanda legacy |
| src/pages/admin/kalender/EventForm.jsx | Kategori wajib, edit preselection dan informasi kategori lama |
| src/pages/admin/kalender/EventCategorySelect.jsx | Dropdown dot/label dan keyboard |
| src/components/dashboard/FormInput.jsx | Dukungan input khusus dengan label/gaya/error existing |
| src/services/eventService.js | Pesan error constraint/migration |
| src/data/translationsCalendar.js | Label kategori/legenda/fallback/error Inggris |
| scripts/uji-event-categories.mjs | Test kontrak kategori |
| scripts/uji-events-service.mjs | Regresi update kategori/payload |
| scripts/uji-events-database.mjs | Migration, kategori resmi/legacy dan persistence |
| scripts/uji-events-browser.mjs | Fungsional, warna, keyboard, typography dan responsivitas |
| ../supabase/migrations/011_event_categories.sql | Perluasan constraint tanpa mengubah event |
| ../supabase/README.md | Urutan penerapan migration |
| docs/kategori-kalender.md | Audit, laporan, pengujian dan handoff |

## Git handoff

Branch saat pengerjaan: `feat/fasilitas-sekolah`; remote `origin`: `https://github.com/KiandrAHD/smk-telkom-purwokerto.git`. Tidak dilakukan commit atau push otomatis. Salin perintah berikut setelah meninjau perubahan:

```powershell
Set-Location 'D:/LombaTelkom/smk-telkom-purwokerto'
$categoryFiles = @(
  'frontend/src/data/eventCategories.js',
  'frontend/src/assets/kalender/categories',
  'frontend/src/utils/events.js',
  'frontend/src/components/kalender/EventCategoryLegend.jsx',
  'frontend/src/components/kalender/EventCategoryLabel.jsx',
  'frontend/src/components/kalender/CalendarBoard.jsx',
  'frontend/src/components/kalender/EventDetails.jsx',
  'frontend/src/pages/admin/kalender/KalenderAdminPage.jsx',
  'frontend/src/pages/admin/kalender/EventForm.jsx',
  'frontend/src/pages/admin/kalender/EventCategorySelect.jsx',
  'frontend/src/components/dashboard/FormInput.jsx',
  'frontend/src/services/eventService.js',
  'frontend/src/data/translationsCalendar.js',
  'frontend/scripts/uji-event-categories.mjs',
  'frontend/scripts/uji-events-service.mjs',
  'frontend/scripts/uji-events-database.mjs',
  'frontend/scripts/uji-events-browser.mjs',
  'supabase/migrations/011_event_categories.sql',
  'supabase/README.md',
  'frontend/docs/kategori-kalender.md'
)
git add -- $categoryFiles
git diff --cached --check
git commit -m "feat: share calendar event categories and Figma color legend"
git push origin feat/fasilitas-sekolah
```
