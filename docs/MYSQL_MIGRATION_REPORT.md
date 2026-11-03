# Laporan Migrasi MySQL

Status: **belum dijalankan**.

Tidak ada data Supabase yang dihapus atau diubah. Laporan ini akan diisi oleh ETL setelah akses read-only Supabase, backup, staging, dan target MySQL dikonfigurasi.

## Required operator inputs

- `SOURCE_DATABASE_URL`: PostgreSQL read-only Supabase.
- `DATABASE_URL`: MySQL staging/production.
- Storage source credentials dan daftar bucket.
- Backup identifiers untuk source dan target.

## Gate sebelum import

- [ ] Backup Supabase selesai.
- [ ] Backup MySQL selesai.
- [ ] Bucket dan object inventory selesai.
- [ ] ETL diuji pada staging.
- [ ] Dry-run record counts cocok.
- [ ] Foreign key dan ownership validation lulus.

## Rekonsiliasi

| Entitas | Source | Imported | Failed | Validated |
|---|---:|---:|---:|---|
| admins | pending | pending | pending | pending |
| berita | pending | pending | pending | pending |
| pengumuman | pending | pending | pending | pending |
| prestasi | pending | pending | pending | pending |
| bkk | pending | pending | pending | pending |
| ppdb | pending | pending | pending | pending |
| ppdb_drafts | pending | pending | pending | pending |
| events | pending | pending | pending | pending |
| spmb_information | pending | pending | pending | pending |
| site_settings | pending | pending | pending | pending |

## Cutover

Belum boleh dilakukan. Supabase dipertahankan sebagai sumber rollback sampai pemilik sistem menyetujui hasil staging dan production reconciliation.
