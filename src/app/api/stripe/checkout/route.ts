import { stripe } from "@/lib/stripe";
import { createSupabaseAdmin } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { leadId, partnerId, partnerEmail } = await req.json();

        if (!leadId || !partnerId) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        const supabase = createSupabaseAdmin();
        
        // 1. Double check Lead exists
        const { data: lead, error: leadError } = await supabase
            .from("leads")
            .select("*")
            .eq("id", leadId)
            .single();

        if (leadError || !lead) {
            return NextResponse.json({ error: "Lead not found" }, { status: 404 });
        }

        // 2. Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: `Lead Client - ${lead.city} (${lead.housing_type})`,
                            description: `Déverrouillage des coordonnées de ${lead.name}`,
                        },
                        unit_amount: (lead.price || 20) * 100, // Stripe expects cents
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${req.nextUrl.origin}/leads/unlock/${leadId}?success=true&partnerId=${partnerId}`,
            cancel_url: `${req.nextUrl.origin}/leads/unlock/${leadId}?canceled=true`,
            customer_email: partnerEmail,
            metadata: {
                leadId,
                partnerId,
                partnerEmail,
                type: "lead_unlock"
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error("Stripe Session Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
