"use client";

import { supabaseBrowser } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await supabaseBrowser.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    return (
        <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-white transition p-2 hover:bg-white/10 rounded-full"
            title="Se déconnecter"
        >
            <LogOut size={18} />
        </button>
    );
}
