import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const articlesDir = '/Users/marc/Downloads/articles expertbornerecharge';

/**
 * Converts raw Claude HTML into clean, prose-compatible HTML.
 * V3 Focus: Strict semantics, no stray divs, perfect tables.
 */
function cleanContent($: cheerio.CheerioAPI): string {
    // Get the body content - try multiple wrapper selectors
    let wrapper = $('.article-wrapper');
    if (wrapper.length === 0) wrapper = $('.aw');
    if (wrapper.length === 0) wrapper = $('body'); // fallback

    // ============================
    // STEP 1: REMOVE STRUCTURAL ELEMENTS
    // ============================
    wrapper.find('nav.breadcrumb, .bc, nav.bc').remove();
    wrapper.find('.article-meta, .am').remove();
    wrapper.find('.article-hero, .ah').remove();
    wrapper.find('nav.toc, .toc').remove();
    wrapper.find('.faq, .faq-item, .fi').remove();
    wrapper.find('h2').each((_, el) => {
        const text = $(el).text().trim().toLowerCase();
        if (text.includes('faq')) $(el).remove();
    });
    wrapper.find('.author-box, .ab').remove();
    wrapper.find('.cta-inline, .ci').remove();

    // ============================
    // STEP 2: CONVERT CUSTOM COMPONENTS
    // ============================

    // Summary Box → blockquote
    wrapper.find('.summary-box, .sb').each((_, el) => {
        const $el = $(el);
        const strongEl = $el.find('strong').first();
        const title = strongEl.text();
        strongEl.remove();
        $el.replaceWith(`<blockquote><strong>${title}</strong><p>${$el.text().trim()}</p></blockquote>`);
    });

    // Alert boxes → blockquotes
    wrapper.find('.alert, .al, .at, .aw2, .ad, .ain').each((_, el) => {
        const $el = $(el);
        const classes = $el.attr('class') || '';
        let emoji = '💡';
        if (classes.includes('alert-tip') || classes.includes(' at') || classes === 'at') emoji = '✅';
        if (classes.includes('alert-warning') || classes.includes('aw2')) emoji = '⚠️';
        if (classes.includes('alert-danger') || classes.includes(' ad') || classes === 'ad') emoji = '🚨';
        if (classes.includes('alert-info') || classes.includes('ain')) emoji = '💡';

        const titleText = $el.find('.alert-content strong, .ac strong').first().text();
        const bodyText = $el.find('.alert-content p, .ac p').first().text() || $el.text().replace(titleText, '').trim();

        $el.replaceWith(`<blockquote><strong>${emoji} ${titleText}</strong><p>${bodyText}</p></blockquote>`);
    });

    // Steps → ordered list
    wrapper.find('.steps, .st').each((_, el) => {
        const $el = $(el);
        const items: string[] = [];
        $el.find('.step, .sp').each((_, step) => {
            const $step = $(step);
            const title = $step.find('.step-content strong, .sc strong').text();
            const desc = $step.find('.step-content p, .sc p').text();
            items.push(`<li><strong>${title}</strong> ${desc}</li>`);
        });
        $el.replaceWith(`<ol>${items.join('\n')}</ol>`);
    });

    // Price Grids & Score Grids → tables
    wrapper.find('.price-grid, .sg, .score-grid').each((_, el) => {
        const $el = $(el);
        const rows: string[] = [];
        $el.find('.price-card, .sk, .score-card').each((_, card) => {
            const $card = $(card);
            const label = $card.find('.label, .sl, .sc-label, .sc-name').text();
            const amount = $card.find('.amount, .sv, .sc-val').text();
            const desc = $card.find('.sub, .sn2').text();
            rows.push(`<tr><td><strong>${label}</strong></td><td><strong>${amount}</strong></td><td>${desc}</td></tr>`);
        });
        $el.replaceWith(`<table><thead><tr><th>Détail</th><th>Valeur</th><th>Note</th></tr></thead><tbody>${rows.join('\n')}</tbody></table>`);
    });

    // Checklists → bullet list
    wrapper.find('.checklist, .ck').each((_, el) => {
        const $el = $(el);
        const items: string[] = [];
        $el.find('li').each((_, li) => {
            items.push(`<li>${$(li).text().trim()}</li>`);
        });
        $el.replaceWith(`<ul>${items.join('\n')}</ul>`);
    });

    // ============================
    // STEP 3: UNWRAP EVERYTHING & STRIP CLASSES
    // ============================

    // Unwrap table wrappers
    wrapper.find('.table-wrap, .tw').each((_, el) => {
        const $el = $(el);
        const table = $el.find('table').first();
        if (table.length) $el.replaceWith(table);
        else $el.replaceWith($el.html() || '');
    });

    // Remove all classes, styles, and IDs
    wrapper.find('*').each((_, el) => {
        $(el).removeAttr('class');
        $(el).removeAttr('style');
        // keep id only for headings if needed, but let's strip for now to be clean
        $(el).removeAttr('id'); 
    });

    // ============================
    // STEP 4: FINAL CLEANUP OF PROSE-BLOCKING DIVS
    // ============================
    // Recursively unwrap divs that only contain one child or are just generic wrappers
    let html = wrapper.html() || '';
    
    // Convert stray divs to p tags if they contain text
    const $clean = cheerio.load(html);
    $clean('div').each((_, el) => {
        const $el = $clean(el);
        const inner = $el.html() || '';
        if (!inner.includes('<p>') && !inner.includes('<h2>') && !inner.includes('<table>')) {
            $el.replaceWith(`<p>${$el.text().trim()}</p>`);
        } else {
             $el.replaceWith(inner); // Unwrap
        }
    });

    // Final string cleanup
    html = $clean.html() || '';
    html = html.replace(/<p>\s*<\/p>/g, ''); // Remove empty p
    
    // Add vertical spacing between blocks for extra safety (though prose handles it)
    html = html.replace(/<\/h2>/g, '</h2>\n');
    html = html.replace(/<\/p>/g, '</p>\n');
    html = html.replace(/<\/table>/g, '</table>\n');

    return html.trim();
}

async function main() {
    console.log("Starting REVISED import (v3 — semantic strictness)...");
    const files = fs.readdirSync(articlesDir)
        .filter(f => f.endsWith('.html'))
        .sort((a, b) => {
            const numA = parseInt(a.split('-')[0]) || 0;
            const numB = parseInt(b.split('-')[0]) || 0;
            return numA - numB;
        });

    const { data: catData } = await supabase.from('blog_categories').select('id').eq('slug', 'guides-pratiques').single();
    const categoryId = catData?.id;

    let currentDate = new Date('2026-01-01T10:00:00Z');
    let successCount = 0;

    for (const file of files) {
        process.stdout.write(`Processing ${file}... `);
        const filePath = path.join(articlesDir, file);
        const rawHtml = fs.readFileSync(filePath, 'utf-8');
        const $ = cheerio.load(rawHtml);

        const seoTitle = $('title').text() || '';
        const seoDescription = $('meta[name="description"]').attr('content') || '';
        const excerpt = $('p.hero-sub').text() || $('p.sub').text() || seoDescription;
        const title = $('h1').first().text() || seoTitle.split('|')[0].trim();

        let faq: any[] = [];
        $('script[type="application/ld+json"]').each((_, el) => {
            try {
                const data = JSON.parse($(el).html() || '{}');
                const graph = data['@graph'] || (Array.isArray(data) ? data : [data]);
                for (const item of graph) {
                    if (item['@type'] === 'FAQPage' && item.mainEntity) {
                        faq = item.mainEntity.map((q: any) => ({ question: q.name, answer: q.acceptedAnswer?.text || '' }));
                    }
                }
            } catch (e) { }
        });

        const content = cleanContent($);
        const slug = file.replace(/^\d+-/, '').replace(/\.html$/, '');
        const wordCount = content.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
        const readTime = Math.max(3, Math.ceil(wordCount / 200));

        const postData = {
            title, slug, excerpt, seo_title: seoTitle, seo_description: seoDescription,
            content, status: 'published', published_at: currentDate.toISOString(),
            updated_at: currentDate.toISOString(), read_time_minutes: readTime, category_id: categoryId,
            faq: faq.length > 0 ? faq : null
        };

        const { error } = await supabase.from('blog_posts').upsert(postData, { onConflict: 'slug' });
        if (error) console.error(`Error:`, error.message);
        else {
            console.log(`OK (slug: ${slug})`);
            successCount++;
        }
        currentDate.setDate(currentDate.getDate() + 2);
    }
    console.log(`\nImport v3 complete! ${successCount}/50 articles imported.`);
}

main().catch(console.error);
