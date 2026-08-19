// Lecture de la session de webinaire en cours de programmation.
//
// Module serveur : l'appel porte la clé anon, qui n'a pas à atteindre le
// navigateur, et le cahier interdit d'interroger les tables Supabase depuis le
// site — tout passe par une Edge Function.
//
// La date n'est plus une constante de ce dépôt. Elle vit dans la table
// `webinaires` côté backend, seule source de vérité : c'est elle que lisent le
// rappel H-1, le job de réconciliation qui repousse la date vers Brevo, et
// désormais cette page. La modifier là-bas suffit, sans redéploiement ici.

import "server-only";

export interface ProchainWebinaire {
  id: string | null;
  /** ISO 8601. Nul quand aucune session n'existe, ou qu'elle n'a pas de date. */
  dateWebinaire: string | null;
  statut: string | null;
}

const AUCUNE_SESSION: ProchainWebinaire = { id: null, dateWebinaire: null, statut: null };

const CHEMIN_FONCTION = "/functions/v1/prochain-webinaire";

/**
 * Fenêtre de fraîcheur de la page, alignée sur le Cache-Control de la fonction.
 *
 * C'est ce qui rend la page sensible à un changement de date sans
 * redéploiement : elle reste prérendue, et se régénère en arrière-plan au plus
 * tard une minute après la modification.
 */
const REVALIDATION_S = 60;

/** Le build ne doit pas dépendre indéfiniment d'un service tiers. */
const DELAI_MAX_MS = 8000;

export async function lireProchainWebinaire(): Promise<ProchainWebinaire> {
  const url = process.env.SUPABASE_URL;
  const cle = process.env.SUPABASE_ANON_KEY;

  if (!url || !cle) {
    console.warn("[webinaire] SUPABASE_URL ou SUPABASE_ANON_KEY absente : date inconnue.");
    return AUCUNE_SESSION;
  }

  try {
    const reponse = await fetch(`${url}${CHEMIN_FONCTION}`, {
      headers: { Authorization: `Bearer ${cle}` },
      next: { revalidate: REVALIDATION_S },
      signal: AbortSignal.timeout(DELAI_MAX_MS),
    });

    if (!reponse.ok) {
      console.warn(`[webinaire] prochain-webinaire indisponible (HTTP ${reponse.status}).`);
      return AUCUNE_SESSION;
    }

    const corps = (await reponse.json()) as {
      id?: string | null;
      date_webinaire?: string | null;
      statut?: string | null;
    };

    return {
      id: corps.id ?? null,
      dateWebinaire: corps.date_webinaire ?? null,
      statut: corps.statut ?? null,
    };
  } catch (cause) {
    // Une fonction injoignable ne doit pas faire échouer la page : on retombe
    // sur le libellé d'attente, qui reste exact — la date est bien inconnue de
    // notre point de vue.
    console.warn("[webinaire] lecture de la session impossible :", cause);
    return AUCUNE_SESSION;
  }
}
