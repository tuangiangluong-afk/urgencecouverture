-- 1. SEO Patterns (Templates)
create table if not exists public.seo_patterns (
  id uuid default gen_random_uuid() primary key,
  tenant_id text references public.tenants(id) on delete cascade,
  name text not null,
  slug_pattern text not null,
  title_template text not null,
  meta_description_template text, 
  content_structure jsonb default '[]'::jsonb,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. SEO Landing Pages (Generated Content)
create table if not exists public.seo_landing_pages (
  id uuid default gen_random_uuid() primary key,
  tenant_id text references public.tenants(id) on delete cascade not null,
  pattern_id uuid references public.seo_patterns(id) on delete set null,
  slug text not null,
  url_path text not null,
  meta_title text,
  meta_description text,
  h1_title text,
  content_json jsonb,
  target_city text,
  target_service text,
  status text default 'published',
  last_generated_at timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(tenant_id, slug)
);

-- RLS
alter table public.seo_patterns enable row level security;
alter table public.seo_landing_pages enable row level security;

-- Policies (Safe / Idempotent manner)
do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'seo_patterns' and policyname = 'Public read patterns') then
    create policy "Public read patterns" on public.seo_patterns for select using (true);
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'seo_landing_pages' and policyname = 'Public read pages') then
    create policy "Public read pages" on public.seo_landing_pages for select using (true);
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'seo_patterns' and policyname = 'Admin write patterns') then
    create policy "Admin write patterns" on public.seo_patterns for all using (auth.role() = 'authenticated');
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'seo_landing_pages' and policyname = 'Admin write pages') then
    create policy "Admin write pages" on public.seo_landing_pages for all using (auth.role() = 'authenticated');
  end if;
end
$$;
