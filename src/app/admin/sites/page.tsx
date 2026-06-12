export default function AdminSitesPage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Gestion des Sites</h1>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition font-medium">
                    + Nouveau Site
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
                <div className="max-w-md mx-auto">
                    <h2 className="text-lg font-semibold text-slate-900 mb-2">Module Sites en construction</h2>
                    <p className="text-slate-500 mb-6">
                        Ici, vous pourrez gérer la configuration de vos 50+ sites (titres, images, téléphone).
                        Actuellement, la configuration est gérée via le code (`sites-config.ts`).
                    </p>
                    <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        Coming Soon
                    </span>
                </div>
            </div>
        </div>
    );
}
