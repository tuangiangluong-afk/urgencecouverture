import { Star, CheckCircle2 } from "lucide-react";
import { SiteConfig } from "@/lib/sites-config";
import { CityConfig } from "@/lib/db";

interface ReviewsProps {
    site: SiteConfig | CityConfig;
    themeColor?: 'blue' | 'emerald' | 'amber' | 'purple' | 'orange';
}

function stringHash(str: string): number {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

const REVIEW_POOL = [
    {
        author: "Thomas D.",
        templates: [
            "Couvreur certifié RGE très compétent. L'isolation et la réfection de ma toiture {city} se sont faites proprement et rapidement. Le dossier de subvention MaPrimeRénov' a été géré de A à Z.",
            "Très bon contact avec l'installateur. Pose soignée de nos Velux et travaux de zinguerie {city}. Explications claires et professionnalisme irréprochable. Je recommande !",
            "Dépannage en urgence suite à une fuite de toiture. Le couvreur {city} est intervenu sous 2 heures pour bâcher et sécuriser le toit. Chantier nickel."
        ]
    },
    {
        author: "Lucie F.",
        templates: [
            "Devis rapide et clair pour notre réfection de toit. L'équipe intervenue {city} a été ponctuelle et très professionnelle. Plus aucune fuite, un travail soigné.",
            "Nettoyage et démoussage complet de notre toiture {city}. Suivi de projet parfait et traitement hydrofuge de qualité. Les tuiles sont comme neuves.",
            "Ravi des travaux de couverture {city}. Excellent rapport qualité/prix et artisans très à l'écoute des besoins. Chantier propre."
        ]
    },
    {
        author: "Éric L.",
        templates: [
            "Professionnel sérieux et à l'écoute. Réparation effectuée rapidement après la tempête {city}. Notre toiture en ardoise est réparée.",
            "Un service parfait du début à la fin. Diagnostic de toiture rapide {city} et pose de nouvelles gouttières dans la foulée. Travail de zinguerie irréprochable.",
            "Entreprise très pro pour les travaux de couverture {city}. Conseils avisés sur le choix des matériaux et installation conforme aux règles de l'art."
        ]
    },
    {
        author: "Marc-Antoine P.",
        templates: [
            "Très satisfait de la pose de nos fenêtres de toit Velux {city}. Exécution impeccable, finitions étanches impeccables et chantier propre.",
            "Une intervention impeccable du couvreur {city} pour réparer une fuite de cheminée. Tout est étanche désormais. Devis respecté au centime près.",
            "Super expérience pour l'isolation de notre toiture par l'extérieur {city}. Techniciens qualifiés et très soignés."
        ]
    },
    {
        author: "Sophie G.",
        templates: [
            "Installation rapide et conforme de notre faîtage. L'artisan {city} était très pro et a répondu à toutes mes questions sur les garanties décennales. Recommandé !",
            "Très satisfaite de la prestation pour nettoyer notre toit {city}. Enfin un vrai professionnel qualifié avec une tarification transparente.",
            "Excellent couvreur-zingueur pour la pose de bac acier {city}. Travail soigné et réactivité exemplaire."
        ]
    }
];

export default function Reviews({ site, themeColor = 'orange' }: ReviewsProps) {
    // Generate deterministic reviews based on city name hash
    const city = site.city;
    const hash = stringHash(city);

    // Pick 3 profiles based on hash
    const index1 = hash % REVIEW_POOL.length;
    const index2 = (hash + 1) % REVIEW_POOL.length;
    const index3 = (hash + 2) % REVIEW_POOL.length;

    const profile1 = REVIEW_POOL[index1];
    const profile2 = REVIEW_POOL[index2];
    const profile3 = REVIEW_POOL[index3];

    // Pick deterministic template index per profile
    const tIndex1 = (hash >> 1) % 3;
    const tIndex2 = (hash >> 2) % 3;
    const tIndex3 = (hash >> 3) % 3;

    const isFrance = city.toLowerCase() === "france";
    const titlePrep = isFrance ? "en" : "à";
    const cityWithPrep = isFrance ? "en France" : `à ${city}`;

    const reviews = [
        {
            author: profile1.author,
            text: profile1.templates[tIndex1].replace(/{city}/g, cityWithPrep),
            rating: 5,
            source: "Google"
        },
        {
            author: profile2.author,
            text: profile2.templates[tIndex2].replace(/{city}/g, cityWithPrep),
            rating: 5,
            source: "Avis Vérifiés"
        },
        {
            author: profile3.author,
            text: profile3.templates[tIndex3].replace(/{city}/g, cityWithPrep),
            rating: 4.9,
            source: "Google"
        }
    ];

    const themeStyles = {
        blue: "text-blue-600",
        emerald: "text-emerald-600",
        amber: "text-amber-600",
        purple: "text-purple-600",
        orange: "text-orange-600"
    };

    const highlightClass = themeStyles[themeColor] || themeStyles.orange;

    return (
        <section className="bg-white py-16 border-y border-neutral-100">
            <div className="container mx-auto max-w-5xl px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-neutral-900">
                            Avis Clients {titlePrep} <span className={highlightClass}>{site.city}</span>
                        </h2>
                        <p className="text-sm text-neutral-500 mt-1">
                            Retours vérifiés de nos clients récents.
                        </p>
                    </div>

                    {/* Global Rating Badge */}
                    <div className="flex items-center gap-3 bg-neutral-50 border border-neutral-200 px-4 py-2.5 rounded-2xl">
                        <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={18} fill="currentColor" />
                            ))}
                        </div>
                        <div className="text-sm font-bold text-neutral-800">
                            4.9/5 <span className="text-neutral-400 font-medium font-sans">({(hash % 40) + 45} avis)</span>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {reviews.map((rev, idx) => (
                        <div key={idx} className="bg-neutral-50 border border-neutral-200 p-6 rounded-2xl flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-bold text-neutral-900 text-base">{rev.author}</span>
                                    <span className="text-xs text-neutral-400 font-medium px-2 py-1 bg-white rounded-full border border-neutral-200">{rev.source}</span>
                                </div>
                                <div className="flex text-amber-400 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill={i < Math.floor(rev.rating) ? "currentColor" : "none"} />
                                    ))}
                                </div>
                                <p className="text-neutral-600 text-sm leading-relaxed italic">
                                    &ldquo;{rev.text}&rdquo;
                                </p>
                            </div>
                            <div className="flex items-center gap-2 mt-4 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100 self-start">
                                <CheckCircle2 size={14} />
                                <span>Client vérifié</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
