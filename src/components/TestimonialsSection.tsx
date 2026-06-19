"use client";

import { Star, MapPin } from "lucide-react";

interface Testimonial {
    quote: string;
    name: string;
    location: string;
    product: string;
    initials: string;
}

const testimonials: Testimonial[] = [
    {
        quote: "L'outil de comparaison m'a fait gagner des heures. J'ai reçu 3 devis en 24h et les travaux de rénovation de ma toiture se sont déroulés à merveille. Devis clair et entreprise très réactive.",
        name: "Marc Dubreuil",
        location: "Lyon",
        product: "Rénovation de toiture",
        initials: "MD",
    },
    {
        quote: "Intervention d'urgence dans la nuit pour une fuite de toiture. Le couvreur partenaire a été d'une réactivité incroyable et a colmaté la fuite très proprement. Devis très transparent et honnête.",
        name: "Valérie Lemaire",
        location: "Bordeaux",
        product: "Recherche de fuite & Réparation",
        initials: "VL",
    },
];

interface TestimonialsSectionProps {
    rating?: number;
    reviewCount?: number;
}

export default function TestimonialsSection({
    rating = 4.9,
    reviewCount = 1200
}: TestimonialsSectionProps) {
    return (
        <section className="bg-slate-900 text-white py-16 lg:py-24 overflow-hidden relative">
            {/* Abstract background */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/5 rounded-l-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-16 relative z-10">
                {/* Left: Map Side */}
                <div className="flex-1 flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                        <h2 className="text-2xl md:text-3xl font-bold">
                            Installateurs partout en France
                        </h2>
                        <p className="text-slate-400 text-lg">
                            Trouvez un expert certifié près de chez vous. Nous avons un réseau de 500+ professionnels prêts à intervenir.
                        </p>
                    </div>

                    {/* Map Placeholder with animated pins */}
                    <div className="relative w-full h-[300px] lg:h-[400px] rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-800">
                        {/* France SVG Placeholder */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg
                                viewBox="0 0 500 500"
                                className="w-full h-full opacity-30"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1"
                            >
                                {/* Simplified France outline */}
                                <path
                                    d="M250 50 L350 100 L400 200 L380 300 L350 400 L250 450 L150 400 L100 300 L120 200 L150 100 Z"
                                    className="text-slate-600"
                                />
                            </svg>
                        </div>

                        {/* Animated Map Pins */}
                        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 bg-blue-600 text-white p-2 rounded-full shadow-lg animate-bounce">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div
                            className="absolute top-1/2 left-1/3 bg-blue-600 text-white p-2 rounded-full shadow-lg animate-bounce"
                            style={{ animationDelay: "0.5s" }}
                        >
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div
                            className="absolute bottom-1/3 right-1/3 bg-blue-600 text-white p-2 rounded-full shadow-lg animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                        >
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div
                            className="absolute top-2/3 left-1/4 bg-blue-600 text-white p-2 rounded-full shadow-lg animate-bounce"
                            style={{ animationDelay: "0.7s" }}
                        >
                            <MapPin className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Right: Testimonials Side */}
                <div className="flex-1 flex flex-col justify-center gap-8">
                    {/* Rating */}
                    <div className="flex items-end gap-4 mb-4">
                        <span className="text-6xl font-black text-white">{rating}</span>
                        <div className="flex flex-col pb-2">
                            <div className="flex text-yellow-400 mb-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-5 h-5 fill-current"
                                    />
                                ))}
                            </div>
                            <span className="text-slate-400 font-medium">
                                Basé sur {reviewCount.toLocaleString("fr-FR")}+ avis
                            </span>
                        </div>
                    </div>

                    {/* Testimonial Cards */}
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-slate-800/50 backdrop-blur border border-slate-700 p-6 rounded-xl"
                        >
                            <p className="text-slate-200 italic mb-4">
                                &quot;{testimonial.quote}&quot;
                            </p>
                            <div className="flex items-center gap-3">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold ${index === 0 ? "bg-slate-600" : "bg-blue-600/20 text-blue-400"
                                    }`}>
                                    {testimonial.initials}
                                </div>
                                <div>
                                    <p className="font-bold text-white text-sm">{testimonial.name}</p>
                                    <p className="text-xs text-slate-400">
                                        {testimonial.location}, France • {testimonial.product}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
