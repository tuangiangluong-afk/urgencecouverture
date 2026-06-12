"use client";

import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { slugify } from "@/lib/slugify";
import { useEffect, useState } from "react";

interface CityCardProps {
    cities: {
        name: string;
        department: string;
        slug: string;
        domain?: string;
        available: boolean;
    }[];
    themeColor?: 'teal' | 'orange' | 'gold';
}

export function CityCards({ cities, themeColor = 'orange' }: CityCardProps) {
    const [isLocal, setIsLocal] = useState(false);

    useEffect(() => {
        setIsLocal(window.location.hostname.includes("localhost"));
    }, []);

    const theme = {
        teal: {
            hover: 'hover:border-teal-500 hover:shadow-xl',
            bg: 'bg-teal-100',
            text: 'text-teal-600'
        },
        orange: {
            hover: 'hover:border-orange-500 hover:shadow-xl',
            bg: 'bg-orange-100',
            text: 'text-orange-600'
        },
        gold: {
            hover: 'hover:border-amber-500 hover:shadow-xl',
            bg: 'bg-amber-100',
            text: 'text-amber-600'
        }
    }[themeColor];

    return (
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {cities.map((city, i) => {
                const targetLink = `/ville/${slugify(city.name).toLowerCase()}`;

                return (
                    <Link
                        key={i}
                        href={targetLink}
                        className={`
                            block relative bg-white rounded-2xl p-6 border-2 transition-all cursor-pointer
                            ${city.available
                                ? `border-slate-200 ${theme.hover}`
                                : 'border-slate-200 opacity-60 cursor-not-allowed'
                            }
                        `}
                        onClick={(e) => {
                            if (!city.available) {
                                e.preventDefault();
                                alert("Bientôt disponible dans cette ville !");
                            }
                        }}
                    >
                        {!city.available && (
                            <div className="absolute top-3 right-3 bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">
                                Bientôt
                            </div>
                        )}
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 ${theme.bg} rounded-xl flex items-center justify-center`}>
                                <MapPin className={theme.text} size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-900">{city.name}</h3>
                                <p className="text-sm text-slate-500">Département {city.department}</p>
                            </div>
                        </div>
                        {city.available && (
                            <div className={`mt-4 flex items-center ${theme.text} font-medium text-sm`}>
                                Voir les offres <ArrowRight size={16} className="ml-1" />
                            </div>
                        )}
                    </Link>
                );
            })}
        </div>
    );
}
