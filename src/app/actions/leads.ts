"use server";

import { createSupabaseAdmin, createSupabaseServerClient } from "@/lib/supabase-server";

async function requireAuth() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
    return user;
}

export async function updateLeadStatus(leadId: string, status: string) {
    await requireAuth();
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
        .from("leads")
        .update({ status })
        .eq("id", leadId)
        .select();

    if (error) {
        console.error("Error updating lead status:", error);
        throw new Error(error.message);
    }

    return data;
}

export async function updateLeadDetails(leadId: string, updates: { notes?: string, price?: number, status?: string, is_paid?: boolean }) {
    await requireAuth();
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
        .from("leads")
        .update(updates)
        .eq("id", leadId)
        .select();

    if (error) {
        console.error("Error updating lead details:", error);
        throw new Error(error.message);
    }

    return data;
}

import { Resend } from 'resend';
import { Database } from "@/types/database.types";

export async function getLeadAssignments(leadId: string) {
    await requireAuth();
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
        .from("lead_assignments")
        .select(`
            *,
            partners (
                name,
                email
            )
        `)
        .eq("lead_id", leadId)
        .order("assigned_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
}

export async function assignLeadToPartners(leadId: string, partnerIds: string[]) {
    await requireAuth();
    const supabase = createSupabaseAdmin();

    // 1. Fetch Lead & Partners
    const [leadResult, partnersResult] = await Promise.all([
        supabase.from("leads").select("*").eq("id", leadId).single(),
        supabase.from("partners").select("*").in("id", partnerIds)
    ]);

    if (leadResult.error) throw new Error("Lead introuvable");
    if (partnersResult.error) throw new Error("Partenaires introuvables");

    const lead = leadResult.data;
    const partners = partnersResult.data;

    const apiKey = process.env.RESEND_API_KEY;
    const resend = apiKey ? new Resend(apiKey) : null;

    const results = [];

    // 2. Loop through partners to assign
    for (const partner of partners) {
        // A. Insert Assignment Record
        const { error: assignError } = await supabase
            .from("lead_assignments")
            .insert({
                lead_id: leadId,
                partner_id: partner.id,
                status: 'sent'
            });

        if (assignError) {
            console.error(`Failed to assign lead ${leadId} to ${partner.name}`, assignError);
            continue;
        }

        // B. Send Email
        if (resend && partner.email) {
            try {
                // Parse existing meta for solar flag
                let meta: any = {};
                try {
                    if (lead.message) meta = JSON.parse(lead.message);
                } catch (e) { }

                await resend.emails.send({
                    from: 'Urgence Couverture <contact@urgencecouverture.com>',
                    to: [partner.email],
                    subject: `🚀 Nouveau Lead Disponible : ${lead.city}`,
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                            <h1 style="color: #ea580c;">Nouveau Projet à Saisir</h1>
                            <p>Bonjour ${partner.name},</p>
                            <p>Un nouveau lead correspondant à votre secteur vient d'être identifié.</p>
                            
                            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0;">
                                <h2 style="margin-top: 0; color: #1e293b;">Détails du Projet</h2>
                                <ul style="list-style: none; padding: 0;">
                                    <li style="margin-bottom: 10px;">📍 <strong>Ville :</strong> ${lead.city} ${lead.postal_code || ''}</li>
                                    <li style="margin-bottom: 10px;">🏠 <strong>Type :</strong> ${lead.housing_type || lead.type}</li>
                                    ${meta.owner_status ? `<li style="margin-bottom: 10px;">🔑 <strong>Statut :</strong> ${meta.owner_status}</li>` : ''}
                                    ${meta.surface_area ? `<li style="margin-bottom: 10px;">📏 <strong>Surface :</strong> ${meta.surface_area}</li>` : ''}
                                    ${meta.urgency_status ? `<li style="margin-bottom: 10px;">🚨 <strong>Urgence :</strong> ${meta.urgency_status}</li>` : ''}
                                </ul>
                            </div>

                            <p style="text-align: center; margin-top: 30px;">
                                <a href="https://urgencecouverture.com/leads/unlock/${lead.id}" 
                                   style="background-color: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                                   DÉBLOQUER LES COORDONNÉES
                                </a>
                            </p>
        
                            <p style="font-size: 14px; color: #64748b; margin-top: 40px; border-top: 1px solid #e2e8f0; pt: 20px;">
                                Une fois le paiement validé, vous recevrez instantanément le nom, l'email et le téléphone du client.
                            </p>
                        </div>
                    `
                });
                results.push({ partner: partner.name, status: 'success' });
            } catch (emailError) {
                console.error(`Failed to send email to ${partner.email}`, emailError);
                results.push({ partner: partner.name, status: 'email_failed' });
            }
        }
    }

    // 3. Update Lead Status (if at least one success)
    if (results.length > 0) {
        await supabase
            .from("leads")
            .update({ status: 'sold' })
            .eq("id", leadId);
    }

    return results;
}

export async function verifyPartnerEmail(email: string) {
    await requireAuth();
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
        .from("partners")
        .select("id, name, email")
        .eq("email", email)
        .single();
    
    if (error || !data) return null;
    return data;
}

export async function deliverUnlockedLead(leadId: string, partnerId: string) {
    await requireAuth();
    const supabase = createSupabaseAdmin();

    // 1. Fetch Lead & Partner
    const [leadRes, partnerRes] = await Promise.all([
        supabase.from("leads").select("*").eq("id", leadId).single(),
        supabase.from("partners").select("*").eq("id", partnerId).single()
    ]);

    if (leadRes.error || !leadRes.data) throw new Error("Lead not found");
    if (partnerRes.error || !partnerRes.data) throw new Error("Partner not found");

    const lead = leadRes.data;
    const partner = partnerRes.data;

    // 2. Mark as sold if not already
    await supabase.from("leads").update({ status: 'sold' }).eq("id", leadId);

    // 3. Record assignment
    await supabase.from("lead_assignments").insert({
        lead_id: leadId,
        partner_id: partnerId,
        status: 'paid'
    });

    // 4. Send Email
    const apiKey = process.env.RESEND_API_KEY;
    const resend = apiKey ? new Resend(apiKey) : null;

    if (resend && partner.email) {
        let meta: any = {};
        try {
            if (lead.message) meta = JSON.parse(lead.message);
        } catch (e) { }

        await resend.emails.send({
            from: 'Urgence Couverture <contact@urgencecouverture.com>',
            to: [partner.email],
            subject: `💰 Lead Débloqué : ${lead.name} (${lead.city})`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background-color: #ea580c; color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
                        <h1 style="margin: 0;">Paiement Confirmé !</h1>
                        <p style="margin: 10px 0 0; opacity: 0.9;">Voici vos coordonnées client</p>
                    </div>
                    
                    <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0; border-top: none;">
                        <h2 style="color: #1e293b; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">👤 Coordonnées Client</h2>
                        <ul style="list-style: none; padding: 0; font-size: 16px;">
                            <li style="margin-bottom: 12px;"><strong>Nom :</strong> ${lead.name}</li>
                            <li style="margin-bottom: 12px;"><strong>Email :</strong> <a href="mailto:${lead.email}" style="color: #ea580c;">${lead.email}</a></li>
                            <li style="margin-bottom: 12px;"><strong>Téléphone :</strong> <a href="tel:${lead.phone}" style="color: #ea580c;">${lead.phone}</a></li>
                            <li style="margin-bottom: 12px;"><strong>Ville :</strong> ${lead.city} ${lead.postal_code || ''}</li>
                        </ul>
                        
                        <h2 style="color: #1e293b; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; margin-top: 30px;">🏠 Détails du Projet</h2>
                        <ul style="list-style: none; padding: 0; font-size: 14px; color: #475569;">
                            <li style="margin-bottom: 8px;"><strong>Type :</strong> ${lead.housing_type || lead.type}</li>
                            ${meta.owner_status ? `<li style="margin-bottom: 8px;"><strong>Statut :</strong> ${meta.owner_status}</li>` : ''}
                            ${meta.surface_area ? `<li style="margin-bottom: 8px;"><strong>Surface :</strong> ${meta.surface_area}</li>` : ''}
                            ${meta.urgency_status ? `<li style="margin-bottom: 8px;"><strong>Urgence :</strong> ${meta.urgency_status}</li>` : ''}
                            ${lead.notes ? `<li style="margin-top: 15px; padding: 10px; background: #f8fafc; border-left: 4px solid #ea580c;"><strong>Note Admin :</strong> ${lead.notes}</li>` : ''}
                        </ul>

                        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f1f5f9; text-align: center; color: #94a3b8; font-size: 12px;">
                            Une facture Stripe a été envoyée à votre adresse email de paiement.
                        </div>
                    </div>
                </div>
            `
        });
    }

    return { success: true };
}
