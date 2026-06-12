import { createSupabaseAdmin } from "@/lib/supabase-server";
import PartnersClient from "@/components/admin/PartnersClient";

export const dynamic = "force-dynamic";

export default async function AdminPartnersPage() {
    const supabase = createSupabaseAdmin();
    const { data: partners } = await supabase
        .from("partners")
        .select("*")
        .order("created_at", { ascending: false });

    return <PartnersClient initialPartners={partners || []} />;
}
