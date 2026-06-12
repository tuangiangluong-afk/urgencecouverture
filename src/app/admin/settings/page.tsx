export default function AdminSettingsPage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Paramètres</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
                <div className="max-w-md mx-auto">
                    <h2 className="text-lg font-semibold text-slate-900 mb-2">Configuration Système</h2>
                    <p className="text-slate-500 mb-6">
                        Gestion des utilisateurs Admin, des notifications et des clés API.
                    </p>
                    <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        Coming Soon
                    </span>
                </div>
            </div>
        </div>
    );
}
