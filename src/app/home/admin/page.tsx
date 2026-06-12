import { CITIES } from "@/lib/db";
import { BarChart3, Phone, TrendingUp, Users } from "lucide-react";

export default function AdminPage() {
    return (
        <div className="min-h-screen bg-gray-50 text-neutral-900">
            <header className="bg-white border-b px-8 py-4">
                <h1 className="text-xl font-bold">Urgence Couverture Master Admin</h1>
            </header>

            <main className="p-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                <Phone size={20} />
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">1,248</div>
                        <div className="text-sm text-neutral-500">Appels ce mois (+12%)</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                <Users size={20} />
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">18</div>
                        <div className="text-sm text-neutral-500">Villes Actives</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                <BarChart3 size={20} />
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">24 min</div>
                        <div className="text-sm text-neutral-500">Temps moyen appel</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                                <TrendingUp size={20} />
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">4.2k€</div>
                        <div className="text-sm text-neutral-500">Revenus Mensuels</div>
                    </div>
                </div>

                <h2 className="text-lg font-bold mb-4">Performance par Ville</h2>
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4 font-medium text-gray-500">Ville / Tenant</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Status</th>
                                <th className="px-6 py-4 font-medium text-gray-500 text-right">Appels (30j)</th>
                                <th className="px-6 py-4 font-medium text-gray-500 text-right">Conv. Est.</th>
                                <th className="px-6 py-4 font-medium text-gray-500 text-right">Revenu</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {Object.values(CITIES).map((city, i) => (
                                <tr key={city.slug} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-500">
                                                {city.slug.substring(4, 6).toUpperCase()}
                                            </div>
                                            <div>
                                                <div>{city.name}</div>
                                                <div className="text-xs text-gray-400">{city.domain}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Actif
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono">
                                        {Math.floor(Math.random() * 200) + 50}
                                    </td>
                                    <td className="px-6 py-4 text-right text-gray-500">
                                        {Math.floor(Math.random() * 40) + 10}%
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-gray-900">
                                        300 €
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
