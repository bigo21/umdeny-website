// Résolution de l'image de couverture du lecteur vidéo.
//
// Module serveur : Vimeo n'expose sa vignette que par un appel à son API, qui
// n'a rien à faire dans le rendu client. La page étant prérendue, cet appel a
// lieu à la compilation — le visiteur ne paie rien.
//
// Objectif : une couverture apparaît quelle que soit la source, sans rien
// avoir à renseigner à la main.
//
//   youtube  vignette déduite de l'identifiant, sans appel réseau
//   vimeo    vignette lue via oEmbed à la compilation
//   fichier  première image du fichier, peinte par le navigateur (Webinaire.tsx)
//
// Un `poster` explicite dans config.ts l'emporte toujours sur ces trois voies.

import "server-only";
import type { VideoPresentation } from "./config";

export async function resoudrePoster(video: VideoPresentation | null): Promise<string | null> {
  if (!video) return null;
  if (video.poster) return video.poster;

  switch (video.hebergeur) {
    case "youtube":
      // Vignette en pleine définition. Elle n'existe pas pour toutes les
      // vidéos ; Webinaire.tsx retombe alors sur hqdefault, qui existe
      // toujours. Vérifier ici coûterait une requête réseau à chaque build,
      // pour un cas que le navigateur rattrape seul.
      return `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`;
    case "vimeo":
      return vignetteVimeo(video.id);
    case "fichier":
      // Pas d'image à extraire côté serveur : c'est le navigateur qui peindra
      // la première image du fichier.
      return null;
  }
}

async function vignetteVimeo(id: string): Promise<string | null> {
  try {
    const reponse = await fetch(
      // « width » commande la taille de la vignette renvoyée. Sans lui, Vimeo
      // sert un 295x166 illisible sur un cadre pleine largeur ; 1280 est le
      // maximum, au-delà la valeur est ignorée.
      `https://vimeo.com/api/oembed.json?url=https%3A%2F%2Fvimeo.com%2F${encodeURIComponent(id)}&width=1280`,
      {
        // « force-cache » est indispensable : sans lui le fetch est réputé
        // dynamique et fait basculer toute la page en rendu à la demande,
        // alors qu'elle est prérendue statiquement aujourd'hui.
        cache: "force-cache",
        // Ce fetch a lieu pendant le build. Sans délai maximal, une API qui ne
        // répond pas fige la compilation entière — sur Vercel comme en local.
        signal: AbortSignal.timeout(5000),
      },
    );
    if (!reponse.ok) {
      console.warn(`[webinaire] vignette Vimeo indisponible (HTTP ${reponse.status}).`);
      return null;
    }
    const donnees = (await reponse.json()) as { thumbnail_url?: string };
    return donnees.thumbnail_url ?? null;
  } catch (cause) {
    // Un build hors ligne, ou une API injoignable, ne doit pas faire échouer la
    // page entière : on se rabat sur le fond rayé.
    console.warn("[webinaire] vignette Vimeo introuvable :", cause);
    return null;
  }
}
