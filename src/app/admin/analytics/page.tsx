"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { TrendingUp, Users, CheckCircle, XCircle, Activity, ArrowUpRight } from "lucide-react";

interface LeadStats {
    total: number;
    new: number;
    contacted: number;
    converted: number;
    lost: number;
}

interface CityPerformance {
    name: string;
    count: number;
    revenue: number; // Simulated based on avg ticket (2k€)
}

export default function AdminAnalyticsPage() {
    const [stats, setStats] = useState<LeadStats>({ total: 0, new: 0, contacted: 0, converted: 0, lost: 0 });
    const [topCities, setTopCities] = useState<CityPerformance[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            setLoading(true);
            const { data: leads, error } = await supabaseBrowser
                .from("leads")
                .select("*");

            if (error) {
                console.error("Error fetching analytics:", error);
                setLoading(false);
                return;
            }

            // Calculate Stats
            const newStats = {
                total: leads.length,
                new: leads.filter(l => l.status === 'new').length,
                contacted: leads.filter(l => l.status === 'contacted').length,
                converted: leads.filter(l => l.status === 'converted').length,
                lost: leads.filter(l => l.status === 'lost').length,
            };
            setStats(newStats);

            // Calculate Top Cities
            const cityMap: Record<string, number> = {};
            leads.forEach(lead => {
                const city = lead.city || lead.tenant_id || "Inconnu";
                cityMap[city] = (cityMap[city] || 0) + 1;
            });

            const rankedCities = Object.entries(cityMap)
                .map(([name, count]) => ({ name, count, revenue: count * 150 })) // 150€ commission est.
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);

            setTopCities(rankedCities);
            setLoading(false);
        }

        fetchStats();
    }, []);

    const conversionRate = stats.total > 0 ? ((stats.converted / stats.total) * 100).toFixed(1) : "0";

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="text-blue-600" />
                    Analytics & Performance
                </h1>
                <div className="text-sm text-slate-500">
                    Basé sur {stats.total} leads réels
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Users size={20} />
                        </div>
                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">{loading ? "-" : stats.total}</div>
                    <div className="text-sm text-slate-500">Leads Totaux</div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">{loading ? "-" : `${conversionRate}%`}</div>
                    <div className="text-sm text-slate-500">Taux de conversion</div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                            <CheckCircle size={20} />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">{loading ? "-" : stats.converted}</div>
                    <div className="text-sm text-slate-500">Chantiers Signés</div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                            <XCircle size={20} />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">{loading ? "-" : stats.lost}</div>
                    <div className="text-sm text-slate-500">Perdus / Sans suite</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Cities */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900">Top Villes (Volume)</h3>
                        <button className="text-sm text-blue-600 hover:underline">Voir tout</button>
                    </div>
                    <div className="p-6">
                        {loading ? (
                            <div className="text-center py-8 text-slate-400">Calcul en cours...</div>
                        ) : topCities.length === 0 ? (
                            <div className="text-center py-8 text-slate-400">Aucune donnée géographique</div>
                        ) : (
                            <div className="space-y-6">
                                {topCities.map((city, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900 capitalize">{city.name.includes(".") ? "National" : city.name}</div>
                                                <div className="text-xs text-slate-500">{city.count} leads</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-slate-900">{city.revenue}€</div>
                                            <div className="text-xs text-green-600 font-medium">Est. Com</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Funnel Visualization */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="font-bold text-slate-900">Pipeline de Vente</h3>
                    </div>
                    <div className="p-6">
                        {loading ? (
                            <div className="text-center py-8 text-slate-400">Chargement...</div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-slate-700">Nouveaux (Non traités)</span>
                                        <span className="text-slate-900 font-bold">{stats.new}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(stats.new / stats.total) * 100}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-slate-700">Contactés / Devis envoyé</span>
                                        <span className="text-slate-900 font-bold">{stats.contacted}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                        <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${(stats.contacted / stats.total) * 100}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-slate-700">Signés (Gagnés)</span>
                                        <span className="text-slate-900 font-bold">{stats.converted}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(stats.converted / stats.total) * 100}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-slate-700">Perdus</span>
                                        <span className="text-slate-900 font-bold">{stats.lost}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                        <div className="bg-red-200 h-2 rounded-full" style={{ width: `${(stats.lost / stats.total) * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 p-4 bg-slate-50 rounded-lg flex gap-3">
                            <Activity className="text-blue-600 shrink-0" />
                            <div className="text-sm text-slate-600">
                                <span className="font-bold text-slate-900">Conseil :</span> Le taux de conversion est bas sur les leads "Entreprise". Pensez à relancer les devis de plus de 7 jours.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
