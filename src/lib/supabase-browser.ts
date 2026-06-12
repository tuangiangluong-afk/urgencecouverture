"use client";

import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database.types';

// Client-side Supabase client for auth in browser components
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseBrowser = createBrowserClient<Database>(
    supabaseUrl || "https://placeholder.supabase.co",
    supabaseKey || "placeholder-key"
);
