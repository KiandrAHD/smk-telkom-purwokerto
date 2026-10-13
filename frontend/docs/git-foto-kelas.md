# Perintah Git khusus integrasi foto kelas

Belum dijalankan. Periksa staged diff sebelum commit.

```powershell
Set-Location 'D:\LombaTelkom\smk-telkom-purwokerto'
$fotoKelasFiles = @(
  'frontend/src/data/fasilitasPageData.js'
  'frontend/src/data/translationsFasilitas.js'
  'frontend/src/pages/FasilitasPage.jsx'
  'frontend/src/data/classroomPhotoManifest.json'
  'frontend/src/data/classroomPhotoCovers.js'
  'frontend/src/data/classroomPhotos.js'
  'frontend/src/assets/fasilitas/kelas'
  'frontend/scripts/optimasi-foto-kelas.mjs'
  'frontend/scripts/uji-foto-kelas.mjs'
  'frontend/docs/foto-kelas-audit.json'
  'frontend/docs/foto-kelas-integrasi.json'
  'frontend/docs/foto-kelas.md'
  'frontend/docs/git-foto-kelas.md'
)
git add -- $fotoKelasFiles
git diff --cached --stat
git commit -m "feat: integrate verified classroom photo galleries"
git push origin feat/fasilitas-sekolah
```
