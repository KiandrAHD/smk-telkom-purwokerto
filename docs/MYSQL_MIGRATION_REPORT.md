# Laporan Implementasi Migrasi MySQL — SMK Telkom Purwokerto

Tanggal: 2026-11-04
Status akhir: **MySQL sebagai database operasional = SELESAI & TERUJI.**
Beberapa item tetap **BLOCKED** karena kredensial/sumber daya eksternal tidak
tersedia — dinyatakan apa adanya, bukan diklaim PASS.

---

## 1. Ringkasan Eksekutif

| Area | Status | Bukti |
|---|---|---|
| MySQL sebagai DB operasional | **PASS** | Backend hanya konek MySQL via Prisma |
| Skema & migrasi Prisma | **PASS** | 4 migrasi applied, `migrate status` up to date |
| ETL data nyata dari Supabase | **PASS (sebagian BLOCKED)** | 131/131 record, 26 file |
| Backup terenkripsi | **PASS** | dump + uploads + manifest + checksum |
| Restore teruji | **PASS** | restore ke DB disposable, jumlah baris cocok |
| Hapus dependensi operasional Supabase | **PASS** | 0 referensi runtime di backend |
| Test backend | **PASS** | 14/14 |
| Frontend lint | **PASS** | `eslint .` bersih |
| Frontend typecheck | **PASS** | `tsc --noEmit` bersih |
| Frontend build | **PASS** | `CI=true npm run build:ci`, 102 rute prerender |
| Upload backup ke Supabase | **BLOCKED** | `SUPABASE_SERVICE_ROLE_KEY` tidak tersedia |
| Migrasi `ai_daily_attempts` | **BLOCKED** | RLS menolak anon read (401/42501) |
| Pemulihan password admin | **PASS (prosedur)** | Seed admin recovery + reset token; hash sumber tidak dapat diekspor |
| NEXA/STELA AI live | **BLOCKED** | Tidak ada provider key; mengembalikan 503 jujur |
| Deployment VPS | **BLOCKED** | Tidak ada akses VPS/DNS/TLS |

---

## 2. Hasil ETL (data nyata)

Sumber: Supabase REST (read-only, anon key). Metode: `backend/scripts/etl/migrate.mjs`.

Ringkasan terakhir: `backend/docs/etl-summary-2026-11-04T14-58-05-376Z.json`.

| Tabel | Sumber | Diimpor | Target | Status |
|---|---|---|---|---|
| `site_settings` | 1 | 1 | 1 | PASS |
| `berita` | 13 | 13 | 13 | PASS |
| `pengumuman` | 11 | 11 | 11 | PASS |
| `prestasi` | 21 | 21 | 21 | PASS |
| `bkk` | 12 | 12 | 12 | PASS |
| `events` | 52 | 52 | 52 | PASS |
| `spmb_information` | 21 | 21 | 21 | PASS |
| `admins` | 0 | 0 | 0 | PASS |
| `ppdb` | 0 | 0 | 0 | PASS |
| `ppdb_drafts` | 0 | 0 | 0 | PASS |
| `site_visitors` | 0 | 0 | 1 | PASS (derived `day`) |
| `ai_daily_attempts` | — | 0 | n/a | **BLOCKED_RLS** |

**Total: 131 record diimpor, 0 gagal.** Storage: **26 file diunduh**, 0 gagal.
Integritas FK: `orphanPpdb: 0`, `orphanDraft: 0`.

ETL bersifat **idempotent** — eksekusi ulang keluar kode 0 tanpa duplikasi
(menggunakan upsert berdasarkan ID asli).

### 2.1 Keputusan skema saat ETL

1. **`events.kategori`** — sumber memiliki 11 nilai bebas di luar 5 nilai enum
   Prisma awal. Enum diperlebar menjadi 14 nilai (`EventCategory`), bukan memaksa
   rekode 50+ record asli. Migrasi: `20261104010000_events_category_enum`.
2. **`site_settings.revision`** — diubah dari `BigInt` ke `Int` karena
   `JSON.stringify(BigInt)` melempar `TypeError`. Migrasi:
   `20261104000000_site_settings_revision_int`.
3. **`site_visitors.day`** — kolom tidak ada di sumber; diturunkan dari
   `created_at` (UTC).

### 2.2 BLOCKED_RLS

`ai_daily_attempts` mengembalikan `401` dengan kode Postgres `42501`
(`permission denied for table`). Anon key tidak dapat membacanya. Diperlukan
`SUPABASE_SERVICE_ROLE_KEY` atau grant eksplisit. Item ini **tidak** diklaim PASS.

---

## 3. Backup & Restore (teruji)

Detail: `MYSQL_BACKUP_GUIDE.md`.

- `npm run db:backup -- --no-upload` → `status: created`.
- Objek: `mysql-backup-2026-11-04.sql.gz.enc` (27.712 byte) dan
  `uploads-backup-2026-11-04.tar.gz.enc` (2.213.059 byte).
- `npm run db:backup:verify` → checksum SHA-256 cocok.
- Restore ke `smk_telkom_purwokerto_restore_test` → **semua jumlah baris cocok**
  dengan manifest.
- Restore uploads → **26 file dipulihkan** = 26 file sumber.
- Database disposable di-drop setelah uji.

---

## 4. Perubahan Kode Utama

### Backend
- `src/routes/settings.js` — `requireAuth, requireAdmin` pada mutasi; `revision` Int.
- `src/routes/auth.js` — endpoint `POST /verify-email/resend`, `GET/PATCH /account`;
  perbaikan link reset/verifikasi; penghapusan log token di produksi.
- `src/routes/ai.js` — integrasi provider nyata (Gemini/OpenAI-compatible),
  503 jujur saat tidak dikonfigurasi, kuota tidak bocor saat ditolak.
- `src/routes/uploads.js` + `src/utils/storage.js` — validasi magic byte,
  key dokumen PPDB bersarang stabil, dokumen privat tidak disajikan statis.
- `scripts/backup.mjs`, `restore.mjs`, `backup-keygen.mjs`, `backup-verify.mjs`,
  `seed.mjs` — pipeline backup/restore/recovery.

### Frontend
- Hapus `@supabase/supabase-js` dan `src/services/contentImageService.js` (dead code).
- `src/services/stela.js`, `nexttel.js`, `apiClient.js` — panggilan AI CSRF-safe + abort.
- `src/pages/ppdb/AturSandiPage.jsx` — alur reset berbasis token.
- Pembersihan komentar/terjemahan privasi yang menyebut Supabase.

---

## 5. Keamanan

| Kontrol | Status |
|---|---|
| Argon2id hashing password admin | PASS |
| Password user PPDB di-hash bcrypt | PASS |
| Session token disimpan ter-hash | PASS |
| Cookie HttpOnly + SameSite=Lax | PASS |
| CSRF double-submit | PASS |
| Helmet + CORS allowlist + rate-limit + Zod | PASS |
| Otorisasi dokumen PPDB (owner/admin) | PASS |
| Secret tidak ada di frontend/git | PASS |
| Dokumen PPDB tidak di-serve statis | PASS |

Catatan: `npm audit` melaporkan 2 moderate (backend) dan 10 (frontend). Belum ada
`npm audit fix --force`. Tinjau sebelum production.

---

## 6. BLOCKED — tidak diklaim selesai

1. **Upload backup ke Supabase** — tidak ada `SUPABASE_SERVICE_ROLE_KEY` /
   akses bucket `mysql-backups`.
2. **`ai_daily_attempts` ETL** — RLS menolak anon read.
3. **Auth password hash Supabase** — tidak dapat diekspor lewat anon REST.
   Diganti prosedur aman: seed admin recovery (`ADMIN_RECOVERY_*`) + reset token.
4. **NEXA/STELA live** — tidak ada provider key.
5. **Deployment VPS** — tidak ada akses VPS/DNS/TLS/kredensial. Tidak ada klaim
   deployment sukses.

---

## 7. Kesimpulan

Aplikasi kini berjalan sepenuhnya di atas **MySQL 8.4** sebagai database
operasional. Supabase tidak lagi diakses saat runtime — hanya sebagai tujuan
backup terenkripsi. Seluruh data yang dapat diakses publik telah dimigrasikan
dengan jumlah yang terverifikasi (131 record + 26 file). Backup dan restore
terenkripsi sudah **teruji end-to-end**. Item yang terblokir oleh kredensial
eksternal didokumentasikan terbuka beserta jalur penyelesaiannya.
