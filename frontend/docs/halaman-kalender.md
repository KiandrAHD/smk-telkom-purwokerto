# Kalender Kegiatan

Route publik: `/kalender`. Akses melalui Informasi → Kalender Kegiatan pada Navbar desktop/mobile.

## Referensi dan penyesuaian

- Link awal menunjuk `183:358` (Page SPMB). Frame kalender yang cocok dengan screenshot adalah `184:359` (Calender Of Event), file `ca2iX76GpJSr0QC7Qyv9RV`.
- Mengikuti hero kalender/gelombang merah, ribbon chip, kalender di kiri, agenda terdekat di kanan, dan aksen abu-abu dari frame tersebut. Revisi `200:901` menambahkan Agenda Sekolah di bawah kalender; kartu promo “Ingin tahu lebih banyak?” dihapus sesuai permintaan.
- Inter untuk teks dan Poppins untuk heading, token primary/dark, radius, dan container `max-w-7xl` mengikuti website existing. Tidak mengubah font/global CSS.
- Breadcrumb diperbaiki menjadi Informasi → Kalender Kegiatan; menggunakan istilah SPMB existing. Ejaan heading menjadi Calendar of Events.
- Calendar di Figma adalah bitmap Oktober 2026; implementasi menggunakan tabel tanggal interaktif. Pada mobile, marker menjadi dot/jumlah; informasi lengkap ada di agenda/detail.
- Navbar/Footer, STELA, CTA SPMB memakai MainLayout. Ribbon memakai varian chip existing. Ikon interaktif memakai Lucide existing.

## Asal aset

Folder `src/assets/kalender` menyimpan aset lokal, tanpa URL sementara Figma di runtime.

| Slot | Node | Implementasi |
| --- | --- | --- |
| Ilustrasi hero | 184:426 | Source image transparan; cropping CSS mengikuti image-fill Figma, sehingga teks pada bagian lain source tidak tampil |
| Gelombang hero | 184:714 / 184:717 | Export wave + SVG mask asli; di belakang ilustrasi |
| Aksen kanan/kiri | 184:427 / 184:719 | Export dekorasi, hanya sebagai latar noninteraktif |

Aset kalender kecil dan empat kelopak khusus promo sudah dihapus karena tidak lagi digunakan. Foto kartu Agenda Sekolah berasal dari `events.gambar_url`, bukan foto contoh Figma.

## Data dan interaksi

Kalender publik membaca tabel Supabase `public.events` melalui `eventService` dan `useEvents`, hanya untuk status Published. Admin `/dashboard/kalender` memakai tabel yang sama dengan RLS administrator. Migration `010_calendar_events.sql` perlu diterapkan sebelum kalender dapat memuat data resmi; tidak ada fallback jadwal contoh ketika API gagal.

`calendarEvents.js` hanya dipakai sebagai fixture tujuh contoh Figma dalam pengujian, tidak diimpor kalender produksi. Detail memakai `EventDetails` dan Modal existing. Tanggal DATE dan waktu TIME disimpan sebagai nilai kalender WIB; event beberapa hari ditampilkan pada setiap tanggal dalam rentangnya. Lihat `manajemen-kalender.md` untuk schema, penerapan migration, sinkronisasi, dan batas verifikasi.

- Navigasi bulan/tahun, picker bulan, Hari Ini menggunakan tanggal Asia/Jakarta.
- Minggu dimulai Senin; perhitungan tanggal sintetis UTC menghindari pergeseran timezone/DST.
- Pemilihan tanggal memfilter sidebar. Daftar menampilkan semua agenda pada bulan aktif; empty state tersedia.
- Arrow keys dan Home/End untuk tanggal; Arrow keys/Home/End untuk tab; native dialog mendukung Escape dan pengembalian fokus.
- Input bulan mendukung tahun 0100–9999; navigasi dibatasi pada rentang ini.
- Pergantian bulan memakai token animasi existing; reduced motion menonaktifkan animasi. Tinggi kalender tetap saat jumlah minggu berubah.

## Agenda Sekolah

`KalenderPage` memetakan satu hasil `useEvents(true)` menjadi data kalender yang sama untuk `CalendarBoard` dan `SchoolAgendaSection`. Section berada sesudah kalender dan sebelum STELA yang ditambahkan `MainLayout`; tidak ada fetch kedua atau data contoh produksi.

`selectSchoolAgenda` hanya memilih Published, menghapus duplikasi berdasarkan ID, lalu membatasi hasil maksimal tiga. Kegiatan berlangsung/mendatang diurutkan berdasarkan tanggal mulai lalu waktu mulai secara menaik, memakai batas waktu akhir WIB dari `upcomingEvents`. Jika belum mencapai tiga, slot sisanya diisi kegiatan lampau berdasarkan tanggal selesai terbaru, tanggal mulai terbaru, lalu waktu selesai terbaru. Kegiatan hari ini tanpa waktu selesai tetap dianggap relevan sepanjang hari. Filter tanggal/bulan kalender tidak mengubah pilihan section ini. Hasil kosong tidak diisi kartu buatan.

Kartu memakai foto `gambar_url`, judul, ringkasan (atau deskripsi jika ringkasan kosong), tanggal/rentang tanggal, serta `EventCategoryLabel` yang sama dengan kalender. Bingkai merah transparan, foto rasio 477:346, dan badan putih mengikuti komposisi `200:1296–1315`; isi dinamis tidak mengubah kategori maupun warna. Layout tiga kolom desktop, dua tablet, dan satu mobile memakai Inter/Poppins existing, clamp judul dua baris dan ringkasan tiga baris. Gambar kosong atau gagal dimuat memakai ikon dan keterangan netral. Reveal dan hover lift menghormati reduced motion.

Seluruh kartu adalah tombol dengan label detail; Enter atau klik membuka `EventDetails` dalam Modal existing. Escape/tombol Tutup mengembalikan fokus ke kartu. Edit, unpublish, dan hapus ikut mekanisme refresh `useEvents`, termasuk pemberitahuan perubahan, fokus jendela, dan interval existing.

## Validasi

Jalankan dari frontend:

```powershell
node scripts/uji-kalender.mjs
node scripts/uji-kalender-browser.mjs
node scripts/uji-school-agenda.mjs
node scripts/uji-school-agenda-browser.mjs
npm.cmd run lint
npm.cmd run build
npm.cmd run bahasa:uji
```

Browser script memakai preview di `127.0.0.1:4173`; dapat diubah melalui `QA_URL`. Gunakan `PLAYWRIGHT_MODULE` bila Playwright berasal dari runtime bundel. `QA_OUTPUT` menentukan lokasi screenshot/results. API kegiatan disimulasikan dengan fixture dalam skrip ini; hasilnya membuktikan interaksi UI, bukan penerapan migration di Supabase aktif.

Unit checks: 2.412 bulan (1900–2100), susunan Senin–Minggu, kontinuitas tanggal, Februari 1900/2000/2024/2100, pergantian tahun, batas tahun maksimum, data unik, dan bulan kosong.

Browser checks: route/reload, menu desktop/mobile, Back/Forward, posisi tanggal, tahun kabisat, pergantian tahun, date/empty/list/detail/Escape, keyboard tanggal/tab, Hari Ini, 1920/1440/1024/768/375/320 px pada ID/EN, tinggi lima/enam minggu, overflow, metadata, shared layout tunggal, reduced motion, dan runtime errors. Screenshot dibandingkan secara visual dengan Figma; tidak mengklaim pixel-perfect karena pemetaan design system dan penyesuaian responsif.

QA khusus Agenda: selector lulus privasi Published, urutan ongoing/upcoming, pengisian kegiatan lampau, batas tiga, deduplikasi, data asal tidak berubah, dan batas WIB. Browser khusus agenda memakai API fixture dan gambar khusus QA; lulus gambar normal/kosong/rusak, detail keyboard/klik/Escape/fokus, kalender dan agenda membuka detail yang sama, edit/unpublish/delete-refresh, empty/error/retry/reload, serta 12 kombinasi viewport/bahasa dengan rasio foto, tinggi kartu, kolom, overflow, Inter/Poppins, dan reduced motion. Output `C:/Users/IDEAPAD SLIM 3/AppData/Local/Temp/school-agenda-qa`; ini bukan bukti CRUD atau upload pada Supabase aktif.

Hasil 13 Oktober 2026: seluruh checks di atas, ESLint, production build, tes bahasa (termasuk 81 rendered views), dan `git diff --check` berhasil. Tidak ada konfigurasi TypeScript/typecheck pada proyek JS/JSX ini. Browser QA memakai Chrome otomatis; belum diuji pada perangkat fisik. Screenshot tersimpan di `D:/LombaTelkom/qa-output/kalender-2026-10-13`.

## Daftar file

| File | Alasan |
| --- | --- |
| `src/pages/KalenderPage.jsx`, `src/pages/KalenderPage.css` | Hero, komposisi halaman, mask aset lokal |
| `src/components/kalender/CalendarBoard.jsx` | Kalender/daftar, agenda, detail dan interaksi keyboard |
| `src/components/kalender/SchoolAgendaSection.jsx`, `src/utils/events.js` | Agenda Published maksimal tiga dari data kalender yang sama, foto/fallback dan detail bersama |
| `src/utils/calendar.js` | Perhitungan tanggal dan pemilahan agenda |
| `src/data/calendarEvents.js` | Tujuh contoh Figma dengan status bukan jadwal resmi |
| `src/data/translationsCalendar.js`, `src/data/translations.js` | Kamus dan integrasi ID/EN |
| `src/App.jsx` | Lazy route dan metadata `/kalender` |
| `src/components/Navbar.jsx`, `src/data/dummyData.js` | Prefetch serta menu Informasi, tanpa perubahan styling navbar |
| `src/assets/kalender/` | Aset ilustrasi, mask, dekorasi dan kategori dari Figma; aset promo dihapus |
| `scripts/uji-kalender.mjs`, `scripts/uji-kalender-browser.mjs` | Verifikasi tanggal dan interaksi/visual browser |
| `scripts/uji-school-agenda.mjs`, `scripts/uji-school-agenda-browser.mjs` | Verifikasi pemilihan, privasi, kartu, refresh data, aksesibilitas dan tampilan agenda |
| `scripts/uji-bahasa.mjs` | Ekspektasi submenu kalender dan terjemahannya |
| `docs/halaman-kalender.md` | Referensi, keputusan implementasi dan laporan validasi |
