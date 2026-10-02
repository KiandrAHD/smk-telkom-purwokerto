# Contoh unggah gambar admin

Jalankan dari folder `frontend`:

```powershell
npm.cmd run dev -- --host 127.0.0.1 --port 5178
```

Buka http://127.0.0.1:5178/examples/image-upload.html. Contoh memakai keempat
form asli. Pilih tab, isi field wajib, lalu seret gambar atau klik `Pilih berkas`.
Pratinjau tampil sebelum submit. Contoh hanya menampilkan payload yang diterima,
tanpa menulis database; checkbox kegagalan menguji pesan error di dalam form.

Di dashboard sebenarnya, service tiap kategori mengunggah berkas ke bucket
`content-images`, lalu menyimpan public URL pada `gambar_url` atau `logo_url`.
Bucket dan izin admin sudah didefinisikan dalam migration `001_initial_schema.sql`.
Tidak perlu dependency atau migration baru. Gunakan session admin Supabase yang
valid untuk menguji penyimpanan sungguhan.

Kode yang digunakan:

- `src/components/dashboard/ImageUploadField.jsx`: drop zone, file picker,
  pratinjau blob, pembatalan validasi usang, pelepasan object URL, dan error aksesibel.
- `src/utils/imageFile.js`: validasi ekstensi, MIME, signature berkas, dan batas
  5 × 1024 × 1024 byte. MIME kosong dapat memakai ekstensi dan signature.
- `src/services/contentImageService.js`: upload hanya saat submit, path unik,
  kompatibilitas URL lama, serta cleanup setelah penolakan database yang pasti.
- `src/pages/admin/prestasi/PrestasiForm.jsx`: contoh integrasi React lengkap;
  BKK, Berita, dan Pengumuman memakai komponen yang sama.

Validasi browser membantu pengguna; batas ukuran/MIME dan izin admin tetap
ditegakkan oleh Supabase Storage. Pemeriksaan signature di frontend bukan
pengganti pemeriksaan isi berkas di server.

Jalankan pemeriksaan otomatis:

```powershell
node scripts/uji-image-upload.mjs
npm.cmd run lint
npm.cmd run build
```

File API, input file, drag/drop, dan object URL dipilih karena tersedia secara
native di browser modern. File picker juga mendukung perangkat sentuh dan
keyboard. Tidak perlu library dropzone untuk satu gambar maksimal 5 MB.

Referensi API: [MDN File API](https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications),
[Supabase upload](https://supabase.com/docs/reference/javascript/file-buckets-upload).
