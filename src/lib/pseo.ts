import type { CityConfig } from "@/lib/db";

export interface PseoPageContent {
    meta_title: string;
    meta_description: string;
    hero_title: string;
    hero_badge: string;
    intro_html: string;
    cta_primary: string;
    pricing_estimated: string;
    regional_subsidy: string;
    expert_tip: string;
}

const REGIONAL_DATA: Record<string, { subsidyName: string; subsidyAmount: string; avgPrice: string; }> = {
    "75": { subsidyName: "Urgence Toiture Paris", subsidyAmount: "Intervention fuite 2h + TVA réduite 10% ou 5.5%", avgPrice: "140€ – 300€ / m²" },
    "69": { subsidyName: "Dépannage Toiture Lyon", subsidyAmount: "Intervention fuite 2h + TVA réduite RGE", avgPrice: "120€ – 260€ / m²" },
    "13": { subsidyName: "Urgence Couverture Marseille", subsidyAmount: "Intervention fuite 2h + TVA réduite RGE", avgPrice: "110€ – 240€ / m²" },
    "06": { subsidyName: "Dépannage Couverture Nice", subsidyAmount: "Intervention fuite 2h + TVA réduite RGE", avgPrice: "130€ – 280€ / m²" },
    "33": { subsidyName: "Urgence Couvreur Bordeaux", subsidyAmount: "Intervention fuite 2h + TVA réduite RGE", avgPrice: "120€ – 260€ / m²" },
    "59": { subsidyName: "Dépannage Toiture Lille", subsidyAmount: "Intervention fuite 2h + TVA réduite RGE", avgPrice: "115€ – 250€ / m²" },
    "44": { subsidyName: "Urgence Couverture Nantes", subsidyAmount: "Intervention fuite 2h + TVA réduite RGE", avgPrice: "110€ – 240€ / m²" }
};

const DEFAULT_REGIONAL = {
    subsidyName: "Alerte Urgence Fuite & Dépannage 24/7",
    subsidyAmount: "Aides à la rénovation thermique (MaPrimeRénov' + CEE) + TVA 5.5%",
    avgPrice: "120€ – 260€ / m²"
};

function getExpertTip(city: string, dept: string, neighborhoods: string[]): string {
    const hash = city.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const isFrance = city.toLowerCase() === "france";
    const prep = isFrance ? "en" : "à";

    const tips = [
        `En cas de fuite de toiture active ${prep} ${city}, demandez immédiatement un bâchage d'urgence sous 2 heures. Cette prestation conservatoire est généralement prise en charge à 100% par votre assurance habitation.`,
        `À ${city}, la réfection de toiture doit intégrer une isolation thermique RGE pour ouvrir droit aux aides de l'État (MaPrimeRénov' et CEE). ${isFrance ? "Notre réseau" : `En ${dept}, nos couvreurs`} proposent des devis d'étanchéité sous 24h.`,
        `Pour tout travaux de couverture ${prep} ${city}, exigez systématiquement l'attestation d'assurance garantie décennale de l'artisan avant le début du chantier. C'est votre seule protection sur 10 ans.`,
        `Un nettoyage et démoussage régulier de votre toiture ${prep} ${city} prolonge sa durée de vie de 15 ans en protégeant les tuiles contre la porosité provoquée par le gel et les intempéries.`,
    ];
    return tips[hash % tips.length];
}

function getIntroHtml(city: string, dept: string, neighborhoods: string[], postalCode: string, avgPrice: string): string {
    const hash = city.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const isFrance = city.toLowerCase() === "france";
    const prep = isFrance ? "en" : "à";

    const neighborhoodMention = neighborhoods.length >= 2
        ? `Nos couvreurs interviennent dans tous les quartiers : <strong>${neighborhoods.slice(0, 3).join(', ')}</strong> et communes limitrophes.`
        : "";

    const postalCodeMention = postalCode ? ` (${postalCode})` : "";

    const intros = [
        `<p class="mb-4">
            Vous faites face à une <strong>fuite de toiture en urgence</strong> ou vous prévoyez des travaux de rénovation de couverture ${prep} <strong>${city}${postalCodeMention}</strong> ? 
            Nos artisans couvreurs qualifiés réalisent la recherche de fuite d'eau, le remplacement de tuiles brisées et la réfection complète de votre toit.
            ${neighborhoodMention}
        </p>
        <p>
            Le tarif pour refaire ou réparer un toit ${prep} ${city} s'élève en moyenne à <strong>${avgPrice}</strong> (selon les matériaux choisis). 
            Déplacement gratuit et devis détaillé transmis sous 24 heures par un professionnel certifié Qualibat RGE.
        </p>`,

        `<p class="mb-4">
            Trouvez une <strong>entreprise de couverture RGE</strong> de confiance ${prep} <strong>${city}</strong>${dept ? ` (${dept})` : ''} pour vos travaux de zinguerie, charpente et pose de Velux. 
            Nos techniciens interviennent rapidement pour localiser et colmater les infiltrations d'eau sous toiture avant qu'elles n'endommagent vos combles.
        </p>
        <p>
            ${neighborhoodMention} Nos devis de couverture ${prep} ${city} sont 100% gratuits. 
            Nous vous aidons à bénéficier de la TVA réduite à <strong>5.5%</strong> et des aides MaPrimeRénov' pour vos travaux d'isolation de toiture.
        </p>`,

        `<p class="mb-4">
            Infiltrations d'eau, tuiles cassées ou démoussage nécessaire de votre toit ${prep} <strong>${city}</strong> ? 
            Nos artisans couvreurs professionnels réalisent tous vos travaux de couverture et d'étanchéité dans le respect des règles de l'art (DTU) et avec garantie décennale.
        </p>
        <p>
            Toutes nos interventions d'urgence fuite de toit ${prep} ${city} font l'objet d'un bâchage temporaire immédiat pour protéger votre maison de la pluie. 
            ${neighborhoodMention}
        </p>`,
    ];

    return intros[hash % intros.length];
}

export async function getPseoContent(cityConfig: CityConfig, targetType: string = 'MIXED'): Promise<PseoPageContent> {
    const { city, department, region, postalCode, neighborhoods, pricing } = cityConfig;
    const dept = department || "";
    const postal = postalCode || "";
    const quartiers = neighborhoods || [];

    const deptCode = dept.length >= 2 ? dept.substring(0, 2) : "";
    const regionalInfo = REGIONAL_DATA[deptCode] || DEFAULT_REGIONAL;

    const realPrice = pricing?.base || "Sur Devis";

    const isFrance = city.toLowerCase() === "france";
    const prep = isFrance ? "en" : "à";

    const meta_title = `Artisan Couvreur ${isFrance ? "en France" : city}${postal ? ` (${postal})` : ''} | Urgence Fuite & Devis`;
    const meta_description = `Recherche de fuite et étanchéité de toiture ${prep} ${city} par une entreprise de couverture certifiée RGE. Déplacement et devis gratuit sous 24h. Garantie décennale.`;

    const hero_title = `Artisan <span class="text-orange-600">Couvreur</span> ${prep} ${city}${postal ? ` <span class="text-slate-400 text-3xl">(${postal})</span>` : ''}`;
    const hero_badge = regionalInfo.subsidyName;

    const intro_html = getIntroHtml(city, dept, quartiers, postal, regionalInfo.avgPrice);

    return {
        meta_title,
        meta_description,
        hero_title,
        hero_badge,
        intro_html,
        cta_primary: "Obtenir mon devis gratuit",
        pricing_estimated: realPrice,
        regional_subsidy: regionalInfo.subsidyAmount,
        expert_tip: getExpertTip(city, dept, quartiers),
    };
}
