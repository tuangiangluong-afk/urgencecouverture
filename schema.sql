-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. TENANTS (Sites Configuration)
create table public.tenants (
  id uuid not null default uuid_generate_v4(),
  slug text not null, -- e.g. 'neuilly-sur-seine'
  name text not null, -- e.g. 'Expert Borne Neuilly'
  domain text not null, -- e.g. 'expertbornerechart-neuilly.fr'
  phone_number text,
  email text,
  primary_color text,
  gtm_id text,
  ga_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint tenants_pkey primary key (id),
  constraint tenants_slug_key unique (slug)
);

-- 2. LEADS (Devis)
create table public.leads (
  id uuid not null default uuid_generate_v4(),
  tenant_id text not null, -- slug of the site
  status text not null default 'new', -- new, contacted, converted, lost
  type text not null, -- installation, maintenance, audit
  name text not null,
  email text not null,
  phone text not null,
  company text,
  message text,
  city text,
  postal_code text,
  housing_type text, -- maison, copro, entreprise
  niche text, -- e.g. pmr, solaire, toiture
  arbitrage_status text, -- e.g. direct_partner, vite_un_devis
  score integer, -- lead score
  region text,
  department text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint leads_pkey primary key (id)
);

-- 3. REVIEWS (Avis Clients)
create table public.reviews (
  id uuid not null default uuid_generate_v4(),
  tenant_id text not null,
  author_name text not null,
  rating integer not null default 5,
  content text not null,
  source text not null default 'Google', -- Google, PagesJaunes, Verified
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint reviews_pkey primary key (id)
);

-- 4. CONTENT_PAGES (CMS Overrides)
create table public.content_pages (
  id uuid not null default uuid_generate_v4(),
  tenant_id text not null,
  path text not null, -- e.g. '/' or '/solutions/copro'
  section text not null, -- e.g. 'hero'
  key text not null, -- e.g. 'title'
  value text,
  type text default 'text', -- text, image, rich-text
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint content_pages_pkey primary key (id),
  constraint content_pages_unique_key unique (tenant_id, path, section, key)
);

-- ROW LEVEL SECURITY (RLS)
-- For simplicity in this V2, we allow Anon read/write if you want public submission for leads
-- But ideally, restrict Write to Service Role, and Read to Anon/Auth.

alter table public.tenants enable row level security;
alter table public.leads enable row level security;
alter table public.reviews enable row level security;
alter table public.content_pages enable row level security;

-- POLICIES (Simplistic for Prod: Adjust as needed)
-- 1. Public can INSERT leads (Contact Forms)
create policy "Enable insert for everyone" on public.leads for insert with check (true);
-- 2. Admins can do everything (Using Service Role or Auth)
create policy "Enable all for authenticated users" on public.leads for all using (auth.role() = 'authenticated');

-- Reviews: Public Read, Auth Write
create policy "Enable read for everyone" on public.reviews for select using (true);
create policy "Enable all for authenticated users" on public.reviews for all using (auth.role() = 'authenticated');

-- Content: Public Read, Auth Write
create policy "Enable read for everyone" on public.content_pages for select using (true);
create policy "Enable all for authenticated users" on public.content_pages for all using (auth.role() = 'authenticated');

-- Tenants: Public Read, Auth Write
create policy "Enable read for everyone" on public.tenants for select using (true);
create policy "Enable all for authenticated users" on public.tenants for all using (auth.role() = 'authenticated');
