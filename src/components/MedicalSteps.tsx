import { FileText, CreditCard, Ambulance, CheckCircle } from "lucide-react";

interface MedicalStepsProps {
    cityName?: string;
}

export function MedicalSteps({ cityName }: MedicalStepsProps) {
    return (
        <div className="py-10">
            <h3 className="text-2xl font-bold mb-2 text-center text-slate-900">
                Tiers-Payant : Comment ne rien payer ?
            </h3>
            <p className="text-center text-slate-500 mb-8 max-w-xl mx-auto">
                Avec une prescription médicale, votre transport peut être pris en charge à 100% par la Sécurité Sociale.
            </p>

            {/* Steps */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
                {/* Step 1 */}
                <div className="relative text-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Étape 1
                    </div>
                    <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 mt-2">
                        <FileText size={32} />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Prescription Médicale</h4>
                    <p className="text-sm text-slate-500">
                        Votre médecin vous délivre un <strong>bon de transport</strong> pour vos rendez-vous médicaux.
                    </p>
                </div>

                {/* Step 2 */}
                <div className="relative text-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Étape 2
                    </div>
                    <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 mt-2">
                        <CreditCard size={32} />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Carte Vitale</h4>
                    <p className="text-sm text-slate-500">
                        Présentez simplement votre carte Vitale au chauffeur. C&apos;est tout ce qu&apos;il vous faut.
                    </p>
                </div>

                {/* Step 3 */}
                <div className="relative text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-400 shadow-sm">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Résultat
                    </div>
                    <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4 mt-2">
                        <Ambulance size={32} />
                    </div>
                    <h4 className="text-lg font-bold text-green-700 mb-2">0€ à payer</h4>
                    <p className="text-sm text-green-700">
                        Nous gérons directement la facturation avec la <strong>CPAM</strong>. Vous ne payez rien.
                    </p>
                </div>
            </div>

            {/* Trust Badge */}
            <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl text-center max-w-2xl mx-auto">
                <div className="flex items-center justify-center gap-3 flex-wrap">
                    <CheckCircle className="text-blue-600" size={24} />
                    <span className="text-blue-800 font-bold">
                        Chauffeur Agréé CPAM • Conventionné Sécurité Sociale • ARS
                    </span>
                </div>
                {cityName && (
                    <p className="text-sm text-blue-600 mt-2">
                        Transport médical assis disponible 7j/7 à {cityName}
                    </p>
                )}
            </div>

            {/* Conditions */}
            <div className="mt-8 text-center">
                <p className="text-xs text-slate-400 max-w-lg mx-auto">
                    La prise en charge à 100% s&apos;applique pour les ALD, les femmes enceintes (7e mois+),
                    les accidents du travail et certaines situations. En cas de doute, consultez votre médecin.
                </p>
            </div>
        </div>
    );
}
