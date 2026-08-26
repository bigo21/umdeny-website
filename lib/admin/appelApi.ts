// Appel de l'Edge Function admin-webinaire, partagé par la page et le relais.
//
// Isolé pour que le secret ne soit lu qu'à un seul endroit, et pour que la page
// puisse charger sa liste sans passer par sa propre route HTTP.

import "server-only";

const CHEMIN_FONCTION = "/functions/v1/admin-webinaire";
const DELAI_MAX_MS = 20000;

export interface ReponseAdmin {
  ok: boolean;
  statut: number;
  corps: Record<string, unknown> | null;
  /** Message prêt à afficher quand ok vaut false. */
  erreur?: string;
}

export async function appelerAdminApi(charge: Record<string, unknown>): Promise<ReponseAdmin> {
  const url = process.env.SUPABASE_URL;
  const secret = process.env.ADMIN_WEBINAIRE_SECRET;

  if (!url || !secret) {
    console.error("[admin] SUPABASE_URL ou ADMIN_WEBINAIRE_SECRET absente.");
    return { ok: false, statut: 503, corps: null, erreur: "Configuration serveur incomplète." };
  }

  let reponse: Response;
  try {
    reponse = await fetch(`${url}${CHEMIN_FONCTION}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Admin-Secret": secret },
      body: JSON.stringify(charge),
      // Jamais de cache : cette page sert précisément à voir l'état courant.
      cache: "no-store",
      signal: AbortSignal.timeout(DELAI_MAX_MS),
    });
  } catch (cause) {
    console.error("[admin] Edge Function injoignable :", cause);
    return {
      ok: false,
      statut: 504,
      corps: null,
      erreur: "Le service d'administration ne répond pas. Réessayez dans un instant.",
    };
  }

  const corps = (await reponse.json().catch(() => null)) as Record<string, unknown> | null;

  if (!reponse.ok) {
    // L'Edge Function rédige ses refus en français dans « erreur ». On les
    // transmet tels quels : elle sait mieux que nous pourquoi elle a refusé.
    const erreur =
      typeof corps?.erreur === "string" ? corps.erreur : "L'opération a échoué. Réessayez.";
    console.error(`[admin] refus de l'Edge Function (HTTP ${reponse.status}) : ${erreur}`);
    return { ok: false, statut: reponse.status, corps, erreur };
  }

  return { ok: true, statut: reponse.status, corps };
}
