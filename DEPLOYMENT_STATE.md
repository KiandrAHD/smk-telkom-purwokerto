# JHIC DEPLOYMENT STATE

## Project
SMK Telkom Purwokerto

## Repository
https://github.com/KiandrAHD/smk-telkom-purwokerto

## Git
Branch: main
Current commit: 4de17666c9571635f61013cb22ba40410b1963d8

## Production Targets
Official: https://jhic.smktelkom-pwt.sch.id
Vercel: https://smk-telkom-purwokerto.vercel.app
Temporary QA: https://span-suitable-directed-middle.trycloudflare.com

## VPS
Host: 101.50.1.15
SSH alias: jhic-vps
Webuzo user: smktelkom
Project: /home/smktelkom/projects/smk-telkom-purwokerto
Document root: /home/smktelkom/public_html/jhic

## Architecture
Frontend: React + Vite
Backend: Supabase
AI: STELA + NextTel

## Deployment Status
SSH: PASS
VPS frontend deployment: PASS
Webuzo: PASS
Apache: PASS
React SPA routing: PASS
Quick Tunnel: PASS
Vercel: PASS
Official DNS: BLOCKED (NEEDS_BROWSER)
SSL official domain: NOT VERIFIED

## Feature Status
Supabase endpoint connectivity: PASS
STELA CORS: PASS
STELA browser test: PASS
NextTel CORS: PASS
NextTel browser test: PASS
NextTel provider-priority patch: COMMITTED and PUSHED
NextTel Edge Function: DEPLOYED
Auth end-to-end: NOT YET VERIFIED
PPDB end-to-end: NOT YET VERIFIED
Admin end-to-end: NOT YET VERIFIED

## Repository Hygiene
Tracked tooling: root package.json and package-lock.json for Supabase CLI
Ignored local artifacts: node_modules, env files, dist, logs

## Rules
- Never create a new branch.
- Never git reset --hard.
- Never git clean.
- Never delete production database.
- Never delete DNS records.
- Never change nameservers without explicit approval.
- Never expose secrets.
- Never weaken RLS or bypass authentication.
- Backup before risky server changes.
- Verify every change.
