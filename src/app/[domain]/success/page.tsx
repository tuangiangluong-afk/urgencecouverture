import { Metadata } from "next";
import { getSiteConfig } from "@/lib/sites-config";
import { CheckCircle, Phone, Wrench, FileText, Gift, ArrowRight, Download } from "lucide-react";
import Link from "next/link";
import ViteUnDevisSpinner from "@/components/ViteUnDevisSpinner";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ domain: string }>;
}): Promise<Metadata> {
    const { domain } = await params;
    const config = getSiteConfig(domain);

    return {
        title: `Demande reçue | ${config?.name || "Urgence Couverture"}`,
        description: "Votre demande de devis a été envoyée avec succès. Un expert vous contactera sous 24h.",
        robots: { index: false, follow: false },
        alternates: {
            canonical: `https://${config?.domain || "urgencecouverture.com"}/success`,
        },
    };
}

interface TimelineStep {
    icon: React.ReactNode;
    title: string;
    timing: string;
    description: string;
    active: boolean;
}

const timelineSteps: TimelineStep[] = [
    {
        icon: <Phone className="w-5 h-5" />,
        title: "Appel de qualification",
        timing: "Sous 24h",
        description: "Nous validerons les spécificités de votre projet de toiture (recherche de fuite, nettoyage, réfection).",
        active: true,
    },
    {
        icon: <Wrench className="w-5 h-5" />,
        title: "Visite d'un couvreur",
        timing: "Sous 48h / Urgence immédiate",
        description: "Un artisan couvreur qualifié examinera l'état de vos tuiles, charpente et étanchéité.",
        active: false,
    },
    {
        icon: <FileText className="w-5 h-5" />,
        title: "Devis de toiture",
        timing: "Détail sous 24h",
        description: "Vous recevrez une estimation précise incluant les assurances et la garantie décennale.",
        active: false,
    },
];

interface PageProps {
    params: Promise<{ domain: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SuccessPage({
    params,
    searchParams,
}: PageProps) {
    const { domain } = await params;
    const resolvedSearchParams = await searchParams;
    const devisId = resolvedSearchParams.devis_id as string | undefined;
    const devisHash = resolvedSearchParams.devis_hash as string | undefined;

    const config = getSiteConfig(domain);
    const siteName = config?.name || "Urgence Couverture";

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 md:px-20">
                <Link href={`/${domain}`} className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-orange-600 rounded-lg flex items-center justify-center text-white">
                        <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                            <path d="M12 2L2 22H22L12 2Z" />
                        </svg>
                    </div>
                    <span className="text-lg font-bold text-slate-900">{siteName}</span>
                </Link>
                <Link
                    href={`/${domain}/contact`}
                    className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors"
                >
                    Centre d&apos;aide
                </Link>
            </header>

            <main className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
                {/* Success Hero */}
                <div className="flex flex-col items-center justify-center text-center mb-12">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <CheckCircle className="w-12 h-12" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
                        Demande enregistrée !
                    </h1>
                    <p className="text-lg text-slate-600 max-w-xl">
                        Votre demande d&apos;étude de toiture a bien été transmise. Un de nos artisans couvreurs partenaires
                        étudiera vos informations et vous contactera sous 24h.
                    </p>
                </div>

                {/* ViteUnDevis SMS Verification Spinner */}
                {devisId && devisHash && (
                    <div className="mb-12 max-w-2xl mx-auto">
                        <ViteUnDevisSpinner devisId={devisId} devisHash={devisHash} />
                    </div>
                )}

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left: Timeline */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-orange-600" />
                                Prochaines étapes
                            </h2>

                            <div className="space-y-0">
                                {timelineSteps.map((step, index) => (
                                    <div key={index} className="flex gap-4">
                                        {/* Timeline line and icon */}
                                        <div className="flex flex-col items-center">
                                            {index !== 0 && (
                                                <div className="w-0.5 h-4 bg-slate-200" />
                                            )}
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-full z-10 ${step.active
                                                ? "bg-orange-600 text-white shadow-md"
                                                : "bg-slate-100 text-slate-500 border border-slate-200"
                                                }`}>
                                                {step.icon}
                                            </div>
                                            {index !== timelineSteps.length - 1 && (
                                                <div className="w-0.5 bg-slate-200 h-full min-h-[40px]" />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 pb-8">
                                            <p className="text-slate-900 text-lg font-semibold">{step.title}</p>
                                            <p className={`text-sm font-medium mb-1 ${step.active ? "text-orange-600" : "text-slate-500"
                                                }`}>
                                                {step.timing}
                                            </p>
                                            <p className="text-slate-500 text-sm">{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Trust badges */}
                        <div className="mt-6 flex flex-wrap justify-center gap-8 opacity-60">
                            {["RGE", "ASSURANCE DECENNALE", "QUALIBAT"].map((badge) => (
                                <div key={badge} className="text-xs font-bold text-slate-500 tracking-widest">
                                    {badge}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Value adds */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        {/* Grant Guide Card */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-1 shadow-lg text-white overflow-hidden relative">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-600/20 rounded-full blur-2xl" />
                            <div className="p-6 md:p-8 relative z-10">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-600/20 border border-orange-600/30 text-xs font-bold text-orange-400 mb-3">
                                    <Gift className="w-3 h-3" />
                                    Ressource gratuite
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold mb-2">
                                    Dossiers de conseils
                                </h3>
                                <p className="text-slate-300 text-sm mb-6">
                                    Consultez nos dossiers d&apos;informations complets sur les travaux de toiture, charpente et étanchéité.
                                </p>
                                <Link
                                    href={`/${domain}/guides`}
                                    className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-all w-full"
                                >
                                    <Download className="w-4 h-4" />
                                    Consulter nos guides
                                </Link>
                            </div>
                        </div>

                        {/* Referral Card */}
                        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-5 items-center">
                            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                                <Gift className="w-6 h-6" />
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <h4 className="text-slate-900 font-bold mb-1">Parrainez un proche</h4>
                                <p className="text-slate-500 text-sm mb-3">
                                    Recommandez un ami intéressé par des travaux de toiture et recevez un chèque cadeau lors de son installation.
                                </p>
                                <button className="text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 mx-auto sm:mx-0">
                                    En savoir plus
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Return link */}
                <div className="mt-16 text-center">
                    <Link
                        href={`/${domain}`}
                        className="text-slate-500 hover:text-slate-800 font-medium text-sm transition-colors"
                    >
                        ← Retour à l&apos;accueil
                    </Link>
                </div>
            </main>
        </div>
    );
}
