import Link from "next/link";
import { LayoutDashboard, FileText, Activity, MessageCircle, MapPin, Database, Settings, BarChart3, Users, Globe } from "lucide-react";
import { TenantSwitcher } from "@/components/admin/TenantSwitcher";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { AdminClientWrapper } from "@/components/admin/AdminClientWrapper";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 1. Check Auth
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-2xl z-20">
                <div className="p-6 border-b border-white/10">
                    <h1 className="text-xl font-bold tracking-tight">Expert<span className="text-blue-500">Admin</span></h1>
                    <p className="text-xs text-slate-500 mt-1">v2.0 "Empire Manager"</p>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-2 px-2">Pilotage</div>
                    <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition">
                        <LayoutDashboard size={18} />
                        Dashboard
                    </Link>

                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-6 px-2">Contenu (Sites)</div>
                    <Link href="/admin/sites" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition">
                        <Globe size={18} />
                        Sites & Config
                    </Link>
                    <Link href="/admin/pages" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition">
                        <FileText size={18} />
                        Pages & SEO
                    </Link>
                    <Link href="/admin/guides" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition">
                        <Database size={18} />
                        Blog & Guides
                    </Link>

                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-6 px-2">Business</div>
                    <Link href="/admin/leads" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition">
                        <Users size={18} />
                        Leads (Devis)
                    </Link>
                    <Link href="/admin/partners" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition">
                        <Users size={18} />
                        Partenaires
                    </Link>
                    <Link href="/admin/reviews" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition">
                        <MessageCircle size={18} />
                        Avis Clients
                    </Link>

                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-6 px-2">Système</div>
                    <Link href="/admin/analytics" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition">
                        <BarChart3 size={18} />
                        Analytics (GA/GTM)
                    </Link>
                    <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition">
                        <Settings size={18} />
                        Configuration
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/10 bg-slate-950/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                                {user.email?.charAt(0).toUpperCase() || "A"}
                            </div>
                            <div className="overflow-hidden">
                                <div className="text-sm font-medium text-white truncate max-w-[120px]" title={user.email}>{user.email}</div>
                                <div className="text-xs text-slate-500">Super Admin</div>
                            </div>
                        </div>
                        <LogoutButton />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
                {/* Topbar / Workspace Switcher */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-500 font-medium">Site Actif :</span>
                        <TenantSwitcher />
                    </div>
                    <div>
                        <a
                            href="/"
                            target="_blank"
                            className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-lg transition"
                        >
                            <Globe size={16} />
                            Voir le site live
                        </a>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-8">
                    <AdminClientWrapper>
                        {children}
                    </AdminClientWrapper>
                </main>
            </div>
        </div>
    );
}
