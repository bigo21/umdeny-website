-- Candidatures au programme apporteur d'affaires Umdeny.
-- Schéma dédié umdeny_apporteur, sur le projet Supabase mutualisé
-- (naebgecmohzkqfediuyn), à côté de umdeny_quiz, vireel et cherryz.
--
-- Structure dérivée de la partie 11 de QUIZ_CANDIDATURE_-_APPORTEUR_D'AFFAIRES_UMDENY.pdf (v2.0).
--
-- Modèle d'accès : écriture exclusivement serveur, via la clé service_role
-- (ou sb_secret_...) qui contourne RLS — même logique que umdeny_quiz.prospects
-- et vireel, et non celle de cherryz.quote_requests qui écrit côté client.
--
-- À la différence de umdeny_quiz.prospects, il n'y a PAS de profil attribué :
-- la spec interdit d'afficher un résultat au candidat. tag_priorite sert
-- uniquement au tri interne des candidatures.

create schema if not exists umdeny_apporteur;

create table if not exists umdeny_apporteur.candidatures (
  candidat_id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Bloc A — Identité (Q1 à Q4)
  nom text not null,
  prenom text not null,
  email text not null,
  telephone text not null,

  -- Bloc B — Situation personnelle (Q6 à Q11)
  pays text,
  age_range text,
  situation_pro text,
  situation_matrimoniale text,
  situation_financiere text,
  secteur text,

  -- Bloc C — Réseau (Q12 à Q14)
  reseau_type text[] not null default '{}',
  reseau_taille text,
  canaux text[] not null default '{}',

  -- Bloc D — Expérience, disponibilité, motivation (Q15 à Q17)
  experience_commerciale text,
  disponibilite text,
  motivation text,

  -- Q18 et blocs conditionnels (7 réponses par verticale cochée)
  verticales_interet text[] not null default '{}',
  reponses_conditionnelles_json jsonb not null default '{}'::jsonb,
  maitrise_par_verticale_json jsonb not null default '{}'::jsonb,
  parcours_formation_par_verticale_json jsonb not null default '{}'::jsonb,

  -- Scoring interne (partie 7) — jamais affiché au candidat
  score_reseau smallint,
  score_experience smallint,
  score_disponibilite smallint,
  score_pertinence_par_verticale_json jsonb not null default '{}'::jsonb,
  score_total smallint,
  tag_priorite text,
  signaux_complementaires text[] not null default '{}',

  -- Bloc complémentaire (Q_END1, Q_END2) — transmis tels quels
  liens_partages text,
  message_libre text,

  -- Suivi commercial
  statut_suivi text not null default 'Nouveau',
  geo_tag text,

  -- Suivi d'envoi des emails, comme umdeny_quiz.prospects
  email_candidat_envoye boolean not null default false,
  email_equipe_envoye boolean not null default false,

  -- Consentements : colonnes prévues par la spec mais que le quiz ne collecte
  -- PAS encore, contrairement à umdeny_quiz qui les rend obligatoires.
  -- Restent nulles tant qu'aucune case n'est ajoutée au parcours.
  consentement_contact boolean,
  consentement_rgpd boolean,

  -- Sauvegarde brute, pour ne rien perdre si la structure évolue
  reponses_completes_json jsonb not null,

  constraint candidatures_statut_suivi_check
    check (statut_suivi in ('Nouveau', 'Contacté', 'Entretien programmé', 'Admis', 'Refusé', 'Inactif')),
  constraint candidatures_tag_priorite_check
    check (tag_priorite is null or tag_priorite in ('Prioritaire', 'À qualifier', 'En veille')),
  constraint candidatures_score_total_check
    check (score_total is null or score_total between 0 and 100)
);

comment on table umdeny_apporteur.candidatures is
  'Candidatures au programme apporteur d''affaires. Écriture serveur uniquement. Contient des données personnelles (nom, email, téléphone).';

comment on column umdeny_apporteur.candidatures.tag_priorite is
  'Priorité de suivi commercial. Usage interne strict : jamais affiché au candidat, contrairement au profil de umdeny_quiz.prospects.';

comment on column umdeny_apporteur.candidatures.reponses_completes_json is
  'Réponses brutes du quiz, telles que soumises. Filet de sécurité si la structure des colonnes évolue.';

-- Les deux usages de la console de suivi : le plus récent d'abord, et le
-- filtrage par priorité.
create index if not exists candidatures_created_at_idx
  on umdeny_apporteur.candidatures (created_at desc);

create index if not exists candidatures_tag_priorite_idx
  on umdeny_apporteur.candidatures (tag_priorite, created_at desc);

create index if not exists candidatures_statut_suivi_idx
  on umdeny_apporteur.candidatures (statut_suivi, created_at desc);

create index if not exists candidatures_email_idx
  on umdeny_apporteur.candidatures (email);

-- RLS activé SANS policy : tout accès par anon et authenticated est refusé au
-- niveau ligne. service_role porte BYPASSRLS et n'est pas concerné.
alter table umdeny_apporteur.candidatures enable row level security;

-- GRANT indispensables : sans eux, même service_role reçoit une 403.
grant usage on schema umdeny_apporteur to service_role;
grant all on all tables in schema umdeny_apporteur to service_role;
grant all on all sequences in schema umdeny_apporteur to service_role;
alter default privileges in schema umdeny_apporteur grant all on tables to service_role;
alter default privileges in schema umdeny_apporteur grant all on sequences to service_role;

-- anon et authenticated ne reçoivent volontairement AUCUN droit ici :
-- l'écriture est exclusivement serveur, contrairement à cherryz.quote_requests.
-- Décommenter uniquement pour uniformiser avec les autres schémas — RLS sans
-- policy continuera de bloquer ces rôles, mais la surface devient inutilement
-- large si une policy est ajoutée plus tard.
--
-- grant usage on schema umdeny_apporteur to anon, authenticated;
-- grant all on all tables in schema umdeny_apporteur to anon, authenticated;
-- grant all on all sequences in schema umdeny_apporteur to anon, authenticated;
-- alter default privileges in schema umdeny_apporteur grant all on tables to anon, authenticated;
