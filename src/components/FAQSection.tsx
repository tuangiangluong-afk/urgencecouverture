"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function FAQSection({ city }: { city?: string }) {
    // SEO-focused questions based on PAA (People Also Ask)
    
    const cityText = city ? ` à ${city}` : "";
    const cityPlural = city ? ` à ${city} et ses alentours` : "";
    const faqs = [
        {
            question: `Qui appeler en cas d'urgence fuite de toiture${cityText} ?`,
            answer: `En cas de fuite de toit, de tuiles arrachées ou d'infiltration d'eau immédiate, contactez un couvreur zingueur certifié${cityText}. Nos équipes interviennent sous 2 à 4 heures pour effectuer une mise hors d'eau temporaire (bâchage professionnel) afin de protéger votre habitation et d'arrêter les infiltrations.`
        },
        {
            question: `Quel est le prix moyen de réfection de toiture${cityText} ?`,
            answer: `Le coût moyen d'une réfection complète de couverture (tuiles, ardoises, zinc) se situe généralement entre 100€ et 250€ par m² de toiture, fournitures et pose comprises${cityPlural}. Ce montant dépend des matériaux choisis, de l'état de la charpente et de l'accessibilité de votre toit.`
        },
        {
            question: "Quelles démarches pour déclarer un sinistre toiture à l'assurance ?",
            answer: "Vous devez déclarer le sinistre (dégât des eaux ou tempête) à votre assureur sous 5 jours ouvrés. Nous vous fournissons immédiatement les photos des dégâts et un devis détaillé pour les réparations. Si une mise en sécurité d'urgence a été nécessaire, sa facture est également prise en charge par l'assurance."
        },
        {
            question: "Peut-on rénover une toiture en plein hiver ?",
            answer: "Oui, les travaux de toiture sont réalisables toute l'année, y compris en hiver. Nos équipes de couvreurs surveillent attentivement la météo et utilisent des bâches de protection professionnelles pour maintenir le bâtiment au sec pendant les phases d'ouverture du toit."
        }
    ];

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-black text-slate-900 mb-4">
                        Questions fréquentes
                    </h2>
                    <p className="text-slate-600">
                        Tout savoir sur vos travaux de couverture et toiture.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border border-slate-200 rounded-xl overflow-hidden">
                            <FAQItem question={faq.question} answer={faq.answer} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
            >
                <span className="font-bold text-slate-900 pr-8">{question}</span>
                {isOpen ? (
                    <Minus className="w-5 h-5 text-orange-600 shrink-0" />
                ) : (
                    <Plus className="w-5 h-5 text-slate-400 shrink-0" />
                )}
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="p-6 pt-0 text-slate-600 border-t border-slate-100 mt-2">
                    {answer}
                </div>
            </div>
        </div>
    );
}
