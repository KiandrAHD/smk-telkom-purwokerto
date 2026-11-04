# Restore Database

## Prinsip

- Restore **tidak otomatis** menimpa production.
- Wajib menggunakan `--apply`.
- Restore ke production juga wajib `--allow-production` dan `--confirm`.
- Database tujuan test harus kosong (baru) kecuali `--allow-existing`.

## Restore dari file lokal

```powershell
npm run db:restore -- backups/mysql/2026/11/mysql-backup-2026-11-04.sql.gz.enc --db=smk_restore_test --apply
```

## Restore dari Supabase Storage

```powershell
npm run db:restore -- --remote-date=2026-11-04 --target=mysql --db=smk_restore_test --apply
```

Script mengunduh manifest, memverifikasi checksum setiap objek remote, mendekripsi, dan menjalankan SQL.

## Restore uploads

```powershell
npm run db:restore -- backups/uploads/uploads-backup-2026-11-04.tar.gz.enc uploads --uploads-root=./restore-uploads --apply
```

## Validasi setelah restore

Script memvalidasi:

1. Header `SMKBACK1`.
2. AES-256-GCM auth tag.
3. Format SQL (`CREATE TABLE`/`INSERT INTO`).
4. Jumlah baris per tabel dibandingkan manifest.

Jangan menyatakan restore berhasil hanya karena `mysql` exit code 0.

## Proteksi

- Key salah → GCM auth tag gagal → error.
- File rusak/tidak lengkap → panjang buffer < 36 → error.
- Checksum mismatch → error.
- Manifest hilang → error.
- Database tujuan sudah berisi tabel → error tanpa `--allow-existing`.
- Archive mengandung path traversal → error sebelum ekstraksi.
