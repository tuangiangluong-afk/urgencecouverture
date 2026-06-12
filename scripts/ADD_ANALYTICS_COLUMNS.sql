-- Add Analytics columns to tenants table
alter table public.tenants 
add column if not exists ga_id text,
add column if not exists gtm_id text;

-- Add a comment (optional)
comment on column public.tenants.ga_id is 'Google Analytics ID (e.g. G-XXXXXX)';
comment on column public.tenants.gtm_id is 'Google Tag Manager ID (e.g. GTM-XXXXXX)';
