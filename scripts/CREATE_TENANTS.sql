-- Script pour créer tous les tenants .com dans Supabase
-- Version corrigée - gère les doublons sur domain aussi

-- D'abord, supprimer les anciens tenants .fr/.com qui pourraient exister
DELETE FROM public.tenants WHERE domain LIKE 'taxi%.com' OR domain LIKE 'taxi%.fr';

-- Ensuite, insérer les nouveaux tenants .com
INSERT INTO public.tenants (id, name, domain, phone_number, email)
VALUES 
  ('taxiaplaisir_com', 'Taxi Plaisir 78', 'taxiaplaisir.com', '01 84 60 78 78', 'contact@taxiaplaisir.com'),
  ('taxiasnieres_com', 'Taxi Asnières 92', 'taxiasnieres.com', '01 84 60 92 92', 'contact@taxiasnieres.com'),
  ('taxiboulogne_com', 'Taxi Boulogne 92', 'taxiboulogne.com', '01 84 60 92 92', 'contact@taxiboulogne.com'),
  ('taxichambourcy_com', 'Taxi Chambourcy 78', 'taxichambourcy.com', '01 84 60 78 78', 'contact@taxichambourcy.com'),
  ('taxicolombes_com', 'Taxi Colombes 92', 'taxicolombes.com', '01 84 60 92 92', 'contact@taxicolombes.com'),
  ('taxicourbevoie_com', 'Taxi Courbevoie 92', 'taxicourbevoie.com', '01 84 60 92 92', 'contact@taxicourbevoie.com'),
  ('taxifeucherolles_com', 'Taxi Feucherolles 78', 'taxifeucherolles.com', '01 84 60 78 78', 'contact@taxifeucherolles.com'),
  ('taxifourqueux_com', 'Taxi Fourqueux 78', 'taxifourqueux.com', '01 84 60 78 78', 'contact@taxifourqueux.com'),
  ('taxiguyancourt_com', 'Taxi Guyancourt 78', 'taxiguyancourt.com', '01 84 60 78 78', 'contact@taxiguyancourt.com'),
  ('taxiissy_com', 'Taxi Issy 92', 'taxiissy.com', '01 84 60 92 92', 'contact@taxiissy.com'),
  ('taxilepecq_com', 'Taxi Le Pecq 78', 'taxilepecq.com', '01 84 60 78 78', 'contact@taxilepecq.com'),
  ('taxilevallois_com', 'Taxi Levallois 92', 'taxilevallois.com', '01 84 60 92 92', 'contact@taxilevallois.com'),
  ('taxilevesinet_com', 'Taxi Le Vésinet 78', 'taxilevesinet.com', '01 84 60 78 78', 'contact@taxilevesinet.com'),
  ('taxilouveciennes_com', 'Taxi Louveciennes 78', 'taxilouveciennes.com', '01 84 60 78 78', 'contact@taxilouveciennes.com'),
  ('taximarly_com', 'Taxi Marly 78', 'taximarly.com', '01 84 60 78 78', 'contact@taximarly.com'),
  ('taxinanterre_fr', 'Taxi Nanterre 92', 'taxinanterre.fr', '01 84 60 92 92', 'contact@taxinanterre.fr'),
  ('taximontreuil_com', 'Taxi Montreuil 93', 'taximontreuil.com', '01 84 60 93 93', 'contact@taximontreuil.com'),
  ('taxineuilly_com', 'Taxi Neuilly 92', 'taxineuilly.com', '01 84 60 92 92', 'contact@taxineuilly.com'),
  ('taxipoissy_com', 'Taxi Poissy 78', 'taxipoissy.com', '01 84 60 78 78', 'contact@taxipoissy.com'),
  ('taxirueil_com', 'Taxi Rueil 92', 'taxirueil.com', '01 84 60 92 92', 'contact@taxirueil.com'),
  ('taxisaintcloud_com', 'Taxi Saint-Cloud 92', 'taxisaintcloud.com', '01 84 60 92 92', 'contact@taxisaintcloud.com'),
  ('taxisaintcyr_com', 'Taxi Saint-Cyr 78', 'taxisaintcyr.com', '01 84 60 78 78', 'contact@taxisaintcyr.com'),
  ('taxisaintdenis_com', 'Taxi Saint-Denis 93', 'taxisaintdenis.com', '01 84 60 93 93', 'contact@taxisaintdenis.com'),
  ('taxisaintgermain_com', 'Taxi Saint-Germain 78', 'taxisaintgermain.com', '01 84 60 78 78', 'contact@taxisaintgermain.com'),
  ('taxisaintnom_com', 'Taxi Saint-Nom 78', 'taxisaintnom.com', '01 84 60 78 78', 'contact@taxisaintnom.com'),
  ('taxisaintouen_com', 'Taxi Saint-Ouen 93', 'taxisaintouen.com', '01 84 60 93 93', 'contact@taxisaintouen.com'),
  ('taxisaintquentin_com', 'Taxi Saint-Quentin 78', 'taxisaintquentin.com', '01 84 60 78 78', 'contact@taxisaintquentin.com'),
  ('taxisversailles_com', 'Taxi Versailles 78', 'taxisversailles.com', '01 84 60 78 78', 'contact@taxisversailles.com');

-- S'assurer que ga_id et gtm_id existent
ALTER TABLE public.tenants 
ADD COLUMN IF NOT EXISTS ga_id text,
ADD COLUMN IF NOT EXISTS gtm_id text;
