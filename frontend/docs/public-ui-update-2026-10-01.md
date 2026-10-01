# Public UI update — 1 October 2026

## Changes

1. Footer accents: nine original motifs remain. Two motifs occupy each reserved side margin; five occupy a separate normal-flow bottom row. The content width reserves the side margins, while the bottom row reserves its own height after the supporter logos. Absolute offsets from the footer bottom no longer place decorations behind text or logos. Native SVG fill (#CECECE, opacity 0.3), mask, and rotation matrices remain unchanged; positions and responsive sizes are intentionally adapted to prevent collisions.
2. Landing page: GuruPreviewSection and its Reveal wrapper/import were removed. Teacher data, images, and shared card frame assets remain in use by the school and teacher profile pages.
3. School profile: “Lihat semua profil guru” now links to /profil-sekolah/guru below the existing teacher section, with the previous outlined button style and keyboard focus treatment.
4. Language: the native React context switches public static UI between Indonesian and English. The validated preference is stored under smk-telkom-language, defaults to Indonesian, and updates html.lang. Disabled browser storage falls back safely. Navbar and standalone SPMB headers expose the toggle. Admin remains Indonesian. Translation dictionaries are grouped by school, public content, and portal; no dependency was added.

## Translation boundaries

Routes, slugs, filter values, form values, teacher names, contact addresses, and API payloads stay unchanged. Dashboard-authored articles/jobs/achievements and generated AI responses retain their source language. Dates use id-ID or en-US on display. Static STELA/promotional bitmap sections have native HTML English variants so their visible copy can change; original Indonesian assets remain available. Browser-generated form validation messages follow the visitor’s browser settings.

## Verification

- Native artwork: nine IDs, original fill/mask, and source section/footer orientations pass the existing accent tests.
- Responsive footer: 390, 768, 1024, 1280, 1536, and 1920 CSS-pixel widths showed zero motif-to-motif collisions, zero collisions with footer content, and no horizontal overflow.
- Public pages: the homepage plus 17 public routes loaded in English at 390 px without horizontal overflow. The teacher-list link opened the correct route. Community kept exactly four cards after switching languages; English basketball search and the activity dialog worked.
- Registration: switching languages retained the selected source program value; English preference survived reload. No account creation or email submission was performed.
- Automated: npm run lint, npm run build, npm run bahasa:uji, npm run bkk:uji, npm run ppdb:uji, node scripts/uji-footer-supporters.mjs, and node scripts/uji-arah-aksen.mjs pass.
- Build retains the existing large-chunk warning; the primary JS chunk is about 757 kB (239 kB gzip) including the English dictionaries. This update does not change deployment or database settings.

## Re-run

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd run bahasa:uji
npm.cmd run bkk:uji
npm.cmd run ppdb:uji
node scripts/uji-footer-supporters.mjs
node scripts/uji-arah-aksen.mjs
```
