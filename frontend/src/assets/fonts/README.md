# Local Google Fonts

Inter v20 (300–900), Poppins v24 (300–900), Plus Jakarta Sans v12 (400–800).

Downloaded from the same Google Fonts CSS2 response used by the application on 2026-10-03. The WOFF2 bytes, weight declarations, unicode ranges and `font-display: swap` are unchanged. `font-faces.css` changes only delivery URLs. Browser glyph measurements for all 19 declared family/weight combinations are compared with the previous Google-hosted versions.

`sources.json` records original gstatic URLs and SHA-256 hashes. Each family retains its SIL Open Font License in the adjacent `*-OFL.txt`. Binary font files are served separately by Vite: unused subsets and weights are not embedded into the critical stylesheet. No font is globally preloaded.

These files are intentional runtime assets, including the subsets that are not requested by the current Indonesian/English homepage. Preserve them when cleaning assets; removing them changes the original glyph coverage.
