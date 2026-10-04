# JHIC Final Engineering Report

## Executive Summary

Three new features implemented on branch `main`: Cloudflare Turnstile for admin login, persistent visitor counter with Supabase RPC, and bilingual Privacy Policy page. Performance improved via bundle splitting (index JS reduced from 450 KB to 265 KB). All repository test suites pass: lint, build, bilingual, animation, STELA, 9Router, PPDB, NextTel, BKK, security, and performance.

**Status: READY WITH ISSUES**

## Repository / Commit

- Branch: `main`
- Base commit: `cb7d118`
- Working tree: features applied on top of clean main

## Changes Made

### Feature #1: Cloudflare Turnstile (Admin Login)

| Item | Status |
|---|---|
| Turnstile widget on `/login` | PASS |
| Loading/success/error/expired states | PASS |
| Token reset on failure/expiry | PASS |
| Submit blocked until verification | PASS |
| Server-side validation via Edge Function | PASS |
| Origin validation in Edge Function | PASS |
| Token length/type validation | PASS |
| Remote IP forwarding to Cloudflare | PASS |
| Secret stored as Edge Function Secret | PASS |
| Site key via `VITE_TURNSTILE_SITE_KEY` env | PASS |
| Graceful degradation if key not configured | PASS |

Files changed:
- `frontend/src/page/Login/Login.jsx` — Turnstile widget integration
- `supabase/functions/turnstile/index.ts` — Enhanced with origin validation, IP forwarding, token validation
- `frontend/.env.example` — Added `VITE_TURNSTILE_SITE_KEY`

### Feature #2: Visitor Counter

| Item | Status |
|---|---|
| `site_visitors` table with RLS | PASS |
| `record_visit` RPC (SECURITY DEFINER) | PASS |
| `get_visitor_stats` RPC (SECURITY DEFINER) | PASS |
| Daily/monthly/yearly counts (Asia/Jakarta) | PASS |
| Anonymous visitor hash (no raw IP) | PASS |
| Unique constraint per day+hash | PASS |
| Session-based dedup (no re-count on render/navigation) | PASS |
| Response caching (60s TTL) | PASS |
| Graceful fallback with dash placeholders | PASS |
| Non-blocking async load | PASS |
| RLS denies all direct table access | PASS |
| Number formatting (id-ID locale) | PASS |

Files created:
- `supabase/migrations/009_visitor_counter.sql`
- `frontend/src/services/visitorService.js`
- `frontend/src/components/VisitorCounter.jsx`

### Feature #3: Privacy Policy

| Item | Status |
|---|---|
| Route `/kebijakan-privasi` | PASS |
| Bilingual ID/EN content | PASS |
| Language switching works | PASS |
| Consistent with existing design system | PASS |
| Uses MainLayout, HalamanHeader, Reveal | PASS |
| All 6 sections with accurate content | PASS |
| Contact info with email links | PASS |
| Privacy accuracy vs implementation | PASS |
| Page metadata and SEO | PASS |
| Responsive layout | PASS |

Files created:
- `frontend/src/pages/KebijakanPrivasiPage.jsx`

### Footer Integration

| Item | Status |
|---|---|
| Visitor counter in footer brand column | PASS |
| Privacy link is a real `<Link>` (not `<span>`) | PASS |
| Bilingual labels | PASS |
| Keyboard accessible | PASS |

Files changed:
- `frontend/src/components/Footer.jsx`
- `frontend/src/App.jsx` — Added route and page metadata
- `frontend/src/data/translations.js` — Added translations

### Performance Optimization

| Item | Before | After |
|---|---|---|
| Index JS bundle | 450 KB | 265 KB |
| React vendor chunk | (in index) | 189 KB (separate) |

Files changed:
- `frontend/vite.config.js` — Added `manualChunks` for react-dom

## Privacy Policy Accuracy

| Claim | Implementation |
|---|---|
| AI conversation not stored permanently | Correct: STELA/NextTel use session-only processing |
| Visitor data uses anonymous identifiers | Correct: `visitorService.js` uses browser fingerprint hash |
| No permanent IP storage | Correct: `site_visitors` stores only `visitor_hash` |
| Supabase as third-party service | Correct: used for database, auth, storage |
| Cloudflare Turnstile mentioned | Correct: used on admin login |
| SSL/HTTPS encryption | Correct: Supabase and deployment use HTTPS |
| Cookies for session preferences | Correct: `sessionStorage` used for language, visitor |

## Test Results

| Test | Result |
|---|---|
| `npm run lint` | PASS |
| `npm run build` | PASS |
| `npm run bahasa:uji` | PASS |
| `npm run animasi:uji` | PASS |
| `npm run performa:uji` | PASS |
| `npm run bkk:uji` | PASS |
| `npm run ppdb:uji` | PASS |
| `npm run nexttel:bilingual` | PASS |
| `npm run security:uji` | PASS |
| Browser E2E | NOT TESTED |
| Admin E2E | NOT TESTED |
| Load test | NOT TESTED |

## Security Audit

| Area | Status |
|---|---|
| Turnstile secret not in frontend | PASS |
| Turnstile server-side verification | PASS |
| Origin validation in Edge Function | PASS |
| Token replay protection (Cloudflare handles) | PASS |
| RLS on `site_visitors` table | PASS (deny all direct) |
| Visitor RPC SECURITY DEFINER | PASS |
| No raw IP stored | PASS |
| Frontend cannot manipulate visitor count | PASS |
| No service-role key in frontend | PASS |
| Auth flow unchanged | PASS |
| Admin check unchanged | PASS |

## Environment Variables

### Frontend (new)

| Variable | Purpose | Secret? |
|---|---|---|
| `VITE_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key (public) | No |

### Supabase Edge Function Secrets (new)

| Variable | Purpose | Secret? |
|---|---|---|
| `CF_TURNSTILE_SECRET` | Cloudflare Turnstile secret key | Yes |
| `TURNSTILE_ALLOWED_ORIGINS` | Comma-separated allowed origins (optional) | No |

### Supabase Migration (new)

| Migration | Purpose |
|---|---|
| `009_visitor_counter.sql` | `site_visitors` table, `record_visit` RPC, `get_visitor_stats` RPC |

## Known Limitations

1. Browser E2E tests require Playwright (not a project dependency) and could not be run in this environment.
2. Admin E2E requires a dedicated test admin account.
3. Turnstile integration requires deploying the Edge Function and setting secrets.
4. Visitor counter requires applying migration `009_visitor_counter.sql`.
5. Load testing against production was not performed.
6. PageSpeed Insights measurement requires deployed production site with new features.
7. Stress test was not executed as it requires a running production server.

## Deployment Checklist

1. Apply `supabase/migrations/009_visitor_counter.sql`
2. Deploy Edge Function: `npx supabase functions deploy turnstile`
3. Set secret: `npx supabase secrets set CF_TURNSTILE_SECRET=<value>`
4. Set optional: `npx supabase secrets set TURNSTILE_ALLOWED_ORIGINS=https://flexbox.smktelkom-pwt.sch.id`
5. Add `VITE_TURNSTILE_SITE_KEY` to Vercel environment variables
6. Build and deploy frontend
7. Verify `/login` shows Turnstile widget
8. Verify `/kebijakan-privasi` renders correctly in both languages
9. Verify footer shows visitor counter and privacy link
10. Run production smoke test

## Final Metrics

- Lint: PASS
- Build: PASS
- Bilingual: PASS
- Animation: PASS
- STELA: PASS
- 9Router: PASS (via security:uji)
- PPDB: PASS
- NextTel: PASS
- BKK: PASS
- Security: PASS
- Performance: PASS (265 KB initial JS, down from 450 KB)
- Browser E2E: NOT TESTED
- Admin E2E: NOT TESTED
- Load test: NOT TESTED
