# QA Feedback Kepala Sekolah

Tanggal: 2026-10-14

## Perubahan

- STELA menerima pertanyaan edukatif umum dan roadmap karier tanpa harus menyebut sekolah; guard berbahaya dan prompt injection tetap aktif. Konteks berita/pengumuman publik ditambahkan untuk pertanyaan umum/sekolah.
- NextTel mempertahankan delapan pertanyaan, menambahkan opsi E dengan jawaban bebas tervalidasi, pembatalan request, dan perlindungan stale response.
- Reminder STELA non-modal tampil setelah jeda, disimpan di localStorage selama tujuh hari, aman untuk mobile, keyboard, dan reduced motion.
- Prestasi mendukung `instagram_url` opsional, validasi HTTPS Instagram, tampilan publik/admin, serta migration `013_prestasi_instagram_url.sql`.

## Hasil tes

- PASS `npm run lint`
- PASS `npm run build`
- PASS `npm run stela:uji`
- PASS `npm run prestasi:uji`
- PASS `npm run nexttel:bilingual`
- PASS `npm run security:uji`
- PASS `git diff --check`
- BLOCKED live Supabase CRUD dan migration verification: environment test memiliki tabel publik yang belum lengkap (`PGRST205`, dicatat di `bug.md`).
- BLOCKED browser E2E: repository tidak memiliki Playwright/Cypress/Webdriver.

Migration tidak dijalankan ke database produksi otomatis. Jalankan setelah review melalui pipeline Supabase yang digunakan proyek.
