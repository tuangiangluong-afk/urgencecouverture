import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase-server';
import { Resend } from 'resend';

export async function GET(request: Request) {
    // 0. Security check (Optional: verify secret header)
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createSupabaseAdmin();
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'Resend API Key missing' }, { status: 500 });
    const resend = new Resend(apiKey);

    try {
        // 1. Fetch leads from the last 24h
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        const { data: leads, error: leadsError } = await supabase
            .from('leads')
            .select('*')
            .gte('created_at', yesterday.toISOString())
            .eq('status', 'new');

        if (leadsError) throw leadsError;
        if (!leads || leads.length === 0) {
            return NextResponse.json({ message: 'No new leads today' });
        }

        // 2. Fetch all partners with managed regions
        const { data: partners, error: partnersError } = await supabase
            .from('partners')
            .select('*');

        if (partnersError) throw partnersError;

        const summary = {
            totalLeads: leads.length,
            emailsSent: 0,
            skippedPartners: 0
        };

        // 3. Process per partner
        for (const partner of partners) {
            const partnerRegions = partner.managed_regions || [];
            const partnerDepts = partner.managed_departments || [];
            
            // Filter leads for this partner's regions OR departments
            const relevantLeads = leads.filter(l => 
                partnerRegions.includes(l.region || 'National') || 
                partnerRegions.includes('National') ||
                (l.department && partnerDepts.includes(l.department))
            );

            if (relevantLeads.length > 0 && partner.email) {
                // Send Summary Email
                try {
                    await resend.emails.send({
                        from: 'Urgence Couverture <contact@urgencecouverture.com>',
                        to: [partner.email],
                        subject: `📊 Récapitulatif : ${relevantLeads.length} Nouveaux Leads dans vos régions`,
                        html: `
                            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #334155;">
                                <div style="background-color: #ea580c; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                                    <h1 style="margin: 0; font-size: 20px;">Nouveaux Leads du Jour</h1>
                                    <p style="margin: 5px 0 0; opacity: 0.8;">Voici les opportunités dans vos régions gérées.</p>
                                </div>
                                
                                <div style="padding: 20px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
                                    <p>Bonjour ${partner.name},</p>
                                    <p>Nous avons identifié <strong>${relevantLeads.length} nouveaux prospects</strong> correspondant à vos zones d'intervention depuis hier.</p>
                                    
                                    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                                        <thead style="background-color: #f8fafc;">
                                            <tr>
                                                <th style="text-align: left; padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">Région</th>
                                                <th style="text-align: left; padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">Ville</th>
                                                <th style="text-align: left; padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">Type</th>
                                                <th style="text-align: right; padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${relevantLeads.map(l => `
                                                <tr>
                                                    <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-size: 14px;">
                                                        <span style="background: #fff7ed; color: #ea580c; padding: 2px 6px; rounded: 4px; font-size: 10px; font-weight: bold;">
                                                            ${l.region || 'National'}
                                                        </span>
                                                        ${l.department ? `<div style="font-size: 10px; color: #64748b; margin-top: 4px;">Dép. ${l.department}</div>` : ''}
                                                    </td>
                                                    <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-size: 14px;">${l.city}</td>
                                                    <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-size: 14px;">${l.housing_type || l.type}</td>
                                                    <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; text-align: right;">
                                                        <a href="https://www.urgencecouverture.com/leads/unlock/${l.id}" style="color: #ea580c; font-weight: bold; text-decoration: none; font-size: 12px;">Détails &rarr;</a>
                                                    </td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                    
                                    <div style="margin-top: 30px; padding: 20px; background-color: #fff7ed; border-radius: 8px; text-align: center;">
                                        <p style="margin: 0 0 10px 0; font-size: 14px;">Cliquez sur "Détails" pour débloquer les coordonnées de chaque client.</p>
                                        <a href="https://www.urgencecouverture.com/admin/leads" style="display: inline-block; background-color: #ea580c; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">Voir tous les leads</a>
                                    </div>
                                </div>
                                
                                <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 20px;">
                                    Urgence Couverture - Service Partenaires<br>
                                    Ceci est un e-mail automatique, merci de ne pas y répondre.
                                </p>
                            </div>
                        `
                    });
                    summary.emailsSent++;
                } catch (emailErr) {
                    console.error(`Failed to send daily summary to ${partner.email}`, emailErr);
                }
            } else {
                summary.skippedPartners++;
            }
        }

        return NextResponse.json({ success: true, summary });

    } catch (error: any) {
        console.error('Cron Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
