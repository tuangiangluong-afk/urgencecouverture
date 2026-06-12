import ContactForm from "@/components/ContactForm";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Zap, CheckCircle } from "lucide-react";
import { getTheme } from "@/lib/theme";
import Header from "@/components/Header";

export default function HubContactPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-orange-500 selection:text-white">
            {/* Header - White Tech Style */}
            <Header isHub={true} variant="default" themeColor="orange" />

            {/* Hero Section */}
            <section className="pt-32 pb-12 lg:pt-40 lg:pb-20 px-6 bg-white overflow-hidden relative">
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

                <div className="mx-auto max-w-4xl text-center relative z-10">
                    <span className="inline-flex items-center rounded-full bg-orange-50 border border-orange-200 px-4 py-1.5 text-xs font-bold text-orange-700 mb-8 tracking-widest uppercase">
                        <Zap size={12} className="mr-2 fill-orange-600" />
                        Service National
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-slate-900">
                        Un projet de <span className="text-orange-600">toiture</span> ?
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Urgence fuite, rénovation complète, étanchéité ou entretien.
                        <br />
                        Obtenez vos devis gratuits de couvreurs locaux qualifiés sous 24h.
                    </p>
                </div>
            </section>

            <section className="pb-20 px-6">
                <div className="mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-3 gap-8 mb-16 -mt-8">
                        {/* Card 1: Commercial */}
                        <div className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 hover:border-orange-200 transition text-center group">
                            <div className="mx-auto w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 text-orange-600 group-hover:scale-110 transition duration-300">
                                <Phone size={28} />
                            </div>
                            <h3 className="font-bold text-slate-900 text-lg mb-2">Service Commercial</h3>
                            <p className="text-slate-500 text-sm mb-4">Lundi - Vendredi, 9h-18h</p>
                            <span className="text-lg font-bold text-orange-600">Via le formulaire ci-dessous</span>
                        </div>

                        {/* Card 2: Email */}
                        <div className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 hover:border-orange-200 transition text-center group">
                            <div className="mx-auto w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 text-orange-600 group-hover:scale-110 transition duration-300">
                                <Mail size={28} />
                            </div>
                            <h3 className="font-bold text-slate-900 text-lg mb-2">Support & Partenaires</h3>
                            <p className="text-slate-500 text-sm mb-4">Réponse sous 24h ouvrées</p>
                            <span className="font-bold text-orange-600">Via le formulaire ci-dessous</span>
                        </div>

                        {/* Card 3: Siege */}
                        <div className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 hover:border-orange-200 transition text-center group">
                            <div className="mx-auto w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 text-orange-600 group-hover:scale-110 transition duration-300">
                                <MapPin size={28} />
                            </div>
                            <h3 className="font-bold text-slate-900 text-lg mb-2">Siège Social</h3>
                            <p className="text-slate-500 text-sm mb-4">Paris, France</p>
                            <p className="font-bold text-slate-900">Urgence Couverture</p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-5 gap-12">
                        {/* Left Content */}
                        <div className="lg:col-span-2 space-y-8">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">Pourquoi nous choisir ?</h3>
                                <ul className="space-y-4">
                                    {[
                                        "Réseau national de couvreurs qualifiés RGE Qualibat",
                                        "Interventions rapides 24/7 en cas de fuite ou infiltration",
                                        "Diagnostic de toit et devis gratuit en 24 heures",
                                        "Garantie décennale systématique sur tous les travaux"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-slate-600">
                                            <CheckCircle size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100">
                                <h4 className="font-bold text-orange-900 mb-2">Vous êtes couvreur ?</h4>
                                <p className="text-sm text-orange-700 mb-4">Rejoignez le 1er réseau de mise en relation toiture & dépannage en France.</p>
                                <Link href="#form" className="text-sm font-bold text-orange-600 hover:underline flex items-center gap-1">
                                    Devenir partenaire <ArrowLeft className="rotate-180" size={14} />
                                </Link>
                            </div>
                        </div>

                        {/* Form */}
                        <div id="form" className="lg:col-span-3 bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-slate-100">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-slate-900">Envoyer un message</h2>
                                <p className="text-slate-500">Remplissez le formulaire ci-dessous pour une étude gratuite de votre toiture.</p>
                            </div>
                            <ContactForm domain="urgencecouverture.com" city="Hub National" theme={getTheme('national')} />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
