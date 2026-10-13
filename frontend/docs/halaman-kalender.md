# Kalender Kegiatan

Route publik: `/kalender`. Akses melalui Informasi → Kalender Kegiatan pada Navbar desktop/mobile.

## Referensi dan penyesuaian

- Link awal menunjuk `183:358` (Page SPMB). Frame kalender yang cocok dengan screenshot adalah `184:359` (Calender Of Event), file `ca2iX76GpJSr0QC7Qyv9RV`.
- Mengikuti hero kalender/gelombang merah, ribbon chip, kalender di kiri, agenda/promo di kanan, dan aksen abu-abu dari frame tersebut.
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
| Kalender kecil promo | 184:505 | Export node |
| Aksen kanan/kiri | 184:427 / 184:719 | Export dekorasi, hanya sebagai latar noninteraktif |
| Kelopak promo | 184:501–504 | SVG asli dari design context |

## Data dan interaksi

`calendarEvents.js` berisi tujuh contoh dari Figma, BUKAN jadwal resmi: upacara 1 Oktober, tryout 2 Oktober, dan TKA 26–30 Oktober 2026. Banner contoh di atas kalender dihapus sesuai permintaan pengguna; label contoh tetap ada pada detail dan status data sumber. Tidak menggunakan tanggal publikasi pengumuman sebagai tanggal kegiatan.

Belum ada API agenda resmi. Dataset lokal dapat diganti dengan data terverifikasi; setelah itu label contoh juga harus diperbarui. `CalendarBoard` menerima array `events`; setiap item memiliki `id`, `date` (YYYY-MM-DD), `title`, `start`, `end`, `location`, `category`. Jam menggunakan WIB. Belum ada route detail kegiatan resmi; detail ditampilkan melalui Modal existing.

- Navigasi bulan/tahun, picker bulan, Hari Ini menggunakan tanggal Asia/Jakarta.
- Minggu dimulai Senin; perhitungan tanggal sintetis UTC menghindari pergeseran timezone/DST.
- Pemilihan tanggal memfilter sidebar. Daftar menampilkan semua agenda pada bulan aktif; empty state tersedia.
- Arrow keys dan Home/End untuk tanggal; Arrow keys/Home/End untuk tab; native dialog mendukung Escape dan pengembalian fokus.
- Input bulan mendukung tahun 0100–9999; navigasi dibatasi pada rentang ini.
- Pergantian bulan memakai token animasi existing; reduced motion menonaktifkan animasi. Tinggi kalender tetap saat jumlah minggu berubah.

## Validasi

Jalankan dari frontend:

```powershell
node scripts/uji-kalender.mjs
node scripts/uji-kalender-browser.mjs
npm.cmd run lint
npm.cmd run build
npm.cmd run bahasa:uji
```

Browser script memakai preview di `127.0.0.1:4173`; dapat diubah melalui `QA_URL`. Gunakan `PLAYWRIGHT_MODULE` bila Playwright berasal dari runtime bundel. `QA_OUTPUT` menentukan lokasi screenshot/results.

Unit checks: 2.412 bulan (1900–2100), susunan Senin–Minggu, kontinuitas tanggal, Februari 1900/2000/2024/2100, pergantian tahun, batas tahun maksimum, data unik, dan bulan kosong.

Browser checks: route/reload, menu desktop/mobile, Back/Forward, posisi tanggal, tahun kabisat, pergantian tahun, date/empty/list/detail/Escape, keyboard tanggal/tab, Hari Ini, 1920/1440/1024/768/375/320 px pada ID/EN, tinggi lima/enam minggu, overflow, metadata, shared layout tunggal, reduced motion, dan runtime errors. Screenshot dibandingkan secara visual dengan Figma; tidak mengklaim pixel-perfect karena pemetaan design system dan penyesuaian responsif.

Hasil 13 Oktober 2026: seluruh checks di atas, ESLint, production build, tes bahasa (termasuk 81 rendered views), dan `git diff --check` berhasil. Tidak ada konfigurasi TypeScript/typecheck pada proyek JS/JSX ini. Browser QA memakai Chrome otomatis; belum diuji pada perangkat fisik. Screenshot tersimpan di `D:/LombaTelkom/qa-output/kalender-2026-10-13`.

## Daftar file

| File | Alasan |
| --- | --- |
| `src/pages/KalenderPage.jsx`, `src/pages/KalenderPage.css` | Hero, komposisi halaman, mask aset lokal |
| `src/components/kalender/CalendarBoard.jsx` | Kalender/daftar, agenda, detail dan interaksi keyboard |
| `src/utils/calendar.js` | Perhitungan tanggal dan pemilahan agenda |
| `src/data/calendarEvents.js` | Tujuh contoh Figma dengan status bukan jadwal resmi |
| `src/data/translationsCalendar.js`, `src/data/translations.js` | Kamus dan integrasi ID/EN |
| `src/App.jsx` | Lazy route dan metadata `/kalender` |
| `src/components/Navbar.jsx`, `src/data/dummyData.js` | Prefetch serta menu Informasi, tanpa perubahan styling navbar |
| `src/assets/kalender/` | Sepuluh aset ilustrasi, mask, dekorasi, dan kelopak dari Figma |
| `scripts/uji-kalender.mjs`, `scripts/uji-kalender-browser.mjs` | Verifikasi tanggal dan interaksi/visual browser |
| `scripts/uji-bahasa.mjs` | Ekspektasi submenu kalender dan terjemahannya |
| `docs/halaman-kalender.md` | Referensi, keputusan implementasi dan laporan validasi |
