// Envoi de l'inscription au webinaire vers la route API.
//
// ─────────────────────────────────────────────────────────────────────────────
// POINT DE RACCORDEMENT — la route et sa table Supabase n'existent pas encore.
//
// Tant que ce n'est pas le cas, un POST partirait bel et bien et recevrait un
// 404 que le visiteur lirait comme une panne. On refuse donc franchement, avec
// un message qui a du sens pour lui, plutôt que d'afficher une confirmation
// mensongère alors que rien n'est enregistré.
//
// Pour brancher la persistance : créer POST /api/inscription-webinaire sur le
// modèle de app/api/candidature-apporteur/route.ts (insertion service_role dans
// le schéma umdeny_apporteur, emails Resend en best-effort), puis passer
// ROUTE_DISPONIBLE à true. Le reste de cette fonction est déjà écrit.
// ─────────────────────────────────────────────────────────────────────────────

import type { Inscription } from "./types";

export const INSCRIPTION_ENDPOINT = "/api/inscription-webinaire";

// L'annotation `: boolean` est délibérée : sans elle TypeScript déduit le type
// littéral `false` et signale tout ce qui suit le `throw` comme du code mort.
const ROUTE_DISPONIBLE: boolean = false;

export async function submitInscription(inscription: Inscription): Promise<void> {
  if (!ROUTE_DISPONIBLE) {
    throw new Error(
      "Les inscriptions en ligne ne sont pas encore ouvertes. Merci de réessayer dans quelques jours.",
    );
  }

  const response = await fetch(INSCRIPTION_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ inscription }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "L'envoi de votre inscription a échoué. Merci de réessayer.");
  }
}
