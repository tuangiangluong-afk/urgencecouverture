"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Home,
    User,
    Clock,
    Shield,
    Phone,
    Mail,
    User2,
    Calendar,
    ArrowRight,
    ArrowLeft,
    CheckCircle,
    AlertTriangle,
    Ruler,
    Hammer,
    Wrench,
    Flame,
    Droplet
} from "lucide-react";
import Link from "next/link";

declare global {
    interface Window {
        dataLayer: Record<string, unknown>[];
    }
}

interface LeadFormProps {
    city: string;
    domain: string;
    targetType?: 'ROOF' | 'URGENCY' | 'MIXED';
    themeColor?: 'orange' | 'amber' | 'slate';
    initialProjectType?: 'refection_totale' | 'reparation_fuite' | 'demoussage_nettoyage' | 'zinguerie_velux';
}

interface FormData {
    projectType: 'refection_totale' | 'reparation_fuite' | 'demoussage_nettoyage' | 'zinguerie_velux' | null;
    roofSurface: 'moins_50' | '50_100' | 'plus_100' | null;
    ownerStatus: 'proprietaire' | 'locataire' | 'autre' | null;
    timeline: 'urgent' | '3_mois' | '6_mois' | null;
    name: string;
    email: string;
    phone: string;
    zipCode: string;
    phoneConsent?: boolean;
}

const FRENCH_PHONE_REGEX = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
const ZIP_CODE_REGEX = /^\d{5}$/;

export default function LeadForm({
    city,
    domain,
    targetType = 'MIXED',
    themeColor = 'orange',
    initialProjectType
}: LeadFormProps) {
    const router = useRouter();
    const INITIAL_FORM_DATA: FormData = {
        projectType: initialProjectType || null,
        roofSurface: null,
        ownerStatus: null,
        timeline: null,
        name: "",
        email: "",
        phone: "",
        zipCode: "",
        phoneConsent: false
    };

    const [step, setStep] = useState(initialProjectType ? 2 : 1);
    const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState("");

    const totalSteps = 5;
    const progress = (step / totalSteps) * 100;

    const getLeadScore = (): number => {
        let score = 0;
        if (formData.projectType === 'refection_totale') score += 35;
        if (formData.projectType === 'reparation_fuite') score += 20;
        if (formData.projectType === 'zinguerie_velux') score += 15;
        if (formData.projectType === 'demoussage_nettoyage') score += 10;
        if (formData.roofSurface === 'plus_100') score += 30;
        if (formData.roofSurface === '50_100') score += 15;
        if (formData.roofSurface === 'moins_50') score += 5;
        if (formData.ownerStatus === 'proprietaire') score += 20;
        if (formData.timeline === 'urgent') score += 25;
        if (formData.timeline === '3_mois') score += 10;
        return score;
    };

    const handleOptionSelect = (field: keyof FormData, value: string) => {
        if (step === 1 && field === 'projectType') {
            if (typeof window !== 'undefined' && window.dataLayer) {
                window.dataLayer.push({
                    event: 'form_start',
                    lead_category: value
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
            case 1: return formData.projectType !== null;
            case 2: return formData.roofSurface !== null;
            case 3: return formData.ownerStatus !== null;
            case 4: return formData.timeline !== null;
            case 5:
                return (
                    formData.name.trim() !== "" &&
                    formData.email.includes("@") &&
                    ZIP_CODE_REGEX.test(formData.zipCode.trim()) &&
                    formData.phone.trim() !== "" &&
                    FRENCH_PHONE_REGEX.test(formData.phone.replace(/\s/g, '') && formData.phoneConsent === true)
                );
            default: return false;
        }
    };

    const nextStep = () => {
        if (canProceed() && step < totalSteps) {
            setStep(step + 1);
        }
    };

    const prevStep = () => {
        if (step > 1) {
            if (step === 2 && initialProjectType) return;
            setStep(step - 1);
        }
    };

    const handleSubmit = async () => {
        if (!canProceed()) {
            setStatus('error');
            const errors = [];
            if (formData.name.trim() === "") errors.push("votre Nom");
            if (!ZIP_CODE_REGEX.test(formData.zipCode.trim())) errors.push("un Code Postal valide");
            if (!formData.email.includes("@")) errors.push("un Email valide");
            if (formData.phone.trim() === "" || !FRENCH_PHONE_REGEX.test(formData.phone.replace(/\s/g, '') && formData.phoneConsent === true)) errors.push("un Numéro de téléphone valide");
            
            setErrorMessage(`Veuillez renseigner : ${errors.join(', ')}.`);
            return;
        }

        setStatus('loading');

        try {
            let attribution = {};
            if (typeof window !== 'undefined') {
                const stored = sessionStorage.getItem('lead_attribution');
                if (stored) {
                    try { attribution = JSON.parse(stored); } catch (e) {}
                }
            }

            const payload = {
                ...formData,
                city,
                postalCode: formData.zipCode,
                domain,
                leadScore: getLeadScore(),
                niche: 'toiture',
                timestamp: new Date().toISOString(),
                phoneConsent: formData.phoneConsent,
                consentText: "J'accepte d'être contacté(e) par téléphone par ViteUnDevis.com et ses partenaires certifiés pour la qualification de ma demande de devis et la réalisation d'une étude technique.",
                consentDate: new Date().toISOString(),
                consentUrl: typeof window !== 'undefined' ? window.location.href : `https://${domain}`,
                attribution
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

            const data = await res.json();

            if (typeof window !== 'undefined' && window.dataLayer) {
                window.dataLayer.push({
                    event: 'generate_lead',
                    lead_category: formData.projectType,
                    lead_city: city,
                    value: 80.00,
                    currency: 'EUR',
                    traffic_source: (attribution as any).source || 'direct',
                    landing_page: window.location.pathname
                });
            }

            if (data?.vud && data.vud.devis_id) {
                router.push(`/${domain}/success?devis_id=${data.vud.devis_id}&devis_hash=${data.vud.devis_hash || ''}`);
                return;
            }

            setStatus('success');
        } catch (error: any) {
            setStatus('error');
            setErrorMessage(error.message || 'Une erreur est survenue');
        }
    };

    if (status === 'success') {
        return (
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-3xl p-8 text-center">
                <div className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-md">
                    <CheckCircle className="text-orange-600" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-orange-800 mb-3">
                    Demande transmise avec succès !
                </h3>
                <p className="text-neutral-700 mb-6">
                    {formData.projectType === 'reparation_fuite' || formData.timeline === 'urgent'
                        ? "⚠️ **Alerte Infiltration active** : Un artisan couvreur qualifié vous contactera dans un délai maximum de **2 heures** pour sécuriser votre toiture."
                        : "Un artisan couvreur certifié RGE de votre région vous contactera sous **24 heures** pour étudier votre projet de toiture à **" + city + "**."
                    }
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-orange-700 font-medium">
                    <Shield size={16} />
                    <span>Devis gratuits et sans engagement</span>
                </div>
            </div>
        );
    }

    const OptionButton = ({
        selected,
        onClick,
        icon: Icon,
        label,
        sublabel,
        highlight = false
    }: {
        selected: boolean;
        onClick: () => void;
        icon: React.ElementType;
        label: string;
        sublabel?: string;
        highlight?: boolean;
    }) => (
        <button
            onClick={onClick}
            className={`
                relative w-full p-5 rounded-2xl border-2 transition-all duration-200
                flex items-center gap-4 text-left
                ${selected
                    ? 'border-orange-500 bg-orange-50 shadow-lg'
                    : 'border-neutral-200 bg-white hover:bg-neutral-50'
                }
                ${highlight && !selected ? 'ring-2 ring-amber-400 ring-offset-2' : ''}
            `}
        >
            <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center shrink-0
                ${selected ? 'bg-white text-orange-600 shadow' : 'bg-neutral-100 text-neutral-600'}
            `}>
                <Icon size={24} />
            </div>
            <div>
                <div className={`font-bold ${selected ? 'text-neutral-900' : 'text-neutral-800'}`}>
                    {label}
                </div>
                {sublabel && (
                    <div className="text-sm text-neutral-500 mt-0.5">{sublabel}</div>
                )}
            </div>
            {selected && (
                <div className="absolute top-3 right-3">
                    <CheckCircle className="text-orange-600" size={20} />
                </div>
            )}
        </button>
    );

    return (
        <div className="bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden font-sans">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <Flame size={24} className="text-amber-300" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Estimation Travaux & Urgences</h3>
                        <p className="text-white/80 text-sm">Réseau d&apos;artisans couvreurs locaux qualifiés</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="relative">
                    <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white transition-all duration-500 ease-out rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-white/80">
                        <span>Étape {step}/{totalSteps}</span>
                        <span>{Math.round(progress)}% complété</span>
                    </div>
                </div>
            </div>

            {/* Form Body */}
            <div className="p-6">
                {/* Step 1: Project Type */}
                {step === 1 && (
                    <div className="space-y-4">
                        <h4 className="text-xl font-bold text-neutral-900 mb-6">
                            Quel type de travaux de toiture prévoyez-vous ?
                        </h4>
                        <div className="space-y-3">
                            <OptionButton
                                selected={formData.projectType === 'reparation_fuite'}
                                onClick={() => handleOptionSelect('projectType', 'reparation_fuite')}
                                icon={Droplet}
                                label="Réparation de fuite / Dépannage urgent"
                                sublabel="Infiltration active, tuiles envolées"
                                highlight={true}
                            />
                            <OptionButton
                                selected={formData.projectType === 'refection_totale'}
                                onClick={() => handleOptionSelect('projectType', 'refection_totale')}
                                icon={Hammer}
                                label="Réfection totale de toiture"
                                sublabel="Rénovation complète couverture"
                            />
                            <OptionButton
                                selected={formData.projectType === 'demoussage_nettoyage'}
                                onClick={() => handleOptionSelect('projectType', 'demoussage_nettoyage')}
                                icon={Wrench}
                                label="Nettoyage / Démoussage / Entretien"
                                sublabel="Traitement anti-mousse, hydrofuge"
                            />
                            <OptionButton
                                selected={formData.projectType === 'zinguerie_velux'}
                                onClick={() => handleOptionSelect('projectType', 'zinguerie_velux')}
                                icon={Home}
                                label="Zinguerie / Gouttières / Pose Velux"
                                sublabel="Aménagement combles & étanchéité"
                            />
                        </div>
                    </div>
                )}

                {/* Step 2: Roof Surface */}
                {step === 2 && (
                    <div className="space-y-4">
                        <h4 className="text-xl font-bold text-neutral-900 mb-6">
                            Surface estimée de la toiture ?
                        </h4>
                        <div className="space-y-3">
                            <OptionButton
                                selected={formData.roofSurface === 'moins_50'}
                                onClick={() => handleOptionSelect('roofSurface', 'moins_50')}
                                icon={Ruler}
                                label="Moins de 50 m²"
                                sublabel="Extensions, garage, petit pavillon"
                            />
                            <OptionButton
                                selected={formData.roofSurface === '50_100'}
                                onClick={() => handleOptionSelect('roofSurface', '50_100')}
                                icon={Ruler}
                                label="Entre 50 et 100 m²"
                                sublabel="Maison de ville, pavillon standard"
                            />
                            <OptionButton
                                selected={formData.roofSurface === 'plus_100'}
                                onClick={() => handleOptionSelect('roofSurface', 'plus_100')}
                                icon={Ruler}
                                label="Plus de 100 m²"
                                sublabel="Grande maison individuelle"
                            />
                        </div>
                    </div>
                )}

                {/* Step 3: Owner Status */}
                {step === 3 && (
                    <div className="space-y-4">
                        <h4 className="text-xl font-bold text-neutral-900 mb-6">
                            Quel est votre statut d&apos;occupation ?
                        </h4>
                        <div className="space-y-3">
                            <OptionButton
                                selected={formData.ownerStatus === 'proprietaire'}
                                onClick={() => handleOptionSelect('ownerStatus', 'proprietaire')}
                                icon={Home}
                                label="Propriétaire occupant"
                                sublabel="Décisionnaire direct"
                            />
                            <OptionButton
                                selected={formData.ownerStatus === 'locataire'}
                                onClick={() => handleOptionSelect('ownerStatus', 'locataire')}
                                icon={User}
                                label="Locataire"
                                sublabel="Nécessite généralement l'accord du propriétaire"
                            />
                            <OptionButton
                                selected={formData.ownerStatus === 'autre'}
                                onClick={() => handleOptionSelect('ownerStatus', 'autre')}
                                icon={User}
                                label="Bailleur / Syndic / Copropriétaire"
                                sublabel="Immeuble, investissement locatif"
                            />
                        </div>
                    </div>
                )}

                {/* Step 4: Delay / Urgency */}
                {step === 4 && (
                    <div className="space-y-4">
                        <h4 className="text-xl font-bold text-neutral-900 mb-6">
                            Sous quel délai les travaux doivent-ils débuter ?
                        </h4>
                        <div className="space-y-3">
                            <OptionButton
                                selected={formData.timeline === 'urgent'}
                                onClick={() => handleOptionSelect('timeline', 'urgent')}
                                icon={Clock}
                                label="Urgent (Fuite active / Tempête)"
                                sublabel="Intervention prioritaire requise"
                            />
                            <OptionButton
                                selected={formData.timeline === '3_mois'}
                                onClick={() => handleOptionSelect('timeline', '3_mois')}
                                icon={Calendar}
                                label="Dans les 3 mois"
                                sublabel="Projet à court terme"
                            />
                            <OptionButton
                                selected={formData.timeline === '6_mois'}
                                onClick={() => handleOptionSelect('timeline', '6_mois')}
                                icon={Clock}
                                label="Simple devis / En réflexion"
                                sublabel="Étude comparative"
                            />
                        </div>
                    </div>
                )}

                {/* Step 5: Contact Info */}
                {step === 5 && (
                    <div className="space-y-5">
                        <h4 className="text-xl font-bold text-neutral-900 mb-6">
                            Saisissez vos coordonnées pour recevoir vos devis
                        </h4>

                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                                    <User2 size={16} />
                                    Nom complet
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Jean Dupont"
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                                        Code Postal du chantier
                                    </label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleInputChange}
                                        placeholder="75000"
                                        maxLength={5}
                                        className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                                        <Mail size={16} />
                                        Adresse email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="jean.dupont@email.com"
                                        className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                                    <Phone size={16} />
                                    Numéro de téléphone
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="06 12 34 56 78"
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition outline-none"
                                />
                                {formData.phone && !FRENCH_PHONE_REGEX.test(formData.phone.replace(/\s/g, '') && formData.phoneConsent === true) && (
                                    <p className="text-xs text-red-500 mt-1">
                                        Format de téléphone invalide (Ex: 0612345678)
                                    </p>
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
                    {step > 1 && !(step === 2 && initialProjectType) && (
                        <button
                            onClick={prevStep}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-50 transition"
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
                                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-500/20 hover:from-orange-700 hover:to-amber-700'
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
                                        : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 transform hover:-translate-y-1 shadow-orange-500/20'
                                    }
                                    `}
                            >
                                {status === 'loading' ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Transmission...
                                    </span>
                                ) : (
                                    "Obtenir mes devis gratuits"
                                )}
                            </button>

                            <p className="text-xs text-slate-400 text-center mt-4 px-4 leading-relaxed">
                                En cliquant sur ce bouton, vous acceptez nos <Link href="/cgv" className="underline hover:text-orange-600">CGV</Link> et acceptez d&apos;être recontacté par des couvreurs locaux qualifiés pour votre projet.
                            </p>
                        </div>
                    )}
                </div>

                {/* Trust footer */}
                <div className="flex flex-wrap justify-center sm:justify-between gap-3 mt-6 pt-6 border-t border-neutral-100 text-[10px] sm:text-xs text-slate-400 font-medium uppercase tracking-wide">
                    <span className="flex items-center gap-1.5"><Shield size={12} className="text-green-500" /> Données Sécurisées</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> Sans engagement</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center gap-1.5"><Wrench size={12} className="text-amber-500" /> Artisans Qualibat RGE</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Devis sous 24h</span>
                </div>
            </div>
        </div>
    );
}
