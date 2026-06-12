"use client";

import { useState } from "react";
import { Users, Filter, Download, Eye, Phone, Mail, Building, Home, Briefcase, X, Link as LinkIcon, Check, MapPin, CreditCard } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { updateLeadStatus, updateLeadDetails } from "@/app/actions/leads";
import { useToast } from "@/components/admin/Toast";

interface Lead {
    id: string;
    tenant_id: string;
    status: string;
    type: string;
    name: string;
    email: string;
    phone: string;
    company: string | null;
    city: string | null;
    message: string | null;
    postal_code: string | null;
    housing_type: string | null;
    notes: string | null;
    price: number | null;
    region: string | null;
    department: string | null;
    is_paid: boolean;
    created_at: string;
}

interface Partner {
    id: string;
    name: string;
    email: string;
}

const REGIONS = [
    "National",
    "Île-de-France",
    "Auvergne-Rhône-Alpes",
    "Provence-Alpes-Côte d'Azur",
    "Nouvelle-Aquitaine",
    "Occitanie",
    "Hauts-de-France",
    "Grand Est",
    "Pays de la Loire",
    "Bretagne"
];

export default function LeadsClient({ initialLeads, partners }: { initialLeads: any[], partners: Partner[] }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const currentTenantId = searchParams.get("tenantId");
    const currentRegion = searchParams.get("region") || "all";

    // Filter leads based on search params (Client-Side Filtering)
    let filteredLeads = currentTenantId && currentTenantId !== 'all'
        ? initialLeads.filter(l => l.tenant_id === currentTenantId)
        : initialLeads;
    
    if (currentRegion !== "all") {
        filteredLeads = filteredLeads.filter(l => l.region === currentRegion);
    }

    const [leads, setLeads] = useState<Lead[]>(filteredLeads);
    const { showToast } = useToast();

    // Modal State
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [selectedPartnerIds, setSelectedPartnerIds] = useState<string[]>([]);
    const [assignmentHistory, setAssignmentHistory] = useState<any[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    // UI States
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUpdatingLead, setIsUpdatingLead] = useState(false);
    const [editNotes, setEditNotes] = useState("");
    const [editPrice, setEditPrice] = useState(20);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const copyToClipboard = (leadId: string) => {
        const url = `${window.location.origin}/leads/unlock/${leadId}`;
        navigator.clipboard.writeText(url);
        setCopiedId(leadId);
        showToast("Lien de vente copié !", "success");
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleRegionFilter = (region: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (region === "all") {
            params.delete("region");
        } else {
            params.set("region", region);
        }
        router.push(`?${params.toString()}`);
    };

    async function togglePaidStatus(lead: Lead) {
        const newPaidStatus = !lead.is_paid;
        try {
            await updateLeadDetails(lead.id, { is_paid: newPaidStatus });
            setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, is_paid: newPaidStatus } : l));
            showToast(newPaidStatus ? "Lead marqué comme PAYÉ ✅" : "Paiement annulé", "success");
        } catch (e) {
            showToast("Erreur mise à jour paiement", "error");
        }
    }

    // Initial Fetch when opening modal
    async function openModal(lead: Lead) {
        setSelectedLead(lead);
        setSelectedPartnerIds([]);
        setAssignmentHistory([]);
        setIsLoadingHistory(true);
        setIsSuccess(false);
        setEditNotes(lead.notes || "");
        setEditPrice(lead.price || 20);

        try {
            const { getLeadAssignments } = await import("@/app/actions/leads");
            const history = await getLeadAssignments(lead.id);
            setAssignmentHistory(history || []);
        } catch (e) {
            console.error("Failed to load history", e);
        } finally {
            setIsLoadingHistory(false);
        }
    }

    async function handleUpdateLead() {
        if (!selectedLead) return;
        setIsUpdatingLead(true);
        try {
            await updateLeadDetails(selectedLead.id, { notes: editNotes, price: editPrice });
            setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, notes: editNotes, price: editPrice } : l));
            showToast("Plomberie mise à jour !", "success");
        } catch (e) {
            showToast("Erreur mise à jour infos", "error");
        } finally {
            setIsUpdatingLead(false);
        }
    }

    async function handleAssignment() {
        if (!selectedLead || selectedPartnerIds.length === 0) return;
        setIsSubmitting(true);

        try {
            const { assignLeadToPartners } = await import("@/app/actions/leads");
            await assignLeadToPartners(selectedLead.id, selectedPartnerIds);

            // Update local state
            setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, status: 'sold' } : l));

            setIsSuccess(true);
        } catch (e) {
            showToast("Erreur lors de l'assignation", "error");
        } finally {
            setIsSubmitting(false);
        }
    }

    const togglePartner = (id: string) => {
        setSelectedPartnerIds(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-blue-100 text-blue-700';
            case 'contacted': return 'bg-yellow-100 text-yellow-700';
            case 'converted': return 'bg-green-100 text-green-700';
            case 'sold': return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
            case 'lost': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getTypeIcon = (type: string) => {
        if (type?.includes('copro')) return <Building size={16} className="text-purple-600" />;
        if (type?.includes('entreprise')) return <Briefcase size={16} className="text-slate-600" />;
        return <Home size={16} className="text-blue-600" />;
    };

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Users className="text-blue-600" />
                        Leads & Devis
                    </h1>
                    <p className="text-slate-500">
                        {leads.length} leads trouvés {currentTenantId ? `pour ${currentTenantId}` : "au total"}
                    </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                    {/* Region Filter Dropdown */}
                    <div className="flex items-center gap-2 bg-white border border-slate-200 p-1 rounded-lg shadow-sm">
                        <div className="pl-3 pr-1 text-slate-400">
                            <MapPin size={16} />
                        </div>
                        <select 
                            value={currentRegion}
                            onChange={(e) => handleRegionFilter(e.target.value)}
                            className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 cursor-pointer pr-8"
                        >
                            <option value="all">Toutes les régions</option>
                            {REGIONS.map(r => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                    </div>

                    <button className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition font-medium">
                        <Filter size={18} />
                        Plus de filtres
                    </button>
                    <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition shadow-lg shadow-slate-900/20">
                        <Download size={18} />
                        Export
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {leads.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <p className="mb-2">Aucun lead pour le moment.</p>
                        <p className="text-sm">Vérifiez que le formulaire frontal enregistre bien en base.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase">Date</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase">Region / Site</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase">Statut / Payé</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase">Contact</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase">Projet</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase">Prix (HT)</th>
                                    <th className="text-right px-6 py-3 text-xs font-bold text-slate-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {leads.map((lead) => {
                                    let solarInterest = false;
                                    try {
                                        if (lead.message) {
                                            const meta = JSON.parse(lead.message);
                                            solarInterest = meta.solar_interest;
                                        }
                                    } catch (e) { }

                                    return (
                                        <tr key={lead.id} className={`hover:bg-slate-50 transition group ${lead.is_paid ? 'bg-emerald-50/30' : ''}`}>
                                            <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                                                {format(new Date(lead.created_at), "dd MMM yyyy", { locale: fr })}
                                                <div className="text-xs text-slate-400">
                                                    {format(new Date(lead.created_at), "HH:mm")}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded self-start uppercase">
                                                        {lead.region || "National"}
                                                    </span>
                                                    <span className="text-xs text-slate-400">
                                                        {lead.tenant_id}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-2">
                                                    <select
                                                        value={lead.status}
                                                        onChange={async (e) => {
                                                            const newStatus = e.target.value;
                                                            try {
                                                                await updateLeadStatus(lead.id, newStatus);
                                                                setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: newStatus } : l));
                                                            } catch (err) {
                                                                showToast("Erreur mise à jour statut", "error");
                                                            }
                                                        }}
                                                        className={`text-[10px] font-bold px-2 py-1 rounded-full border-0 cursor-pointer focus:ring-2 focus:ring-blue-500 ${getStatusColor(lead.status)}`}
                                                    >
                                                        <option value="new">New</option>
                                                        <option value="contacted">Contacted</option>
                                                        <option value="converted">Converted</option>
                                                        <option value="lost">Lost</option>
                                                        <option value="sold">VENDU ($)</option>
                                                    </select>
                                                    
                                                    {/* Paid Status Toggle */}
                                                    <button 
                                                        onClick={() => togglePaidStatus(lead)}
                                                        className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border transition ${lead.is_paid 
                                                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                                                            : 'bg-white text-slate-400 border-slate-200 hover:border-emerald-200 hover:text-emerald-600'}`}
                                                    >
                                                        <CreditCard size={10} />
                                                        {lead.is_paid ? "PAYÉ" : "NON PAYÉ"}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900">{lead.name}</span>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                                        <Mail size={12} /> {lead.email}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <Phone size={12} /> {lead.phone}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 mb-1">
                                                    {getTypeIcon(lead.type)}
                                                    <span className="text-sm font-medium text-slate-700 capitalize">{lead.type || "N/A"}</span>
                                                    {solarInterest && (
                                                        <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-yellow-200">
                                                            ☀️ Solaire
                                                        </span>
                                                    )}
                                                </div>
                                                {lead.city && (
                                                    <div className="text-xs text-slate-500">
                                                        📍 {lead.city} {lead.postal_code ? `(${lead.postal_code})` : ''} {lead.department ? `[Dép. ${lead.department}]` : ''}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-bold text-slate-700">
                                                    {lead.price || 20} €
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => copyToClipboard(lead.id)}
                                                        className={`p-2 rounded-lg transition border shadow-sm flex items-center gap-1 ${copiedId === lead.id ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-white text-slate-400 hover:text-blue-600 hover:border-blue-200'}`}
                                                        title="Copier le lien de vente"
                                                    >
                                                        {copiedId === lead.id ? <Check size={14} /> : <LinkIcon size={14} />}
                                                    </button>
                                                    <button
                                                        onClick={() => openModal(lead)}
                                                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition font-bold flex items-center gap-1 border border-emerald-200 shadow-sm"
                                                        title="Assigner / Vendre"
                                                    >
                                                        <span className="text-xs">Vendre ($)</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Assignment Modal */}
            {selectedLead && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">

                        {isSuccess ? (
                            <div className="text-center py-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">🎉 Lead Vendu !</h2>
                                <p className="text-slate-500 mb-8">
                                    L'email de notification a été envoyé à {selectedPartnerIds.length} partenaire(s).
                                </p>
                                <button
                                    onClick={() => setSelectedLead(null)}
                                    className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:scale-105 transition shadow-lg shadow-slate-900/20"
                                >
                                    Fermer et retourner aux leads
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-slate-900">Assignation Lead</h2>
                                    <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-slate-600">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-lg mb-6 text-sm border border-slate-100">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-slate-900 text-lg">{selectedLead.name}</p>
                                            <p className="text-slate-500">{selectedLead.city} ({selectedLead.postal_code})</p>
                                            <div className="mt-1">
                                                <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase">
                                                    {selectedLead.region || "National"}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                                            {selectedLead.tenant_id}
                                        </span>
                                    </div>
                                </div>

                                {/* Notes & Price Editing */}
                                <div className="mb-6 grid grid-cols-1 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                            Notes / Contexte (visible par le partenaire)
                                        </label>
                                        <textarea
                                            value={editNotes}
                                            onChange={(e) => setEditNotes(e.target.value)}
                                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                                            placeholder="Ex: Client pressé, prévoir nacelle..."
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                                Prix de vente (HT)
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    value={editPrice}
                                                    onChange={(e) => setEditPrice(Number(e.target.value))}
                                                    className="w-24 px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-bold"
                                                />
                                                <span className="text-sm font-bold text-slate-500">€</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleUpdateLead}
                                            disabled={isUpdatingLead}
                                            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition shadow-sm disabled:opacity-50"
                                        >
                                            {isUpdatingLead ? "..." : "Enregistrer"}
                                        </button>
                                    </div>
                                </div>

                                {/* History Section */}
                                {isLoadingHistory ? (
                                    <div className="text-center py-4 text-slate-400 italic">Chargement historique...</div>
                                ) : assignmentHistory.length > 0 ? (
                                    <div className="mb-6">
                                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Déjà assigné à :</h3>
                                        <div className="space-y-2">
                                            {assignmentHistory.map((assign: any) => (
                                                <div key={assign.id} className="flex items-center justify-between text-sm bg-slate-50 p-2 rounded border border-slate-100">
                                                    <span className="font-medium text-slate-700">{assign.partners?.name}</span>
                                                    <span className="text-xs text-slate-400">
                                                        {format(new Date(assign.assigned_at), "dd MMM HH:mm", { locale: fr })}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}

                                <div className="mb-6">
                                    <h3 className="text-sm font-bold text-slate-900 mb-3">Sélectionner les Installateurs</h3>
                                    <div className="space-y-2 max-h-60 overflow-y-auto border border-slate-200 rounded-lg p-2">
                                        {partners.length === 0 ? (
                                            <p className="text-xs text-red-500 italic p-2">Aucun partenaire enregistré.</p>
                                        ) : partners.map(p => {
                                            const isAlreadyAssigned = assignmentHistory.some((h: any) => h.partner_id === p.id);
                                            return (
                                                <label key={p.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${selectedPartnerIds.includes(p.id)
                                                    ? "bg-blue-50 border-blue-200"
                                                    : "hover:bg-slate-50 border-transparent hover:border-slate-100"
                                                    } ${isAlreadyAssigned ? "opacity-50 cursor-not-allowed bg-slate-50" : ""}`}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedPartnerIds.includes(p.id)}
                                                        onChange={() => !isAlreadyAssigned && togglePartner(p.id)}
                                                        disabled={isAlreadyAssigned}
                                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="text-sm font-medium text-slate-900">{p.name}</div>
                                                        <div className="text-xs text-slate-500">{p.email}</div>
                                                    </div>
                                                    {isAlreadyAssigned && <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-600">Déjà envoyé</span>}
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-slate-100">
                                    <button onClick={() => setSelectedLead(null)} className="flex-1 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 font-medium text-slate-600 transition">
                                        Annuler
                                    </button>
                                    <button
                                        onClick={handleAssignment}
                                        disabled={selectedPartnerIds.length === 0 || isSubmitting}
                                        className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 font-bold disabled:opacity-50 shadow-lg shadow-slate-900/10 transition flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <span className="animate-spin">⏳</span>
                                        ) : (
                                            <>
                                                <span>Envoyer ({selectedPartnerIds.length})</span>
                                                <Mail size={16} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

