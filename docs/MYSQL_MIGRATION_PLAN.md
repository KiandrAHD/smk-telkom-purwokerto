# Rencana Migrasi Supabase ke MySQL

## Prinsip keselamatan

- Supabase tetap menjadi sumber aktif dan tidak disentuh secara destruktif.
- Import hanya membaca Supabase dan menulis ke staging/local MySQL setelah dry-run disetujui.
- Backup source dan target wajib dibuat operator sebelum cutover.
- `backend/.env` tidak boleh di-commit; credential production harus memakai secret manager.

## Fase

1. **Inventory**: tabel, auth users, storage buckets, Edge Functions, row counts, dan checksum.
2. **Schema**: validasi Prisma 7.10.1 dan migration MySQL lengkap.
3. **Dry-run**: `SOURCE_DATABASE_URL` read-only, `DATABASE_URL` target disposable, `--dry-run --batch=500`.
4. **Import staging**: batch, upsert idempotent, retry, FK/integrity validation, reconciliation report.
5. **Application verification**: CRUD, auth, PPDB ownership, upload private, AI quota, dan frontend smoke test.
6. **Cutover**: hanya dengan persetujuan pemilik, maintenance window, backup, DNS/backend switch, dan rollback.

## Pemetaan utama

| Supabase | MySQL | Catatan |
|---|---|---|
| `auth.users` | `users` | UUID dipertahankan; password hash perlu kompatibilitas auth provider |
| `public.admins` | `admins` | FK ke `users.id` |
| `public.berita` | `berita` | status enum, URL tetap string |
| `public.pengumuman` | `pengumuman` | `tanggal` timestamp |
| `public.prestasi` | `prestasi` | `instagram_url` dipertahankan |
| `public.bkk` | `bkk` | deadline dan status enum |
| `public.ppdb` | `ppdb` | `auth_user_id` menjadi FK `users.id` |
| `public.ppdb_drafts` | `ppdb_drafts` | JSONB → MySQL JSON |
| `public.events` | `events` | tanggal/time wall-clock dipertahankan |
| `public.spmb_information` | `spmb_information` | enum dan kuota |
| `public.site_settings` | `site_settings` | singleton `id=true` → `id=1` |
| `public.ai_daily_attempts` | `ai_daily_attempts` | composite PK |
| `public.site_visitors` | `site_visitors` | composite PK |
| `storage.objects` | filesystem/object storage | metadata dan object bytes harus diinventaris terpisah |

## Rollback

Sebelum cutover, rollback berarti mengarahkan frontend/API kembali ke backend lama atau Supabase. Jangan menghapus data target/source. Migration schema baru dibatalkan melalui backup restore pada disposable/staging; tidak menjalankan `DROP` atau `TRUNCATE` pada database sekolah.

## Blocker

- `SOURCE_DATABASE_URL` read-only Supabase belum tersedia.
- Inventory storage dan credential object belum tersedia.
- SMTP, AI provider, production object storage, VPS, dan DNS belum tersedia.
- Password hash Supabase harus diverifikasi sebelum auth cutover.
