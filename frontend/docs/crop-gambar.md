# Crop gambar admin

React menggunakan `react-image-crop` untuk seleksi dengan grid dan Canvas bawaan browser untuk preview serta hasil berkas.

1. Buka form Berita, Pengumuman, Prestasi, atau BKK lalu pilih satu gambar atau tarik berkas ke area unggah.
2. Pilih rasio Cover, 16:9, 4:3, atau 1:1. Geser seleksi dan tarik sudutnya; tombol panah juga dapat digunakan ketika seleksi mendapat fokus.
3. Preview hasil crop dan preview cover berubah langsung. Rasio cover menyesuaikan form, sedangkan preview cover memakai pemotongan tengah seperti `object-cover`.
4. Reset mengembalikan seleksi ke tengah dengan rasio terpilih. Batal crop mempertahankan gambar sebelumnya.
5. Tekan Gunakan Hasil Crop, lalu Simpan pada form untuk mengunggah hasil dan menyimpan URL melalui layanan penyimpanan gambar yang sudah ada. Crop ulang memakai berkas asli selama form masih terbuka.

Berkas maksimal 5 MB. Hasil crop menjadi gambar statis WebP (PNG jika encoder WebP tidak tersedia), tanpa memperbesar gambar kecil, dengan sisi panjang maksimal 1600 px. GIF kehilangan animasinya setelah crop. URL gambar lama tetap dapat digunakan; crop tersedia untuk berkas yang dipilih dari perangkat.

Komponen: `src/components/dashboard/ImageCropEditor.jsx`. Integrasi unggahan: `src/components/dashboard/ImageUploadField.jsx`. Konversi berkas: `src/utils/imageCrop.js`.

Pengujian logika: `node scripts/uji-image-crop.mjs`. Pengujian integrasi unggahan: `node scripts/uji-image-upload.mjs` dan `node scripts/uji-content-image.mjs`.
