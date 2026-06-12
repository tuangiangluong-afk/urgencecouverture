import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createSupabaseAdmin } from '@/lib/supabase-server';
import { getSiteConfig } from '@/lib/sites-config';
import { sendLeadToViteUnDevis } from '@/lib/viteundevis';

// Help functions to calculate score for roofing leads
function calculateScore(body: any): number {
    let score = 0;
    if (body.projectType === 'refection_totale') score += 35;
    if (body.projectType === 'reparation_fuite') score += 20;
    if (body.projectType === 'zinguerie_velux') score += 15;
    if (body.projectType === 'demoussage_nettoyage') score += 10;
    if (body.roofSurface === 'plus_100') score += 30;
    if (body.roofSurface === '50_100') score += 15;
    if (body.roofSurface === 'moins_50') score += 5;
    if (body.ownerStatus === 'proprietaire') score += 20;
    if (body.timeline === 'urgent') score += 25;
    if (body.timeline === '3_mois') score += 10;
    return score;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("📥 [API/LEADS/ROOFING] Received body:", body);
        const {
            name, email, phone, city, postalCode, domain,
            projectType, roofSurface, ownerStatus, timeline,
            attribution
        } = body;

        if (!name || !email || !phone) {
            return NextResponse.json(
                { error: 'Champs obligatoires manquants' },
                { status: 400 }
            );
        }

        const leadScore = calculateScore(body);
        
        // ----------------------------------------------------
        // ARBITRAGE ROUTING
        // Score >= 40 OR (Reparation fuite AND Proprietaire) -> Premium Partner
        // Score < 40 -> ViteUnDevis API
        // ----------------------------------------------------
        let arbitrageStatus = 'vite_un_devis';
        if (leadScore >= 40 || (projectType === 'reparation_fuite' && ownerStatus === 'proprietaire')) {
            arbitrageStatus = 'direct_partner';
        }

        console.log(`⚖️ [ARBITRAGE] Lead score: ${leadScore}. Routing status: ${arbitrageStatus}`);

        // Forward to ViteUnDevis if it is a secondary lead
        let vudResult = null;
        if (arbitrageStatus === 'vite_un_devis') {
            console.log("📡 [ViteUnDevis] Forwarding lead to ViteUnDevis API...");
            
            let catId = '143'; // Toiture
            if (postalCode === '33260') {
                catId = '145'; // Map to Déménagement for tests
            }
            
            const nameParts = (name || '').trim().split(/\s+/);
            const prenom = nameParts[0] || 'Client';
            const nom = nameParts.slice(1).join(' ') || 'Inconnu';
            
            const vudPayload = {
                nom,
                prenom,
                email,
                tel: phone,
                cp: postalCode,
                ville: city,
                cp_projet: postalCode,
                ville_projet: city,
                pays: 'fr',
                adresse1: 'Adresse non communiquee',
                tp: 1, // Particulier
                type_bien: 2, // Maison
                situation: ownerStatus === 'proprietaire' ? 1 : 2,
                delais: timeline === 'urgent' ? 1 : timeline === '3_mois' ? 2 : 3,
                description: `Projet de couverture/toiture. Type de travaux: ${projectType || 'N/A'}. Surface de toit: ${roofSurface || 'N/A'}. Statut d'habitation: ${ownerStatus || 'N/A'}. Delai: ${timeline || 'N/A'}.`,
                cat_id: catId,
                site_name: domain || 'urgencecouverture.com'
            };
            
            try {
                vudResult = await sendLeadToViteUnDevis(vudPayload);
            } catch (err) {
                console.error("❌ Failed to forward to ViteUnDevis:", err);
            }
        }

        const apiKey = process.env.RESEND_API_KEY;
        const resend = apiKey ? new Resend(apiKey) : null;

        // 1. SAVE TO DATABASE (Supabase)
        const metadata = {
            roof_surface: roofSurface,
            owner_status: ownerStatus,
            timeline: timeline,
            source: 'website',
            attribution: attribution || { source: 'direct', medium: 'direct' },
            score: leadScore,
            arbitrage_status: arbitrageStatus,
            niche: 'toiture'
        };

        const supabase = createSupabaseAdmin();
        const siteConfig = getSiteConfig(domain);
        const region = siteConfig?.region || 'National';
        const department = siteConfig?.department || (postalCode ? postalCode.substring(0, 2) : null);

        const { error: dbError } = await supabase
            .from('leads')
            .insert({
                name,
                email,
                phone,
                city,
                postal_code: postalCode,
                tenant_id: domain,
                type: 'roofing_lead',
                housing_type: projectType,
                status: 'new',
                region: region,
                department: department,
                message: JSON.stringify(metadata, null, 2),
                niche: 'toiture',
                arbitrage_status: arbitrageStatus,
                score: leadScore
            });

        if (dbError) {
            console.error('Supabase DB Error:', dbError);
        }

        // 2. SEND NOTIFICATION EMAIL (Resend)
        if (resend) {
            const subject = arbitrageStatus === 'direct_partner'
                ? `💎🏠 NOUVEAU LEAD TOITURE PREMIUM [${postalCode || city}] - ${name}`
                : `🏠 Lead Toiture à 10€ (ViteUnDevis) [${postalCode || city}] - ${name}`;

            const html = `
                <h1>Nouveau Lead Toiture / Couverture</h1>
                <p><strong>Domaine :</strong> ${domain} (${city} - ${postalCode || 'N/A'})</p>
                
                <div style="background-color: ${arbitrageStatus === 'direct_partner' ? '#fff7ed' : '#f8fafc'}; border: 1.5px solid ${arbitrageStatus === 'direct_partner' ? '#f97316' : '#cbd5e1'}; padding: 16px; border-radius: 12px; margin-bottom: 20px;">
                    <h2 style="margin-top:0; color: ${arbitrageStatus === 'direct_partner' ? '#c2410c' : '#334155'};">
                        Scoring & Routage : ${arbitrageStatus === 'direct_partner' ? '💎 PARTENAIRE DIRECT' : '✉️ REVENDU VITEUNDEVIS'}
                    </h2>
                    <p><strong>Score :</strong> ${leadScore} / 100</p>
                    <p><strong>Statut Arbitrage :</strong> ${arbitrageStatus}</p>
                </div>

                <h2>Informations de contact</h2>
                <ul>
                    <li><strong>Nom :</strong> ${name}</li>
                    <li><strong>Email :</strong> ${email}</li>
                    <li><strong>Téléphone :</strong> ${phone}</li>
                </ul>

                <h2>Critères de Qualification</h2>
                <ul>
                    <li><strong>Projet :</strong> ${projectType}</li>
                    <li><strong>Surface :</strong> ${roofSurface}</li>
                    <li><strong>Statut propriétaire :</strong> ${ownerStatus}</li>
                    <li><strong>Délai :</strong> ${timeline}</li>
                </ul>

                <h2>Attribution Marketing</h2>
                <ul>
                    <li><strong>Source / Medium :</strong> ${attribution?.source || 'direct'} / ${attribution?.medium || 'direct'}</li>
                    ${attribution?.campaign ? `<li><strong>Campagne :</strong> ${attribution.campaign}</li>` : ''}
                    ${attribution?.term ? `<li><strong>Mot-clé recherché :</strong> ${attribution.term}</li>` : ''}
                    ${attribution?.landing_page ? `<li><strong>Page de capture :</strong> ${attribution.landing_page}</li>` : ''}
                </ul>
            `;

            await resend.emails.send({
                from: 'Urgence Couverture <contact@urgencecouverture.com>',
                to: ['hello@urgencecouverture.com'],
                subject,
                html
            });
        }

        const vudDetails = vudResult?.devis_data?.devis_id ? {
            devis_id: vudResult.devis_data.devis_id,
            devis_hash: vudResult.devis_data.devis_hash || ''
        } : null;

        return NextResponse.json({ 
            success: true, 
            score: leadScore, 
            status: arbitrageStatus,
            vud: vudDetails
        });

    } catch (e: any) {
        console.error('API Error:', e);
        return NextResponse.json(
            { error: `Internal Server Error: ${e.message}` },
            { status: 500 }
        );
    }
}
