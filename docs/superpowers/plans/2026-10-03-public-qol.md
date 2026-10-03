# Public QoL Implementation Plan

Goal: Implement the 16 approved audit recommendations for public navigation and accessibility.

Architecture: Keep React Router, native dialog, Tailwind, and the existing bilingual dictionary. Reuse public layouts and data-state components. No dependency, authentication, database, or deployment changes.

Spec: The localhost QoL audit in this conversation, accepted with "implementasikan satu per satu".

Constraints: Preserve unrelated local changes and existing accents. Indonesian explanations and bilingual UI. No automatic commit or push. Implement in the active feature branch so localhost shows the result.

Review focus: Browser Back with delayed data; a dialog opened from a copied URL; dismissal after pointer dragging; landscape and virtual keyboard height; retry after a failed request without losing filters.

Tasks in audit order:

- [x] 1. BeritaKategoriSection.jsx: replace low-contrast 9px metadata with dark-500 and text-xs; verify rendered colors and contrast against white.
- [x] 2. EkstrakurikulerPage.jsx: capture the trigger and restore focus after close; test mouse, keyboard Enter, and Escape.
- [x] 3. MainLayout.jsx: add a translated skip link and a focusable main target with sticky-header offset; test first Tab and Enter.
- [x] 4. Navbar.jsx: toggle the disclosure, remove application-menu roles, close with Escape/outside pointer, restore the trigger; test keyboard and normal links.
- [x] 5. Navbar.jsx: limit mobile panel to available dynamic viewport height and allow internal scrolling; verify 844x390 and 390x844.
- [x] 6. StelaWidget.jsx: constrain the whole panel using dvh and a flexible scrollable chat; test landscape and reopening without losing the conversation.
- [x] 7. EkstrakurikulerPage.jsx: one column below sm, 14px body text, 44px action targets; verify mobile and desktop.
- [x] 8. BeritaKategoriSection.jsx / ScrollToTop.jsx: serialize q/category/sort/count to search params, preserve unrelated params, and restore scroll on POP by history key. Test filtered article -> Back and Forward, delayed data, and hash targets.
- [x] 9. ppdb/LoginPage.jsx: email type, input mode, name and autofill tokens; verify attributes without submitting credentials.
- [x] 10. DetailLayout.jsx / ScrollToTop.jsx: article-specific title and focus the heading on new route navigation once it exists; avoid stealing focus on Back, search updates, or modal close.
- [x] 11. Navbar.jsx / DetailLayout.jsx: section matching including child routes, aria-current and labeled breadcrumb; test /berita/slug and /berita-other boundaries.
- [x] 12. EkstrakurikulerPage.jsx: encode selected activity in ?kegiatan=slug, close from backdrop/ESC/Back, preserve filters, distinguish a copied link from a pushed modal entry. Test click inside, outside, Back, and direct URL.
- [x] 13. Navbar.jsx / StelaWidget.jsx: expanded-controls relationship, ESC, input focus on open and trigger focus on close; verify chat remains nonmodal.
- [x] 14. BeritaKategoriSection.jsx / EkstrakurikulerPage.jsx: announce result totals after 300ms using a reusable live status component; test query changes without focus movement and both languages.
- [x] 15. PublicDataState.jsx and its public consumers: alert and retry handlers that refetch only the failed data; show loading while retrying and preserve the existing query.
- [x] 16. PublicDataState.jsx / App.jsx: accessible card skeleton and public route fallback retaining navbar/footer; use motion-safe pulse, no animation for reduced motion; avoid showing public navigation for private routes.

Verification: npm.cmd run build; ESLint for changed files; existing language baseline; scripts/uji-qol.mjs for route boundaries and rendered semantics. Browser regression for all interaction sequences above with fresh DOM checks and screenshots. Existing PPDB SSR window error is outside this scope unless these changes introduce it.

Ruling: The user already accepted the audit and explicitly requested implementation; execute all tasks inline without an additional approval gate. Existing browser failures are the pre-change behavioral baseline. For low-impact style changes, validate rendering rather than writing implementation-mirroring tests. The plan is the progress ledger; keep completion evidence here. Review only this task's diff, not earlier dirty files.

Implementation evidence (2026-10-03):
- Tasks 1-7, 9, 11-16 implemented; browser verified metadata rgb(107,114,128)/12px, first Tab skip link -> main, menu click/ESC/outside, 844x390 internal scrolling, STELA fully below navbar with draft preserved and ESC trigger focus, 390x844 one card column with 14px copy / 44px buttons, input email/username and current-password.
- Task 8: q=Darussalam survives article -> Back/Forward with one card. Modal/filter changes preserve focus. Hash landing uses layout offsets, avoiding Lenis + CSS double margin. Added capture of scroll before click/Enter and a history-key guard to prevent old entry corruption when route content shrinks. Testing delayed request restoration before marking complete.
- Tasks 2/12: Enter opens native dialog; clicking content stays open; ESC/backdrop/Back close and return trigger focus; a copied URL closes in-place with q preserved and main focus.
- Task 14: status is polite/atomic with 300ms debounce; tested English and Indonesian counts while input keeps focus.
- Tasks 15/16: blocked only berita read requests using CDP, observed alert/retry -> four skeletons -> successful filtered result, URL unchanged. Reduced-motion emulation gave animationName none for all four skeletons. Network blocks and media emulation reset.
- Fresh review found no Critical, one Important (hidden old main during Suspense readiness) and one Minor (stale detail title on error). Both addressed: select visible main/heading/pending nodes and set loading/error detail titles.
- Build and all changed-file ESLint pass. scripts/uji-qol.mjs and scripts/uji-bahasa.mjs pass. Full bahasa:uji stops at unchanged PanelMerah.jsx (window unavailable in SSR); this predates the task. Build retains the existing chunk-size warning.
- Not verified: a physical phone virtual keyboard and NVDA/VoiceOver. DOM/keyboard semantics and reduced-motion emulation were tested; this is not a full WCAG certification.
Ruling: desktop About now uses predictable click disclosure and hover only prefetches; combining hover-open with click-toggle closed the first click. This preserves destinations and keyboard access.
Ruling: removed the fixed 10s restoration timeout after review; readiness is driven by visible loading states, with cancellation on user interaction or route change.

Final task gates:
- Task 8 delayed GET rule (12s latency per request): no-hash POP received ready data after 19.9s and restored 1411.2px exactly; hash POP after 24.1s restored 1388px exactly instead of jumping to the hash. Query Darussalam remained intact. Capture/history guard protects stored positions during route shrink. CDP rules, network blocks, media and viewport overrides reset. Temporary scroll trace removed.
- Task 10 title/focus: loaded article title and H1 focus verified. Detail error-title fallback patched after fresh review; loading and not-found states verified separately before handoff.
- Tasks 4/13 final: desktop click opens disclosure, outside click closes it; native dialog does not dismiss for inside clicks and draft chat is retained on reopen.
- All 16 tasks are implemented. No commit, push, merge, database writes, AI chat submissions, or credential submissions performed.

Final verification confirmed after all patches: npm.cmd run build exit0, changed-file ESLint exit0, QoL SSR script exit0, language baseline exit0. First Tab + Enter focuses main after ref-scoped skip-link patch. Dragging from dialog text to outside does not dismiss; ESC restores the trigger. Nonexistent news slug displays alert and title "Berita tidak ditemukan. | SMK Telkom Purwokerto". Final screenshot: outputs/qol/stela-landscape.jpg (844x390, panel top84px, form bottom298.4px). The manual Git guide stages only task files.
Ruling: hide STELA in the transient busy route shell to prevent a click starting a chat in a fallback that is immediately replaced. The actual page widget retains its draft on close/reopen. Skip link uses its own main ref to avoid a hidden prior Suspense subtree with the same id.
