-- Optional Instagram post URL for achievement records.
ALTER TABLE public.prestasi
  ADD COLUMN IF NOT EXISTS instagram_url TEXT;

ALTER TABLE public.prestasi
  DROP CONSTRAINT IF EXISTS prestasi_instagram_url_check;

ALTER TABLE public.prestasi
  ADD CONSTRAINT prestasi_instagram_url_check CHECK (
    instagram_url IS NULL OR (
      instagram_url ~ '^https://([^/:]+\.)?instagram\.com(/|$)'
      AND instagram_url !~ '^https://[^/]*@'
      AND instagram_url !~ '^https://[^/:]+:[^@/]+@'
      AND instagram_url !~ '^https://[^/:]+:[0-9]+/'
    )
  );
