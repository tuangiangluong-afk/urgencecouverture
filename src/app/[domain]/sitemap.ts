import { MetadataRoute } from "next";
import { SITES } from "@/lib/sites-config";
import { slugify } from "@/lib/slugify";
import { headers } from "next/headers";

type Props = {
    params: Promise<{ domain: string }>;
}

export default async function sitemap(props?: Props): Promise<MetadataRoute.Sitemap> {
    const headersList = await headers();
    let domain = headersList.get("x-irve-domain");

    if (!domain) {
        const resolved = props?.params ? await props.params : null;
        domain = resolved?.domain || null;
    }

    if (!domain) return [{ url: "https://urgencecouverture.com", lastModified: new Date() }];

    // Get config for this domain
    const config = SITES[domain] || SITES[`www.${domain}`];
    if (!config) return [{ url: "https://urgencecouverture.com", lastModified: new Date() }];

    const baseUrl = `https://${config.domain}`;

    // 1. Core Pages
    const routes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date('2026-03-01'),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/mentions-legales`,
            lastModified: new Date('2026-03-01'),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/cgv`,
            lastModified: new Date('2026-03-01'),
            changeFrequency: 'monthly',
            priority: 0.7,
        }
    ];

    // 2. Local Quarters / Neighborhoods (SEO Long Tail)
    if (config.quartiers && config.quartiers.length > 0) {
        config.quartiers.forEach(q => {
            routes.push({
                url: `${baseUrl}/quartier/${slugify(q)}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.7,
            });
        });
    }

    return routes.map(item => ({
        ...item,
        url: item.url.toLowerCase()
    }));
}
