import type { Metadata } from "next";
import { libelleDateWebinaire, WEBINAIRE } from "@/lib/webinaire/config";
import { resoudrePoster } from "@/lib/webinaire/poster";
import { lireProchainWebinaire } from "@/lib/webinaire/prochainWebinaire";
import { Webinaire } from "./Webinaire";

export const metadata: Metadata = {
  title: "Webinaire apporteurs d'affaires · Umdeny Capital",
  description:
    "Umdeny Capital ouvre son programme d'apporteurs d'affaires. Inscrivez-vous au webinaire de présentation pour découvrir l'opportunité en direct.",
};

export default async function WebinairePage() {
  // Résolu ici et non dans le composant client : la vignette Vimeo demande un
  // appel réseau. La page étant prérendue, il a lieu à la compilation.
  const poster = await resoudrePoster(WEBINAIRE.video);

  // La date vient de la table `webinaires`, seule source de vérité : la même
  // que lisent le rappel H-1 et le job de réconciliation. La lecture porte sa
  // propre revalidation, ce qui suffit à faire suivre la page quand la date
  // change, sans redéploiement.
  //
  // Le libellé est formaté ici, une seule fois, et transmis. Le calculer aussi
  // côté client exposerait à une divergence d'hydratation, l'ICU de Node et
  // celle du navigateur ne formatant pas toujours à l'identique.
  const session = await lireProchainWebinaire();
  const dateWebinaire = libelleDateWebinaire(session.dateWebinaire);

  return <Webinaire poster={poster} dateWebinaire={dateWebinaire} />;
}
