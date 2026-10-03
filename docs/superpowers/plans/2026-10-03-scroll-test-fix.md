# Perbaikan harness scroll — 3 Oktober 2026

## Konteks dan ruang lingkup

- Branch: feat/telkom-public-design.
- HEAD saat verifikasi: 5f2249a8dfb6c301a1cf4805c9331f05a42389d4.
- Perubahan lokal sebelumnya tetap disertakan dalam build dan tidak diedit oleh tugas ini.
- File pengujian yang diubah: frontend/scripts/uji-animasi.mjs.
- ScrollToTop.jsx, SmoothScroll.jsx, dependency, dan tampilan aplikasi tidak diubah.

Laporan preflight sebelumnya tetap menjadi catatan kondisi awal. Dokumen ini mencatat hasil sesudah perbaikan harness, bukan mengganti hasil kegagalan historis.

## Identifikasi dan perbaikan

Perintah npm.cmd run animasi:uji sebelum perubahan kembali menghasilkan ReferenceError: useNavigationType is not defined (exit 1). Script lama menjalankan potongan ScrollToTop dalam VM tanpa hook router, useRef, state posisi history, observers, atau penjadwalan frame yang sesuai. Assertion juga mengharapkan stop/start Lenis dan target elemen dari implementasi lama.

Harness baru menjalankan badan komponen asli beserta penyimpanan posisi history. Ref dipertahankan antar-render; effect membandingkan dependencies dan menjalankan cleanup sebelum setup baru. EventTarget, history, layout DOM, observers, requestAnimationFrame, dan batas native/Lenis disimulasikan untuk menguji hasil scroll secara deterministik. Simulasi ini bukan renderer React atau mesin layout browser; pemeriksaan browser tambahan dicatat di bawah.

## Hasil pengujian otomatis

Perintah npm.cmd run animasi:uji kini lulus (exit 0), dengan 20 skenario:

- Reset native dan Lenis dengan immediate/force.
- Fokus heading setelah perpindahan halaman tanpa scroll tambahan.
- Search-only update mempertahankan posisi dan fokus.
- Anchor terenkode, fragment rusak, target tersembunyi, dan offset layout bertingkat.
- Anchor yang baru muncul setelah lazy content.
- Loading main, loading child, dan fallback route; indikator tersembunyi tidak memblokir.
- Back/Forward dengan native dan Lenis, menunggu data serta mempertahankan posisi history saat route lama ter-clamp.
- Lenis tersedia setelah render awal.
- Pembatalan oleh wheel, pointerdown, touchstart, dan keydown.
- Navigasi meninggalkan anchor yang masih menunggu.
- Replay effect StrictMode dan cleanup unmount.

Enam perubahan buatan diterapkan pada string komponen di memori, tanpa menulis file produksi. Seluruhnya menghasilkan kegagalan assertion: reset top salah, history restoration dihapus, penantian anchor dihapus, pembatalan pengguna dihapus, immediate/force Lenis dimatikan, dan disconnect observer dihapus. Ini memastikan pengujian mendeteksi regresi perilaku, bukan hanya berhasil mengeksekusi harness.

## Verifikasi browser pada build produksi lokal

Target: http://127.0.0.1:5187, melalui Vite preview setelah build baru. Browser: Chrome headless 154.0.8037.97, context baru untuk tiap konfigurasi.

Alur: buka /profil-sekolah, scroll 650 px, navigasi SPA ke /jurusan, pastikan reset top dan fokus heading, scroll 430 px, Back, Forward, kemudian buka /profil-sekolah#guru. Posisi ditunggu berdasarkan kondisi DOM dan scroll, bukan jeda waktu tetap.

| Viewport CSS | Reduced motion | Reset top | Back | Forward | Anchor guru (harapan / aktual) | Uncaught exception |
| --- | --- | --- | --- | --- | --- | --- |
| 1440 × 900 | no-preference | 0 | 650 | 430 | 2044 / 2044 | 0 |
| 390 × 844 | no-preference | 0 | 650 | 430 | 3899 / 3899 | 0 |
| 390 × 844 | reduce | 0 | 650 | 430 | 3899 / 3899 | 0 |

Fokus main h1 setelah navigasi baru terverifikasi pada ketiga konfigurasi. Pemeriksaan viewport ponsel dilakukan pada Chrome desktop; ini bukan pengujian perangkat Android fisik, Safari, atau benchmark performa. Pembatalan, lazy content terkontrol, dan replay StrictMode diuji di harness; tabel browser tidak mengklaim seluruh skenario harness diulang di browser.

## Pemeriksaan regresi

| Perintah di frontend | Exit code | Hasil |
| --- | --- | --- |
| npm.cmd run animasi:uji | 0 | 20 skenario lulus |
| npm.cmd run lint | 0 | Lulus |
| npm.cmd run build | 0 | Lulus, Vite 8.2.0, 2142 modul |
| npm.cmd run bahasa:uji | 0 | Ketiga script lulus, termasuk 81 rendered views dan 4 content records |
| npm.cmd run performa:uji | 0 | Entry JS dan 10 gambar terpilih memenuhi budget |
| node scripts/uji-bundle.mjs | 0 | Entry 460048 byte, 135 chunk JS |

git diff --check juga lulus. Peringatan normalisasi LF/CRLF pada working tree bukan error pengujian. Tidak ada dependency baru, staging, commit, push, atau deploy.

## Tindak lanjut

Gerbang animasi yang gagal pada Step 2 kini lulus. Berikutnya adalah Step 3: pengukuran baseline performa browser tiga kali mobile dan tiga kali desktop, menggunakan build/URL dan pengaturan yang dicatat. Perbaikan harness ini sendiri tidak menambah kecepatan aplikasi; entry JS tetap 460048 byte, hanya 752 byte di bawah batas 450 KiB.
