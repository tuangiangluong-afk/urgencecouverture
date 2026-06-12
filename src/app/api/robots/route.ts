import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const domain = req.headers.get("x-irve-domain") || "urgencecouverture.com";
    const baseUrl = `https://${domain}`;

    const robotsTxt = `User-Agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /login

Sitemap: ${baseUrl}/sitemap.xml
`;

    return new NextResponse(robotsTxt, {
        status: 200,
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=86400",
        },
    });
}
