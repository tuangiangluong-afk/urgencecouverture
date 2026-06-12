/**
 * French Cities Data for Programmatic SEO
 * 
 * Top 100+ cities by population and wealth for IRVE lead generation.
 * Used to generate /installation/[city] pages on the hub.
 */

export interface CityData {
    slug: string;          // URL slug (e.g., "paris", "lyon")
    name: string;          // Display name
    department: string;    // Department number
    departmentName: string;// Department name
    region: string;        // Region name
    population: number;    // Population (for prioritization)
    postalCode: string;    // Main postal code
    wealthIndex?: number;  // 1-10 (higher = richer, better for leads)
    hasSniper?: boolean;   // True if we have a dedicated sniper domain
    sniperDomain?: string; // The sniper domain if exists
}

// Top French cities for IRVE targeting
export const FRENCH_CITIES: CityData[] = [
    // Île-de-France - PREMIUM
    { slug: "paris", name: "Paris", department: "75", departmentName: "Paris", region: "Île-de-France", population: 2161000, postalCode: "75000", wealthIndex: 9, hasSniper: true, sniperDomain: "bornerechargeparis.fr" },
    { slug: "neuilly-sur-seine", name: "Neuilly-sur-Seine", department: "92", departmentName: "Hauts-de-Seine", region: "Île-de-France", population: 62000, postalCode: "92200", wealthIndex: 10, hasSniper: true, sniperDomain: "borne-recharge-neuilly.fr" },
    { slug: "boulogne-billancourt", name: "Boulogne-Billancourt", department: "92", departmentName: "Hauts-de-Seine", region: "Île-de-France", population: 121000, postalCode: "92100", wealthIndex: 9 },
    { slug: "levallois-perret", name: "Levallois-Perret", department: "92", departmentName: "Hauts-de-Seine", region: "Île-de-France", population: 65000, postalCode: "92300", wealthIndex: 9 },
    { slug: "issy-les-moulineaux", name: "Issy-les-Moulineaux", department: "92", departmentName: "Hauts-de-Seine", region: "Île-de-France", population: 69000, postalCode: "92130", wealthIndex: 8 },
    { slug: "saint-germain-en-laye", name: "Saint-Germain-en-Laye", department: "78", departmentName: "Yvelines", region: "Île-de-France", population: 46000, postalCode: "78100", wealthIndex: 9 },
    { slug: "versailles", name: "Versailles", department: "78", departmentName: "Yvelines", region: "Île-de-France", population: 85000, postalCode: "78000", wealthIndex: 9 },
    { slug: "vincennes", name: "Vincennes", department: "94", departmentName: "Val-de-Marne", region: "Île-de-France", population: 50000, postalCode: "94300", wealthIndex: 8 },
    { slug: "saint-mande", name: "Saint-Mandé", department: "94", departmentName: "Val-de-Marne", region: "Île-de-France", population: 22000, postalCode: "94160", wealthIndex: 9 },
    { slug: "rueil-malmaison", name: "Rueil-Malmaison", department: "92", departmentName: "Hauts-de-Seine", region: "Île-de-France", population: 80000, postalCode: "92500", wealthIndex: 8 },

    // Grandes métropoles
    { slug: "lyon", name: "Lyon", department: "69", departmentName: "Rhône", region: "Auvergne-Rhône-Alpes", population: 522000, postalCode: "69000", wealthIndex: 8, hasSniper: true, sniperDomain: "borne-recharge-lyon.fr" },
    { slug: "marseille", name: "Marseille", department: "13", departmentName: "Bouches-du-Rhône", region: "Provence-Alpes-Côte d'Azur", population: 870000, postalCode: "13000", wealthIndex: 6 },
    { slug: "toulouse", name: "Toulouse", department: "31", departmentName: "Haute-Garonne", region: "Occitanie", population: 486000, postalCode: "31000", wealthIndex: 7 },
    { slug: "nice", name: "Nice", department: "06", departmentName: "Alpes-Maritimes", region: "Provence-Alpes-Côte d'Azur", population: 341000, postalCode: "06000", wealthIndex: 8 },
    { slug: "nantes", name: "Nantes", department: "44", departmentName: "Loire-Atlantique", region: "Pays de la Loire", population: 314000, postalCode: "44000", wealthIndex: 7 },
    { slug: "strasbourg", name: "Strasbourg", department: "67", departmentName: "Bas-Rhin", region: "Grand Est", population: 287000, postalCode: "67000", wealthIndex: 7 },
    { slug: "montpellier", name: "Montpellier", department: "34", departmentName: "Hérault", region: "Occitanie", population: 290000, postalCode: "34000", wealthIndex: 6 },
    { slug: "bordeaux", name: "Bordeaux", department: "33", departmentName: "Gironde", region: "Nouvelle-Aquitaine", population: 260000, postalCode: "33000", wealthIndex: 8 },
    { slug: "lille", name: "Lille", department: "59", departmentName: "Nord", region: "Hauts-de-France", population: 236000, postalCode: "59000", wealthIndex: 7 },
    { slug: "rennes", name: "Rennes", department: "35", departmentName: "Ille-et-Vilaine", region: "Bretagne", population: 222000, postalCode: "35000", wealthIndex: 7 },

    // Côte d'Azur - PREMIUM
    { slug: "cannes", name: "Cannes", department: "06", departmentName: "Alpes-Maritimes", region: "Provence-Alpes-Côte d'Azur", population: 74000, postalCode: "06400", wealthIndex: 9 },
    { slug: "antibes", name: "Antibes", department: "06", departmentName: "Alpes-Maritimes", region: "Provence-Alpes-Côte d'Azur", population: 73000, postalCode: "06600", wealthIndex: 8 },
    { slug: "saint-tropez", name: "Saint-Tropez", department: "83", departmentName: "Var", region: "Provence-Alpes-Côte d'Azur", population: 4000, postalCode: "83990", wealthIndex: 10 },
    { slug: "monaco", name: "Monaco", department: "MC", departmentName: "Monaco", region: "Monaco", population: 39000, postalCode: "98000", wealthIndex: 10 },

    // Autres grandes villes
    { slug: "grenoble", name: "Grenoble", department: "38", departmentName: "Isère", region: "Auvergne-Rhône-Alpes", population: 158000, postalCode: "38000", wealthIndex: 7 },
    { slug: "aix-en-provence", name: "Aix-en-Provence", department: "13", departmentName: "Bouches-du-Rhône", region: "Provence-Alpes-Côte d'Azur", population: 147000, postalCode: "13100", wealthIndex: 8 },
    { slug: "annecy", name: "Annecy", department: "74", departmentName: "Haute-Savoie", region: "Auvergne-Rhône-Alpes", population: 130000, postalCode: "74000", wealthIndex: 8 },
    { slug: "dijon", name: "Dijon", department: "21", departmentName: "Côte-d'Or", region: "Bourgogne-Franche-Comté", population: 159000, postalCode: "21000", wealthIndex: 7 },
    { slug: "nimes", name: "Nîmes", department: "30", departmentName: "Gard", region: "Occitanie", population: 151000, postalCode: "30000", wealthIndex: 6 },
    { slug: "clermont-ferrand", name: "Clermont-Ferrand", department: "63", departmentName: "Puy-de-Dôme", region: "Auvergne-Rhône-Alpes", population: 147000, postalCode: "63000", wealthIndex: 6 },
    { slug: "tours", name: "Tours", department: "37", departmentName: "Indre-et-Loire", region: "Centre-Val de Loire", population: 136000, postalCode: "37000", wealthIndex: 7 },
    { slug: "angers", name: "Angers", department: "49", departmentName: "Maine-et-Loire", region: "Pays de la Loire", population: 155000, postalCode: "49000", wealthIndex: 6 },
    { slug: "le-mans", name: "Le Mans", department: "72", departmentName: "Sarthe", region: "Pays de la Loire", population: 144000, postalCode: "72000", wealthIndex: 6 },
    { slug: "reims", name: "Reims", department: "51", departmentName: "Marne", region: "Grand Est", population: 187000, postalCode: "51100", wealthIndex: 6 },
    { slug: "toulon", name: "Toulon", department: "83", departmentName: "Var", region: "Provence-Alpes-Côte d'Azur", population: 178000, postalCode: "83000", wealthIndex: 6 },
    { slug: "le-havre", name: "Le Havre", department: "76", departmentName: "Seine-Maritime", region: "Normandie", population: 175000, postalCode: "76600", wealthIndex: 5 },
    { slug: "rouen", name: "Rouen", department: "76", departmentName: "Seine-Maritime", region: "Normandie", population: 112000, postalCode: "76000", wealthIndex: 6 },
    { slug: "caen", name: "Caen", department: "14", departmentName: "Calvados", region: "Normandie", population: 106000, postalCode: "14000", wealthIndex: 6 },
    { slug: "metz", name: "Metz", department: "57", departmentName: "Moselle", region: "Grand Est", population: 120000, postalCode: "57000", wealthIndex: 6 },
    { slug: "nancy", name: "Nancy", department: "54", departmentName: "Meurthe-et-Moselle", region: "Grand Est", population: 105000, postalCode: "54000", wealthIndex: 6 },
    { slug: "perpignan", name: "Perpignan", department: "66", departmentName: "Pyrénées-Orientales", region: "Occitanie", population: 121000, postalCode: "66000", wealthIndex: 5 },
    { slug: "orleans", name: "Orléans", department: "45", departmentName: "Loiret", region: "Centre-Val de Loire", population: 116000, postalCode: "45000", wealthIndex: 6 },
    { slug: "mulhouse", name: "Mulhouse", department: "68", departmentName: "Haut-Rhin", region: "Grand Est", population: 110000, postalCode: "68100", wealthIndex: 5 },
    { slug: "besancon", name: "Besançon", department: "25", departmentName: "Doubs", region: "Bourgogne-Franche-Comté", population: 117000, postalCode: "25000", wealthIndex: 6 },
    { slug: "brest", name: "Brest", department: "29", departmentName: "Finistère", region: "Bretagne", population: 140000, postalCode: "29200", wealthIndex: 6 },
    { slug: "la-rochelle", name: "La Rochelle", department: "17", departmentName: "Charente-Maritime", region: "Nouvelle-Aquitaine", population: 77000, postalCode: "17000", wealthIndex: 7 },
    { slug: "pau", name: "Pau", department: "64", departmentName: "Pyrénées-Atlantiques", region: "Nouvelle-Aquitaine", population: 77000, postalCode: "64000", wealthIndex: 7 },
    { slug: "biarritz", name: "Biarritz", department: "64", departmentName: "Pyrénées-Atlantiques", region: "Nouvelle-Aquitaine", population: 25000, postalCode: "64200", wealthIndex: 9 },
    { slug: "arcachon", name: "Arcachon", department: "33", departmentName: "Gironde", region: "Nouvelle-Aquitaine", population: 11000, postalCode: "33120", wealthIndex: 9 },
];

// Helper functions
export function getCityBySlug(slug: string): CityData | undefined {
    return FRENCH_CITIES.find(c => c.slug === slug);
}

export function getCitiesByRegion(region: string): CityData[] {
    return FRENCH_CITIES.filter(c => c.region === region);
}

export function getCitiesByDepartment(department: string): CityData[] {
    return FRENCH_CITIES.filter(c => c.department === department);
}

export function getPremiumCities(minWealthIndex: number = 8): CityData[] {
    return FRENCH_CITIES.filter(c => (c.wealthIndex || 0) >= minWealthIndex);
}

export function getCitiesWithSnipers(): CityData[] {
    return FRENCH_CITIES.filter(c => c.hasSniper);
}

export function getAllCitySlugs(): string[] {
    return FRENCH_CITIES.map(c => c.slug);
}
