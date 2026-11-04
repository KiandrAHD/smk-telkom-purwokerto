# Vercel Deployment Diagnosis

Date: 2026-11-04
Commit audited: `27f8046c26d3de07e7bddc2d8f4655768da67a71`
Branch: `main`
Working tree at diagnosis start: clean

## Verified repository state

- Git remote is `https://github.com/KiandrAHD/smk-telkom-purwokerto.git`, not the task URL `https://github.com/flexbox-studiocode/smk-telkom-purwokerto`.
- Vercel CLI is installed (`65.11.0`) and authenticated as `flexbox-studiocode`.
- `vercel ls` lists project `flex-box/flexboard`; no SMK project was linked or inspected. Deploying from this session would risk targeting the wrong Vercel project, so no deployment was performed.
- Latest local commit is `27f8046c26d3de07e7bddc2d8f4655768da67a71`.

## Reproduced build failure

After `npm ci` in `frontend/`, `npm run build` was executed without `VITE_API_BASE_URL`, matching a Vercel build without the required Project Environment Variable.

The build reached SEO prerendering and failed with:

```text
Error: SEO: cannot prerender published berita; aborting instead of deploying loading-only pages.
Error: connect ECONNREFUSED ::1:3000
Error: connect ECONNREFUSED 127.0.0.1:3000
```

Evidence:

- `frontend/src/services/apiClient.js:3` defaults a missing API URL to `http://localhost:3000`.
- `frontend/package.json:8` runs the strict live-data prerender for `npm run build`.
- `frontend/scripts/prerender-seo.mjs:36-49` calls the public content services and aborts on failure.
- `frontend/scripts/prerender-seo.mjs:53-56` calls SPMB and event APIs during production prerender.
- `frontend/.env` is ignored by Git and is not available to Vercel. It contains stale Supabase variables but no `VITE_API_BASE_URL`.

## Dependency diagnosis

A first local build also failed because the existing local `node_modules` was stale and did not contain `sanitize-html`, although the dependency and lockfile entry were valid. `npm ci` completed successfully and installed 255 packages. This is not a lockfile failure; Vercel must use `npm ci` from `frontend/`.

## Required Vercel project configuration

The repository structure requires:

- Root Directory: `frontend`
- Framework Preset: Vite
- Install Command: `npm ci`
- Build Command: `npm run build`
- Output Directory: `dist`
- Node.js: 22 LTS, aligned with GitHub Actions (`22`)

Do not configure `npm run build:ci` for Vercel. `--offline` is restricted by `prerender-seo.mjs` when `VERCEL` is set and produces non-indexable test output.

## Required runtime/build dependency

`VITE_API_BASE_URL` must be set separately for Preview and Production to the reachable Express backend URL. The backend is not served by this Vercel project. `localhost` and a local Laragon MySQL instance cannot be used by Vercel.

The backend must expose and permit public GET access to:

- `/api/berita?limit=100`
- `/api/pengumuman?limit=100`
- `/api/prestasi?limit=100`
- `/api/bkk?limit=100`
- `/api/spmb`
- `/api/stats/spmb`
- `/api/events?limit=100&page=1`

The backend must have production MySQL connectivity and an initialized schema before a live prerender can succeed. The repository audit found `backend/prisma/migrations/20261103000000_init/migration.sql` empty; this is a production backend blocker and was not silently worked around.

## Architecture findings

- Frontend services use the centralized backend client; no active `createClient`, `supabase.auth`, `supabase.from`, or `functions.invoke` was found in `frontend/src`.
- Supabase references remain in comments, historical UI text, test-only scripts, privacy text, and a dormant storage utility. They were not removed because the migration/data artifacts remain under active preservation requirements.
- Frontend detail services call slugs, while `backend/src/routes/content.js:26-30` looks up IDs. This is a separate runtime regression requiring a backend contract fix.
- The backend is a persistent Express server and is not automatically run by Vercel. It needs a separate VPS/Node deployment or an explicitly designed serverless deployment.
- Backend uploads use local disk and are not suitable for durable Vercel filesystem storage.

## Vercel CLI limitation

The authenticated Vercel account currently exposes `flex-box/flexboard`, not an identifiable SMK Telkom Purwokerto project. No Preview or Production deployment for this repository could be inspected. Project access/linking and deployment verification require the correct Vercel project/team or a corrected repository remote.

## Conclusion

The proven frontend deployment failure is missing `VITE_API_BASE_URL`, which causes strict SEO prerender requests to target `127.0.0.1:3000`. A successful fix requires the correct Vercel project settings plus a reachable, initialized production backend. Preview and Production readiness cannot be honestly claimed until those external prerequisites are configured and verified.
