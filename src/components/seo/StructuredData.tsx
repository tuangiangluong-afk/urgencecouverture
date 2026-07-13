import Script from "next/script";

export default function StructuredData() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Urgence Couverture",
        "url": "https://www.urgencecouverture.com",
        "logo": "https://www.urgencecouverture.com/logo.png",
        "description": "Réseau national de couvreurs et artisans charpentiers pour le dépannage de fuites, la réparation et la réfection de toiture. Artisans qualifiés RGE.",
        "sameAs": [
            "https://www.facebook.com/urgencecouverture",
            "https://www.instagram.com/urgencecouverture"
        ],
        "foundingDate": "2020",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "FR"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+33 1 84 80 00 00",
            "contactType": "customer service",
            "areaServed": "FR",
            "availableLanguage": "French"
        },
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.urgencecouverture.com/ville/{search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "url": "https://www.urgencecouverture.com",
        "name": "urgencecouverture",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.urgencecouverture.com/ville/{search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Installation et Dépannage",
        "provider": { "@type": "Organization", "name": "urgencecouverture" },
        "areaServed": { "@type": "Country", "name": "France" }
    };

    
    const webPageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "url": "https://www.urgencecouverture.com",
        "name": "Urgence Couverture",
        "description": "Réparation et rénovation de toiture en urgence",
        "inLanguage": "fr",
        "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": [
                "h1",
                ".hero-description",
                ".faq-answer",
                "article h2",
                "article p:first-of-type",
                ".prose > p:first-child"
            ]
        },
        "isPartOf": {
            "@type": "WebSite",
            "url": "https://www.urgencecouverture.com",
            "name": "Urgence Couverture"
        }
    };

    return (
        <>
        <Script
            id="org-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) + '\n' + JSON.stringify(websiteSchema) + '\n' + JSON.stringify(serviceSchema) }}
        />

        <Script

            id="webpage-speakable-schema"

            type="application/ld+json"

            dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}

        />

        </>
    );
}
