"use client";

import { useState } from "react";
import {
    Building2,
    Briefcase,
    Users,
    UserCheck,
    Shield,
    Zap,
    ArrowRight,
    ArrowLeft,
    CheckCircle,
    Phone,
    Mail,
    User2,
    FileCheck,
    BarChart3,
    Crown,
    AlertTriangle
} from "lucide-react";
import Link from "next/link";

declare global {
    interface Window {
        dataLayer: Record<string, unknown>[];
    }
}

// ========================================
// B2B LEAD FORM — HIGH TICKET TUNNEL
// Séparé du LeadForm B2C pour ne pas polluer
// les taux de conversion existants.
// ========================================

interface LeadFormProProps {
    city: string;
    domain: string;
    segment: 'COPRO' | 'ENTREPRISE';
    themeColor?: 'purple' | 'emerald';
}

interface ProFormData {
    // Step 1: Role / Decision maker
    role: 'syndic' | 'conseil_syndical' | 'copro_resident' | 'dirigeant' | 'rse_rh' | 'facility_manager' | 'salarie' | null;
    // Step 2: Size (impact = scoring)
    parkingSize: 'moins10' | '10a50' | 'plus50' | 'plus100' | null;
    // Step 3: Timeline
    timeline: 'urgent' | 'trimestre' | 'annee' | 'exploration' | null;
    // Step 4: Contact
    name: string;
    email: string;
    phone: string;
    company: string; // Nom copro ou entreprise
    zipCode: string;
}

const FRENCH_PHONE_REGEX = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
const ZIP_CODE_REGEX = /^\d{5}$/;

export default function LeadFormPro({
    city,
    domain,
    segment,
    themeColor
}: LeadFormProProps) {
    const resolvedColor = themeColor || (segment === 'COPRO' ? 'purple' : 'emerald');

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<ProFormData>({
        role: null,
        parkingSize: null,
        timeline: null,
        name: "",
        email: "",
        phone: "",
        company: "",
        zipCode: ""
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState("");

    // ========================================
    // THEME
    // ========================================
    const themes = {
        purple: {
            header: "from-purple-700 to-purple-900",
            button: "from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-purple-500/30",
            light: "bg-purple-50",
            border: "border-purple-200",
            text: "text-purple-600",
            ring: "focus:border-purple-500 focus:ring-purple-500/20",
            accent: "purple"
        },
        emerald: {
            header: "from-emerald-700 to-emerald-900",
            button: "from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-emerald-500/30",
            light: "bg-emerald-50",
            border: "border-emerald-200",
            text: "text-emerald-600",
            ring: "focus:border-emerald-500 focus:ring-emerald-500/20",
            accent: "emerald"
        }
    };
    const palette = themes[resolvedColor];

    const totalSteps = 4;
    const progress = (step / totalSteps) * 100;

    // ========================================
    // B2B LEAD SCORING — High Ticket Logic
    // ========================================
    const getLeadScore = (): number => {
        let score = 0;

        // Segment base
        if (segment === 'ENTREPRISE') score += 30;
        if (segment === 'COPRO') score += 25;

        // Role = The most important signal
        switch (formData.role) {
            case 'syndic': score += 40; break;           // JACKPOT: Direct decision maker
            case 'dirigeant': score += 45; break;        // JACKPOT: CEO/DG
            case 'facility_manager': score += 35; break; // Budget holder
            case 'rse_rh': score += 25; break;           // Influencer
            case 'conseil_syndical': score += 30; break;  // Strong influencer in copro
            case 'copro_resident': score += 15; break;    // Needs to convince syndic
            case 'salarie': score += 5; break;            // POUBELLE — almost worthless
        }

        // Size = Revenue potential
        switch (formData.parkingSize) {
            case 'plus100': score += 50; break;  // MEGA DEAL
            case 'plus50': score += 40; break;   // BIG DEAL
            case '10a50': score += 25; break;    // SOLID
            case 'moins10': score += 10; break;  // Small
        }

        // Timeline = Urgency
        switch (formData.timeline) {
            case 'urgent': score += 30; break;     // HOT LEAD
            case 'trimestre': score += 20; break;  // WARM
            case 'annee': score += 10; break;      // COLD but valid
            case 'exploration': score += 5; break; // Tire-kicker
        }

        return score;
    };

    // GTM lead value based on qualification
    const getLeadValue = (): number => {
        const score = getLeadScore();
        if (score >= 120) return 300; // Mega lead (syndic + 50 places + urgent)
        if (score >= 80) return 150;  // Solid B2B
        if (score >= 50) return 75;   // Decent B2B
        return 30;                     // Low-quality B2B (salarié, exploration...)
    };

    const handleOptionSelect = (field: keyof ProFormData, value: string) => {
        if (step === 1) {
            if (typeof window !== 'undefined' && window.dataLayer) {
                window.dataLayer.push({
                    event: 'form_start',
                    lead_category: segment,
                    lead_segment: 'B2B',
                    lead_role: value
                });
            }
        }
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (status === 'error') {
            setStatus('idle');
            setErrorMessage("");
        }
    };

    const canProceed = (): boolean => {
        switch (step) {
            case 1: return formData.role !== null;
            case 2: return formData.parkingSize !== null;
            case 3: return formData.timeline !== null;
            case 4:
                return (
                    formData.name.trim() !== "" &&
                    formData.email.includes("@") &&
                    ZIP_CODE_REGEX.test(formData.zipCode.trim()) &&
                    formData.phone.trim() !== "" &&
                    FRENCH_PHONE_REGEX.test(formData.phone.replace(/\s/g, ''))
                );
            default: return false;
        }
    };

    const nextStep = () => {
        if (canProceed() && step < totalSteps) setStep(step + 1);
    };
    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    // ========================================
    // SUBMIT — B2B QUALIFIED LEAD
    // ========================================
    const handleSubmit = async () => {
        if (!canProceed()) {
            setStatus('error');
            const errors = [];
            if (formData.name.trim() === "") errors.push("votre Nom");
            if (!ZIP_CODE_REGEX.test(formData.zipCode.trim())) errors.push("un Code Postal valide");
            if (!formData.email.includes("@")) errors.push("un Email valide");
            if (!FRENCH_PHONE_REGEX.test(formData.phone.replace(/\s/g, ''))) errors.push("un Téléphone valide");
            setErrorMessage(`Veuillez renseigner : ${errors.join(', ')}.`);
            return;
        }

        setStatus('loading');

        try {
            // Retrieve traffic attribution data from storage/cookie
            let attribution = {};
            if (typeof window !== 'undefined') {
                const stored = sessionStorage.getItem('lead_attribution');
                if (stored) {
                    try {
                        attribution = JSON.parse(stored);
                    } catch (e) {
                        console.error("Error parsing attribution from sessionStorage", e);
                    }
                } else {
                    const cookieMatch = document.cookie.match(/lead_attribution=([^;]+)/);
                    if (cookieMatch) {
                        try {
                            attribution = JSON.parse(decodeURIComponent(cookieMatch[1]));
                        } catch (e) {
                            console.error("Error parsing attribution from cookie", e);
                        }
                    }
                }
            }

            const leadScore = getLeadScore();
            const leadValue = getLeadValue();

            const payload = {
                // Standard fields (compatible with existing API)
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                city,
                postalCode: formData.zipCode,
                domain,
                projectType: segment === 'COPRO' ? 'copro' : 'entreprise',
                // B2B specific
                ownerStatus: 'professionnel',
                vehicleStatus: 'flotte',
                meterDistance: 'nesaispas',
                solarInterest: false,
                // B2B qualification (stored in metadata via API)
                leadScore,
                leadValue,
                role: formData.role,
                parkingSize: formData.parkingSize,
                timeline: formData.timeline,
                company: formData.company,
                leadSegment: 'B2B',
                timestamp: new Date().toISOString(),
                attribution // Include attribution data here
            };

            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Erreur lors de l\'envoi');
            }

            // GTM: High Ticket Conversion (enriched with attribution fields)
            if (typeof window !== 'undefined' && window.dataLayer) {
                window.dataLayer.push({
                    event: 'generate_lead',
                    lead_category: segment === 'COPRO' ? 'copro' : 'entreprise',
                    lead_segment: 'B2B',
                    lead_role: formData.role,
                    lead_size: formData.parkingSize,
                    lead_timeline: formData.timeline,
                    lead_city: city,
                    lead_score: leadScore,
                    value: leadValue,
                    currency: 'EUR',
                    traffic_source: (attribution as any).source || 'direct',
                    traffic_medium: (attribution as any).medium || 'direct',
                    traffic_campaign: (attribution as any).campaign || '',
                    traffic_term: (attribution as any).term || '',
                    traffic_content: (attribution as any).content || '',
                    landing_page: (attribution as any).landing_page || window.location.pathname
                });
            }

            setStatus('success');
        } catch (error: unknown) {
            console.error("B2B Submission Error:", error);
            setStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Une erreur est survenue');
        }
    };

    // ========================================
    // SUCCESS STATE — B2B Tone
    // ========================================
    if (status === 'success') {
        return (
            <div className={`bg-gradient-to-br ${palette.light} border ${palette.border} rounded-3xl p-8 text-center`}>
                <div className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg">
                    <CheckCircle className={palette.text} size={40} />
                </div>
                <h3 className={`text-2xl font-bold ${palette.text} mb-3`}>
                    Demande reçue — Un expert vous rappelle sous 24h.
                </h3>
                <p className="text-neutral-700 mb-6">
                    {segment === 'COPRO'
                        ? `Notre spécialiste copropriété reviendra vers vous avec une étude de faisabilité pour votre immeuble à ${city}.`
                        : `Un chef de projet dédié aux flottes professionnelles vous contactera pour auditer votre infrastructure à ${city}.`
                    }
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-neutral-500">
                    <Shield size={16} />
                    <span>Vos données sont protégées et ne seront jamais revendues</span>
                </div>
            </div>
        );
    }

    // ========================================
    // OPTION BUTTON (B2B styled)
    // ========================================
    const OptionButton = ({
        selected,
        onClick,
        icon: Icon,
        label,
        sublabel,
        badge,
        dimmed = false
    }: {
        selected: boolean;
        onClick: () => void;
        icon: React.ElementType;
        label: string;
        sublabel?: string;
        badge?: string;
        dimmed?: boolean;
    }) => (
        <button
            onClick={onClick}
            className={`
                relative w-full p-4 rounded-2xl border-2 transition-all duration-200
                flex items-center gap-4 text-left
                ${selected
                    ? `${palette.border} ${palette.light} shadow-lg`
                    : dimmed
                        ? 'border-neutral-200 bg-neutral-50 opacity-60'
                        : 'border-neutral-200 bg-white hover:bg-neutral-50'
                }
            `}
        >
            <div className={`
                w-11 h-11 rounded-xl flex items-center justify-center shrink-0
                ${selected ? `bg-white ${palette.text}` : 'bg-neutral-100 text-neutral-500'}
            `}>
                <Icon size={22} />
            </div>
            <div className="flex-1 min-w-0">
                <div className={`font-bold text-sm ${selected ? 'text-neutral-900' : 'text-neutral-800'}`}>
                    {label}
                </div>
                {sublabel && (
                    <div className="text-xs text-neutral-500 mt-0.5">{sublabel}</div>
                )}
            </div>
            {selected && (
                <div className="absolute top-3 right-3">
                    <CheckCircle className={palette.text} size={18} />
                </div>
            )}
            {badge && !selected && (
                <div className={`absolute -top-2 -right-2 ${palette.text === 'text-purple-600' ? 'bg-purple-600' : 'bg-emerald-600'} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>
                    {badge}
                </div>
            )}
        </button>
    );

    // ========================================
    // ROLE OPTIONS (context-aware)
    // ========================================
    type RoleOption = { value: 'syndic' | 'conseil_syndical' | 'copro_resident' | 'dirigeant' | 'facility_manager' | 'rse_rh' | 'salarie'; icon: React.ElementType; label: string; sublabel: string; badge?: string; dimmed?: boolean };
    const roleOptions: RoleOption[] = segment === 'COPRO' ? [
        { value: 'syndic', icon: Crown, label: 'Syndic de copropriété', sublabel: 'Professionnel ou bénévole', badge: 'Prioritaire' },
        { value: 'conseil_syndical', icon: Users, label: 'Membre du Conseil Syndical', sublabel: 'Vous portez le sujet à l\'AG' },
        { value: 'copro_resident', icon: UserCheck, label: 'Résident / Copropriétaire', sublabel: 'Vous souhaitez proposer le projet' },
    ] : [
        { value: 'dirigeant', icon: Crown, label: 'Dirigeant / DG', sublabel: 'Décisionnaire budget', badge: 'Prioritaire' },
        { value: 'facility_manager', icon: Building2, label: 'Facility Manager / Services Généraux', sublabel: 'Gestion des bâtiments' },
        { value: 'rse_rh', icon: BarChart3, label: 'RSE / RH', sublabel: 'Politique mobilité durable' },
        { value: 'salarie', icon: UserCheck, label: 'Salarié', sublabel: 'Vous souhaitez proposer à votre direction', dimmed: true },
    ];

    type SizeOption = { value: 'moins10' | '10a50' | 'plus50' | 'plus100'; icon: React.ElementType; label: string; sublabel: string; badge?: string };
    const sizeOptions: SizeOption[] = segment === 'COPRO' ? [
        { value: 'moins10', icon: Building2, label: 'Moins de 10 places', sublabel: 'Petit immeuble' },
        { value: '10a50', icon: Building2, label: '10 à 50 places', sublabel: 'Copropriété moyenne' },
        { value: 'plus50', icon: Building2, label: '50 à 100 places', sublabel: 'Grande résidence', badge: 'Sur-mesure' },
        { value: 'plus100', icon: Building2, label: 'Plus de 100 places', sublabel: 'Résidence ou campus', badge: 'Populaire' },
    ] : [
        { value: 'moins10', icon: Briefcase, label: 'Moins de 10 véhicules', sublabel: 'PME / Start-up' },
        { value: '10a50', icon: Briefcase, label: '10 à 50 véhicules', sublabel: 'ETI / Multi-sites' },
        { value: 'plus50', icon: Briefcase, label: '50 à 100 véhicules', sublabel: 'Grande flotte', badge: 'Sur-mesure' },
        { value: 'plus100', icon: Briefcase, label: 'Plus de 100 véhicules', sublabel: 'Grand groupe / Logistique', badge: 'Expertise' },
    ];

    return (
        <div className="bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden">
            {/* Header — B2B Tone */}
            <div className={`bg-gradient-to-r ${palette.header} p-6 text-white`}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        {segment === 'COPRO' ? <Building2 size={24} /> : <Briefcase size={24} />}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">
                            {segment === 'COPRO'
                                ? 'Étude de Faisabilité Copropriété'
                                : 'Audit Infrastructure Entreprise'
                            }
                        </h3>
                        <p className="text-white/80 text-sm">Gratuit • Sans engagement • Réponse sous 24h</p>
                    </div>
                </div>

                {/* Progress */}
                <div className="relative">
                    <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white transition-all duration-500 ease-out rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-white/80">
                        <span>Étape {step}/{totalSteps}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                </div>
            </div>

            {/* Form Body */}
            <div className="p-6">
                {/* Step 1: Role */}
                {step === 1 && (
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold text-neutral-900 mb-1">
                            {segment === 'COPRO'
                                ? 'Quel est votre rôle dans la copropriété ?'
                                : 'Quelle est votre fonction dans l\'entreprise ?'
                            }
                        </h4>
                        <p className="text-sm text-neutral-500 mb-4">
                            Cela nous permet de vous orienter vers le bon interlocuteur.
                        </p>
                        <div className="space-y-3">
                            {roleOptions.map(opt => (
                                <OptionButton
                                    key={opt.value}
                                    selected={formData.role === opt.value}
                                    onClick={() => handleOptionSelect('role', opt.value)}
                                    icon={opt.icon}
                                    label={opt.label}
                                    sublabel={opt.sublabel}
                                    badge={opt.badge}
                                    dimmed={opt.dimmed}
                                />
                            ))}
                        </div>

                        {formData.role === 'salarie' && (
                            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                                <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                                <div>
                                    <p className="text-sm font-medium text-amber-800">
                                        Votre demande sera transmise, mais nous privilégions le contact direct avec les décisionnaires.
                                    </p>
                                    <p className="text-xs text-amber-600 mt-1">
                                        Nous vous recommandons de transmettre ce formulaire à votre direction ou service RSE.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 2: Size */}
                {step === 2 && (
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold text-neutral-900 mb-1">
                            {segment === 'COPRO'
                                ? 'Combien de places de parking dans votre copropriété ?'
                                : 'Quelle est la taille de votre flotte / parking ?'
                            }
                        </h4>
                        <p className="text-sm text-neutral-500 mb-4">
                            {segment === 'COPRO'
                                ? 'Le nombre de places détermine la solution technique et les aides ADVENIR disponibles.'
                                : 'Cela nous permet de dimensionner l\'infrastructure et les aides disponibles.'
                            }
                        </p>
                        <div className="space-y-3">
                            {sizeOptions.map(opt => (
                                <OptionButton
                                    key={opt.value}
                                    selected={formData.parkingSize === opt.value}
                                    onClick={() => handleOptionSelect('parkingSize', opt.value)}
                                    icon={opt.icon}
                                    label={opt.label}
                                    sublabel={opt.sublabel}
                                    badge={opt.badge}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Timeline */}
                {step === 3 && (
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold text-neutral-900 mb-1">
                            Quel est votre calendrier ?
                        </h4>
                        <p className="text-sm text-neutral-500 mb-4">
                            {segment === 'COPRO'
                                ? 'Y a-t-il une AG prévue prochainement ?'
                                : 'Quand souhaitez-vous lancer le déploiement ?'
                            }
                        </p>
                        <div className="space-y-3">
                            <OptionButton
                                selected={formData.timeline === 'urgent'}
                                onClick={() => handleOptionSelect('timeline', 'urgent')}
                                icon={Zap}
                                label={segment === 'COPRO' ? 'AG dans les 3 prochains mois' : 'Déploiement sous 3 mois'}
                                sublabel="Besoin d'un dossier technique rapidement"
                                badge="Urgent"
                            />
                            <OptionButton
                                selected={formData.timeline === 'trimestre'}
                                onClick={() => handleOptionSelect('timeline', 'trimestre')}
                                icon={FileCheck}
                                label={segment === 'COPRO' ? 'AG prévue dans 3 à 6 mois' : 'Projet dans 3 à 6 mois'}
                                sublabel="Nous préparons le dossier en amont"
                            />
                            <OptionButton
                                selected={formData.timeline === 'annee'}
                                onClick={() => handleOptionSelect('timeline', 'annee')}
                                icon={FileCheck}
                                label="D'ici 1 an"
                                sublabel="Première prise de renseignements"
                            />
                            <OptionButton
                                selected={formData.timeline === 'exploration'}
                                onClick={() => handleOptionSelect('timeline', 'exploration')}
                                icon={BarChart3}
                                label="Simple exploration"
                                sublabel="Étude comparative sans engagement"
                            />
                        </div>
                    </div>
                )}

                {/* Step 4: Contact (B2B) */}
                {step === 4 && (
                    <div className="space-y-5">
                        <h4 className="text-lg font-bold text-neutral-900 mb-1">
                            Vos coordonnées professionnelles
                        </h4>
                        <p className="text-sm text-neutral-500 mb-4">
                            Un expert dédié aux {segment === 'COPRO' ? 'copropriétés' : 'entreprises'} vous recontacte sous 24h.
                        </p>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                                        <User2 size={16} />
                                        Nom complet *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Jean Dupont"
                                        className={`w-full px-4 py-3 rounded-xl border border-neutral-300 ${palette.ring} transition outline-none`}
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                                        <Building2 size={16} />
                                        {segment === 'COPRO' ? 'Nom de la copropriété' : 'Entreprise'}
                                    </label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleInputChange}
                                        placeholder={segment === 'COPRO' ? 'Résidence Les Acacias' : 'ACME SAS'}
                                        className={`w-full px-4 py-3 rounded-xl border border-neutral-300 ${palette.ring} transition outline-none`}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-neutral-700 mb-2 block">
                                        Code Postal *
                                    </label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleInputChange}
                                        placeholder="75000"
                                        maxLength={5}
                                        className={`w-full px-4 py-3 rounded-xl border border-neutral-300 ${palette.ring} transition outline-none`}
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                                        <Mail size={16} />
                                        Email professionnel *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="j.dupont@entreprise.com"
                                        className={`w-full px-4 py-3 rounded-xl border border-neutral-300 ${palette.ring} transition outline-none`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                                    <Phone size={16} />
                                    Téléphone *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="06 12 34 56 78"
                                    className={`w-full px-4 py-3 rounded-xl border border-neutral-300 ${palette.ring} transition outline-none`}
                                />
                                {formData.phone && !FRENCH_PHONE_REGEX.test(formData.phone.replace(/\s/g, '')) && (
                                    <p className="text-xs text-red-500 mt-1">Format invalide. Ex: 06 12 34 56 78</p>
                                )}
                            </div>
                        </div>

                        {status === 'error' && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                                {errorMessage}
                            </div>
                        )}
                    </div>
                )}

                {/* Navigation */}
                <div className="flex gap-3 mt-8 items-start">
                    {step > 1 && (
                        <button
                            onClick={prevStep}
                            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-50 transition"
                        >
                            <ArrowLeft size={18} />
                            Retour
                        </button>
                    )}

                    {step < totalSteps ? (
                        <button
                            onClick={nextStep}
                            disabled={!canProceed()}
                            className={`
                                flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-lg transition
                                ${canProceed()
                                    ? `bg-gradient-to-r ${palette.button} text-white shadow-lg`
                                    : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                                }
                            `}
                        >
                            Continuer
                            <ArrowRight size={20} />
                        </button>
                    ) : (
                        <div className="w-full">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={status === 'loading'}
                                className={`
                                    w-full py-4 px-6 rounded-xl text-lg font-bold text-white shadow-xl transition-all
                                    ${status === 'loading'
                                        ? 'bg-slate-400 cursor-not-allowed'
                                        : `bg-gradient-to-r ${palette.button} transform hover:-translate-y-1`
                                    }
                                `}
                            >
                                {status === 'loading' ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Envoi en cours...
                                    </span>
                                ) : (
                                    segment === 'COPRO'
                                        ? "Demander l'étude de faisabilité gratuite"
                                        : "Demander l'audit d'infrastructure gratuit"
                                )}
                            </button>

                            <p className="text-xs text-slate-400 text-center mt-4 px-4 leading-relaxed">
                                En cliquant, vous acceptez nos <Link href="/cgv" className="underline hover:text-blue-600">CGV</Link> et d&apos;être recontacté par nos experts certifiés IRVE pour votre projet{segment === 'COPRO' ? ' en copropriété' : ' professionnel'}.
                            </p>
                        </div>
                    )}
                </div>

                {/* Trust footer — B2B */}
                <div className="flex flex-wrap justify-center gap-4 mt-6 pt-6 border-t border-neutral-100 text-[10px] sm:text-xs text-slate-400 font-medium uppercase tracking-wide">
                    <span className="flex items-center gap-1.5"><Shield size={12} className="text-green-500" /> Données sécurisées</span>
                    <span className="flex items-center gap-1.5"><Zap size={12} className="text-amber-500" /> Certifié IRVE</span>
                    <span className="flex items-center gap-1.5"><CheckCircle size={12} className="text-blue-500" /> Sans engagement</span>
                </div>
            </div>
        </div>
    );
}
