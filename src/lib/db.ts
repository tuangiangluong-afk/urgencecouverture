import { SITES } from "@/lib/sites-config"; // Owned Empire
import { NATIONAL_TARGETS, getTargetAsCityConfig } from "@/config/national-targets"; // Partner Cities Network

export interface CityConfig {
    slug: string;
    domain: string;
    aliases?: string[];
    name: string;
    city: string;
    postalCode?: string;
    department?: string;
    region?: string;
    phoneNumber: string;
    email: string;
    heroImage: string;
    description: string;
    meta: {
        title: string;
        description: string;
    };
    features: string[];
    pricing: {
        base: string;
        description: string;
        km?: number;
    };
    // Iceberg Extend
    hospitals: string[];
    stations: string[];
    neighborhoods: string[];
    points_of_interest: {
        hotels: string[];
        nightlife: string[];
        monuments: string[];
        parking_difficulty: string;
    };
    ga_id?: string;
    gtm_id?: string;
    type?: 'OWNED' | 'PARTNER';
    targetType?: 'COPRO' | 'MAISON' | 'ENTREPRISE' | 'MIXED';
    geo?: {
        lat: number;
        lng: number;
    };
    partnerPhone?: string;
}

export function getCity(domain: string): CityConfig | null {
    // Normalize
    domain = domain.split(':')[0];
    domain = domain.replace(/^www\./, '');

    // DEV: Handle localhost
    if (domain.endsWith('.localhost')) {
        const subdomain = domain.split('.')[0];
        // Try to find in CITIES
        const found = Object.values(CITIES).find(c => c.domain.startsWith(`${subdomain}.`));
        if (found) return found;
    }

    if (CITIES[domain]) return CITIES[domain];

    return null;
}

import { slugify } from "@/lib/slugify";

export function getCityBySlug(slug: string): CityConfig | null {
    return Object.values(CITIES).find(c => c.slug === slug) || null;
}

export function getCityByCleanSlug(cleanSlug: string): CityConfig | null {
    return Object.values(CITIES).find(c => slugify(c.city) === cleanSlug) || null;
}

// ========================================
// GENERATE PARTNER CITIES (Partner Cities)
// ========================================
function generatePartnerCities(): Record<string, CityConfig> {
    const result: Record<string, CityConfig> = {};

    for (const target of NATIONAL_TARGETS) {
        // Use the refined config generator from national-targets.ts
        const config = getTargetAsCityConfig(target.slug);
        if (config) {
            // Adapt to local CityConfig interface if needed (they should match)
            // ensuring type compatibility
            result[target.slug] = config as unknown as CityConfig;
        }
    }
    return result;
}

// ========================================
// UNIFIED CITY REGISTRY
// ========================================

// Adapter to convert SiteConfig (Owned) to CityConfig (Universal)
const ADAPTED_SITES = Object.entries(SITES).reduce((acc, [key, site]) => {
    acc[key] = {
        ...site,
        // Map SiteConfig fields to CityConfig fields
        pricing: {
            base: site.priceRange === 'LUXE' ? 'Sur Dev.' : '900€',
            description: "Installation à partir de"
        },
        geo: site.coordinates,
        neighborhoods: site.quartiers || [],
        hospitals: [], // Not relevant for owned sites usually
        stations: [],
        points_of_interest: {
            hotels: [],
            nightlife: [],
            monuments: [],
            parking_difficulty: "Variable"
        }
    } as unknown as CityConfig;
    return acc;
}, {} as Record<string, CityConfig>);

export const CITIES: Record<string, CityConfig> = {
    ...ADAPTED_SITES, // From integrated SITES
    ...generatePartnerCities()
};
