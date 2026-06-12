-- Bulk Insert New Tenants (Yvelines & Hauts-de-Seine)
-- Run this in your Supabase SQL Editor to populate the Tenant Switcher

INSERT INTO public.tenants (id, name, domain, created_at)
VALUES
    ('taxiaplaisir', 'Taxi Plaisir (78)', 'taxiaplaisir.fr', NOW()),
    ('taxiasnieres', 'Taxi Asnières-sur-Seine', 'taxiasnieres.fr', NOW()),
    ('taxiboulogne', 'Taxi Boulogne-Billancourt', 'taxiboulogne.fr', NOW()),
    ('taxichambourcy', 'Taxi Chambourcy', 'taxichambourcy.fr', NOW()),
    ('taxicolombes', 'Taxi Colombes', 'taxicolombes.fr', NOW()),
    ('taxicourbevoie', 'Taxi Courbevoie', 'taxicourbevoie.fr', NOW()),
    ('taxifeucherolles', 'Taxi Feucherolles', 'taxifeucherolles.fr', NOW()),
    ('taxifourqueux', 'Taxi Fourqueux', 'taxifourqueux.fr', NOW()),
    ('taxiguyancourt', 'Taxi Guyancourt', 'taxiguyancourt.fr', NOW()),
    ('taxiissy', 'Taxi Issy-les-Moulineaux', 'taxiissy.fr', NOW()),
    ('taxilepecq', 'Taxi Le Pecq', 'taxilepecq.com', NOW()),
    ('taxilevallois', 'Taxi Levallois-Perret', 'taxilevallois.fr', NOW()),
    ('taxilevesinet', 'Taxi Le Vésinet', 'taxilevesinet.fr', NOW()),
    ('taxilouveciennes', 'Taxi Louveciennes', 'taxilouveciennes.fr', NOW()),
    ('taximarly', 'Taxi Marly-le-Roi', 'taximarly.fr', NOW()),
    ('taximontreuil', 'Taxi Montreuil', 'taximontreuil.fr', NOW()),
    ('taxinanterre', 'Taxi Nanterre', 'taxinanterre.fr', NOW()),
    ('taxineuilly', 'Taxi Neuilly-sur-Seine', 'taxineuilly.fr', NOW()),
    ('taxipoissy', 'Taxi Poissy', 'taxipoissy.com', NOW()),
    ('taxirueil', 'Taxi Rueil-Malmaison', 'taxirueil.fr', NOW()),
    ('taxisaintcloud', 'Taxi Saint-Cloud', 'taxisaintcloud.fr', NOW()),
    ('taxisaintcyr', 'Taxi Saint-Cyr-l''École', 'taxisaintcyr.fr', NOW()),
    ('taxisaintdenis', 'Taxi Saint-Denis', 'taxisaintdenis.fr', NOW()),
    ('taxisaintgermain', 'Taxi Saint-Germain-en-Laye', 'taxisaintgermain.com', NOW()),
    ('taxisaintnom', 'Taxi Saint-Nom-la-Bretèche', 'taxisaintnom.fr', NOW()),
    ('taxisaintouen', 'Taxi Saint-Ouen', 'taxisaintouen.fr', NOW()),
    ('taxisaintquentin', 'Taxi Saint-Quentin-en-Yvelines', 'taxisaintquentin.com', NOW()),
    ('taxisversailles', 'Taxi Versailles', 'taxisversailles.com', NOW())
ON CONFLICT (id) DO NOTHING;
