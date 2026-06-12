export interface SeoDestination {
    slug: string;
    name: string;
    type: 'airport' | 'station' | 'place';
    keywords: string[];
}

export interface SeoService {
    slug: string;
    title: string;
    description: string;
    keywords: string[];
}

export const SEO_DESTINATIONS: SeoDestination[] = [
    { slug: 'aeroport-orly', name: 'Aéroport d\'Orly (ORY)', type: 'airport', keywords: ['Orly', 'Aéroport Sud', 'Aéroport Ouest'] },
    { slug: 'aeroport-roissy-cdg', name: 'Aéroport Roissy CDG', type: 'airport', keywords: ['Roissy', 'Charles de Gaulle', 'CDG'] },
    { slug: 'gare-montparnasse', name: 'Gare Montparnasse', type: 'station', keywords: ['Gare Montparnasse', 'TGV Atlantique'] },
    { slug: 'gare-de-lyon', name: 'Gare de Lyon', type: 'station', keywords: ['Gare de Lyon', 'TGV Sud-Est'] },
    { slug: 'gare-du-nord', name: 'Gare du Nord', type: 'station', keywords: ['Gare du Nord', 'Eurostar'] },
    { slug: 'paris-centre', name: 'Paris Centre', type: 'place', keywords: ['Paris', 'Capitale'] },
    { slug: 'la-defense', name: 'La Défense', type: 'place', keywords: ['La Défense', 'Affaires'] },
];

export const SEO_SERVICES: SeoService[] = [
    {
        slug: 'installation-borne-maison',
        title: 'Borne Maison Individuelle',
        description: 'Installation de Wallbox 7kW à 22kW pour garage ou parking privé.',
        keywords: ['maison', 'pavillon', 'wallbox', 'domicile']
    },
    {
        slug: 'installation-borne-copropriete',
        title: 'Borne en Copropriété',
        description: 'Solutions pour syndics et résidents. Droit à la prise et facturation individuelle.',
        keywords: ['copropriété', 'syndic', 'immeuble', 'parking souterrain']
    },
    {
        slug: 'installation-borne-entreprise',
        title: 'Borne Entreprise & Flotte',
        description: 'Recharge pour collaborateurs et flotte de véhicules. Supervision et monétisation.',
        keywords: ['entreprise', 'flotte', 'parking pro', 'supervision']
    },
    {
        slug: 'installation-rapide',
        title: 'Dépannage & Maintenance',
        description: 'Service de maintenance et réparation de bornes toutes marques certifié IRVE.',
        keywords: ['dépannage', 'maintenance', 'sav', 'réparation']
    }
];
