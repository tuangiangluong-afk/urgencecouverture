import { getSiteConfig } from "@/lib/sites-config";
import { GTMScript } from "@/components/GTMScript";
import { notFound } from "next/navigation";
import Script from "next/script";

import CookieBanner from "@/components/CookieBanner";

export default async function DomainLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ domain: string }>;
}) {
    const resolvedParams = await params;
    const site = getSiteConfig(resolvedParams.domain);

    if (!site) return notFound();

    // Priority: Config File (Static)
    const gaId = site.ga_id;
    const gtmId = site.gtm_id;

    return (
        <>
            <GTMScript gtmId={gtmId} />
            {gaId && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                        strategy="afterInteractive"
                    />
                    <Script id="google-analytics" strategy="afterInteractive">
                        {`
                          window.dataLayer = window.dataLayer || [];
                          function gtag(){dataLayer.push(arguments);}
                          gtag('js', new Date());
                          gtag('config', '${gaId}');
                        `}
                    </Script>
                </>
            )}
            {children}
            <CookieBanner slug={site.slug} cityName={site.city} />
        </>
    );
}
