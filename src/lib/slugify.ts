/**
 * Converts a string to a URL-friendly slug
 * Handles French accented characters properly
 * Example: "Hôtel Renaissance" → "hotel-renaissance"
 */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD") // Decompose accents (é → e + ́)
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
        .replace(/[^a-z0-9\s-]/g, "") // Remove special chars except spaces/hyphens
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with single
        .replace(/^-|-$/g, ""); // Trim leading/trailing hyphens
}
