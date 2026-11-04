# Audit Profil Sekolah — frame 316:1350

Referensi: https://www.figma.com/design/ca2iX76GpJSr0QC7Qyv9RV/Figma-MCP?node-id=316-1350

## Bukti dan metode

Frame dibaca melalui Figma MCP, termasuk root Metode Pembelajaran `316:1912` dan kedua foto `316:1936` / `316:1938`. Perbandingan visual memakai screenshot Figma 1847×8041 dan website pada viewport 1847px, bukan klaim pixel-identical. Bukti lokal: `figma-1847.webp`, `website-1847.webp`, `learning-1847-id.webp`, `learning-375-en.webp`. Tinggi halaman berbeda karena container, font, wrapping, dan fitur existing.

`IMPLEMENTED` berarti elemen/konten dan komposisi yang disebut tersedia sesuai referensi dalam design system existing. `PARTIAL` berarti ada perbedaan visual nyata yang dijelaskan. Tidak ada section utama yang masih `MISSING`; ini tidak berarti seluruh halaman identik dengan Figma.

## Checklist seluruh halaman

| Area | Status | Hasil visual / perbedaan |
| --- | --- | --- |
| Navbar | PARTIAL | Logo, navigasi, ID/EN dan SPMB tersedia. Container shared 80rem lebih sempit dari frame; spacing dan ukuran teks berbeda. Tidak diubah global. |
| Hero | PARTIAL | Gedung, heading, deskripsi dan CTA tersedia. Container 80rem, crop/banner kanan, badge DigitalSmartSchool dan label CTA existing berbeda dari Figma. Carousel CMS tetap dipertahankan. |
| Statistik hero | PARTIAL | Empat statistik menempel pada hero. Nilai mengikuti data website; ikon dan ukuran tidak semuanya sama dengan frame. |
| Ribbon dekoratif | IMPLEMENTED | Motif sekolah merah/hitam/putih tersedia sesudah hero, tidak diduplikasi. |
| Tentang & video | PARTIAL | Teks, panel, video merah, logo putih dan CTA tersedia. Proporsi panel, ukuran play dan wrapping berbeda. Video HTML5 click-to-load dipertahankan. |
| Visi & Misi | PARTIAL | Dua card dan ikon Figma asli tersedia. Lebar, typography dan pembungkusan teks menyesuaikan grid existing. |
| Nilai-Nilai Stematel | PARTIAL | Empat nilai Innovation/Character/Technology/Collaboration beserta ikon tersedia. Lebar card dan ketebalan font tidak identik. |
| Perjalanan Kami | PARTIAL | Lima tahun 2012/2016/2020/2023/2026 dan ikon tersedia. Warna tahun aktif, garis timeline, wrapping dan tinggi panel berbeda karena interaksi existing. |
| Wave marquee | PARTIAL | Tiga pesan dan ikon tersedia, animasi dipertahankan. Fase animasi, kurva dan posisi teks tidak identik pada screenshot statis. |
| Kepala Sekolah | PARTIAL | Foto, nama, jabatan dan kutipan tersedia. Tinggi, padding serta proporsi foto berbeda. |
| Guru & Tenaga Pendidik | PARTIAL | Empat profil desktop, pagination, detail dan CTA tersedia. Card existing memiliki dekorasi merah yang tidak ada pada referensi; data terbaru dipertahankan. |
| Metode Pembelajaran — kelengkapan | IMPLEMENTED | Tepat sesudah Guru dan sebelum Fasilitas; eyebrow, heading dua warna, Smart School, divider, dua foto, buku/prosesor, dua uraian serta LMS/JUARA/LIONS/DITA lengkap. |
| Metode Pembelajaran — pixel fidelity | PARTIAL | Rasio foto 852:420 dan 776:406 dipertahankan, aset dicrop dari composite asli. Font/token warna existing menggantikan Poppins/warna hardcoded; wrapping dan gutter berbeda sedikit. |
| Perjalanan Talenta Digital | IMPLEMENTED | Panel, tiga tahap Kelas X/XI/XII, ikon asli, judul, deskripsi dan connector tersedia. Tahap menjadi vertikal di mobile; teks tetap HTML/i18n. |
| Fasilitas — komposisi | PARTIAL | Satu carousel tiga kartu, latar/dekorasi dan enam indikator tersedia. Foto robotik memakai koleksi website, bukan foto presentasi Figma; ukuran teks/indikator berbeda. |
| Fasilitas — urutan indikator | IMPLEMENTED | Lab Jaringan, Ruang Kelas, Perpustakaan, Lab Komputer, Lab Robotik, Fasilitas Lainnya sesuai Figma. Urutan indikator dipisahkan dari urutan putaran supaya kartu robotik tetap menjadi tetangga jaringan. |
| Fasilitas — CTA | IMPLEMENTED | School Tour dan Lihat Fasilitas Lainnya, urutan dan tujuan route dipertahankan. |
| Digital Innovation | PARTIAL | Teks dan highlight merah tersedia. Lebar, font dan warna teks berbeda; animasi reveal existing dipertahankan. |
| Banner NEXA | PARTIAL | Branding NEXA, maskot, contoh percakapan dan CTA tersedia. Container shared lebih sempit dan jarak vertikal berbeda. |
| CTA SPMB | PARTIAL | Ikon, copy dan tombol tersedia. Container serta skala teks mengikuti shared component. |
| Footer | PARTIAL | Logo, menu, informasi, kontak, peta dan copyright tersedia. Ada Flexbox supporter dan visitor counter existing; peta ditempatkan di kolom kontak, bukan kolom kelima Figma. |
| Floating NEXA | PARTIAL | Fitur tambahan existing, tidak ditampilkan pada frame; dipertahankan. Reminder ditutup melalui preferensi storage saat screenshot QA. |

Perbedaan shared component dicatat, bukan diperbaiki dengan redesign global yang dapat mengubah halaman lain. Audit ini belum menyelesaikan pixel fidelity seluruh halaman.

## Perubahan pada task ini

- Menambahkan komponen reusable `TentangMetodePembelajaranSection`, data metode/tahap, 18 mapping terjemahan baru (Kelas X/XI/XII memakai mapping existing).
- Memisahkan enam crop WebP dari composite Figma, memakai SVG buku dan connector asli. Tidak merasterisasi teks.
- Menambahkan responsive styles yang scoped pada halaman Profil dan breakpoint existing.
- Membetulkan urutan indikator fasilitas tanpa menghilangkan autoplay, infinite wrap, navigasi, atau CTA.
- Menambahkan pengujian urutan section, i18n, jumlah elemen, rasio foto, teacher pagination, console errors, dan viewport 1024px.

## Verifikasi

- 16 kombinasi: 1920, **1847 (matching frame)**, 1440, 1366, 1024, 768, 390, 375 × ID/EN.
- Lulus: tidak ada horizontal overflow; box yang diuji tidak clipping; seluruh aset profile termuat; rasio dua foto tidak terdistorsi; empat platform dan tiga tahap tersedia.
- Lulus: teacher next/previous, route detail guru, timeline aktif, video hanya dimuat setelah klik dan memiliki controls, facilities wrap/autoplay, serta dua link CTA.
- Lulus: tidak ada `pageerror` atau console bertipe `error` dalam matriks terisolasi.
- QA visual memock `/api/**` sebagai array kosong. Ini bukan verifikasi backend live. Tanpa backend lokal, request `localhost:3000` menghasilkan connection refused.
- `npm run lint`, `uji-profile-content.mjs`, `uji-facilities-actions.mjs`, `uji-floating-hero-structure.mjs`, dan `npx vite build --logLevel error` lulus.
- `npm run build` awal berhenti saat prerender SEO karena backend `localhost:3000` tidak tersedia; kompilasi Vite sukses.
- Setelah perbaikan PR #97, `CI=true npm run build:ci` dan `node scripts/uji-seo.mjs --offline` lulus untuk 102 halaman. Output offline sengaja noindex dan tidak boleh dideploy.
- PR #97: konflik `TentangPage.jsx` diselesaikan dengan mempertahankan satu WaveMarquee sesudah timeline. Parser aset prerender diperbaiki agar tidak memasukkan `)` dari CSS `url(...)` ke nama aset; regression test memeriksa mask logo produksi dan tidak adanya URL `/src/assets/`.
- Tidak ada mobile frame khusus pada referensi yang diberikan; layout mobile diuji usability/geometry, bukan diklaim pixel-identical terhadap desain mobile yang tidak tersedia.
