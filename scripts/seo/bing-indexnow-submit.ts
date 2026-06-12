import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tblatnaxfbjvjbihiryi.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_KEY) {
  console.error('❌ Missing env var: NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const BING_KEY = '136009bf6d91456da87ab666014285fb';
const HOST = 'expertbornerecharge.fr';
const PRODUCTION_URL = `https://${HOST}`;

async function run() {
  console.log('🚀 Starting Bing IndexNow API submission script for ExpertBorneRecharge...');
  console.log('='.repeat(60));

  console.log('📋 Fetching published blog posts from Supabase...');
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('status', 'published')
    .order('id', { ascending: false });

  if (error) {
    console.error('❌ Error fetching posts from Supabase:', error.message);
    return;
  }

  console.log(`Found ${posts?.length || 0} published blog posts.`);
  if (!posts || posts.length === 0) {
    console.log('✅ No published blog posts found.');
    return;
  }

  const urlsToSubmit: string[] = [];
  for (const post of posts) {
    urlsToSubmit.push(`${PRODUCTION_URL}/blog/${post.slug}`);
  }

  const allUrls = [`${PRODUCTION_URL}/blog`, ...urlsToSubmit];
  console.log(`📢 Total URLs prepared for IndexNow: ${allUrls.length}`);

  const requestBody = {
    host: HOST,
    key: BING_KEY,
    keyLocation: `${PRODUCTION_URL}/${BING_KEY}.txt`,
    urlList: allUrls
  };

  try {
    console.log('\n📡 Sending submission to IndexNow API...');
    const response = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(requestBody)
    });

    if (response.status === 200 || response.status === 202) {
      console.log(`✅ IndexNow submission successful (Status ${response.status})!`);
    } else {
      const errorText = await response.text();
      console.error(`❌ IndexNow returned error status ${response.status}:`);
      console.error(errorText);
    }
  } catch (error: any) {
    console.error('❌ Exception during IndexNow submission:', error.message);
  }

  console.log('='.repeat(60));
  console.log('🏁 IndexNow pipeline complete.');
}

run().catch(console.error);
