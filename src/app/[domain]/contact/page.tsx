
import { getCity } from "@/lib/db";
import { notFound } from "next/navigation";
import { getTheme } from "@/lib/theme";
import ContactForm from "@/components/ContactForm";
import CallButton from "@/components/CallButton";
import Link from "next/link";
import { Phone, Mail, MapPin, ArrowLeft, Zap } from "lucide-react";
import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { CITIES } from "@/lib/db";

export async function generateMetadata({ params }: { params: Promise<{ domain: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const city = getCity(resolvedParams.domain);
    if (!city) return {};

    return {
        title: `Contact Borne Recharge ${city.city} | Devis Gratuit`,
        description: `Contactez votre installateur IRVE à ${city.city}. Devis gratuit pour maison, copropriété et entreprise. Réponse sous 48h.`,
        alternates: {
            canonical: `https://${city.domain}/contact`,
        },
    };
}

export default async function ContactPage({ params }: { params: Promise<{ domain: string }> }) {
    const resolvedParams = await params;
    const city = getCity(resolvedParams.domain);
    if (!city) return notFound();

    const theme = getTheme(city.slug);
    const classes = theme.classes;

    return (
        <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900">
            {/* Nav */}
            <nav className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/80 px-4 py-3 backdrop-blur-md">
                <div className="container mx-auto flex items-center justify-between">
                    <Link
                        href="/"
                        className={`flex items-center gap-2 text-sm font-bold text-neutral-600 hover:text-neutral-900 transition`}
                    >
                        <ArrowLeft size={16} />
                        Retour
                    </Link>
                    <div className="font-bold text-lg flex items-center gap-2">
                        <Zap className={`w-5 h-5 ${theme.text}`} />
                        {city.name}
                    </div>
                    <CallButton
                        phoneNumber={city.phoneNumber}
                        cityName={city.city}
                        theme={theme}
                        className={`rounded-full ${classes.bg} px-4 py-2 text-sm font-bold text-white shadow-lg transition hover:brightness-110 active:scale-95`}
                    >
                        <Phone size={14} />
                    </CallButton>
                </div>
            </nav>

            <main className="container mx-auto max-w-5xl px-4 py-12 mb-20">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 mb-4">
                        Contactez votre expert à {city.city}
                    </h1>
                    <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                        Vous avez un projet d&apos;installation ? Une question sur les aides ?
                        <br />
                        Nos électriciens certifiés IRVE vous répondent.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left: Info Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-200 h-full">
                            <h3 className="font-bold text-xl mb-6">Nos Coordonnées</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl ${classes.bg} bg-opacity-10 ${theme.text}`}>
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider mb-1">Téléphone</p>
                                        <p className="font-bold text-lg">{city.phoneNumber}</p>
                                        <p className="text-sm text-neutral-500">Lundi - Samedi, 9h-19h</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl ${classes.bg} bg-opacity-10 ${theme.text}`}>
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider mb-1">Email</p>
                                        <p className="font-medium">Via formulaire</p>
                                        <p className="text-sm text-neutral-500">Réponse sous 48h</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl ${classes.bg} bg-opacity-10 ${theme.text}`}>
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider mb-1">Zone d&apos;intervention</p>
                                        <p className="font-medium">{city.city} et agglomération</p>
                                        <p className="text-sm text-neutral-500">Déplacement gratuit</p>
                                    </div>
                                </div>
                            </div>

                            <hr className="my-8 border-neutral-100" />

                            <div className="bg-neutral-50 rounded-xl p-4 text-sm text-neutral-600">
                                Pour une étude complète (copropriété ou entreprise), n&apos;hésitez pas à joindre des photos de votre tableau électrique via le formulaire.
                            </div>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-neutral-100">
                            <h2 className="text-2xl font-bold mb-6">Demander un devis gratuit</h2>
                            <ContactForm domain={city.domain} city={city.city} theme={theme} />
                        </div>
                    </div>
                </div>
            </main>
            <Footer config={CITIES[resolvedParams.domain]} />
        </div>
    );
}
