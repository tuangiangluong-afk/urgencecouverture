
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { ArrowLeft, Calendar, Clock, ChevronRight, User, Share2 } from "lucide-react";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { TableOfContents } from "@/components/blog/TableOfContents";
import SimulatorWidget from '@/components/blog/SimulatorWidget';
import LocalLinker from '@/components/blog/LocalLinker';
import { marked } from 'marked';

// Initialize Supabase Client (No specific hook yet in this project structure)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

export const revalidate = 60; // ISR 60 seconds

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    slug: string;
    content: string;
    featured_image_url: string | null;
    author_name?: string;
    author_slug?: string;
    published_at: string;
    updated_at: string;
    category?: { name: string; slug: string };
    seo_title?: string;
    seo_description?: string;
    read_time_minutes?: number;
    tags?: string[];
    faq?: { question: string; answer: string }[];
}

// Fetch single post
async function getPost(slug: string): Promise<BlogPost | null> {
    if (!supabase) {
        console.warn("Supabase client not initialized - returning null post");
        return null;
    }
    const { data, error } = await supabase
        .from('blog_posts')
        .select(`
            *,
            category:blog_categories(name, slug),
            author:blog_authors(name, slug, image_url, role)
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .contains('tags', ['toiture'])
        .single();

    if (error || !data) {
        return null;
    }
    
    // Flatten author data for easier use
    const post: any = { ...data };
    if (data.author) {
        post.author_name = data.author.name;
        post.author_image = data.author.image_url;
        post.author_role = data.author.role;
        post.author_slug = data.author.slug;
    }
    return post;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        return { title: 'Article non trouvé | Urgence Couverture' };
    }

    return {
        title: post.seo_title || `${post.title} | Urgence Couverture`,
        description: post.seo_description || post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: post.featured_image_url ? [post.featured_image_url] : [],
            type: 'article',
            publishedTime: post.published_at,
            modifiedTime: post.updated_at,
            authors: [post.author_name || 'Urgence Couverture'],
        },
    };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    // Process Content for TOC (Basic Regex)
    const headers = post.content.match(/<h2.*?>(.*?)<\/h2>/g)?.map(h => {
        const text = h.replace(/<[^>]+>/g, '');
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return { text, id };
    });

    // Inject IDs (Server Side Hack)
    if (headers) {
        headers.forEach(h => {
             post.content = post.content.replace(`<h2>${h.text}</h2>`, `<h2 id="${h.id}">${h.text}</h2>`);
        });
    }

    const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.seo_title || post.title,
        "description": post.excerpt,
        "image": post.featured_image_url,
        "datePublished": post.published_at,
        "dateModified": post.updated_at,
        "author": {
            "@type": "Person",
            "name": post.author_name || "Urgence Couverture"
        }
    };

    return (
        <main className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-orange-100 selection:text-orange-900 pt-20">
             <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />

            {/* Breadcrumb */}
            <nav className="container mx-auto px-4 py-4 border-b border-neutral-100">
                <ol className="flex items-center space-x-2 text-sm text-neutral-500">
                    <li><Link href="/" className="hover:text-blue-600 transition-colors">Accueil</Link></li>
                    <li><ChevronRight className="w-3 h-3" /></li>
                    <li><Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link></li>
                    <li><ChevronRight className="w-3 h-3" /></li>
                    <li className="text-neutral-900 font-medium truncate max-w-[200px]">{post.title}</li>
                </ol>
            </nav>

            {/* Header */}
            <header className="relative w-full h-[400px] bg-neutral-900 flex items-end">
                {post.featured_image_url && (
                    <Image
                        src={post.featured_image_url}
                        alt={post.title}
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                )}
                <div className="container mx-auto px-4 pb-12 relative z-10">
                   <div className="max-w-4xl">
                        {post.category && (
                            <span className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                                {post.category.name}
                            </span>
                        )}
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            {post.title}
                        </h1>
                        <div className="flex items-center gap-6 text-neutral-200 text-sm font-medium">
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {format(new Date(post.published_at), 'd MMMM yyyy', { locale: fr })}
                            </span>
                             <span className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {post.read_time_minutes || 5} min de lecture
                            </span>
                        </div>
                   </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Article */}
                    <article className="lg:col-span-8">
                         {post.excerpt && (
                            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-10 text-lg font-medium text-blue-900">
                                {post.excerpt}
                            </div>
                        )}

                        <div 
                            className="prose prose-lg prose-neutral max-w-none 
                            prose-headings:font-bold prose-headings:text-neutral-900
                            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                            prose-img:rounded-xl"
                            dangerouslySetInnerHTML={{ __html: marked.parse(post.content) }}
                        />

                        {/* FAQ */}
                        {post.faq && post.faq.length > 0 && (
                            <div className="mt-16 bg-neutral-50 rounded-2xl p-8">
                                <h3 className="text-2xl font-bold mb-6">Questions Fréquentes</h3>
                                <div className="space-y-4">
                                     {post.faq.map((item, index) => (
                                        <details key={index} className="group bg-white rounded-xl border border-neutral-200 overflow-hidden">
                                            <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold hover:text-blue-600">
                                                {item.question}
                                                <ChevronRight className="w-5 h-5 group-open:rotate-90 transition-transform" />
                                            </summary>
                                            <div className="px-4 pb-4 text-neutral-600">
                                                {item.answer}
                                            </div>
                                        </details>
                                     ))}
                                </div>
                            </div>
                        )}
                    </article>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4 space-y-8">
                        {/* Author */}
                        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
                            <h4 className="font-bold text-sm uppercase tracking-wider text-neutral-500 mb-4 flex items-center gap-2">
                                <User className="w-4 h-4" /> Auteur
                            </h4>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold overflow-hidden relative">
                                    {(post.author_name || 'E')[0]}
                                      {/* Verified Badge */}
                                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                        <div className="bg-orange-500 rounded-full w-3 h-3 border-2 border-white"></div>
                                    </div>
                                </div>
                                <div>
                                    <Link href={post.author_slug ? `/author/${post.author_slug}` : "#"} className="font-bold text-neutral-900 hover:text-amber-600 transition-colors">post.author_name || 'Urgence Couverture'</Link>
                                    <p className="text-xs text-neutral-500">Couvreur Qualifié</p>
                                </div>
                            </div>
                        </div>

                         {/* Widgets */}
                         <div className="space-y-8">
                            <SimulatorWidget />
                            <LocalLinker />
                         </div>

                         {/* TOC */}
                         <TableOfContents content={post.content} />

                         {/* CTA */}
                         <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-2xl p-8 text-center shadow-lg">
                            <h4 className="text-xl font-bold mb-2">Devis Gratuit</h4>
                            <p className="text-blue-100 text-sm mb-6">Comparez les prix des couvreurs professionnels près de chez vous.</p>
                            <Link href="/devis" className="inline-block bg-white text-blue-900 px-6 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors w-full">
                                Commencer
                            </Link>
                         </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
