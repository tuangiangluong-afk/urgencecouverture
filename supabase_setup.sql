-- ========================================================
-- CONSOLIDATED SUPABASE SCHEMA SETUP
-- Run this in the Supabase SQL Editor to initialize all tables
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TENANTS (Sites Configuration)
CREATE TABLE IF NOT EXISTS public.tenants (
  id TEXT NOT NULL PRIMARY KEY, -- Slug or tenant key (e.g. 'home')
  name TEXT NOT NULL,
  domain TEXT NOT NULL UNIQUE,
  phone_number TEXT,
  email TEXT,
  primary_color TEXT,
  gtm_id TEXT,
  ga_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. PARTNERS (Leads Receivers)
CREATE TABLE IF NOT EXISTS public.partners (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  company_info JSONB,
  managed_regions TEXT[] DEFAULT '{}',
  managed_departments TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. LEADS (Devis Form Submissions)
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  tenant_id TEXT NOT NULL, -- references tenants(id)
  status TEXT NOT NULL DEFAULT 'new',
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  message TEXT,
  city TEXT,
  postal_code TEXT,
  housing_type TEXT,
  niche TEXT,
  arbitrage_status TEXT,
  score INTEGER,
  region TEXT,
  department TEXT,
  is_paid BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. LEAD_ASSIGNMENTS (Assigning Leads to Partners)
CREATE TABLE IF NOT EXISTS public.lead_assignments (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  UNIQUE(lead_id, partner_id)
);

-- 5. REVIEWS (Client Testimonials)
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'Google',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. CONTENT_PAGES (CMS Layout overrides)
CREATE TABLE IF NOT EXISTS public.content_pages (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  path TEXT NOT NULL,
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT,
  type TEXT DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(tenant_id, path, section, key)
);

-- 7. BLOG AUTHORS
CREATE TABLE IF NOT EXISTS public.blog_authors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    role TEXT,
    description TEXT,
    obsession TEXT,
    signature TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. BLOG CATEGORIES
CREATE TABLE IF NOT EXISTS public.blog_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. BLOG POSTS
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    featured_image_url TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    author_id UUID REFERENCES public.blog_authors(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    seo_title TEXT,
    seo_description TEXT,
    read_time_minutes INTEGER DEFAULT 5,
    tags TEXT[],
    faq JSONB DEFAULT '[]'::jsonb,
    soloca_article_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. SEO PATTERNS (Templates)
CREATE TABLE IF NOT EXISTS public.seo_patterns (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tenant_id TEXT REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug_pattern TEXT NOT NULL,
  title_template TEXT NOT NULL,
  meta_description_template TEXT, 
  content_structure JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. SEO LANDING PAGES (Generated content)
CREATE TABLE IF NOT EXISTS public.seo_landing_pages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tenant_id TEXT REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  pattern_id UUID REFERENCES public.seo_patterns(id) ON DELETE SET NULL,
  slug TEXT NOT NULL,
  url_path TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  h1_title TEXT,
  content_json JSONB,
  target_city TEXT,
  target_service TEXT,
  status TEXT DEFAULT 'published',
  last_generated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(tenant_id, slug)
);

-- 12. AI AGENTS (Content creation agents)
CREATE TABLE IF NOT EXISTS public.ai_agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  handler TEXT UNIQUE NOT NULL,
  model_name TEXT DEFAULT 'gemini-1.5-pro',
  system_prompt TEXT NOT NULL,
  api_endpoint TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. BLOG TRENDS
CREATE TABLE IF NOT EXISTS public.blog_trends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  query TEXT NOT NULL,
  source TEXT,
  title TEXT,
  url TEXT,
  snippet TEXT,
  is_processed BOOLEAN DEFAULT false,
  published_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. BLOG IDEAS
CREATE TABLE IF NOT EXISTS public.blog_ideas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT,
    category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
    angle TEXT,
    rationale TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'approved', 'rejected', 'converted', 'dismissed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 15. AUTOMATION SETTINGS
CREATE TABLE IF NOT EXISTS public.automation_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    is_active BOOLEAN DEFAULT false,
    frequency TEXT DEFAULT 'weekly',
    articles_per_run INTEGER DEFAULT 1,
    auto_publish BOOLEAN DEFAULT false,
    last_run TIMESTAMP WITH TIME ZONE,
    next_run TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- ========================================================
-- INDEXES FOR PERFORMANCE
-- ========================================================
CREATE INDEX IF NOT EXISTS idx_leads_region ON public.leads(region);
CREATE INDEX IF NOT EXISTS idx_leads_department ON public.leads(department);
CREATE INDEX IF NOT EXISTS idx_leads_tenant ON public.leads(tenant_id);
CREATE INDEX IF NOT EXISTS idx_reviews_tenant ON public.reviews(tenant_id);
CREATE INDEX IF NOT EXISTS idx_reviews_active ON public.reviews(is_active);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_soloca_id ON public.blog_posts(soloca_article_id);
CREATE INDEX IF NOT EXISTS idx_seo_landing_pages_slug ON public.seo_landing_pages(slug);
CREATE INDEX IF NOT EXISTS idx_seo_landing_pages_city ON public.seo_landing_pages(target_city);


-- ========================================================
-- ROW LEVEL SECURITY (RLS) & POLICIES
-- ========================================================
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_settings ENABLE ROW LEVEL SECURITY;

-- Tenants Policies
DROP POLICY IF EXISTS "Public read tenants" ON public.tenants;
CREATE POLICY "Public read tenants" ON public.tenants FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin write tenants" ON public.tenants;
CREATE POLICY "Admin write tenants" ON public.tenants FOR ALL USING (auth.role() = 'authenticated');

-- Partners Policies
DROP POLICY IF EXISTS "Public read partners" ON public.partners;
CREATE POLICY "Public read partners" ON public.partners FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin write partners" ON public.partners;
CREATE POLICY "Admin write partners" ON public.partners FOR ALL USING (auth.role() = 'authenticated');

-- Leads Policies
DROP POLICY IF EXISTS "Public insert leads" ON public.leads;
CREATE POLICY "Public insert leads" ON public.leads FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admin write leads" ON public.leads;
CREATE POLICY "Admin write leads" ON public.leads FOR ALL USING (auth.role() = 'authenticated');

-- Lead Assignments Policies
DROP POLICY IF EXISTS "Admin write assignments" ON public.lead_assignments;
CREATE POLICY "Admin write assignments" ON public.lead_assignments FOR ALL USING (auth.role() = 'authenticated');

-- Reviews Policies
DROP POLICY IF EXISTS "Public read reviews" ON public.reviews;
CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Admin write reviews" ON public.reviews;
CREATE POLICY "Admin write reviews" ON public.reviews FOR ALL USING (auth.role() = 'authenticated');

-- Content Pages Policies
DROP POLICY IF EXISTS "Public read content" ON public.content_pages;
CREATE POLICY "Public read content" ON public.content_pages FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin write content" ON public.content_pages;
CREATE POLICY "Admin write content" ON public.content_pages FOR ALL USING (auth.role() = 'authenticated');

-- Blog Policies
DROP POLICY IF EXISTS "Public read authors" ON public.blog_authors;
CREATE POLICY "Public read authors" ON public.blog_authors FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read categories" ON public.blog_categories;
CREATE POLICY "Public read categories" ON public.blog_categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read posts" ON public.blog_posts;
CREATE POLICY "Public read posts" ON public.blog_posts FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Admin write authors" ON public.blog_authors;
CREATE POLICY "Admin write authors" ON public.blog_authors FOR ALL USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Admin write categories" ON public.blog_categories;
CREATE POLICY "Admin write categories" ON public.blog_categories FOR ALL USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Admin write posts" ON public.blog_posts;
CREATE POLICY "Admin write posts" ON public.blog_posts FOR ALL USING (auth.role() = 'authenticated');

-- SEO Landing Pages Policies
DROP POLICY IF EXISTS "Public read pages" ON public.seo_landing_pages;
CREATE POLICY "Public read pages" ON public.seo_landing_pages FOR SELECT USING (status = 'published');
DROP POLICY IF EXISTS "Admin write pages" ON public.seo_landing_pages;
CREATE POLICY "Admin write pages" ON public.seo_landing_pages FOR ALL USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Admin write patterns" ON public.seo_patterns;
CREATE POLICY "Admin write patterns" ON public.seo_patterns FOR ALL USING (auth.role() = 'authenticated');

-- AI Agent & Automation Policies
DROP POLICY IF EXISTS "Admin write agents" ON public.ai_agents;
CREATE POLICY "Admin write agents" ON public.ai_agents FOR ALL USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Admin write trends" ON public.blog_trends;
CREATE POLICY "Admin write trends" ON public.blog_trends FOR ALL USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Admin write ideas" ON public.blog_ideas;
CREATE POLICY "Admin write ideas" ON public.blog_ideas FOR ALL USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Admin write settings" ON public.automation_settings;
CREATE POLICY "Admin write settings" ON public.automation_settings FOR ALL USING (auth.role() = 'authenticated');
