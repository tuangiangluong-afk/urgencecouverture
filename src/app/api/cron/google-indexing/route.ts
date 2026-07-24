import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { GoogleAuth } from 'google-auth-library';

export const dynamic = 'force-dynamic';

const MAX_DAILY_QUOTA = 200; // Strict Google Indexing API daily limit

async function getAuthToken() {
  const keyPath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH || '/Users/marc/Downloads/project-0c646319-da1d-4eaf-832-a8c9a965aa6e.json';
  if (!fs.existsSync(keyPath)) {
    const fallbackPath = '/Users/marc/Downloads/project-8d17328c-283e-453e-bc4-b16c0e680c6d.json';
    if (!fs.existsSync(fallbackPath)) return null;
    const auth = new GoogleAuth({
      keyFile: fallbackPath,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });
    const client = await auth.getClient();
    return (await client.getAccessToken()).token;
  }

  const auth = new GoogleAuth({
    keyFile: keyPath,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });
  const client = await auth.getClient();
  return (await client.getAccessToken()).token;
}

export async function GET(request: Request) {
  const hostHeader = request.headers.get('host') || '';
  const HOST = hostHeader.split(':')[0] || process.env.NEXT_PUBLIC_HOST || "expertbornerecharge.com";
  
  try {
    const sitemapUrl = `https://${HOST}/sitemap.xml`;
    const sitemapResponse = await fetch(sitemapUrl, { cache: 'no-store' });
    
    let urls: string[] = [];
    if (sitemapResponse.ok) {
      const xml = await sitemapResponse.text();
      const matches = [...xml.matchAll(/<loc>(.*?)</loc>/g)];
      urls = matches.map(m => m[1]);
    }

    if (urls.length === 0) {
      return NextResponse.json({ success: false, error: 'No URLs found in sitemap' }, { status: 400 });
    }

    const queueFilePath = path.join(process.cwd(), 'src', 'data', 'google-indexing-state.json');
    let submittedSet = new Set<string>();

    if (fs.existsSync(queueFilePath)) {
      try {
        const stateData = JSON.parse(fs.readFileSync(queueFilePath, 'utf8'));
        submittedSet = new Set(stateData.submitted || []);
      } catch (e) {
        console.error('Failed to parse queue state:', e);
      }
    }

    const pendingUrls = urls.filter(u => !submittedSet.has(u));

    if (pendingUrls.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'All sitemap URLs have already been submitted to Google Indexing API!',
        totalSubmitted: submittedSet.size
      });
    }

    const batchToSubmit = pendingUrls.slice(0, MAX_DAILY_QUOTA);
    const token = await getAuthToken();
    let successCount = 0;
    let failCount = 0;

    if (token) {
      for (const url of batchToSubmit) {
        try {
          const res = await fetch("https://indexing.googleapis.com/v1/urlNotifications:publish", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              url: url,
              type: "URL_UPDATED"
            })
          });

          if (res.ok) {
            submittedSet.add(url);
            successCount++;
          } else {
            failCount++;
          }
        } catch (err) {
          failCount++;
        }
      }
    }

    const newState = {
      lastRun: new Date().toISOString(),
      submitted: Array.from(submittedSet),
      pendingCount: pendingUrls.length - batchToSubmit.length
    };
    
    fs.writeFileSync(queueFilePath, JSON.stringify(newState, null, 2));

    return NextResponse.json({
      success: true,
      provider: "Google Search Indexing API",
      submittedToday: batchToSubmit.length,
      successCount,
      failCount,
      remainingInQueue: pendingUrls.length - batchToSubmit.length,
      totalSubmittedSoFar: submittedSet.size
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
