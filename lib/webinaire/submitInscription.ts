// Envoi de l'inscription au webinaire, via le relais interne.
//
// La page ne parle jamais directement à Supabase : elle poste sur
// /api/inscription-webinaire, qui transmet à l'Edge Function
// « inscription-webinaire » avec la clé anon.
//
// Ce détour vaut deux choses. La clé reste côté serveur, ce qui évite
// d'introduire la première variable NEXT_PUBLIC_ du dépôt pour une valeur qui
// n'a pas besoin d'être publique ici. Et l'URL de la fonction, comme le format
// exact de son contrat, ne fuient pas dans le paquet servi au navigateur.
//
// L'écriture en base, l'email de confirmation et l'ajout du contact dans Brevo
// sont le rôle exclusif de l'Edge Function : rien de tout cela n'est reproduit
// ici ni dans le relais.

import type { Inscription } from "./types";
import type { Tracking } from "./tracking";

export const INSCRIPTION_ENDPOINT = "/api/inscription-webinaire";

export interface ResultatInscription {
  /**
   * Faux lorsque l'inscription est bien enregistrée mais que l'email de
   * confirmation n'a pas pu partir. L'écran de succès le dit alors, plutôt que
   * de promettre un email qui n'arrivera pas.
   */
  emailConfirmationEnvoye: boolean;
}

export async function submitInscription(
  inscription: Inscription,
  tracking: Tracking,
): Promise<ResultatInscription> {
  const reponse = await fetch(INSCRIPTION_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ inscription, tracking }),
  });

  const corps = (await reponse.json().catch(() => null)) as
    | { error?: string; emailConfirmationEnvoye?: boolean }
    | null;

  if (!reponse.ok) {
    throw new Error(corps?.error ?? "L'envoi de votre inscription a échoué. Merci de réessayer.");
  }

  // Absence du drapeau traitée comme un envoi réussi : le message nuancé n'a de
  // sens que si l'échec est explicitement rapporté.
  return { emailConfirmationEnvoye: corps?.emailConfirmationEnvoye !== false };
}
