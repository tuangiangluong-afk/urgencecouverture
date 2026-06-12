-- TaxiCMS Database Schema
-- Multi-tenant architecture for managing multiple taxi domains from a single back-office.

-- 1. Tenants (Domains)
create table public.tenants (
  id text primary key, -- e.g. 'taxiaix'
  name text not null, -- e.g. 'Taxi Aix-en-Provence'
  domain text not null unique, -- e.g. 'taxiaix.fr'
  phone_number text,
  email text,
  primary_color text default '#facc15', -- Tailwind yellow-400
  gtm_id text, -- Google Tag Manager ID
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Content Pages (CMS)
-- Stores content for specific paths sections.
-- Access pattern: select * from content_pages where tenant_id = 'taxiaix' and path = '/'
create table public.content_pages (
  id uuid default gen_random_uuid() primary key,
  tenant_id text references public.tenants(id) on delete cascade not null,
  path text not null, -- e.g. '/', '/transport-medical'
  section text not null, -- e.g. 'hero'
  key text not null, -- e.g. 'title', 'subtitle', 'bg_image'
  value text, -- The actual content
  type text default 'text', -- 'text', 'rich_text', 'image', 'url'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(tenant_id, path, section, key)
);

-- 3. Vehicles (Fleet)
create table public.vehicles (
  id uuid default gen_random_uuid() primary key,
  tenant_id text references public.tenants(id) on delete cascade not null,
  name text not null, -- e.g. 'Berline Confort'
  description text, -- Spintax supported
  capacity_passengers integer,
  capacity_luggage integer,
  image_url text, -- Storage path
  price_class text, -- 'eco', 'premium', 'van'
  display_order integer default 0
);

-- 4. FAQs
create table public.faqs (
  id uuid default gen_random_uuid() primary key,
  tenant_id text references public.tenants(id) on delete cascade not null,
  question text not null,
  answer text not null,
  category text default 'general', -- 'medical', 'airport', 'booking'
  display_order integer default 0
);

-- 5. POIs (Programmatic SEO)
-- Source for /guides/[slug] pages
create table public.pois(
  id uuid default gen_random_uuid() primary key,
  tenant_id text references public.tenants(id) on delete cascade not null,
  name text not null, -- e.g. 'Hôtel Renaissance'
  slug text not null, -- e.g. 'hotel-renaissance'
  type text not null, -- 'hotel', 'nightlife', 'monument'
  
  -- Spintaxable Content Overrides (if null, use default spintax)
  content_intro text,
  content_bus_pain text,
  content_taxi_solution text,
  
  parking_difficulty text, -- 'Facile', 'Difficile', 'Impossible'
  unique(tenant_id, slug)
);

-- 6. Spintax Library (Advanced)
-- Allows editing the core templates used by the algorithm
create table public.spintax_templates (
  id uuid default gen_random_uuid() primary key,
  type text not null, -- e.g. 'hero_title', 'guide_bus_pain'
  content_array text[] not null, -- Array of variations
  description text, -- For admin context
  unique(type)
);

-- RLS Policies (Security)
-- For now, enable read for everyone (public site), write for authenticated admins only.
alter table public.tenants enable row level security;
alter table public.content_pages enable row level security;
alter table public.vehicles enable row level security;
alter table public.faqs enable row level security;
alter table public.pois enable row level security;

-- Public Read Policy
create policy "Allow public read access" on public.tenants for select using (true);
create policy "Allow public read access" on public.content_pages for select using (true);
create policy "Allow public read access" on public.vehicles for select using (true);
create policy "Allow public read access" on public.faqs for select using (true);
create policy "Allow public read access" on public.pois for select using (true);

-- Admin Write Policy (Simplified for demo, assumes authenticated user is admin)
-- In production, check for specific admin role or email.
create policy "Enable write for admins" on public.tenants for all using (auth.role() = 'authenticated');
create policy "Enable write for admins" on public.content_pages for all using (auth.role() = 'authenticated');
create policy "Enable write for admins" on public.vehicles for all using (auth.role() = 'authenticated');
create policy "Enable write for admins" on public.faqs for all using (auth.role() = 'authenticated');
create policy "Enable write for admins" on public.pois for all using (auth.role() = 'authenticated');
