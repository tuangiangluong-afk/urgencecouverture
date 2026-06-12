"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cookie } from 'lucide-react';

interface CookieBannerProps {
    slug: string;
    cityName: string;
}

const CookieBanner = ({ slug, cityName }: CookieBannerProps) => {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Check if user has already explicitly accepted or rejected
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            // Small delay for animation entrance
            const timer = setTimeout(() => setShowBanner(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const acceptAll = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setShowBanner(false);
    };

    const rejectAll = () => {
        localStorage.setItem('cookie-consent', 'rejected');
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-neutral-900/95 backdrop-blur-md border border-orange-500/30 rounded-2xl p-6 shadow-2xl shadow-orange-500/10 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg shrink-0 bg-orange-500/10">
                    <Cookie className="w-6 h-6 text-orange-400" />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                        Confidentialité
                    </h3>
                    <p className="text-sm text-neutral-400 mb-4 leading-relaxed">
                        Nous utilisons des cookies pour améliorer votre expérience sur le site de {cityName}. Pas de pistage intrusif, promis.
                        {' '}
                        <Link href="/mentions-legales" className="underline text-orange-400 hover:text-orange-300 transition">
                            En savoir plus
                        </Link>
                    </p>

                    <div className="flex flex-col gap-2">
                        <button
                            onClick={acceptAll}
                            className="w-full py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg transition-colors"
                        >
                            Tout accepter
                        </button>
                        <button
                            onClick={rejectAll}
                            className="w-full py-2 bg-white/5 text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
                        >
                            Continuer sans accepter
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookieBanner;
