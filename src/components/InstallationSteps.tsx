"use client";

export default function InstallationSteps() {
    const steps = [
        { title: "1. Diagnostic gratuit", desc: "Recherche de fuites et examen détaillé de votre toiture sous 24h." },
        { title: "2. Devis Détaillé", desc: "Estimation gratuite et précise des travaux de couverture nécessaires." },
        { title: "3. Intervention", desc: "Travaux de réfection ou réparation par nos couvreurs qualifiés RGE." },
        { title: "4. Garantie Décennale", desc: "Validation de l'étanchéité et activation de la garantie de 100%." }
    ];

    return (
        <section className="py-16 bg-slate-50">
            <div className="container mx-auto px-4 max-w-5xl">
                <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">Comment se déroule notre intervention ?</h2>
                <div className="grid md:grid-cols-4 gap-6">
                    {steps.map((s, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <div className="text-4xl font-black text-orange-100 mb-2">0{i + 1}</div>
                            <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                            <p className="text-sm text-slate-600">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
