-- Add region & department to leads table
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS region text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS department text;

-- Add is_paid to leads table
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS is_paid boolean DEFAULT false;

-- Add managed_regions & managed_departments to partners table
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS managed_regions text[] DEFAULT '{}';
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS managed_departments text[] DEFAULT '{}';

-- Add indexes for regional/department filtering
CREATE INDEX IF NOT EXISTS idx_leads_region ON public.leads(region);
CREATE INDEX IF NOT EXISTS idx_leads_department ON public.leads(department);
CREATE INDEX IF NOT EXISTS idx_partners_managed_regions ON public.partners USING GIN (managed_regions);
CREATE INDEX IF NOT EXISTS idx_partners_managed_departments ON public.partners USING GIN (managed_departments);

-- Add comment to clarify source
COMMENT ON COLUMN public.leads.region IS 'Detected region based on tenant/domain during insertion';
COMMENT ON COLUMN public.leads.department IS 'Detected department based on postal code or tenant config';
