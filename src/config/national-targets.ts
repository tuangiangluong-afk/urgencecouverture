// ========================================
// NATIONAL TARGETS - 30 HIGH-VALUE ZONES
// Urgence Couverture - Couverture Nationale pSEO
// ========================================

export interface NationalTarget {
    slug: string;
    name: string;
    heroTitle: string;
    geo: { lat: number; lng: number };
    price_start: number; // Prix installation à partir de
    top_places: string[]; // Zones d'intervention (Quartiers, Villes voisines)
    zip: string;
    tier: 'BIG5' | 'GOLDEN' | 'HUB' | 'STRATEGIC';
    heroImage?: string;
}

export const NATIONAL_TARGETS: NationalTarget[] = [
    // ========================================
    // 👑 TIER 1: BIG 5 (60% du CA)
    // ========================================
    {
        slug: "paris",
        name: "Paris",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 48.856, lng: 2.352 },
        price_start: 900.00,
        top_places: ["Paris 16", "Paris 17", "Le Marais", "Montmartre"],
        zip: "75000",
        tier: 'BIG5',
        heroImage: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=2672&auto=format&fit=crop"
    },
    {
        slug: "lyon",
        name: "Lyon",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 45.764, lng: 4.835 },
        price_start: 890.00,
        top_places: ["Monts d'Or", "Presqu'île", "Part-Dieu", "Confluence"],
        zip: "69000",
        tier: 'BIG5',
        heroImage: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "marseille",
        name: "Marseille",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 43.296, lng: 5.369 },
        price_start: 850.00,
        top_places: ["Prado", "Corniche", "Vieux-Port", "Euroméditerranée"],
        zip: "13000",
        tier: 'BIG5',
        heroImage: "https://images.unsplash.com/photo-1559825481-12a05cc00018?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "nice",
        name: "Nice",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 43.710, lng: 7.262 },
        price_start: 950.00,
        top_places: ["Promenade des Anglais", "Cimiez", "Mont Boron", "Carré d'Or"],
        zip: "06000",
        tier: 'BIG5',
        heroImage: "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "bordeaux",
        name: "Bordeaux",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 44.837, lng: -0.579 },
        price_start: 890.00,
        top_places: ["Chartrons", "Caudéran", "Le Bouscat", "Talence"],
        zip: "33000",
        tier: 'BIG5',
        heroImage: "https://Images.unsplash.com/photo-1559087867-ce4c91325525?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "toulouse",
        name: "Toulouse",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 43.604, lng: 1.444 },
        price_start: 850.00,
        top_places: ["Capitol", "Carmes", "Saint-Cyprien", "Balma"],
        zip: "31000",
        tier: 'BIG5',
        heroImage: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?q=80&w=2670&auto=format&fit=crop"
    },

    // ========================================
    // 💎 TIER 2: GOLDEN CITIES (Pouvoir d'achat Élevé)
    // ========================================
    {
        slug: "cannes",
        name: "Cannes",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 43.552, lng: 7.017 },
        price_start: 1100.00,
        top_places: ["La Californie", "Croisette", "Super Cannes", "Mougins"],
        zip: "06400",
        tier: 'GOLDEN',
        heroImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "aix-en-provence",
        name: "Aix-en-Provence",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 43.529, lng: 5.447 },
        price_start: 950.00,
        top_places: ["Centre Historique", "Puyricard", "Les Milles", "Tholonet"],
        zip: "13100",
        tier: 'GOLDEN',
        heroImage: "https://images.unsplash.com/photo-1596422846543-75c6fc197825?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "antibes",
        name: "Antibes",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 43.580, lng: 7.125 },
        price_start: 980.00,
        top_places: ["Cap d'Antibes", "Juan-les-Pins", "Biot", "Sophia-Antipolis"],
        zip: "06600",
        tier: 'GOLDEN',
        heroImage: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "neuilly-sur-seine",
        name: "Neuilly-sur-Seine",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 48.884, lng: 2.268 },
        price_start: 1200.00,
        top_places: ["Saint-James", "Sablons", "Bagatelle", "Ile de la Jatte"],
        zip: "92200",
        tier: 'GOLDEN',
        heroImage: "https://images.unsplash.com/photo-1551101968-3e414168c818?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "lille",
        name: "Lille",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 50.629, lng: 3.057 },
        price_start: 890.00,
        top_places: ["Vieux-Lille", "Marcq-en-Barœul", "Bondues", "Lambersart"],
        zip: "59000",
        tier: 'GOLDEN',
        heroImage: "https://images.unsplash.com/photo-1577866068998-24bc8d46db6d?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "strasbourg",
        name: "Strasbourg",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 48.573, lng: 7.752 },
        price_start: 890.00,
        top_places: ["Orangerie", "Robertsau", "Contades", "Neudorf"],
        zip: "67000",
        tier: 'GOLDEN',
        heroImage: "https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "nantes",
        name: "Nantes",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 47.218, lng: -1.553 },
        price_start: 850.00,
        top_places: ["Procé", "Monselet", "Saint-Félix", "Carquefou"],
        zip: "44000",
        tier: 'HUB',
        heroImage: "https://images.unsplash.com/photo-1609671188873-b3a01e77d59c?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "rennes",
        name: "Rennes",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 48.117, lng: -1.677 },
        price_start: 850.00,
        top_places: ["Thabor", "Sévigné", "Saint-Grégoire", "Cesson-Sévigné"],
        zip: "35000",
        tier: 'HUB',
        heroImage: "https://images.unsplash.com/photo-1580657018950-e16b6d6db77c?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "montpellier",
        name: "Montpellier",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 43.611, lng: 3.877 },
        price_start: 850.00,
        top_places: ["Port Marianne", "Aiguelongue", "Castelnau-le-Lez", "Lattes"],
        zip: "34000",
        tier: 'HUB',
        heroImage: "https://images.unsplash.com/photo-1593259037804-f6e9b11adceb?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "annecy",
        name: "Annecy",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 45.899, lng: 6.129 },
        price_start: 950.00,
        top_places: ["Annecy-le-Vieux", "Veyrier-du-Lac", "Sevrier", "Pringy"],
        zip: "74000",
        tier: 'GOLDEN',
        heroImage: "https://images.unsplash.com/photo-1601461953939-36fbe4ed0b16?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "toulon",
        name: "Toulon",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 43.124, lng: 5.928 },
        price_start: 950.00,
        top_places: ["Mourillon", "Le Mont Faron", "Cap Brun", "Siblas"],
        zip: "83000",
        tier: 'HUB',
        heroImage: "https://images.unsplash.com/photo-1576494231340-2e9d3a98e0df?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "avignon",
        name: "Avignon",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 43.949, lng: 4.805 },
        price_start: 900.00,
        top_places: ["Palais des Papes", "Villeneuve-lès-Avignon", "Le Pontet", "Montfavet"],
        zip: "84000",
        tier: 'HUB',
        heroImage: "https://images.unsplash.com/photo-1557171611-9b5377d4c3b0?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "reims",
        name: "Reims",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 49.258, lng: 4.031 },
        price_start: 890.00,
        top_places: ["Cathédrale", "Cormontreuil", "Tinqueux", "Bétheny"],
        zip: "51100",
        tier: 'HUB',
        heroImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "dijon",
        name: "Dijon",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 47.322, lng: 5.041 },
        price_start: 890.00,
        top_places: ["Centre Historique", "Toison d'Or", "Fontaine-lès-Dijon", "Talant"],
        zip: "21000",
        tier: 'HUB',
        heroImage: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "rouen",
        name: "Rouen",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 49.443, lng: 1.099 },
        price_start: 890.00,
        top_places: ["Rive Droite", "Mont-Saint-Aignan", "Bois-Guillaume", "Sotteville"],
        zip: "76000",
        tier: 'HUB',
        heroImage: "https://images.unsplash.com/photo-1595838788874-a9df08cbf069?q=80&w=2670&auto=format&fit=crop"
    },

    // ========================================
    // ✈️ TIER 4: STRATEGIC SPOTS (Zones Périurbaines Riches)
    // ========================================
    {
        slug: "roissy-en-france",
        name: "Roissy-en-France",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 49.009, lng: 2.547 },
        price_start: 950.00,
        top_places: ["Tremblay-en-France", "Villepinte", "Goussainville", "Louvres"],
        zip: "95700",
        tier: 'STRATEGIC',
        heroImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "orly",
        name: "Orly",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 48.726, lng: 2.365 },
        price_start: 950.00,
        top_places: ["Thiais", "Rungis", "Choisy-le-Roi", "Athis-Mons"],
        zip: "94310",
        tier: 'STRATEGIC',
        heroImage: "https://images.unsplash.com/photo-1474302770737-173ee21bab63?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "beauvais",
        name: "Beauvais",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 49.455, lng: 2.113 },
        price_start: 900.00,
        top_places: ["Centre-Ville", "Tillé", "Allonne", "Voisinlieu"],
        zip: "60000",
        tier: 'STRATEGIC',
        heroImage: "https://images.unsplash.com/photo-1606768666853-403c90a981ad?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "saint-exupery",
        name: "Saint-Exupéry",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 45.723, lng: 5.081 },
        price_start: 950.00,
        top_places: ["Saint-Laurent-de-Mure", "Genas", "Meyzieu", "Pusignan"],
        zip: "69125",
        tier: 'STRATEGIC',
        heroImage: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "cagnes-sur-mer",
        name: "Cagnes-sur-Mer",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 43.666, lng: 7.215 },
        price_start: 1000.00,
        top_places: ["Cros-de-Cagnes", "Saint-Laurent-du-Var", "Villeneuve-Loubet", "La Colle-sur-Loup"],
        zip: "06800",
        tier: 'STRATEGIC',
        heroImage: "https://images.unsplash.com/photo-1558979158-65a1eaa08691?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "pays-de-gex",
        name: "Pays de Gex",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 46.238, lng: 6.109 },
        price_start: 1200.00,
        top_places: ["Ferney-Voltaire", "Divonne-les-Bains", "Saint-Genis-Pouilly", "Gex"],
        zip: "01210",
        tier: 'STRATEGIC',
        heroImage: "https://images.unsplash.com/photo-1580477371194-e8de0a57a04a?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "mulhouse",
        name: "Mulhouse",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 47.590, lng: 7.529 },
        price_start: 890.00,
        top_places: ["Saint-Louis", "Rixheim", "Kingersheim", "Wittenheim"],
        zip: "68100",
        tier: 'STRATEGIC',
        heroImage: "https://images.unsplash.com/photo-1515861461893-af66afaf3f1f?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "marne-la-vallee",
        name: "Marne-la-Vallée",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 48.876, lng: 2.779 },
        price_start: 950.00,
        top_places: ["Chessy", "Serris", "Bussy-Saint-Georges", "Val d'Europe"],
        zip: "77700",
        tier: 'STRATEGIC',
        heroImage: "https://images.unsplash.com/photo-1495753132225-3d4d2c8ce2e9?q=80&w=2670&auto=format&fit=crop"
    },
    // ========================================
    // 🌍 TIER 5: SOUTH-WEST EXPANSION
    // ========================================
    {
        slug: "pau",
        name: "Pau",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 43.295, lng: -0.370 },
        price_start: 850.00,
        top_places: ["Centre-Ville", "Trespoey", "Billère", "Lons"],
        zip: "64000",
        tier: 'STRATEGIC',
        heroImage: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "bayonne",
        name: "Bayonne",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 43.492, lng: -1.474 },
        price_start: 890.00,
        top_places: ["Grand Bayonne", "Petit Bayonne", "Anglet", "Saint-Esprit"],
        zip: "64100",
        tier: 'STRATEGIC',
        heroImage: "https://images.unsplash.com/photo-1558979158-65a1eaa08691?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "biarritz",
        name: "Biarritz",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 43.483, lng: -1.558 },
        price_start: 950.00,
        top_places: ["Côte des Basques", "Milady", "Saint-Charles", "La Négresse"],
        zip: "64200",
        tier: 'STRATEGIC',
        heroImage: "https://images.unsplash.com/photo-1580477371194-e8de0a57a04a?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "tarbes",
        name: "Tarbes",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 43.232, lng: 0.076 },
        price_start: 850.00,
        top_places: ["Centre-Ville", "Ormeau", "Aureilhan", "Laloubère"],
        zip: "65000",
        tier: 'STRATEGIC',
        heroImage: "https://images.unsplash.com/photo-1515861461893-af66afaf3f1f?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "agen",
        name: "Agen",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 44.203, lng: 0.616 },
        price_start: 850.00,
        top_places: ["Centre-Ville", "Ermitage", "Le Passage", "Boé"],
        zip: "47000",
        tier: 'STRATEGIC',
        heroImage: "https://images.unsplash.com/photo-1495753132225-3d4d2c8ce2e9?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "montauban",
        name: "Montauban",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 44.015, lng: 1.350 },
        price_start: 850.00,
        top_places: ["Centre Historique", "Villebourbon", "Saint-Martial", "Sapiac"],
        zip: "82000",
        tier: 'STRATEGIC',
        heroImage: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "albi",
        name: "Albi",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 43.928, lng: 2.148 },
        price_start: 850.00,
        top_places: ["Centre Historique", "Leuc", "Saint-Juéry", "Lescure-d'Albigeois"],
        zip: "81000",
        tier: 'STRATEGIC',
        heroImage: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=2672&auto=format&fit=crop"
    },
    {
        slug: "castres",
        name: "Castres",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 43.606, lng: 2.240 },
        price_start: 850.00,
        top_places: ["Lameilhé", "Aillot", "Burlats", "Lagarrigue"],
        zip: "81100",
        tier: 'STRATEGIC',
        heroImage: "https://images.unsplash.com/photo-1559825481-12a05cc00018?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "mont-de-marsan",
        name: "Mont-de-Marsan",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 43.890, lng: -0.500 },
        price_start: 850.00,
        top_places: ["Centre-Ville", "Saint-Médard", "Saint-Jean-d'Août", "Saint-Pierre-du-Mont"],
        zip: "40000",
        tier: 'STRATEGIC',
        heroImage: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "dax",
        name: "Dax",
        heroTitle: "Couvreur Toiture",
        geo: { lat: 43.710, lng: -1.050 },
        price_start: 850.00,
        top_places: ["Centre-Ville", "Saint-Vincent-de-Paul", "Narrosse", "Saint-Paul-lès-Dax"],
        zip: "40100",
        tier: 'STRATEGIC',
        heroImage: "https://images.unsplash.com/photo-1580477371194-e8de0a57a04a?q=80&w=2670&auto=format&fit=crop"
    }
];

// Helper to get a target by slug
export function getTargetBySlug(slug: string): NationalTarget | undefined {
    return NATIONAL_TARGETS.find(t => t.slug === slug);
}

// ========================================
// ADAPTER: Convert NationalTarget to CityConfig
// Uses pSEO for unique content per city
// ========================================
import { CityConfig } from "@/lib/db";

export function getTargetAsCityConfig(slug: string): CityConfig | undefined {
    const target = NATIONAL_TARGETS.find(t => t.slug === slug);
    if (!target) return undefined;

    const priceDisplay = "Sur Devis";
    const priceDesc = "Déplacement & Devis Gratuit";

    const title = `Artisan Couvreur ${target.name} | Urgence Fuite & Réparation Toiture`;
    const uniqueDescription = `Besoin d'un couvreur à ${target.name} (${target.zip}) ? Entreprise de couverture pour réfection de toit, recherche de fuite et étanchéité. Devis gratuit sous 24h.`;
    const uniqueMetaDescription = `Artisan couvreur ${target.name}. Dépannage fuite de toiture urgent, réfection et étanchéité de toit. Devis gratuit sous 24h. Garantie décennale.`;

    return {
        slug: target.slug,
        city: target.name,
        name: `Couvreur ${target.name}`,
        domain: `urgencecouverture.com/ville/${target.slug}`,
        heroImage: "https://images.unsplash.com/photo-1635424710928-0544e8512eae?q=80&w=2670&auto=format&fit=crop",

        postalCode: target.zip,
        department: target.zip.substring(0, 2),
        region: "France",

        description: uniqueDescription,
        geo: target.geo,

        features: [
            "Urgence Fuite",
            "Devis sous 24h",
            "Qualibat RGE",
            "Garantie Décennale",
            "Déplacement Gratuit"
        ],

        stations: [],
        hospitals: [],
        neighborhoods: target.top_places,

        points_of_interest: {
            hotels: [],
            nightlife: [],
            monuments: target.top_places,
            parking_difficulty: "High Demand"
        },

        pricing: {
            base: priceDisplay,
            description: priceDesc,
            km: 0
        },

        phoneNumber: "01 84 80 00 00",
        email: "contact@urgencecouverture.com",
        type: "PARTNER",
        targetType: "MIXED",

        meta: {
            title,
            description: uniqueMetaDescription
        }
    };
}

