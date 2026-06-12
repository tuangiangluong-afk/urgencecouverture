import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mentions Légales - Urgence Couverture",
    description: "Mentions légales, éditeur, hébergement et politique de confidentialité du réseau Urgence Couverture.",
};

export default function MentionsLegales() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-neutral-900">
            {/* Header */}
            <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-900/90 px-4 py-3 backdrop-blur-md text-white">
                <div className="container mx-auto flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm font-bold hover:text-orange-400 transition"
                    >
                        <ArrowLeft size={16} />
                        Retour Accueil
                    </Link>
                    <span className="text-sm font-bold">
                        Urgence Couverture<span className="text-orange-500">.</span>
                    </span>
                </div>
            </nav>

            <main className="container mx-auto max-w-3xl px-4 py-12 lg:py-20">
                <h1 className="mb-8 text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl">
                    Mentions Légales
                </h1>

                <div className="prose prose-neutral prose-lg max-w-none">
                    <div className="mb-8 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                        <h2 className="mb-4 text-2xl font-bold text-orange-900">1. Éditeur du Site</h2>
                        <p>
                            Le site <strong>Urgence Couverture</strong> (urgencecouverture.com) est édité par la société <strong>WELINK TECH</strong>.
                        </p>
                        <ul className="list-none space-y-2 pl-0">
                            <li><strong>Forme juridique :</strong> SASU</li>
                            <li><strong>Siège social :</strong> 6 RUE DES BATELIERS, 92110 CLICHY</li>
                            <li><strong>SIREN :</strong> 984 800 136</li>
                            <li><strong>SIRET :</strong> 984 800 136 00017</li>
                            <li><strong>Responsable de publication :</strong> Direction WELINK TECH</li>
                            <li><strong>Contact :</strong> <Link href="/contact" className="underline text-orange-600">Formulaire de contact</Link></li>
                        </ul>
                    </div>

                    <div className="mb-8 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                        <h2 className="mb-4 text-2xl font-bold text-orange-900">2. Service Proposé</h2>
                        <p>
                            Urgence Couverture est une plateforme nationale de mise en relation entre les particuliers ou entreprises et des artisans couvreurs qualifiés certifiés Qualibat RGE ou spécialisés en dépannage urgent de fuite de toiture.
                        </p>
                    </div>

                    <div className="mb-8 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                        <h2 className="mb-4 text-2xl font-bold text-orange-900">3. Hébergement</h2>
                        <p>
                            Le Site est hébergé par la société <strong>Vercel Inc.</strong>
                        </p>
                        <ul className="list-none space-y-2 pl-0">
                            <li><strong>Adresse :</strong> 340 S Lemon Ave #4133 Walnut, CA 91789, USA</li>
                            <li><strong>Cloud Provider :</strong> Infrastructure AWS / Vercel Edge Network</li>
                        </ul>
                    </div>

                    <div className="mb-8 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                        <h2 className="mb-4 text-2xl font-bold text-orange-900">4. Propriété Intellectuelle</h2>
                        <p>
                            L&apos;ensemble des contenus (textes, images, base de données, marque &quot;Urgence Couverture&quot;) est protégé par le droit de la propriété intellectuelle. Toute reproduction non autorisée est interdite.
                        </p>
                    </div>

                    <div className="mb-8 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                        <h2 className="mb-4 text-2xl font-bold text-orange-900">5. Données Personnelles (RGPD)</h2>
                        <p>
                            Les données collectées (nom, téléphone, adresse de toiture, nature du projet, degré d'urgence) sont utilisées uniquement pour l'établissement de devis, la gestion des demandes urgentes de dépannage de fuites et la mise en relation avec nos partenaires couvreurs certifiés.
                        </p>
                        <p>
                            Vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données. Pour l&apos;exercer, contactez-nous via la page contact.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
