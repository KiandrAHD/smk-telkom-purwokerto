BEGIN;
ALTER TABLE public.site_settings DROP CONSTRAINT site_settings_website_check;
ALTER TABLE public.site_settings ADD CONSTRAINT site_settings_website_check CHECK (
  length(website) <= 2048 AND website ~ '^https?://([A-Za-z0-9]([A-Za-z0-9.-]*[A-Za-z0-9])?|\[[0-9A-Fa-f:]+\])(:[0-9]{1,5})?([/?#][^[:space:]]*)?$'
);
ALTER TABLE public.site_settings DROP CONSTRAINT site_settings_logo_url_check;
ALTER TABLE public.site_settings ADD CONSTRAINT site_settings_logo_url_check CHECK (
  logo_url IS NULL OR (length(logo_url) <= 2048 AND logo_url ~ '^https://([A-Za-z0-9]([A-Za-z0-9.-]*[A-Za-z0-9])?|\[[0-9A-Fa-f:]+\])(:[0-9]{1,5})?([/?#][^[:space:]]*)?$')
);
COMMIT;
