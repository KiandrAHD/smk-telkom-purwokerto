# Supabase — SMK Telkom Purwokerto

Dokumen ini menjelaskan database, Row Level Security (RLS), dan Storage untuk platform Digital Smart School.

## Menjalankan migration

Migration dijalankan berurutan dari `001_initial_schema.sql` sampai `006_ppdb_upload_and_input_guard.sql`. Terapkan migration `004` dan `005` sebelum frontend yang membaca kolom baru; `006` harus diterapkan bersama frontend yang memakai path upload baru.

### Supabase CLI

Pastikan Supabase CLI sudah terpasang, lalu jalankan dari root repository:

```bash
supabase login
supabase link --project-ref <PROJECT_REF>
supabase db push
```

Jika project lokal sudah terhubung, `supabase db push` akan menjalankan migration yang belum diterapkan.

### SQL Editor

Alternatifnya, buka Supabase Dashboard → **SQL Editor**, lalu jalankan berkas migration menurut nomor. Jalankan hanya migration yang belum terpasang pada project tersebut.

## Struktur database

Semua primary key menggunakan UUID dengan default `gen_random_uuid()`. Semua tabel operasional memakai `created_at` dan `updated_at` bertipe `TIMESTAMPTZ`; `updated_at` diperbarui otomatis oleh trigger ketika row diubah.

| Tabel | Kegunaan |
| --- | --- |
| `admins` | Penghubung akun Supabase Auth dengan admin aplikasi. Tidak menyimpan password. |
| `berita` | Artikel berita dengan slug unik dan status `draft`/`published`. |
| `pengumuman` | Pengumuman sekolah dengan tanggal publikasi/acara dan status `draft`/`published`. |
| `prestasi` | Data prestasi sekolah. Nilai `tingkat` sengaja berupa teks fleksibel. |
| `bkk` | Lowongan kerja atau peluang BKK dengan status `aktif`/`ditutup`. |
| `ppdb` | Formulir pendaftaran publik dengan status proses administrasi. |

Kolom dan tipe data pada keenam tabel mengikuti rancangan fase 1. Constraint status mencegah nilai status di luar daftar yang ditentukan.

## Row Level Security

RLS aktif untuk seluruh tabel.

- Pengunjung anonim dapat membaca berita published, pengumuman published, seluruh prestasi, dan BKK aktif.
- User PPDB yang sudah authenticated dapat membuat row PPDB miliknya sendiri. Insert dipaksa berstatus `menunggu` dan tidak boleh mengisi `catatan_admin`.
- User PPDB hanya dapat membaca submission miliknya sendiri; user tidak dapat mengubah atau menghapus submission.
- Admin terautentikasi dapat SELECT/INSERT/UPDATE/DELETE berita, pengumuman, prestasi, dan BKK.
- Admin dapat SELECT dan UPDATE PPDB, tetapi tidak diberi DELETE.
- Fungsi `public.is_admin()` memeriksa keberadaan `auth.uid()` pada tabel `admins` menggunakan `SECURITY DEFINER` agar policy tidak mengalami rekursi RLS.

Frontend harus memakai `VITE_SUPABASE_ANON_KEY` atau publishable key. Jangan pernah memasukkan `service_role` key ke frontend, repository publik, atau environment variable yang dikirim ke browser.

## Storage

Migration membuat dua bucket:

### `content-images`

- Public read agar gambar berita, pengumuman, prestasi, dan logo BKK dapat ditampilkan pengunjung.
- Admin saja yang dapat upload, update, dan delete.
- Format yang diizinkan: JPEG, PNG, WebP, dan GIF.

### `ppdb-documents`

- Bucket private; jangan memakai `getPublicUrl()` untuk dokumen PPDB.
- User authenticated hanya dapat upload satu PDF pada path `submissions/<auth_user_id>/document.pdf` miliknya. File tidak dapat ditimpa; retry setelah kegagalan insert menghapus berkas sementara terlebih dahulu.
- Pengunjung anonim tidak dapat membaca, mengubah, atau menghapus file. Pemilik dapat membaca dan menghapus berkas sementara yang belum terhubung dengan submission.
- Admin dapat membaca dan mengelola file.
- Simpan object path pada `ppdb.dokumen_url`. Saat admin perlu melihat file, buat signed URL dengan masa berlaku terbatas menggunakan Storage API. Dokumen lama dengan path berbeda tetap dapat dibaca; berkas yatim lama dapat dibersihkan admin setelah diperiksa.

## Membuat admin pertama

1. Buka Supabase Dashboard → **Authentication** → **Users** → **Add user**.
2. Buat user dengan email dan password. Password dikelola sepenuhnya oleh Supabase Auth.
3. Salin UUID user tersebut.
4. Di SQL Editor, hubungkan user ke tabel `admins`:

```sql
INSERT INTO public.admins (user_id, nama)
VALUES ('UUID_USER_DARI_AUTH', 'Nama Admin');
```

Verifikasi hubungan tersebut:

```sql
SELECT id, user_id, nama, created_at
FROM public.admins
WHERE user_id = 'UUID_USER_DARI_AUTH';
```

Jangan menyimpan password di `public.admins`. Untuk menambah admin berikutnya, ulangi proses pembuatan user Auth dan insert relasi tersebut. `user_id` unik sehingga satu akun Auth hanya dapat memiliki satu row admin.

## Catatan integrasi frontend

Frontend memakai Supabase Auth untuk portal PPDB dan session admin. Query publik harus tetap memfilter status sesuai policy, sedangkan operasi admin harus menggunakan session Supabase Auth dari user yang terdaftar di `admins`.

## Ownership PPDB (migration 002)

`002_ppdb_identity.sql` menambahkan `ppdb.auth_user_id` yang berelasi ke `auth.users(id)` dengan `ON DELETE RESTRICT`. Record lama boleh memiliki `auth_user_id = NULL` dan dianggap sebagai legacy; record tersebut tidak dipetakan otomatis ke akun mana pun.

Submission baru hanya dapat dibuat oleh user authenticated, dengan `auth_user_id = auth.uid()`. User hanya dapat membaca submission miliknya sendiri, sedangkan admin tetap dapat membaca dan memperbarui seluruh submission melalui policy admin yang sudah ada.

Flow PPDB menggunakan satu PDF gabungan. Setelah migration `006`, object path baru disimpan pada `dokumen_url` dengan pola `submissions/<auth_user_id>/document.pdf`; berkas yang sudah terdaftar tidak boleh dihapus pemilik. Bucket tetap private dan dokumen hanya dibuka memakai signed URL. Jangan gunakan `getPublicUrl()` untuk dokumen PPDB.

Signup mengirim email konfirmasi melalui Supabase Auth dengan redirect ke `/ppdb/verifikasi`. Signup berhasil tidak selalu berarti email sudah diterima; periksa pengaturan email confirmation, URL Configuration, SMTP provider, spam, dan bounce di Supabase Dashboard.

Pada halaman verifikasi, email dapat dikirim ulang melalui Supabase Auth dengan cooldown 60 detik. Setelah login, portal memeriksa `auth_user_id` dan mengarahkan user tanpa submission ke formulir, atau ke `/ppdb/status` untuk menampilkan submission terbaru miliknya. Status `menunggu`, `diproses`, `diterima`, dan `ditolak` dibaca langsung dari `public.ppdb`.
