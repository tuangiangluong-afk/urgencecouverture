import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Glossaire technique et définitions | urgencecouverture",
    description: "Découvrez notre glossaire complet pour comprendre tous les termes techniques et réglementaires de votre projet.",
};

export default function GlossairePage() {
    // Schema AEO: DefinedTermSet for AI Overviews
    const schema = {
        "@context": "https://schema.org",
        "@type": "DefinedTermSet",
        "name": "Glossaire Technique",
        "hasDefinedTerm": [
            { "@type": "DefinedTerm", "name": "RGE", "description": "Reconnu Garant de l'Environnement" }
            // Soloca will fill this array later
        ]
    };

    return (
        <div className="min-h-screen flex flex-col">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
            <Header />
            <main className="flex-grow pt-24 pb-16 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Glossaire Technique</h1>
                    <p className="text-lg text-gray-600 mb-12">
                        Retrouvez toutes les définitions des termes techniques liés à votre projet.
                    </p>
                    {/* Contenu à générer par Soloca */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                        <p className="text-gray-500 italic">Le glossaire complet est en cours d'enrichissement par nos experts.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}