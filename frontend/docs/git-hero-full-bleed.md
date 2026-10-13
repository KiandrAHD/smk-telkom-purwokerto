# Template Git khusus perubahan hero

Perintah ini belum dijalankan. Daftar file hanya mencakup pekerjaan full-bleed hero ini. Jalankan setelah meninjau diff.

```powershell
Set-Location 'D:\LombaTelkom\smk-telkom-purwokerto'
$heroFiles = @(
  'frontend/src/styles/hero.css'
  'frontend/src/components/HeroSection.jsx'
  'frontend/src/components/tentang/TentangHeroSection.jsx'
  'frontend/src/components/jurusan/JurusanHeroSection.jsx'
  'frontend/src/components/bkk/BkkHeroSection.jsx'
  'frontend/src/components/pengumuman/PengumumanHeroSection.jsx'
  'frontend/src/pages/GuruPage.jsx'
  'frontend/src/pages/EkstrakurikulerPage.jsx'
  'frontend/src/pages/FasilitasPage.jsx'
  'frontend/src/pages/SpmbPage.jsx'
  'frontend/src/pages/KalenderPage.jsx'
  'frontend/src/pages/KalenderPage.css'
  'frontend/src/assets/ekstrakurikuler/hero-figma.webp'
  'frontend/src/assets/kalender/hero-building.webp'
  'frontend/src/assets/kalender/hero-collage.webp'
  'frontend/src/assets/kalender/hero-logo.webp'
  'frontend/src/assets/kalender/hero-wave-figma.webp'
  'frontend/scripts/uji-hero-full-bleed.mjs'
  'frontend/docs/hero-full-bleed.md'
  'frontend/docs/git-hero-full-bleed.md'
)
git add -- $heroFiles
git diff --cached --stat
git commit -m "fix: align public hero image composition with Figma"
git push origin feat/fasilitas-sekolah
```
