# Halaman Fasilitas Sekolah

Route: `/fasilitas`. Menu: Tentang → Fasilitas Sekolah.

Referensi Figma: file `ca2iX76GpJSr0QC7Qyv9RV`, frame `174:534` (1847 × 4297), dan varian kategori `174:151`.

Hero, heading, filter pill, section kategori, proporsi gambar card 356:201, radius 20px, shadow, STELA, CTA pendaftaran, dan dekorasi mengikuti frame. Header/Footer memakai komponen global tanpa mengubah desainnya. Font Plus Jakarta Sans hanya dimuat pada halaman fasilitas; font global tetap.

Figma masih berisi card contoh kelas dan foto yang berulang di kategori lain. Implementasi memakai delapan data unik dari `fasilitasData.js`: tiga laboratorium, empat gedung kelas, satu perpustakaan. Tidak menambahkan fasilitas Aula/GOR/Parkiran tanpa data. Foto Gedung C/D tetap menggunakan aset yang tersedia pada project. Tinggi halaman mengikuti konten nyata, bukan jumlah card contoh Figma.

Beranda hanya merender carousel dan timeline. Link Lihat semua fasilitas menuju halaman baru dengan client routing; klik slide tengah membuka kategori terkait. Animasi carousel, autoplay enam detik, loop, hover/focus pause, ukuran, posisi, dan stylesheet carousel dipertahankan.

Filter menggunakan query `kategori`, mempertahankan parameter lain dan posisi scroll. Refresh mempertahankan kategori. Tombol Selengkapnya membuka modal deskripsi existing, dengan Escape, fokus kembali, dan penguncian scroll. Tidak menambah halaman detail.

Terjemahan memakai sistem `useLanguage` dan kamus existing. Aset hero, foto, banner ID/EN, Header/Footer, dan modal digunakan kembali. Dekorasi samping diekspor dari node Figma `174:537`, badge CTA dari `174:905`.

Verifikasi:

- `npm run lint`, `npm run build`.
- `node scripts/uji-footer-fasilitas.mjs`: terjemahan/data fasilitas serta regresi footer.
- `node scripts/uji-halaman-fasilitas.mjs`: navigasi tanpa reload, refresh, scroll atas, delapan card unik, filter 3/4/1/8, delapan modal/Escape/fokus, gambar, grid 4/2/1, ID/EN pada 1920/1440/1366/768/390/375px, loop/autoplay dan menu Tentang.
- `node scripts/uji-fasilitas-motion.mjs`: transisi masuk/keluar dua arah dan batas loop pada desktop/mobile, klik cepat.
- `node scripts/uji-fasilitas-loop.mjs`: tiga siklus autoplay, pause/resume, navigasi manual, momentum scroll, hit area panah, kembali dari halaman fasilitas, reduced motion, unmount.

Browser QA memerlukan paket Playwright. Jika menggunakan runtime Codex, set `PLAYWRIGHT_MODULE` ke path paket tersebut. `QA_URL` dapat menunjuk dev atau production preview. Screenshot disimpan di `D:/LombaTelkom/qa-output/fasilitas-page-2026-10-12`.

Routing Vercel sudah memiliki rewrite ke `index.html`. Tidak memerlukan perubahan deployment config. Verifikasi deploy publik dilakukan setelah user melakukan publish.
