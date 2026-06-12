import { CITIES } from "../src/lib/db";
import { slugify } from "../src/lib/slugify";

console.log("# TAXIFRANCE CONTENT AUDIT REPORT 🚀\n");
console.log(`Total Domains: ${Object.keys(CITIES).length}\n`);

let totalPages = 0;

Object.values(CITIES).forEach(city => {
    console.log(`## ${city.name} (${city.domain})`);

    // 1. Static Pages
    const staticPages = ["/", "/transport-medical", "/gare-aeroport", "/longue-distance"];

    // 2. Quartiers
    const quartiers = city.neighborhoods?.map(n => `/quartier/${slugify(n)}`) || [];

    // 3. Guides (POIs)
    const guides = [
        ...(city.points_of_interest?.hotels || []),
        ...(city.points_of_interest?.monuments || []),
        ...(city.points_of_interest?.nightlife || [])
    ].map(p => `/guides/${slugify(p)}`);

    // 4. Transport Medical (Hospitals)
    const hospitals = city.hospitals?.map(h => `/transport-medical/${slugify(h)}`) || [];

    const cityPageCount = staticPages.length + quartiers.length + guides.length + hospitals.length;
    totalPages += cityPageCount;

    console.log(`- Total Pages: ${cityPageCount}`);
    console.log(`- Quartiers: ${quartiers.length} (ex: ${quartiers[0] || 'None'})`);
    console.log(`- Guides/POIs: ${guides.length} (ex: ${guides[0] || 'None'})`);
    console.log(`- Hôpitaux: ${hospitals.length} (ex: ${hospitals[0] || 'None'})`);
    console.log(`-----------------------------------`);
});

console.log(`\n\nGRAND TOTAL: ${totalPages} indexed pages ready for Google.\n`);
