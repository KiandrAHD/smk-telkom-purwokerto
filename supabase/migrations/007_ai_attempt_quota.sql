-- Unit: provider attempts per feature per UTC day, not tokens or exact cost.
CREATE TABLE public.ai_daily_attempts (
  feature text NOT NULL CHECK (feature IN ('stela', 'nexttel')),
  day date NOT NULL,
  attempts integer NOT NULL CHECK (attempts > 0),
  PRIMARY KEY (feature, day)
);
ALTER TABLE public.ai_daily_attempts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.ai_daily_attempts FROM PUBLIC, anon, authenticated;

CREATE FUNCTION public.reserve_ai_attempt(p_feature text, p_limit integer)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE reserved integer;
BEGIN
  IF p_feature NOT IN ('stela', 'nexttel') OR p_feature IS NULL
    OR p_limit IS NULL OR p_limit < 1 OR p_limit > 100000 THEN
    RAISE EXCEPTION 'Invalid quota configuration';
  END IF;
  INSERT INTO public.ai_daily_attempts AS quota (feature, day, attempts)
  VALUES (p_feature, (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::date, 1)
  ON CONFLICT (feature, day) DO UPDATE SET attempts = quota.attempts + 1
    WHERE quota.attempts < p_limit
  RETURNING attempts INTO reserved;
  RETURN reserved IS NOT NULL;
END;
$$;
REVOKE ALL ON FUNCTION public.reserve_ai_attempt(text, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_ai_attempt(text, integer) TO service_role;
