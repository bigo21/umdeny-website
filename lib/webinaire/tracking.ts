// Provenance de l'inscrit, capturée sans champ visible.
//
// Lue dans le navigateur et non côté serveur : le relais ne voit que sa propre
// requête, pas l'URL de la page ni le référent qui a amené le visiteur.
//
// Les valeurs sont tronquées avant envoi. Une URL de campagne peut être
// arbitrairement longue, et rien ne garantit qu'un paramètre d'entrée reste
// raisonnable — ce n'est pas au serveur de découvrir le problème.

/** Paires libres, transmises telles quelles dans le champ `tracking`. */
export type Tracking = Record<string, string>;

const LONGUEUR_MAX_VALEUR = 200;
const LONGUEUR_MAX_REFERENT = 500;

export function capterTracking(): Tracking {
  if (typeof window === "undefined") return {};

  const tracking: Tracking = {};

  for (const [cle, valeur] of new URLSearchParams(window.location.search)) {
    if (cle.startsWith("utm_") && valeur) {
      tracking[cle] = valeur.slice(0, LONGUEUR_MAX_VALEUR);
    }
  }

  const referent = hoteExterne(document.referrer);
  if (referent) {
    tracking.referrer = document.referrer.slice(0, LONGUEUR_MAX_REFERENT);
  }

  // utm_source fait foi quand la campagne l'a posé ; à défaut le domaine
  // d'origine renseigne déjà utilement, et « direct » couvre l'accès sans
  // référent — saisie de l'URL, favori, application de messagerie.
  tracking.source = tracking.utm_source ?? referent ?? "direct";
  tracking.landing = window.location.pathname;

  return tracking;
}

/**
 * Domaine du référent, uniquement s'il est externe. Une navigation interne au
 * site ne renseigne en rien sur l'acquisition : la retenir ferait passer notre
 * propre domaine pour une source de trafic.
 */
function hoteExterne(referent: string): string | null {
  if (!referent) return null;
  try {
    const hote = new URL(referent).hostname;
    return hote && hote !== window.location.hostname ? hote : null;
  } catch {
    return null;
  }
}
