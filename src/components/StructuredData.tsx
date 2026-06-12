import { CityConfig } from "@/lib/db";

export function StructuredData({ city }: { city: CityConfig }) {
    const services = [
        {
            "@type": "Service",
            "name": "Transport Médical Conventionné",
            "description": "Transport assis professionnalisé (TAP) vers hôpitaux et cliniques. Agréé CPAM.",
            "serviceType": "MedicalTransport"
        },
        {
            "@type": "Service",
            "name": "Navette Aéroport",
            "description": "Transfert privé vers aéroports avec suivi de vol en temps réel.",
            "serviceType": "AirportTransfer"
        },
        {
            "@type": "Service",
            "name": "Taxi Gare TGV",
            "description": "Liaison gare avec attente panneau et aide aux bagages.",
            "serviceType": "TaxiService"
        }
    ];

    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "LocalBusiness",
                "additionalType": "https://schema.org/TaxiService",
                "@id": `https://${city.domain}/#localbusiness`,
                "name": city.name,
                "image": city.heroImage.startsWith('http') ? city.heroImage : `https://${city.domain}${city.heroImage}`,
                "telephone": city.phoneNumber,
                "email": city.email,
                "url": `https://${city.domain}`,
                "priceRange": "€€",
                "paymentAccepted": ["Cash", "Credit Card", "Invoice"],
                "currenciesAccepted": "EUR",
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": city.city,
                    "addressCountry": "FR"
                },
                "areaServed": [
                    { "@type": "City", "name": city.city },
                    ...(city.neighborhoods || []).map(n => ({ "@type": "City", "name": `${city.city} - ${n}` })),
                    { "@type": "AdministrativeArea", "name": "France" }
                ],
                "openingHoursSpecification": [
                    {
                        "@type": "OpeningHoursSpecification",
                        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                        "opens": "00:00",
                        "closes": "23:59"
                    }
                ],
                "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Services de Transport",
                    "itemListElement": services.map((service, index) => ({
                        "@type": "Offer",
                        "itemOffered": service,
                        "position": index + 1
                    }))
                },
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.9",
                    "reviewCount": "128",
                    "bestRating": "5",
                    "worstRating": "1"
                }
            },
            {
                "@type": "BreadcrumbList",
                "@id": `https://${city.domain}/#breadcrumb`,
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": `Taxi ${city.city}`,
                        "item": `https://${city.domain}`
                    }
                ]
            },
            {
                "@type": "FAQPage",
                "@id": `https://${city.domain}/#faq`,
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": `Combien coûte un taxi à ${city.city} ?`,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": `Le tarif de base est d'environ ${city.pricing.base}. Le prix final dépend de la distance et de l'horaire (jour/nuit).`
                        }
                    },
                    {
                        "@type": "Question",
                        "name": `Acceptez-vous la carte bancaire ?`,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Oui, tous nos chauffeurs acceptent la carte bancaire (Visa, Mastercard, Amex) ainsi que les espèces."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": `Comment réserver un taxi à ${city.city} ?`,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": `Vous pouvez réserver immédiatement par téléphone au ${city.phoneNumber} ou via notre formulaire de réservation en ligne.`
                        }
                    }
                ]
            }
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
