// Google Distance Matrix API utility for server-side distance/price calculation
// This should only be called server-side (in API routes or server components)

interface DistanceResult {
    distance: string; // e.g., "45 km"
    distanceMeters: number;
    duration: string; // e.g., "45 min"
    durationSeconds: number;
    estimatedPrice: number; // in euros
    priceRange: string; // e.g., "45€ - 55€"
}

// Taxi pricing constants (French taxi rates approximation)
const PRICING = {
    BASE_FARE: 4, // Prise en charge
    PRICE_PER_KM_DAY: 1.15, // Tarif A (jour)
    PRICE_PER_KM_NIGHT: 1.44, // Tarif B (nuit/dimanche)
    PRICE_PER_MINUTE_WAITING: 0.50, // Attente
    MINIMUM_FARE: 7.30, // Course minimum
    // For estimates, we add a margin for traffic/waiting
    MARGIN_PERCENT: 0.15,
};

export async function calculateDistance(
    origin: string,
    destination: string
): Promise<DistanceResult | null> {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

    if (!apiKey) {
        console.error("Google Maps API key not configured");
        return null;
    }

    try {
        const url = new URL("https://maps.googleapis.com/maps/api/distancematrix/json");
        url.searchParams.set("origins", origin);
        url.searchParams.set("destinations", destination);
        url.searchParams.set("mode", "driving");
        url.searchParams.set("language", "fr");
        url.searchParams.set("key", apiKey);

        const response = await fetch(url.toString(), {
            next: { revalidate: 86400 } // Cache for 24 hours
        });

        const data = await response.json();

        if (data.status !== "OK") {
            console.error("Distance Matrix API error:", data.status);
            return null;
        }

        const element = data.rows?.[0]?.elements?.[0];
        if (!element || element.status !== "OK") {
            console.error("No route found");
            return null;
        }

        const distanceMeters = element.distance.value;
        const durationSeconds = element.duration.value;
        const distanceKm = distanceMeters / 1000;

        // Calculate price using taxi formula
        const baseFare = PRICING.BASE_FARE;
        const distanceFare = distanceKm * PRICING.PRICE_PER_KM_DAY;
        const rawPrice = baseFare + distanceFare;

        // Add margin for traffic/waiting
        const estimatedPrice = Math.round(rawPrice * (1 + PRICING.MARGIN_PERCENT));

        // Ensure minimum fare
        const finalPrice = Math.max(estimatedPrice, PRICING.MINIMUM_FARE);

        // Create price range (±15%)
        const priceLow = Math.round(finalPrice * 0.9);
        const priceHigh = Math.round(finalPrice * 1.2);

        return {
            distance: element.distance.text,
            distanceMeters,
            duration: element.duration.text,
            durationSeconds,
            estimatedPrice: finalPrice,
            priceRange: `${priceLow}€ - ${priceHigh}€`,
        };
    } catch (error) {
        console.error("Error calculating distance:", error);
        return null;
    }
}

// Helper to get coordinates/address for common destinations
export function getDestinationAddress(destSlug: string): string | null {
    const destinations: Record<string, string> = {
        "aeroport-orly": "Aéroport de Paris-Orly, France",
        "aeroport-roissy-cdg": "Aéroport Paris Charles de Gaulle, France",
        "gare-montparnasse": "Gare Montparnasse, Paris, France",
        "gare-de-lyon": "Gare de Lyon, Paris, France",
        "gare-du-nord": "Gare du Nord, Paris, France",
        "paris-centre": "Place de la Concorde, Paris, France",
        "la-defense": "La Défense, Puteaux, France",
    };
    return destinations[destSlug] || null;
}
