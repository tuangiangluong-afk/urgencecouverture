import { CityConfig } from "@/lib/db";

export const NATIONAL_CONFIG: CityConfig = {
    slug: "home",
    domain: "urgencecouverture.com",
    name: "Urgence Couverture",
    city: "France",
    phoneNumber: "01 84 80 00 00",
    email: "contact@urgencecouverture.com",
    heroImage: "https://images.unsplash.com/photo-1632759162402-97eeec246513?q=80&w=2940&auto=format&fit=crop",
    description: "Le réseau n°1 d'artisans couvreurs en France. Dépannage fuite de toiture 24h/24, réfection de toit et zinguerie. Devis sous 24h.",
    meta: {
        title: "Urgence Couverture | Réparation Toiture & Couvreurs RGE France",
        description: "Urgence fuite de toiture et travaux de couverture partout en France. Devis gratuit sous 24h. Artisans couvreurs locaux certifiés Qualibat RGE."
    },
    features: [
        "Intervention d'Urgence Fuite",
        "Devis Gratuit sous 24h",
        "Garantie Décennale",
        "Artisans Couvreurs Certifiés"
    ],
    pricing: {
        base: "Sur Devis",
        description: "Devis gratuit personnalisé selon votre toiture"
    },
    hospitals: [],
    stations: [],
    neighborhoods: [],
    points_of_interest: {
        hotels: [],
        nightlife: [],
        monuments: [],
        parking_difficulty: "N/A"
    }
};
