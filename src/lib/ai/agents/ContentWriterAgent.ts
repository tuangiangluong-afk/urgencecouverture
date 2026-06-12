import { geminiModel } from "../gemini";

export interface AIArticle {
    title: string;
    meta_description: string;
    slug: string;
    content_mdx: string;
}

export async function writeArticle(topic: string, context: string = ""): Promise<AIArticle> {
    const prompt = `
    Tu es un rédacteur expert en SEO et mobilité électrique.
    
    Tâche : Rédige un article complet, approfondi et structuré pour le web sur le sujet : "${topic}".
    ${context ? `Contexte supplémentaire : ${context}` : ""}
    
    Consignes de Qualité :
    - Ton : Expert, rassurant, pédagogique.
    - Structure : Introduction accrocheuse, H2, H3, Listes à puces, Conclusion avec CTA.
    - Format : Markdown (MDX compatible).
    - Impératif : Utilise les "Callouts" pour les points importants ( > [!TIP], > [!WARNING] ).
    - Longueur : Environ 1000 mots.
    
    Retourne UNIQUEMENT un JSON valide avec cette structure :
    {
      "title": "Titre H1 Optimisé",
      "meta_description": "Meta description < 160 caractères",
      "slug": "slug-optimise",
      "content_mdx": "Contenu complet en markdown sans le frontmatter (on l'ajoutera après)"
    }
    `;

    try {
        const result = await geminiModel.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // Clean markdown code blocks if present
        const jsonStr = text.replace(/`{3}json/g, "").replace(/`{3}/g, "").trim();

        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Gemini Writer Error:", error);
        throw new Error("Impossible de générer l'article. L'IA a échoué.");
    }
}
