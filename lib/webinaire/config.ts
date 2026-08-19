// =====================================================
// CONFIGURATION DU WEBINAIRE APPORTEURS D'AFFAIRES
//
// Seul fichier à modifier quand la date, la durée ou la vidéo de présentation
// sont arrêtées : aucune de ces valeurs n'est écrite en dur dans le rendu.
//
// Convention : `null` signifie « pas encore fourni ». La page affiche alors un
// placeholder explicite plutôt qu'une valeur inventée, et la section reste en
// place — la maquette demeure relisible par le client tant que l'information
// manque.
// =====================================================

/** Affiché à la place d'une valeur encore absente de la configuration. */
export const A_CONFIRMER = "À confirmer prochainement";

/**
 * DATE DU PROCHAIN WEBINAIRE — seule valeur à mettre à jour.
 *
 * Format ISO 8601 avec fuseau, par exemple "2026-09-17T18:00:00+01:00".
 *
 * Une seule constante et non deux : c'est elle qui part dans le champ
 * `date_webinaire` du payload d'inscription, et c'est d'elle qu'est déduit le
 * libellé affiché dans l'encart. Deux valeurs tenues à la main finiraient par
 * diverger, et la divergence serait invisible — l'écran annoncerait une date,
 * la base en enregistrerait une autre.
 *
 * `null` tant que la date n'est pas arrêtée : la ligne « Date » affiche alors
 * son libellé d'attente, et le champ est omis du payload, où le contrat de
 * l'Edge Function le déclare optionnel.
 *
 * ATTENTION — à confirmer AVANT l'ouverture du formulaire. Cette valeur est
 * recopiée dans chaque inscription au moment où elle est enregistrée, et c'est
 * la copie en base, non cette constante, que lisent les rappels J-1 et H-1.
 * La modifier plus tard ne rattrape donc pas les inscriptions déjà prises :
 * elles garderont l'ancienne date et leurs rappels partiront à la mauvaise
 * heure. Il faudrait alors un UPDATE des lignes existantes, à demander à
 * l'équipe backend.
 */
export const DATE_PROCHAIN_WEBINAIRE: string | null = "2026-08-20T18:00:00+01:00";

/** Fuseau du siège, à Yaoundé. Le Cameroun ne pratique pas d'heure d'été. */
const FUSEAU = "Africa/Douala";

/**
 * Libellé affiché de la date, déduit de DATE_PROCHAIN_WEBINAIRE.
 *
 * À n'appeler que côté serveur — page.tsx le fait et transmet le résultat.
 * L'ICU de Node et celle du navigateur peuvent formater différemment ; si le
 * serveur et le client calculaient chacun ce libellé, la différence
 * provoquerait une erreur d'hydratation.
 */
export function libelleDateWebinaire(): string | null {
  if (!DATE_PROCHAIN_WEBINAIRE) return null;

  const date = new Date(DATE_PROCHAIN_WEBINAIRE);
  if (Number.isNaN(date.getTime())) {
    // Une date mal saisie ne doit pas casser la page : on retombe sur le
    // libellé d'attente, en laissant une trace dans les journaux.
    console.warn("[webinaire] DATE_PROCHAIN_WEBINAIRE illisible :", DATE_PROCHAIN_WEBINAIRE);
    return null;
  }

  const jour = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: FUSEAU,
  }).format(date);

  const heure = new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: FUSEAU,
  })
    .format(date)
    .replace(":", "h");

  const decalage =
    new Intl.DateTimeFormat("fr-FR", { timeZone: FUSEAU, timeZoneName: "shortOffset" })
      .formatToParts(date)
      .find((partie) => partie.type === "timeZoneName")?.value ?? "";

  return `${jour.charAt(0).toUpperCase()}${jour.slice(1)} · ${heure}${decalage ? ` (${decalage})` : ""}`;
}

/**
 * Vidéo de présentation. Le lecteur n'est chargé qu'au clic (voir la façade
 * dans Webinaire.tsx) : tant que le visiteur ne lance pas la lecture, aucune
 * requête ne part vers YouTube ou Vimeo.
 */
/**
 * `poster` est facultatif partout : la couverture est résolue automatiquement
 * quand la source le permet (voir poster.ts). Ne le renseigner que pour imposer
 * une image précise, ou pour un fichier hébergé par nous.
 */
export type VideoPresentation =
  | { hebergeur: "youtube"; id: string; poster?: string }
  | { hebergeur: "vimeo"; id: string; poster?: string }
  | { hebergeur: "fichier"; src: string; poster?: string };

export interface ConfigWebinaire {
  /** Ex. : "45 minutes". */
  duree: string | null;
  /** Ex. : "En direct (Live)". */
  format: string | null;
  /** `null` tant que la vidéo n'est pas fournie : la façade reste affichée. */
  video: VideoPresentation | null;
}

export const WEBINAIRE: ConfigWebinaire = {
  duree: "Environ 60 minutes",
  format: "En ligne (visioconférence)",
  video: null,
};

/**
 * Toutes les vidéos YouTube n'ont pas de vignette en pleine définition, alors
 * que hqdefault existe toujours. Renvoie `null` dès qu'il n'y a plus de repli
 * à tenter, ce qui empêche la boucle de rechargement côté navigateur.
 */
export function posterDeRepli(url: string): string | null {
  return url.includes("/maxresdefault.jpg") ? url.replace("/maxresdefault.jpg", "/hqdefault.jpg") : null;
}

/**
 * URL d'intégration du lecteur, construite au moment du clic.
 *
 * `autoplay=1` est légitime ici : la lecture fait suite à une action explicite
 * du visiteur, ce n'est pas un démarrage automatique au chargement.
 * YouTube passe par le domaine « nocookie », qui ne dépose pas de cookie
 * publicitaire tant que la vidéo n'est pas lue.
 *
 * `origine` doit être l'origine de la page hôte (window.location.origin).
 * YouTube la réclame dans sa documentation d'intégration, et son absence est
 * une cause connue de l'écran « An error occurred. Please try again later.
 * (Playback ID …) » — le lecteur se charge, puis refuse de démarrer.
 * Le paramètre est omis si l'origine est inconnue, ce qui n'arrive qu'au
 * rendu serveur, où l'iframe n'est de toute façon jamais produite.
 *
 * `modestbranding` a disparu : YouTube l'ignore depuis 2023.
 */
export function urlLecteur(video: VideoPresentation, origine?: string): string | null {
  switch (video.hebergeur) {
    case "youtube": {
      const parametres = new URLSearchParams({ autoplay: "1", rel: "0" });
      if (origine) parametres.set("origin", origine);
      return `https://www.youtube-nocookie.com/embed/${video.id}?${parametres}`;
    }
    case "vimeo":
      return `https://player.vimeo.com/video/${video.id}?autoplay=1`;
    case "fichier":
      // Servie par la balise <video>, pas par une iframe.
      return null;
  }
}

/**
 * Liens du pied de page. `href: null` tant que la page correspondante n'existe
 * pas : le libellé est alors rendu en texte simple. Un lien mort vers "#" sur
 * une politique de confidentialité, que la case de consentement RGPD du
 * formulaire référence explicitement, serait pire que pas de lien du tout.
 */
export const LIENS_LEGAUX: { label: string; href: string | null }[] = [
  { label: "Politique de confidentialité", href: null },
  { label: "Mentions légales", href: null },
  { label: "Conditions d'utilisation", href: null },
];
