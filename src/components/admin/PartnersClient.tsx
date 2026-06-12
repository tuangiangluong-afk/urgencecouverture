"use client";

import { useState } from "react";
import { Users, Plus, Mail, Phone, Briefcase, MapPin, X, Check } from "lucide-react";
import { addPartner, updatePartner, Partner } from "@/app/actions/partners";
import { useToast } from "@/components/admin/Toast";

const REGIONS = [
    "Île-de-France",
    "Auvergne-Rhône-Alpes",
    "Provence-Alpes-Côte d'Azur",
    "Nouvelle-Aquitaine",
    "Occitanie",
    "Hauts-de-France",
    "Grand Est",
    "Pays de la Loire",
    "Bretagne",
    "National"
];

export default function PartnersClient({ initialPartners }: { initialPartners: Partner[] }) {
    const [partners, setPartners] = useState<Partner[]>(initialPartners);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
    const { showToast } = useToast();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        formData.append("regions", JSON.stringify(selectedRegions));
        formData.append("departments", formData.get("managed_departments_input") as string);

        try {
            if (editingPartner) {
                const updates = {
                    name: formData.get("name") as string,
                    email: formData.get("email") as string,
                    phone: formData.get("phone") as string,
                    company_info: { company_name: formData.get("company") as string },
                    managed_regions: selectedRegions,
                    managed_departments: (formData.get("managed_departments_input") as string).split(',').map(d => d.trim()).filter(d => d !== "")
                };
                const updated = await updatePartner(editingPartner.id, updates);
                setPartners(partners.map(p => p.id === updated.id ? updated : p));
                showToast("Partenaire mis à jour !", "success");
            } else {
                const newPartner = await addPartner(formData);
                setPartners([newPartner, ...partners]);
                showToast("Partenaire ajouté avec succès !", "success");
            }
            closeModal();
        } catch (error) {
            showToast("Erreur lors de l'opération", "error");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const openAddModal = () => {
        setEditingPartner(null);
        setSelectedRegions([]);
        setIsModalOpen(true);
    };

    const openEditModal = (partner: Partner) => {
        setEditingPartner(partner);
        setSelectedRegions(partner.managed_regions || []);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPartner(null);
        setSelectedRegions([]);
    };

    const toggleRegion = (region: string) => {
        setSelectedRegions(prev => 
            prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
        );
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Users className="text-blue-600" />
                        Gestion des Partenaires
                    </h1>
                    <p className="text-slate-500">
                        {partners.length} installateurs / partenaires enregistrés
                    </p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium shadow-lg shadow-blue-900/20"
                >
                    <Plus size={18} />
                    Ajouter un Partenaire
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {partners.map(partner => (
                    <div key={partner.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-slate-900">{partner.name}</h3>
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">Actif</span>
                        </div>
                        <div className="space-y-4 text-sm text-slate-600 flex-1">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Mail size={14} className="text-slate-400" />
                                    <a href={`mailto:${partner.email}`} className="hover:text-blue-600">{partner.email}</a>
                                </div>
                                {partner.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone size={14} className="text-slate-400" />
                                        <span>{partner.phone}</span>
                                    </div>
                                )}
                                {partner.company_info && typeof partner.company_info === 'object' && 'company_name' in partner.company_info && (
                                    <div className="flex items-center gap-2">
                                        <Briefcase size={14} className="text-slate-400" />
                                        <span className="font-medium text-slate-900">{(partner.company_info as any).company_name}</span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Managed Regions Display */}
                            <div className="pt-2 border-t border-slate-100">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                    <MapPin size={12} />
                                    Couverture Géo
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {partner.managed_regions && partner.managed_regions.map(r => (
                                        <span key={r} className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded border border-blue-100">
                                            {r}
                                        </span>
                                    ))}
                                    {partner.managed_departments && partner.managed_departments.map(d => (
                                        <span key={d} className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded border border-slate-200 font-bold">
                                            Dép. {d}
                                        </span>
                                    ))}
                                    {(!partner.managed_regions?.length && !partner.managed_departments?.length) && (
                                        <span className="text-[10px] text-slate-400 italic">Aucune zone assignée</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
                            <span className="text-slate-400">Ajouté le {new Date(partner.created_at).toLocaleDateString()}</span>
                            <button 
                                onClick={() => openEditModal(partner)}
                                className="text-blue-600 font-bold hover:underline"
                            >
                                Modifier
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Ajout / Modification */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">
                            {editingPartner ? "Modifier Partenaire" : "Nouveau Partenaire"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Nom / Contact</label>
                                    <input 
                                        name="name" 
                                        required 
                                        defaultValue={editingPartner?.name}
                                        placeholder="Jean Dupont" 
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Société</label>
                                    <input 
                                        name="company" 
                                        defaultValue={(editingPartner?.company_info as any)?.company_name}
                                        placeholder="ELEC 2000" 
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                    <input 
                                        name="email" 
                                        type="email" 
                                        required 
                                        defaultValue={editingPartner?.email}
                                        placeholder="contact@elec.com" 
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
                                    <input 
                                        name="phone" 
                                        defaultValue={editingPartner?.phone || ""}
                                        placeholder="06..." 
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                                    />
                                </div>
                            </div>

                            {/* Department Selection */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-2">
                                    <MapPin size={16} className="text-blue-600" />
                                    Départements gérés
                                </label>
                                <p className="text-[10px] text-slate-400 mb-2">Entrez les numéros séparés par une virgule (ex: 75, 92, 33)</p>
                                <input 
                                    name="managed_departments_input"
                                    defaultValue={editingPartner?.managed_departments?.join(', ') || ""}
                                    placeholder="75, 92, 94..." 
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm" 
                                />
                            </div>

                            {/* Region Selection */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Régions gérées (Macro)</label>
                                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 max-h-40 overflow-y-auto">
                                    {REGIONS.map(region => (
                                        <label key={region} className="flex items-center gap-2 p-2 hover:bg-white rounded border border-transparent hover:border-slate-100 cursor-pointer transition">
                                            <input 
                                                type="checkbox"
                                                checked={selectedRegions.includes(region)}
                                                onChange={() => toggleRegion(region)}
                                                className="w-4 h-4 text-blue-600 rounded"
                                            />
                                            <span className="text-xs text-slate-700">{region}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border rounded-lg hover:bg-slate-50 font-medium">Annuler</button>
                                <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold disabled:opacity-50 shadow-lg shadow-blue-900/20">
                                    {loading ? 'Opération...' : editingPartner ? 'Mettre à jour' : 'Ajouter'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

