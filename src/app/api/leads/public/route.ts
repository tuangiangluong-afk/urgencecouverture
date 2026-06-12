import { createSupabaseAdmin } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const partnerId = searchParams.get("partnerId");

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const supabase = createSupabaseAdmin();
    
    // 1. Fetch public info first
    const { data: lead, error } = await supabase
        .from("leads")
        .select("id, city, postal_code, housing_type, type, notes, price, status")
        .eq("id", id)
        .single();

    if (error || !lead) {
        return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // 2. If partnerId is provided, check if they have access AND have paid
    if (partnerId) {
        const { data: assignment } = await supabase
            .from("lead_assignments")
            .select("*")
            .eq("lead_id", id)
            .eq("partner_id", partnerId)
            .eq("status", "paid") // <--- CRITICAL SECURITY FIX: Only return full details if PAID
            .single();

        if (assignment) {
            // Return FULL lead details
            const { data: fullLead } = await supabase
                .from("leads")
                .select("*")
                .eq("id", id)
                .single();
            
            return NextResponse.json({ lead: fullLead, isUnlocked: true });
        }
    }

    return NextResponse.json({ lead, isUnlocked: false });
}
