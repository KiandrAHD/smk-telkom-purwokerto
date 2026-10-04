-- Migration 009: Visitor counter
-- Tracks daily unique visitors using hashed anonymous identifiers.
-- No raw IP addresses are stored permanently.

CREATE TABLE IF NOT EXISTS public.site_visitors (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  visited_date date NOT NULL DEFAULT (now() AT TIME ZONE 'Asia/Jakarta')::date,
  visitor_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_site_visitors_date_hash
  ON public.site_visitors (visited_date, visitor_hash);

CREATE INDEX IF NOT EXISTS idx_site_visitors_date
  ON public.site_visitors (visited_date);

ALTER TABLE public.site_visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny all direct access to site_visitors"
  ON public.site_visitors
  FOR ALL
  USING (false);

CREATE OR REPLACE FUNCTION public.record_visit(p_visitor_hash text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  today date := (now() AT TIME ZONE 'Asia/Jakarta')::date;
BEGIN
  IF p_visitor_hash IS NULL OR length(p_visitor_hash) < 8 OR length(p_visitor_hash) > 128 THEN
    RETURN;
  END IF;
  INSERT INTO public.site_visitors (visited_date, visitor_hash)
  VALUES (today, p_visitor_hash)
  ON CONFLICT (visited_date, visitor_hash) DO NOTHING;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_visitor_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  today date := (now() AT TIME ZONE 'Asia/Jakarta')::date;
  first_of_month date := date_trunc('month', today)::date;
  first_of_year date := date_trunc('year', today)::date;
  daily_count bigint;
  monthly_count bigint;
  yearly_count bigint;
BEGIN
  SELECT count(*) INTO daily_count
  FROM public.site_visitors
  WHERE visited_date = today;

  SELECT count(*) INTO monthly_count
  FROM public.site_visitors
  WHERE visited_date >= first_of_month;

  SELECT count(*) INTO yearly_count
  FROM public.site_visitors
  WHERE visited_date >= first_of_year;

  RETURN json_build_object(
    'daily', daily_count,
    'monthly', monthly_count,
    'yearly', yearly_count
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.record_visit(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_visitor_stats() TO anon, authenticated;
