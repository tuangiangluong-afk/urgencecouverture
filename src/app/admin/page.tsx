import { createSupabaseAdmin } from "@/lib/supabase-server";
import DashboardClient from "@/components/admin/DashboardClient";
import { SITES } from "@/lib/sites-config";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
    // 1. Fetch Real Data (Service Role - Bypass RLS)
    const supabase = createSupabaseAdmin();
    const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

    // 2. Calculate Stats
    const activeSites = Object.keys(SITES).filter(k => !k.startsWith('www') && !k.startsWith('home')).length;

    return (
        <DashboardClient
            initialLeads={leads || []}
            siteCount={activeSites}
        />
    );
}
