// Relais vers l'Edge Function admin-webinaire.
//
// Toute la raison d'être de cette route : X-Admin-Secret ne doit jamais
// atteindre le navigateur. La page appelle ici, cette route appelle l'Edge
// Function. Même schéma que /api/inscription-webinaire.
//
// Elle vérifie le cookie de session avant de relayer : sans ce contrôle,
// n'importe qui pourrait piloter les webinaires en postant sur cette URL,
// et le mot de passe de la page ne protégerait plus rien.

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_SESSION, jetonValide } from "@/lib/admin/session";
import { appelerAdminApi } from "@/lib/admin/appelApi";

export const runtime = "nodejs";

/** Actions du contrat. Toute autre valeur est refusée avant d'atteindre l'API. */
const ACTIONS = new Set(["lister", "configurer", "changer_statut", "creer"]);

export async function POST(requete: Request) {
  const boite = await cookies();
  if (!jetonValide(boite.get(COOKIE_SESSION)?.value)) {
    return NextResponse.json({ error: "Session expirée. Reconnectez-vous." }, { status: 401 });
  }

  let charge: Record<string, unknown>;
  try {
    charge = (await requete.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Requête illisible." }, { status: 400 });
  }

  if (typeof charge.action !== "string" || !ACTIONS.has(charge.action)) {
    return NextResponse.json({ error: "Action inconnue." }, { status: 400 });
  }

  const resultat = await appelerAdminApi(charge);

  if (!resultat.ok) {
    return NextResponse.json(
      { error: resultat.erreur ?? "L'opération a échoué. Réessayez." },
      { status: resultat.statut >= 500 ? 502 : resultat.statut },
    );
  }

  return NextResponse.json(resultat.corps ?? { success: true });
}
