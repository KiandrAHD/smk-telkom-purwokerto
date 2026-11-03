# Audit Migrasi MySQL SMK Telkom Purwokerto

Tanggal audit: 2026-11-03

## Status

Migrasi **belum selesai**. Supabase tetap menjadi backend aktif dan tidak disentuh secara destruktif. Backend Express/Prisma di `backend/` masih berupa scaffold tanpa schema, server, route, atau test. Kredensial lokal berada di `backend/.env`; file tersebut tidak boleh di-commit.

## Inventaris fitur

- Website publik: profil sekolah, guru, jurusan, fasilitas, berita, pengumuman, prestasi, BKK, kalender, galeri, ekstrakurikuler.
- Admin: login, dashboard, CRUD berita, pengumuman, prestasi, BKK, jurusan/data terkait, kalender, SPMB, pengaturan website.
- PPDB/SPMB: registrasi, verifikasi email, login peserta, formulir, draft, upload dokumen, submit, status, review admin, catatan admin.
- AI: STELA dan NextTel melalui Supabase Edge Functions, termasuk quota, fallback, scoring, dan guard.
- Storage: `content-images` (public) dan `ppdb-documents` (private).
- Analytics: visitor counter dan statistik SPMB.

## Sumber data dan aturan keamanan

Supabase memiliki 15 migration PostgreSQL yang mencakup `admins`, `berita`, `pengumuman`, `prestasi`, `bkk`, `ppdb`, `ppdb_drafts`, `events`, `spmb_information`, `site_settings`, visitor/quota tables, RLS, triggers, RPC, dan Storage policies. RLS adalah boundary keamanan aktif. Tidak ada operasi DROP, TRUNCATE, delete, atau perubahan terhadap Supabase yang dilakukan oleh migrasi lokal ini.

Risiko yang wajib ditangani:

1. `backend/.env` berisi password MySQL dan `SESSION_SECRET`; jangan commit dan rotasi jika pernah terekspos.
2. Upload PPDB harus private, owner/admin scoped, dan divalidasi server-side termasuk magic header PDF.
3. Auth, role, status, quota, dan ownership tidak boleh dipercaya dari frontend.
4. Data migration hanya boleh read-only dari Supabase, batch, idempotent, retryable, dan menghasilkan reconciliation report.
5. Backup Supabase, backup MySQL, serta staging test membutuhkan tindakan operator dan kredensial yang belum tersedia.

## Rencana implementasi

1. Bangun schema Prisma MySQL dengan UUID string, `utf8mb4`, foreign key, index, timestamps, dan soft-delete untuk entitas konten.
2. Bangun Express API modular dengan Zod, Argon2id, HTTP-only session cookie, CSRF/origin protection, Helmet, CORS allowlist, rate limit, logging, dan centralized errors.
3. Tambahkan storage abstraction local/private object storage.
4. Tambahkan ETL read-only untuk PostgreSQL/Supabase dan manifest reconciliation.
5. Ganti service frontend secara bertahap melalui API client terpusat setelah kontrak API dan auth siap; UI/routing dipertahankan.
6. Port STELA/NextTel ke route backend tanpa memindahkan API key ke frontend.
7. Tambahkan integration/security tests dan deployment docs untuk Vercel + VPS.
8. Cutover hanya setelah staging, rekonsiliasi, backup, smoke test, dan rollback plan disetujui.

## Blocker manual

- Kredensial read-only Supabase dan daftar bucket/file belum tersedia.
- SMTP/email verification provider belum dikonfigurasi untuk auth baru.
- Provider AI secrets dan production storage belum tersedia.
- Tidak boleh mengklaim data telah termigrasi sebelum ETL dijalankan dan laporan jumlah/integritas diverifikasi.

## Audit paralel

Audit repository, backend, frontend, security, dan QA dilakukan. Temuan utama: backend kosong, frontend masih memakai Supabase langsung, build lokal sebelumnya gagal karena dependency installation tidak lengkap, dan test backend masih placeholder. Supabase migrations dan data tetap dipertahankan.
