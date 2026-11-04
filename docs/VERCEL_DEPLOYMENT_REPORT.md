# Vercel Deployment Report

Tanggal: 2026-11-04
Status: **Root cause fixed locally; production deployment requires external project access.**

## Root cause proven locally

Vercel build gagal karena `npm run build` menjalankan prerender SEO yang ketat. Saat `VITE_API_BASE_URL` tidak tersedia di environment build Vercel, `apiClient.js` fallback ke `http://localhost:3000`, prerender fetch gagal dengan `ECONNREFUSED`, dan build diabort.

## Fix implemented

1. `frontend/scripts/prerender-seo.mjs` sekarang mendukung `PRERENDER_MODE`:
   - `strict` (default): abort jika data publik tidak dapat diambil. Cocok untuk build lokal/VPS dengan backend terjangkau.
   - `resilient`: jika backend tidak terjangkau saat build, SPA tetap dibangun. Feed publik kosong, rute dinamis ditandai `noindex`, dan browser mengambil data live saat runtime. Tidak pernah menciptakan data palsu.
2. `frontend/scripts/validate-deployment-env.mjs` memvalidasi `VITE_API_BASE_URL` wajib absolut non-localhost untuk production/Vercel build.
3. `frontend/src/services/apiClient.js` hanya fallback ke localhost di development; production tidak menyembunyikan kegagalan API.
4. `frontend/src/components/TurnstileWidget.jsx` menggunakan proteksi localhost yang sama.
5. `frontend/.env.example` mendokumentasikan `VITE_API_BASE_URL`, `VITE_SITE_URL`, `PRERENDER_MODE`, dan Turnstile.

## Required Vercel project configuration

- Root Directory: `frontend`
- Framework Preset: Vite
- Install Command: `npm ci`
- Build Command: `npm run build`
- Output Directory: `dist`
- Node.js: 22 LTS
- Environment Variables (Preview and Production):
  - `VITE_API_BASE_URL` = URL backend production (HTTPS, non-localhost)
  - `VITE_SITE_URL` = canonical host
  - `PRERENDER_MODE` = `resilient`
  - `VITE_TURNSTILE_SITE_KEY`, `VITE_TURNSTILE_ENABLED` sesuai kebutuhan

## Local verification

- `npm ci` frontend: PASS (255 packages).
- `npm run lint` frontend: PASS.
- Vercel-mode build dengan backend unreachable (`PRERENDER_MODE=resilient`, `VERCEL=1`): PASS. 102 rute diprerender; rute dinamis `noindex`; SPA fungsional.
- `npm run build:ci` dengan `CI=true`: PASS (output offline test-only, tidak untuk deploy).
- Strict build tanpa `VITE_API_BASE_URL`: FAILS early dengan error validasi eksplisit (intentional).
- Strict build dengan backend reachable: PASS (prerender dengan data real).

## Blockers

- Tidak ada verified production backend URL.
- Tidak ada verified Vercel project untuk repository ini pada authenticated CLI account.
- Preview/Production deployment tidak dapat diverifikasi tanpa akses project Vercel dan backend production.
