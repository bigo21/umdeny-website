// Client Supabase à usage serveur exclusif.
//
// La clé secrète (sb_secret_...) contourne RLS : elle ne doit JAMAIS atteindre
// le navigateur. L'import de « server-only » fait échouer le build si ce
// module est importé depuis un composant client, plutôt que de laisser fuiter
// la clé silencieusement.
//
// Aucune variable n'est préfixée NEXT_PUBLIC_ : dans Next.js, ce préfixe
// expose la valeur au navigateur.

import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function createServiceClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    throw new Error(
      "Configuration Supabase absente : SUPABASE_URL et SUPABASE_SECRET_KEY sont requises côté serveur.",
    );
  }

  return createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
