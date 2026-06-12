import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { CITIES } from '../src/lib/db';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function toSlug(s: string): string {
    return s.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 80);
}

async function callClaude(topic: string, cityName: string): Promise<string> {
    const system = `Tu es le rédacteur expert d'\"Expert Borne Recharge\", le spécialiste de l'installation IRVE pour la ville de ${cityName} et sa région.

OBJECTIF BUSINESS : Générer des leads locaux qualifiés à ${cityName}. L'article doit prouver notre expertise locale et inciter à demander un devis.

MISSION : Rédiger un guide HYPER-LOCALISÉ, 1500-2000 mots, en HTML optimisé SEO.

━━━ FORMAT HTML REQUIS ━━━
- Ne pas mettre de balise <h1>, commence par <h2>
- <h2>, <h3> pour la structure
- <p> pour les paragraphes
- <ul><li> et <ol><li> pour les listes
- <strong> pour les termes clés
- <blockquote> pour les avantages de faire appel à un expert local
- <table><thead><tbody><tr><th><td> pour un récapitulatif des aides locales et nationales
- <div class="callout-devis"> texte d'appel à l'action vers un devis d'installation à ${cityName} (2x dans l'article : milieu + fin)
- <div class="key-points"><h3>À retenir pour votre installation à ${cityName}</h3><ul>...</ul></div> en conclusion

━━━ RÈGLES SEO & LOCALES ━━━
- Mot-clé principal: Installation borne de recharge ${cityName}
- Parler des aides locales de la région si elles existent, en plus d'Advenir et crédit d'impôt.
- S'adresser aux habitants de ${cityName} (maisons, copropriétés, entreprises locales).
- Être très précis sur les démarches (syndic, qualification IRVE, intervention rapide).
- Mentionner "Expert Borne Recharge" et "${cityName}" fréquemment mais naturellement.

OUTPUT: JSON uniquement :
{
  "title": "Titre SEO (ex: Installation Borne de Recharge à ${cityName} : Aides et Devis 2026)",
  "slug": "installation-borne-recharge-${toSlug(cityName)}",
  "excerpt": "Accroche 2-3 phrases sur l'importance de l'installation par un pro IRVE à ${cityName}.",
  "seo_title": "Installation Borne Recharge ${cityName} | Aides & Installateur Pro",
  "seo_description": "Besoin d'installer une borne de recharge pour voiture électrique à ${cityName} ? Guide des aides 2026, prix et devis par un installateur IRVE certifié.",
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
            messages: [{ role: 'user', content: `Rédige l'article complet et hyper-localisé sur : "${topic}"` }]
        })
    });

    if (!res.ok) throw new Error(`Claude error ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return (data as any).content[0].text;
}

async function generateArticle(cityName: string, slugCity: string, i: number, total: number) {
    const topic = `Installation d'une borne de recharge à ${cityName} : Aides, prix et recommandations 2026`;
    console.log(`\n[${i + 1}/${total}] Generer pour ${cityName}...`);
    
    try {
        const text = await callClaude(topic, cityName);

        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        if (start === -1 || end === -1) throw new Error('JSON not found');
        const art = JSON.parse(text.substring(start, end + 1));

        const slug = toSlug(art.slug || `installation-borne-recharge-${slugCity}`);

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
            console.error(`  [ERROR DB] ${cityName}: ${error.message}`);
        } else {
            console.log(`  [OK] ${art.title}`);
        }
    } catch (e: any) {
        console.error(`  [FAIL API] ${cityName}:`, e.message);
    }
}

async function main() {
    const cityKeys = Object.keys(CITIES);
    console.log('='.repeat(60));
    console.log(`EXPERT BORNE RECHARGE — ${cityKeys.length} articles locaux hyper-ciblés`);
    console.log('='.repeat(60));

    for (let i = 0; i < cityKeys.length; i++) {
        const key = cityKeys[i];
        const cityObj = CITIES[key];
        await generateArticle(cityObj.city || cityObj.name.replace('Expert Borne ', ''), key, i, cityKeys.length);
        if (i < cityKeys.length - 1) await new Promise(r => setTimeout(r, 1500));
    }

    console.log('\n' + '='.repeat(60));
    console.log(`DONE — Génération de masse terminée`);
    console.log('='.repeat(60));
}

main().catch(console.error);
