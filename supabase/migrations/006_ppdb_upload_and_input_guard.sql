-- One retained upload per PPDB account. Existing document paths remain readable.
UPDATE storage.buckets
SET allowed_mime_types = ARRAY['application/pdf']::text[]
WHERE id = 'ppdb-documents';

DROP POLICY IF EXISTS ppdb_documents_authenticated_insert_own ON storage.objects;
CREATE POLICY ppdb_documents_authenticated_insert_own
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'ppdb-documents'
  AND name = 'submissions/' || (SELECT auth.uid()::text) || '/document.pdf'
);

-- Allow the owner to remove a failed submission's temporary upload, never a
-- document already referenced by a submitted application.
DROP POLICY IF EXISTS ppdb_documents_owner_delete_unsubmitted ON storage.objects;
CREATE POLICY ppdb_documents_owner_delete_unsubmitted
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'ppdb-documents'
  AND (storage.foldername(name))[1] = 'submissions'
  AND (storage.foldername(name))[2] = (SELECT auth.uid()::text)
  AND NOT EXISTS (
    SELECT 1 FROM public.ppdb AS application
    WHERE application.auth_user_id = (SELECT auth.uid())
      AND application.dokumen_url = storage.objects.name
  )
);

-- The browser is not a validation boundary. Account-owned submissions must
-- contain the current wizard fields; ownerless admin/legacy records may omit them.
CREATE OR REPLACE FUNCTION public.validate_ppdb_insert()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  grade_count integer;
BEGIN
  IF NEW.auth_user_id IS NOT NULL AND (
    nullif(btrim(NEW.nisn), '') IS NULL
    OR nullif(btrim(NEW.nik), '') IS NULL
    OR nullif(btrim(NEW.agama), '') IS NULL
    OR nullif(btrim(NEW.tahun_lulus), '') IS NULL
    OR nullif(btrim(NEW.tempat_lahir), '') IS NULL
    OR NEW.tanggal_lahir IS NULL
    OR nullif(btrim(NEW.jenis_kelamin), '') IS NULL
    OR nullif(btrim(NEW.alamat), '') IS NULL
    OR nullif(btrim(NEW.no_hp), '') IS NULL
    OR nullif(btrim(NEW.email), '') IS NULL
    OR nullif(btrim(NEW.dokumen_url), '') IS NULL
    OR NEW.nilai_rapor IS NULL
  ) THEN
    RAISE EXCEPTION 'Lengkapi seluruh biodata, nilai, dan dokumen PPDB' USING ERRCODE = '23514';
  END IF;

  IF char_length(btrim(NEW.nama_lengkap)) NOT BETWEEN 1 AND 150
    OR char_length(btrim(NEW.asal_sekolah)) NOT BETWEEN 1 AND 150
    OR char_length(btrim(NEW.pilihan_jurusan)) NOT BETWEEN 1 AND 150
    OR char_length(coalesce(NEW.tempat_lahir, '')) > 100
    OR char_length(coalesce(NEW.alamat, '')) > 1000
    OR char_length(coalesce(NEW.email, '')) > 254 THEN
    RAISE EXCEPTION 'Panjang teks formulir PPDB tidak valid' USING ERRCODE = '23514';
  END IF;

  IF NEW.nisn IS NOT NULL AND NEW.nisn <> '' AND NEW.nisn !~ '^[0-9]{10}$' THEN
    RAISE EXCEPTION 'NISN harus 10 digit' USING ERRCODE = '23514';
  END IF;
  IF NEW.nik IS NOT NULL AND NEW.nik <> '' AND NEW.nik !~ '^[0-9]{16}$' THEN
    RAISE EXCEPTION 'NIK harus 16 digit' USING ERRCODE = '23514';
  END IF;
  IF NEW.no_hp IS NOT NULL AND NEW.no_hp <> '' AND (
    char_length(NEW.no_hp) > 24
    OR NEW.no_hp !~ '^[0-9+() -]+$'
    OR char_length(regexp_replace(NEW.no_hp, '[^0-9]', '', 'g')) NOT BETWEEN 8 AND 15
  ) THEN
    RAISE EXCEPTION 'Nomor telepon PPDB tidak valid' USING ERRCODE = '23514';
  END IF;
  IF NEW.tanggal_lahir > CURRENT_DATE
    OR (NEW.jenis_kelamin IS NOT NULL AND NEW.jenis_kelamin NOT IN ('', 'Laki-laki', 'Perempuan'))
    OR (NEW.tahun_lulus IS NOT NULL AND NEW.tahun_lulus <> '' AND NEW.tahun_lulus !~ '^[0-9]{4}$') THEN
    RAISE EXCEPTION 'Biodata PPDB tidak valid' USING ERRCODE = '23514';
  END IF;

  IF NEW.nilai_rapor IS NOT NULL THEN
    IF jsonb_typeof(NEW.nilai_rapor) <> 'object'
      OR octet_length(NEW.nilai_rapor::text) > 8192 THEN
      RAISE EXCEPTION 'Format nilai rapor tidak valid' USING ERRCODE = '23514';
    END IF;
    SELECT count(*) INTO grade_count FROM jsonb_each(NEW.nilai_rapor);
    IF grade_count <> 25 OR EXISTS (
      SELECT 1 FROM jsonb_each(NEW.nilai_rapor) AS grade(key, value)
      WHERE char_length(grade.key) > 70
        OR CASE WHEN jsonb_typeof(grade.value) = 'number'
          THEN (grade.value::text)::numeric NOT BETWEEN 0 AND 100
          ELSE true
        END
    ) THEN
      RAISE EXCEPTION 'Nilai rapor harus berisi 25 angka dari 0 sampai 100' USING ERRCODE = '23514';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS ppdb_validate_insert ON public.ppdb;
CREATE TRIGGER ppdb_validate_insert
BEFORE INSERT ON public.ppdb
FOR EACH ROW EXECUTE FUNCTION public.validate_ppdb_insert();

-- The client must not point an application at another account's file or
-- impersonate a different contact email when inserting via the REST API.
DROP POLICY IF EXISTS ppdb_authenticated_insert_own ON public.ppdb;
CREATE POLICY ppdb_authenticated_insert_own
ON public.ppdb FOR INSERT TO authenticated
WITH CHECK (
  auth_user_id = (SELECT auth.uid())
  AND email = (SELECT auth.jwt() ->> 'email')
  AND (dokumen_url IS NULL OR dokumen_url = 'submissions/' || (SELECT auth.uid()::text) || '/document.pdf')
  AND status = 'menunggu'
  AND catatan_admin IS NULL
);
