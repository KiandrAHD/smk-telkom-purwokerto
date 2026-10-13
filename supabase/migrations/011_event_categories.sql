-- Extend the existing category column; never guess a category for a legacy event.
BEGIN;
ALTER TABLE public.events DROP CONSTRAINT events_kategori_check;
ALTER TABLE public.events ALTER COLUMN kategori DROP DEFAULT;
ALTER TABLE public.events ADD CONSTRAINT events_kategori_check CHECK (kategori IN (
  'upacara-nasional', 'penilaian-siswa', 'libur-tahun-pelajaran', 'awal-pkl',
  'hari-pertama-sekolah', 'hut-smk', 'libur-akhir-semester', 'perkiraan-kelulusan',
  'cuti-bersama', 'libur-ramadhan',
  'kegiatan', 'akademik', 'lomba', 'karier', 'lainnya'
));
COMMIT;
