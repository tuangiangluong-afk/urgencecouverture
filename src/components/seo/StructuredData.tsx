import Script from "next/script";

export default function StructuredData() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Urgence Couverture",
        "url": "https://urgencecouverture.com",
        "logo": "https://urgencecouverture.com/logo.png",
        "description": "Réseau national de couvreurs et artisans charpentiers pour le dépannage de fuites, la réparation et la réfection de toiture. Artisans qualifiés RGE.",
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
        }
    };

    return (
        <Script
            id="org-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
