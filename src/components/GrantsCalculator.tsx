"use client";

import { useState, useEffect } from "react";
import { Euro, ArrowRight, CheckCircle, Minus } from "lucide-react";

interface GrantsCalculatorProps {
    themeColor?: string;
    onCalculateClick?: () => void;
}

export default function GrantsCalculator({ themeColor = "blue", onCalculateClick }: GrantsCalculatorProps) {
    const [animatedCost, setAnimatedCost] = useState(1400);
    const [isVisible, setIsVisible] = useState(false);

    const installationCost = 1400;
    const taxCredit = 500;
    const advenir = 960;
    const finalCost = Math.max(0, installationCost - taxCredit - advenir);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true);
                    // Animate the cost down
                    let current = installationCost;
                    const step = (installationCost - finalCost) / 30;
                    const interval = setInterval(() => {
                        current -= step;
                        if (current <= finalCost) {
                            setAnimatedCost(finalCost);
                            clearInterval(interval);
                        } else {
                            setAnimatedCost(Math.round(current));
                        }
                    }, 50);
                }
            },
            { threshold: 0.5 }
        );

        const element = document.getElementById("grants-calculator");
        if (element) observer.observe(element);

        return () => observer.disconnect();
    }, []);

    const scrollToForm = () => {
        const form = document.getElementById("simulateur");
        if (form) {
            form.scrollIntoView({ behavior: "smooth" });
        }
        onCalculateClick?.();
    };

    return (
        <section id="grants-calculator" className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
                {/* Left: Content */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-sm font-bold w-fit">
                        <Euro className="w-4 h-4" />
                        Aides gouvernementales
                    </div>

                    <h2 className="text-3xl lg:text-4xl font-black text-slate-900">
                        Réduisez vos coûts d&apos;installation grâce aux subventions
                    </h2>

                    <p className="text-lg text-slate-600">
                        En France, plusieurs aides financières sont disponibles pour encourager l&apos;installation
                        de bornes de recharge. Nos installateurs gèrent les démarches administratives pour vous.
                    </p>

                    {/* Grant Items */}
                    <div className="flex flex-col gap-4 mt-4">
                        {/* Advenir Copro */}
                        <div className="flex gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                            <div className="bg-green-100 text-green-600 h-12 w-12 rounded-lg flex items-center justify-center shrink-0">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg">Advenir & MaPrimeRénov&apos;</h3>
                                <p className="text-slate-500 text-sm mt-1">
                                    Advenir (Copro) ou MaPrimeRénov&apos; (Rénovation globale uniquement).
                                </p>
                            </div>
                        </div>

                        {/* Tax Credit */}
                        <div className="flex gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                            <div className="bg-blue-100 text-blue-600 h-12 w-12 rounded-lg flex items-center justify-center shrink-0">
                                <Euro className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg">Crédit d&apos;Impôt (Particulier)</h3>
                                <p className="text-slate-500 text-sm mt-1">
                                    Crédit d&apos;impôt de 500€ par système de charge installé (résidence principale ou secondaire).
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={scrollToForm}
                        className="inline-flex items-center text-blue-600 font-bold hover:underline mt-4"
                    >
                        Calculer mon éligibilité <ArrowRight className="ml-2 w-4 h-4" />
                    </button>
                </div>

                {/* Right: Calculator Visual */}
                <div className="flex-1 w-full flex justify-center lg:justify-end">
                    <div className="relative w-full max-w-md bg-white rounded-2xl p-8 shadow-xl border border-slate-100">
                        <div className="flex flex-col gap-6">
                            {/* Installation Cost */}
                            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                                <span className="text-slate-500 font-medium">Coût d&apos;installation</span>
                                <span className="text-slate-900 font-bold">{installationCost.toLocaleString("fr-FR")} €</span>
                            </div>

                            {/* Tax Credit */}
                            <div className="flex justify-between items-center text-green-600">
                                <span className="font-medium flex items-center gap-1">
                                    <Minus className="w-4 h-4" /> Crédit d&apos;impôt
                                </span>
                                <span className="font-bold">- {taxCredit} €</span>
                            </div>

                            {/* Advenir */}
                            <div className="flex justify-between items-center text-green-600 border-b border-slate-100 pb-4">
                                <span className="font-medium flex items-center gap-1">
                                    <Minus className="w-4 h-4" /> Advenir
                                </span>
                                <span className="font-bold">- {advenir} €</span>
                            </div>

                            {/* Final Cost */}
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-lg font-bold text-slate-900">Coût final</span>
                                <span
                                    className={`text-3xl font-black text-blue-600 transition-all duration-300 ${isVisible ? "scale-110" : ""
                                        }`}
                                >
                                    {animatedCost === 0 ? "0 €*" : `${animatedCost.toLocaleString("fr-FR")} €*`}
                                </span>
                            </div>

                            <p className="text-xs text-slate-400 text-center italic">
                                *Exemple pour les scénarios de copropriété éligibles.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
