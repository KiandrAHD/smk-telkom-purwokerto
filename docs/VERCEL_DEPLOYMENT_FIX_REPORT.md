# Vercel Deployment Fix Report

Date: 2026-11-04
Status: Local fixes implemented; external Vercel verification blocked by project/backend access.

## Root causes proven locally

1. Vercel builds had no `VITE_API_BASE_URL` because local `.env` is ignored. `apiClient.js` fell back to `http://localhost:3000`; strict SEO prerender failed with `ECONNREFUSED ::1:3000` and `127.0.0.1:3000`.
2. Local `node_modules` was stale and lacked `sanitize-html`; `npm ci` repaired the installation successfully. The lockfile is valid.
3. Backend detail routes accepted IDs only while frontend detail services use slugs.
4. Production backend readiness remains unverified. The initial Prisma migration file is empty, so a clean MySQL database cannot be considered ready.

## Files changed

- `frontend/scripts/validate-deployment-env.mjs`
  - Added production/Vercel build validation.
  - Requires an absolute non-localhost `VITE_API_BASE_URL`.
- `frontend/package.json`
  - Runs environment validation before production Vite build.
- `frontend/src/services/apiClient.js`
  - Allows localhost fallback only in development; production no longer silently targets a visitor's localhost.
- `frontend/src/components/TurnstileWidget.jsx`
  - Same production localhost protection.
- `frontend/.env.example`
  - Documents backend URL, site URL, and Turnstile variables.
- `backend/src/routes/content.js`
  - Detail reads now support either ID or unique slug while retaining public status filtering.
- `docs/VERCEL_DEPLOYMENT_DIAGNOSIS.md`
  - Evidence and deployment blockers.

No Supabase migrations, data, Edge Functions, or credential files were deleted.

## Testing performed

- `npm ci` in `frontend/`: PASS.
- `npm run lint` in `frontend/`: PASS.
- Production build without `VITE_API_BASE_URL`: FAILS early with explicit validation error. This is intentional and prevents a broken deployment.
- Production build with `VITE_API_BASE_URL=https://backend.invalid`: reaches prerender, then fails with DNS error. This proves the build now requires a real reachable backend and does not hide API failure.
- `npm run build:ci` with `CI=true`: PASS; generated offline test output for 102 routes. This output is explicitly marked non-deployable.
- `npm run build:ci` without `CI=true`: correctly rejected by existing offline guard.
- `git diff --check`: no whitespace errors.

## Vercel status

No Preview or Production deployment was verified. Authenticated Vercel CLI account `flexbox-studiocode` currently lists project `flex-box/flexboard`, not an identifiable SMK Telkom Purwokerto project. The repository remote also points to `KiandrAHD/smk-telkom-purwokerto`, while the task URL uses `flexbox-studiocode`.

Required manual setup:

1. Link the correct Vercel project/team and repository.
2. Set Root Directory `frontend`.
3. Set Install Command `npm ci`.
4. Set Build Command `npm run build`.
5. Set Output Directory `dist`.
6. Set Node.js 22.
7. Set `VITE_API_BASE_URL` separately for Preview and Production to the real backend URL.
8. Set `VITE_SITE_URL` to the selected canonical host.
9. Ensure backend MySQL schema/migrations, CORS allowlist, cookies, and public GET endpoints are operational.
10. Deploy Preview, inspect logs, test routes/assets/API, then deploy Production.

## Remaining blockers

- No verified production backend URL was available.
- No verified Vercel project for this repository was available in the authenticated CLI account.
- `backend/prisma/migrations/20261103000000_init/migration.sql` is empty; backend database initialization must be completed and reviewed before claiming production readiness.
- Backend uses local disk uploads, which require durable storage for production.
- Preview CORS requires an explicit allowlist strategy for Vercel preview origins.
- Backend tests and database tests require configured disposable databases.

## Release decision

Do not claim `Vercel Preview: READY`, `Vercel Production: READY`, or `MySQL integration: PASS` until the manual blockers above are resolved and real deployment URLs are tested. No commit or push was performed because external deployment prerequisites and the correct Vercel project are unresolved.
