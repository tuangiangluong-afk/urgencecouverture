"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { Save, Loader2, LayoutTemplate, FileText } from "lucide-react";
import { useToast } from "@/components/admin/Toast";

// Define editable fields for the "Home" page
const HOME_FIELDS = [
    { key: "hero_title", label: "Titre Hero (H1)", type: "text", placeholder: "Couvreur Toiture à..." },
    { key: "hero_subtitle", label: "Sous-titre Hero", type: "textarea", placeholder: "Intervention rapide pour fuites, rénovation de toiture, zinguerie..." },
    { key: "cta_button", label: "Texte CTA Button", type: "text", placeholder: "Demander une intervention en urgence" },
    { key: "about_title", label: "Titre 'À Propos'", type: "text", placeholder: "Pourquoi choisir Urgence Couverture ?" },
    { key: "about_text", label: "Texte 'À Propos'", type: "textarea", placeholder: "Nos équipes d'artisans couvreurs certifiés interviennent en urgence 7j/7 pour protéger votre habitation..." },
];

export default function AdminPagesPage() {
    const searchParams = useSearchParams();
    const tenantId = searchParams.get("tenantId") || "home";

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [contentMap, setContentMap] = useState<Record<string, string>>({});
    const { showToast } = useToast();

    const fetchContent = useCallback(async () => {
        if (!tenantId) return;
        setLoading(true);
        // Fetch overrides for this page
        const { data } = await supabaseBrowser
            .from("content_pages")
            .select("*")
            .eq("tenant_id", tenantId)
            .eq("section", "home"); // Simplify: all Home fields

        const map: Record<string, string> = {};
        if (data) {
            data.forEach(item => {
                map[item.key] = item.value || "";
            });
        }
        setContentMap(map);
        setLoading(false);
    }, [tenantId]);

    useEffect(() => {
        fetchContent();
    }, [fetchContent]);

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        if (!tenantId) return;

        setSaving(true);

        const updates = HOME_FIELDS.map(field => ({
            tenant_id: tenantId,
            path: "/",
            section: "home",
            key: field.key,
            value: contentMap[field.key] || null,
            type: "text"
        }));

        const { error } = await supabaseBrowser
            .from("content_pages")
            .upsert(updates, { onConflict: 'tenant_id, path, section, key' });

        if (error) {
            showToast("Erreur sauvegarde: " + error.message, "error");
        } else {
            showToast("Contenu enregistré !", "success");
        }
        setSaving(false);
    }

    const handleChange = (key: string, val: string) => {
        setContentMap(prev => ({ ...prev, [key]: val }));
    };

    if (!tenantId) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                <LayoutTemplate size={48} className="text-slate-300 mb-4" />
                <h2 className="text-xl font-bold text-slate-900">Sélectionnez un site</h2>
                <p className="text-slate-500 max-w-md mt-2">
                    Veuillez sélectionner un site (Tenant) dans le menu déroulant en haut pour éditer son contenu.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <FileText className="text-blue-600" />
                        Éditeur de Pages
                    </h1>
                    <p className="text-sm text-slate-500">Personnalisez le contenu de la page d'accueil pour <span className="font-mono bg-slate-100 px-1 rounded text-slate-700">{tenantId}</span></p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving || loading}
                    className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition disabled:opacity-50 shadow-lg shadow-slate-900/20"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Enregistrer
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="border-b border-slate-100 p-4 bg-slate-50 flex items-center gap-2 text-sm font-bold text-slate-700">
                    <LayoutTemplate size={16} />
                    Page d'Accueil (Hero & Access)
                </div>

                {loading ? (
                    <div className="p-12 text-center text-slate-400">Chargement du contenu...</div>
                ) : (
                    <form onSubmit={handleSave} className="p-8 space-y-6">
                        {HOME_FIELDS.map((field) => (
                            <div key={field.key} className="space-y-2">
                                <label className="block text-sm font-bold text-slate-900">
                                    {field.label}
                                </label>
                                {field.type === 'textarea' ? (
                                    <textarea
                                        className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition min-h-[100px]"
                                        placeholder={field.placeholder}
                                        value={contentMap[field.key] || ""}
                                        onChange={e => handleChange(field.key, e.target.value)}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                        placeholder={field.placeholder}
                                        value={contentMap[field.key] || ""}
                                        onChange={e => handleChange(field.key, e.target.value)}
                                    />
                                )}
                                <p className="text-xs text-slate-400">
                                    Laissez vide pour utiliser le texte par défaut (Code/Spintax).
                                </p>
                            </div>
                        ))}
                    </form>
                )}
            </div>
        </div>
    );
}
