-- SMK Telkom Purwokerto - Initial Supabase schema
-- Fase 1: database foundation, RLS, dan Storage buckets.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users (id) ON DELETE CASCADE,
  nama TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.berita (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judul TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  ringkasan TEXT,
  konten TEXT NOT NULL,
  gambar_url TEXT,
  penulis TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT berita_status_check CHECK (status IN ('draft', 'published'))
);

CREATE TABLE public.pengumuman (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judul TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  ringkasan TEXT,
  konten TEXT NOT NULL,
  gambar_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  tanggal TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT pengumuman_status_check CHECK (status IN ('draft', 'published'))
);

CREATE TABLE public.prestasi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judul TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  kategori TEXT,
  deskripsi TEXT NOT NULL,
  gambar_url TEXT,
  tingkat TEXT,
  tanggal DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.bkk (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  perusahaan TEXT NOT NULL,
  posisi TEXT NOT NULL,
  deskripsi TEXT,
  lokasi TEXT,
  tipe_pekerjaan TEXT,
  deadline DATE,
  status TEXT NOT NULL DEFAULT 'aktif',
  link_pendaftaran TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT bkk_status_check CHECK (status IN ('aktif', 'ditutup'))
);

CREATE TABLE public.ppdb (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_lengkap TEXT NOT NULL,
  nisn TEXT,
  asal_sekolah TEXT NOT NULL,
  tempat_lahir TEXT,
  tanggal_lahir DATE,
  jenis_kelamin TEXT,
  alamat TEXT,
  no_hp TEXT,
  email TEXT,
  pilihan_jurusan TEXT NOT NULL,
  dokumen_url TEXT,
  status TEXT NOT NULL DEFAULT 'menunggu',
  catatan_admin TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT ppdb_status_check CHECK (status IN ('menunggu', 'diproses', 'diterima', 'ditolak'))
);

CREATE INDEX berita_status_idx ON public.berita (status);
CREATE INDEX pengumuman_status_idx ON public.pengumuman (status);
CREATE INDEX prestasi_tanggal_idx ON public.prestasi (tanggal DESC);
CREATE INDEX bkk_status_idx ON public.bkk (status);
CREATE INDEX bkk_deadline_idx ON public.bkk (deadline);
CREATE INDEX ppdb_status_idx ON public.ppdb (status);
CREATE INDEX ppdb_created_at_idx ON public.ppdb (created_at DESC);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER berita_set_updated_at
BEFORE UPDATE ON public.berita
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER pengumuman_set_updated_at
BEFORE UPDATE ON public.pengumuman
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER prestasi_set_updated_at
BEFORE UPDATE ON public.prestasi
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER bkk_set_updated_at
BEFORE UPDATE ON public.bkk
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER ppdb_set_updated_at
BEFORE UPDATE ON public.ppdb
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- SECURITY DEFINER menghindari rekursi ketika policy memeriksa public.admins.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admins
    WHERE user_id = (SELECT auth.uid())
  );
$$;

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.berita ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengumuman ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prestasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bkk ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ppdb ENABLE ROW LEVEL SECURITY;

CREATE POLICY admins_read_own
ON public.admins FOR SELECT
TO authenticated
USING (user_id = (SELECT auth.uid()));

CREATE POLICY berita_public_read_published
ON public.berita FOR SELECT
TO anon, authenticated
USING (status = 'published');

CREATE POLICY berita_admin_select
ON public.berita FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY berita_admin_insert
ON public.berita FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY berita_admin_update
ON public.berita FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY berita_admin_delete
ON public.berita FOR DELETE
TO authenticated
USING (public.is_admin());

CREATE POLICY pengumuman_public_read_published
ON public.pengumuman FOR SELECT
TO anon, authenticated
USING (status = 'published');

CREATE POLICY pengumuman_admin_select
ON public.pengumuman FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY pengumuman_admin_insert
ON public.pengumuman FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY pengumuman_admin_update
ON public.pengumuman FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY pengumuman_admin_delete
ON public.pengumuman FOR DELETE
TO authenticated
USING (public.is_admin());

CREATE POLICY prestasi_public_read
ON public.prestasi FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY prestasi_admin_insert
ON public.prestasi FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY prestasi_admin_update
ON public.prestasi FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY prestasi_admin_delete
ON public.prestasi FOR DELETE
TO authenticated
USING (public.is_admin());

CREATE POLICY bkk_public_read_active
ON public.bkk FOR SELECT
TO anon, authenticated
USING (status = 'aktif');

CREATE POLICY bkk_admin_select
ON public.bkk FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY bkk_admin_insert
ON public.bkk FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY bkk_admin_update
ON public.bkk FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY bkk_admin_delete
ON public.bkk FOR DELETE
TO authenticated
USING (public.is_admin());

CREATE POLICY ppdb_public_insert
ON public.ppdb FOR INSERT
TO anon, authenticated
WITH CHECK (status = 'menunggu' AND catatan_admin IS NULL);

CREATE POLICY ppdb_admin_select
ON public.ppdb FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY ppdb_admin_update
ON public.ppdb FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'content-images',
    'content-images',
    true,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
  ),
  (
    'ppdb-documents',
    'ppdb-documents',
    false,
    10485760,
    ARRAY['application/pdf', 'image/jpeg', 'image/png']::text[]
  )
ON CONFLICT (id) DO UPDATE
SET
  name = EXCLUDED.name,
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY content_images_public_read
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'content-images');

CREATE POLICY content_images_admin_insert
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'content-images' AND public.is_admin());

CREATE POLICY content_images_admin_update
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'content-images' AND public.is_admin())
WITH CHECK (bucket_id = 'content-images' AND public.is_admin());

CREATE POLICY content_images_admin_delete
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'content-images' AND public.is_admin());

CREATE POLICY ppdb_documents_public_insert
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'ppdb-documents'
  AND name LIKE 'submissions/%'
);

CREATE POLICY ppdb_documents_admin_select
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'ppdb-documents' AND public.is_admin());

CREATE POLICY ppdb_documents_admin_update
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'ppdb-documents' AND public.is_admin())
WITH CHECK (bucket_id = 'ppdb-documents' AND public.is_admin());

CREATE POLICY ppdb_documents_admin_delete
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'ppdb-documents' AND public.is_admin());
