// Authentification de la page d'administration.
//
// Deux secrets distincts, à ne pas confondre :
//   ADMIN_PASSWORD           mot de passe humain, saisi dans le formulaire
//   ADMIN_WEBINAIRE_SECRET   en-tête X-Admin-Secret de l'Edge Function
//
// Le second ne doit JAMAIS atteindre le navigateur : les appels partent du
// serveur, comme /api/inscription-webinaire le fait déjà. Le premier protège
// l'accès humain, le second protège l'API — compromettre l'un ne donne pas
// l'autre.
//
// L'import de « server-only » fait échouer le build si ce module est tiré
// depuis un composant client, plutôt que de laisser fuiter un secret.

import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

export const COOKIE_SESSION = "umdeny_admin";

/** Au-delà, il faut ressaisir le mot de passe. */
const DUREE_SESSION_MS = 8 * 60 * 60 * 1000;

/**
 * Compare deux chaînes sans fuir leur longueur ni la position du premier
 * caractère divergent. Une comparaison par « === » sort au premier écart, ce
 * qui laisse mesurer la progression essai après essai.
 */
function egaliteConstante(a: string, b: string): boolean {
  const tampon = Buffer.from(a);
  const attendu = Buffer.from(b);
  if (tampon.length !== attendu.length) {
    // timingSafeEqual exige des longueurs égales. On compare quand même
    // quelque chose, pour ne pas répondre plus vite sur une longueur fausse.
    timingSafeEqual(tampon, tampon);
    return false;
  }
  return timingSafeEqual(tampon, attendu);
}

export function motDePasseValide(saisie: string): boolean {
  const attendu = process.env.ADMIN_PASSWORD;
  if (!attendu) {
    console.error("[admin] ADMIN_PASSWORD absente : accès refusé par défaut.");
    return false;
  }
  return egaliteConstante(saisie, attendu);
}

/**
 * Jeton de session : « expiration.signature ».
 *
 * Signé avec le mot de passe lui-même plutôt qu'avec un second secret. Effet
 * recherché : changer le mot de passe invalide toutes les sessions ouvertes.
 * C'est ce qu'on attend d'une rotation — sinon révoquer un accès demanderait
 * une seconde manipulation qu'on oublierait.
 */
export function creerJeton(): string | null {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return null;
  const expiration = String(Date.now() + DUREE_SESSION_MS);
  return `${expiration}.${signer(expiration, secret)}`;
}

export function jetonValide(jeton: string | undefined): boolean {
  const secret = process.env.ADMIN_PASSWORD;
  if (!jeton || !secret) return false;

  const [expiration, signature] = jeton.split(".");
  if (!expiration || !signature) return false;

  if (!egaliteConstante(signature, signer(expiration, secret))) return false;

  const echeance = Number(expiration);
  return Number.isFinite(echeance) && echeance > Date.now();
}

function signer(charge: string, secret: string): string {
  return createHmac("sha256", secret).update(charge).digest("hex");
}
