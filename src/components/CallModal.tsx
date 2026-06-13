"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Phone, X, ShieldCheck, Clock } from "lucide-react";
import { Theme } from "@/lib/theme";

interface CallModalProps {
    isOpen: boolean;
    onClose: () => void;
    phoneNumber: string;
    cityName: string;
    theme: Theme;
}

export default function CallModal({
    isOpen,
    onClose,
    phoneNumber,
    cityName,
    theme,
}: CallModalProps) {
    const [isCalling, setIsCalling] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            setIsCalling(false);
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    const handleCall = () => {
        setIsCalling(true);
        // Add a small delay to show the "Connecting" state before opening the dialer
        setTimeout(() => {
            window.location.href = `tel:${phoneNumber.replace(/ /g, "")}`;
            // Optional: Close modal after a delay or keep it open for "How was the call?"
            setTimeout(onClose, 2000);
        }, 800);
    };

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className={`relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl transition-all animate-in fade-in zoom-in duration-200 border border-neutral-100`}>

                {/* Header */}
                <div className={`${theme.classes.bg} p-6 text-center relative overflow-hidden`}>
                    <div className="absolute top-4 right-4 z-50">
                        <button
                            onClick={onClose}
                            className="rounded-full bg-white/20 p-3 text-white hover:bg-white/30 transition-colors -mr-2 -mt-2"
                            aria-label="Fermer"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="relative z-10 flex flex-col items-center gap-3">
                        <div className="rounded-full bg-white/20 p-4 ring-4 ring-white/10 backdrop-blur-md">
                            <Phone size={32} className="text-white fill-current" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">
                            Expert Couverture {cityName}
                        </h3>
                        <p className="text-white/90 font-medium">
                            Installation & Devis gratuit
                        </p>
                    </div>

                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 rounded-xl bg-neutral-50 p-4 border border-neutral-100">
                            <div className={`rounded-full p-2 ${theme.classes.bg} bg-opacity-10`}>
                                <Clock size={20} className={`${theme.classes.text}`} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-neutral-900">Devis Rapide sous 24h</p>
                                <p className="text-xs text-neutral-500">Étude technique & aides d'État</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-xl bg-neutral-50 p-4 border border-neutral-100">
                            <div className={`rounded-full p-2 ${theme.classes.bg} bg-opacity-10`}>
                                <ShieldCheck size={20} className={`${theme.classes.text}`} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-neutral-900">Installateurs Certifiés</p>
                                <p className="text-xs text-neutral-500">Artisans couvreurs certifiés Qualibat</p>
                            </div>
                        </div>

                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={handleCall}
                            className={`w-full flex items-center justify-center gap-3 rounded-xl py-4 text-lg font-bold text-white shadow-xl transition-all hover:brightness-110 active:scale-95 ${theme.classes.bg} ${theme.classes.shadow}`}
                        >
                            {isCalling ? (
                                <>
                                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                    Connexion...
                                </>
                            ) : (
                                <>
                                    <Phone size={24} fill="currentColor" />
                                    {phoneNumber}
                                </>
                            )}
                        </button>

                        <p className="text-center text-xs text-neutral-400">
                            Prix d'un appel local • Sans surcoût
                        </p>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
