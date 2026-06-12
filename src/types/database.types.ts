export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            tenants: {
                Row: {
                    id: string
                    name: string
                    domain: string
                    phone_number: string | null
                    email: string | null
                    primary_color: string | null
                    gtm_id: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    name: string
                    domain: string
                    phone_number?: string | null
                    email?: string | null
                    primary_color?: string | null
                    gtm_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    domain?: string
                    phone_number?: string | null
                    email?: string | null
                    primary_color?: string | null
                    gtm_id?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            content_pages: {
                Row: {
                    id: string
                    tenant_id: string
                    path: string
                    section: string
                    key: string
                    value: string | null
                    type: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    tenant_id: string
                    path: string
                    section: string
                    key: string
                    value?: string | null
                    type?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    tenant_id?: string
                    path?: string
                    section?: string
                    key?: string
                    value?: string | null
                    type?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            vehicles: {
                Row: {
                    id: string
                    tenant_id: string
                    name: string
                    description: string | null
                    capacity_passengers: number | null
                    capacity_luggage: number | null
                    image_url: string | null
                    price_class: string | null
                    display_order: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    tenant_id: string
                    name: string
                    description?: string | null
                    capacity_passengers?: number | null
                    capacity_luggage?: number | null
                    image_url?: string | null
                    price_class?: string | null
                    display_order?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    tenant_id?: string
                    name?: string
                    description?: string | null
                    capacity_passengers?: number | null
                    capacity_luggage?: number | null
                    image_url?: string | null
                    price_class?: string | null
                    display_order?: number | null
                    created_at?: string
                }
                Relationships: []
            }
            faqs: {
                Row: {
                    id: string
                    tenant_id: string
                    question: string
                    answer: string
                    category: string | null
                    display_order: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    tenant_id: string
                    question: string
                    answer: string
                    category?: string | null
                    display_order?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    tenant_id?: string
                    question?: string
                    answer?: string
                    category?: string | null
                    display_order?: number | null
                    created_at?: string
                }
                Relationships: []
            }
            pois: {
                Row: {
                    id: string
                    tenant_id: string
                    name: string
                    slug: string
                    type: string
                    content_intro: string | null
                    content_bus_pain: string | null
                    content_taxi_solution: string | null
                    parking_difficulty: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    tenant_id: string
                    name: string
                    slug: string
                    type: string
                    content_intro?: string | null
                    content_bus_pain?: string | null
                    content_taxi_solution?: string | null
                    parking_difficulty?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    tenant_id?: string
                    name?: string
                    slug?: string
                    type?: string
                    content_intro?: string | null
                    content_bus_pain?: string | null
                    content_taxi_solution?: string | null
                    parking_difficulty?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            spintax_templates: {
                Row: {
                    id: string
                    tenant_id: string
                    type: string
                    variations: string[]
                    created_at: string
                }
                Insert: {
                    id?: string
                    tenant_id: string
                    type: string
                    variations: string[]
                    created_at?: string
                }
                Update: {
                    id?: string
                    tenant_id?: string
                    type?: string
                    variations?: string[]
                    created_at?: string
                }
                Relationships: []
            }
            leads: {
                Row: {
                    id: string
                    tenant_id: string
                    status: string
                    type: string
                    name: string
                    email: string
                    phone: string
                    company: string | null
                    message: string | null
                    city: string | null
                    postal_code: string | null
                    housing_type: string | null
                    notes: string | null
                    price: number | null
                    region: string | null
                    department: string | null
                    is_paid: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    tenant_id: string
                    status?: string
                    type: string
                    name: string
                    email: string
                    phone: string
                    company?: string | null
                    message?: string | null
                    city?: string | null
                    postal_code?: string | null
                    housing_type?: string | null
                    notes?: string | null
                    price?: number | null
                    region?: string | null
                    department?: string | null
                    is_paid?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    tenant_id?: string
                    status?: string
                    type?: string
                    name?: string
                    email?: string
                    phone?: string
                    company?: string | null
                    message?: string | null
                    city?: string | null
                    postal_code?: string | null
                    housing_type?: string | null
                    notes?: string | null
                    price?: number | null
                    region?: string | null
                    department?: string | null
                    is_paid?: boolean
                    created_at?: string
                }
                Relationships: []
            }
            lead_assignments: {
                Row: {
                    id: string
                    lead_id: string
                    partner_id: string
                    assigned_at: string
                    status: string
                }
                Insert: {
                    id?: string
                    lead_id: string
                    partner_id: string
                    assigned_at?: string
                    status?: string
                }
                Update: {
                    id?: string
                    lead_id?: string
                    partner_id?: string
                    assigned_at?: string
                    status?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "lead_assignments_lead_id_fkey"
                        columns: ["lead_id"]
                        referencedRelation: "leads"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "lead_assignments_partner_id_fkey"
                        columns: ["partner_id"]
                        referencedRelation: "partners"
                        referencedColumns: ["id"]
                    }
                ]
            }
            partners: {
                Row: {
                    id: string
                    name: string
                    email: string
                    phone: string | null
                    company_info: Json | null
                    managed_regions: string[] | null
                    managed_departments: string[] | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    email: string
                    phone?: string | null
                    company_info?: Json | null
                    managed_regions?: string[] | null
                    managed_departments?: string[] | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    email?: string
                    phone?: string | null
                    company_info?: Json | null
                    managed_regions?: string[] | null
                    managed_departments?: string[] | null
                    created_at?: string
                }
                Relationships: []
            }
            reviews: {
                Row: {
                    id: string
                    tenant_id: string
                    author_name: string
                    rating: number
                    content: string
                    source: string
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    tenant_id: string
                    author_name: string
                    rating?: number
                    content: string
                    source?: string
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    tenant_id?: string
                    author_name?: string
                    rating?: number
                    content?: string
                    source?: string
                    is_active?: boolean
                    created_at?: string
                }
                Relationships: []
            }
            blog_authors: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    role: string | null
                    description: string | null
                    obsession: string | null
                    signature: string | null
                    image_url: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    role?: string | null
                    description?: string | null
                    obsession?: string | null
                    signature?: string | null
                    image_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    role?: string | null
                    description?: string | null
                    obsession?: string | null
                    signature?: string | null
                    image_url?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            blog_categories: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    description: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    description?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    description?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            blog_posts: {
                Row: {
                    id: string
                    title: string
                    slug: string
                    excerpt: string | null
                    content: string | null
                    featured_image_url: string | null
                    status: string
                    author_id: string | null
                    category_id: string | null
                    published_at: string | null
                    updated_at: string
                    seo_title: string | null
                    seo_description: string | null
                    read_time_minutes: number
                    tags: string[] | null
                    faq: Json | null
                    soloca_article_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    slug: string
                    excerpt?: string | null
                    content?: string | null
                    featured_image_url?: string | null
                    status?: string
                    author_id?: string | null
                    category_id?: string | null
                    published_at?: string | null
                    updated_at?: string
                    seo_title?: string | null
                    seo_description?: string | null
                    read_time_minutes?: number
                    tags?: string[] | null
                    faq?: Json | null
                    soloca_article_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    slug?: string
                    excerpt?: string | null
                    content?: string | null
                    featured_image_url?: string | null
                    status?: string
                    author_id?: string | null
                    category_id?: string | null
                    published_at?: string | null
                    updated_at?: string
                    seo_title?: string | null
                    seo_description?: string | null
                    read_time_minutes?: number
                    tags?: string[] | null
                    faq?: Json | null
                    soloca_article_id?: string | null
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "blog_posts_author_id_fkey"
                        columns: ["author_id"]
                        referencedRelation: "blog_authors"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "blog_posts_category_id_fkey"
                        columns: ["category_id"]
                        referencedRelation: "blog_categories"
                        referencedColumns: ["id"]
                    }
                ]
            }
            seo_landing_pages: {
                Row: {
                    id: string
                    slug: string
                    sport: string
                    city: string
                    h1_title: string
                    content: string | null
                    meta_title: string | null
                    meta_description: string | null
                    status: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    slug: string
                    sport: string
                    city: string
                    h1_title: string
                    content?: string | null
                    meta_title?: string | null
                    meta_description?: string | null
                    status?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    slug?: string
                    sport?: string
                    city?: string
                    h1_title?: string
                    content?: string | null
                    meta_title?: string | null
                    meta_description?: string | null
                    status?: string
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            ai_agents: {
                Row: {
                    id: string
                    name: string
                    handler: string
                    model_name: string | null
                    system_prompt: string
                    api_endpoint: string | null
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    handler: string
                    model_name?: string | null
                    system_prompt: string
                    api_endpoint?: string | null
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    handler?: string
                    model_name?: string | null
                    system_prompt?: string
                    api_endpoint?: string | null
                    is_active?: boolean
                    created_at?: string
                }
                Relationships: []
            }
            blog_trends: {
                Row: {
                    id: string
                    query: string
                    source: string | null
                    title: string | null
                    url: string | null
                    snippet: string | null
                    is_processed: boolean
                    published_date: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    query: string
                    source?: string | null
                    title?: string | null
                    url?: string | null
                    snippet?: string | null
                    is_processed?: boolean
                    published_date?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    query?: string
                    source?: string | null
                    title?: string | null
                    url?: string | null
                    snippet?: string | null
                    is_processed?: boolean
                    published_date?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            blog_ideas: {
                Row: {
                    id: string
                    title: string
                    slug: string | null
                    category_id: string | null
                    angle: string | null
                    rationale: string | null
                    status: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    slug?: string | null
                    category_id?: string | null
                    angle?: string | null
                    rationale?: string | null
                    status?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    slug?: string | null
                    category_id?: string | null
                    angle?: string | null
                    rationale?: string | null
                    status?: string
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "blog_ideas_category_id_fkey"
                        columns: ["category_id"]
                        referencedRelation: "blog_categories"
                        referencedColumns: ["id"]
                    }
                ]
            }
            automation_settings: {
                Row: {
                    id: string
                    is_active: boolean
                    frequency: string
                    articles_per_run: number
                    auto_publish: boolean
                    last_run: string | null
                    next_run: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    is_active?: boolean
                    frequency?: string
                    articles_per_run?: number
                    auto_publish?: boolean
                    last_run?: string | null
                    next_run?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    is_active?: boolean
                    frequency?: string
                    articles_per_run?: number
                    auto_publish?: boolean
                    last_run?: string | null
                    next_run?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
