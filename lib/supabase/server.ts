// Client Supabase à usage serveur exclusif.
//
// Projet Supabase mutualisé : un schéma par projet. Celui-ci écrit dans
// umdeny_apporteur, à côté de umdeny_quiz, vireel et cherryz. Le schéma est
// précisé à chaque requête via .schema(), comme dans quiz-umdeny.
//
// La clé service_role contourne RLS : elle ne doit JAMAIS atteindre le
// navigateur. L'import de « server-only » fait échouer le build si ce module
// est tiré depuis un composant client, plutôt que de laisser fuiter la clé
// silencieusement.
//
// Aucune variable n'est préfixée NEXT_PUBLIC_ : ce préfixe exposerait la
// valeur au navigateur.

import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Schéma dédié à ce projet sur le Supabase mutualisé. */
export const APPORTEUR_SCHEMA = "umdeny_apporteur";
export const CANDIDATURES_TABLE = "candidatures";

export function createServiceClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    throw new Error(
      "Configuration Supabase absente : SUPABASE_URL et SUPABASE_SERVICE_KEY sont requises côté serveur.",
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
