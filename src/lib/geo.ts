import { SiteConfig, SITES } from "./sites-config";

interface GeoPoint {
    lat: number;
    lng: number;
}

/**
 * Calculates distance between two points in km using Haversine formula
 */
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

/**
 * Returns the nearest cities from the current city
 */
export function getNearbyCities(currentSlug: string, limit: number = 4): SiteConfig[] {
    const currentSite = SITES[currentSlug];

    // If no coordinates, return random fallback (or nothing)
    if (!currentSite?.coordinates) return getFallbackCities(currentSlug, limit);

    const allSites = Object.values(SITES).filter(s =>
        s.slug !== currentSlug &&
        s.slug !== 'home' &&
        s.city !== currentSite?.city && // STRICT: Name mismatch
        s.coordinates && // Only ones with coords
        ( // STRICT: Coord mismatch
            s.coordinates.lat !== currentSite?.coordinates?.lat ||
            s.coordinates.lng !== currentSite?.coordinates?.lng
        )
    );

    const measured = allSites.map(site => {
        return {
            ...site,
            distance: getDistanceFromLatLonInKm(
                currentSite.coordinates!.lat,
                currentSite.coordinates!.lng,
                site.coordinates!.lat,
                site.coordinates!.lng
            )
        };
    });

    // Sort by distance ASC
    measured.sort((a, b) => a.distance - b.distance);

    // Filter by distance (max 100km)
    const nearby = measured.filter(c => c.distance < 100);

    // Return top N
    return nearby.slice(0, limit);
}

function getFallbackCities(currentSlug: string, limit: number): SiteConfig[] {
    // Return first N sites that are not current
    return Object.values(SITES)
        .filter(s => s.slug !== currentSlug && s.slug !== 'home')
        .slice(0, limit);
}
