"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

import { Theme } from "@/lib/theme";

interface ContactFormProps {
    domain: string;
    city: string;
    theme: Theme;
}

export default function ContactForm({ domain, city, theme }: ContactFormProps) {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        // ... (existing logic same)
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Basic specific validation for Contact Form
        const errors: string[] = [];
        if (!data.name || (data.name as string).trim() === "") errors.push("votre Nom");
        if (!data.email || !(data.email as string).includes("@")) errors.push("un Email valide avec '@'");
        if (!data.postalCode || !/^\d{5}$/.test((data.postalCode as string).trim())) errors.push("un Code Postal valide à 5 chiffres");
        if (!data.message || (data.message as string).trim() === "") errors.push("votre Message");
        
        // Phone validation (required)
        const phone = (data.phone as string) || "";
        const FRENCH_PHONE_REGEX = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
        if (phone.trim() === "" || !FRENCH_PHONE_REGEX.test(phone.replace(/\s/g, ''))) {
            errors.push("un Numéro de téléphone valide");
        }

        if (errors.length > 0) {
            setStatus("error");
            setErrorMessage(`Veuillez corriger ou renseigner : ${errors.join(', ')}.`);
            return;
        }

        setStatus("loading");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, domain, city }),
            });

            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.error || "Erreur lors de l'envoi");
            }

            setStatus("success");
            form.reset();
        } catch (error: any) {
            console.error(error);
            setStatus("error");
            setErrorMessage(error.message || "Une erreur est survenue. Veuillez nous appeler directement.");
        }
    }

    if (status === "success") {
        return (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="text-green-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-green-900 mb-2">Message envoyé !</h3>
                <p className="text-green-700">
                    Merci de nous avoir contactés. Nous vous répondrons sous 24h.
                </p>
                <button
                    onClick={() => setStatus("idle")}
                    className="mt-6 text-sm font-semibold text-green-800 hover:underline"
                >
                    Envoyer un autre message
                </button>
            </div>
        );
    }

    // Theme-based classes - use static Tailwind classes (dynamic ones don't compile)
    const inputClasses = `w-full rounded-xl border border-neutral-300 px-4 py-3 text-neutral-900 focus:border-blue-500 focus:ring-blue-500 transition outline-none bg-white font-medium`;
    const buttonClasses = `w-full flex items-center justify-center gap-2 rounded-xl py-4 text-white font-bold text-lg transition active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed ${theme.classes.bg} hover:brightness-110`;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-neutral-700">Nom complet</label>
                    <input
                        required
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Jean Dupont"
                        className={inputClasses}
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-neutral-700">Email</label>
                    <input
                        required
                        type="email"
                        name="email"
                        id="email"
                        placeholder="jean@exemple.com"
                        className={inputClasses}
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-neutral-700">Sujet</label>
                    <select
                        name="subject"
                        id="subject"
                        className={inputClasses}
                    >
                        <option value="devis_particulier">Devis Particulier (Maison/Copro)</option>
                        <option value="devis_pro">Devis Entreprise / Flotte</option>
                        <option value="partenariat_installateur">Devenir Installateur Partenaire</option>
                        <option value="autre">Autre demande</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label htmlFor="postalCode" className="text-sm font-medium text-neutral-700">Code Postal</label>
                    <input
                        required
                        type="text"
                        name="postalCode"
                        id="postalCode"
                        placeholder="75000"
                        maxLength={5}
                        pattern="\d{5}"
                        className={inputClasses}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-neutral-700">Téléphone</label>
                <input
                    required
                    type="tel"
                    name="phone"
                    id="phone"
                    placeholder="06 12 34 56 78"
                    className={inputClasses}
                />
            </div>
            {/* Honeypot for bots */}
            <input type="text" name="b_name" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

            <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-neutral-700">Message</label>
                <textarea
                    required
                    name="message"
                    id="message"
                    rows={5}
                    placeholder="Bonjour, je souhaite réserver..."
                    className={`${inputClasses} resize-none`}
                />
            </div>

            {status === "error" && (
                <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 text-red-700 text-sm">
                    <AlertCircle size={16} />
                    {errorMessage}
                </div>
            )}

            <button
                type="submit"
                disabled={status === "loading"}
                className={buttonClasses}
            >
                {status === "loading" ? (
                    <>
                        <Loader2 className="animate-spin" size={20} />
                        Envoi en cours...
                    </>
                ) : (
                    <>
                        <Send size={20} />
                        Envoyer le message
                    </>
                )}
            </button>

            <p className="text-xs text-center text-neutral-500">
                En envoyant ce formulaire, vous acceptez notre politique de confidentialité.
            </p>
        </form>
    );
}
