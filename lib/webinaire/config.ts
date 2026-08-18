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
export const A_CONFIRMER = "À confirmer";

/**
 * Vidéo de présentation. Le lecteur n'est chargé qu'au clic (voir la façade
 * dans Webinaire.tsx) : tant que le visiteur ne lance pas la lecture, aucune
 * requête ne part vers YouTube ou Vimeo.
 */
export type VideoPresentation =
  | { hebergeur: "youtube"; id: string }
  | { hebergeur: "vimeo"; id: string }
  | { hebergeur: "fichier"; src: string; poster?: string };

export interface ConfigWebinaire {
  /** Date et heure, fuseau compris. Ex. : "Jeudi 12 mars 2026 · 18h00 (GMT+1)". */
  date: string | null;
  /** Ex. : "45 minutes". */
  duree: string | null;
  /** Ex. : "En direct (Live)". */
  format: string | null;
  /** `null` tant que la vidéo n'est pas fournie : la façade reste affichée. */
  video: VideoPresentation | null;
}

export const WEBINAIRE: ConfigWebinaire = {
  date: null,
  duree: null,
  format: "En direct (Live)",
  video: null,
};

/**
 * URL d'intégration du lecteur, construite au moment du clic.
 *
 * `autoplay=1` est légitime ici : la lecture fait suite à une action explicite
 * du visiteur, ce n'est pas un démarrage automatique au chargement.
 * YouTube passe par le domaine « nocookie », qui ne dépose pas de cookie
 * publicitaire tant que la vidéo n'est pas lue.
 */
export function urlLecteur(video: VideoPresentation): string | null {
  switch (video.hebergeur) {
    case "youtube":
      return `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`;
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
