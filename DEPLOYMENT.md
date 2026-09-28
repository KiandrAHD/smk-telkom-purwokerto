# JHIC Deployment Handoff

## Targets
- Official domain: https://jhic.smktelkom-pwt.sch.id (DNS currently blocked)
- Vercel: https://smk-telkom-purwokerto.vercel.app
- Temporary QA tunnel: https://span-suitable-directed-middle.trycloudflare.com

## Repository
- GitHub: https://github.com/KiandrAHD/smk-telkom-purwokerto
- Branch: main
- Frontend: React + Vite
- Backend: Supabase

## VPS
- Host: 101.50.1.15
- SSH alias: jhic-vps
- Webuzo user: smktelkom
- Document root: /home/smktelkom/public_html/jhic
- Project path: /home/smktelkom/projects/smk-telkom-purwokerto

## Verified Infrastructure
- SSH: PASS
- VPS frontend deployment: PASS
- Apache/Webuzo VirtualHost: PASS
- React SPA routing: PASS
- Quick Tunnel: PASS
- Vercel public access: PASS

## Verified Features
- STELA CORS: PASS
- STELA browser test: PASS
- NextTel CORS: PASS
- NextTel browser test: PASS
- NextTel provider-priority patch: committed and pushed
- NextTel Edge Function: deployed

## Pending Verification
- Official DNS: BLOCKED
- Auth end-to-end: NOT YET VERIFIED
- PPDB end-to-end: NOT YET VERIFIED
- Admin end-to-end: NOT YET VERIFIED

## Safety
- Never expose secrets.
- Never commit .env or local runtime artifacts.
- Never change DNS/nameservers without explicit approval.
- Never weaken RLS or bypass authentication.
- Never use git reset --hard or git clean.
