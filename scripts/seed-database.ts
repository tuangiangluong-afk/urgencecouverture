
import { createClient } from '@supabase/supabase-js';
import { CITIES } from '../src/lib/db';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log('🌱 Seeding Tenants from db.ts...');

    for (const key of Object.keys(CITIES)) {
        const city = CITIES[key];

        // 1. Upsert Tenant
        const { error: tenantError } = await supabase
            .from('tenants')
            .upsert({
                id: city.slug,
                name: city.name,
                domain: city.domain,
                phone_number: city.phoneNumber,
                email: city.email,
                primary_color: '#facc15', // Default yellow
            }, { onConflict: 'id' });

        if (tenantError) {
            console.error(`❌ Error seeding tenant ${city.name}:`, tenantError);
        } else {
            console.log(`✅ Tenant seeded: ${city.name}`);
        }

        // 2. Seed Initial POIs (flattened)
        if (city.points_of_interest) {
            const pois = [
                ...city.points_of_interest.hotels.map(name => ({ name, type: 'hotel' })),
                ...city.points_of_interest.nightlife.map(name => ({ name, type: 'nightlife' })),
                ...city.points_of_interest.monuments.map(name => ({ name, type: 'monument' }))
            ];

            for (const poi of pois) {
                const slug = poi.name.toLowerCase().replace(/ /g, "-").replace(/[^a-z0-9-]/g, "");

                const { error: poiError } = await supabase
                    .from('pois')
                    .upsert({
                        tenant_id: city.slug,
                        name: poi.name,
                        slug: slug,
                        type: poi.type,
                        parking_difficulty: city.points_of_interest.parking_difficulty // Inherit city default for now
                    }, { onConflict: 'tenant_id, slug' }); // Handling unique constraint manually if needed, or rely on composite constraint
            }
            console.log(`   - Seeded ${pois.length} POIs for ${city.name}`);
        }
    }

    console.log('✨ Seeding complete.');
}

seed();
