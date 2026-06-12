-- Allow anonymous inserts for seeding (Temporary for setup)
-- Run this in Supabase SQL Editor
create policy "Allow public insert" on public.tenants for insert with check (true);
create policy "Allow public insert" on public.pois for insert with check (true);
