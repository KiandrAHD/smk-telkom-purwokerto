# Rollback Guide

## Prinsip

Supabase tetap utuh sebagai sumber rollback sampai migrasi dan cutover disetujui. Tidak ada tabel, data, bucket, atau Edge Function Supabase yang dihapus selama migrasi.

## Rollback frontend ke backend lama

Jika backend MySQL baru bermasalah setelah cutover:

1. Set `VITE_API_BASE_URL` di Vercel kembali ke backend lama (atau Supabase Edge Function URL jika masih aktif).
2. Redeploy frontend di Vercel.
3. Frontend services sudah memakai `apiClient.js`; tidak ada perubahan UI/UX yang diperlukan.

## Rollback database

- MySQL target adalah staging/disposable sampai cutover disetujui.
- Sebelum cutover, backup MySQL target dibuat.
- Jika perlu rollback MySQL: restore dari backup. Jangan menjalankan `DROP`/`TRUNCATE` pada database sekolah.
- Schema migration dapat dibatalkan melalui backup restore pada disposable/staging.

## Rollback auth

- Password hash Supabase (bcrypt) tidak diasumsikan kompatibel. Verifikasi sebelum cutover.
- Jika auth bermasalah: kembalikan frontend ke login Supabase lama sampang hash diverifikasi dan di-migrate dengan aman.

## Rollback storage

- Supabase Storage tetap utuh.
- Jika storage backend baru bermasalah: kembalikan URL gambar ke Supabase Storage URL lama.
- Dokumen PPDB di Supabase Storage tetap tersedia.

## Rollback AI (STELA/NextTel)

- Edge Functions Supabase tetap aktif.
- Jika backend AI baru bermasalah: arahkan frontend kembali ke Edge Function Supabase.
- Backend AI baru saat ini hanya fallback; provider failover Edge Function belum sepenuhnya dipindahkan.

## Rollback deployment

- Vercel: revert ke deployment sebelumnya via Vercel dashboard.
- VPS: redeploy commit sebelumnya via PM2/systemd.

## Supabase preservation

Supabase tidak boleh dihapus sampai:

1. Import data selesai dan tervalidasi.
2. Storage inventory selesai dan file dipindahkan.
3. Auth cutover tervalidasi.
4. AI parity tercapai atau fallback disepakati.
5. Production berjalan stabil minimal 2 minggu.
