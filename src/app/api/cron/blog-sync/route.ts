import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createSupabaseAdmin } from '@/lib/supabase-server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const secret = searchParams.get('secret');

        // 0. Security Check
        const CRON_SECRET = process.env.INTERNAL_SYNC_SECRET || process.env.CRON_SECRET;
        if (CRON_SECRET && secret !== CRON_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Soloca Configuration
        const SOLOCA_URL = process.env.SOLOCA_SUPABASE_URL;
        const SOLOCA_KEY = process.env.SOLOCA_SERVICE_ROLE_KEY || process.env.SOLOCA_ANON_KEY;
        const SOLOCA_WORKSPACE_ID = process.env.SOLOCA_WORKSPACE_ID || '64502331-945e-4f34-90f4-7cb05a4963df';

        if (!SOLOCA_URL || !SOLOCA_KEY) {
            return NextResponse.json({ error: 'Soloca configuration missing' }, { status: 500 });
        }

        const solocaDb = createClient(SOLOCA_URL, SOLOCA_KEY);
        const supabase = createSupabaseAdmin();

        console.log(`🚀 Starting Soloca Blog Sync for Workspace: ${SOLOCA_WORKSPACE_ID}`);

        // 2. Fetch completed articles from Soloca
        const { data: articles, error: fetchError } = await solocaDb
            .from('authority_articles')
            .select('*')
            .eq('status', 'completed')
            .eq('workspace_id', SOLOCA_WORKSPACE_ID)
            .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        if (!articles || articles.length === 0) {
            return NextResponse.json({ message: 'No new articles found' });
        }

        const syncResults = {
            total: articles.length,
            synced: 0,
            skipped: 0,
            errors: [] as string[]
        };

        // 3. Sync each article
        for (const article of articles) {
            // Check if already synced
            const { data: existing } = await supabase
                .from('blog_posts')
                .select('id')
                .eq('soloca_article_id', article.id)
                .maybeSingle();

            if (existing) {
                syncResults.skipped++;
                continue;
            }

            // Prepare local article data
            const slug = article.slug || article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            
            const { error: insertError } = await supabase
                .from('blog_posts')
                .insert({
                    title: article.title,
                    slug: slug,
                    excerpt: article.meta_description,
                    content: article.markdown_content,
                    featured_image_url: article.featured_image || null,
                    status: 'published',
                    published_at: new Date().toISOString(),
                    seo_title: article.meta_title,
                    seo_description: article.meta_description,
                    soloca_article_id: article.id,
                    read_time_minutes: Math.min(8, Math.ceil((article.word_count || 1000) / 250)),
                    faq: article.faq_section ? JSON.parse(article.faq_section) : null
                });

            if (insertError) {
                console.error(`Error syncing article ${article.title}:`, insertError);
                syncResults.errors.push(`${article.title}: ${insertError.message}`);
                continue;
            }

            // 4. Update live_url in Soloca for ranking tracking
            const liveUrl = `https://expertbornerecharge.com/blog/${slug}`;
            await solocaDb
                .from('authority_articles')
                .update({ live_url: liveUrl })
                .eq('id', article.id);

            syncResults.synced++;
        }

        return NextResponse.json({ success: true, results: syncResults });

    } catch (error: any) {
        console.error('Blog Sync Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
