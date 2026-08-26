// Connexion et déconnexion de la page d'administration.
//
// Le mot de passe ne transite que dans ce POST, jamais dans l'URL, et le
// cookie posé est httpOnly : un script de la page ne peut pas le lire.

import { NextResponse } from "next/server";
import { COOKIE_SESSION, creerJeton, motDePasseValide } from "@/lib/admin/session";
import { attenteRestante, cleAppelant, noterEchec, noterSucces } from "@/lib/admin/limitation";

export const runtime = "nodejs";

export async function POST(requete: Request) {
  const cle = cleAppelant(requete);

  const attente = attenteRestante(cle);
  if (attente > 0) {
    return NextResponse.json(
      { error: `Trop de tentatives. Réessayez dans ${attente} seconde${attente > 1 ? "s" : ""}.` },
      { status: 429 },
    );
  }

  let corps: { motDePasse?: unknown };
  try {
    corps = (await requete.json()) as { motDePasse?: unknown };
  } catch {
    return NextResponse.json({ error: "Requête illisible." }, { status: 400 });
  }

  const saisie = typeof corps.motDePasse === "string" ? corps.motDePasse : "";
  if (!saisie || !motDePasseValide(saisie)) {
    noterEchec(cle);
    // Message volontairement identique quelle que soit la cause : distinguer
    // « mot de passe vide » de « mot de passe faux » ne renseigne que celui
    // qui cherche.
    return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
  }

  const jeton = creerJeton();
  if (!jeton) {
    console.error("[admin] ADMIN_PASSWORD absente : connexion impossible.");
    return NextResponse.json({ error: "Configuration serveur incomplète." }, { status: 503 });
  }

  noterSucces(cle);

  const reponse = NextResponse.json({ ok: true });
  reponse.cookies.set(COOKIE_SESSION, jeton, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 8 * 60 * 60,
  });
  return reponse;
}

export async function DELETE() {
  const reponse = NextResponse.json({ ok: true });
  reponse.cookies.delete(COOKIE_SESSION);
  return reponse;
}
