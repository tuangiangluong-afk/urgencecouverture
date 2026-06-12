import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const INDEXNOW_KEY = "d857c21382b142dcb53f9459750f5cc4";
    const HOST = "expertbornerecharge.com";
    const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

    try {
        // Fetch the site's own sitemap
        const sitemapUrl = `https://${HOST}/sitemap.xml`;
        const sitemapResponse = await fetch(sitemapUrl, { cache: 'no-store' });
        
        if (!sitemapResponse.ok) {
            throw new Error(`Failed to fetch sitemap: ${sitemapResponse.statusText}`);
        }
        
        const xml = await sitemapResponse.text();
        
        // Extract all URLs from sitemap
        // Matches <loc>https://...</loc>
        const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)];
        const urls = matches.map(m => m[1]);

        if (urls.length === 0) {
            throw new Error('No URLs found in sitemap');
        }

        // Limit to 10,000 URLs as per IndexNow restrictions
        const payloadUrls = urls.slice(0, 10000);

        // Prepare IndexNow payload
        const payload = {
            host: HOST,
            key: INDEXNOW_KEY,
            keyLocation: KEY_LOCATION,
            urlList: payloadUrls
        };

        // Ping Bing/IndexNow
        const response = await fetch("https://api.indexnow.org/indexnow", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`IndexNow Error: ${response.statusText}`);
        }

        return NextResponse.json({
            success: true,
            provider: "IndexNow",
            count: payloadUrls.length,
            message: "Ping sent successfully using sitemap URLs"
        });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
