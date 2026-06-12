-- Fix RLS for spintax_templates table which was missed in 20240105_init_taxicms.sql

alter table public.spintax_templates enable row level security;

-- Public Read Policy
create policy "Allow public read access" on public.spintax_templates for select using (true);

-- Admin Write Policy
create policy "Enable write for admins" on public.spintax_templates for all using (auth.role() = 'authenticated');
