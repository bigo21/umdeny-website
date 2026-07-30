// Envoi de la candidature à la route API.
//
// Seules les réponses sont transmises : le score et les tags de priorité sont
// recalculés côté serveur, pour qu'un candidat ne puisse pas s'attribuer un
// tag en modifiant sa requête.

import type { Answers } from "./types";

export const CANDIDATURE_ENDPOINT = "/api/candidature-apporteur";

export async function submitCandidature(answers: Answers): Promise<void> {
  const response = await fetch(CANDIDATURE_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "L'envoi de votre candidature a échoué. Merci de réessayer.");
  }
}
