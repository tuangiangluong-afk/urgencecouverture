"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import Link from "next/link";
import Logo from "@/components/Logo";
import { Zap } from "lucide-react";
import { usePathname } from "next/navigation";

interface HeaderProps {
    isHub?: boolean;
    city?: string | null;
    phoneNumber?: string;
    variant?: "default" | "light" | "transparent";
    themeColor?: 'blue' | 'emerald' | 'amber' | 'purple' | 'orange';
}

export default function Header({
    isHub = false,
    city = null,
    phoneNumber = "01 89 71 30 76",
    variant = "default",
    themeColor = 'orange'
}: HeaderProps) {
    const [isOpen, setIsOpen] = useState(false);
    const showMobileMenu = isHub && !city;

    const hoverColors: Record<string, string> = {
        blue: "hover:text-blue-500",
        emerald: "hover:text-emerald-500",
        amber: "hover:text-amber-500",
        purple: "hover:text-purple-500",
        rose: "hover:text-rose-500",
        teal: "hover:text-teal-500",
        indigo: "hover:text-indigo-500",
        orange: "hover:text-orange-500",
        gold: "hover:text-amber-500"
    };
    const hoverClass = hoverColors[themeColor] || "hover:text-blue-500";

    const navLinks = [
        {
                "href": "/guides/urgence-fuite-toiture-que-faire",
                "text": "Urgence Fuite"
        },
        {
                "href": "/guides/prix-refection-toiture-m2",
                "text": "Tarifs au m²"
        },
        {
                "href": "/guides",
                "text": "Guides"
        }
];

    const pathname = usePathname();

    const demoMatch = pathname?.match(/^(\/demo\/[^\/]+)/);
    const customLink = demoMatch ? demoMatch[1] : undefined;

    // Color Mapping
    const buttonColors = {
        blue: "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20",
        emerald: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20",
        amber: "bg-amber-600 hover:bg-amber-700 shadow-amber-500/20",
        purple: "bg-purple-600 hover:bg-purple-700 shadow-purple-500/20",
        orange: "bg-orange-600 hover:bg-orange-700 shadow-orange-500/20",
    };

    const btnClass = buttonColors[themeColor] || buttonColors.orange;

    // Background styles
    const bgClass = variant === "transparent"
        ? "bg-transparent border-transparent"
        : variant === "light"
            ? "bg-neutral-900/95 backdrop-blur border-white/10 text-white"
            : "bg-white/95 backdrop-blur border-slate-200 text-slate-900";

    const homePath = customLink || "/";
    const isHome = pathname === homePath;
    const simulatorHref = isHome ? "#simulateur" : `${homePath}#simulateur`;

    return (
        <nav className={`fixed top-0 z-50 w-full transition-all duration-300 border-b ${bgClass} py-3`}>
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* LOGO */}
                <Logo
                    isHub={isHub}
                    city={city}
                    size="md"
                    variant={variant === "light" ? "light" : "default"}
                    themeColor={themeColor}
                    customLink={customLink}
                />

                {/* RIGHT ACTIONS */}
                <div className="flex items-center gap-4">
                    {/* Desktop Navigation (Hub Only) */}
                    {isHub && (
                        <div className={`hidden md:flex items-center gap-6 text-sm font-medium ${variant === "light" ? "text-slate-300" : "text-slate-600"}`}>
                            {navLinks.map((link, idx) => (
                                <Link key={idx} href={link.href} className={`${hoverClass} transition`}>{link.text}</Link>
                            ))}
                        </div>
                    )}

                    {/* RGE Badge (Desktop) */}
                    <div className="hidden lg:flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                        <span className="text-xs font-bold text-orange-600">Couvreurs RGE Qualibat</span>
                    </div>

                    {/* CTA Devis */}
                    <Link
                        href={simulatorHref}
                        className={`hidden md:flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-lg transition transform hover:-translate-y-0.5 ${btnClass}`}
                    >
                        <Zap size={16} fill="currentColor" />
                        <span>Devis Gratuit</span>
                    </Link>
                
                    {showMobileMenu && (
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`md:hidden p-2 rounded-lg focus:outline-none ${
                                variant === "light" 
                                    ? "text-slate-300 hover:text-white" 
                                    : "text-slate-600 hover:text-slate-900"
                            }`}
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {showMobileMenu && isOpen && (
                <div className={`md:hidden border-t ${
                    variant === 'light' 
                        ? 'bg-neutral-900/95 border-white/10 text-white' 
                        : 'bg-white/95 border-slate-200 text-slate-900'
                } px-4 py-4 space-y-3`}>
                    {navLinks.map((link, idx) => (
                        <Link
                            key={idx}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className={`block py-2 text-base font-semibold transition ${hoverClass} ${
                                variant === "light" ? "text-slate-200" : "text-slate-700"
                            }`}
                        >
                            {link.text}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
}
