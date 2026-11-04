# ETL Supabase → MySQL

Tool ini **hanya membaca** Supabase (REST API read-only) dan menulis ke MySQL.
Tidak ada `UPDATE`/`DELETE` ke sumber. Storage publik yang direferensikan oleh
data (gambar berita/pengumuman/prestasi, logo sekolah) diunduh ke direktori
`uploads/` backend sehingga gambar tetap dapat diakses tanpa ketergantungan
operasional pada Supabase Storage.

## Prasyarat

- `SUPABASE_URL` dan `SUPABASE_ANON_KEY` (atau `SUPABASE_SERVICE_ROLE_KEY`)
  tersedia via environment atau `frontend/.env` (`VITE_SUPABASE_URL` /
  `VITE_SUPABASE_ANON_KEY`). Nilai `VITE_SUPABASE_*` hanya dipakai untuk ETL
  read-only; aplikasi operasional tidak membacanya.
- `DATABASE_URL` untuk MySQL target (sudah diatur di `backend/.env`).
- Backup MySQL sebelum menjalankan ETL pada database production.

## Menjalankan

```bash
cd backend
node scripts/etl/migrate.mjs --dry-run
node scripts/etl/migrate.mjs --batch=500
```

## Yang dimigrasikan

Tabel dengan data publik terbaca via REST: `site_settings`, `berita`,
`pengumuman`, `prestasi`, `bkk`, `events`, `spmb_information`. Tabel yang
kosong/RLS-blocked (`admins`, `ppdb`, `ppdb_drafts`, `ai_daily_attempts`,
`site_visitors`) tetap dicoba dan dicatat sebagai `source=0`. Tabel
`users`/`auth_tokens`/`sessions` tidak tersedia via REST anonim; lihat catatan
autentikasi di laporan migrasi.

## Idempotensi

Setiap record menggunakan upsert `ON DUPLICATE KEY UPDATE` pada primary key /
unique key. Menjalankan ulang tidak menggandakan data. Error per-record dicatat
di `docs/etl-errors-<timestamp>.jsonl`; ringkasan ditulis di
`docs/etl-summary-<timestamp>.json` beserta cek orphan FK.

## Catatan

- Password hash Supabase Auth tidak dapat diekspor via REST anonim. Akun admin
  harus dibuat ulang via `npm run db:seed` atau prosedur reset password. Lihat
  `docs/MYSQL_MIGRATION_REPORT.md`.
- File Supabase Storage **tidak dihapus**; sumber tetap utuh sebagai arsip.