import { NextRequest, NextResponse } from "next/server";
import { isMainHub } from "@/lib/sites-config";

export const config = {
    matcher: [
        "/((?!api/|_next/|_static/|_vercel|images/|[\\w-]+\\.\\w+).*)",
        "/sitemap.xml",
        "/robots.txt"
    ],
};

export default async function middleware(req: NextRequest) {
    const url = req.nextUrl;

    // Get hostname (e.g. bornerechargeparis.fr, expertbornerecharge.com)
    let hostname = req.headers.get("host") || "urgencecouverture.com";
    hostname = hostname.split(":")[0]; // Remove port if present

    // Check if we are on the main hub
    const isHub = isMainHub(hostname);

    // Get the path
    const searchParams = req.nextUrl.searchParams.toString();
    const cleanPath = url.pathname;
    const path = `${cleanPath}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

    // Helper to apply security headers
    const applySecurityHeaders = (res: NextResponse) => {
        res.headers.set("X-Frame-Options", "DENY");
        res.headers.set("X-Content-Type-Options", "nosniff");
        res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
        res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
        res.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
        return res;
    };

    // 0. EXPLICIT DEAD ROUTES (GSC Cleanup)
    if (cleanPath.startsWith("/gare")) {
        return applySecurityHeaders(new NextResponse(null, { status: 410, statusText: "Gone" }));
    }

    // 0.1 Path Normalization (Lowercase & No Trailing Slash handled by next.config `trailingSlash: false`)
    if (cleanPath !== cleanPath.toLowerCase()) {
        const lowercaseUrl = new URL(url.origin + url.pathname.toLowerCase() + url.search);
        if (lowercaseUrl.href !== url.href) {
            return applySecurityHeaders(NextResponse.redirect(lowercaseUrl, 301));
        }
    }


    // 0.2 Domain Normalization (www -> non-www)
    // Consolidate domain key early for all logic
    let domainKey = hostname;
    if (hostname.includes(".localhost")) {
        domainKey = hostname.split(".")[0];
        if (domainKey === "www") domainKey = hostname.split(".")[1];
    } else if (hostname.startsWith("www.")) {
        domainKey = hostname.replace("www.", "");
    }

    // NOTE: www → non-www redirect is now handled by vercel.json
    // The middleware redirect was causing a loop with Vercel edge redirects

    // 1. Sitemap Rewrite
    if (path === "/sitemap.xml") {
        let sitemapResponse;
        if (isHub) {
            sitemapResponse = NextResponse.rewrite(new URL("/home/sitemap.xml", req.url));
        } else {
            sitemapResponse = NextResponse.rewrite(new URL(`/${domainKey}/sitemap.xml`, req.url));
        }
        sitemapResponse.headers.set("x-irve-domain", domainKey);
        sitemapResponse.headers.set("x-irve-city", domainKey);
        return applySecurityHeaders(sitemapResponse);
    }

    // 1.5 Robots Rewrite
    if (path === "/robots.txt") {
        if (isHub) {
            // Next.js handles /robots.txt from src/app/robots.ts
            return applySecurityHeaders(NextResponse.next());
        }
        // Satellite domains: serve from API route (Next.js Metadata robots.ts doesn't work in dynamic segments)
        const robotsResponse = NextResponse.rewrite(new URL(`/api/robots`, req.url));
        robotsResponse.headers.set("x-irve-domain", domainKey);
        return applySecurityHeaders(robotsResponse);
    }

    // 2. Routing Logic
    let response: NextResponse;

    if (isHub) {
        // HUB Logic
        // Redirect /home/* to /* to prevent duplicate content
        if (cleanPath.startsWith("/home") && cleanPath !== "/home/sitemap.xml") {
            const cleanUrl = cleanPath.replace("/home", "") || "/";
            const targetUrl = new URL(cleanUrl + url.search, req.url);
            if (targetUrl.href !== req.url) {
                return applySecurityHeaders(NextResponse.redirect(targetUrl, 301));
            }
        }

        if (path.startsWith("/admin") || path.startsWith("/login") || path.startsWith("/api") || path.startsWith("/leads") || path.startsWith("/guides") || path.startsWith("/outils") || path.startsWith("/vehicules") || path.startsWith("/ville") || path.startsWith("/solutions") || path.startsWith("/service") || path.startsWith("/quartier") || path.startsWith("/departement") || path.startsWith("/poi") || path.startsWith("/demo") || path.startsWith("/installation") || path.startsWith("/images") || path.startsWith("/fiscalite-entreprise-borne")) {
            response = NextResponse.next();
        } else {
            response = NextResponse.rewrite(
                new URL(`/home${path === "/" ? "" : path}`, req.url)
            );
        }
    } else {
        // SATELLITE Logic

        // RESTRICTION: Local routes (/ville, /quartier) MUST match the current domain
        // If they don't, we redirect to the correct domain or the hub to avoid duplicate content cross-domain
        if (cleanPath.startsWith("/ville/") || cleanPath.startsWith("/quartier/")) {
            // No redirection needed here; the router will handle 404 if the slug is invalid,
            // or serve the correct content if it exists.
        }

        // Whitelist shared routes (serve from root app)
        if (path.startsWith("/guides") || path.startsWith("/leads") || path.startsWith("/vehicules") || path.startsWith("/solutions") || path.startsWith("/ville") || path.startsWith("/service") || path.startsWith("/quartier") || path.startsWith("/departement") || path.startsWith("/poi") || path.startsWith("/api") || path.startsWith("/outils") || path.startsWith("/login") || path.startsWith("/admin") || path.startsWith("/installation") || path.startsWith("/fiscalite-entreprise-borne")) {
            response = NextResponse.next();
        } else {
            const routeParam = hostname.includes(".localhost") ? domainKey : domainKey;
            response = NextResponse.rewrite(
                new URL(`/${routeParam}${path}`, req.url)
            );
        }
    }

    // Global Headers for SEO & Canonical
    response.headers.set("x-irve-domain", domainKey);
    response.headers.set("x-irve-city", domainKey);
    response.headers.set("x-irve-path", cleanPath);

    // Shared routes must point back to the main hub as their canonical source
    // Local /ville and /quartier pages MUST be canonical to THEMSELVES on their own domain
    if (cleanPath.startsWith("/guides") || cleanPath.startsWith("/vehicules") || cleanPath.startsWith("/solutions") || cleanPath.startsWith("/service") || cleanPath.startsWith("/poi") || cleanPath.startsWith("/outils") || cleanPath.startsWith("/installation") || cleanPath.startsWith("/fiscalite-entreprise-borne")) {
        response.headers.set("x-irve-canonical-domain", "urgencecouverture.com");
    } else {
        response.headers.set("x-irve-canonical-domain", domainKey);
    }

    // Vercel CDN Caching: Cache all public HTML and sitemap routes to save Fluid CPU hours
    if (
        !cleanPath.startsWith("/api") && 
        !cleanPath.startsWith("/admin") && 
        !cleanPath.startsWith("/login") && 
        !cleanPath.startsWith("/leads") &&
        !cleanPath.startsWith("/success") &&
        !cleanPath.startsWith("/demo")
    ) {
        response.headers.set("Vercel-CDN-Cache-Control", "public, s-maxage=86400, stale-while-revalidate=3600");
    }

    return applySecurityHeaders(response);
}


