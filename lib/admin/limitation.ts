// Temporisation après échecs de connexion.
//
// Un mot de passe unique en variable d'environnement n'offre aucune limite de
// tentatives : sans ce garde-fou, la page se force à la vitesse du réseau. Et
// elle ne protège pas qu'elle-même — elle pilote des envois d'emails à toute
// la liste des inscrits.
//
// LIMITE CONNUE, à ne pas surestimer : ce compteur vit en mémoire du
// processus. Sur Vercel, plusieurs instances coexistent et redémarrent, donc
// un attaquant réparti échappera en partie au comptage. C'est un ralentisseur,
// pas une serrure. Le jour où cette page justifie mieux, il faudra un compteur
// partagé — Supabase ou un cache externe.

import "server-only";

const MAX_ECHECS = 5;
const BLOCAGE_MS = 5 * 60 * 1000;
/** Au-delà, on repart de zéro : un échec isolé il y a une heure ne compte plus. */
const OUBLI_MS = 15 * 60 * 1000;

interface Compteur {
  echecs: number;
  dernier: number;
  bloqueJusqua: number;
}

const compteurs = new Map<string, Compteur>();

/** Empêche la table de croître indéfiniment sur une instance de longue durée. */
function purger(maintenant: number) {
  for (const [cle, c] of compteurs) {
    if (maintenant - c.dernier > OUBLI_MS && maintenant > c.bloqueJusqua) compteurs.delete(cle);
  }
}

/** Secondes restantes avant de pouvoir réessayer, 0 si la voie est libre. */
export function attenteRestante(cle: string): number {
  const maintenant = Date.now();
  purger(maintenant);
  const c = compteurs.get(cle);
  if (!c || maintenant >= c.bloqueJusqua) return 0;
  return Math.ceil((c.bloqueJusqua - maintenant) / 1000);
}

export function noterEchec(cle: string): void {
  const maintenant = Date.now();
  const c = compteurs.get(cle) ?? { echecs: 0, dernier: maintenant, bloqueJusqua: 0 };

  if (maintenant - c.dernier > OUBLI_MS) c.echecs = 0;

  c.echecs += 1;
  c.dernier = maintenant;
  if (c.echecs >= MAX_ECHECS) {
    c.bloqueJusqua = maintenant + BLOCAGE_MS;
    c.echecs = 0;
  }
  compteurs.set(cle, c);
}

export function noterSucces(cle: string): void {
  compteurs.delete(cle);
}

/**
 * Identifie l'appelant. X-Forwarded-For est fourni par Vercel ; sa première
 * entrée est l'adresse du client. Repli sur une clé unique quand l'en-tête
 * manque : mieux vaut compter tout le monde ensemble que ne compter personne.
 */
export function cleAppelant(requete: Request): string {
  const transmis = requete.headers.get("x-forwarded-for");
  return transmis?.split(",")[0]?.trim() || "inconnu";
}
