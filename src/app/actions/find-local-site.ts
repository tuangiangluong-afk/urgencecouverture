'use server';

import { NATIONAL_TARGETS } from "@/config/national-targets";

export interface LocalMatch {
    found: boolean;
    domain?: string;
    city?: string;
    slug?: string;
    score: number; // For relevance sorting
}

/**
 * Searches for a local site based on user input (Zip or City)
 */
export async function findLocalSite(query: string): Promise<LocalMatch> {
    const cleanQuery = query.toLowerCase().trim().replace(/\s+/g, '');

    if (cleanQuery.length < 2) {
        return { found: false, score: 0 };
    }

    let bestMatch: LocalMatch = { found: false, score: 0 };

    for (const target of NATIONAL_TARGETS) {
        let score = 0;
        const deptCode = target.zip.substring(0, 2);

        // 1. Exact Department or Zip Match
        if (target.zip === cleanQuery || deptCode === cleanQuery) {
            score = 100;
        }
        // 2. Partial Zip Match
        else if (cleanQuery.startsWith(deptCode) && cleanQuery.length >= 2) {
            score = 80;
        }
        // 3. City Name Match (Exact)
        else if (target.name.toLowerCase().replace(/\s+/g, '') === cleanQuery) {
            score = 90;
        }
        // 4. City Name Match (Partial/Contains)
        else if (target.name.toLowerCase().includes(cleanQuery) || cleanQuery.includes(target.name.toLowerCase())) {
            score = 60;
        }
        // 5. Quartiers / Top Places Match
        else if (target.top_places.some(q => q.toLowerCase().includes(cleanQuery))) {
            score = 70;
        }

        if (score > bestMatch.score) {
            bestMatch = {
                found: true,
                slug: target.slug,
                city: target.name,
                score
            };
        }
    }

    return bestMatch;
}
