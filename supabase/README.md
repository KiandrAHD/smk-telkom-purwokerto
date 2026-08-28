# Supabase — SMK Telkom Purwokerto

Dokumen ini menjelaskan database foundation untuk platform Digital Smart School. Fase ini hanya menyiapkan database, Row Level Security (RLS), dan Storage; belum mengubah frontend atau memindahkan `dummyData.js`.

## Menjalankan migration

File migration utama adalah `supabase/migrations/001_initial_schema.sql`.

### Supabase CLI

Pastikan Supabase CLI sudah terpasang, lalu jalankan dari root repository:

```bash
supabase login
supabase link --project-ref <PROJECT_REF>
supabase db push
```

Jika project lokal sudah terhubung, `supabase db push` akan menjalankan migration yang belum diterapkan.

### SQL Editor

Alternatifnya, buka Supabase Dashboard → **SQL Editor**, buat query baru, salin seluruh isi `001_initial_schema.sql`, lalu jalankan sekali. Migration membuat tabel, index, trigger, policy RLS, dan bucket Storage.

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
- Pengunjung anonim dapat membuat row PPDB baru. Insert publik dipaksa berstatus `menunggu` dan tidak boleh mengisi `catatan_admin`.
- Pengunjung tidak dapat membaca, mengubah, atau menghapus data PPDB.
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
- Pengunjung hanya dapat upload ke path yang diawali `submissions/`.
- Pengunjung tidak dapat membaca, mengubah, atau menghapus file.
- Admin dapat membaca dan mengelola file.
- Simpan object path, misalnya `submissions/<id>/<nama-file>`, pada `ppdb.dokumen_url`. Saat admin perlu melihat file, buat signed URL dengan masa berlaku terbatas menggunakan Storage API.

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

## Catatan integrasi frontend berikutnya

Fase ini tidak mengganti sumber data publik dari `dummyData.js`. Pada fase integrasi, query publik harus memfilter status sesuai policy, form PPDB harus mengirim field yang sesuai schema, dan operasi admin harus menggunakan session Supabase Auth dari user yang terdaftar di `admins`.
