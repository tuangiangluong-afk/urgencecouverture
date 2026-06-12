import { stripe } from "@/lib/stripe";
import { deliverUnlockedLead } from "@/app/actions/leads";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as any;
        const { leadId, partnerId } = session.metadata;

        console.log(`Paiement réussi pour le lead ${leadId} par le partenaire ${partnerId}`);

        try {
            await deliverUnlockedLead(leadId, partnerId);
        } catch (err) {
            console.error("Fulfillment Error:", err);
            return NextResponse.json({ error: "Fulfillment Error" }, { status: 500 });
        }
    }

    return NextResponse.json({ received: true });
}
