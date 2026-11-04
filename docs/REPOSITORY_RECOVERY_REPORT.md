# Repository Recovery Report

Tanggal: 2026-11-04
Status: **Implemented; locally verified**

## Repository

- Root diverifikasi dengan `git rev-parse --show-toplevel`.
- Root aktif: `D:/Kiandra Gagah/Projek Gabut/smk_project`.
- Branch: `main`.
- Remote masih perlu distandarkan ke URL GitHub target sebelum push.

## Clone tambahan

Folder `smk-telkom-purwokerto/` diaudit dan perubahan relevan digabung selektif ke repository utama. File `.env` dan `node_modules` tidak dipindahkan.

Backup non-Git dibuat sebelum penghapusan di:

`C:\Users\MyBook Hype AMD\AppData\Local\Temp\smk-telkom-purwokerto-clone-backup-20261104`

Folder clone tambahan kemudian dihapus. Tidak ada file repository utama yang dihapus.

## File yang digabung

- `backend/prisma/migrations/20261103000000_init/migration.sql`
- `backend/src/app.js`
- `backend/src/db.js`
- `backend/src/routes/content.js`
- `backend/src/routes/ppdb.js`
- `backend/src/routes/spmb.js`
- `backend/src/routes/stats.js`
- `backend/src/routes/uploads.js`
- `backend/tests/api.test.js`
- `backend/tests/setup.js`
- `backend/scripts/check-db.mjs`
- `backend/scripts/smoke-db.mjs`
- `docs/BACKEND_LOCAL_SETUP.md`
- `docs/MYSQL_MIGRATION_PLAN.md`
- `docs/MYSQL_MIGRATION_AUDIT.md`
- `docs/MYSQL_MIGRATION_REPORT.md`

`auth_tokens` tidak diduplikasi ke initial migration karena sudah memiliki migration terpisah `20261103010000_auth_tokens`.
