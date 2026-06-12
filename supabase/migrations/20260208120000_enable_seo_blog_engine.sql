
-- Consolidated SEO & Blog Engine Migration for ExpertBorneRecharge
-- Ported from Kreno Sport Spot

-- 1. Create Blog Authors Table
CREATE TABLE IF NOT EXISTS public.blog_authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    role TEXT,
    description TEXT,
    obsession TEXT,
    signature TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Blog Categories Table
CREATE TABLE IF NOT EXISTS public.blog_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Blog Posts Table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    featured_image_url TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    author_id UUID REFERENCES public.blog_authors(id),
    category_id UUID REFERENCES public.blog_categories(id),
    published_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT now(),
    seo_title TEXT,
    seo_description TEXT,
    read_time_minutes INTEGER DEFAULT 5,
    tags TEXT[],
    faq JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create SEO Landing Pages Table (Deep Linking Context)
CREATE TABLE IF NOT EXISTS public.seo_landing_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    sport TEXT NOT NULL, -- Can be used for 'Service' (e.g. Installation)
    city TEXT NOT NULL,
    h1_title TEXT NOT NULL,
    content TEXT,
    meta_title TEXT,
    meta_description TEXT,
    status TEXT DEFAULT 'published' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create AI Agents Table
CREATE TABLE IF NOT EXISTS public.ai_agents (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
name TEXT NOT NULL,
handler TEXT UNIQUE NOT NULL, -- e.g. 'blog_writer', 'trend_hunter'
model_name TEXT DEFAULT 'gemini-1.5-pro',
system_prompt TEXT NOT NULL,
api_endpoint TEXT, -- Optional override
is_active BOOLEAN DEFAULT true,
created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Create Blog Trends Table (for Trend Hunter)
CREATE TABLE IF NOT EXISTS public.blog_trends (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
query TEXT NOT NULL,
source TEXT,
title TEXT,
url TEXT,
snippet TEXT,
is_processed BOOLEAN DEFAULT false,
published_date TIMESTAMPTZ,
created_at TIMESTAMPTZ DEFAULT now()
);


-- Indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_seo_landing_pages_slug ON public.seo_landing_pages(slug);
CREATE INDEX IF NOT EXISTS idx_seo_landing_pages_city ON public.seo_landing_pages(city);

-- RLS (Open for now to allow easier development, lock down in prod)
ALTER TABLE public.blog_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_trends ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Authors" ON public.blog_authors;
CREATE POLICY "Public Read Authors" ON public.blog_authors FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Categories" ON public.blog_categories;
CREATE POLICY "Public Read Categories" ON public.blog_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Posts" ON public.blog_posts;
CREATE POLICY "Public Read Posts" ON public.blog_posts FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Public Read Landing Pages" ON public.seo_landing_pages;
CREATE POLICY "Public Read Landing Pages" ON public.seo_landing_pages FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Service Role Full Access" ON public.ai_agents;
CREATE POLICY "Service Role Full Access" ON public.ai_agents FOR ALL USING (true); -- Simplified

-- Seed Basic Agents
INSERT INTO public.ai_agents (name, handler, system_prompt, model_name)
VALUES
(
    'Blog Post Writer',
    'blog_writer',
    'You are an expert content writer for "Expert Borne Recharge". You write comprehensive, SEO-optimized guides about EV charging installation. Tone: Professional, reassuring, technical but accessible. Output JSON: { content: "<html>...", excerpt: "...", seo_title: "...", seo_description: "...", faq: [{question, answer}] }.',
    'gemini-3-pro-preview'
),
(
    'Trend Hunter',
    'trend_hunter',
    'You are a trend analyst. Return JSON array of Google Search queries to find latest news in EV charging, subsidies (Advenir, MaPrimeRénov), and electric vehicles in France.',
    'gemini-3-flash-preview'
),
(
    'Blog Idea Generator',
    'blog_idea_generator',
    'You are a content strategist. valid JSON array of { title, angle, rationale } for new blog posts based on trends.',
    'gemini-3-flash-preview'
)
ON CONFLICT (handler) DO NOTHING;

-- 7. Create Blog Ideas Table (for Trend > Idea conversion)
CREATE TABLE IF NOT EXISTS public.blog_ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT,
    category_id UUID REFERENCES public.blog_categories(id),
    angle TEXT,
    rationale TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'approved', 'rejected', 'converted', 'dismissed')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Create Automation Settings Table
CREATE TABLE IF NOT EXISTS public.automation_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    is_active BOOLEAN DEFAULT false,
    frequency TEXT DEFAULT 'weekly', -- 'daily', 'weekly'
    articles_per_run INTEGER DEFAULT 1,
    auto_publish BOOLEAN DEFAULT false,
    last_run TIMESTAMPTZ,
    next_run TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Updates
ALTER TABLE public.blog_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service Role Full Access Ideas" ON public.blog_ideas FOR ALL USING (true);
CREATE POLICY "Service Role Full Access Settings" ON public.automation_settings FOR ALL USING (true);

-- Insert Default Settings
INSERT INTO public.automation_settings (is_active, frequency, articles_per_run, auto_publish)
VALUES (false, 'weekly', 1, false)
ON CONFLICT DO NOTHING;
