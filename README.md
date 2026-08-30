# README — Bahasa Indonesia

## SMK Telkom Purwokerto — Digital Smart School Platform

Platform digital sekolah yang mencakup website publik, dashboard administrator, PPDB online, pengelolaan konten, Supabase backend, authentication, storage, STELA AI, dan NextTel AI. Project dikembangkan secara kolaboratif untuk kebutuhan project sekolah/lomba.

## Fitur dan Route

### Website publik

| Route | Keterangan |
|---|---|
| `/` | Homepage sekolah |
| `/profil-sekolah` | Profil, visi-misi, fasilitas, dan informasi sekolah |
| `/tentang` | Redirect ke `/profil-sekolah` |
| `/jurusan` | Program keahlian dan detail jurusan |
| `/prestasi` | Prestasi, galeri, dan detail prestasi |
| `/bkk` | Bursa Kerja Khusus dan informasi karier |
| `/berita` | Daftar dan detail berita |
| `/pengumuman` | Daftar dan detail pengumuman |
| `/stela` | Halaman chatbot STELA |
| `/nexttel` | Kuesioner rekomendasi jurusan |
| `/galeri` | Galeri foto |

Detail dinamis menggunakan route berbasis slug, misalnya `/jurusan/:slug`, `/prestasi/:slug`, `/berita/:slug`, dan `/pengumuman/:slug`.

Sebagian konten publik masih bersumber dari `frontend/src/data/dummyData.js`. Berita, Pengumuman, Prestasi, dan BKK memiliki service Supabase, tetapi tidak semua section publik membaca database secara dinamis.

### Admin dashboard

| Route | Keterangan | Sumber data |
|---|---|---|
| `/login` | Login administrator | Supabase Auth |
| `/dashboard` | Statistik dan ringkasan | Supabase service |
| `/dashboard/jurusan` | Tambah, edit, dan hapus jurusan | `AdminDataContext` in-memory |
| `/dashboard/berita` | CRUD berita | Supabase |
| `/dashboard/pengumuman` | CRUD pengumuman | Supabase |
| `/dashboard/prestasi` | CRUD prestasi | Supabase |
| `/dashboard/bkk` | CRUD lowongan BKK | Supabase |
| `/dashboard/ppdb` | Review pendaftar dan update status | Supabase |
| `/dashboard/pengaturan` | Pengaturan dashboard | `AdminDataContext` |

Admin routes dilindungi `ProtectedRoute`. User admin harus terautentikasi melalui Supabase Auth dan memiliki relasi pada `public.admins`.

### Demo Admin Login

Email: `admin1234@admin.id`

Password: `1234`

> **Peringatan:** Credential di atas hanya untuk kebutuhan demo/testing. Jangan gunakan password tersebut untuk production. Segera ganti password akun admin production dengan password yang kuat dan unik.

Credential hanya digunakan sebagai prefill UX. Password tidak disimpan di tabel `admins`.

## Tech Stack

### Frontend

- React 19
- Vite 8
- Tailwind CSS 4
- React Router 7
- `lucide-react`
- `react-icons`
- `@supabase/supabase-js`
- CSS transition dan `IntersectionObserver`

Project tidak menggunakan Axios atau Framer Motion. Request HTTP menggunakan `fetch` bawaan.

### Backend dan platform

- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage
- Supabase Edge Functions berbasis Deno
- Row Level Security (RLS)

### AI dan deployment

- STELA mendukung Anthropic, Google Gemini, dan Groq melalui Edge Function.
- NextTel menggunakan scoring frontend dan Edge Function Anthropic untuk penjelasan hasil.
- Frontend dapat dideploy ke Vercel; database, Auth, Storage, dan Edge Functions berada di Supabase.

## Arsitektur

```text
Browser
   ↓
React / Vite
   ├── React Router
   ├── Public pages
   └── Protected admin pages
          ↓
   Supabase client / fetch
          ↓
Supabase
   ├── Authentication
   ├── PostgreSQL + RLS
   ├── Storage
   └── Edge Functions
          ├── STELA
          └── NextTel
```

Browser merender UI. React/Vite menyediakan komponen, halaman, state, dan build. Supabase client mengakses Auth, database, dan Storage menggunakan key publik yang tunduk pada RLS. Edge Functions menjadi perantara server-side untuk provider AI agar API key tidak masuk ke browser.

## Struktur Folder

```text
smk-telkom-purwokerto/
├── frontend/
│   ├── public/
│   ├── scripts/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── page/Login/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   └── ppdb/
│   │   ├── router/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   └── vite-plugin-stela.js
├── supabase/
│   ├── functions/
│   │   ├── nexttel/
│   │   └── stela/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_ppdb_identity.sql
│   │   └── 003_ppdb_storage_owner_and_unique.sql
│   ├── README.md
│   └── .temp/                 # State lokal CLI; jangan di-commit
├── README.md
├── ai.md
└── bug.md
```

## PPDB Online

Flow PPDB:

```text
Register → Email Verification → Login → Formulir → Upload Dokumen → Submit → Status Pendaftaran
```

Route yang tersedia:

```text
/ppdb/daftar
/ppdb/masuk
/ppdb/verifikasi
/ppdb/formulir
/ppdb/berkas
/ppdb/selesai
/ppdb/status
/ppdb/dokumen-peserta
```

`/ppdb` mengarahkan pengguna ke `/ppdb/masuk`. Status submission adalah `menunggu`, `diproses`, `diterima`, dan `ditolak`.

`public.ppdb.auth_user_id` mereferensikan `auth.users.id`. Submission baru harus memiliki `auth_user_id` yang sama dengan `auth.uid()`. User hanya dapat membaca submission miliknya melalui RLS, dan unique partial index membatasi satu submission per akun.

Email confirmation Supabase diarahkan ke `/ppdb/verifikasi`. Bucket `ppdb-documents` bersifat private. Path dokumen menggunakan `submissions/<auth_user_id>/<ppdb_id>/<filename>` dan dibuka menggunakan signed URL terbatas waktu, bukan public URL. Admin dapat membaca dan memperbarui data PPDB sesuai policy.

## Supabase

Migration diterapkan berurutan:

1. `001_initial_schema.sql` membuat tabel `admins`, `berita`, `pengumuman`, `prestasi`, `bkk`, `ppdb`, index, trigger `updated_at`, fungsi `is_admin()`, RLS, dan dua bucket Storage.
2. `002_ppdb_identity.sql` menambahkan `auth_user_id`, foreign key ke `auth.users`, ownership RLS PPDB, serta pembatas upload dokumen per user.
3. `003_ppdb_storage_owner_and_unique.sql` menambahkan policy pembacaan object milik user dan unique index satu submission per akun.

`AuthContext` membaca session Supabase dan memeriksa user pada `public.admins`. `ProtectedRoute` mengarahkan user tanpa akses admin ke `/login`. Anon/publishable key boleh berada di frontend karena akses database tetap dibatasi RLS; service-role key tidak boleh berada di frontend.

## STELA AI

STELA adalah asisten virtual sekolah untuk pertanyaan tentang profil, jurusan, fasilitas, kegiatan, prestasi, BKK, PPDB, berita, pengumuman, dan kontak.

- Production endpoint: `${VITE_SUPABASE_URL}/functions/v1/stela`.
- Local endpoint: `/api/stela` dari `frontend/vite-plugin-stela.js`.
- Provider: Anthropic, Google Gemini, dan Groq.
- Prioritas provider: Anthropic, Gemini, lalu Groq.
- Model default dan fallback didefinisikan di `supabase/functions/stela/inti.mjs`.
- Context dinamis mengambil Berita published, Pengumuman published, Prestasi, dan BKK aktif.
- Context dinamis di-cache selama 60 detik.
- STELA tidak membaca PPDB, `admins`, draft, atau bucket private.
- Tersedia validasi input, origin restriction, rate limit, daily limit, IP limit, answer cache, output-token limit, dan emergency switch.
- Guard tersebut berjalan di memori Edge Function; billing limit provider tetap harus diatur di dashboard provider.
- API key production disimpan sebagai Supabase Edge Function Secret.

Snapshot pengetahuan statis dibuat dari `dummyData.js`:

```bash
cd frontend
npm run stela:konten
```

Setelah snapshot berubah, deploy ulang function STELA.

## NextTel AI

NextTel menggunakan kuesioner delapan pertanyaan. Scoring dilakukan di frontend untuk `RPL`, `PG`, `TKJ`, dan `TJAT`. Hasil dikirim ke `${VITE_SUPABASE_URL}/functions/v1/nexttel` untuk mendapatkan penjelasan.

Edge Function NextTel menggunakan Anthropic server-side, memvalidasi pertanyaan, pilihan, score, dan rekomendasi, menerapkan origin restriction serta rate limit, dan mengembalikan `explanation`, `strengths`, serta `learningSuggestions`. API key disimpan pada `NEXTTEL_ANTHROPIC_API_KEY`.

## Environment Variables

### Frontend dan local mode

| Variable | Digunakan oleh | Wajib | Secret? |
|---|---|---:|---:|
| `VITE_SUPABASE_URL` | Supabase client, Auth, database, Storage, STELA, NextTel | Fitur Supabase | Tidak |
| `VITE_SUPABASE_ANON_KEY` | Supabase client dan Authorization header | Fitur Supabase | Tidak |
| `VITE_ADMIN_BYPASS` | Preview admin saat development | Opsional | Tidak |
| `ANTHROPIC_API_KEY` | STELA local | Opsional | Ya |
| `GEMINI_API_KEY` | STELA local | Opsional | Ya |
| `GROQ_API_KEY` | STELA local | Opsional | Ya |
| `STELA_MODEL` | Model STELA local | Opsional | Tidak |
| `STELA_AKTIF` | Sakelar STELA | Opsional | Tidak |
| `STELA_MAKS_PER_HARI` | Batas harian STELA | Opsional | Tidak |
| `STELA_MAKS_PER_IP` | Batas per-IP STELA | Opsional | Tidak |

### Supabase Edge Function secrets

| Variable | Digunakan oleh | Secret? |
|---|---|---:|
| `ANTHROPIC_API_KEY` | STELA Anthropic | Ya |
| `GEMINI_API_KEY` | STELA Gemini | Ya |
| `GROQ_API_KEY` | STELA Groq | Ya |
| `STELA_MODEL` | Model STELA | Tidak |
| `STELA_AKTIF` | Emergency switch STELA | Tidak |
| `STELA_MAKS_PER_HARI` | Batas harian STELA | Tidak |
| `STELA_MAKS_PER_IP` | Batas IP STELA | Tidak |
| `STELA_ALLOWED_ORIGINS` | Origin STELA | Tidak |
| `SUPABASE_URL` | Context publik STELA | Tidak |
| `SUPABASE_ANON_KEY` | REST context STELA | Tidak |
| `NEXTTEL_ANTHROPIC_API_KEY` | Provider NextTel | Ya |
| `NEXTTEL_MODEL` | Model NextTel | Tidak |
| `NEXTTEL_ALLOWED_ORIGINS` | Origin NextTel | Tidak |

Jangan commit `.env`, jangan menaruh service-role key di frontend, dan jangan menaruh API key AI pada variable `VITE_*`. Secret production harus disimpan menggunakan Supabase Secrets.

## Instalasi dan Development

Prasyarat: Node.js `^20.19.0` atau `>=22.12.0` dan npm.

```bash
git clone https://github.com/KiandrAHD/smk-telkom-purwokerto.git
cd smk-telkom-purwokerto/frontend
npm install
```

Buat `frontend/.env` berdasarkan `frontend/.env.example`:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Jalankan aplikasi:

```bash
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173). Untuk fitur Supabase, Auth, PPDB, dashboard, STELA production, dan NextTel diperlukan project Supabase yang telah dikonfigurasi.

## Supabase CLI

Jalankan dari root repository:

```bash
npx supabase --version
npx supabase login
npx supabase link --project-ref <PROJECT_REF>
npx supabase db push
npx supabase functions deploy stela
npx supabase functions deploy nexttel
```

Buat admin melalui Supabase Dashboard → Authentication → Users, lalu hubungkan UUID user ke `public.admins` melalui SQL Editor. Password tetap dikelola Supabase Auth.

## Build dan Deployment

Jalankan dari `frontend/`:

```bash
npm run lint
npm run build
npm run preview
```

`lint` menjalankan ESLint, `build` menghasilkan `frontend/dist/`, dan `preview` menyajikan hasil build lokal.

Konfigurasi Vercel:

```text
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```

```text
Vercel   → React/Vite frontend
Supabase → PostgreSQL, Auth, Storage, Edge Functions
```

URL yang dirujuk oleh data aplikasi adalah `https://smk-telkom-purwokerto.vercel.app`. Repository tidak memiliki konfigurasi Vercel formal, sehingga deployment production tidak diklaim terverifikasi dari source. Supabase Authentication → URL Configuration harus memakai domain production aktual dan redirect PPDB harus sesuai `/ppdb/verifikasi`.

## Security

- Gunakan Supabase Auth untuk admin dan akun PPDB.
- Pertahankan RLS untuk akses publik, user authenticated, admin, dan ownership.
- Anon/publishable key boleh di frontend; service-role key hanya server-side.
- API key AI hanya pada Edge Function Secrets.
- Bucket dokumen PPDB private dan hanya diakses dengan signed URL.
- Pertahankan `auth_user_id = auth.uid()`.
- Jangan commit `.env` atau secret.
- Credential demo bukan credential production.
- Rate limit/cost guard membantu mengurangi penyalahgunaan, tetapi billing limit provider juga harus diatur.

## Testing Checklist

- Public: homepage, navigasi, profil, jurusan, prestasi, BKK, berita, pengumuman, STELA, dan NextTel.
- Admin: login, protected route, dashboard, CRUD Berita, Pengumuman, Prestasi, BKK, PPDB, serta Jurusan.
- PPDB: signup, verifikasi email, login, formulir, upload PDF, submit, status, duplicate protection, dan signed URL.
- AI: validasi/rate limit/fallback STELA serta questionnaire, scoring, dan penjelasan NextTel.
- Tidak ditemukan test runner khusus di `frontend/package.json`; validasi utama menggunakan `npm run lint` dan `npm run build`.

## Status Project

| Feature | Status |
|---|---|
| Public Website | Tersedia; sebagian konten masih statis |
| Admin Login | Tersedia melalui Supabase Auth |
| Admin Dashboard | Tersedia pada route protected |
| CRUD Berita | Tersedia melalui Supabase |
| CRUD Pengumuman | Tersedia melalui Supabase |
| CRUD Prestasi | Tersedia melalui Supabase |
| CRUD BKK | Tersedia melalui Supabase pada route admin aktif |
| Admin PPDB | Tersedia melalui Supabase |
| Manajemen Jurusan | Tersedia melalui `AdminDataContext` in-memory |
| PPDB Online | Tersedia dengan Auth, verifikasi, formulir, upload, submit, dan status |
| STELA | Tersedia; memerlukan provider/API key |
| NextTel | Tersedia; memerlukan Edge Function dan secret Anthropic |
| Supabase | Migration, Auth, RLS, Storage, dan Edge Functions tersedia di repository |
| Deployment | Prosedur Vercel tersedia; deployment aktual tidak diverifikasi |
| Automated Test Suite | Tidak ditemukan test runner khusus |

## Catatan

- Terapkan migration `001`, `002`, lalu `003` secara berurutan.
- Jurusan dan beberapa halaman dashboard lama masih menggunakan state context dan tidak dijamin bertahan setelah refresh.
- Tidak semua data publik membaca Supabase.
- `supabase/.temp/` adalah state lokal CLI dan tidak boleh di-commit.
- Untuk troubleshooting Supabase, periksa response `{ data, error }` dan policy/RLS project aktif.
- Catatan AI tersedia di [`ai.md`](./ai.md), sedangkan catatan bug tersedia di [`bug.md`](./bug.md).

---

# README — English Version

## SMK Telkom Purwokerto — Digital Smart School Platform

This platform is a school digital application consisting of a public website, administrator dashboard, online PPDB, content management, Supabase backend, authentication, storage, STELA AI, and NextTel AI. The project is developed collaboratively for a school/project competition context.

## Features and Routes

### Public website

| Route | Description |
|---|---|
| `/` | School homepage |
| `/profil-sekolah` | School profile, vision, facilities, and information |
| `/tentang` | Redirects to `/profil-sekolah` |
| `/jurusan` | Study programs and major details |
| `/prestasi` | Achievements, gallery, and achievement details |
| `/bkk` | Special Job Exchange and career information |
| `/berita` | News list and details |
| `/pengumuman` | Announcement list and details |
| `/stela` | STELA chatbot page |
| `/nexttel` | Major recommendation questionnaire |
| `/galeri` | Photo gallery |

Dynamic detail routes include `/jurusan/:slug`, `/prestasi/:slug`, `/berita/:slug`, and `/pengumuman/:slug`.

Some public content still comes from `frontend/src/data/dummyData.js`. News, announcements, achievements, and BKK have Supabase services, but not every public section reads dynamically from the database.

### Admin dashboard

| Route | Description | Data source |
|---|---|---|
| `/login` | Administrator login | Supabase Auth |
| `/dashboard` | Statistics and overview | Supabase service |
| `/dashboard/jurusan` | Add, edit, and delete majors | In-memory `AdminDataContext` |
| `/dashboard/berita` | News CRUD | Supabase |
| `/dashboard/pengumuman` | Announcement CRUD | Supabase |
| `/dashboard/prestasi` | Achievement CRUD | Supabase |
| `/dashboard/bkk` | BKK job CRUD | Supabase |
| `/dashboard/ppdb` | Applicant review and status updates | Supabase |
| `/dashboard/pengaturan` | Dashboard settings | `AdminDataContext` |

Admin routes are protected by `ProtectedRoute`. An administrator must authenticate through Supabase Auth and have a relation in `public.admins`.

### Demo Admin Login

Email: `admin1234@admin.id`

Password: `1234`

> **Warning:** The credentials above are for demo/testing purposes only. Do not use this password in production. Replace the production admin password with a strong, unique password.

The credentials are only prefilled for UX. Passwords are not stored in the `admins` table.

## Tech Stack

### Frontend

- React 19
- Vite 8
- Tailwind CSS 4
- React Router 7
- `lucide-react`
- `react-icons`
- `@supabase/supabase-js`
- CSS transitions and `IntersectionObserver`

The project does not use Axios or Framer Motion. HTTP requests use the built-in `fetch` API.

### Backend and platform

- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage
- Deno-based Supabase Edge Functions
- Row Level Security (RLS)

### AI and deployment

- STELA supports Anthropic, Google Gemini, and Groq through an Edge Function.
- NextTel uses frontend scoring and an Anthropic Edge Function for result explanations.
- The frontend can be deployed to Vercel; the database, Auth, Storage, and Edge Functions run on Supabase.

## Architecture

```text
Browser
   ↓
React / Vite
   ├── React Router
   ├── Public pages
   └── Protected admin pages
          ↓
   Supabase client / fetch
          ↓
Supabase
   ├── Authentication
   ├── PostgreSQL + RLS
   ├── Storage
   └── Edge Functions
          ├── STELA
          └── NextTel
```

The browser renders the UI. React/Vite provides components, pages, state, and builds. The Supabase client accesses Auth, database, and Storage with a public key subject to RLS. Edge Functions provide server-side access to AI providers so AI API keys never reach the browser.

## Folder Structure

```text
smk-telkom-purwokerto/
├── frontend/
│   ├── public/
│   ├── scripts/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── page/Login/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   └── ppdb/
│   │   ├── router/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   └── vite-plugin-stela.js
├── supabase/
│   ├── functions/
│   │   ├── nexttel/
│   │   └── stela/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_ppdb_identity.sql
│   │   └── 003_ppdb_storage_owner_and_unique.sql
│   ├── README.md
│   └── .temp/                 # Local CLI state; do not commit
├── README.md
├── ai.md
└── bug.md
```

## Online PPDB

PPDB flow:

```text
Register → Email Verification → Login → Form → Document Upload → Submit → Application Status
```

Available routes:

```text
/ppdb/daftar
/ppdb/masuk
/ppdb/verifikasi
/ppdb/formulir
/ppdb/berkas
/ppdb/selesai
/ppdb/status
/ppdb/dokumen-peserta
```

`/ppdb` redirects to `/ppdb/masuk`. Submission statuses are `menunggu`, `diproses`, `diterima`, and `ditolak`.

`public.ppdb.auth_user_id` references `auth.users.id`. New submissions must use an `auth_user_id` matching `auth.uid()`. Users can only read their own submissions through RLS, and a partial unique index limits one submission per account.

Supabase email confirmation redirects to `/ppdb/verifikasi`. The `ppdb-documents` bucket is private. Document paths use `submissions/<auth_user_id>/<ppdb_id>/<filename>` and are opened through time-limited signed URLs, not public URLs. Administrators can read and update PPDB data according to policy.

## Supabase

Apply migrations in order:

1. `001_initial_schema.sql` creates the `admins`, `berita`, `pengumuman`, `prestasi`, `bkk`, and `ppdb` tables, indexes, `updated_at` triggers, `is_admin()`, RLS, and both Storage buckets.
2. `002_ppdb_identity.sql` adds `auth_user_id`, the `auth.users` foreign key, PPDB ownership RLS, and user-scoped document uploads.
3. `003_ppdb_storage_owner_and_unique.sql` adds the owner object-read policy and the one-submission-per-account unique index.

`AuthContext` reads the Supabase session and checks the user in `public.admins`. `ProtectedRoute` redirects users without admin access to `/login`. The anon/publishable key may be used in the frontend because database access remains restricted by RLS; service-role keys must never be placed in the frontend.

## STELA AI

STELA is a virtual school assistant for questions about the school profile, majors, facilities, activities, achievements, BKK, PPDB, news, announcements, and contact information.

- Production endpoint: `${VITE_SUPABASE_URL}/functions/v1/stela`.
- Local endpoint: `/api/stela` from `frontend/vite-plugin-stela.js`.
- Providers: Anthropic, Google Gemini, and Groq.
- Provider priority: Anthropic, Gemini, then Groq.
- Default and fallback models are defined in `supabase/functions/stela/inti.mjs`.
- Dynamic context includes published news, published announcements, achievements, and active BKK entries.
- Dynamic context is cached for 60 seconds.
- STELA does not read PPDB, `admins`, drafts, or private buckets.
- Input validation, origin restriction, rate limits, daily limits, per-IP limits, answer caching, output-token limits, and an emergency switch are implemented.
- These guards run in Edge Function memory; provider billing limits must still be configured in the provider dashboard.
- Production API keys are stored as Supabase Edge Function Secrets.

Static knowledge is generated from `dummyData.js`:

```bash
cd frontend
npm run stela:konten
```

Redeploy the STELA function after the snapshot changes.

## NextTel AI

NextTel uses an eight-question questionnaire. Scoring runs in the frontend for `RPL`, `PG`, `TKJ`, and `TJAT`. The result is sent to `${VITE_SUPABASE_URL}/functions/v1/nexttel` for an explanation.

The NextTel Edge Function uses Anthropic server-side, validates questions, options, scores, and recommendations, applies origin and rate restrictions, and returns `explanation`, `strengths`, and `learningSuggestions`. Its API key is stored in `NEXTTEL_ANTHROPIC_API_KEY`.

## Environment Variables

### Frontend and local mode

| Variable | Used by | Required | Secret? |
|---|---|---:|---:|
| `VITE_SUPABASE_URL` | Supabase client, Auth, database, Storage, STELA, NextTel | Supabase features | No |
| `VITE_SUPABASE_ANON_KEY` | Supabase client and Authorization header | Supabase features | No |
| `VITE_ADMIN_BYPASS` | Development admin preview | Optional | No |
| `ANTHROPIC_API_KEY` | Local STELA | Optional | Yes |
| `GEMINI_API_KEY` | Local STELA | Optional | Yes |
| `GROQ_API_KEY` | Local STELA | Optional | Yes |
| `STELA_MODEL` | Local STELA model | Optional | No |
| `STELA_AKTIF` | STELA switch | Optional | No |
| `STELA_MAKS_PER_HARI` | STELA daily limit | Optional | No |
| `STELA_MAKS_PER_IP` | STELA per-IP limit | Optional | No |

### Supabase Edge Function secrets

| Variable | Used by | Secret? |
|---|---|---:|
| `ANTHROPIC_API_KEY` | STELA Anthropic | Yes |
| `GEMINI_API_KEY` | STELA Gemini | Yes |
| `GROQ_API_KEY` | STELA Groq | Yes |
| `STELA_MODEL` | STELA model | No |
| `STELA_AKTIF` | STELA emergency switch | No |
| `STELA_MAKS_PER_HARI` | STELA daily limit | No |
| `STELA_MAKS_PER_IP` | STELA IP limit | No |
| `STELA_ALLOWED_ORIGINS` | STELA origins | No |
| `SUPABASE_URL` | STELA public context | No |
| `SUPABASE_ANON_KEY` | STELA REST context | No |
| `NEXTTEL_ANTHROPIC_API_KEY` | NextTel provider | Yes |
| `NEXTTEL_MODEL` | NextTel model | No |
| `NEXTTEL_ALLOWED_ORIGINS` | NextTel origins | No |

Never commit `.env`, place a service-role key in the frontend, or put an AI API key in a `VITE_*` variable. Production secrets must be stored with Supabase Secrets.

## Installation and Development

Prerequisites: Node.js `^20.19.0` or `>=22.12.0` and npm.

```bash
git clone https://github.com/KiandrAHD/smk-telkom-purwokerto.git
cd smk-telkom-purwokerto/frontend
npm install
```

Create `frontend/.env` from `frontend/.env.example`:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Run the application:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). A configured Supabase project is required for Supabase, Auth, PPDB, dashboard, production STELA, and NextTel features.

## Supabase CLI

Run from the repository root:

```bash
npx supabase --version
npx supabase login
npx supabase link --project-ref <PROJECT_REF>
npx supabase db push
npx supabase functions deploy stela
npx supabase functions deploy nexttel
```

Create an administrator through Supabase Dashboard → Authentication → Users, then link the user UUID to `public.admins` through the SQL Editor. Passwords remain managed by Supabase Auth.

## Build and Deployment

Run from `frontend/`:

```bash
npm run lint
npm run build
npm run preview
```

`lint` runs ESLint, `build` creates `frontend/dist/`, and `preview` serves the build locally.

Vercel settings:

```text
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```

```text
Vercel   → React/Vite frontend
Supabase → PostgreSQL, Auth, Storage, Edge Functions
```

Application data references `https://smk-telkom-purwokerto.vercel.app`. The repository has no formal Vercel configuration, so production deployment is not claimed as source-verified. Supabase Authentication → URL Configuration must use the actual production domain, and PPDB redirects must match `/ppdb/verifikasi`.

## Security

- Use Supabase Auth for administrators and PPDB accounts.
- Preserve RLS for public, authenticated-user, administrator, and ownership access.
- The anon/publishable key may be used in the frontend; service-role keys are server-side only.
- Store AI API keys only in Edge Function Secrets.
- Keep PPDB documents in the private bucket and use signed URLs.
- Preserve `auth_user_id = auth.uid()` ownership.
- Never commit `.env` or secrets.
- Demo credentials are not production credentials.
- Rate limits and cost guards reduce abuse, but provider billing limits must also be configured.

## Testing Checklist

- Public: homepage, navigation, profile, majors, achievements, BKK, news, announcements, STELA, and NextTel.
- Admin: login, protected routes, dashboard, News, Announcement, Achievement, BKK, PPDB, and Major CRUD.
- PPDB: signup, email verification, login, form, PDF upload, submission, status, duplicate protection, and signed document URLs.
- AI: STELA validation/rate-limit/provider fallback and NextTel questionnaire, scoring, and explanation.
- No dedicated test runner was found in `frontend/package.json`; the primary checks are `npm run lint` and `npm run build`.

## Project Status

| Feature | Status |
|---|---|
| Public Website | Available; some content remains static |
| Admin Login | Available through Supabase Auth |
| Admin Dashboard | Available on protected routes |
| News CRUD | Available through Supabase |
| Announcement CRUD | Available through Supabase |
| Achievement CRUD | Available through Supabase |
| BKK CRUD | Available through Supabase on the active admin route |
| Admin PPDB | Available through Supabase |
| Major Management | Available through in-memory `AdminDataContext` |
| Online PPDB | Available with Auth, verification, forms, upload, submission, and status |
| STELA | Available; requires a configured provider/API key |
| NextTel | Available; requires the Edge Function and Anthropic secret |
| Supabase | Migrations, Auth, RLS, Storage, and Edge Functions are present in the repository |
| Deployment | Vercel procedure is documented; actual deployment is not verified |
| Automated Test Suite | No dedicated test runner found |

## Notes

- Apply migrations `001`, `002`, then `003` in order.
- Major data and some legacy dashboard pages remain in context state and are not guaranteed to survive a refresh.
- Not all public data is read from Supabase.
- `supabase/.temp/` is local CLI state and should not be committed.
- For Supabase troubleshooting, inspect the `{ data, error }` response and the policies/RLS of the active project.
- Additional AI notes are available in [`ai.md`](./ai.md), and bug notes are available in [`bug.md`](./bug.md).
