"use client";

export default function PricingTable() {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
                    Quel prix pour vos travaux de toiture en 2026 ?
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full max-w-4xl mx-auto text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100 text-slate-700">
                                <th className="p-4 border-b">Type d&apos;intervention</th>
                                <th className="p-4 border-b">Matériel (Fourniture)</th>
                                <th className="p-4 border-b">Main d&apos;œuvre (Pose)</th>
                                <th className="p-4 border-b">Tarif Moyen*</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-600">
                            <tr className="border-b hover:bg-slate-50">
                                <td className="p-4 font-bold text-orange-950">Dépannage Fuite / Bâchage Urgence</td>
                                <td className="p-4">100€ - 300€</td>
                                <td className="p-4">150€ - 400€</td>
                                <td className="p-4 font-bold text-green-600">Dès 250€ TTC</td>
                            </tr>
                            <tr className="border-b hover:bg-slate-50">
                                <td className="p-4 font-bold text-orange-950">Nettoyage &amp; Démoussage</td>
                                <td className="p-4">5€ - 15€ / m²</td>
                                <td className="p-4">10€ - 20€ / m²</td>
                                <td className="p-4 font-bold text-green-600">Dès 15€ / m² TTC</td>
                            </tr>
                            <tr className="border-b hover:bg-slate-50">
                                <td className="p-4 font-bold text-orange-950">Réfection Toiture Complète</td>
                                <td className="p-4">80€ - 140€ / m²</td>
                                <td className="p-4">40€ - 80€ / m²</td>
                                <td className="p-4 font-bold text-green-600">Sur Devis (Aides déduites)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p className="text-center text-sm text-slate-500 mt-4 italic">
                    *Estimations moyennes 2026. Pour les travaux d&apos;isolation sous toiture et de rénovation énergétique globale, des aides de l&apos;État (MaPrimeRénov&apos;) peuvent financer une grande partie de vos travaux.
                </p>
            </div>
        </section>
    );
}
