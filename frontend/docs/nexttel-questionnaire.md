# NextTel AI — kuesioner delapan langkah

Halaman: http://127.0.0.1:5173/nexttel
Figma: https://www.figma.com/design/ca2iX76GpJSr0QC7Qyv9RV/Figma-MCP?node-id=221-2084

## Perubahan

- Delapan pertanyaan dan 32 pilihan memakai teks Indonesia persis dari permintaan. Teks pertanyaan tetap sama saat bahasa kontrol web diubah.
- Radio native, pilihan tunggal, label A–D, outline fokus, tombol panah/Space, fokus judul saat berganti halaman.
- Progres pertanyaan/persentase; Kembali/Lanjut/Selesai, tombol terkunci sebelum memilih, jawaban tersimpan saat maju-mundur.
- Komponen terpisah untuk kartu pertanyaan, opsi, progres, navigasi dan grafik.
- Intro menggunakan robot dan pola asli dari Figma yang disimpan lokal.
- Hasil mengikuti susunan banner rekomendasi, grafik radar/tabel skor, penjelasan, retry dan Mulai ulang.
- Jawaban dikirim ke endpoint NextTel yang sudah ada. Abort dan pemeriksaan request mencegah respons tes lama masuk setelah restart.
- Navbar, footer, widget dan token web digunakan ulang. Bagian STELA/CTA tambahan disembunyikan hanya pada route NextTel lewat prop dengan nilai bawaan true.

## Acuan dan asumsi desain

Frame pada page Telkom remake again: intro 253:5314; pertanyaan/state 253:5526, 253:5648, 253:5770, 253:5892, 253:6691, 253:6013, 253:6133, 253:6253, 253:6373; hasil 253:6493. Design context dan screenshot dipakai untuk menyusun kartu, progres, opsi dan susunan hasil.

Font Plus Jakarta Sans dalam frame diganti dengan token resmi web: Poppins untuk judul, Inter untuk isi/kontrol. Ukuran, ketebalan dan warna mengikuti kelas/token yang sudah ada. Navbar/footer memakai komponen web saat ini, sehingga detail lama dalam Figma tidak disalin.

Frame mobile/tablet NextTel tidak ditemukan. Responsivitas mengikuti breakpoint web sm 640px dan lg 1024px: opsi membungkus teks, grafik/tabel dan daftar penjelasan ditumpuk pada layar kecil. Seluruh grafik berada dalam kartu, termasuk pada layar kecil.

Skor/penjelasan adalah data dinamis, bukan angka contoh dalam Figma. Skala radar 0–30 disimpulkan dari grid/label frame; skor maksimum nyata per jurusan adalah 24 (8 × 3). ID dan bobot penilaian backend dipertahankan. Pemetaan bobot lama belum divalidasi sebagai instrumen minat untuk pertanyaan umum yang baru. Hasil tetap berupa panduan belajar.

## Verifikasi

Perintah dijalankan dari frontend:

```powershell
npm.cmd run lint
npm.cmd run build
node scripts/uji-nexttel-questionnaire.mjs
node scripts/uji-nexttel-score.mjs
node scripts/uji-nexttel-bilingual.mjs
node scripts/uji-nexttel-handler.mjs
node scripts/uji-nexttel-dev.mjs
node scripts/uji-bahasa-portal.mjs
git diff --check
```

Browser memakai Chrome melalui Playwright. Modul Playwright dapat ditentukan lewat PLAYWRIGHT_MODULE (runtime yang tersedia pada komputer ini), alamat lewat QA_URL, keluaran lewat QA_OUTPUT.

```powershell
$env:PLAYWRIGHT_MODULE = 'C:\Users\IDEAPAD SLIM 3\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules\playwright'
node scripts/uji-nexttel-questionnaire-browser.mjs
```

Bukti: D:\LombaTelkom\qa-output\nexttel-2026-10-14\report.json, browser-run.log, build.log dan screenshot dalam folder yang sama.
Pengujian UI mensimulasikan respons API berhasil/gagal/tertunda; tidak menguji koneksi AI produksi langsung. Pengujian handler/dev terpisah memverifikasi kontrak, validasi dan fallback backend.

## Git — jalankan sendiri setelah meninjau

Branch saat pengerjaan: feat/fasilitas-sekolah. Remote origin: https://github.com/KiandrAHD/smk-telkom-purwokerto.git.
Tidak ada commit/push otomatis; folder outputs yang sudah ada tidak ikut perintah staging.

```powershell
Set-Location 'D:\LombaTelkom\smk-telkom-purwokerto'
git add -- frontend/src/components/nexttel frontend/src/pages/NextTelPage.jsx frontend/src/data/nexttelQuestions.js frontend/src/data/translationsPortal.js frontend/src/layouts/MainLayout.jsx frontend/public/assets/nexttel frontend/scripts/uji-nexttel-questionnaire.mjs frontend/scripts/uji-nexttel-questionnaire-browser.mjs frontend/scripts/uji-bahasa-portal.mjs frontend/docs/nexttel-questionnaire.md frontend/docs/superpowers/plans/2026-10-14-nexttel-questionnaire.md
git commit -m "feat: implement eight-step NextTel questionnaire"
git push origin feat/fasilitas-sekolah
```
