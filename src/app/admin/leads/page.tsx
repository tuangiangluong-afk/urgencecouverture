import { createSupabaseAdmin } from "@/lib/supabase-server";
import LeadsClient from "@/components/admin/LeadsClient";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
    const supabase = createSupabaseAdmin();

    const [leadsResult, partnersResult] = await Promise.all([
        supabase.from("leads").select("*").order("created_at", { ascending: false }),
        supabase.from("partners").select("*").order("name", { ascending: true })
    ]);

    const leads = leadsResult.data || [];
    const partners = partnersResult.data || [];

    return <LeadsClient initialLeads={leads} partners={partners} />;
}
