-- Canonical contract: frontend/src/data/ppdbFormOptions.js and ppdbSubmission.js.
-- Values intentionally duplicated across JS/SQL; uji-ppdb-contract.mjs detects drift.
-- Existing records are not rewritten; status-only admin updates remain supported.
CREATE FUNCTION public.validate_ppdb_canonical_document()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  jurusan constant text[] := ARRAY[
    'Rekayasa Perangkat Lunak (RPL)',
    'Pengembangan Game (PG)',
    'Teknik Komputer dan Jaringan (TKJ)',
    'Teknik Jaringan Akses Telekomunikasi (TJAT)'
  ];
  agama constant text[] := ARRAY['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'];
  tahun_lulus constant text[] := ARRAY['2027', '2026', '2025', '2024'];
  mata_pelajaran constant text[] := ARRAY['Bahasa Indonesia', 'Matematika', 'Ilmu Pengetahuan Alam', 'Bahasa Inggris', 'Informatika / TIK'];
  semester constant text[] := ARRAY['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5'];
  expected_keys text[];
  submitted_keys text[];
BEGIN
  IF NEW.auth_user_id IS NULL THEN RETURN NEW; END IF;
  IF NEW.pilihan_jurusan IS NULL OR NOT (NEW.pilihan_jurusan = ANY(jurusan))
    OR NEW.agama IS NULL OR NOT (NEW.agama = ANY(agama))
    OR NEW.tahun_lulus IS NULL OR NOT (NEW.tahun_lulus = ANY(tahun_lulus)) THEN
    RAISE EXCEPTION 'Pilihan jurusan, agama, atau tahun lulus PPDB tidak valid' USING ERRCODE = '23514';
  END IF;

  IF NEW.nilai_rapor IS NULL OR jsonb_typeof(NEW.nilai_rapor) <> 'object' THEN
    RAISE EXCEPTION 'Format nilai rapor tidak valid' USING ERRCODE = '23514';
  END IF;
  SELECT array_agg(subject || '|' || term ORDER BY subject || '|' || term)
    INTO expected_keys FROM unnest(mata_pelajaran) AS subject CROSS JOIN unnest(semester) AS term;
  SELECT array_agg(key ORDER BY key) INTO submitted_keys FROM jsonb_object_keys(NEW.nilai_rapor) AS key;
  IF submitted_keys IS DISTINCT FROM expected_keys THEN
    RAISE EXCEPTION 'Kunci nilai rapor harus sesuai 5 mata pelajaran dan 5 semester' USING ERRCODE = '23514';
  END IF;

  IF NEW.dokumen_url IS DISTINCT FROM 'submissions/' || NEW.auth_user_id::text || '/document.pdf' THEN
    RAISE EXCEPTION 'Path dokumen PPDB tidak sesuai pemilik' USING ERRCODE = '23514';
  END IF;
  -- Share the finalization/deletion lock with the owner's Storage policy.
  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(NEW.dokumen_url, 0));
  -- Read-only Storage metadata lookup. The shared row lock keeps the object
  -- present until this submission transaction finishes. Storage stays private.
  PERFORM 1 FROM storage.objects
    WHERE bucket_id = 'ppdb-documents' AND name = NEW.dokumen_url
      AND owner_id = NEW.auth_user_id::text
    FOR SHARE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Dokumen PPDB belum diunggah atau bukan milik akun ini' USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.validate_ppdb_canonical_document() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER ppdb_validate_canonical_document
BEFORE INSERT OR UPDATE OF auth_user_id, pilihan_jurusan, agama, tahun_lulus, nilai_rapor, dokumen_url
ON public.ppdb FOR EACH ROW EXECUTE FUNCTION public.validate_ppdb_canonical_document();

-- Reuse migration 006's type/range/biodata checks for relevant updates too.
-- Ordinary status/catatan_admin updates do not revalidate legacy applications.
CREATE TRIGGER ppdb_validate_fields_update
BEFORE UPDATE OF auth_user_id, nama_lengkap, nisn, nik, agama, asal_sekolah,
  tahun_lulus, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, no_hp, email,
  pilihan_jurusan, nilai_rapor, dokumen_url
ON public.ppdb FOR EACH ROW EXECUTE FUNCTION public.validate_ppdb_insert();

-- A DELETE can begin before submission commit and wait on the object lock.
-- VOLATILE runs the existence query with a fresh snapshot AFTER the shared
-- advisory lock is acquired, instead of trusting the outer DELETE snapshot.
CREATE FUNCTION public.ppdb_document_deletable(document_path text)
RETURNS boolean
LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = ''
AS $$
DECLARE user_id uuid := auth.uid();
BEGIN
  IF user_id IS NULL OR document_path IS DISTINCT FROM 'submissions/' || user_id::text || '/document.pdf' THEN
    RETURN false;
  END IF;
  -- PostgREST uses READ COMMITTED. Other isolation levels cannot refresh this
  -- snapshot after waiting, so owner cleanup fails closed in those sessions.
  IF pg_catalog.current_setting('transaction_isolation') <> 'read committed' THEN RETURN false; END IF;
  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(document_path, 0));
  RETURN NOT EXISTS (
    SELECT 1 FROM public.ppdb
    WHERE auth_user_id = user_id AND dokumen_url = document_path
  );
END;
$$;
REVOKE ALL ON FUNCTION public.ppdb_document_deletable(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.ppdb_document_deletable(text) TO authenticated;

-- Keep admin policies unchanged. Only the owner's failed-upload cleanup is
-- coordinated with submission finalization; the bucket remains private.
DROP POLICY ppdb_documents_owner_delete_unsubmitted ON storage.objects;
CREATE POLICY ppdb_documents_owner_delete_unsubmitted
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'ppdb-documents'
  AND public.ppdb_document_deletable(name)
);
