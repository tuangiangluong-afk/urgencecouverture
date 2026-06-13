import { MetadataRoute } from 'next';
import { getAllGuides } from '@/lib/mdx';
import { CITIES } from '@/lib/db';
import { slugify } from '@/lib/slugify';
import { createClient } from '@supabase/supabase-js';

// Base URL (Hub)
const BASE_URL = 'https://urgencecouverture.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const guides = getAllGuides();

    // 1. Static Routes
    const routes: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${BASE_URL}/llms.txt`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/openapi.json`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/guides`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        // Legal pages
        {
            url: `${BASE_URL}/mentions-legales`,
            lastModified: new Date('2026-03-01'),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/cgv`,
            lastModified: new Date('2026-03-01'),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ];

    // 2. Guide Routes (static MDX)
    const guideRoutes: MetadataRoute.Sitemap = guides.map((guide) => ({
        url: `${BASE_URL}/guides/${guide.slug}`,
        lastModified: new Date(guide.date),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // 3. Blog Routes (dynamic from Supabase)
    let blogRoutes: MetadataRoute.Sitemap = [];
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (supabaseUrl && supabaseKey) {
            const supabase = createClient(supabaseUrl, supabaseKey);
            const { data: blogPosts } = await supabase
                .from('blog_posts')
                .select('slug, published_at, updated_at')
                .eq('status', 'published')
                .order('published_at', { ascending: false });

            if (blogPosts) {
                blogRoutes = blogPosts.map((post) => ({
                    url: `${BASE_URL}/blog/${post.slug}`,
                    lastModified: new Date(post.updated_at || post.published_at),
                    changeFrequency: 'weekly' as const,
                    priority: 0.8,
                }));
            }
        }
    } catch (e) {
        console.warn('[Sitemap] Failed to fetch blog posts:', e);
    }

    // 4. City Routes (From CITIES Config)
    const uniqueSites = new Map();
    Object.values(CITIES).forEach(site => {
        if (site.slug !== 'home' && site.slug !== 'urgencecouverture.com' && site.slug !== 'www.urgencecouverture.com') {
            uniqueSites.set(site.slug, site);
        }
    });

    const cityRoutes: MetadataRoute.Sitemap = Array.from(uniqueSites.values()).map((site) => ({
        url: `${BASE_URL}/ville/${slugify(site.city).toLowerCase()}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    return [...routes, ...guideRoutes, ...blogRoutes, ...cityRoutes].map(item => ({
        ...item,
        url: item.url.toLowerCase()
    }));
}
