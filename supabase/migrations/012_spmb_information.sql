BEGIN;
CREATE TABLE public.spmb_information (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jenis TEXT NOT NULL CHECK (jenis IN ('jadwal','timeline','skema','persyaratan','syarat','statistik')),
  judul TEXT NOT NULL CHECK (char_length(btrim(judul)) BETWEEN 1 AND 180),
  deskripsi TEXT NOT NULL DEFAULT '' CHECK (char_length(deskripsi) <= 5000),
  urutan INTEGER NOT NULL DEFAULT 1 CHECK (urutan BETWEEN 0 AND 9999),
  tanggal_mulai DATE CHECK (tanggal_mulai BETWEEN DATE '0100-01-01' AND DATE '9999-12-31'),
  tanggal_selesai DATE CHECK (tanggal_selesai BETWEEN DATE '0100-01-01' AND DATE '9999-12-31'),
  tanggal_seleksi DATE CHECK (tanggal_seleksi BETWEEN DATE '0100-01-01' AND DATE '9999-12-31'),
  tanggal_pengumuman DATE CHECK (tanggal_pengumuman BETWEEN DATE '0100-01-01' AND DATE '9999-12-31'),
  ikon TEXT CHECK (ikon IN ('account','data','upload','program','selection','result','register','easy','digitest','service')),
  tautan_url TEXT CHECK (tautan_url IS NULL OR (char_length(tautan_url) <= 2048 AND position(chr(92) in tautan_url)=0 AND (tautan_url ~ '^https?://[^[:space:]]+$' OR tautan_url ~ '^/([^/[:space:]][^[:space:]]*)?$'))),
  sumber_url TEXT CHECK (sumber_url IS NULL OR (char_length(sumber_url) <= 2048 AND position(chr(92) in sumber_url)=0 AND (sumber_url ~ '^https?://[^[:space:]]+$' OR sumber_url ~ '^/([^/[:space:]][^[:space:]]*)?$'))),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  kuota_total INTEGER CHECK (kuota_total BETWEEN 0 AND 100000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT spmb_information_date_order CHECK (tanggal_mulai IS NULL OR tanggal_selesai IS NULL OR tanggal_selesai >= tanggal_mulai),
  CONSTRAINT spmb_information_selection_order CHECK (tanggal_seleksi IS NULL OR tanggal_pengumuman IS NULL OR tanggal_pengumuman >= tanggal_seleksi),
  CONSTRAINT spmb_information_selection_after_start CHECK (tanggal_seleksi IS NULL OR tanggal_mulai IS NULL OR tanggal_seleksi >= tanggal_mulai),
  CONSTRAINT spmb_information_announcement_after_start CHECK (tanggal_pengumuman IS NULL OR tanggal_mulai IS NULL OR tanggal_pengumuman >= tanggal_mulai),
  CONSTRAINT spmb_information_published_source CHECK (jenis='statistik' OR status='draft' OR sumber_url IS NOT NULL),
  CONSTRAINT spmb_information_quota_kind CHECK (jenis='statistik' OR kuota_total IS NULL),
  CONSTRAINT spmb_information_statistics_identity CHECK ((jenis='statistik') = (id='00000000-0000-4000-8000-000000000012'::uuid))
);
CREATE UNIQUE INDEX spmb_information_one_statistics_idx ON public.spmb_information (jenis) WHERE jenis='statistik';
CREATE VIEW public.spmb_information_public WITH (security_invoker=true) AS SELECT id,jenis,judul,deskripsi,urutan,tanggal_mulai,tanggal_selesai,tanggal_seleksi,tanggal_pengumuman,ikon,tautan_url,status,kuota_total,created_at,updated_at FROM public.spmb_information WHERE status='published';
GRANT SELECT ON public.spmb_information_public TO anon, authenticated;
CREATE INDEX spmb_information_public_order_idx ON public.spmb_information (jenis,urutan,tanggal_mulai) WHERE status='published';
CREATE TRIGGER spmb_information_set_updated_at BEFORE UPDATE ON public.spmb_information FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
ALTER TABLE public.spmb_information ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.spmb_information TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.spmb_information TO authenticated;
CREATE POLICY spmb_information_public_read ON public.spmb_information FOR SELECT TO anon,authenticated USING (status='published');
CREATE POLICY spmb_information_admin_read ON public.spmb_information FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY spmb_information_admin_insert ON public.spmb_information FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY spmb_information_admin_update ON public.spmb_information FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY spmb_information_admin_delete ON public.spmb_information FOR DELETE TO authenticated USING (public.is_admin() AND jenis <> 'statistik');

INSERT INTO public.spmb_information(id,jenis,judul,status) VALUES ('00000000-0000-4000-8000-000000000012','statistik','Statistik Pendaftaran','published');

-- Counts only: no applicant identity is exposed, and existing ppdb RLS is unchanged.
-- ppdb has no admission-cycle column; these aggregate all stored applications.
CREATE FUNCTION public.get_spmb_statistics() RETURNS JSONB
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  WITH counts AS (
    SELECT count(*)::integer AS total, count(*) FILTER (WHERE status='diterima')::integer AS accepted FROM public.ppdb
  ), quota AS (
    SELECT kuota_total FROM public.spmb_information WHERE jenis='statistik' AND status='published'
  )
  SELECT jsonb_build_object('total_pendaftar',counts.total,'diterima',counts.accepted,
    'kuota_total',quota.kuota_total,'kuota_tersedia',CASE WHEN quota.kuota_total IS NULL THEN NULL ELSE greatest(0,quota.kuota_total-counts.accepted) END)
  FROM counts LEFT JOIN quota ON true;
$$;
REVOKE ALL ON FUNCTION public.get_spmb_statistics() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_spmb_statistics() TO anon, authenticated;
-- Preserve only content already present in spmbInfo, ppdbDokumen and SpmbPage.
-- NULL dates and NULL capacity remain unknown; no screenshot/example numbers are seeded.
INSERT INTO public.spmb_information(jenis,judul,deskripsi,urutan,tanggal_selesai,ikon,tautan_url,sumber_url,status)
SELECT jenis,judul,deskripsi,urutan,tanggal_selesai,ikon,tautan_url,sumber_url,status
FROM jsonb_to_recordset('[{"jenis":"jadwal","judul":"EASY","deskripsi":"Arsip pengumuman sekolah. Jadwal yang belum diumumkan menunggu konfirmasi panitia.","urutan":1,"tanggal_selesai":"2026-08-31","sumber_url":"https://smktelkom-pwt.sch.id/berita/spmb-smk-telkom-purwokerto-2027-2028-jalur-easy/","status":"published"},{"jenis":"jadwal","judul":"DIGITEST 1","deskripsi":"Arsip pengumuman sekolah. Jadwal yang belum diumumkan menunggu konfirmasi panitia.","urutan":2,"tanggal_selesai":null,"sumber_url":"https://smktelkom-pwt.sch.id/pengumuman/spmb-digitest-1-ta-2027-2028-smk-telkom-purwokerto-resmi-dibuka-saatnya-jadi-bagian-dari-nextgens-stematel/","status":"published"},{"jenis":"jadwal","judul":"One Day Service","deskripsi":"Jadwal dan ketentuan layanan belum tersedia. Hubungi panitia untuk konfirmasi.","urutan":3,"tanggal_selesai":null,"sumber_url":"/spmb","status":"published"},{"jenis":"timeline","judul":"Buat Akun","deskripsi":"Registrasi akun","urutan":1,"ikon":"account","tautan_url":"/spmb/daftar","sumber_url":"/spmb/daftar","status":"published"},{"jenis":"timeline","judul":"Pengisian Data","deskripsi":"Lengkapi identitas siswa","urutan":2,"ikon":"data","tautan_url":"/spmb/formulir","sumber_url":"/spmb/formulir","status":"published"},{"jenis":"timeline","judul":"Unggah Berkas","deskripsi":"Unggah PDF gabungan","urutan":3,"ikon":"upload","tautan_url":"/spmb/berkas","sumber_url":"/spmb/berkas","status":"published"},{"jenis":"timeline","judul":"Pilih Jurusan","deskripsi":"Tentukan pilihan kompetensi keahlian","urutan":4,"ikon":"program","tautan_url":"/jurusan","sumber_url":"/jurusan","status":"published"},{"jenis":"timeline","judul":"Seleksi","deskripsi":"Ikuti tahapan seleksi","urutan":5,"ikon":"selection","tautan_url":"/spmb/status","sumber_url":"/spmb/status","status":"published"},{"jenis":"timeline","judul":"Pengumuman","deskripsi":"Lihat hasil penerimaan","urutan":6,"ikon":"result","tautan_url":"/spmb/status","sumber_url":"/spmb/status","status":"published"},{"jenis":"timeline","judul":"Daftar Ulang","deskripsi":"Konfirmasi dan registrasi akhir","urutan":7,"ikon":"register","tautan_url":"/spmb/status","sumber_url":"/spmb/status","status":"published"},{"jenis":"skema","judul":"EASY","deskripsi":"Persiapkan pendaftaran lebih awal dan kenali keterampilan digital melalui Stematel Digital Class.","urutan":1,"ikon":"easy","tautan_url":"https://smktelkom-pwt.sch.id/berita/spmb-smk-telkom-purwokerto-2027-2028-jalur-easy/","sumber_url":"https://smktelkom-pwt.sch.id/berita/spmb-smk-telkom-purwokerto-2027-2028-jalur-easy/","status":"published"},{"jenis":"skema","judul":"DIGITEST","deskripsi":"Jalur penerimaan murid baru tahun ajaran 2027/2028. Lihat pengumuman sekolah untuk informasi selengkapnya.","urutan":2,"ikon":"digitest","tautan_url":"https://smktelkom-pwt.sch.id/pengumuman/spmb-digitest-1-ta-2027-2028-smk-telkom-purwokerto-resmi-dibuka-saatnya-jadi-bagian-dari-nextgens-stematel/","sumber_url":"https://smktelkom-pwt.sch.id/pengumuman/spmb-digitest-1-ta-2027-2028-smk-telkom-purwokerto-resmi-dibuka-saatnya-jadi-bagian-dari-nextgens-stematel/","status":"published"},{"jenis":"skema","judul":"One Day Service","deskripsi":"Jadwal dan ketentuan layanan belum tersedia. Hubungi panitia untuk konfirmasi.","urutan":3,"ikon":"service","tautan_url":"https://wa.me/6281229701800","sumber_url":"https://wa.me/6281229701800","status":"published"},{"jenis":"persyaratan","judul":"Pas Foto Terbaru (3x4 atau 4x6 Background Merah/Biru)","deskripsi":"Berkas digabung dalam satu PDF sesuai ketentuan portal.","urutan":1,"sumber_url":"/spmb/berkas","status":"published"},{"jenis":"persyaratan","judul":"Scan Dokumen Rapor Semester 1 - 5 (Digabung 1 PDF)","deskripsi":"Berkas digabung dalam satu PDF sesuai ketentuan portal.","urutan":2,"sumber_url":"/spmb/berkas","status":"published"},{"jenis":"persyaratan","judul":"Akta Kelahiran / Surat Kenal Lahir","deskripsi":"Berkas digabung dalam satu PDF sesuai ketentuan portal.","urutan":3,"sumber_url":"/spmb/berkas","status":"published"},{"jenis":"persyaratan","judul":"Kartu Keluarga (KK) Terbaru","deskripsi":"Berkas digabung dalam satu PDF sesuai ketentuan portal.","urutan":4,"sumber_url":"/spmb/berkas","status":"published"},{"jenis":"syarat","judul":"Identitas Calon Siswa","deskripsi":"Siapkan NISN, identitas diri, asal sekolah, dan kontak aktif untuk melengkapi formulir.","urutan":1,"sumber_url":"/spmb/formulir","status":"published"},{"jenis":"syarat","judul":"Data dan Nilai Rapor","deskripsi":"Isi data dengan benar dan lengkapi nilai rapor semester 1 sampai 5.","urutan":2,"sumber_url":"/spmb/formulir","status":"published"},{"jenis":"syarat","judul":"Ketentuan Seleksi","deskripsi":"Persyaratan kesehatan, jadwal tes, dan daftar ulang perlu dikonfirmasi kepada panitia.","urutan":3,"sumber_url":"/spmb/formulir","status":"published"}]'::jsonb) AS seed(jenis TEXT,judul TEXT,deskripsi TEXT,urutan INTEGER,tanggal_selesai DATE,ikon TEXT,tautan_url TEXT,sumber_url TEXT,status TEXT);
COMMIT;
