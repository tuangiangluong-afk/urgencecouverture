"use client";

import { MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// Fallback logic if GeoIP is complex: Show top 5 cities
const TOP_CITIES = [
    { name: "Paris", slug: "paris", domain: "bornerechargeparis.fr" },
    { name: "Lyon", slug: "lyon", domain: "bornerechargelyon.fr" },
    { name: "Bordeaux", slug: "bordeaux", domain: "bornerechargebordeaux.fr" },
    { name: "Marseille", slug: "marseille", domain: "bornerechargemarseille.fr" },
    { name: "Toulouse", slug: "toulouse", domain: "bornerechargetoulouse.fr" },
];

interface CrossLinkerProps {
    brandName: string;
    detectedCity?: string | null;
}

export default function CrossLinker({ brandName, detectedCity }: CrossLinkerProps) {
    const [randomCity, setRandomCity] = useState(TOP_CITIES[0]);

    useEffect(() => {
        // War Architecture: Priority to Real GeoIP
        if (detectedCity) {
            // Try to find exact match in our network
            const match = TOP_CITIES.find(c => c.name.toLowerCase() === detectedCity.toLowerCase());

            if (match) {
                setRandomCity(match);
                return;
            } else {
                // If detected city is not in our direct top list, we could add logic here
                // For now, fall back to random rotation to show scale
            }
        }

        // Fallback: Rotate advertised city to show different "War Architecture" silos
        const random = TOP_CITIES[Math.floor(Math.random() * TOP_CITIES.length)];
        setRandomCity(random);
    }, [detectedCity]);

    return (
        <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-800 shadow-2xl my-12">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-600 rounded-xl hidden sm:block">
                    <MapPin className="text-white" size={24} />
                </div>
                <div>
                    <h3 className="text-white font-bold text-lg mb-1">
                        Installateur agréé {brandName} à proximité
                    </h3>
                    <p className="text-slate-400 text-sm max-w-md">
                        Notre réseau couvre toute la France. Trouvez votre expert local certifié pour une installation conforme.
                    </p>
                </div>
            </div>

            <Link
                href={`https://${randomCity.domain}/`}
                className="w-full sm:w-auto bg-white text-slate-900 hover:bg-blue-50 px-6 py-3 rounded-xl font-bold text-center flex items-center justify-center gap-2 transition-all"
            >
                Agence {randomCity.name}
                <ArrowRight size={18} className="text-blue-600" />
            </Link>
        </div>
    );
}
