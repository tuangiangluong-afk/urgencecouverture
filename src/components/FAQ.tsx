"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQProps {
    city?: string;
    type?: string;
    themeColor?: 'blue' | 'emerald' | 'amber' | 'purple' | 'orange';
}

export default function FAQ({ city, type, themeColor = 'orange' }: FAQProps) {
    const questions = [
        {
            q: "Combien coûte une réparation de toiture en urgence ?",
            a: "Une mise en sécurité d'urgence (bâchage temporaire après tempête ou recherche et colmatage immédiat d'une fuite de toit) coûte généralement entre 150€ et 450€ selon la difficulté d'accès et l'état des dégâts. Un devis définitif vous est remis pour les travaux de réfection pérennes."
        },
        {
            q: "Quelles sont les garanties sur vos travaux de toiture ?",
            a: "Tous nos travaux de couverture (pose de tuiles, ardoises, zinc), d'étanchéité et de charpente sont couverts par une garantie décennale de 10 ans. Cette assurance vous protège contre tout défaut de pose ou problème d'infiltrations affectant la structure de votre habitation."
        },
        {
            q: "Comment savoir s'il faut nettoyer ou rénover ma toiture ?",
            a: "Si vous constatez la présence importante de mousse, de lichens ou de traces sombres, un simple démoussage et un traitement hydrofuge peuvent suffire. En revanche, si des tuiles sont cassées, poreuses ou si des traces d'humidité apparaissent sur vos plafonds ou dans vos combles, une rénovation (partielle ou complète) est nécessaire."
        },
        {
            q: "Prenez-vous en charge la déclaration de sinistre assurance ?",
            a: "Oui, en cas de dégâts causés par une tempête, la grêle ou une catastrophe naturelle, nous vous fournissons un dossier complet comprenant des photos des dommages, un devis détaillé et une facture de mise en sécurité d'urgence pour faciliter votre prise en charge par votre assureur."
        },
        {
            q: "Pourquoi faire appel à un artisan couvreur qualifié RGE ?",
            a: "Faire appel à un couvreur certifié RGE (Reconnu Garant de l'Environnement) est obligatoire si vous souhaitez bénéficier des aides de l'État (comme MaPrimeRénov' ou la prime CEE) pour l'isolation thermique de votre toiture ou de vos combles."
        }
    ];

    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const themeStyles = {
        blue: "bg-blue-100 text-blue-700",
        emerald: "bg-emerald-100 text-emerald-700",
        amber: "bg-amber-100 text-amber-800",
        purple: "bg-purple-100 text-purple-700",
        orange: "bg-orange-100 text-orange-850"
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": questions.map(item => ({
            "@type": "Question",
            "name": item.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.a
            }
        }))
    };
    const badgeClass = themeStyles[themeColor] || themeStyles.orange;

    return (
        <section className="py-20 bg-slate-50 border-t border-slate-200">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${badgeClass}`}>
                        Questions Fréquentes
                    </span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                        Des questions sur vos travaux de toiture ?
                    </h2>
                    <p className="text-xl text-slate-600 mt-4">
                        Nous avons réuni les réponses pour vous aider à protéger votre maison des intempéries.
                    </p>
                </div>

                <div className="space-y-4">
                    {questions.map((item, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className="font-bold text-lg text-slate-900 pr-8">{item.q}</span>
                                <ChevronDown
                                    className={`text-slate-400 transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`}
                                />
                            </button>

                            <div
                                className={`
                                    overflow-hidden transition-all duration-300 ease-in-out
                                    ${openIndex === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
                                `}
                            >
                                <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-100">
                                    {item.a}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
