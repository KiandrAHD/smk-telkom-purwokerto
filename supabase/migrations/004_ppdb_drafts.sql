CREATE TABLE public.ppdb_drafts (
  auth_user_id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  biodata JSONB NOT NULL DEFAULT '{}'::jsonb,
  nilai JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT ppdb_drafts_biodata_check CHECK (jsonb_typeof(biodata) = 'object' AND octet_length(biodata::text) <= 16384),
  CONSTRAINT ppdb_drafts_nilai_check CHECK (jsonb_typeof(nilai) = 'object' AND octet_length(nilai::text) <= 8192)
);

ALTER TABLE public.ppdb_drafts ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ppdb_drafts TO authenticated;

CREATE POLICY ppdb_drafts_owner_select ON public.ppdb_drafts
  FOR SELECT TO authenticated USING (auth_user_id = (SELECT auth.uid()));
CREATE POLICY ppdb_drafts_owner_insert ON public.ppdb_drafts
  FOR INSERT TO authenticated WITH CHECK (auth_user_id = (SELECT auth.uid()));
CREATE POLICY ppdb_drafts_owner_update ON public.ppdb_drafts
  FOR UPDATE TO authenticated USING (auth_user_id = (SELECT auth.uid())) WITH CHECK (auth_user_id = (SELECT auth.uid()));
CREATE POLICY ppdb_drafts_owner_delete ON public.ppdb_drafts
  FOR DELETE TO authenticated USING (auth_user_id = (SELECT auth.uid()));
