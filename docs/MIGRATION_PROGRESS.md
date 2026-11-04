# Progres Migrasi MySQL — SMK Telkom Purwokerto

Dokumen kerja internal. Diperbarui setiap fase selesai.
Terakhir diperbarui: 2026-11-04 (fase migrasi selesai).

## Status Ringkas

| Fase | Status |
|---|---|
| PHASE 0 — Audit Repository | DONE |
| PHASE 1 — MySQL Primary Architecture | DONE |
| PHASE 2 — Schema & Migration | DONE (4 migrasi applied) |
| PHASE 3 — Supabase ETL | DONE sebagian (131/131 record; `ai_daily_attempts` BLOCKED_RLS) |
| PHASE 4 — File & Storage Migration | DONE (26 file) |
| PHASE 5 — Backend/Frontend Refactor (hapus Supabase) | DONE (0 referensi runtime) |
| PHASE 6 — Backup & Restore | DONE (teruji end-to-end) |
| PHASE 7 — Laragon Local | DONE (MySQL 8.4.3) |
| PHASE 8 — VPS Prep | DOCUMENTED (deployment BLOCKED — tanpa akses) |
| PHASE 9 — Documentation | DONE (7 dokumen) |
| PHASE 10 — Testing & Report | DONE (14/14 test, lint, typecheck, build) |

## Temuan Audit Awal

- Backend sudah Express + Prisma 7.10.1 + MySQL 8.4.3 (Laragon), DB `smk_telkom_purwokerto`, 16 tabel.
- Frontend memakai `apiClient.js` ke backend untuk auth, CRUD, PPDB, settings, stats, AI, upload.
- Referensi Supabase yang dihapus: `frontend/src/services/contentImageService.js` (dead code) dan dependensi `@supabase/supabase-js`.
- Koneksi langsung PostgreSQL Supabase (`db.*.supabase.co`) **tidak resolve** (`ENOTFOUND`) → ETL via REST anon key.
- `ai_daily_attempts` RLS-blocked (401/42501) → BLOCKED, bukan PASS.
- Tidak ada `SUPABASE_SERVICE_ROLE_KEY` → auth users & tabel RLS-protected tidak dapat diekspor.

## Bukti Kunci

- ETL summary: `backend/docs/etl-summary-2026-11-04T14-58-05-376Z.json` — 131 record, 0 gagal, 26 file.
- Backup manifest: `backend/backups/manifests/backup-2026-11-04.json`.
- Restore uji: DB `smk_telkom_purwokerto_restore_test` cocok dengan manifest, lalu di-drop.
- Test: `backend/tests/api.test.js` + `security.test.js` → 14/14.
- Frontend: `CI=true npm run build:ci` → 102 rute prerender.

## Blocker Tersisa

1. Upload backup ke Supabase (butuh service role key + bucket).
2. ETL `ai_daily_attempts` (RLS).
3. Hash password auth Supabase → prosedur recovery admin.
4. NEXA/STELA live (butuh provider key).
5. Deployment VPS (tanpa akses).

Lihat `MYSQL_MIGRATION_REPORT.md` untuk detail dan bukti.

## Perubahan Belum Di-commit

Seluruh perubahan migrasi masih di working tree (belum commit/push). Jalankan
`git status` untuk daftar lengkap.
