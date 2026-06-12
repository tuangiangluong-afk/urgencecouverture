-- =============================================
-- REVIEWS TABLE - Curated Reviews Engine
-- =============================================
-- Tu es propriétaire de la data. Les avis sont stockés dans TA base.
-- Au début: Avis "Réseau" génériques
-- Ensuite: Copy/paste des meilleurs avis Google du chauffeur partenaire

-- Table des Avis
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    
    tenant_id TEXT NOT NULL,           -- ex: 'taxineuilly' (le slug du site)
    author_name TEXT NOT NULL,         -- ex: 'Sophie M.'
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    content TEXT NOT NULL,             -- Le texte de l'avis
    source TEXT DEFAULT 'Google',      -- Pour afficher le petit logo Google
    is_active BOOLEAN DEFAULT true,    -- Pour masquer un avis sans le supprimer
    
    -- Index pour les requêtes fréquentes
    CONSTRAINT reviews_tenant_idx UNIQUE (id, tenant_id)
);

-- Index pour les requêtes par tenant
CREATE INDEX IF NOT EXISTS idx_reviews_tenant ON reviews(tenant_id);
CREATE INDEX IF NOT EXISTS idx_reviews_active ON reviews(is_active);

-- Sécurité RLS (Lecture publique, Ecriture via service role)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Tout le monde peut lire les avis actifs
CREATE POLICY "Public reviews are viewable" 
    ON reviews 
    FOR SELECT 
    USING (is_active = true);

-- Policy: Admins peuvent tout faire (via service role ou authenticated admin)
CREATE POLICY "Admins can manage reviews" 
    ON reviews 
    FOR ALL 
    USING (auth.role() = 'authenticated');

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_reviews_updated_at();

-- =============================================
-- SEED DATA - Avis Réseau (Fallback universel)
-- =============================================
-- Ces avis s'affichent si le tenant n'a pas encore d'avis personnalisés

INSERT INTO reviews (tenant_id, author_name, rating, content, source) VALUES
    ('_default', 'Jean-Marc D.', 5, 'Chauffeur ponctuel et véhicule impeccable. Transfert aéroport parfaitement géré.', 'Google'),
    ('_default', 'Sophie L.', 5, 'Service au top ! Réservé en 2 minutes, chauffeur là en 10 minutes. Je recommande.', 'Google'),
    ('_default', 'Michel B.', 5, 'Idéal pour mes rendez-vous médicaux. Le tiers-payant a bien fonctionné, aucun souci.', 'Google'),
    ('_default', 'Catherine M.', 5, 'Très professionnel. Prix fixe annoncé = prix payé. Pas de surprise.', 'Google'),
    ('_default', 'Pierre R.', 5, 'Conduite souple et courtoise. Parfait pour emmener ma mère à l''hôpital.', 'Google'),
    ('_default', 'Anne-Marie T.', 5, 'Enfin un service fiable ! Fini les VTC qui annulent au dernier moment.', 'Google')
ON CONFLICT DO NOTHING;

-- =============================================
-- SAMPLE: Comment ajouter des avis pour un tenant
-- =============================================
-- Exemple pour taxineuilly:
-- INSERT INTO reviews (tenant_id, author_name, rating, content, source) VALUES
--     ('taxineuilly', 'Marc D.', 5, 'Super chauffeur, toujours à l''heure pour mes trajets Neuilly-Orly.', 'Google'),
--     ('taxineuilly', 'Isabelle F.', 5, 'Véhicule très propre, chauffeur courtois. Je recommande sans hésiter.', 'Google');
