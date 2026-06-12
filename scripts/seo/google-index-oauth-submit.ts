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

const PRODUCTION_URL = process.env.PRODUCTION_URL || 'https://expertbornerecharge.fr';

const CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;

async function getAccessToken(): Promise<string> {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    throw new Error('❌ Error: Missing OAuth2 credentials in .env.local');
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Failed to refresh access token: ${data.error_description || data.error || JSON.stringify(data)}`);
  }
  return data.access_token;
}

async function submitUrlToIndex(url: string, accessToken: string): Promise<boolean> {
  try {
    console.log(`🔗 Submitting URL: ${url}`);
    const response = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: url,
        type: 'URL_UPDATED'
      })
    });
    const data = await response.json();
    if (!response.ok) {
      console.error(`❌ Failed to submit ${url}:`, data.error?.message || data);
      return false;
    }
    console.log(`✅ Successfully submitted: ${url}`);
    return true;
  } catch (error: any) {
    console.error(`❌ Exception during submission for ${url}:`, error.message);
    return false;
  }
}

async function run() {
  console.log('🚀 Starting Google Indexing API OAuth2 for ExpertBorneRecharge...');
  console.log('='.repeat(60));

  let accessToken: string;
  try {
    accessToken = await getAccessToken();
    console.log('✅ Personal Google Account OAuth2 access token retrieved successfully.');
  } catch (err: any) {
    console.error(err.message);
    return;
  }

  console.log('\n📋 Fetching published blog posts from Supabase...');
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
  console.log(`📢 Total URLs prepared for Indexing API: ${allUrls.length}`);
  console.log(`⚡ Submitting batch of 50 URLs...`);

  const batchToSubmit = allUrls.slice(0, 50);
  let successCount = 0;
  for (const url of batchToSubmit) {
    const success = await submitUrlToIndex(url, accessToken);
    if (success) successCount++;
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('='.repeat(60));
  console.log(`🏁 Google OAuth2 Indexing Submission for ExpertBorneRecharge Complete!`);
  console.log(`   Total submitted: ${batchToSubmit.length}`);
  console.log(`   Success: ${successCount}`);
}

run().catch(console.error);
