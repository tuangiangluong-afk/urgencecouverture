import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const GUIDES_PATH = path.join(process.cwd(), 'src/content/guides');

export async function getGuideBySlug(slug: string): Promise<any> {
    const realSlug = slug.replace(/\.mdx$/, '');
    const filePath = path.join(GUIDES_PATH, `${realSlug}.mdx`);

    if (!fs.existsSync(filePath)) {
        return null;
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    return {
        slug: realSlug,
        meta: {
            ...data,
            date: data.publishedAt || data.date || "2026-03-01"
        },
        content: content,
    };
}

export function getAllGuides(): any[] {
    if (!fs.existsSync(GUIDES_PATH)) return [];

    const files = fs.readdirSync(GUIDES_PATH);
    const guides = files.map((file) => {
        const filePath = path.join(GUIDES_PATH, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContent);

        return {
            slug: file.replace(/\.mdx$/, ''),
            title: data.title,
            description: data.description,
            date: data.publishedAt || data.date || "2026-03-01",
            category: data.category || 'Guide',
            readTime: data.readTime || '5 min',
            ...data
        };
    });

    return guides.sort((a: any, b: any) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
}
