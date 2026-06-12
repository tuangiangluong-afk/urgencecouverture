-- Add soloca_article_id to blog_posts to support HighStory sync
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS soloca_article_id UUID;

-- Add index for faster sync checks
CREATE INDEX IF NOT EXISTS idx_blog_posts_soloca_id ON public.blog_posts(soloca_article_id);

-- Add comment
COMMENT ON COLUMN public.blog_posts.soloca_article_id IS 'Reference to the original article in HighStory (Soloca)';
