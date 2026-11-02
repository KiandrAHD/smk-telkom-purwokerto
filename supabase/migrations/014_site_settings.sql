BEGIN;
CREATE TABLE public.site_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  school_name text NOT NULL CHECK (length(trim(school_name)) BETWEEN 2 AND 150),
  npsn text NOT NULL CHECK (npsn ~ '^[0-9]{8}$'),
  address text NOT NULL CHECK (length(trim(address)) BETWEEN 5 AND 1000),
  phone text NOT NULL CHECK (phone ~ '^[+0-9() .-]{7,30}$' AND length(regexp_replace(phone, '[^0-9]', '', 'g')) BETWEEN 7 AND 15),
  email text NOT NULL CHECK (length(email) <= 254 AND email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  website text NOT NULL CHECK (length(website) <= 2048 AND website ~ '^https?://[^[:space:]/]+'),
  logo_url text CHECK (logo_url IS NULL OR (length(logo_url) <= 2048 AND logo_url ~ '^https://[^[:space:]/]+')),
  academic_year text NOT NULL CHECK (CASE WHEN academic_year ~ '^[0-9]{4}/[0-9]{4}$' THEN right(academic_year,4)::integer = left(academic_year,4)::integer + 1 AND left(academic_year,4)::integer BETWEEN 2020 AND 2100 ELSE false END),
  spmb_open boolean NOT NULL DEFAULT true,
  news_page_size integer NOT NULL CHECK (news_page_size BETWEEN 1 AND 50),
  revision bigint NOT NULL DEFAULT 1,
  updated_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO public.site_settings(school_name,npsn,address,phone,email,website,academic_year,news_page_size)
VALUES ('SMK Telkom Purwokerto','20303020','Jl. DI Panjaitan No.128, Karangreja, Purwokerto Kidul, Kec. Purwokerto Sel., Kabupaten Banyumas, Jawa Tengah 53141','(0281) 632138','info@smktelkom-pwt.sch.id','https://smk-telkom-purwokerto.vercel.app/','2027/2028',5);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.site_settings FROM anon, authenticated;
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT UPDATE (school_name,npsn,address,phone,email,website,logo_url,academic_year,spmb_open,news_page_size) ON public.site_settings TO authenticated;
CREATE POLICY settings_public_read ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY settings_admin_update ON public.site_settings FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE FUNCTION public.site_settings_revision() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$
BEGIN NEW.revision := OLD.revision + 1; NEW.updated_at := now(); RETURN NEW; END; $$;
CREATE TRIGGER settings_revision BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.site_settings_revision();
CREATE FUNCTION public.guard_spmb_open() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM public.site_settings WHERE id AND spmb_open) THEN
   RAISE EXCEPTION 'Pendaftaran SPMB sedang ditutup.' USING ERRCODE='23514';
 END IF;
 RETURN NEW;
END; $$;
CREATE TRIGGER ppdb_spmb_open BEFORE INSERT ON public.ppdb FOR EACH ROW EXECUTE FUNCTION public.guard_spmb_open();
COMMIT;
