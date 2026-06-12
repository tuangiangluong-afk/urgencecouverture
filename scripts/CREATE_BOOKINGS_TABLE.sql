-- Create bookings table to store leads
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    tenant_id TEXT NOT NULL, -- The domain slug (e.g. taxiversailles_com)
    
    client_name TEXT,
    phone TEXT NOT NULL,
    email TEXT,
    
    pickup_address TEXT NOT NULL,
    dropoff_address TEXT NOT NULL,
    pickup_time TIMESTAMPTZ NOT NULL,
    
    price_estimate TEXT,
    distance_km NUMERIC,
    duration_min NUMERIC,
    
    status TEXT DEFAULT 'new', -- new, assigned, completed, cancelled
    driver_id UUID REFERENCES auth.users(id),
    
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Policy: insert allowed by anon (public form)
CREATE POLICY "Enable insert for anon" ON public.bookings
    FOR INSERT TO anon
    WITH CHECK (true);

-- Policy: select only for admin (service_role will bypass RLS anyway, but good to have)
-- This assumes you have authenticated users, but for now we just allow insert from public.
