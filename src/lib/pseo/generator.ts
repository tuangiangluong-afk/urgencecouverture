export type SeoExampleVariables = {
    city: string;
    tenant_name: string;
    phone: string;
    service?: string;
    [key: string]: string | undefined;
};

/**
 * Replaces variables like {{city}} in a template string.
 */
export function replaceVariables(template: string, variables: SeoExampleVariables): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
        return variables[key] || `{{${key}}}`; // Keep original if not found
    });
}

/**
 * Generates a slug from a string, supporting variable substitution first.
 */
export function generateSlug(pattern: string, variables: SeoExampleVariables): string {
    const filled = replaceVariables(pattern, variables);
    return slugify(filled);
}

const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD') // Split accented characters
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

/**
 * Generates the full content structure by replacing variables in all fields.
 */
export function generatePageContent(
    pattern: any,
    variables: SeoExampleVariables
) {
    const h1_title = replaceVariables(pattern.title_template, variables); // Usually H1 matches title
    const meta_title = replaceVariables(pattern.title_template, variables);
    const meta_description = pattern.meta_description_template
        ? replaceVariables(pattern.meta_description_template, variables)
        : undefined;

    // Deep replacement for content_structure (JSON)
    const processedContent = JSON.parse(JSON.stringify(pattern.content_structure || []));

    // Recursive function to replace strings in object
    const replaceInObject = (obj: any) => {
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                obj[key] = replaceVariables(obj[key], variables);
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                replaceInObject(obj[key]);
            }
        }
    };
    replaceInObject(processedContent);

    return {
        h1_title,
        meta_title,
        meta_description,
        content_json: processedContent,
        slug: generateSlug(pattern.slug_pattern, variables),
        variables
    };
}
