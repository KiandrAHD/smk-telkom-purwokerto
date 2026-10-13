# Agenda Sekolah dan Informasi SPMB Implementation Plan

Goal: menyempurnakan kalender publik dan menghubungkan lima kelompok informasi SPMB admin/publik ke penyimpanan persisten.

Architecture: gunakan eventService/useEvents existing untuk kalender, agenda, foto dan detail. Informasi SPMB belum memiliki tabel/server endpoint; tambahkan satu tabel konten bertipe dan satu RPC agregat aman untuk statistik, melalui Supabase existing. Gunakan RLS is_admin, FormInput, Modal, StatCard, Inter/Poppins dan token existing.

Spec: permintaan pengguna 13 Oktober 2026, Figma ca2iX76GpJSr0QC7Qyv9RV node200:901 dan screenshot Informasi SPMB.

Constraints: tidak menambah dependency; tidak mengganti font/palette/layout global; tidak membuat aktivitas, foto, jadwal, kuota atau persyaratan fiktif; tidak mutasi hosted/commit/push dari sesi ini tanpa akses; semua error harus jelas. Pertahankan kategori kalender existing dan data pendaftar private.

## Task 1: Kalender dan Agenda Sekolah

- [x] Test selector Published max3: ongoing/upcoming dahulu, lalu recent past tanpa duplikasi, empty/draft/missingimage.
- [x] Hapus promo kalender; tambah SchoolAgendaSection memakai data yang diambil sekali di KalenderPage dan detail existing.
- [x] Implement grid3/2/1, crop konsisten, fallback image, Reveal/stagger/hover reduced motion.
- [x] Browser QA: CRUD event/image/title/description/status/delete sync, legend tetap, keyboard, responsive320–1440.

## Task 2: Kontrak dan database SPMB

- [x] Test validasi/payload/tanggal/urutan/tautan/stats sebelum implementasi.
- [x] Tambah utils/spmbInformation.js dan migration012_spmb_information.sql: jenis jadwal/timeline/skema/persyaratan/syarat/statistik; judul/deskripsi/urutan/tanggal/ikon/tautan/sumber/status/kuota.
- [x] Seed hanya konten existing spmbInfo, ppdbDokumen dan teks persiapan portal; tanggal yang belum diketahui tetap NULL, kuota NULL.
- [x] RLS Published-only read/admin mutations, statistik agregat tanpa data identitas. Count seluruh row ppdb; kuota tersisa = kuota total minus status diterima.
- [x] PGlite QA: semua jenis CRUD, anon/nonadmin denied, draft hidden, constraint, existingdata/persistence/count privacy.

## Task 3: Service dan admin/publik

- [x] Service PostgREST pagination, stableUUID upsert/update/delete returning, abort/invalidation/error; hook focus/storage/poll30s.
- [x] Protected route/dashboard/informasi-spmb dan menu existing; reusable table panel2+3 seperti screenshot, tambah/edit/deleteconfirmation lima jenis, formkuota.
- [x] SpmbPage mengonsumsi hookyangsama; render DB waves/timeline/schemes/documents/generalrules, empty/errorstates jujur, desain publik existing tetap.
- [x] Browserfixture QA seluruh CRUD/reload/invalidation/error/retry/draft/tanggal/order/kuota/actualcounts/auth/privateRLScontract.

## Task 4: Integrasi dan laporan

- [x] Lint, build, relevant contract/service/database/browser regressions; JS/JSX tidak menyediakan typecheck.
- [x] Inspeksi screenshots desktop/tablet/mobile, fontglobalunchanged, sidebar/hero/footer preserved.
- [x] Laporan file, datasource, statistik/selectionpolicy, QA and hostedmigrationlimitations; scopedGitcommands usercontrolled.

Review focus: data kosong bukan nol fiktif; tanggal WIB dan rentang invalid; status draft tidak bocor ke publik; update recordstable tanpa lostinfo; gagal save tidak muncul sukses; longlabels/mobiletables tidak overflowpage; URL tidak mengizinkan javascript/protocol-relative; terhapusdiadmin hilangdipublik; statistik tidak mengembalikan nama/emailpendaftar.

Local implementation and QA complete. Hosted activation remains pending migration 012; no administrative database access was available. Evidence and user-controlled Git handoff: frontend/docs/agenda-spmb-admin.md.

