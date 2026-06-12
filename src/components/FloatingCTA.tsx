"use client";

import { useState, useEffect } from "react";
import { FileText, ArrowUp } from "lucide-react";

interface FloatingCTAProps {
    label?: string;
    showAfterScroll?: number;
}

export default function FloatingCTA({
    label = "Devis gratuit",
    showAfterScroll = 400
}: FloatingCTAProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > showAfterScroll);
            setShowScrollTop(window.scrollY > 1000);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [showAfterScroll]);

    const scrollToForm = () => {
        const form = document.getElementById("simulateur");
        if (form) {
            form.scrollIntoView({ behavior: "smooth" });
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 hidden lg:flex flex-col gap-3">
            {/* Scroll to top button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="bg-white text-slate-700 p-3 rounded-full shadow-lg border border-slate-200 hover:bg-slate-50 transition-all transform hover:scale-105"
                    aria-label="Retour en haut"
                >
                    <ArrowUp className="w-5 h-5" />
                </button>
            )}

            {/* Main CTA button */}
            <button
                onClick={scrollToForm}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-orange-600/30 flex items-center gap-2 transform hover:scale-105 transition-all"
            >
                <FileText className="w-5 h-5" />
                <span>{label}</span>
            </button>
        </div>
    );
}
