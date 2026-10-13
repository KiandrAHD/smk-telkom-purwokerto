-- School event dates/times are wall-clock values in Asia/Jakarta, never UTC dates.
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judul TEXT NOT NULL CHECK (char_length(btrim(judul)) BETWEEN 1 AND 180),
  ringkasan TEXT NOT NULL DEFAULT '' CHECK (char_length(ringkasan) <= 500),
  deskripsi TEXT NOT NULL DEFAULT '' CHECK (char_length(deskripsi) <= 20000),
  kategori TEXT NOT NULL DEFAULT 'kegiatan' CHECK (kategori IN ('kegiatan', 'akademik', 'lomba', 'karier', 'lainnya')),
  tanggal_mulai DATE NOT NULL CHECK (tanggal_mulai BETWEEN DATE '0100-01-01' AND DATE '9999-12-31'),
  waktu_mulai TIME(0),
  tanggal_selesai DATE CHECK (tanggal_selesai BETWEEN DATE '0100-01-01' AND DATE '9999-12-31'),
  waktu_selesai TIME(0),
  lokasi TEXT NOT NULL DEFAULT '' CHECK (char_length(lokasi) <= 240),
  penyelenggara TEXT NOT NULL DEFAULT '' CHECK (char_length(penyelenggara) <= 160),
  gambar_url TEXT CHECK (gambar_url IS NULL OR (char_length(gambar_url) <= 2048 AND gambar_url ~ '^https?://[^[:space:]]+$')),
  link_informasi TEXT CHECK (link_informasi IS NULL OR (char_length(link_informasi) <= 2048 AND link_informasi ~ '^https?://[^[:space:]]+$')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT events_date_order CHECK (tanggal_selesai IS NULL OR tanggal_selesai >= tanggal_mulai),
  CONSTRAINT events_time_order CHECK (
    coalesce(tanggal_selesai, tanggal_mulai) > tanggal_mulai OR
    waktu_mulai IS NULL OR waktu_selesai IS NULL OR waktu_selesai > waktu_mulai
  ),
  CONSTRAINT events_time_range CHECK (
    (waktu_mulai IS NULL OR waktu_mulai < TIME '24:00') AND
    (waktu_selesai IS NULL OR waktu_selesai < TIME '24:00')
  )
);
CREATE INDEX events_public_date_idx ON public.events (tanggal_mulai, waktu_mulai) WHERE status = 'published';
CREATE INDEX events_end_date_idx ON public.events ((coalesce(tanggal_selesai, tanggal_mulai)));
CREATE TRIGGER events_set_updated_at BEFORE UPDATE ON public.events
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.events TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.events TO authenticated;
CREATE POLICY events_public_read ON public.events FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY events_admin_read ON public.events FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY events_admin_insert ON public.events FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY events_admin_update ON public.events FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY events_admin_delete ON public.events FOR DELETE TO authenticated USING (public.is_admin());
