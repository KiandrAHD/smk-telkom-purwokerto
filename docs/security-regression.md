# Security regression P0/P1

Jalankan dari `frontend`:

```powershell
npm.cmd run lint
npm.cmd run build
node scripts/uji-kredensial.mjs --build
npm.cmd run security:uji
npm.cmd run ppdb:uji
npm.cmd run performa:uji
deno check ../supabase/functions/stela/index.ts ../supabase/functions/nexttel/index.ts
```

Tes provider/handler memakai fetch tiruan dan fixture key; tidak menghubungi
Supabase produksi, layanan AI, atau akun pengguna. Pengujian kredensial memakai
fingerprint literal lama; nilai rahasia tidak dimasukkan kembali ke test source.

## Database integration

Siapkan PostgreSQL 16 lokal yang kosong dengan database `security_regression`,
akses administrator untuk membuat role/schema, dan `psql` di PATH. Runner
menolak host selain loopback dan nama database lain. Jangan gunakan database
Supabase lokal yang berisi pekerjaan pengguna; fixture ini membuat schema
pengganti auth/storage dan menerapkan seluruh migration 001–008.

```powershell
$env:SECURITY_DATABASE_URL='postgresql://postgres:<password-lokal>@127.0.0.1:5432/security_regression'
npm.cmd run database:uji
```

CI membuat service PostgreSQL 16 sementara dan menjalankan command ini. Test
memeriksa pilihan kanonik, 25 kunci/nilai rapor, metadata dokumen/pemilik,
RLS, update status admin dan record legacy, RPC yang hanya tersedia bagi server,
serta kuota satu dan finalisasi-versus-hapus dokumen dengan dua koneksi/transaksi
yang bersamaan. Schema auth/storage
fixture tidak menggantikan pengujian staging pada layanan Supabase Storage.

Alternatif untuk memeriksa SQL lokal tanpa instalasi server: install
`@electric-sql/pglite` di direktori tool terpisah, lalu set `PGLITE_MODULE` ke
absolute path `node_modules/@electric-sql/pglite/dist/index.js` dan jalankan
`npm.cmd run database:uji`. Mode ini memakai database memory dan extension
pgcrypto. PGlite hanya memiliki satu koneksi; hasilnya tidak membuktikan race
antarkoneksi. Hapus env `PGLITE_MODULE` sebelum menjalankan test native.

## Kontrak dan aktivasi

- Migration 007 menyediakan reservasi atomik `reserve_ai_attempt`. Unitnya
  attempt provider per fitur per hari UTC, termasuk kegagalan. Ini bukan
  perhitungan biaya/token yang presisi. Maksimum tiga attempt dan 12 detik
  total per request AI berlaku termasuk failover/reservasi. STELA memakai
  maksimal dua kandidat Gemini yang dikonfigurasi saat ini.
- `STELA_MAKS_PER_HARI` dan `NEXTTEL_MAKS_PER_HARI` default 500 di Edge.
  Runtime menyediakan `SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY`, khusus
  server. Jangan menambah awalan VITE_ atau memasukkan key server ke frontend.
  Tanpa RPC/config, tidak ada panggilan AI: STELA menolak, NextTel memakai
  fallback deterministik. Pembatas IP/cache dan kuota dev tetap lokal.
- Migration 008 mengunci kontrak `ppdbFormOptions.js` dan format
  `mata pelajaran|semester` dari `ppdbSubmission.js`. Kontrak sengaja disalin
  ke SQL; `uji-ppdb-contract.mjs` mendeteksi perubahan yang tidak sinkron.
  Perubahan pilihan/tahun di masa depan perlu migration baru dan pembaruan test.
- Dokumen harus memiliki metadata di bucket privat `ppdb-documents`, path
  `submissions/{auth_user_id}/document.pdf`, dan `owner_id` yang sama. Lookup
  read-only memakai row lock selama transaksi submission. Finalisasi dan
  cleanup pemilik berbagi advisory transaction lock; helper policy VOLATILE
  memeriksa ulang referensi setelah menunggu lock dengan snapshot baru,
  sesuai [PostgreSQL function volatility](https://www.postgresql.org/docs/16/xfunc-volatility.html).
  Cleanup pemilik menolak isolation level selain READ COMMITTED agar snapshot
  lama tidak dapat meloloskan penghapusan; jalur REST standar memakai READ COMMITTED.
  Perilaku `owner_id`
  mengikuti [Supabase Storage ownership](https://supabase.com/docs/guides/storage/security/ownership).
  Test tidak membuktikan keberadaan byte PDF di S3, dan tidak menonaktifkan
  wewenang admin untuk mengelola Storage. Record lama tidak ditulis ulang;
  update status admin tetap diperbolehkan tanpa memaksa validasi ulang legacy.
- Terapkan migration 007 lalu 008 di staging sebelum merilis Edge Functions.
  Verifikasi upload PDF melalui akun staging yang terautentikasi, submit,
  kelanjutan chat, dan status admin. Jangan menguji dengan akun produksi.
- LIVE ACCOUNT STATUS: NEEDS MANUAL VERIFICATION. Bila akun demo yang pernah
  terekspos masih aktif, ganti password dan cabut sesi di luar repository.
  Hapus deployment variable demo lama. Tidak ada login live atau perubahan
  database produksi yang dilakukan oleh perbaikan ini.
