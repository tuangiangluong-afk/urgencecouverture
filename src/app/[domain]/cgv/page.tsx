

import { getCity } from "@/lib/db";
import { notFound } from "next/navigation";
import { getTheme } from "@/lib/theme";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { CITIES } from "@/lib/db";

export async function generateMetadata({ params }: { params: Promise<{ domain: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const city = getCity(resolvedParams.domain);
    if (!city) return {};

    return {
        title: `Conditions Générales de Vente - ${city.name}`,
        description: `Retrouvez nos Conditions Générales de Vente (CGV) pour la mise en relation avec des artisans couvreurs : devis, responsabilités et litiges.`,
        alternates: {
            canonical: `https://${city.domain}/cgv`,
        },
    };
}

export default async function CGV({ params }: { params: Promise<{ domain: string }> }) {
    const resolvedParams = await params;
    const city = getCity(resolvedParams.domain);

    if (!city) {
        return notFound();
    }

    const theme = getTheme(city.slug);
    const classes = theme.classes;

    return (
        <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900">
            {/* Header */}
            <nav className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 px-4 py-3 backdrop-blur-md">
                <div className="container mx-auto flex items-center justify-between">
                    <Link
                        href="/"
                        className={`flex items-center gap-2 text-sm font-bold ${theme.text} hover:opacity-80 transition`}
                    >
                        <ArrowLeft size={16} />
                        Retour au site
                    </Link>
                    <span className="text-sm font-bold text-neutral-900">
                        {city.name}<span className={`text-${theme.primary}-400`}>.</span>
                    </span>
                </div>
            </nav>

            <main className="container mx-auto max-w-3xl px-4 py-12 lg:py-20 mb-20">
                <h1 className="mb-8 text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl">
                    Conditions Générales de Vente (CGV)
                </h1>

                <div className="prose prose-neutral prose-lg max-w-none">
                    <div className="mb-8 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                        <p className="text-sm text-neutral-500">Dernière mise à jour : 25/01/2026</p>
                        <p>
                            Les présentes Conditions Générales de Vente (ci-après &quot;CGV&quot;) régissent les relations contractuelles entre la société <strong>WELINK TECH</strong>, sise au 6 RUE DES BATELIERS, 92110 CLICHY (SIREN 984 800 136), ci-après &quot;L&apos;Éditeur&quot;, et toute personne utilisant le site <strong>{city.domain}</strong> pour la mise en relation avec des artisans couvreurs et professionnels de la toiture, ci-après &quot;Le Client&quot;.
                        </p>
                    </div>

                    <div className="mb-8 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                        <h2 className={`mb-4 text-2xl font-bold ${theme.text}`}>1. Objet et Acceptation</h2>
                        <p>
                            Le service proposé est la mise en relation avec des artisans couvreurs professionnels spécialisés en travaux de toiture (rénovation, réparation de fuites, zinguerie, charpente, nettoyage) exerçant sur la commune de <strong>{city.city}</strong>. L'utilisation du formulaire de demande de devis ou l'appel téléphonique via le site implique l'acceptation sans réserve des présentes CGV.
                        </p>
                    </div>

                    <div className="mb-8 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                        <h2 className={`mb-4 text-2xl font-bold ${theme.text}`}>2. Réservations et Tarifs</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Demande de devis :</strong> L&apos;utilisateur remplit un formulaire précisant son besoin (réparation de fuite, rénovation complète, nettoyage de toiture, travaux de zinguerie ou isolation).</li>
                            <li><strong>Évaluation initiale :</strong> Une pré-estimation ou un diagnostic de la situation (notamment en cas d'urgence fuite) est réalisé gratuitement.</li>
                            <li><strong>Tarification :</strong> Le service de mise en relation et l&apos;établissement des devis par nos partenaires sont gratuits pour l&apos;utilisateur. Le prix final des travaux est déterminé par le couvreur partenaire après visite technique.</li>
                        </ul>
                    </div>

                    <div className="mb-8 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                        <h2 className={`mb-4 text-2xl font-bold ${theme.text}`}>3. Annulation et Retards</h2>
                        <p>
                            Toute demande peut être annulée ou modifiée tant que le couvreur partenaire n&apos;est pas intervenu sur place ou que le devis n&apos;a pas été accepté.
                        </p>
                        <p>
                            L&apos;Éditeur ne saurait être tenu responsable des retards ou des contraintes techniques ou météorologiques empêchant la réalisation des travaux par les artisans partenaires.
                        </p>
                    </div>

                    <div className="mb-8 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                        <h2 className={`mb-4 text-2xl font-bold ${theme.text}`}>4. Responsabilités</h2>
                        <p>
                            WELINK TECH agit en qualité d&apos;apporteur d&apos;affaires et de plateforme technologique. La responsabilité des travaux (sécurité du chantier, étanchéité de la toiture, conformité aux règles de l'art/DTU, assurance décennale et responsabilité civile professionnelle) incombe exclusivement au couvreur partenaire exécutant les travaux.
                        </p>
                    </div>

                    <div className="mb-8 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                        <h2 className={`mb-4 text-2xl font-bold ${theme.text}`}>5. Loi Applicable</h2>
                        <p>
                            Les présentes CGV sont soumises au droit français. Tout litige relatif à leur interprétation et/ou à leur exécution relève des tribunaux compétents de Nanterre.
                        </p>
                    </div>
                </div>
            </main>
            <Footer config={CITIES[resolvedParams.domain]} />
        </div>
    );
}
