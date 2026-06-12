
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import { Calendar, ArrowRight } from "lucide-react";

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

export const revalidate = 60;

async function getPosts() {
    if (!supabase) {
        console.warn("Supabase client not initialized - returning empty posts");
        return [];
    }
    const { data } = await supabase
        .from('blog_posts')
        .select('*, category:blog_categories(*)')
        .eq('status', 'published')
        .contains('tags', ['toiture'])
        .order('published_at', { ascending: false });
    return data || [];
}

export default async function BlogIndex() {
    const posts = await getPosts();

    return (
        <main className="min-h-screen bg-stone-50 py-24">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
                        Le Blog de la Toiture & Couverture
                    </h1>
                    <p className="text-xl text-neutral-600">
                        Guides, actualités et conseils d'experts pour réussir l'entretien et la rénovation de votre toiture.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post: any) => (
                        <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-100 h-full">
                             <div className="relative h-56 w-full overflow-hidden">
                                {post.featured_image_url ? (
                                    <Image
                                        src={post.featured_image_url}
                                        alt={post.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-orange-600 to-orange-400" />
                                )}
                                {post.category && (
                                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-orange-900 text-xs font-bold px-3 py-1 rounded-full border border-orange-100">
                                        {post.category.name}
                                    </span>
                                )}
                             </div>
                             <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center gap-2 text-xs font-semibold text-orange-600 mb-3 uppercase tracking-wider">
                                     <Calendar className="w-3 h-3" />
                                     {new Date(post.published_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                                <h2 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
                                    {post.title}
                                </h2>
                                <p className="text-neutral-500 text-sm line-clamp-3 mb-6 flex-grow">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center text-orange-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                                    Lire l'article <ArrowRight className="w-4 h-4 ml-1" />
                                </div>
                             </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
