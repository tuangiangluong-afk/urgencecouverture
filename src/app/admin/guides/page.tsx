import { createSupabaseAdmin } from "@/lib/supabase-server";
import GuidesClient from "@/components/admin/GuidesClient";

export const dynamic = "force-dynamic";

export default async function AdminGuidesPage() {
    const supabase = createSupabaseAdmin();

    const { data: posts, error } = await supabase
        .from("blog_posts")
        .select("*")
        .contains("tags", ["toiture"])
        .order("published_at", { ascending: false });

    if (error) {
        console.error("Error fetching blog posts:", error);
    }

    return <GuidesClient initialPosts={posts || []} />;
}
