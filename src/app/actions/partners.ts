"use server";

import { createSupabaseAdmin, createSupabaseServerClient } from "@/lib/supabase-server";
import { Database } from "@/types/database.types";

async function requireAuth() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
    return user;
}

export type Partner = Database['public']['Tables']['partners']['Row'];

export async function getPartners() {
    await requireAuth();
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
        .from("partners")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
}

export async function addPartner(formData: FormData) {
    await requireAuth();
    const supabase = createSupabaseAdmin();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const company = formData.get("company") as string;
    const regionsStr = formData.get("regions") as string;
    const deptsStr = formData.get("departments") as string;
    
    let managed_regions: string[] = [];
    try {
        managed_regions = JSON.parse(regionsStr);
    } catch (e) {
        managed_regions = regionsStr ? regionsStr.split(',').map(r => r.trim()) : [];
    }

    let managed_departments: string[] = [];
    try {
        managed_departments = JSON.parse(deptsStr);
    } catch (e) {
        managed_departments = deptsStr ? deptsStr.split(',').map(d => d.trim()) : [];
    }

    if (!name || !email) throw new Error("Nom et Email obligatoires");

    const { data, error } = await supabase
        .from("partners")
        .insert({
            name,
            email,
            phone,
            company_info: { company_name: company },
            managed_regions,
            managed_departments
        })
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function updatePartner(id: string, updates: Partial<Partner>) {
    await requireAuth();
    const supabase = createSupabaseAdmin();

    const { data, error } = await supabase
        .from("partners")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}
