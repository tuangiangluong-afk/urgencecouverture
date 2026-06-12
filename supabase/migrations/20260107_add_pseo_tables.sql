-- 1. SEO Patterns (Templates)
-- Defines the structure for generating pages. Can be Global (for everyone) or Tenant-specific.
create table public.seo_patterns (
  id uuid default gen_random_uuid() primary key,
  tenant_id text references public.tenants(id) on delete cascade, -- Null = Global Pattern
  name text not null, -- e.g. "Taxi Gare Standard"
  slug_pattern text not null, -- e.g. "taxi-{{city_slug}}-gare"
  title_template text not null, -- e.g. "Taxi {{city}} Gare - Réservation Immédiate"
  meta_description_template text, 
  content_structure jsonb default '[]'::jsonb, -- Array of sections/blocks
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. SEO Landing Pages (Generated Content)
-- The actual pages served to users.
create table public.seo_landing_pages (
  id uuid default gen_random_uuid() primary key,
  tenant_id text references public.tenants(id) on delete cascade not null,
  pattern_id uuid references public.seo_patterns(id) on delete set null,
  
  -- URL & SEO
  slug text not null, -- e.g. "taxi-aix-en-provence-gare"
  url_path text not null, -- Full relative path e.g. "/taxi-aix-en-provence-gare"
  meta_title text,
  meta_description text,
  
  -- Content
  h1_title text,
  content_json jsonb, -- The ready-to-render content
  
  -- Metadata
  target_city text, -- e.g. "Aix-en-Provence"
  target_service text, -- e.g. "Taxi Gare"
  
  status text default 'published', -- 'published', 'draft', 'archived'
  last_generated_at timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Uniqueness: A tenant cannot have two pages with the same slug
  unique(tenant_id, slug)
);

-- RLS
alter table public.seo_patterns enable row level security;
alter table public.seo_landing_pages enable row level security;

-- Policies
-- Public Read
create policy "Public read patterns" on public.seo_patterns for select using (true);
create policy "Public read pages" on public.seo_landing_pages for select using (true);

-- Admin Write (Simplified for dev, check auth in prod)
create policy "Admin write patterns" on public.seo_patterns for all using (auth.role() = 'authenticated');
create policy "Admin write pages" on public.seo_landing_pages for all using (auth.role() = 'authenticated');
