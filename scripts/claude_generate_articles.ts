import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ──────────────────────────────────────────────────────────────────────────────
// Topics: basés sur les vraies questions des gens (Reddit, forums, Google)
// sur l'installation de bornes de recharge en France — objectif = générer des leads
// ──────────────────────────────────────────────────────────────────────────────
const TOPICS = [
  // === Prix et coût ===
  "Borne de recharge à domicile : combien ça coûte vraiment en 2026 ? (installation incluse)",
  "Wallbox 7 kW vs 11 kW vs 22 kW : laquelle choisir et à quel prix ?",
  "Prix d'un installateur IRVE : comment éviter les arnaques et comparer les devis",
  "Recharger sa voiture électrique à domicile : est-ce vraiment moins cher qu'en borne publique ?",
  "Coût annuel d'une voiture électrique : calcul complet recharge + entretien 2026",

  // === Copropriété ===
  "Borne de recharge en copropriété : comment exercer son droit à la prise étape par étape",
  "Le syndic refuse votre borne de recharge : vos droits et recours en 2026",
  "Installation collective vs individuelle en copropriété : guide complet avec coûts",
  "Comment voter en AG pour une borne de recharge partagée (guide copropriétaires)",
  "Câble partagé en copropriété : technique, coût et répartition des frais",

  // === Aides et subventions ===
  "Aides pour l'installation d'une borne de recharge en 2026 : Advenir, TVA 5,5%, crédit impôt",
  "Programme Advenir 2026 : comment en bénéficier et qui peut postuler ?",
  "Crédit d'impôt borne de recharge 2026 : conditions, montant et démarches",
  "Aides locales pour borne de recharge : mairies, régions, conseils départementaux",
  "CEE (Certificats d'Économies d'Énergie) et bornes de recharge : ce qu'il faut savoir",

  // === Certifications et installateurs ===
  "IRVE : qu'est-ce que c'est et pourquoi c'est obligatoire pour installer votre borne ?",
  "Comment choisir un bon installateur IRVE certifié ? Les 7 critères essentiels",
  "Que se passe-t-il si votre borne est installée par quelqu'un sans certification IRVE ?",
  "Délai et étapes d'une installation de borne de recharge : de la demande à la mise en service",
  "Questions à poser à votre installateur IRVE avant de signer le devis",

  // === Maison individuelle ===
  "Installer une wallbox dans une maison individuelle : guide 2026 étape par étape",
  "Borne de recharge en garage : contraintes techniques, puissance et normes",
  "Borne de recharge en extérieur (abri, carport) : ce qu'il faut prévoir",
  "Monophasé ou triphasé : quel branchement pour votre borne de recharge ?",
  "Ma borne de recharge déclenche le disjoncteur : causes et solutions",

  // === Entreprises et professionnels ===
  "Borne de recharge pour entreprise : obligations légales et avantages fiscaux 2026",
  "Fleet IRVE : comment électrifier le parc automobile de votre société",
  "Parking d'entreprise obligatoire pré-équipé : la loi LOM expliquée",
  "Borne de recharge dans un local commercial : démarches, coûts et aides",
  "Avantage en nature et borne de recharge au bureau : règles fiscales 2026",

  // === Comparatifs marques et produits ===
  "Comparatif wallbox 2026 : Zaptec, Schneider EVlink, Alfen, Easee — laquelle choisir ?",
  "Tesla Wall Connector vs wallbox universelle : compatibilité et performances",
  "Wallbox intelligente vs basique : est-ce que ça vaut le surcoût ?",
  "Borne de recharge connectée : utile ou gadget ? Analyse des fonctionnalités réelles",
  "Câble attaché vs câble détachable sur wallbox : avantages et inconvénients",

  // === Problèmes et dépannage ===
  "Ma borne de recharge ne fonctionne plus : diagnostic et solutions rapides",
  "Recharge lente sur borne à domicile : pourquoi et comment y remédier ?",
  "Borne de recharge qui chauffe : risques, causes et que faire ?",
  "Erreur sur l'application de ma wallbox connectée : que vérifier en premier ?",
  "Garantie et assurance sur une borne de recharge : ce que couvre vraiment votre contrat",

  // === Technique et réglementation ===
  "Norme NFC 15-100 et borne de recharge : ce que l'électricien doit respecter",
  "Compteur Linky et borne de recharge : compatibilité et avantages des heures creuses",
  "Borne de recharge et panneaux solaires : peut-on recharger avec sa propre énergie ?",
  "OCPP et bornes de recharge : c'est quoi et pourquoi c'est important pour vous ?",
  "Puissance de recharge et autonomie : combien de temps pour recharger 100 km ?",

  // === Questions pratiques des prospects ===
  "Dois-je prévenir Enedis pour installer une borne de recharge à domicile ?",
  "Borne de recharge en location : qui paie, qui décide entre locataire et propriétaire ?",
  "Déménagement avec une borne de recharge : peut-on l'emporter ou faut-il tout réinstaller ?",
  "Entretien d'une borne de recharge : que faut-il faire et à quelle fréquence ?",
  "Borne de recharge d'occasion : bonne idée ou risque trop élevé ? Guide d'achat",
];

async function ensureBlogTable() {
    // Test if table exists
    const { error } = await supabase.from('blog_posts').select('id').limit(1);
    if (error && error.code === '42P01') {
        console.log('Table blog_posts does not exist — creating...');
        // Create via raw SQL isn't possible via client; we'll just catch per-row errors
        console.error('Please create the blog_posts table in Supabase Dashboard first. SQL:\nCREATE TABLE blog_posts (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  title TEXT NOT NULL,\n  slug TEXT NOT NULL UNIQUE,\n  excerpt TEXT,\n  content TEXT,\n  seo_title TEXT,\n  seo_description TEXT,\n  status TEXT DEFAULT \'draft\',\n  published_at TIMESTAMPTZ,\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);');
        process.exit(1);
    }
    console.log('Table blog_posts ready ✅');
}

function toSlug(s: string): string {
    return s.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 80);
}

async function callClaude(topic: string): Promise<string> {
    const system = `Tu es le rédacteur expert d'\"Expert Borne Recharge\", la référence française pour l'installation de bornes de recharge IRVE pour véhicules électriques.
Ton audience : Particuliers (maison, copropriété), entreprises et professionnels qui cherchent à installer une borne et veulent se faire accompagner.

OBJECTIF BUSINESS : Générer des leads. Chaque article doit donner confiance, répondre aux vraies questions, et pousser le visiteur à demander un devis.

MISSION : Rédiger un article de blog EXPERT, 2000-2800 mots, en HTML optimisé SEO et GEO (pour ChatGPT, Perplexity, Gemini).

━━━ FORMAT HTML REQUIS ━━━
- <h2>, <h3> pour la structure
- <p> pour les paragraphes
- <ul><li> et <ol><li> pour les listes
- <strong> pour les termes clés
- <blockquote> pour les stats officielles ou avertissements importants
- <table><thead><tbody><tr><th><td> pour les comparatifs (tarifs, aides, produits)
- <div class="callout-devis"> avec un texte d'appel à l'action vers un devis gratuit (2x dans l'article : milieu + fin)
- <div class="key-points"><h3>À retenir</h3><ul>...</ul></div> en conclusion

━━━ RÈGLES SEO/GEO ━━━
- Mot-clé principal présent dans : title, meta, 1er §, 1 H2
- Stats réelles ou plausibles (ex: "Selon l'AVERE-France, en 2025...")
- Réponses directes aux questions (format "La réponse est...")
- Frameworks nommés (ex: "La méthode IRVE en 5 étapes de Expert Borne Recharge")
- Mentionner "Expert Borne Recharge" 2-3 fois naturellement
- CTA en milieu et fin d'article pour demander un devis gratuit

OUTPUT: JSON uniquement :
{
  "title": "Titre SEO (60 chars max)",
  "slug": "slug-en-francais",
  "excerpt": "Accroche 2-3 phrases, incite à lire",
  "seo_title": "Meta title 60 chars max",
  "seo_description": "Meta description 150-160 chars",
  "content": "HTML complet"
}

Respond with ONLY the JSON. No markdown. No explanation.`;

    const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': CLAUDE_API_KEY,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 16000,
            system,
            messages: [{ role: 'user', content: `Rédige l'article complet sur : "${topic}"` }]
        })
    });

    if (!res.ok) throw new Error(`Claude error ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return (data as any).content[0].text;
}

async function generateArticle(topic: string, i: number) {
    console.log(`\n[${i + 1}/${TOPICS.length}] ${topic}`);
    const text = await callClaude(topic);

    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error('JSON not found');
    const art = JSON.parse(text.substring(start, end + 1));

    const slug = toSlug(art.slug || topic);

    const { error } = await supabase.from('blog_posts').upsert({
        title: art.title,
        slug,
        excerpt: art.excerpt,
        content: art.content,
        seo_title: art.seo_title,
        seo_description: art.seo_description,
        status: 'draft',
        published_at: new Date().toISOString()
    }, { onConflict: 'slug' });

    if (error) {
        console.error(`  [ERROR] ${error.message}`);
    } else {
        console.log(`  [OK] ${art.title}`);
    }
}

async function main() {
    console.log('='.repeat(60));
    console.log(`EXPERT BORNE RECHARGE — ${TOPICS.length} articles lead-gen`);
    console.log('='.repeat(60));

    await ensureBlogTable();

    for (let i = 0; i < TOPICS.length; i++) {
        try {
            await generateArticle(TOPICS[i], i);
        } catch (e) {
            console.error(`  [FAIL] ${TOPICS[i]}:`, e);
        }
        if (i < TOPICS.length - 1) await new Promise(r => setTimeout(r, 1500));
    }

    console.log('\n' + '='.repeat(60));
    console.log(`DONE — ${TOPICS.length} articles générés en brouillon`);
    console.log('='.repeat(60));
}

main().catch(console.error);
