"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Train, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Simplified type for search results
type SearchResult = {
    label: string;
    slug: string;
    type: 'CITY' | 'GARE';
    desc: string;
};

export function CitySearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Mock search function - In prod, this could be an API call if list is huge
    // But for 50 items, client-side filtering is instant and better.
    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            return;
        }

        setLoading(true);
        // Simulate network delay for UX feel (optional, but nice)
        const timer = setTimeout(() => {
            // We need to fetch this data somehow. 
            // For client component, we can harcode the list or fetch a lightweight JSON.
            // Let's rely on a hardcoded list of top targets for now to keep it fast.
            // In a real app, I'd pass this as a prop or fetch from an API route.

            const TARGETS = [
                // CITIES
                { l: "Lyon", s: "taxi-lyon", d: "Rhône (69)", t: 'CITY' },
                { l: "Marseille", s: "taxi-marseille", d: "Bouches-du-Rhône (13)", t: 'CITY' },
                { l: "Nice", s: "taxi-nice", d: "Alpes-Maritimes (06)", t: 'CITY' },
                { l: "Bordeaux", s: "taxi-bordeaux", d: "Gironde (33)", t: 'CITY' },
                { l: "Toulouse", s: "taxi-toulouse", d: "Haute-Garonne (31)", t: 'CITY' },
                { l: "Lille", s: "taxi-lille", d: "Nord (59)", t: 'CITY' },
                { l: "Cannes", s: "taxi-cannes", d: "Côte d'Azur", t: 'CITY' },
                { l: "Strasbourg", s: "taxi-strasbourg", d: "Alsace", t: 'CITY' },
                { l: "Roissy CDG", s: "taxi-roissy-cdg", d: "Aéroport Paris", t: 'CITY' },
                { l: "Orly", s: "taxi-orly", d: "Aéroport Paris", t: 'CITY' },
                { l: "Disneyland", s: "taxi-disneyland", d: "Marne-la-Vallée", t: 'CITY' },

                // GARES
                { l: "Gare Part-Dieu", s: "taxi-gare-part-dieu", d: "Lyon", t: 'GARE' },
                { l: "Gare Montparnasse", s: "taxi-gare-montparnasse", d: "Paris", t: 'GARE' },
                { l: "Gare de Lyon", s: "taxi-gare-de-lyon", d: "Paris", t: 'GARE' },
                { l: "Gare Saint-Jean", s: "taxi-gare-saint-jean", d: "Bordeaux", t: 'GARE' },
                { l: "Gare Saint-Charles", s: "taxi-gare-saint-charles", d: "Marseille", t: 'GARE' },
            ];

            const filtered = TARGETS.filter(t =>
                t.l.toLowerCase().includes(query.toLowerCase()) ||
                t.d.toLowerCase().includes(query.toLowerCase())
            ).map(t => ({
                label: t.l,
                slug: t.s,
                type: t.t as 'CITY' | 'GARE',
                desc: t.d
            }));

            setResults(filtered);
            setLoading(false);
            setIsOpen(true);
        }, 150);

        return () => clearTimeout(timer);
    }, [query]);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleSelect = (result: SearchResult) => {
        const prefix = result.type === 'CITY' ? 'ville' : 'gare';
        router.push(`/${prefix}/${result.slug}`);
    };

    return (
        <div ref={wrapperRef} className="relative w-full max-w-2xl mx-auto">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-blue-500 transition-colors">
                    <Search size={20} />
                </div>
                <input
                    type="text"
                    className="w-full pl-12 pr-4 py-5 bg-white rounded-2xl border-2 border-transparent focus:border-blue-500 shadow-xl text-lg font-medium outline-none transition-all placeholder:text-neutral-400 text-neutral-900"
                    placeholder="Où cherchez-vous un taxi ? (ex: Lyon, Gare Montparnasse...)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                />

                {loading && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-neutral-400">
                        <Loader2 size={20} className="animate-spin" />
                    </div>
                )}
            </div>

            {/* Results Dropdown */}
            {isOpen && query.length >= 2 && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden z-50">
                    <div className="py-2">
                        {results.map((result) => (
                            <button
                                key={result.slug}
                                onClick={() => handleSelect(result)}
                                className="w-full text-left px-5 py-3 hover:bg-blue-50 transition flex items-center gap-4 group"
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${result.type === 'CITY' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                                    }`}>
                                    {result.type === 'CITY' ? <MapPin size={20} /> : <Train size={20} />}
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-neutral-900 group-hover:text-blue-700">{result.label}</div>
                                    <div className="text-xs text-neutral-500">{result.desc}</div>
                                </div>
                                <ArrowRight size={16} className="text-neutral-300 group-hover:text-blue-500 -translate-x-2 group-hover:translate-x-0 transition-all opacity-0 group-hover:opacity-100" />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {isOpen && query.length >= 2 && results.length === 0 && !loading && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-neutral-100 p-4 text-center text-neutral-500 z-50">
                    Aucun résultat. Essayez "Paris" ou "Gare".
                </div>
            )}
        </div>
    );
}
