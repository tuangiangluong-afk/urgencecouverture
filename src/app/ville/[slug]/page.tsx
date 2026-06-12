import { getCityByCleanSlug, CITIES } from "@/lib/db";
import { getPseoContent } from "@/lib/pseo";
import { CheckCircle, Award, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import LeadForm from "@/components/LeadForm";
import Header from "@/components/Header";
import SchemaJSON from "@/components/SchemaJSON";
import Reviews from "@/components/Reviews";
import { Footer } from "@/components/Footer";
import { slugify } from "@/lib/slugify";
import { InternalMesh } from "@/components/InternalMesh";
import { VillesVoisines } from "@/components/VillesVoisines";
import { LocalFAQ } from "@/components/LocalFAQ";

// Dynamically generate for ALL cities
export async function generateStaticParams() {
    return Object.values(CITIES).map(city => ({ slug: slugify(city.city) }));
}

// ============================================
// METADATA
// ============================================

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const resolvedParams = await params;
    const site = getCityByCleanSlug(resolvedParams.slug);

    if (!site) {
        return {};
    }

    const pseo = await getPseoContent(site);

    return {
        title: pseo.meta_title,
        description: pseo.meta_description,
        openGraph: {
            title: pseo.meta_title,
            description: pseo.meta_description,
            siteName: site.name,
            images: [
                {
                    url: site.heroImage,
                    width: 1200,
                    height: 630,
                    alt: `Couvreur professionnel à ${site.city}`
                }
            ],
            locale: "fr_FR",
            type: "website",
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

// ============================================
// PAGE COMPONENT
// ============================================

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const site = getCityByCleanSlug(resolvedParams.slug);

    if (!site) {
        return notFound();
    }

    const pseo = await getPseoContent(site);

    return (
        <div className="min-h-screen font-sans text-slate-900 bg-white">
            <Header
                isHub={true}
                city={site.city}
                phoneNumber={site.phoneNumber}
                variant="default"
                themeColor="orange"
            />

            <SchemaJSON type="LocalBusiness" site={site} />
            <SchemaJSON type="FAQPage" site={site} faqSegment="B2C" />

            <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full text-sm font-bold mb-6">
                                <CheckCircle size={16} />
                                {pseo.hero_badge}
                            </div>
                            <h1
                                className="text-4xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-tight"
                                dangerouslySetInnerHTML={{ __html: pseo.hero_title }}
                            />
                            <div
                                className="text-lg text-slate-600 mb-8 leading-relaxed prose prose-lg prose-orange"
                                dangerouslySetInnerHTML={{ __html: pseo.intro_html }}
                            />
                            
                            {/* Local Expert Tip */}
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-8 flex gap-3">
                                <Award className="text-amber-500 shrink-0 mt-1" />
                                <p className="text-sm text-slate-700 italic">
                                    <strong>Conseil Expert :</strong> {pseo.expert_tip}
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <a
                                    href="#simulateur"
                                    className="bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-center hover:bg-orange-700 transition"
                                >
                                    {pseo.cta_primary}
                                </a>
                                <a
                                    href={`tel:${site.phoneNumber}`}
                                    className="bg-slate-100 text-slate-900 px-8 py-4 rounded-xl font-bold text-center hover:bg-slate-200 transition"
                                >
                                    Appeler un expert
                                </a>
                            </div>
                        </div>
                        <div className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                            <Image
                                src={site.heroImage}
                                alt={`Travaux toiture couvreur ${site.city}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-slate-50 border-y border-slate-200" id="simulateur">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-xl">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Votre devis gratuit en 2 min</h2>
                            <p className="text-slate-600">Estimation immédiate de vos aides et du coût des travaux</p>
                        </div>
                        <LeadForm
                            city={site.city}
                            domain="urgencecouverture.com"
                            targetType="MIXED"
                            themeColor="orange"
                        />
                    </div>
                </div>
            </section>

            <Reviews site={site} themeColor="orange" />
            <LocalFAQ site={site} segment="B2C" />
            <VillesVoisines currentCitySlug={slugify(site.city)} department={site.department || ""} cityName={site.city} />
            <InternalMesh city={site.city} config={site} />
            <Footer config={site} />
        </div>
    );
}
