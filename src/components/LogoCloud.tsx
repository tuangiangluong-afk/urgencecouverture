import { Shield, CheckCircle } from "lucide-react";

const BRANDS = [
    { name: "Velux", tier: "Fenêtres" },
    { name: "Terreal", tier: "Tuiles" },
    { name: "Monier", tier: "Tuiles" },
    { name: "Soprema", tier: "Étanchéité" },
    { name: "Edilians", tier: "Tuiles" },
    { name: "Koramic", tier: "Tuiles" }
];

export default function LogoCloud() {
    return (
        <section className="py-10 border-b border-slate-100 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                        Nos couvreurs partenaires utilisent les marques :
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                        {BRANDS.map((brand) => (
                            <div key={brand.name} className="group flex items-center gap-2 cursor-default">
                                {brand.name === "Velux" && <span className="font-bold text-xl tracking-tighter text-blue-900 group-hover:text-blue-600">VELUX</span>}
                                {brand.name === "Terreal" && <span className="font-bold text-xl italic font-serif text-red-800 group-hover:text-red-600">Terreal</span>}
                                {brand.name === "Monier" && <span className="font-bold text-xl uppercase tracking-widest text-slate-800">MONIER</span>}
                                {brand.name === "Soprema" && <span className="font-bold text-xl tracking-tight text-blue-700">SOPREMA</span>}
                                {brand.name === "Edilians" && <span className="font-bold text-lg text-emerald-800 group-hover:text-emerald-600">Edilians</span>}
                                {brand.name === "Koramic" && <span className="font-bold text-xl tracking-wide text-orange-800">koramic</span>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
