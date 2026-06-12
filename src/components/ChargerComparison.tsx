"use client";

import Link from "next/link";
import Image from "next/image";
import { Zap, Wifi, Bluetooth, Smartphone, Shield, Lock, Award } from "lucide-react";

interface ChargerSpec {
    icon: React.ReactNode;
    label: string;
}

interface Charger {
    name: string;
    tagline: string;
    image: string;
    power: string;
    specs: ChargerSpec[];
    popular?: boolean;
}

const chargers: Charger[] = [
    {
        name: "Tesla Wall Connector",
        tagline: "Idéal pour les propriétaires Tesla",
        image: "/images/chargers/tesla-wall-connector.png",
        power: "7kW - 22kW",
        specs: [
            { icon: <Zap className="w-5 h-5" />, label: "7kW - 22kW" },
            { icon: <Wifi className="w-5 h-5" />, label: "Connectivité Wi-Fi" },
            { icon: <Award className="w-5 h-5" />, label: "Garantie 4 ans" },
        ],
    },
    {
        name: "Wallbox Pulsar Plus",
        tagline: "Compact & Universel",
        image: "/images/chargers/wallbox-pulsar-plus.png",
        power: "7kW - 22kW",
        popular: true,
        specs: [
            { icon: <Zap className="w-5 h-5" />, label: "7kW - 22kW" },
            { icon: <Bluetooth className="w-5 h-5" />, label: "Bluetooth & Wi-Fi" },
            { icon: <Smartphone className="w-5 h-5" />, label: "Application mobile" },
        ],
    },
    {
        name: "Schneider EVlink",
        tagline: "Robuste & Sécurisé",
        image: "/images/chargers/schneider-evlink.png",
        power: "3kW - 22kW",
        specs: [
            { icon: <Zap className="w-5 h-5" />, label: "3kW - 22kW" },
            { icon: <Lock className="w-5 h-5" />, label: "Verrouillage sécurisé" },
            { icon: <Shield className="w-5 h-5" />, label: "Construction robuste" },
        ],
    },
];

interface ChargerComparisonProps {
    themeColor?: string;
    onCompareClick?: () => void;
}

export default function ChargerComparison({ themeColor = "blue", onCompareClick }: ChargerComparisonProps) {
    const scrollToForm = () => {

        const form = document.getElementById("simulateur");
        if (form) {
            form.scrollIntoView({ behavior: "smooth" });
        }
        onCompareClick?.();
    };

    return (
        <section className="w-full bg-white py-16 lg:py-24 border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                            Comparez les devis de toiture
                        </h2>
                        <p className="text-slate-500">
                            Nous travaillons avec les fabricants leaders pour garantir qualité et durabilité.
                        </p>
                    </div>
                    <Link
                        href="/vehicules"
                        className="text-blue-600 font-semibold hover:underline flex items-center gap-1 whitespace-nowrap"
                    >
                        Voir tous les modèles →
                    </Link>
                </div>

                {/* Charger Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {chargers.map((charger, index) => (
                        <div
                            key={index}
                            className={`relative flex flex-col gap-6 rounded-xl p-6 transition-all duration-300 hover:shadow-xl ${charger.popular
                                ? "border-2 border-blue-500 bg-white shadow-lg ring-1 ring-blue-500/20"
                                : "border border-slate-200 bg-slate-50 hover:bg-white"
                                }`}
                        >
                            {/* Popular Badge */}
                            {charger.popular && (
                                <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-lg">
                                    POPULAIRE
                                </div>
                            )}

                            {/* Image */}
                            <div className="h-48 w-full rounded-lg bg-slate-100 overflow-hidden relative">
                                <Image
                                    src={charger.image}
                                    alt={charger.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                            </div>

                            {/* Title */}
                            <div className="flex flex-col gap-1">
                                <h3 className="text-xl font-bold text-slate-900">{charger.name}</h3>
                                <p className="text-slate-500 text-sm">{charger.tagline}</p>
                            </div>

                            {/* Specs */}
                            <div className="flex flex-col gap-3 border-t border-slate-200 pt-4">
                                {charger.specs.map((spec, specIndex) => (
                                    <div key={specIndex} className="flex items-center gap-3 text-sm text-slate-700">
                                        <span className="text-blue-600">{spec.icon}</span>
                                        <span className="font-medium">{spec.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA */}
                            <button
                                onClick={scrollToForm}
                                className={`mt-auto w-full font-bold h-10 rounded-lg transition-colors ${charger.popular
                                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                                    : "bg-slate-200 hover:bg-slate-300 text-slate-900"
                                    }`}
                            >
                                Obtenir mon devis
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
