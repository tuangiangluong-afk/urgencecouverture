/**
 * Roofing Hub Site Configuration (Vaisseau Mère)
 */

export interface SiteConfig {
    slug: string;
    domain: string;
    aliases?: string[];
    city: string;
    postalCode: string;
    department: string;
    region: string;
    name: string;
    phoneNumber: string;
    email: string;
    targetType: 'ROOF' | 'URGENCY' | 'MIXED';
    priceRange: 'STANDARD' | 'PREMIUM' | 'LUXE';
    theme: 'premium' | 'trust';
    heroImage: string;
    description: string;
    meta: {
        title: string;
        description: string;
    };
    certifications: string[];
    aidesDisponibles: string[];
    features: string[];
    localKeywords: string[];
    quartiers: string[];
    coproprietes: string[];
    centresCommerciaux: string[];
    ga_id?: string;
    gtm_id?: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}

const TEMPLATE_CERTIFICATIONS = [
    "Qualibat",
    "RGE (Isolation Toiture)",
    "Régie des Couvreurs",
    "Assurance décennale"
];

const TEMPLATE_AIDES = [
    "MaPrimeRénov' (Isolation du toit)",
    "TVA Réduite 10% (Rénovation) & 5.5% (Isolation)",
    "Certificats d'Économie d'Énergie (CEE)"
];

const TEMPLATE_FEATURES = [
    "Devis gratuit sous 24h",
    "Intervention d'urgence fuite sous 2h",
    "Garantie décennale",
    "Déplacement gratuit",
    "Couvreurs certifiés RGE"
];

const _hubConfig: SiteConfig = {
    slug: "home",
    domain: "urgencecouverture.com",
    city: "France",
    postalCode: "",
    department: "",
    region: "National",
    name: "Urgence Couverture",
    phoneNumber: "01 84 80 00 00",
    email: "contact@urgencecouverture.com",
    targetType: 'MIXED',
    priceRange: 'STANDARD',
    theme: 'premium',
    heroImage: "/images/generated/roofing-hero.webp",
    description: "Le réseau n°1 d'artisans couvreurs en France. Dépannage fuite de toiture 24h/24, réfection de toit et zinguerie. Devis sous 24h.",
    meta: {
        title: "Urgence Couverture | Réparation Toiture & Couvreurs RGE France",
        description: "Urgence fuite de toiture et travaux de couverture partout en France. Devis gratuit sous 24h. Artisans couvreurs locaux certifiés Qualibat RGE."
    },
    certifications: TEMPLATE_CERTIFICATIONS,
    aidesDisponibles: TEMPLATE_AIDES,
    features: TEMPLATE_FEATURES,
    localKeywords: [
        "artisan couvreur",
        "reparation fuite toiture",
        "devis couverture toit",
        "entreprise de toiture",
        "urgence couvreur infiltration"
    ],
    quartiers: [],
    coproprietes: [],
    centresCommerciaux: [],
    coordinates: { lat: 46.2276, lng: 2.2137 }
};

export const SITES: Record<string, SiteConfig> = {
    "urgencecouverture.com": _hubConfig,
    "www.urgencecouverture.com": _hubConfig,
    "home": _hubConfig
};

export function getSiteConfig(hostnameOrSlug: string): SiteConfig | null {
    let hostname = hostnameOrSlug.split(':')[0];
    hostname = hostname.replace(/^www\./, '');

    const bySlug = Object.values(SITES).find(s => s.slug === hostname);
    if (bySlug) return bySlug;

    if (SITES[hostname]) return SITES[hostname];

    return _hubConfig;
}

export function getSiteBySlug(slug: string): SiteConfig | null {
    return Object.values(SITES).find(s => s.slug === slug) || null;
}

export function getSatelliteSites(): SiteConfig[] {
    return []; // No satellite domains
}

export function isMainHub(hostname: string): boolean {
    return true; // Always true as there are no satellite domains
}

export function getHubConfig(): SiteConfig {
    return _hubConfig;
}
