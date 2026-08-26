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

  // Contrôle de configuration AVANT toute comparaison, et c'est l'ordre qui
  // compte. Sans mot de passe défini, la comparaison échoue de toute façon :
  // l'exploitant lisait donc « mot de passe incorrect » alors que le vrai
  // problème était une variable absente, ce qui envoie chercher au mauvais
  // endroit — vécu, et coûteux.
  //
  // Cet échec ne compte PAS dans la temporisation : il ne vient pas de celui
  // qui saisit, et le bloquer cinq minutes pour une erreur de déploiement
  // ajouterait une punition à une panne.
  if (!process.env.ADMIN_PASSWORD) {
    console.error("[admin] ADMIN_PASSWORD absente : connexion impossible.");
    return NextResponse.json(
      { error: "Configuration serveur incomplète : le mot de passe n'est pas défini côté serveur." },
      { status: 503 },
    );
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
    console.error("[admin] création du jeton impossible.");
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
