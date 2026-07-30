-- Candidatures au programme apporteur d'affaires Umdeny.
-- Structure dérivée de la partie 11 de QUIZ_CANDIDATURE_-_APPORTEUR_D'AFFAIRES_UMDENY.pdf (v2.0).
--
-- Modèle d'accès : écriture et lecture exclusivement serveur, via la clé
-- secrète (sb_secret_...) qui contourne RLS. La table n'est donc jamais
-- exposée au Data API : aucun droit n'est accordé à anon ni authenticated,
-- et RLS est activé sans aucune policy — refus par défaut.

create table public.candidatures_apporteur (
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
  reponses_conditionnelles jsonb not null default '{}'::jsonb,
  maitrise_par_verticale jsonb not null default '{}'::jsonb,
  parcours_formation_par_verticale jsonb not null default '{}'::jsonb,

  -- Scoring interne (partie 7) — jamais affiché au candidat
  score_reseau smallint,
  score_experience smallint,
  score_disponibilite smallint,
  score_pertinence_par_verticale jsonb not null default '{}'::jsonb,
  score_total smallint,
  tag_priorite text,
  signaux_complementaires text[] not null default '{}',

  -- Bloc complémentaire (Q_END1, Q_END2) — transmis tels quels
  liens_partages text,
  message_libre text,

  -- Suivi commercial
  statut_suivi text not null default 'Nouveau',
  geo_tag text,

  -- Consentements : colonnes prévues par la spec mais que le quiz ne collecte
  -- pas encore (il n'affiche aucune case de consentement, contrairement aux
  -- formulaires Contact et Prendre-RDV du site). Restent nulles d'ici là.
  consentement_contact boolean,
  consentement_rgpd boolean,

  -- Sauvegarde brute, pour ne rien perdre si la structure évolue
  reponses_completes jsonb not null,

  constraint candidatures_apporteur_statut_suivi_check
    check (statut_suivi in ('Nouveau', 'Contacté', 'Entretien programmé', 'Admis', 'Refusé', 'Inactif')),
  constraint candidatures_apporteur_tag_priorite_check
    check (tag_priorite is null or tag_priorite in ('Prioritaire', 'À qualifier', 'En veille')),
  constraint candidatures_apporteur_score_total_check
    check (score_total is null or score_total between 0 and 100)
);

comment on table public.candidatures_apporteur is
  'Candidatures au programme apporteur d''affaires. Écriture serveur uniquement via la clé secrète. Contient des données personnelles (nom, email, téléphone).';

comment on column public.candidatures_apporteur.score_total is
  'Score de priorité de suivi commercial, 0 à 100. Usage interne strict : jamais affiché au candidat.';

comment on column public.candidatures_apporteur.reponses_completes is
  'Réponses brutes du quiz, telles que soumises. Filet de sécurité si la structure des colonnes évolue.';

-- Tri du plus récent au plus ancien, et filtrage par priorité : les deux
-- usages de la console de suivi.
create index candidatures_apporteur_created_at_idx
  on public.candidatures_apporteur (created_at desc);

create index candidatures_apporteur_tag_priorite_idx
  on public.candidatures_apporteur (tag_priorite, created_at desc);

create index candidatures_apporteur_email_idx
  on public.candidatures_apporteur (email);

-- RLS activé sans policy : tout accès par les rôles anon et authenticated est
-- refusé. La clé secrète, qui porte BYPASSRLS, n'est pas concernée.
alter table public.candidatures_apporteur enable row level security;

-- Défense en profondeur : on retire aussi les droits de table, pour que la
-- table reste inaccessible même si elle était exposée au Data API par erreur.
revoke all on public.candidatures_apporteur from anon, authenticated;
