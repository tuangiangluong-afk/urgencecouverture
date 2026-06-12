import { CityConfig } from "@/lib/db";

interface LocalFAQProps {
    site: CityConfig;
    segment: "B2C" | "COPRO" | "ENTREPRISE";
}

export function LocalFAQ({ site, segment }: LocalFAQProps) {
    const city = site.city;
    const faqs = getLocalFAQData(city, site.department, segment);

    return (
        <section className="py-16 bg-slate-50 border-t border-slate-200">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900">
                        Questions fréquentes à {city}
                    </h2>
                    <p className="text-slate-600 mt-3 text-lg">
                        Tout savoir sur les travaux de toiture, couverture et dépannage fuite.
                    </p>
                </div>
                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <details 
                            key={idx} 
                            className="group bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
                            {...(idx === 0 ? { open: true } : {})}
                        >
                            <summary className="flex items-center justify-between cursor-pointer p-6 text-lg font-bold text-slate-900 hover:bg-slate-50 transition-colors list-none [&::-webkit-details-marker]:hidden">
                                <span>{faq.question}</span>
                                <span className="ml-4 shrink-0 text-slate-400 group-open:rotate-45 transition-transform text-2xl font-light">+</span>
                            </summary>
                            <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                                {faq.answer}
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}

function cityHash(city: string): number {
    let hash = 0;
    for (let i = 0; i < city.length; i++) {
        hash = ((hash << 5) - hash + city.charCodeAt(i)) | 0;
    }
    return Math.abs(hash);
}

// Exported for SchemaJSON to generate FAQPage structured data
export function getLocalFAQData(city: string, department: string | undefined, segment: "B2C" | "COPRO" | "ENTREPRISE") {
    const dept = department || "votre département";
    const h = cityHash(city);

    if (segment === "COPRO") {
        const coproCount = 8 + (h % 25);
        return [
            {
                question: `Qui paye pour la rénovation de toiture en copropriété à ${city} ?`,
                answer: `La toiture d'un immeuble à ${city} étant une partie commune, les travaux de réfection ou de réparation sont votés en AG et répartis entre tous les copropriétaires selon leurs millièmes de copropriété (tantièmes).`
            },
            {
                question: `Quelles démarches pour réparer une fuite de toit en copropriété à ${city} ?`,
                answer: `En cas de fuite de toiture à ${city}, il faut immédiatement contacter le syndic de copropriété. C'est lui qui mandate un couvreur pour intervenir en urgence et qui déclare le sinistre aux assurances. Plus de ${coproCount} résidences du ${dept} nous ont fait confiance.`
            },
            {
                question: `Comment isoler la toiture d'un immeuble en copropriété à ${city} ?`,
                answer: `L'isolation thermique du toit ou des combles de l'immeuble se vote en assemblée générale. Nous réalisons une étude technique et thermique préalable gratuite pour proposer la meilleure solution (sarking ou isolation des combles perdus) aux copropriétaires.`
            }
        ];
    } else if (segment === "ENTREPRISE") {
        const entrepriseCount = 15 + (h % 35);
        return [
            {
                question: `Quelles solutions d'étanchéité pour la toiture d'un bâtiment industriel ou commercial à ${city} ?`,
                answer: `Pour les toits plats et terrasses de bâtiments professionnels à ${city}, nous installons des membranes d'étanchéité bitumineuse, synthétique (PVC/TPO) ou de l'asphalte, adaptées aux contraintes de charge et d'usage de votre bâtiment. Plus de ${entrepriseCount} entreprises du ${dept} nous ont sollicités.`
            },
            {
                question: `Comment entretenir la toiture d'un bâtiment professionnel à ${city} ?`,
                answer: `Il est fortement recommandé de souscrire un contrat d'entretien annuel de toiture à ${city}. Nos couvreurs inspectent les évacuations d'eau pluviale, nettoient les chéneaux, vérifient les joints de dilatation et détectent les signes d'usure prématurée.`
            },
            {
                question: `Peut-on installer du photovoltaïque ou végétaliser le toit d'un bâtiment professionnel à ${city} ?`,
                answer: `Oui, nous réalisons des études de charge de toiture à ${city} pour valider la faisabilité d'une végétalisation (rétention d'eau, isolation thermique) ou de l'installation de panneaux solaires en conformité avec la réglementation.`
            }
        ];
    } else {
        const installCount = 40 + (h % 80);
        return [
            {
                question: `Quel est le prix d'une rénovation ou réparation de toiture à ${city} ?`,
                answer: `Le coût d'une intervention de couverture à ${city} varie selon les travaux : de 150€ à 500€ pour une réparation de fuite simple ou le remplacement de quelques tuiles, et de 100€ à 250€ par m² pour une réfection complète de toiture (dépose, liteonnage, couverture neuve). Devis gratuit et personnalisé sous 24h.`
            },
            {
                question: `Combien de temps prend une intervention de couvreur à ${city} ?`,
                answer: `Pour une urgence fuite ou un dépannage après tempête à ${city}, nos couvreurs interviennent sous 2 à 4 heures pour une mise en sécurité temporaire (bâchage). Une rénovation complète de toiture prend en moyenne 3 à 7 jours de chantier selon la météo et la surface. Plus de ${installCount} chantiers ont été menés à bien dans le ${dept} récemment.`
            },
            {
                question: `Quelles garanties pour des travaux de toiture à ${city} ?`,
                answer: `Tous nos travaux de couverture, de zinguerie et d'étanchéité réalisés à ${city} sont couverts par une assurance décennale (garantie de 10 ans sur la solidité de l'ouvrage et l'étanchéité). De plus, nos couvreurs partenaires possèdent les certifications RGE Qualibat pour vous faire bénéficier des aides.`
            }
        ];
    }
}
