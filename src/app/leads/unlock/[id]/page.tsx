"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Lock, Mail, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, MapPin, Building, Home, Zap, Phone, ExternalLink } from "lucide-react";
import { verifyPartnerEmail } from "@/app/actions/leads";
import Logo from "@/components/Logo";
import Link from "next/link";


export default function LeadUnlockPage() {
    const { id } = useParams();
    const searchParams = useSearchParams();
    const isSuccess = searchParams.get("success") === "true";
    const partnerIdParam = searchParams.get("partnerId");

    const [lead, setLead] = useState<any>(null);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [email, setEmail] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [partner, setPartner] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 1. Initial Fetch
    useEffect(() => {
        async function fetchLead() {
            try {
                // If we have a partnerId in URL (return from Stripe), use it to fetch full details
                const pId = partnerIdParam || partner?.id;
                const url = pId ? `/api/leads/public?id=${id}&partnerId=${pId}` : `/api/leads/public?id=${id}`;
                
                const response = await fetch(url);
                const data = await response.json();
                
                if (data.error) throw new Error(data.error);
                
                setLead(data.lead);
                setIsUnlocked(data.isUnlocked || false);
                
                // If it was a success return, we might want to auto-set the partner if we had the ID
                if (data.isUnlocked && !partner && pId) {
                    setPartner({ id: pId }); // Minimal partner object
                }
            } catch (err) {
                setError("Ce lead n'est plus disponible ou le lien est invalide.");
            } finally {
                setIsLoading(false);
            }
        }
        fetchLead();
    }, [id, partnerIdParam, partner?.id]);

    const handleVerifyEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsVerifying(true);
        setError(null);
        try {
            const partnerData = await verifyPartnerEmail(email);
            if (partnerData) {
                setPartner(partnerData);
            } else {
                setError("Désolé, seul un partenaire enregistré peut débloquer ce lead.");
            }
        } catch (err) {
            setError("Une erreur est survenue lors de la vérification.");
        } finally {
            setIsVerifying(false);
        }
    };

    const handlePayment = async () => {
        if (!partner || !lead) return;
        
        try {
            const response = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    leadId: lead.id,
                    partnerId: partner.id,
                    partnerEmail: partner.email
                })
            });
            const { url } = await response.json();
            if (url) window.location.href = url;
        } catch (err) {
            setError("Erreur lors de la création de la session de paiement.");
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <Logo isHub size="md" />
                <p className="text-slate-400 font-medium">Chargement de l'opportunité...</p>
            </div>
        </div>
    );

    if (error && !lead) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-slate-100">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-slate-900 mb-2 font-display">Oups !</h1>
                <p className="text-slate-500 mb-8">{error}</p>
                <Link href="/" className="inline-block px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition shadow-lg">Retour à l'accueil</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900">
            {/* Professional Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50 py-4">
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
                    <Logo isHub size="md" />
                    <div className="hidden md:flex items-center gap-4 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                        <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Espace Partenaires Certifiés</span>
                    </div>
                </div>
            </header>

            <main className="py-12 px-4">
                <div className="max-w-3xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        {isUnlocked ? (
                            <div className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 shadow-lg shadow-emerald-500/20">
                                <CheckCircle2 size={14} />
                                Lead Débloqué
                            </div>
                        ) : (
                            <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 shadow-lg shadow-blue-500/20">
                                <Lock size={14} />
                                Lead Exclusif
                            </div>
                        )}
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                            Installation ({lead.postal_code})
                        </h1>
                        <p className="text-lg text-slate-500 font-medium">
                            {isUnlocked ? "Félicitations ! Vous avez maintenant accès aux coordonnées du client." : "Une nouvelle demande qualifiée vient d'arriver dans votre secteur."}
                        </p>
                    </div>

                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-12">
                        {/* Status Bar */}
                        <div className={`px-8 py-4 flex items-center justify-between ${isUnlocked ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white'}`}>
                            <div className="flex items-center gap-2 text-sm font-bold">
                                {isUnlocked ? <CheckCircle2 size={18} /> : <Zap className="text-yellow-400" size={18} fill="currentColor" />}
                                <span>{isUnlocked ? "Paiement confirmé" : "Opportunité en temps réel"}</span>
                            </div>
                            <div className="text-xs opacity-70 font-medium">Réf: {lead.id.split('-')[0].toUpperCase()}</div>
                        </div>

                        {/* Content Area */}
                        {isUnlocked ? (
                            <div className="p-10 space-y-10 animate-in fade-in zoom-in-95 duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                            <Mail size={14} />
                                            Email Client
                                        </h3>
                                        <p className="text-xl font-black text-slate-900 mb-2 truncate">{lead.email}</p>
                                        <a href={`mailto:${lead.email}`} className="text-sm text-blue-600 font-bold hover:underline flex items-center gap-1">
                                            Lui écrire <ExternalLink size={14} />
                                        </a>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                            <Phone size={14} />
                                            Téléphone
                                        </h3>
                                        <p className="text-xl font-black text-slate-900 mb-2">{lead.phone}</p>
                                        <a href={`tel:${lead.phone}`} className="text-sm text-blue-600 font-bold hover:underline flex items-center gap-1">
                                            Appeler maintenant <ExternalLink size={14} />
                                        </a>
                                    </div>
                                </div>

                                <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl">
                                    <h3 className="text-emerald-800 font-black mb-2">Conseil Expert</h3>
                                    <p className="text-emerald-700 leading-relaxed font-medium">
                                        Ce prospect attend votre appel. Nous vous conseillons de le contacter dans les 2 heures pour maximiser vos chances de signer ce projet. Un email récapitulatif vous a également été envoyé.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Blurred Preview */}
                                <div className="p-10 border-b border-slate-100 relative overflow-hidden bg-slate-50">
                                    <div className="flex flex-col gap-6 filter blur-md select-none pointer-events-none opacity-40">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-300 rounded-2xl" />
                                            <div className="space-y-2">
                                                <div className="h-6 w-48 bg-slate-300 rounded" />
                                                <div className="h-4 w-32 bg-slate-300 rounded" />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="h-4 w-full bg-slate-200 rounded" />
                                            <div className="h-4 w-5/6 bg-slate-200 rounded" />
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-white/80 backdrop-blur-xl px-8 py-4 rounded-3xl border border-white/50 shadow-2xl flex flex-col items-center gap-2 text-center">
                                            <ShieldCheck className="text-blue-600" size={32} />
                                            <div className="space-y-1">
                                                <span className="text-slate-900 font-black block text-lg">Coordonnées masquées</span>
                                                <span className="text-slate-500 text-sm font-medium italic">Débloquez ce lead pour contacter le client</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Project Context */}
                                <div className="p-10 space-y-10">
                                    <div>
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Informations de base</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                                                    <MapPin size={24} />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-500 font-bold mb-1">Zone géographique</p>
                                                    <p className="text-xl font-black text-slate-900 leading-tight">{lead.city} ({lead.postal_code || 'N/A'})</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                                                    {lead.housing_type === 'copro' ? <Building size={24} /> : <Home size={24} />}
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-500 font-bold mb-1">Type d'installation</p>
                                                    <p className="text-xl font-black text-slate-900 leading-tight capitalize">{lead.housing_type === 'copro' ? 'Copropriété' : 'Maison individuelle'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {lead.notes && (
                                        <div className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                                                <Zap size={120} fill="currentColor" />
                                            </div>
                                            <div className="relative z-10">
                                                <h3 className="text-xs font-black text-blue-100 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                                    <ShieldCheck size={16} />
                                                    Note de l'Expert Admin
                                                </h3>
                                                <p className="text-xl font-medium leading-relaxed italic">
                                                    "{lead.notes}"
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-10 border-t border-slate-100 text-center">
                                        {!partner ? (
                                            <form onSubmit={handleVerifyEmail} className="max-w-md mx-auto">
                                                <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Accès réservé aux installateurs</h3>
                                                <div className="flex flex-col gap-4">
                                                    <div className="relative">
                                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                                        <input
                                                            type="email"
                                                            required
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            placeholder="Votre email partenaire..."
                                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none font-medium"
                                                        />
                                                    </div>
                                                    {error && <p className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}
                                                    <button
                                                        type="submit"
                                                        disabled={isVerifying}
                                                        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-slate-800 transition-all transform hover:-translate-y-1 shadow-2xl shadow-slate-900/20 flex items-center justify-center gap-3"
                                                    >
                                                        {isVerifying ? "Vérification..." : <>Continuer l'achat <ArrowRight size={22} /></>}
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
                                                <div className="mb-8 flex flex-col items-center gap-4">
                                                    <div className="bg-emerald-100 text-emerald-600 p-3 rounded-full shadow-inner">
                                                        <CheckCircle2 size={32} />
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-500 font-bold mb-1 uppercase tracking-widest text-[10px]">Identité confirmée</p>
                                                        <p className="text-2xl font-black text-slate-900">{partner.name}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={handlePayment}
                                                    className="w-full max-w-md mx-auto group relative flex items-center justify-center gap-4 bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-3xl font-black text-2xl shadow-[0_20px_50px_rgba(37,99,235,0.3)] transition-all transform hover:-translate-y-2 active:scale-95"
                                                >
                                                    DÉBLOQUER : {lead.price || 20}€ HT
                                                    <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                                                </button>
                                                <p className="text-xs text-slate-400 mt-6 font-medium max-w-xs mx-auto">
                                                    Paiement 100% sécurisé via Stripe. <br />La facture sera envoyée à <span className="text-slate-600">{partner.email}</span>.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <footer className="text-center space-y-6">
                        <p className="text-slate-400 text-xs font-medium px-12 leading-relaxed">
                            Urgence Couverture garantit l'exclusivité de ce lead. En achetant ces coordonnées, vous bénéficiez de l'accès unique à ce projet client.
                        </p>
                        <div className="flex flex-col items-center gap-6">
                            <div className="flex items-center justify-center gap-6">
                                {/* Stripe – official logo */}
                                <svg height="32" viewBox="54 36 360 150" xmlns="http://www.w3.org/2000/svg" aria-label="Stripe">
                                    <path fill="#635BFF" fillRule="evenodd" clipRule="evenodd" d="M414,113.4c0-25.6-12.4-45.8-36.1-45.8c-23.8,0-38.2,20.2-38.2,45.6c0,30.1,17,45.3,41.4,45.3c11.9,0,20.9-2.7,27.7-6.5v-20c-6.8,3.4-14.6,5.5-24.5,5.5c-9.7,0-18.3-3.4-19.4-15.2h48.9C413.8,121,414,115.8,414,113.4z M364.6,103.9c0-11.3,6.9-16,13.2-16c6.1,0,12.6,4.7,12.6,16H364.6z"/>
                                    <path fill="#635BFF" fillRule="evenodd" clipRule="evenodd" d="M301.1,67.6c-9.8,0-16.1,4.6-19.6,7.8l-1.3-6.2h-22v116.6l25-5.3l0.1-28.3c3.6,2.6,8.9,6.3,17.7,6.3c17.9,0,34.2-14.4,34.2-46.1C335.1,83.4,318.6,67.6,301.1,67.6z M295.1,136.5c-5.9,0-9.4-2.1-11.8-4.7l-0.1-37.1c2.6-2.9,6.2-4.9,11.9-4.9c9.1,0,15.4,10.2,15.4,23.3C310.5,126.5,304.3,136.5,295.1,136.5z"/>
                                    <polygon fill="#635BFF" points="223.8,61.7 248.9,56.3 248.9,36 223.8,41.3"/>
                                    <rect fill="#635BFF" x="223.8" y="69.3" width="25.1" height="87.5"/>
                                    <path fill="#635BFF" fillRule="evenodd" clipRule="evenodd" d="M196.9,76.7l-1.6-7.4h-21.6v87.5h25V97.5c5.9-7.7,15.9-6.3,19-5.2v-23C214.5,68.1,202.8,65.9,196.9,76.7z"/>
                                    <path fill="#635BFF" fillRule="evenodd" clipRule="evenodd" d="M146.9,47.6l-24.4,5.2l-0.1,80.1c0,14.8,11.1,25.7,25.9,25.7c8.2,0,14.2-1.5,17.5-3.3V135c-3.2,1.3-19,5.9-19-8.9V90.6h19V69.3h-19L146.9,47.6z"/>
                                    <path fill="#635BFF" fillRule="evenodd" clipRule="evenodd" d="M79.3,94.7c0-3.9,3.2-5.4,8.5-5.4c7.6,0,17.2,2.3,24.8,6.4V72.2c-8.3-3.3-16.5-4.6-24.8-4.6C67.5,67.6,54,78.2,54,95.9c0,27.6,38,23.2,38,35.1c0,4.6-4,6.1-9.6,6.1c-8.3,0-18.9-3.4-27.3-8v23.8c9.3,4,18.7,5.7,27.3,5.7c20.8,0,35.1-10.3,35.1-28.2C117.4,100.6,79.3,105.9,79.3,94.7z"/>
                                </svg>

                                <div className="w-px h-8 bg-slate-300" />

                                {/* Visa – official logo */}
                                <svg height="22" viewBox="30 125 690 220" xmlns="http://www.w3.org/2000/svg" aria-label="Visa">
                                    <path d="M278.2 334.2l33.4-195.8h53.4L331.6 334.2h-53.4zM524.3 142.7c-10.6-4-27.1-8.2-47.8-8.2-52.7 0-89.9 26.6-90.2 64.6-.6 28.1 26.5 43.8 46.8 53.2 20.8 9.5 27.8 15.6 27.8 24.2-.3 13-16.7 19-32 19-21.4 0-32.7-3-50.2-10.3l-6.9-3.1-7.5 43.8c12.5 5.5 35.5 10.2 59.4 10.4 56.1 0 92.5-26.2 92.9-66.9.6-22.3-14-39.3-44.8-53.2-18.6-9.1-30.1-15.1-30.1-24.3.3-8.3 9.7-16.9 30.7-16.9 17.5-.3 30.2 3.5 40 7.5l4.8 2.3 7.3-42.2zM661.6 138.5h-41.2c-12.8 0-22.3 3.5-27.9 16.2l-90.9 179.5h56.1s9.2-24.1 11.2-29.4h68.3c1.6 6.9 6.5 29.3 6.5 29.3h49.6l-31.7-195.8zM596.1 265c4.4-11.3 21.3-54.8 21.3-54.8l7.1-18.7 3.6 16.9s10.2 46.8 12.4 56.7H596.1zM232.9 138.5L180.7 272l-5.6-27.1c-9.7-31.3-40-65.2-73.9-82.1l47.8 171.2h56.5l84.1-195.5h-56.6z" fill="#1A1F71"/>
                                    <path d="M131.9 138.5H45.9l-.7 4.1c66.9 16.2 111.2 55.4 129.6 102.4l-18.7-90c-3.2-12.4-12.6-16.1-24.2-16.5z" fill="#F9A533"/>
                                </svg>

                                {/* Mastercard – official logo (two circles) */}
                                <svg height="32" viewBox="0 0 152.407 108" xmlns="http://www.w3.org/2000/svg" aria-label="Mastercard">
                                    <rect fill="#FF5F00" x="60.4117" y="14.7368" width="31.5" height="63.0263"/>
                                    <path fill="#EB001B" d="M62.4117,46.25C62.4117,33.4,68.5,21.95,78.1617,14.7368C70.2,8.28,60.15,4.5,49.15,4.5C22.95,4.5,1.65,25.2,1.65,46.25C1.65,67.3,22.95,88,49.15,88C60.15,88,70.2,84.22,78.1617,77.7632C68.5,70.55,62.4117,59.1,62.4117,46.25Z"/>
                                    <path fill="#F79E1B" d="M150.75,46.25C150.75,67.3,129.45,88,103.25,88C92.25,88,82.2,84.22,74.2383,77.7632C83.9,70.55,89.9883,59.1,89.9883,46.25C89.9883,33.4,83.9,21.95,74.2383,14.7368C82.2,8.28,92.25,4.5,103.25,4.5C129.45,4.5,150.75,25.2,150.75,46.25Z"/>
                                </svg>
                            </div>
                            <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 rounded-full border border-emerald-100 text-[11px] font-black text-emerald-700 uppercase tracking-[0.15em] shadow-sm shadow-emerald-500/5">
                                <ShieldCheck size={14} className="text-emerald-500" />
                                Paiement 100% Sécurisé
                            </div>
                        </div>
                    </footer>
                </div>
            </main>
        </div>
    );
}

