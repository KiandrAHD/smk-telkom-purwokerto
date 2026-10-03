# Responsive derivatives

These files are derived from existing artwork, not replacement designs.

From the frontend directory:

```powershell
node scripts/buat-gambar-responsif.mjs hero
node scripts/buat-gambar-responsif.mjs poster
node scripts/buat-gambar-responsif.mjs partners
node scripts/uji-gambar-responsif.mjs --poster --partners
npm.cmd run build
npm.cmd run performa:uji
```

Regenerate the matching derivatives whenever the source artwork changes. The generator preserves originals and never crops or enlarges them. Hero/poster use WebP quality 90; the partner background uses lossless WebP. All original sources remain in their existing folders.

Hero `sizes` follows its 40%/34% desktop grid. Poster `sizes` accounts for a wide source filling a 16:9 object-cover box. Partner `sizes` accounts for the fixed banner height. Do not replace these values with `100vw` without measuring the rendered slot and source pixel density.

Original dimensions, layout, language selection, CTA and video facade are preserved. The performance test checks the nine derivatives and compares the full-size partner artwork over dark/light backgrounds plus alpha.
