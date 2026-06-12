import { geminiModel } from "../gemini";

export interface TopicSuggestion {
    topic: string;
    slug: string;
    intent: 'informational' | 'commercial';
    estimated_interest: number; // 0-100
}

export async function findTopics(keywords: string, count: number = 5): Promise<TopicSuggestion[]> {
    const prompt = `
    Définit toi comme un expert SEO spécialisé dans l'infrastructure de recharge pour véhicules électriques.
    
    Tâche : Trouve ${count} sujets d'articles de blog pertinents, à fort potentiel SEO et en longue traîne basés sur ces mots-clés : "${keywords}".
    
    Contraintes :
    - Sujets précis (pas généralistes).
    - Mêle des sujets "guides pratiques" et "comparatifs".
    - Le titre doit être accrocheur.
    
    Retourne UNIQUEMENT un JSON valide (sans markdown) avec cette structure :
    [
      {
        "topic": "Titre optimisé SEO",
        "slug": "titre-optimise-seo-slug",
        "intent": "informational" | "commercial",
        "estimated_interest": 80
      }
    ]
    `;

    try {
        const result = await geminiModel.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // Clean markdown code blocks if present
        const jsonStr = text.replace(/`{3}json/g, "").replace(/`{3}/g, "").trim();

        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Gemini Topic Error:", error);
        return [];
    }
}
