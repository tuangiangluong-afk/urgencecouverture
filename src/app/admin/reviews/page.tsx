"use client";

import { useState, useEffect, useCallback } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { Star, Plus, Trash2, Edit2, Save, X, CheckCircle, MessageSquare } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/components/admin/Toast";

interface Review {
    id: string;
    tenant_id: string;
    author_name: string;
    rating: number;
    content: string;
    source: string;
    is_active: boolean;
    created_at: string;
}

export default function AdminReviewsPage() {
    const searchParams = useSearchParams();
    const currentTenantId = searchParams.get("tenantId");

    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const { showToast } = useToast();

    // Form state
    const [formData, setFormData] = useState({
        tenant_id: "",
        author_name: "",
        rating: 5,
        content: "",
        source: "Google",
    });

    const fetchReviews = useCallback(async () => {
        setLoading(true);

        let query = supabaseBrowser
            .from("reviews")
            .select("*")
            .order("created_at", { ascending: false });

        if (currentTenantId && currentTenantId !== 'all') {
            query = query.eq("tenant_id", currentTenantId);
        }

        const { data, error } = await query;
        if (error) {
            console.error("Error fetching reviews:", error);
        } else {
            setReviews(data || []);
        }
        setLoading(false);
    }, [currentTenantId]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            tenant_id: formData.tenant_id,
            author_name: formData.author_name,
            rating: formData.rating,
            content: formData.content,
            source: formData.source,
        };

        let error;
        if (editingId) {
            // Update
            const result = await supabaseBrowser
                .from("reviews")
                .update(payload)
                .eq("id", editingId);
            error = result.error;
        } else {
            // Insert
            const result = await supabaseBrowser
                .from("reviews")
                .insert({ ...payload, is_active: true });
            error = result.error;
        }

        if (error) {
            showToast("Erreur: " + error.message, "error");
        } else {
            showToast(editingId ? "Avis modifié !" : "Avis ajouté !", "success");
            resetForm();
            fetchReviews();
        }
    };

    const handleEdit = (review: Review) => {
        setFormData({
            tenant_id: review.tenant_id,
            author_name: review.author_name,
            rating: review.rating,
            content: review.content,
            source: review.source,
        });
        setEditingId(review.id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Supprimer cet avis ?")) {
            await supabaseBrowser.from("reviews").delete().eq("id", id);
            fetchReviews();
        }
    };

    const handleToggleActive = async (id: string, currentState: boolean) => {
        await supabaseBrowser
            .from("reviews")
            .update({ is_active: !currentState })
            .eq("id", id);
        fetchReviews();
    };

    const resetForm = () => {
        setFormData({
            tenant_id: currentTenantId || "",
            author_name: "",
            rating: 5,
            content: "",
            source: "Google",
        });
        setEditingId(null);
        setShowForm(false);
    };

    // Update form tenant when switching workspace
    useEffect(() => {
        if (currentTenantId && currentTenantId !== 'all') {
            setFormData(prev => ({ ...prev, tenant_id: currentTenantId }));
        }
    }, [currentTenantId]);

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <MessageSquare className="text-blue-600" />
                        Gestion des Avis
                    </h1>
                    <p className="text-slate-500">Gérez la e-réputation de vos sites.</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition shadow-lg shadow-slate-900/20"
                >
                    <Plus size={18} />
                    Ajouter un avis
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                            <h2 className="text-xl font-bold text-slate-900">
                                {editingId ? "Modifier l'avis" : "Nouvel avis"}
                            </h2>
                            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 transition">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">
                                    Code Site (Slug)
                                </label>
                                <input
                                    required
                                    type="text"
                                    placeholder="ex: neuilly-sur-seine"
                                    value={formData.tenant_id}
                                    onChange={(e) => setFormData({ ...formData, tenant_id: e.target.value })}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">
                                    Nom Client
                                </label>
                                <input
                                    required
                                    type="text"
                                    placeholder="ex: Jean Dupont"
                                    value={formData.author_name}
                                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">
                                    Note
                                </label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((n) => (
                                        <button
                                            key={n}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, rating: n })}
                                            className={`p-2 rounded-lg transition ${formData.rating >= n
                                                ? "bg-yellow-400 text-white shadow-sm"
                                                : "bg-slate-100 text-slate-400"
                                                }`}
                                        >
                                            <Star size={20} fill="currentColor" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">
                                    Commentaire
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    placeholder="Service impeccable..."
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition font-medium"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-bold shadow-lg shadow-blue-500/20"
                                >
                                    <Save size={18} />
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Reviews Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-slate-400">Chargement des avis...</div>
                ) : reviews.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <p className="mb-2">Aucun avis trouvé.</p>
                        <p className="text-sm">Assurez-vous d'avoir exécuté le script SQL <code>schema.sql</code> dans Supabase.</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase">Site</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase">Client</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase">Note</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase">Avis</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase">Statut</th>
                                <th className="text-right px-6 py-3 text-xs font-bold text-slate-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {reviews.map((review) => (
                                <tr key={review.id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-600">
                                            {review.tenant_id}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                                        {review.author_name}
                                        <div className="text-xs text-slate-400">{review.source}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex text-yellow-400">
                                            {[...Array(review.rating)].map((_, i) => (
                                                <Star key={i} size={14} fill="currentColor" />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate" title={review.content}>
                                        {review.content}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggleActive(review.id, review.is_active)}
                                            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${review.is_active
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {review.is_active ? <CheckCircle size={12} /> : <X size={12} />}
                                            {review.is_active ? "Publié" : "Masqué"}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(review)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                title="Modifier"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(review.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                title="Supprimer"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
