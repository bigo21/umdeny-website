// Composition du numéro de téléphone au format E.164.
//
// Brevo refuse LA REQUÊTE ENTIÈRE quand l'attribut SMS n'est pas en E.164 :
// le contact n'est pas créé du tout, pas seulement le téléphone perdu. Le
// backend Supabase normalise désormais de son côté, mais mieux vaut envoyer
// une donnée juste que compter sur un rattrapage.
//
// Format visé : indicatif puis chiffres, sans aucun séparateur. +237657559616

export interface Indicatif {
  /** Code ISO 3166-1 alpha-2, sert de clé de liste. */
  code: string;
  pays: string;
  /** Indicatif téléphonique, « + » compris. */
  indicatif: string;
}

/**
 * Pays proposés, dans l'ordre d'affichage : le Cameroun d'abord, puis les
 * principales destinations de la diaspora, puis les voisins d'Afrique
 * centrale et de l'Ouest.
 *
 * Liste volontairement courte plutôt qu'exhaustive : elle couvre l'audience
 * réelle du programme sans imposer un menu de deux cents entrées. En ajouter
 * un est une ligne à écrire ici, et le champ reste facultatif pour qui n'y
 * figure pas.
 */
export const INDICATIFS: Indicatif[] = [
  { code: "CM", pays: "Cameroun", indicatif: "+237" },
  { code: "FR", pays: "France", indicatif: "+33" },
  { code: "BE", pays: "Belgique", indicatif: "+32" },
  { code: "CH", pays: "Suisse", indicatif: "+41" },
  { code: "CA", pays: "Canada", indicatif: "+1" },
  { code: "US", pays: "États-Unis", indicatif: "+1" },
  { code: "GB", pays: "Royaume-Uni", indicatif: "+44" },
  { code: "DE", pays: "Allemagne", indicatif: "+49" },
  { code: "IT", pays: "Italie", indicatif: "+39" },
  { code: "ES", pays: "Espagne", indicatif: "+34" },
  { code: "NL", pays: "Pays-Bas", indicatif: "+31" },
  { code: "GA", pays: "Gabon", indicatif: "+241" },
  { code: "CG", pays: "Congo-Brazzaville", indicatif: "+242" },
  { code: "CD", pays: "RD Congo", indicatif: "+243" },
  { code: "TD", pays: "Tchad", indicatif: "+235" },
  { code: "CF", pays: "Centrafrique", indicatif: "+236" },
  { code: "GQ", pays: "Guinée équatoriale", indicatif: "+240" },
  { code: "CI", pays: "Côte d'Ivoire", indicatif: "+225" },
  { code: "SN", pays: "Sénégal", indicatif: "+221" },
  { code: "ML", pays: "Mali", indicatif: "+223" },
  { code: "BF", pays: "Burkina Faso", indicatif: "+226" },
  { code: "BJ", pays: "Bénin", indicatif: "+229" },
  { code: "TG", pays: "Togo", indicatif: "+228" },
  { code: "NE", pays: "Niger", indicatif: "+227" },
  { code: "GN", pays: "Guinée", indicatif: "+224" },
  { code: "NG", pays: "Nigeria", indicatif: "+234" },
  { code: "GH", pays: "Ghana", indicatif: "+233" },
  { code: "MA", pays: "Maroc", indicatif: "+212" },
  { code: "DZ", pays: "Algérie", indicatif: "+213" },
  { code: "TN", pays: "Tunisie", indicatif: "+216" },
  { code: "ZA", pays: "Afrique du Sud", indicatif: "+27" },
  { code: "AE", pays: "Émirats arabes unis", indicatif: "+971" },
];

/** Cameroun : le programme s'adresse d'abord au marché local. */
export const INDICATIF_PAR_DEFAUT = "CM";

/** Longueur minimale plausible, indicatif exclu. En deçà, c'est une saisie interrompue. */
const CHIFFRES_MIN = 6;
/** E.164 plafonne à 15 chiffres, indicatif compris. */
const CHIFFRES_MAX = 15;

/**
 * Chiffres du numéro au format international, indicatif compris et « + » exclu.
 *
 * Base commune à la composition et au contrôle de saisie : les deux doivent
 * juger la même chaîne. Mesurer la saisie d'un côté et le numéro composé de
 * l'autre laisserait passer un numéro que la composition refuse ensuite.
 *
 * Deux tolérances, parce que les gens collent autant qu'ils tapent :
 *
 *  - un numéro déjà international, commençant par « + » ou « 00 », est pris
 *    tel quel et l'indicatif choisi est ignoré. Le concaténer donnerait
 *    +237237657559616 ;
 *  - un zéro de tête est retiré. C'est le préfixe interurbain qu'on abandonne
 *    en international (le 06 français devient +336), et aucun numéro
 *    camerounais ne commence par zéro : le retirer ne peut pas nuire ici.
 */
function chiffresInternationaux(indicatif: string, saisie: string): string | null {
  const brut = saisie.trim();
  if (!brut) return null;

  if (brut.startsWith("+") || brut.startsWith("00")) {
    return brut.replace(/\D/g, "").replace(/^0+/, "") || null;
  }

  const national = brut.replace(/\D/g, "").replace(/^0/, "");
  if (!national) return null;

  return `${indicatif.replace(/\D/g, "")}${national}`;
}

/**
 * Assemble l'indicatif choisi et le numéro saisi en E.164.
 *
 * Renvoie `null` quand la saisie est vide : le champ est facultatif, et le
 * relais omet alors la clé du payload plutôt que d'envoyer une chaîne vide.
 *
 * Renvoie `null` aussi au-delà de 15 chiffres, plutôt que de tronquer. Une
 * troncature produirait un numéro syntaxiquement valide mais faux, qui
 * partirait ensuite en campagne SMS sans que rien ne signale l'erreur — un
 * refus visible vaut mieux qu'un faux plausible.
 */
export function composerE164(indicatif: string, saisie: string): string | null {
  const chiffres = chiffresInternationaux(indicatif, saisie);
  if (!chiffres || chiffres.length > CHIFFRES_MAX) return null;
  return `+${chiffres}`;
}

/**
 * Message d'erreur à afficher, ou `null` si la saisie est acceptable.
 *
 * Volontairement indulgent : on n'écarte que ce qui ne peut pas être un
 * numéro. Les plans de numérotation varient trop d'un pays à l'autre pour
 * qu'un contrôle strict ici rende service — et le champ est facultatif.
 */
export function erreurTelephone(indicatif: string, saisie: string): string | null {
  if (!saisie.trim()) return null;

  const chiffres = chiffresInternationaux(indicatif, saisie);
  if (!chiffres) return "Ce numéro ne contient aucun chiffre.";
  if (chiffres.length < CHIFFRES_MIN) return "Ce numéro semble incomplet.";
  if (chiffres.length > CHIFFRES_MAX) return "Ce numéro comporte trop de chiffres.";

  return null;
}
