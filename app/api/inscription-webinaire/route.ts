// =====================================================
// POST /api/inscription-webinaire
//
// Relais vers l'Edge Function Supabase « inscription-webinaire », qui porte
// seule l'écriture en base, l'email de confirmation via Resend et l'ajout du
// contact dans Brevo. Rien de cette logique n'est reproduit ici.
//
// Pourquoi un relais plutôt qu'un appel direct depuis le navigateur, que la
// clé anon autoriserait : elle reste ainsi côté serveur, sans introduire la
// première variable NEXT_PUBLIC_ du dépôt, et l'URL de la fonction ne part pas
// dans le paquet client.
//
// La validation faite ici ne remplace pas celle de l'Edge Function, qui
// revalide de toute façon : elle évite seulement de lui transmettre des
// requêtes manifestement vides, et rend les refus lisibles pour le visiteur.
// =====================================================

import { NextResponse } from "next/server";

export const runtime = "nodejs";

const CHEMIN_FONCTION = "/functions/v1/inscription-webinaire";

// L'Edge Function fait elle-même trois appels réseau (base, Resend, Brevo).
// Large, donc, mais borné : sans plafond, une fonction qui ne répond pas
// laisserait le visiteur devant un bouton qui tourne indéfiniment.
const DELAI_MAX_MS = 15000;

interface CorpsRecu {
  inscription?: {
    prenom?: unknown;
    nom?: unknown;
    email?: unknown;
    telephone?: unknown;
    consentementRgpd?: unknown;
    consentementContact?: unknown;
  };
  tracking?: unknown;
}

/** Volontairement permissif : le refus d'un email valide coûte plus qu'un aller-retour. */
const FORME_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function texteRequis(valeur: unknown): string | null {
  return typeof valeur === "string" && valeur.trim() ? valeur.trim() : null;
}

export async function POST(requete: Request) {
  let recu: CorpsRecu | null;
  try {
    recu = (await requete.json()) as CorpsRecu;
  } catch {
    return NextResponse.json({ error: "Corps de requête illisible." }, { status: 400 });
  }

  const inscription = recu?.inscription;
  const prenom = texteRequis(inscription?.prenom);
  const nom = texteRequis(inscription?.nom);
  const email = texteRequis(inscription?.email);

  if (!prenom || !nom || !email) {
    return NextResponse.json({ error: "Prénom, nom et email sont requis." }, { status: 400 });
  }
  if (!FORME_EMAIL.test(email)) {
    return NextResponse.json({ error: "Cette adresse email ne semble pas valide." }, { status: 400 });
  }
  if (inscription?.consentementRgpd !== true) {
    return NextResponse.json(
      { error: "Le consentement au traitement des données est requis." },
      { status: 400 },
    );
  }

  const url = process.env.SUPABASE_URL;
  const cle = process.env.SUPABASE_ANON_KEY;
  if (!url || !cle) {
    // Journalisé côté serveur, tenu hors du message rendu : une configuration
    // manquante est notre problème, pas une information à donner au visiteur.
    console.error("[inscription-webinaire] SUPABASE_URL ou SUPABASE_ANON_KEY absente.");
    return NextResponse.json(
      { error: "Service indisponible : configuration serveur incomplète." },
      { status: 503 },
    );
  }

  const telephone = telephoneCompact(inscription?.telephone);

  // Passage en snake_case, la casse du contrat. `telephone` est optionnel : on
  // l'omet plutôt que d'envoyer null, pour ne pas écrire une valeur vide en
  // base.
  //
  // Ni `date_webinaire` ni `webinaire_id` ne sont transmis : l'Edge Function
  // résout la session elle-même. Un identifiant venu du client devrait de toute
  // façon être validé côté serveur, et une date changée entre le rendu de la
  // page et la soumission rattacherait l'inscrit à une session périmée.
  const charge: Record<string, unknown> = {
    prenom,
    nom,
    email,
    consentement_rgpd: true,
    consentement_contact: inscription?.consentementContact === true,
    tracking: trackingAssaini(recu?.tracking),
  };
  if (telephone) charge.telephone = telephone;

  let reponse: Response;
  try {
    reponse = await fetch(`${url}${CHEMIN_FONCTION}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cle}`,
      },
      body: JSON.stringify(charge),
      signal: AbortSignal.timeout(DELAI_MAX_MS),
    });
  } catch (cause) {
    console.error("[inscription-webinaire] Edge Function injoignable :", cause);
    return NextResponse.json(
      { error: "Le service d'inscription ne répond pas. Merci de réessayer dans un instant." },
      { status: 504 },
    );
  }

  const corps = (await reponse.json().catch(() => null)) as {
    success?: boolean;
    id?: string;
    email_confirmation_envoye?: boolean;
    ajout_segment_brevo?: boolean;
    error?: string;
  } | null;

  if (!reponse.ok) {
    // 404 distingué du reste : c'est la signature d'une fonction pas encore
    // déployée, pas d'une panne. Sans ce cas, le visiteur lirait « erreur
    // technique » là où la cause est que le service n'existe pas encore.
    if (reponse.status === 404) {
      console.error("[inscription-webinaire] Edge Function non déployée sur ce projet Supabase.");
      return NextResponse.json(
        { error: "Les inscriptions ne sont pas encore ouvertes. Merci de réessayer prochainement." },
        { status: 503 },
      );
    }

    // 502/503/504 amont : la fonction ne tourne pas — redéploiement en cours,
    // runtime arrêté, passerelle indisponible. Ce n'est pas la même chose
    // qu'un échec de traitement, et le visiteur mérite de le savoir : ici
    // réessayer dans un instant a de bonnes chances de marcher.
    if (reponse.status === 502 || reponse.status === 503 || reponse.status === 504) {
      console.error(`[inscription-webinaire] Edge Function indisponible (HTTP ${reponse.status}).`);
      return NextResponse.json(
        { error: "Le service d'inscription ne répond pas. Merci de réessayer dans un instant." },
        { status: 503 },
      );
    }

    console.error(
      `[inscription-webinaire] Edge Function en échec (HTTP ${reponse.status}) :`,
      corps?.error ?? "sans message",
    );
    return NextResponse.json(
      { error: corps?.error ?? "L'envoi de votre inscription a échoué. Merci de réessayer." },
      { status: reponse.status >= 500 ? 502 : reponse.status },
    );
  }

  // Le contrat annonce un 201 avec success:true. Un 2xx qui dirait le
  // contraire ne doit pas être présenté comme une réussite au visiteur.
  if (corps?.success === false) {
    console.error("[inscription-webinaire] réponse 2xx mais success:false :", corps?.error);
    return NextResponse.json(
      { error: corps?.error ?? "L'envoi de votre inscription a échoué. Merci de réessayer." },
      { status: 502 },
    );
  }

  if (corps?.ajout_segment_brevo === false) {
    // N'affecte pas le visiteur, mais l'équipe marketing doit pouvoir le voir.
    // La réponse complète est jointe : le contrat ne prévoit pas de champ
    // d'erreur pour Brevo, donc le seul indice exploitable est ce que la
    // fonction a bien voulu renvoyer. Elle ne contient que l'identifiant de
    // l'inscription et des drapeaux, rien de personnel.
    console.warn(
      "[inscription-webinaire] contact non ajouté au segment Brevo. Réponse de la fonction :",
      JSON.stringify(corps),
    );
  }

  return NextResponse.json(
    {
      ok: true,
      id: corps?.id,
      emailConfirmationEnvoye: corps?.email_confirmation_envoye !== false,
    },
    { status: 201 },
  );
}

/**
 * Retire les séparateurs d'un numéro, sans rien refuser.
 *
 * Le formulaire compose déjà de l'E.164 ; ce filet ne vaut que pour un appel
 * direct à cette route. Volontairement permissif : le backend Supabase
 * normalise de son côté, et transmettre un numéro douteux vaut mieux que le
 * perdre en le refusant ici.
 */
function telephoneCompact(valeur: unknown): string | null {
  const brut = texteRequis(valeur);
  if (!brut) return null;
  const compact = brut.replace(/[\s.\-()]/g, "");
  return compact || null;
}

/**
 * Le tracking vient du navigateur : n'importe qui peut poster ce qu'il veut
 * dans ce champ. On ne garde que des paires de chaînes, en nombre et en
 * longueur bornés, pour ne pas relayer un objet arbitraire à l'Edge Function.
 */
function trackingAssaini(brut: unknown): Record<string, string> {
  if (!brut || typeof brut !== "object" || Array.isArray(brut)) return {};

  const propre: Record<string, string> = {};
  for (const [cle, valeur] of Object.entries(brut as Record<string, unknown>)) {
    if (Object.keys(propre).length >= 12) break;
    if (typeof valeur !== "string" || !valeur) continue;
    propre[cle.slice(0, 40)] = valeur.slice(0, 500);
  }
  return propre;
}
