# Bug Report — LIVE Functional QA

Tanggal: 29 Agustus 2026

## BUG-001 — Tabel Supabase tidak tersedia pada project aktif

- Severity: Critical
- Status: Open
- Area: Supabase Database / Public Content / Admin Dashboard / PPDB

### Gejala

Endpoint REST Supabase dapat dijangkau, tetapi query ke tabel aplikasi mengembalikan error PostgREST:

```text
PGRST205: Could not find the table 'public.berita' in the schema cache
```

Pemeriksaan read-only yang sama terhadap tabel berikut juga gagal dengan HTTP 404:

- `public.berita`
- `public.pengumuman`
- `public.prestasi`
- `public.bkk`
- `public.ppdb`

### Dampak

- Halaman public dinamis tidak dapat membaca data Supabase.
- Dashboard analytics tidak dapat menampilkan statistik database.
- CRUD admin tidak dapat membaca atau menyimpan data.
- Alur PPDB dan verifikasi data admin tidak dapat diuji end-to-end.
- RLS dan Storage belum dapat divalidasi terhadap data sebenarnya.

### Langkah reproduksi

1. Isi `frontend/.env` dengan URL project dan publishable key.
2. Kirim request GET read-only ke:
   `https://<project-ref>.supabase.co/rest/v1/berita?select=id&limit=1`.
3. Hasil yang diterima: HTTP 404 dengan kode `PGRST205`.

### Kemungkinan penyebab

1. `supabase/migrations/001_initial_schema.sql` belum dijalankan pada project Supabase aktif.
2. URL project pada `frontend/.env` menunjuk ke project yang berbeda dari project tempat migration dijalankan.
3. Schema cache Supabase belum memuat perubahan schema setelah migration.

### Rekomendasi

1. Verifikasi project reference pada Supabase Dashboard sama dengan project yang digunakan frontend.
2. Periksa keberadaan tabel pada **Table Editor** atau SQL Editor.
3. Jalankan migration existing `001_initial_schema.sql` pada project yang benar jika memang belum diterapkan.
4. Refresh schema cache/API setelah migration selesai.
5. Ulangi seluruh LIVE QA tanpa mengubah RLS agar hasil tetap merepresentasikan konfigurasi production.

### Perubahan yang dilakukan

Tidak ada perubahan database, migration, RLS, atau konfigurasi security. Bug ini hanya dicatat untuk ditindaklanjuti.

## Catatan QA

Lint dan build frontend berhasil. Pengujian CRUD, Auth, RLS, Storage, dan konsistensi public-admin tidak dapat dinyatakan PASS sebelum tabel tersedia pada project Supabase aktif.

## Status mitigasi identity PPDB

Bug akun/email yang tertukar telah **MITIGATED, LIVE TEST PENDING**. UI production tidak lagi memakai akun contoh, portal membaca email dari session Supabase Auth, submission memakai `auth_user_id`, dan status user difilter berdasarkan owner tersebut. Verifikasi User A/User B, refresh, multi-tab, email delivery, dan RLS tetap harus diuji setelah migration `002_ppdb_identity.sql` diterapkan pada project Supabase aktif.
