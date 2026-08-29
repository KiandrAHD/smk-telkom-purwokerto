-- PPDB security hardening: owner document reads and one submission per account.
-- Migration 001 and 002 tetap dipertahankan.

-- User authenticated hanya dapat membaca object PPDB di folder miliknya.
-- Policy admin SELECT dari migration 001 tidak diubah.
DROP POLICY IF EXISTS ppdb_documents_owner_select ON storage.objects;
CREATE POLICY ppdb_documents_owner_select
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'ppdb-documents'
  AND (storage.foldername(name))[1] = 'submissions'
  AND (storage.foldername(name))[2] = (SELECT auth.uid()::text)
);

-- Record legacy dengan auth_user_id NULL tidak ikut terkena uniqueness.
CREATE UNIQUE INDEX IF NOT EXISTS ppdb_one_submission_per_auth_user_idx
  ON public.ppdb (auth_user_id)
  WHERE auth_user_id IS NOT NULL;
