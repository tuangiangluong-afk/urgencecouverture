
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { CITIES } from '../src/lib/db';

dotenv.config();

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Must use Service Role for writes
const SERPER_API_KEY = process.env.SERPER_API_KEY; // For Google Search results

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error("❌ Missing Supabase credentials in .env");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function searchGoogle(query: string) {
    // Mock implementation if no key provided
    if (!SERPER_API_KEY) {
        console.log(`[MOCK] Searching Google for: "${query}"`);
        // Return plausible mock data
        return [
            { title: "Lieu Mock 1", address: "10 Rue de la Paix" },
            { title: "Lieu Mock 2", address: "20 Avenue Foch" }
        ];
    }

    // Real implementation (Serper.dev)
    try {
        const response = await fetch('https://google.serper.dev/search', {
            method: 'POST',
            headers: {
                'X-API-KEY': SERPER_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ q: query, num: 3 })
        });
        const data = await response.json();
        return data.organic || [];
    } catch (e) {
        console.error("Search failed:", e);
        return [];
    }
}

async function enrichCity(slug: string, cityName: string) {
    console.log(`\n🔍 Enriching ${cityName} (${slug})...`);

    // 1. Find Hotels
    const hotels = await searchGoogle(`meilleurs hotels à ${cityName}`);
    const hotelNames = hotels.map((h: any) => h.title).slice(0, 3);

    // 2. Find Nightlife / Activities
    const activities = await searchGoogle(`que faire le soir à ${cityName}`);
    const activityNames = activities.map((h: any) => h.title).slice(0, 3);

    if (hotelNames.length === 0 && activityNames.length === 0) {
        console.log("⚠️ No new data found.");
        return;
    }

    console.log(`✅ Found Hotels: ${hotelNames.join(', ')}`);
    console.log(`✅ Found Activities: ${activityNames.join(', ')}`);

    // 3. Update Supabase
    // We append to existing POIs or Replace? Ideally merge.
    // For this script, let's insert into 'pois' table.

    for (const hotel of hotelNames) {
        const { error } = await supabase
            .from('pois')
            .upsert({
                tenant_id: slug,
                name: hotel,
                type: 'hotel',
                address: 'Auto-detected via Google'
            }, { onConflict: 'tenant_id,name' });

        if (error) console.error(`Failed to insert hotel ${hotel}:`, error.message);
    }

    for (const activity of activityNames) {
        const { error } = await supabase
            .from('pois')
            .upsert({
                tenant_id: slug,
                name: activity,
                type: 'nightlife',
                address: 'Auto-detected via Google'
            }, { onConflict: 'tenant_id,name' });

        if (error) console.error(`Failed to insert activity ${activity}:`, error.message);
    }

    console.log(`💾 Saved to Database.`);
}

async function main() {
    console.log("🚀 Starting Content Auto-Pilot...");

    // Iterate over all cities in db.ts
    // In a real cron, maybe do 1 city per day to avoid rate limits
    const updateAll = process.argv.includes('--all');
    const targetCity = process.argv[2];

    const targets = targetCity && !updateAll
        ? [CITIES[targetCity] || Object.values(CITIES).find(c => c.city === targetCity)]
        : Object.values(CITIES);

    for (const city of targets) {
        if (!city) continue;
        await enrichCity(city.slug, city.city);
        // Sleep 2s to be nice
        await new Promise(r => setTimeout(r, 2000));
    }

    console.log("\n✨ Enrichment Complete.");
}

main();
