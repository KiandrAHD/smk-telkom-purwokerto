# ETL Supabase → MySQL

Tool ini **hanya membaca** Supabase (`SELECT` read-only) dan menulis ke MySQL. Tidak ada `UPDATE`/`DELETE` ke sumber.

## Prasyarat

- `SOURCE_DATABASE_URL` untuk PostgreSQL read-only (Supabase pooler/read replica).
- `DATABASE_URL` untuk MySQL target.
- `SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY` hanya untuk Storage (server-side, jangan pernah di frontend).
- Backup Supabase dan MySQL sebelum menjalankan.
- Table order: `admins`, `berita`, `pengumuman`, `prestasi`, `bkk`, `ppdb`, `ppdb_drafts`, `events`, `spmb_information`, `site_settings`, `ai_daily_attempts`, `site_visitors`.

## Menjalankan

```bash
node scripts/etl/migrate.mjs --dry-run
node scripts/etl/migrate.mjs --batch=500 --retry=3
```

Konversi PostgreSQL → MySQL:

- `uuid` → `CHAR(36)` (ID dipertahankan).
- `timestamptz` → UTC `DATETIME(3)` (disimpan sebagai UTC).
- `date` → `DATE`; `time` → `VARCHAR(8)`.
- `jsonb` → `JSON` (stringify kanonik).
- boolean → `TINYINT(1)`.
- `NULL` dipertahankan.

## Idempotensi

Setiap batch menggunakan upsert `ON DUPLICATE KEY UPDATE`. Raw insert error dicatat per record di `docs/etl-errors-<timestamp>.jsonl` dan di-retry maksimal 3 kali. Verifikasi akhir membandingkan `COUNT(*)` source vs target, mengecek orphan FK, dan menulis `docs/etl-summary-<timestamp>.json`.

## Status

Belum dijalankan karena kredensial read-only Supabase tidak tersedia. Jangan mengganti laporan dengan data fiktif.
