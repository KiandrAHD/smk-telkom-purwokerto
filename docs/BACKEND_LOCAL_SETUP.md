# Setup Backend Lokal

## Prasyarat

- Node.js 22+
- MySQL 8.4/Laragon berjalan pada `127.0.0.1:3306`
- Database `smk_telkom_purwokerto`
- User aplikasi `smk_app`

## Konfigurasi

Salin `backend/.env.example` menjadi `backend/.env`, lalu isi password lokal. Jangan commit `.env`.

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=mysql://smk_app:PASSWORD@127.0.0.1:3306/smk_telkom_purwokerto
FRONTEND_URL=http://localhost:5173
SESSION_SECRET=minimum-32-character-random-secret
```

Password yang diberikan untuk sesi lokal sudah dipasang di `backend/.env` dan tetap di luar Git.

## Instalasi dan validasi

```powershell
cd backend
npm ci
npx prisma -v
npx prisma validate
npx prisma generate
npx prisma migrate status
npm test
npm run dev
```

Health check:

```text
GET http://localhost:3000/health
```

Response sukses memuat `ok: true` dan `database: "up"`. Endpoint tidak mencetak credential.

## Smoke test database

```powershell
node scripts/check-db.mjs
node scripts/smoke-db.mjs
```

`smoke-db.mjs` hanya memakai record bertanda `smoke-*` dan membersihkannya sendiri. Jangan menjalankan test destruktif pada database yang berisi data sekolah tanpa backup dan persetujuan.

## Frontend

```powershell
cd frontend
npm ci
npm run lint
$env:CI="true"
npm run build:ci
```

Build offline CI menghasilkan konten publik kosong untuk prerender; jangan deploy artefak tersebut sebagai production content.

## ETL Supabase

```powershell
cd backend
$env:SOURCE_DATABASE_URL="postgresql://READ_ONLY_USER:..."
node scripts/etl/migrate.mjs --dry-run --batch=500 --retry=3
```

Jangan menjalankan import tanpa backup, target staging/disposable, akses read-only source, dan persetujuan eksplisit.
