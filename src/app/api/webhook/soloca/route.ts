import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

const supabaseAdmin = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

export async function POST(req: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase URL and Key are required' }, { status: 500 });
    }
    const authHeader = req.headers.get('authorization');
    const secret = process.env.INTERNAL_BLOG_SECRET;

    if (!secret || authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await req.json();
    const article = payload.article || payload;
    
    if (!article || !article.title || !article.content) {
      return NextResponse.json({ error: 'Missing article data' }, { status: 400 });
    }

    const slug = article.slug || article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    const { data: defaultCategory } = await supabaseAdmin
      .from('blog_categories')
      .select('id')
      .limit(1)
      .single();

    const { data: inserted, error } = await supabaseAdmin.from('blog_posts').upsert({
      title: article.title,
      slug: slug,
      content: article.content,
      excerpt: article.excerpt || article.seo_description || article.content.substring(0, 150),
      featured_image_url: article.featured_image_url || article.image_url || null,
      status: article.status === 'published' ? 'published' : 'draft',
      published_at: article.status === 'published' ? new Date().toISOString() : null,
      category_id: defaultCategory?.id || null,
      seo_title: article.seo_title || article.title,
      seo_description: article.seo_description || article.excerpt
    }, { 
      onConflict: 'slug' 
    }).select().single();

    if (error) throw error;

    return NextResponse.json({ success: true, post: inserted });
  } catch (error: any) {
    console.error('Expert Borne Recharge Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
