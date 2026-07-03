import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import Image from "next/image";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

export const revalidate = 3600; // ISR cache for 1 hour

function formatDate(dateStr: string) {
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    } catch (e) {
        return dateStr;
    }
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string; locale?: string }> }) {
    const { slug, locale } = await params;
    if (!supabase) {
        return <div className="p-8 text-center text-red-500">Configuration Supabase manquante</div>;
    }

    // 1. Fetch Author
    const { data: author } = await supabase
        .from("blog_authors")
        .select("*")
        .eq("slug", slug)
        .single();

    if (!author) {
        notFound();
    }

    // 2. Fetch Author's Posts
    const { data: posts } = await supabase
        .from("blog_posts")
        .select("*, category:blog_categories(name)")
        .eq("author_id", author.id)
        .eq("status", "published")
        .order("published_at", { ascending: false });

    const blogPath = locale ? `/${locale}/blog` : "/blog";

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": author.name,
        "jobTitle": author.role || "Expert Habitat",
        "description": author.description,
        "image": author.image_url ? `https://${author.slug}.com${author.image_url}` : undefined,
        "url": `https://${author.slug}.com/author/${author.slug}`,
        "worksFor": {
            "@type": "Organization",
            "name": "Expert"
        }
    };

    return (
        <main className="min-h-screen bg-stone-50 text-neutral-900 pb-20 pt-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="max-w-4xl mx-auto px-4">
                {/* Back Link */}
                <Link href={blogPath} className="inline-flex items-center text-stone-500 hover:text-amber-600 mb-8 transition-colors text-sm font-semibold">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Retour au Blog
                </Link>

                {/* Author Card */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-200 flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
                    <div className="relative w-28 h-28 rounded-full overflow-hidden shrink-0 border-2 border-amber-500 bg-neutral-100">
                        {author.image_url ? (
                            <Image
                                src={author.image_url}
                                alt={author.name}
                                fill
                                className="object-cover"
                                sizes="112px"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-amber-600 bg-amber-50">
                                {author.name[0]}
                            </div>
                        )}
                    </div>
                    
                    <div className="text-center md:text-left flex-1">
                        <div className="flex flex-col md:flex-row items-center md:items-baseline gap-3 mb-2 justify-center md:justify-start">
                            <h1 className="text-3xl font-extrabold text-neutral-900">{author.name}</h1>
                            <span className="bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 border border-blue-200">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                Vérifié
                            </span>
                        </div>
                        
                        {author.role && (
                            <p className="text-amber-600 font-bold text-base mb-4">{author.role}</p>
                        )}
                        
                        {author.description && (
                            <p className="text-neutral-600 leading-relaxed mb-6 text-sm">
                                {author.description}
                            </p>
                        )}

                        <div className="space-y-2 border-t border-neutral-100 pt-4 text-xs text-neutral-500">
                            {author.obsession && (
                                <p><strong>Obsession :</strong> "{author.obsession}"</p>
                            )}
                            {author.signature && (
                                <p><strong>Signature :</strong> "{author.signature}"</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Articles List */}
                <div className="border-t border-neutral-200 pt-10">
                    <h2 className="text-xl font-bold text-neutral-900 mb-8 flex items-center gap-2">
                        Articles publiés par {author.name} ({posts?.length || 0})
                    </h2>
                    
                    {posts && posts.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-6">
                            {posts.map((post: any) => (
                                <Link href={`/blog/${post.slug}`} key={post.id} className="group bg-white rounded-2xl p-6 border border-neutral-200 hover:shadow-md transition-all flex flex-col h-full">
                                    <div className="flex items-center justify-between text-xs font-semibold text-neutral-400 mb-3">
                                        <span className="text-amber-600 uppercase tracking-wider">{post.category?.name || "Expertise"}</span>
                                        <span>{post.published_at ? formatDate(post.published_at) : "Récemment"}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-neutral-900 mb-3 group-hover:text-amber-600 transition-colors line-clamp-2 leading-tight">
                                        {post.title}
                                    </h3>
                                    <p className="text-neutral-500 text-sm line-clamp-2 mb-4 flex-grow">
                                        {post.excerpt}
                                    </p>
                                    <span className="text-amber-600 text-xs font-bold flex items-center gap-1 mt-auto">
                                        Lire l'article
                                        <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-neutral-50 rounded-2xl border border-neutral-200 border-dashed text-neutral-500 text-sm">
                            Aucun article publié par cet auteur pour le moment.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
