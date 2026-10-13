# Resolusi konflik PR 55

13 Oktober 2026. [PR 55](https://github.com/KiandrAHD/smk-telkom-purwokerto/pull/55), `feat/fasilitas-sekolah` → `main`.

Branch PR lokal/remote: `9de3d41bd959f9e14436a048cedaa3ce7d4cdeb9`. Main yang digabungkan: `71297399d67b008572099dec39a040f0e70fa566`. Remote diperiksa ulang setelah QA dan kedua SHA masih sama. Working tree bersih sebelum operasi merge.

## Penyebab

Kedua branch mengubah area kalender yang sama: PR menambahkan kategori Figma terpusat dan komponen legenda/dropdown, sedangkan main membawa penanda Draft, validasi HTTPS, insert event serta formatting ulang komponen. Git tidak dapat memilih hasil pada empat file. Tidak memakai Accept Current/Incoming untuk seluruh perubahan secara membabi buta.

## Empat file konflik

| File | Hasil resolusi |
| --- | --- |
| `frontend/src/pages/admin/kalender/EventForm.jsx` | Mempertahankan versi PR: dropdown 10 kategori resmi dengan dot, fallback kategori lama, validasi, foto dan submit lock. Perubahan main pada komponen ini hanya formatting; dibandingkan lewat AST dengan whitespace JSX dinormalisasi. Hasil file sama dengan HEAD PR, sehingga tidak muncul sebagai perubahan baru terhadap HEAD. |
| `frontend/src/pages/admin/kalender/KalenderAdminPage.jsx` | Mempertahankan versi PR: legenda, dot/label kategori pada kalender/agenda/detail tanggal, pencarian nama kategori serta pemberitahuan data kategori lama. Perubahan main hanya formatting dibanding merge base; status Draft/Published yang sudah ada tetap dipertahankan. Hasil file sama dengan HEAD PR. |
| `frontend/src/utils/events.js` | Menggabungkan tint badge Draft amber dari main dengan mapping Published dari registry kategori PR. Dot kategori selalu mengikuti registry, termasuk Draft. Validasi HTTPS tanpa username/password dari main, 10 kategori resmi/legacy, dan selector Agenda Sekolah dari PR tetap tersedia. Tidak mengembalikan palette generik tiga kelompok warna lama. |
| `frontend/scripts/uji-events-service.mjs` | Fixture memakai insert sesuai service main; mempertahankan pengujian update kategori beserta deskripsi/lokasi/ID. Duplicate create UUID diuji sebagai error 23505, bukan implicit update. Pagination, Published-only, abort, upload/cleanup dan error izin tetap diuji. |

Semua file telah ditandai resolved pada index Git. Tidak menghapus data, mengubah database atau menimpa perubahan kerja pengguna.

## Penyesuaian pendukung

| File | Perubahan |
| --- | --- |
| `frontend/src/services/eventService.js` | Mempertahankan insert dari main agar create tidak dapat diam-diam mengubah record dengan ID sama. Komentar disesuaikan: UUID stabil mendeteksi percobaan duplikat; tidak menjanjikan upsert/idempotent update. |
| `frontend/src/components/kalender/CalendarBoard.jsx` | Mempertahankan Agenda Terdekat lintas bulan dari main. Kalender/list masih mengikuti bulan yang dipilih; memilih tanggal tetap menampilkan agenda tanggal tersebut. Empty label diperbaiki menjadi “Belum ada agenda mendatang.” karena sidebar tidak dibatasi bulan. Promo tetap dihapus dan legenda tetap tersedia. |
| `frontend/src/data/translationsCalendar.js` | Terjemahan label kosong terbaru: “No upcoming events.” |
| `frontend/scripts/uji-events.mjs` | Menguji Draft amber dan Published sesuai registry, bukan mengharapkan kategori legacy selalu biru. Menambah regresi HTTPS dan URL dengan credentials. |
| `frontend/scripts/uji-event-categories.mjs` | Memeriksa seluruh 10 kategori Published memakai registry dan Draft memakai tint terpisah. |
| `frontend/scripts/uji-events-browser.mjs` | Mock POST sekarang menolak ID duplikat seperti insert nyata. Respons hilang setelah simpan lalu retry tidak menimpa record; dialog tetap error, admin dapat membatalkan dan memuat ulang record yang tersimpan. Tes memeriksa Draft tint tanpa mengubah warna dot, dan Agenda Terdekat tetap menampilkan kegiatan mendatang ketika bulan yang dilihat kosong. |
| `frontend/docs/resolve-pr55.md` | Laporan ini dan Git handoff. |

Perilaku retry: jika penulisan pertama benar-benar gagal, retry UUID yang sama masih dapat membuat event. Jika row sudah tersimpan tetapi respons hilang, create ulang menerima error duplikat; record lama tidak berubah. Batalkan dialog dan muat ulang untuk memeriksa row tersimpan. Update dilakukan lewat Edit Event.

## File main yang ikut tergabung otomatis

Delapan file berikut berasal dari main dan tidak diedit manual: `deploy-remote.sh`, `deploy-sync-verify.sh`, `frontend-dist-deploy.tgz`, `frontend/public/.htaccess`, `live-check.sh`, `sync-deploy-latest.sh`, `sync-deploy-verify.sh`, `verify-local-http.sh`.

Script deployment tidak dijalankan. Arsip `frontend-dist-deploy.tgz` tetap milik main dan tidak diregenerasi; hasil build aplikasi terbaru yang diuji berada di `frontend/dist`. QA preview Vite tidak membuktikan konfigurasi Apache atau deployment hosted.

Agenda Sekolah, Informasi SPMB, model/migration, font global, navbar/footer dan registry kategori PR tidak diubah. File deploy bawaan main ikut tercatat dalam merge commit sebagai bagian penggabungan history.

## Validasi yang dijalankan

- `npm.cmd run lint`: lulus.
- `npm.cmd run build`: lulus, log `D:/LombaTelkom/qa-output/pr55-merge-build.log`.
- Unit event, kategori, service event, selector Agenda, kontrak/service SPMB: lulus.
- `uji-events-database.mjs`: SQL/PGlite lulus, migration kategori tidak merusak data, 10 ID/legacy, persistensi update, CRUD admin, Draft privacy, RLS/constraint.
- `npm.cmd run bahasa:uji`: lulus, termasuk 81 rendered views; log `D:/LombaTelkom/qa-output/pr55-merge-language.log`.
- `uji-events-browser.mjs`: Chrome production preview dengan Auth/REST fixture lulus CRUD, insert duplicate safety, lost-response recovery, Draft tint/privacy, 10 warna Figma, legenda/dropdown/keyboard, kategori edit sync, legacy, dan 5 viewport admin/publik/form 1440/1024/768/375/320.
- `uji-kalender-browser.mjs`: lulus route/reload/menu, tanggal/tahun kabisat, daftar/detail/Escape/keyboard/Hari Ini dan 12 viewport/bahasa.
- `uji-school-agenda-browser.mjs`: lulus foto/fallback, detail/focus, sync/error/retry, 12 viewport/bahasa, Inter/Poppins nyata, animasi/stagger/hover/reduced motion.
- `git diff --check`, `git diff --cached --check`: lulus. `git ls-files --unmerged` kosong; pencarian marker konflik dalam src/scripts/supabase kosong.

Bukti browser: `D:/LombaTelkom/qa-output/pr55-merge-events`, `pr55-merge-calendar`, `pr55-merge-agenda`. Tidak melakukan mutasi hosted, migration, commit, push, merge PR di GitHub, atau deployment. Proyek JS/JSX tidak menyediakan script typecheck.

## Menyelesaikan merge dan memperbarui PR

Merge lokal dilakukan dengan `git merge --no-commit --no-ff origin/main`. Resolusi dan file pendukung sudah staged. `MERGE_HEAD` masih menunjuk main 7129739; keadaan ini memang menunggu merge commit. GitHub masih memakai branch sebelum resolusi sampai hasil ini dipush.

Perintah ini hanya men-stage file resolusi; file main yang tergabung otomatis sudah ada di index:

```powershell
Set-Location 'D:/LombaTelkom/smk-telkom-purwokerto'
$pr55ResolutionFiles = @(
  'frontend/src/pages/admin/kalender/EventForm.jsx',
  'frontend/src/pages/admin/kalender/KalenderAdminPage.jsx',
  'frontend/src/utils/events.js',
  'frontend/src/services/eventService.js',
  'frontend/src/components/kalender/CalendarBoard.jsx',
  'frontend/src/data/translationsCalendar.js',
  'frontend/scripts/uji-events-service.mjs',
  'frontend/scripts/uji-events.mjs',
  'frontend/scripts/uji-event-categories.mjs',
  'frontend/scripts/uji-events-browser.mjs',
  'frontend/docs/resolve-pr55.md'
)
git add -- $pr55ResolutionFiles
git diff --cached --check
git status
git commit -m "merge: resolve PR 55 calendar category conflicts with main"
git push origin feat/fasilitas-sekolah
```

Setelah push, refresh PR 55 di GitHub. Resolusi ini mencakup main yang diverifikasi di atas; jika main berubah lagi, periksa ulang status mergeability/checks sebelum Merge pull request.
