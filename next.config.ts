import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // Le quiz de candidature a déménagé sous /candidature, pour laisser
        // /apporteur-affaires devenir l'accueil du programme.
        //
        // « permanent: false » est délibéré, et c'est le point important : un
        // 308 permanent serait mis en cache par les navigateurs sans date
        // d'expiration. Le jour où /apporteur-affaires servira sa page
        // d'accueil, tous ceux ayant emprunté l'ancien lien continueraient
        // d'atterrir sur le quiz, sans qu'aucun déploiement n'y change quoi
        // que ce soit. Le 307 reste révocable.
        //
        // À retirer quand la page d'accueil du programme sera en ligne.
        source: "/apporteur-affaires",
        destination: "/apporteur-affaires/candidature",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
