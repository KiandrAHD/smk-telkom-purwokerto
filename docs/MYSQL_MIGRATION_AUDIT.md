# Audit Migrasi MySQL SMK Telkom Purwokerto

Tanggal audit: 2026-11-04

## Ringkasan

Backend Express + Prisma 7.10.1 sekarang berjalan pada MySQL lokal Laragon. Supabase tetap utuh; tidak ada tabel, data, storage, backup, atau Edge Function Supabase yang dihapus/diubah. Migrasi data belum dijalankan karena `SOURCE_DATABASE_URL` dan inventory storage Supabase belum tersedia.

## Temuan dan perbaikan

1. `backend/prisma/migrations/20261103000000_init/migration.sql` berukuran 0 byte. Dibuat ulang dari schema Prisma menggunakan `prisma migrate diff --from-empty --to-schema=prisma/schema.prisma --script`; hasil 9.6 KB berisi seluruh tabel, index, enum, dan FK.
2. Prisma config sudah valid untuk Prisma 7: `prisma.config.ts` memakai `defineConfig`, `env("DATABASE_URL")`, schema, dan migrations path. `prisma@7.10.1` dan `@prisma/client@7.10.1` tetap dipertahankan.
3. Prisma adapter menerima pool `mariadb` eksplisit agar koneksi MySQL stabil pada runtime dan test.
4. Route content memetakan input frontend snake_case ke field Prisma camelCase.
5. Route SPMB sebelumnya hanya memakai `requireAdmin`; sekarang memakai `requireAuth, requireAdmin`.
6. Route PPDB memetakan field snake_case ke model Prisma camelCase sebelum create.
7. Upload memvalidasi MIME type dan magic header PDF; frontend content upload memakai backend, bukan Supabase Storage.
8. Health check sekarang memverifikasi koneksi DB dan mengembalikan 503 jika DB down.
9. Statistik visitor menghapus query `groupBy` yang tidak digunakan.

## Inventaris fitur

- Public content: berita, pengumuman, prestasi, BKK.
- Admin: login/session, dashboard, CRUD content, PPDB review, event, SPMB, settings.
- PPDB: register, email token, session, draft, submit, status, document upload.
- AI: STELA fallback dan quota, NextTel scoring dan quota.
- Upload: `content-images` lokal/public dan `ppdb-documents` lokal/private.
- Analytics: visitor counter dan SPMB statistics.

## Prisma status

- `npx prisma -v`: pass, 7.10.1.
- `npx prisma validate`: pass.
- `npx prisma generate`: pass.
- `npx prisma migrate status`: database up to date.
- MySQL connection script: pass.
- CRUD + transaction + FK smoke test: pass.

## Security findings

- Argon2id password hashing: present.
- Session token stored hashed: present.
- HTTP-only/lax session cookie and CSRF double-submit: present.
- Helmet, CORS allowlist, rate limit, Zod validation: present.
- PPDB document owner/admin authorization: present.
- Production blockers: SMTP, AI provider, object storage, reverse proxy TLS, secret manager, and rate-limit strategy across multiple instances.
- Local password was supplied during setup and placed only in ignored `backend/.env`; rotate it before production and never reuse it.
- `npm audit` reports backend 2 moderate and frontend 10 vulnerabilities; review dependency advisories before deployment. No `npm audit fix --force` was run.

## Supabase mapping

See `docs/MYSQL_MIGRATION_PLAN.md`. Source data, auth, storage, RLS, and Edge Functions remain available as rollback/reference. ETL supports dry-run, batch processing, retry, upsert, count summary, and FK checks, but requires read-only Supabase credentials.

## Remaining blockers

- No Supabase read-only connection string or storage inventory.
- No verified auth password-hash compatibility.
- No SMTP/production storage/AI credentials.
- No VPS, DNS, TLS, or deployment authorization.
- No production backup/cutover approval.
