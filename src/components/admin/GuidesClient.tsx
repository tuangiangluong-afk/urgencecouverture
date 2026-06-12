"use client";

import { useState, useEffect } from "react";
import { Database, Eye, Edit, Trash2, Loader2, Sparkles, X, Save, RefreshCw, Bot, Play, Settings, Newspaper, Image as ImageIcon, EyeOff, Upload } from "lucide-react";
import { Modal, Button, Label, Textarea } from "./AdminUI";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/components/admin/Toast";
import { supabaseBrowser } from "@/lib/supabase-browser";

interface BlogPost {
    id: string;

    title: string;
    slug: string;
    status: string;
    published_at: string | null;
    excerpt: string | null;
    content: string | null;
    featured_image_url: string | null;
    category?: { name: string };
    created_at: string;
}

interface BlogIdea {
    id: string;
    title: string;
    slug: string;
    angle: string;
    rationale: string;
    status: 'new' | 'approved' | 'rejected' | 'converted' | 'dismissed';
}

interface BlogTrend {
    id: string;
    title: string;
    source: string;
    url: string;
    published_date: string;
    is_processed: boolean;
}

interface AutomationSettings {
    id: string;
    is_active: boolean;
    frequency: string;
    articles_per_run: number;
    auto_publish: boolean;
    last_run: string | null;
}

export default function GuidesClient({ initialPosts }: { initialPosts: BlogPost[] }) {
    // const searchParams = useSearchParams();
    // const currentTenantId = searchParams.get("tenantId"); // Unused for now

    // -- TABS STATE --
    const [activeTab, setActiveTab] = useState<'articles' | 'ideation' | 'settings'>('articles');

    // -- DATA STATE --
    const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
    const [ideas, setIdeas] = useState<BlogIdea[]>([]);
    const [trends, setTrends] = useState<BlogTrend[]>([]);
    const [settings, setSettings] = useState<AutomationSettings | null>(null);

    // -- UI STATE --
    const [isGenerating, setIsGenerating] = useState(false);
    const { showToast } = useToast();
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Initial Fetch for other tabs
    useEffect(() => {
        if (activeTab === 'ideation') {
            fetchIdeas();
            fetchTrends();
        } else if (activeTab === 'settings') {
            fetchSettings();
        }
    }, [activeTab]);

    async function refetchPosts() {
        const { data } = await supabaseBrowser
            .from("blog_posts")
            .select("*, category:blog_categories(name)")
            .contains("tags", ["toiture"])
            .order("created_at", { ascending: false });
        if (data) setPosts(data as unknown as BlogPost[]);
    }

    async function fetchIdeas() {
        // Correct type casting or query
        const { data } = await supabaseBrowser.from("blog_ideas").select("*").eq("status", "new").order("created_at", { ascending: false });
        if (data) setIdeas(data as unknown as BlogIdea[]); // Explicit cast to avoid type errors if DB schema mismatch
    }

    async function fetchTrends() {
        const { data } = await supabaseBrowser.from("blog_trends").select("*").order("published_date", { ascending: false }).limit(20);
        if (data) setTrends(data as unknown as BlogTrend[]);
    }

    async function fetchSettings() {
        const { data } = await supabaseBrowser.from("automation_settings").select("*").single();
        if (data) setSettings(data as unknown as AutomationSettings);
    }

    // -- ACTIONS --

    // 1. Articles Tab Actions
    async function handleStatusChange(id: string, newStatus: string) {
        const { error } = await supabaseBrowser.from("blog_posts").update({ status: newStatus }).eq("id", id);
        if (error) showToast("Erreur: " + error.message, "error");
        else {
            setPosts(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
            showToast("Statut mis à jour", "success");
        }
    }

    async function handleSaveEdit() {
        if (!editingPost) return;
        setIsSaving(true);
        const { error } = await supabaseBrowser.from("blog_posts").update({
            title: editingPost.title,
            slug: editingPost.slug,
            excerpt: editingPost.excerpt,
            content: editingPost.content,
            status: editingPost.status
        }).eq("id", editingPost.id);

        if (error) showToast("Erreur: " + error.message, "error");
        else {
            setPosts(prev => prev.map(p => p.id === editingPost.id ? editingPost : p));
            showToast("Article enregistré !", "success");
            setEditingPost(null);
        }
        setIsSaving(false);
    }

    async function handleDeletePost(id: string) {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) return;
        const { error } = await supabaseBrowser.from("blog_posts").delete().eq("id", id);
        if (error) showToast("Erreur suppression: " + error.message, "error");
        else {
            setPosts(prev => prev.filter(p => p.id !== id));
            showToast("Article supprimé", "success");
        }
    }

    // 2. Ideation Tab Actions
    async function handleFetchTrends() {
        setIsGenerating(true);
        try {
            const { error } = await supabaseBrowser.functions.invoke("generate-blog-content", {
                body: { action: "fetch_trends" }
            });
            if (error) throw error;
            showToast("Tendances mises à jour !", "success");
            fetchTrends();
        } catch (e: any) {
            showToast("Erreur Trends: " + e.message, "error");
        } finally {
            setIsGenerating(false);
        }
    }

    async function handleGenerateIdeas() {
        setIsGenerating(true);
        try {
            const { data, error } = await supabaseBrowser.functions.invoke("generate-blog-content", {
                body: { action: "generate_ideas" }
            });
            if (error) throw error;

            const ideasToInsert = Array.isArray(data) ? data.map((idea: any) => ({
                title: idea.title,
                slug: idea.slug,
                angle: idea.angle,
                rationale: idea.rationale,
                status: 'new'
            })) : [];

             if (ideasToInsert.length > 0) {
                const { error: dbError } = await supabaseBrowser.from('blog_ideas').insert(ideasToInsert);
                if (dbError) throw dbError;
                showToast(`${ideasToInsert.length} idées générées !`, "success");
                fetchIdeas();
            } else {
                 showToast("Aucune idée générée (format réponse inattendu)", "error");
            }
        } catch (e: any) {
            showToast("Erreur Idées: " + e.message, "error");
        } finally {
            setIsGenerating(false);
        }
    }

    async function handleWriteArticle(idea: BlogIdea) {
        setIsGenerating(true);
        showToast("Rédaction en cours... (patientez ~30s)", "info");
        try {
            const { data, error } = await supabaseBrowser.functions.invoke("generate-blog-content", {
                body: { action: "write_article", payload: idea }
            });
            if (error) throw error;

            // Insert Draft
            const { error: dbError } = await supabaseBrowser.from('blog_posts').insert({
                title: idea.title,
                slug: idea.slug,
                content: data.content,
                excerpt: data.excerpt,
                seo_title: data.seo_title,
                seo_description: data.seo_description,
                status: 'draft',
                tags: ['toiture']
            });

            if (dbError) throw dbError;

            // Mark Idea Converted
            await supabaseBrowser.from('blog_ideas').update({ status: 'converted' }).eq('id', idea.id);

            showToast("Article rédigé et ajouté aux brouillons !", "success");
            fetchIdeas();
        } catch (e: any) {
            showToast("Erreur Rédaction: " + e.message, "error");
        } finally {
            setIsGenerating(false);
        }
    }

    async function handleDismissIdea(id: string) {
        await supabaseBrowser.from('blog_ideas').update({ status: 'dismissed' }).eq('id', id);
        fetchIdeas();
    }

    // 3. Settings Tab Actions
    async function handleSaveSettings(updates: Partial<AutomationSettings>) {
        if (!settings) return;
        const { error } = await supabaseBrowser.from('automation_settings').update(updates).eq('id', settings.id);
        if (error) showToast("Erreur sauvegarde", "error");
        else {
            setSettings({ ...settings, ...updates });
            showToast("Paramètres sauvegardés", "success");
        }
    }

    async function handleTriggerAutomation() {
        setIsGenerating(true);
        showToast("Cycle d'automatisation lancé...", "info");
        try {
             // Now that we added run_automation_cycle, let's try calling it.
             const { error } = await supabaseBrowser.functions.invoke("generate-blog-content", {
                body: { action: "run_automation_cycle", payload: {} } 
            });
            if(error) throw error;
            showToast("Cycle terminé avec succès (Idées générées)", "success");
            fetchIdeas(); // Update ideas
            refetchPosts(); // Update posts if any were created
        } catch (e: any) {
            showToast("Erreur Auto: " + e.message, "error");
        } finally {
            setIsGenerating(false);
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published': return 'bg-green-100 text-green-700 border border-green-200';
            case 'draft': return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
            case 'archived': return 'bg-slate-100 text-slate-700 border border-slate-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    // Image Regen State
    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [imageInstructions, setImageInstructions] = useState("");
    const [articleToRewrite, setArticleToRewrite] = useState<BlogPost | null>(null);

    const openImageDialog = (post: BlogPost) => {
        setArticleToRewrite(post);
        setImageInstructions("");
        setImageDialogOpen(true);
    };

    const handleConfirmImageRegen = async () => {
        if (!articleToRewrite) return;
        setImageDialogOpen(false);
        setIsGenerating(true);
        // showToast(`Génération de l'image pour "${articleToRewrite.title}"...`, "info");

        try {
            const response = await supabaseBrowser.functions.invoke('generate-blog-content', {
                body: {
                    action: 'regenerate_image',
                    payload: {
                        slug: articleToRewrite.slug,
                        title: articleToRewrite.title,
                        excerpt: articleToRewrite.excerpt,
                        custom_instructions: imageInstructions
                    }
                }
            });

            if (response.error) throw response.error;

            showToast("Image mise à jour avec succès !", "success");
            refetchPosts();
        } catch (error: any) {
            console.error(error);
            showToast("Erreur Image: " + (error.message || "Échec"), "error");
        } finally {
            setIsGenerating(false);
            setArticleToRewrite(null);
        }
    };

    const [rewriteDialogOpen, setRewriteDialogOpen] = useState(false);
    const [rewriteInstructions, setRewriteInstructions] = useState("");

    const openRewriteDialog = (post: BlogPost) => {
        setArticleToRewrite(post);
        setRewriteInstructions("");
        setRewriteDialogOpen(true);
    };

    const handleConfirmRewrite = async () => {
        if (!articleToRewrite) return;
        setRewriteDialogOpen(false);
        setIsGenerating(true);
        // showToast(`Réécriture de "${articleToRewrite.title}" en cours...`, "info");

        try {
            const { data: fullArticle } = await supabaseBrowser.from('blog_posts').select('content').eq('id', articleToRewrite.id).single();

            const response = await supabaseBrowser.functions.invoke('generate-blog-content', {
                body: {
                    action: 'rewrite_article_content',
                    payload: {
                        slug: articleToRewrite.slug,
                        title: articleToRewrite.title,
                        current_content: fullArticle?.content || "",
                        custom_instructions: rewriteInstructions
                    }
                }
            });

            if (response.error) throw response.error;

            showToast("Succès ! L'article a été réécrit.", "success");
            refetchPosts();
        } catch (error: any) {
            console.error(error);
            showToast("Erreur Agent: " + (error.message || "Échec"), "error");
        } finally {
            setIsGenerating(false);
            setArticleToRewrite(null);
        }
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Database className="text-blue-600" />
                        Blog & Guides SEO
                    </h1>
                    <p className="text-slate-500">
                        Gestion complète du content marketing
                    </p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-4 mb-6 border-b border-slate-200">
                <button 
                    onClick={() => setActiveTab('articles')}
                    className={`pb-3 px-2 font-medium text-sm flex items-center gap-2 border-b-2 transition ${activeTab === 'articles' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <Database size={16} />
                    Articles ({posts.length})
                </button>
                <button 
                    onClick={() => setActiveTab('ideation')}
                    className={`pb-3 px-2 font-medium text-sm flex items-center gap-2 border-b-2 transition ${activeTab === 'ideation' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <Sparkles size={16} />
                    Idéation & Tendances
                </button>
                <button 
                    onClick={() => setActiveTab('settings')}
                    className={`pb-3 px-2 font-medium text-sm flex items-center gap-2 border-b-2 transition ${activeTab === 'settings' ? 'border-slate-800 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <Settings size={16} />
                    Réglages
                </button>
            </div>

            {/* TAB: ARTICLES */}
            {activeTab === 'articles' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase">Date</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase">Statut</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase">Titre</th>
                                   
                                    <th className="text-right px-6 py-3 text-xs font-bold text-slate-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {posts.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                                            Aucun article trouvé. Allez dans l&apos;onglet &quot;Idéation&quot; pour en créer !
                                        </td>
                                    </tr>
                                ) : posts.map((post) => (
                                    <tr key={post.id} className="hover:bg-slate-50 transition group">
                                        <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                                            {format(new Date(post.created_at), "dd MMM yyyy", { locale: fr })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={post.status}
                                                onChange={(e) => handleStatusChange(post.id, e.target.value)}
                                                className={`text-xs font-bold px-2 py-1 rounded-full border-0 cursor-pointer focus:ring-2 focus:ring-blue-500 ${getStatusColor(post.status)}`}
                                            >
                                                <option value="draft">Brouillon</option>
                                                <option value="published">Publié</option>
                                                <option value="archived">Archivé</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 max-w-md">
                                            <div className="font-bold text-slate-900 truncate" title={post.title}>{post.title}</div>
                                            <div className="text-xs text-slate-400 truncate">/guides/{post.slug}</div>
                                        </td>
                                        
                                        <td className="px-6 py-4 text-right space-x-2 flex justify-end">
                                            <button 
                                                onClick={() => setEditingPost(post)}
                                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                                                title="Éditer"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <a 
                                                href={`/guides/${post.slug}`} 
                                                target="_blank"
                                                className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition inline-block"
                                                title="Voir"
                                            >
                                                <Eye size={18} />
                                            </a>
                                            <button
                                                onClick={() => openImageDialog(post)}
                                                className="p-1.5 text-slate-400 hover:text-pink-600 hover:bg-pink-50 rounded transition"
                                                title="Régénérer l'Image (IA)"
                                            >
                                                <ImageIcon size={18} />
                                            </button>
                                            <button
                                                onClick={() => openRewriteDialog(post)}
                                                className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded transition"
                                                title="Réécrire avec IA (Gold Standard)"
                                            >
                                                <Sparkles size={18} />
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    const newStatus = post.status === 'published' ? 'draft' : 'published';
                                                    const { error } = await supabaseBrowser.from('blog_posts').update({ status: newStatus }).eq('id', post.id);
                                                    if (error) {
                                                        showToast("Erreur de mise à jour", "error");
                                                    } else {
                                                        showToast(newStatus === 'published' ? "Article publié !" : "Article passé en brouillon", "success");
                                                        refetchPosts();
                                                    }
                                                }}
                                                title={post.status === 'published' ? "Passer en brouillon" : "Publier"}
                                                className={`p-1.5 rounded transition ${post.status === 'published' ? "text-orange-500 hover:text-orange-600 hover:bg-orange-50" : "text-green-600 hover:text-green-700 hover:bg-green-50"}`}
                                            >
                                                {post.status === 'published' ? <EyeOff size={18} /> : <Upload size={18} />}
                                            </button>
                                            <button 
                                                onClick={() => handleDeletePost(post.id)}
                                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                                                title="Supprimer"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Image Regen Modal */}
            <Modal 
                isOpen={imageDialogOpen} 
                onClose={() => setImageDialogOpen(false)}
                title={`Régénérer l&apos;Image : ${articleToRewrite?.title}`}
                description="L&apos;IA va créer une nouvelle image illustrative basée sur vos instructions."
                footer={
                    <>
                        <Button variant="outline" onClick={() => setImageDialogOpen(false)}>Annuler</Button>
                        <Button 
                            onClick={handleConfirmImageRegen} 
                            variant="primary"
                            isLoading={isGenerating}
                            leftIcon={<ImageIcon size={18} />}
                            className="bg-pink-600 hover:bg-pink-700"
                        >
                            Générer Nouvelle Image
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Directives pour l'Image</Label>
                        <Textarea
                            placeholder="Ex: Artisan couvreur en train de réparer une toiture..."
                            value={imageInstructions}
                            onChange={(e) => setImageInstructions(e.target.value)}
                        />
                    </div>
                </div>
            </Modal>

            {/* Rewrite Modal */}
            <Modal 
                isOpen={rewriteDialogOpen} 
                onClose={() => setRewriteDialogOpen(false)}
                title={`Deep Rewrite : ${articleToRewrite?.title}`}
                description="L&apos;agent va critiquer et réécrire cet article."
                footer={
                    <>
                        <Button variant="outline" onClick={() => setRewriteDialogOpen(false)}>Annuler</Button>
                        <Button 
                            onClick={handleConfirmRewrite} 
                            variant="primary"
                            isLoading={isGenerating}
                            leftIcon={<Sparkles size={18} />}
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            Lancer la Réécriture
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Directives Spéciales</Label>
                        <Textarea
                            placeholder="Instructions pour l'agent..."
                            value={rewriteInstructions}
                            onChange={(e) => setRewriteInstructions(e.target.value)}
                        />
                    </div>
                </div>
            </Modal>

            {/* TAB: IDEATION */}
            {activeTab === 'ideation' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Trends Panel */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px]">
                             <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                                <div>
                                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                        <Newspaper className="text-slate-500" size={18} />
                                        Tendances Google News
                                    </h3>
                                    <p className="text-xs text-slate-500">Scan du web pour trouver des sujets chauds</p>
                                </div>
                                <button 
                                    onClick={handleFetchTrends}
                                    disabled={isGenerating}
                                    className="text-xs flex items-center gap-1 bg-white border border-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition"
                                >
                                    {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                                    Scanner
                                </button>
                             </div>
                             <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {trends.length === 0 ? (
                                    <div className="text-center text-slate-400 mt-10">Aucune tendance. Cliquez sur &quot;Scanner&quot;.</div>
                                ) : trends.map(trend => (
                                    <div key={trend.id} className="border-b border-slate-100 pb-3 last:border-0 hover:bg-slate-50 p-2 rounded transition">
                                        <a href={trend.url} target="_blank" className="font-medium text-blue-600 hover:underline block mb-1 text-sm">{trend.title}</a>
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <span>{trend.source}</span>
                                            <span>•</span>
                                            <span>{format(new Date(trend.published_date), "dd MMM")}</span>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>

                        {/* Ideas Generator Panel */}
                        <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 overflow-hidden flex flex-col h-[600px] text-white">
                            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
                                <div>
                                    <h3 className="font-bold text-white flex items-center gap-2">
                                        <Sparkles className="text-indigo-400" size={18} />
                                        Générateur d&apos;Idées AI
                                    </h3>
                                    <p className="text-xs text-slate-400">Transforme les tendances en sujets de blog</p>
                                </div>
                                <button 
                                    onClick={handleGenerateIdeas}
                                    disabled={isGenerating}
                                    className="text-xs flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition font-bold shadow-lg shadow-indigo-500/20"
                                >
                                    {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                                    Générer 5 idées
                                </button>
                             </div>
                             <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {ideas.length === 0 ? (
                                    <div className="text-center text-slate-500 mt-10">
                                        L&apos;AI n&apos;a pas encore proposé d&apos;idées.
                                        <br/>Cliquez sur &quot;Générer&quot; pour commencer.
                                    </div>
                                ) : ideas.map(idea => (
                                    <div key={idea.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-indigo-500/50 transition group relative">
                                        <button 
                                            onClick={() => handleDismissIdea(idea.id)}
                                            className="absolute top-2 right-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                        <h4 className="font-bold text-lg text-indigo-100 pr-6">{idea.title}</h4>
                                        <div className="mt-2 text-sm text-slate-400">
                                            <span className="text-indigo-300 font-mono text-xs uppercase tracking-wide mr-2">Angle:</span>
                                            {idea.angle}
                                        </div>
                                        <p className="mt-2 text-xs text-slate-500 italic border-l-2 border-slate-600 pl-2">
                                            {idea.rationale}
                                        </p>
                                        <button 
                                            onClick={() => handleWriteArticle(idea)}
                                            disabled={isGenerating}
                                            className="mt-4 w-full py-2 bg-white text-slate-900 rounded-lg text-sm font-bold hover:bg-indigo-50 transition flex items-center justify-center gap-2"
                                        >
                                            {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Edit size={14} />}
                                            Rédiger l&apos;article
                                        </button>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: SETTINGS */}
            {activeTab === 'settings' && (
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                             <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Bot className="text-pink-600" />
                                Moteur d&apos;Automatisation
                            </h2>
                            <p className="text-slate-500 text-sm">Configurez la création automatique de contenu sans intervention.</p>
                        </div>
                        
                        {settings ? (
                            <div className="p-6 space-y-6">
                                {/* Toggle Active */}
                                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50">
                                    <div>
                                        <div className="font-bold text-slate-900">Activation du Moteur</div>
                                        <div className="text-sm text-slate-500">Le script s&apos;exécutera automatiquement.</div>
                                    </div>
                                    <button 
                                        onClick={() => handleSaveSettings({ is_active: !settings.is_active })}
                                        className={`w-12 h-6 rounded-full transition-colors relative ${settings.is_active ? 'bg-green-500' : 'bg-slate-300'}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.is_active ? 'left-7' : 'left-1'}`} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Fréquence</label>
                                        <select 
                                            value={settings.frequency}
                                            onChange={(e) => handleSaveSettings({ frequency: e.target.value })}
                                            className="w-full border border-slate-300 rounded-lg p-2.5 bg-white text-sm"
                                        >
                                            <option value="daily">Quotidien</option>
                                            <option value="weekly">Hebdomadaire</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Articles par cycle</label>
                                        <select 
                                            value={settings.articles_per_run}
                                            onChange={(e) => handleSaveSettings({ articles_per_run: parseInt(e.target.value) })}
                                            className="w-full border border-slate-300 rounded-lg p-2.5 bg-white text-sm"
                                        >
                                            <option value="1">1 article</option>
                                            <option value="3">3 articles</option>
                                            <option value="5">5 articles</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Auto Publish */}
                                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50">
                                    <div>
                                        <div className="font-bold text-slate-900">Publication Automatique</div>
                                        <div className="text-sm text-slate-500">Si désactivé, crée des brouillons.</div>
                                    </div>
                                    <button 
                                        onClick={() => handleSaveSettings({ auto_publish: !settings.auto_publish })}
                                        className={`w-12 h-6 rounded-full transition-colors relative ${settings.auto_publish ? 'bg-indigo-500' : 'bg-slate-300'}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.auto_publish ? 'left-7' : 'left-1'}`} />
                                    </button>
                                </div>

                                <div className="pt-6 border-t border-slate-100">
                                    <h3 className="font-bold text-slate-900 mb-4">Zone de Test</h3>
                                    <button 
                                        onClick={handleTriggerAutomation}
                                        disabled={isGenerating}
                                        className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                                    >
                                        {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} />}
                                        Lancer un cycle maintenant (Force Run)
                                    </button>
                                    <p className="text-xs text-center mt-2 text-slate-400">
                                        Dernière exécution : {settings.last_run ? format(new Date(settings.last_run), "dd MMM HH:mm", { locale: fr }) : 'Jamais'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 text-center text-slate-400">Chargement des paramètres... (Vérifiez la migration)</div>
                        )}
                    </div>
                </div>
            )}

            {/* EDIT MODAL (Global) */}
            {editingPost && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-4xl w-full p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-900">Éditer l&apos;article</h2>
                            <button onClick={() => setEditingPost(null)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Titre</label>
                                    <input 
                                        type="text" 
                                        className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={editingPost.title}
                                        onChange={e => setEditingPost({...editingPost, title: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Slug</label>
                                    <input 
                                        type="text" 
                                        className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={editingPost.slug}
                                        onChange={e => setEditingPost({...editingPost, slug: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Résumé (Excerpt)</label>
                                <textarea 
                                    className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]"
                                    value={editingPost.excerpt || ""}
                                    onChange={e => setEditingPost({...editingPost, excerpt: e.target.value})}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Contenu (HTML)</label>
                                <textarea 
                                    className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none h-64 font-mono text-sm"
                                    value={editingPost.content || ""}
                                    onChange={e => setEditingPost({...editingPost, content: e.target.value})}
                                />
                            </div>

                            <div className="flex gap-4 pt-6 border-t border-slate-100">
                                <button 
                                    onClick={() => setEditingPost(null)}
                                    className="flex-1 px-6 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 font-medium transition"
                                >
                                    Annuler
                                </button>
                                <button 
                                    onClick={handleSaveEdit}
                                    disabled={isSaving}
                                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2"
                                >
                                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    Enregistrer les modifications
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
