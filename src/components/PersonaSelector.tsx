"use client";

import { Building2, Home, Briefcase, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PersonaSelector() {
    const personas = [
        {
            title: "Je suis Particulier",
            subtitle: "Maison & Villa",
            icon: Home,
            href: "/solutions/maison",
            color: "blue",
            desc: "Installation rapide 7kW ou 22kW. Crédit d'impôt 500€."
        },
        {
            title: "Je suis Syndic / Copro",
            subtitle: "Résidences & Immeubles",
            icon: Building2,
            href: "/solutions/copropriete",
            color: "emerald",
            desc: "Solution financée Advenir. Zéro frais pour le syndic."
        },
        {
            title: "Je suis une Entreprise",
            subtitle: "Flottes & Parkings",
            icon: Briefcase,
            href: "/solutions/entreprise",
            color: "amber",
            desc: "Supervision, refacturation et gestion de flotte."
        }
    ];

    return (
        <section className="py-12 bg-white relative z-30 -mt-16 mx-4">
            <div className="container mx-auto">
                <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto shadow-2xl rounded-3xl overflow-hidden border border-slate-100 bg-white">
                    {personas.map((p, i) => (
                        <Link
                            key={i}
                            href={p.href}
                            className={`
                                group relative p-8 flex flex-col items-start gap-4 transition-all duration-300
                                ${i !== personas.length - 1 ? 'border-b lg:border-b-0 lg:border-r border-slate-100' : ''}
                                hover:bg-slate-50
                            `}
                        >
                            <div className={`
                                w-14 h-14 rounded-2xl flex items-center justify-center
                                bg-${p.color}-100 text-${p.color}-600
                                group-hover:scale-110 transition-transform duration-300
                            `}>
                                <p.icon size={28} />
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                    {p.title}
                                </h3>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                    {p.subtitle}
                                </p>
                                <p className="text-slate-600 leading-relaxed text-sm">
                                    {p.desc}
                                </p>
                            </div>

                            <div className="mt-auto pt-4 flex items-center text-sm font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                                Découvrir l'offre <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
