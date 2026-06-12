import { getSiteConfig } from "@/lib/sites-config";
import { getCity } from "@/lib/db";
import { getPseoContent } from "@/lib/pseo";
import { CheckCircle, Zap, TrendingDown, Home, Building2, Briefcase, Award, ArrowRight, Shield, Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import LeadForm from "@/components/LeadForm";
import Header from "@/components/Header";
import MobileStickyCTA from "@/components/MobileStickyCTA";
import FAQ from "@/components/FAQ";
import FAQSection from "@/components/FAQSection";
import SchemaJSON from "@/components/SchemaJSON";
import Reviews from "@/components/Reviews";
import { Footer } from "@/components/Footer";
import { InternalMesh } from "@/components/InternalMesh";
import RealizationsGrid from "@/components/RealizationsGrid";
import ChargerComparison from "@/components/ChargerComparison";
import GrantsCalculator from "@/components/GrantsCalculator";
import TestimonialsSection from "@/components/TestimonialsSection";
import FloatingCTA from "@/components/FloatingCTA";
import { slugify } from "@/lib/slugify";
 
// ============================================
// METADATA
// ============================================
 
export async function generateMetadata({
    params,
}: {
    params: Promise<{ domain: string }>;
}): Promise<Metadata> {
    const resolvedParams = await params;
    const site = getSiteConfig(resolvedParams.domain);
 
    if (!site) {
        return {
            title: "Expert Borne Recharge | Installation IRVE",
            description: "Installation de bornes de recharge pour véhicules électriques.",
        };
    }
 
    const cityConfig = getCity(resolvedParams.domain);
    if (!cityConfig) {
        return {
            title: site.meta.title,
            description: site.meta.description,
            keywords: site.localKeywords,
        };
    }
 
    // Dynamic Meta via pSEO
    const pseo = await getPseoContent(cityConfig);
 
    return {
        title: pseo.meta_title,
        description: pseo.meta_description,
        keywords: site.localKeywords,
        alternates: {
            canonical: `https://${site.domain}`,
        },
        openGraph: {
            title: pseo.meta_title,
            description: pseo.meta_description,
            url: `https://${site.domain}`,
            siteName: site.name,
            images: [
                {
                    url: site.heroImage,
                    width: 1200,
                    height: 630,
                    alt: `Installation borne de recharge à ${site.city}`
                }
            ],
            locale: "fr_FR",
            type: "website",
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}
 
// ============================================
// PAGE COMPONENT
// ============================================
 
interface SitePageProps {
    params: Promise<{ domain: string }>;
    basePath?: string; // Optional for Demo Mode
}
 
export default async function SitePage({ params, basePath }: SitePageProps) {
    const resolvedParams = await params;
 
    let site = getSiteConfig(resolvedParams.domain);
 
    if (site && basePath) {
        site = { ...site, basePath } as any;
    }
 
    if (!site) {
        return notFound();
    }
 
    const cityConfig = getCity(resolvedParams.domain);
    if (!cityConfig) {
        return notFound();
    }
 
    const isHub = site.slug === 'home';
 
    // pSEO Generation
    const pseo = await getPseoContent(cityConfig);
 
    const h1Content = pseo.hero_title;
    const introContent = pseo.intro_html;
    const badgeContent = pseo.hero_badge;
 
    type ThemeColor = 'orange' | 'emerald' | 'amber' | 'purple';
 
    let themeColor: ThemeColor = 'orange';
    if (site.priceRange === 'LUXE') themeColor = 'amber';
    else if (site.targetType === 'URGENCY') themeColor = 'purple';
    else if (site.priceRange === 'STANDARD') themeColor = 'emerald';
 
    const colors = {
        orange: {
            primary: "bg-orange-600",
            hover: "hover:bg-orange-700",
            text: "text-orange-600",
            light: "bg-orange-50",
            border: "border-orange-200",
            gradient: "from-orange-600 to-orange-700",
            shadow: "shadow-orange-500/30"
        },
        emerald: {
            primary: "bg-emerald-600",
            hover: "hover:bg-emerald-700",
            text: "text-emerald-600",
            light: "bg-emerald-50",
            border: "border-emerald-200",
            gradient: "from-emerald-600 to-emerald-700",
            shadow: "shadow-emerald-500/30"
        },
        amber: {
            primary: "bg-amber-600",
            hover: "hover:bg-amber-700",
            text: "text-amber-600",
            light: "bg-amber-50",
            border: "border-amber-200",
            gradient: "from-amber-600 to-amber-700",
            shadow: "shadow-amber-500/30"
        },
        purple: {
            primary: "bg-purple-600",
            hover: "hover:bg-purple-700",
            text: "text-purple-600",
            light: "bg-purple-50",
            border: "border-purple-200",
            gradient: "from-purple-600 to-purple-700",
            shadow: "shadow-purple-500/30"
        }
    };
 
    const palette = colors[themeColor];
    const isPremium = site.theme === 'premium';
 
    const coloredH1Content = h1Content.replace(/text-blue-500/g, palette.text);

    return (
        <div className="min-h-screen font-sans text-neutral-900 bg-neutral-50">
            <Header
                isHub={isHub}
                city={site.city}
                phoneNumber={site.phoneNumber}
                variant={isPremium ? "light" : "default"}
                themeColor={themeColor}
            />

            <SchemaJSON type="LocalBusiness" site={site} />
            {isHub && <SchemaJSON type="Organization" site={site} />}

            <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50">
                <div className="container mx-auto px-4 relative z-20">
                    <div className="grid lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-7 flex flex-col gap-8 text-center lg:text-left">
                            <div className="space-y-6">
                                <div className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-bold border mx-auto lg:mx-0 ${isPremium ? "border-amber-500/30 bg-amber-500/10 text-amber-500" : `${palette.border} ${palette.light} ${palette.text}`}`}>
                                    <CheckCircle size={16} className="mr-2" />
                                    {badgeContent}
                                </div>
                                <h1
                                    className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight ${isPremium ? "text-white" : "text-neutral-900"}`}
                                    dangerouslySetInnerHTML={{ __html: coloredH1Content }}
                                />
                                <div
                                    className={`text-xl max-w-xl mx-auto lg:mx-0 ${isPremium ? "text-neutral-400" : "text-neutral-600"}`}
                                    dangerouslySetInnerHTML={{ __html: introContent }}
                                />
                            </div>

                            <div className="w-full max-w-xl mx-auto lg:mx-0 relative z-30 text-left">
                                <div id="simulateur" className="bg-white rounded-2xl shadow-xl shadow-blue-900/10 overflow-hidden border border-slate-200">
                                    <div className={`p-1 bg-gradient-to-r ${palette.gradient}`}></div>
                                    <div className="p-6 md:p-8">
                                        <div className="mb-6">
                                            <h3 className="text-lg font-bold text-slate-900">Testez votre éligibilité</h3>
                                            <p className="text-sm text-slate-500">Réponse immédiate • Gratuit • Sans engagement</p>
                                        </div>
                                         <LeadForm
                                             city={site.city}
                                             domain={site.domain}
                                             targetType={site.targetType}
                                             themeColor={themeColor === 'orange' || themeColor === 'amber' ? themeColor : 'orange'}
                                         />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-5 hidden lg:block relative w-full">
                            <div className="relative h-[640px] w-full mb-8">
                                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/20 border border-slate-100 bg-white p-2">
                                    <div className="relative w-full h-full rounded-xl overflow-hidden">
                                        <SafeImage
                                            src={site.heroImage || "/images/generated/modern-home.png"}
                                            fallbackSrc="/images/generated/modern-home.png"
                                            alt={`Installation borne recharge ${site.city}`}
                                            fill
                                            className="object-cover hover:scale-105 transition-transform duration-700"
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                            priority
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                                        <div className="absolute bottom-8 left-8 right-8 z-20">
                                            <div className="bg-white/95 backdrop-blur rounded-xl p-5 shadow-xl border border-white/50 flex items-center gap-4 cursor-default">
                                                <div className="bg-green-100 p-3 rounded-full shrink-0">
                                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-lg text-slate-900">Installation Conforme</div>
                                                    <div className="text-sm font-medium text-slate-500">Norme NFC 15-100</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 justify-center px-4">
                                <div className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-3 rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-105 duration-300">
                                    <Award size={24} className="text-yellow-500 fill-yellow-500" />
                                    <span className="font-bold text-slate-900 text-base">Qualifelec</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-3 rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-105 duration-300">
                                    <Award size={24} className="text-blue-500 fill-blue-500" />
                                    <span className="font-bold text-slate-900 text-base">RGE</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-3 rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-105 duration-300">
                                    <CheckCircle size={24} className="text-green-500 fill-green-100" />
                                    <span className="font-bold text-slate-900 text-base">Garantie décennale</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {isHub && (
                <section className={`py-20 bg-gradient-to-b ${palette.gradient} text-white`}>
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                                Jusqu&apos;à <span className="text-yellow-400">2 460€</span> d&apos;aides cumulables
                            </h2>
                            <p className="text-blue-100 text-lg">
                                Profitez de toutes les aides disponibles en 2026
                            </p>
                        </div>
                        <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                            {[
                                { label: "Prime ADVENIR", value: "960€", detail: "Copropriétés" },
                                { label: "Crédit d'Impôt", value: "500€", detail: "75% plafonné" },
                                { label: "TVA Réduite", value: "5.5%", detail: "Au lieu de 20%" },
                                { label: "MaPrimeRénov'", value: "1000€", detail: "Sous conditions" },
                            ].map((aide, i) => (
                                <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20">
                                    <div className="text-3xl font-bold text-yellow-400 mb-2">{aide.value}</div>
                                    <div className="font-semibold mb-1">{aide.label}</div>
                                    <div className="text-sm text-blue-200">{aide.detail}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {isHub && (
                <section className="py-20 bg-neutral-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 rounded-full px-4 py-2 text-sm font-bold mb-4">
                                <TrendingDown size={18} />
                                Économies garanties
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
                                Essence vs Recharge à domicile
                            </h2>
                            <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
                                Rechargez votre véhicule à la maison et économisez jusqu&apos;à <strong>1 500€ par an</strong>
                            </p>
                        </div>
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white rounded-3xl shadow-2xl border border-neutral-200">
                                <div className="grid md:grid-cols-2">
                                    <div className="p-8 bg-red-50 border-b md:border-b-0 md:border-r border-red-100 rounded-t-3xl md:rounded-tr-none md:rounded-l-3xl">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                                                <span className="text-2xl">⛽</span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-red-900">Essence / Diesel</h3>
                                                <p className="text-sm text-red-600">Coût mensuel moyen</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center py-3 border-b border-red-100">
                                                <span className="text-neutral-700">Consommation</span>
                                                <span className="font-semibold">6L/100km</span>
                                            </div>
                                            <div className="flex justify-between items-center py-3 border-b border-red-100">
                                                <span className="text-neutral-700">Distance/mois</span>
                                                <span className="font-semibold">1 500 km</span>
                                            </div>
                                            <div className="flex justify-between items-center py-3 border-b border-red-100">
                                                <span className="text-neutral-700">Prix au litre</span>
                                                <span className="font-semibold">1.85€</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-4">
                                                <span className="font-bold text-neutral-900">Total mensuel</span>
                                                <span className="text-3xl font-bold text-red-600">167€</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-8 bg-green-50 relative rounded-b-3xl md:rounded-bl-none md:rounded-r-3xl">
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg z-10">
                                            RECOMMANDÉ
                                        </div>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                                <Zap className="text-green-600" size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-green-900">Recharge domicile</h3>
                                                <p className="text-sm text-green-600">Coût mensuel moyen</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center py-3 border-b border-green-100">
                                                <span className="text-neutral-700">Consommation</span>
                                                <span className="font-semibold">15kWh/100km</span>
                                            </div>
                                            <div className="flex justify-between items-center py-3 border-b border-green-100">
                                                <span className="text-neutral-700">Distance/mois</span>
                                                <span className="font-semibold">1 500 km</span>
                                            </div>
                                            <div className="flex justify-between items-center py-3 border-b border-green-100">
                                                <span className="text-neutral-700">Prix kWh HC*</span>
                                                <span className="font-semibold">0.18€</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-4">
                                                <span className="font-bold text-neutral-900">Total mensuel</span>
                                                <span className="text-3xl font-bold text-green-600">41€</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white text-center">
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                        <div>
                                            <span className="text-green-200">Économie mensuelle:</span>
                                            <span className="text-3xl font-bold ml-2">126€</span>
                                        </div>
                                        <div className="hidden sm:block w-px h-10 bg-white/30"></div>
                                        <div>
                                            <span className="text-green-200">Économie annuelle:</span>
                                            <span className="text-3xl font-bold ml-2">1 512€</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-green-200 mt-3">
                                        *Tarif heures creuses EDF. La borne programme automatiquement la recharge aux heures les moins chères.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {isHub && (
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
                                Types d&apos;installations &amp; Prix Moyens
                            </h2>
                            <p className="text-neutral-600 text-lg">
                                Comparez les devis pour maison, copro et professionnels
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {[
                                {
                                    icon: Home,
                                    title: "Maison Individuelle",
                                    description: "Pour les particuliers. Borne 7kW à 22kW. Garage ou extérieur.",
                                    features: ["Installation sous 48h", "Éligible Crédit Impôt", "Devis gratuits"],
                                    color: "blue",
                                    href: "/solutions/maison"
                                },
                                {
                                    icon: Building2,
                                    title: "Copropriété",
                                    description: "Pour syndics et résidents. Droit à la prise ou infrastructure collective.",
                                    features: ["Étude technique offerte", "Dossier AG clé en main", "Aides ADVENIR"],
                                    color: "purple",
                                    highlight: true,
                                    href: "/solutions/copropriete"
                                },
                                {
                                    icon: Briefcase,
                                    title: "Entreprise / Flotte",
                                    description: "Pour parkings pro. Supervision, facturation et gestion de flotte.",
                                    features: ["Conformité Loi LOM", "Gestion à distance", "Facturation auto"],
                                    color: "emerald",
                                    href: "/solutions/entreprise"
                                }
                            ].map((service, i) => (
                                <Link key={i} href={service.href} className="block group h-full">
                                    <div
                                        className={`
                                        relative h-full p-8 rounded-3xl border-2 transition-all duration-300
                                        ${service.highlight
                                                ? 'border-purple-500 bg-purple-50 shadow-xl shadow-purple-500/10 group-hover:scale-[1.02]'
                                                : 'border-neutral-200 bg-white hover:border-blue-500 hover:shadow-xl group-hover:scale-[1.02]'
                                            }
                                    `}
                                    >
                                        {service.highlight && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                                                PROJET LE PLUS DEMANDÉ
                                            </div>
                                        )}
                                        <div className={`
                                        w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110
                                        ${service.color === 'blue' ? 'bg-blue-100 text-blue-600' : ''}
                                        ${service.color === 'purple' ? 'bg-purple-100 text-purple-600' : ''}
                                        ${service.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' : ''}
                                    `}>
                                            <service.icon size={28} />
                                        </div>
                                        <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-blue-600 transition-colors">{service.title}</h3>
                                        <p className="text-neutral-600 mb-6">{service.description}</p>
                                        <ul className="space-y-2 mb-6">
                                            {service.features.map((feature, j) => (
                                                <li key={j} className="flex items-center gap-2 text-sm text-neutral-700">
                                                    <CheckCircle size={16} className="text-green-500" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="text-blue-600 font-bold inline-flex items-center mt-auto">
                                            Comparer les prix <ArrowRight size={16} className="ml-2" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <section className="py-20 bg-neutral-900 text-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            Trouvez votre installateur en <span className="text-blue-400">3 étapes</span>
                        </h2>
                        <p className="text-neutral-400 text-lg">
                            Un service de mise en relation simple, rapide et gratuit
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {[
                            {
                                step: "01",
                                title: "Décrivez votre projet",
                                description: "Remplissez le formulaire en 1 minute pour préciser votre besoin.",
                                icon: Calendar
                            },
                            {
                                step: "02",
                                title: "Comparez les offres",
                                description: "Recevez jusqu&apos;à 3 devis d&apos;installateurs locaux certifiés IRVE.",
                                icon: Shield
                            },
                            {
                                step: "03",
                                title: "Choisissez le meilleur",
                                description: "Sélectionnez l&apos;artisan qui vous convient et lancez les travaux.",
                                icon: Zap
                            }
                        ].map((item, i) => (
                            <div key={i} className="text-center">
                                <div className="relative inline-block mb-6">
                                    <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                                        <item.icon size={32} />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-neutral-900 font-bold text-sm">
                                        {item.step}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-neutral-400">{item.description}</p>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <a
                            href="#simulateur"
                            className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 transition-all"
                        >
                            <Zap size={24} />
                            Comparer les Devis
                        </a>
                    </div>
                </div>
            </section>

            <ChargerComparison themeColor={themeColor} />
            {isHub && <GrantsCalculator themeColor={themeColor} />}
            <RealizationsGrid />

            <section className="py-16 bg-white border-t border-neutral-100">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-12 max-w-5xl mx-auto">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-bold mb-4">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                                Urgence &amp; Dépannage
                            </div>
                            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                                Une panne ? On intervient en <span className="text-red-500">48h</span>
                            </h2>
                            <p className="text-lg text-neutral-600 mb-6">
                                Parce que votre mobilité n&apos;attend pas, nos techniciens locaux à <strong>{site.city}</strong> assurent le SAV et la maintenance de votre borne, même si elle n&apos;a pas été installée par nous.
                            </p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-3 text-neutral-700">
                                    <CheckCircle size={20} className="text-green-500" />
                                    <span>Diagnostic à distance gratuit</span>
                                </li>
                                <li className="flex items-center gap-3 text-neutral-700">
                                    <CheckCircle size={20} className="text-green-500" />
                                    <span>Pièces détachées en stock (Câbles, Cartes)</span>
                                </li>
                                <li className="flex items-center gap-3 text-neutral-700">
                                    <CheckCircle size={20} className="text-green-500" />
                                    <span>Mise à jour logiciel borne &amp; supervision</span>
                                </li>
                            </ul>
                            <a href="#simulateur" className="text-red-600 font-bold hover:underline flex items-center gap-2">
                                Demander un dépannage <ArrowRight size={16} />
                            </a>
                        </div>
                        <div className="w-full md:w-1/3">
                            <div className="bg-neutral-900 text-white rounded-2xl p-8 text-center shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Shield size={120} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Contrat Maintenance</h3>
                                <div className="text-3xl font-bold text-yellow-400 mb-4">
                                    <span className="text-sm text-neutral-400 font-normal mr-1 italic">À partir de</span>
                                    15€<span className="text-sm text-neutral-400 font-normal">/mois</span>
                                </div>
                                <p className="text-sm text-neutral-300 mb-6">Tranquillité d&apos;esprit totale. Visite annuelle et main d&apos;œuvre incluse.</p>
                                <a
                                    href="#simulateur"
                                    className="block w-full bg-white text-neutral-900 font-bold py-3 rounded-xl hover:bg-neutral-100 transition text-center"
                                >
                                    En savoir plus
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {isHub && <TestimonialsSection />}
            <Reviews site={site} themeColor={themeColor === 'orange' ? 'amber' : themeColor} />
            <FAQ themeColor={themeColor === 'orange' ? 'amber' : themeColor} />
            <FAQSection city={site.city} />

            {!isHub && site.quartiers && site.quartiers.length > 0 && (
                <section className="py-16 bg-neutral-50 border-t border-neutral-200">
                    <div className="container mx-auto px-4">
                        <h3 className="text-2xl font-bold text-neutral-900 mb-6">
                            Artisan couvreur à {site.city} et environs
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {site.quartiers.map((quartier: string, i: number) => (
                                <Link
                                    key={i}
                                    href={`#simulateur`}
                                    className="inline-block bg-white px-4 py-2 rounded-full text-sm text-neutral-700 border border-neutral-200 hover:border-orange-500 hover:text-orange-600 hover:shadow-sm transition-colors cursor-pointer"
                                >
                                    Couvreur {quartier}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <InternalMesh city={site.city} config={site} />
            <Footer config={site} />
            <MobileStickyCTA themeColor={themeColor} />
            <FloatingCTA label="Devis gratuit" />
        </div>
    );
}
