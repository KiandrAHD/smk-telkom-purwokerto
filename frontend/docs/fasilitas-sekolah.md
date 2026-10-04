# Fasilitas Sekolah

Implementasi di beranda setelah Jurusan, sebelum Mitra dan Prestasi. Section lain tetap memakai komponen semula.

Referensi: https://www.figma.com/design/ca2iX76GpJSr0QC7Qyv9RV/Figma-MCP?node-id=146-2125

Frame menyediakan carousel dan indikator 01–06. Area detail pada frame masih kosong; grid kartu dibuat mengikuti spesifikasi tertulis pengguna.

## File

- `src/components/FacilitiesSection.jsx`: carousel, indikator, handoff, filter, grid, dan modal deskripsi.
- `src/data/fasilitasData.js`: delapan fasilitas, kategori, preview, deskripsi lengkap dari lampiran, dan impor gambar.
- `src/pages/LandingPage.jsx`: penempatan komponen.
- `src/assets/fasilitas/`: foto WebP dan aset dekorasi asli Figma.

## Interaksi

NEXT pada item 06 tetap mempertahankan slide aktif, memilih Semua, memberi pulse satu kali pada indikator, menggerakkan carousel sedikit ke atas, lalu menggunakan Lenis untuk scroll ke detail. Fokus keyboard dipindahkan ke judul setelah scroll selesai. Filter aktif memperoleh pulse merah singkat untuk menyambungkan alur visual.

Kartu carousel tengah membuka detail sesuai kategori. Filter menggunakan button dengan aria-pressed. GSAP Flip mengatur perpindahan posisi kartu, dengan exit opacity/scale dan reveal bertingkat. Kontrol filter dikunci sebentar sampai animasi selesai untuk mencegah state dan animasi bertumpuk. Tidak ada autoplay atau animasi berulang terus-menerus.

Grid memakai 4 kolom mulai 1024px, 2 kolom mulai 640px, dan 1 kolom di ponsel. Filter dan indikator dapat digeser horizontal dalam wadahnya. Modal mengikuti pola dialog native yang sudah digunakan proyek; Escape menutup modal dan mengembalikan fokus.

Reduced motion menonaktifkan reveal dan perpindahan kartu, serta membuat handoff scroll langsung. Tidak ada dependency baru.

## Pemetaan foto

| Fasilitas | Lampiran |
| --- | --- |
| Kelas Gedung A | Foto Kelas - A.jpg |
| Kelas Gedung B | Foto Kelas - B.jpeg |
| Kelas Gedung C | Foto Kelas - C.jpg |
| Kelas Gedung D | Ruang Kelas - B.jpg |
| Lab Komputer | Lab Komputer - D.jpg |
| Lab Jaringan | Labotarium Jaringan - A.jpeg |
| Lab Robotik | Lab Robotik - E.png |
| Perpustakaan | Perpustakaan - C.jpg |

Tidak tersedia foto khusus Gedung D. Foto pada kartu Gedung D adalah foto kelas yang disediakan, bukan bukti identitas lokasi Gedung D. Foto C dan Ruang Kelas B memperlihatkan ruangan yang sama. Foto perpustakaan memiliki tulisan bawaan pada bagian bawah; file tidak diedit untuk menghapusnya.

Foto dikonversi ke WebP dengan sisi panjang horizontal maksimum 1200px tanpa upscaling. Sumber asli tetap utuh. Gambar dimuat lazy.

Background kiri/kanan, motif kiri/atas, dan panah berasal dari aset frame Figma. SVG memakai ukuran intrinsik, dengan skala pada wrapper dekorasi. Tidak ada URL aset Figma sementara pada runtime.

## Validasi 4 Oktober 2026

- Lint: lulus tanpa warning.
- Build: lulus.
- Diff check: lulus.
- Chrome 1440×900, 768×1024, 390×844, serta 390×844 dengan reduced motion: handoff item 06 dan fokus judul, filter berulang dengan jumlah 8/3/4/1, modal dan Escape, gambar setelah masuk viewport, serta overflow halaman lulus.
- Navigasi NEXT lima kali, PREVIOUS, lalu NEXT ke detail: lulus; indikator tetap 06 dan fokus masuk judul.
- Tidak ditemukan runtime error atau console error dalam pemeriksaan alur navigasi.
- Screenshot carousel dan grid diperiksa secara visual. Grid detail mengikuti spesifikasi tertulis karena belum digambar pada frame.

Commit dan push belum dilakukan.
