-- SMK Telkom Purwokerto - PPDB identity ownership
-- Menambahkan pemilik submission tanpa mengubah migration awal.

ALTER TABLE public.ppdb
  ADD COLUMN IF NOT EXISTS auth_user_id UUID;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'ppdb_auth_user_id_fkey'
      AND conrelid = 'public.ppdb'::regclass
  ) THEN
    ALTER TABLE public.ppdb
      ADD CONSTRAINT ppdb_auth_user_id_fkey
      FOREIGN KEY (auth_user_id)
      REFERENCES auth.users (id)
      ON DELETE RESTRICT;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS ppdb_auth_user_id_idx
  ON public.ppdb (auth_user_id);

-- Submission baru harus berasal dari user authenticated dan owner-nya harus
-- sama dengan user pada JWT. Record lama dengan owner NULL tetap legacy.
DROP POLICY IF EXISTS ppdb_public_insert ON public.ppdb;
DROP POLICY IF EXISTS ppdb_authenticated_insert_own ON public.ppdb;
DROP POLICY IF EXISTS ppdb_user_select_own ON public.ppdb;
CREATE POLICY ppdb_authenticated_insert_own
ON public.ppdb FOR INSERT
TO authenticated
WITH CHECK (
  auth_user_id = (SELECT auth.uid())
  AND status = 'menunggu'
  AND catatan_admin IS NULL
);

CREATE POLICY ppdb_user_select_own
ON public.ppdb FOR SELECT
TO authenticated
USING (auth_user_id = (SELECT auth.uid()));

-- Bucket tetap private. Upload anonim lama dicabut; user hanya boleh upload
-- ke folder submissions/{auth.uid()}/{ppdb.id}/...
DROP POLICY IF EXISTS ppdb_documents_public_insert ON storage.objects;
DROP POLICY IF EXISTS ppdb_documents_authenticated_insert_own ON storage.objects;
CREATE POLICY ppdb_documents_authenticated_insert_own
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'ppdb-documents'
  AND (storage.foldername(name))[1] = 'submissions'
  AND (storage.foldername(name))[2] = (SELECT auth.uid()::text)
);
