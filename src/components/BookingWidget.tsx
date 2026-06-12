"use client";

import { useState } from "react";
import { Zap, Loader2, CheckCircle, ShieldCheck, Mail, User, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { CityConfig } from "@/lib/db";
import { getTheme } from "@/lib/theme";

interface BookingWidgetProps {
    city: CityConfig;
    compact?: boolean;
}

export function BookingWidget({ city, compact = false }: BookingWidgetProps) {
    const router = useRouter();
    const theme = getTheme(city.slug);
    const classes = theme.classes;

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Form States
    const [projectType, setProjectType] = useState("maison");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [postalCode, setPostalCode] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Retrieve traffic attribution data from storage/cookie
        let attribution = {};
        if (typeof window !== 'undefined') {
            const stored = sessionStorage.getItem('lead_attribution');
            if (stored) {
                try {
                    attribution = JSON.parse(stored);
                } catch (e) {
                    console.error("Error parsing attribution from sessionStorage", e);
                }
            } else {
                const cookieMatch = document.cookie.match(/lead_attribution=([^;]+)/);
                if (cookieMatch) {
                    try {
                        attribution = JSON.parse(decodeURIComponent(cookieMatch[1]));
                    } catch (e) {
                        console.error("Error parsing attribution from cookie", e);
                    }
                }
            }
        }

        const payload = {
            name,
            phone,
            postalCode,
            projectType,
            city: city.city,
            domain: city.domain,
            timestamp: new Date().toISOString(),
            attribution // Include attribution data here
        };

        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const data = await res.json();

                // GTM: Track Conversion (enriched with attribution fields)
                if (typeof window !== 'undefined' && (window as any).dataLayer) {
                    (window as any).dataLayer.push({
                        event: 'generate_lead',
                        lead_category: projectType,
                        lead_city: city.city,
                        value: 50.00,
                        currency: 'EUR',
                        traffic_source: (attribution as any).source || 'direct',
                        traffic_medium: (attribution as any).medium || 'direct',
                        traffic_campaign: (attribution as any).campaign || '',
                        traffic_term: (attribution as any).term || '',
                        traffic_content: (attribution as any).content || '',
                        landing_page: (attribution as any).landing_page || window.location.pathname
                    });
                }

                // Redirect to success page if we have VUD details!
                if (data?.vud && data.vud.devis_id) {
                    router.push(`/${city.domain}/success?devis_id=${data.vud.devis_id}&devis_hash=${data.vud.devis_hash || ''}`);
                    return;
                }

                setSuccess(true);
            } else {
                alert("Une erreur est survenue. Veuillez nous appeler directement.");
            }
        } catch (err) {
            console.error(err);
            alert("Erreur de connexion. Veuillez nous appeler.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div id="estimate" className="bg-white p-8 rounded-3xl shadow-xl border border-green-100 relative overflow-hidden h-full flex flex-col items-center justify-center text-center">
                <div className="absolute top-0 left-0 w-full h-2 bg-green-500 rounded-t-3xl"></div>
                <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 animate-bounce">
                    <CheckCircle size={40} />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-neutral-900">Demande Reçue !</h3>
                <p className="text-neutral-500 mb-6">
                    Un expert IRVE vous contactera sous 24h pour votre projet à {city.city}.
                </p>
                <button
                    onClick={() => setSuccess(false)}
                    className="text-sm text-neutral-400 hover:text-neutral-900 underline"
                >
                    Nouveau projet
                </button>
            </div>
        );
    }

    return (
        <div id="estimate" className={`bg-white rounded-3xl shadow-xl border border-neutral-100 relative overflow-hidden ${compact ? 'p-4' : 'p-6 sm:p-8'}`}>
            <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${classes.gradientFrom} ${classes.gradientTo} rounded-t-3xl`}></div>

            <div className="mb-6 text-center">
                <h3 className="text-2xl font-bold text-neutral-900">Devis Express IRVE</h3>
                <p className="text-neutral-500 text-sm">Réponse sous 24h • 100% Gratuit</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Project Type */}
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Type de projet</label>
                    <select
                        value={projectType}
                        onChange={(e) => setProjectType(e.target.value)}
                        className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 focus:border-blue-500 focus:ring-blue-500/20 outline-none transition"
                    >
                        <option value="maison">Maison Individuelle</option>
                        <option value="copropriete">Copropriété</option>
                        <option value="entreprise">Entreprise / Pro</option>
                    </select>
                </div>

                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Nom complet</label>
                    <div className="relative">
                        <input
                            type="text"
                            required
                            placeholder="Jean Dupont"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 pl-10 text-neutral-900 focus:border-blue-500 focus:ring-blue-500/20 outline-none transition"
                        />
                        <User className="absolute left-3 top-3.5 h-5 w-5 text-neutral-400" />
                    </div>
                </div>

                {/* Phone & Zip */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Téléphone</label>
                        <div className="relative">
                            <input
                                type="tel"
                                required
                                placeholder="06 12..."
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 pl-10 text-neutral-900 focus:border-blue-500 focus:ring-blue-500/20 outline-none transition text-sm"
                            />
                            <Phone className="absolute left-3 top-3.5 h-4 w-4 text-neutral-400" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Code Postal</label>
                        <input
                            type="text"
                            required
                            maxLength={5}
                            pattern="\d{5}"
                            placeholder="75000"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 focus:border-blue-500 focus:ring-blue-500/20 outline-none transition text-sm"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-neutral-900 text-white font-bold py-4 rounded-xl hover:bg-neutral-800 transition transform hover:-translate-y-0.5 shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" />
                            Envoi en cours...
                        </>
                    ) : (
                        <span className="flex items-center gap-2">
                            <Zap size={18} />
                            Obtenir mon Devis
                        </span>
                    )}
                </button>

                <p className="text-[10px] text-center text-neutral-400 mt-4 leading-relaxed">
                    Vos données sont protégées. En validant, vous acceptez d&apos;être recontacté pour votre projet de borne.
                </p>

                {/* Trust Badges */}
                <div className="mt-4 flex items-center justify-center gap-4 text-xs text-neutral-500">
                    <span className="flex items-center gap-1.5">
                        <ShieldCheck size={14} className="text-green-500" />
                        Certifié IRVE
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Mail size={14} className="text-blue-500" />
                        Étude par email
                    </span>
                </div>
            </form>
        </div>
    );
}

