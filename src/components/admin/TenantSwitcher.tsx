"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, MapPin } from "lucide-react";
import { SITES } from "@/lib/sites-config";
import { slugify } from "@/lib/slugify";
import { useMemo } from "react";

export function TenantSwitcher() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Deduplicate sites logic
    const tenants = useMemo(() => {
        const unique = new Map();
        Object.values(SITES).forEach(site => {
            if (site.slug !== 'home' && site.slug !== 'urgencecouverture.com') {
                unique.set(site.slug, site);
            }
        });
        // Sort by name
        return Array.from(unique.values()).sort((a, b) => a.city.localeCompare(b.city));
    }, []);

    // Default to first city if not found, or 'hub' if selected? 
    // Let's rely on query param. If empty, maybe show 'All' or just first.
    const currentTenantId = searchParams.get("tenantId") || "";

    const handleSwitch = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newTenantId = e.target.value;
        const params = new URLSearchParams(searchParams.toString());
        if (newTenantId) {
            params.set("tenantId", newTenantId);
        } else {
            params.delete("tenantId");
        }
        // Full reload to ensure Admin context refresh if needed, or just router push
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex items-center gap-2">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                    <MapPin size={16} />
                </div>
                <select
                    value={currentTenantId}
                    onChange={handleSwitch}
                    className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-64 pl-10 p-2.5 appearance-none cursor-pointer hover:bg-slate-50 transition shadow-sm"
                >
                    <option value="">-- Vue Globale (Hub) --</option>
                    {tenants.map((tenant) => (
                        <option key={tenant.slug} value={tenant.slug}>
                            {tenant.city} ({tenant.domain})
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                    <ChevronDown size={14} />
                </div>
            </div>
        </div>
    );
}
