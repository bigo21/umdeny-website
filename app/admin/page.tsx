import type { Metadata } from "next";
import { cookies } from "next/headers";
import { appelerAdminApi } from "@/lib/admin/appelApi";
import { isoVersChampLocal } from "@/lib/admin/date";
import { COOKIE_SESSION, jetonValide } from "@/lib/admin/session";
import { Connexion } from "./Connexion";
import { Console, type SessionAffichee } from "./Console";
import "./admin.css";

export const metadata: Metadata = {
  title: "Administration · Umdeny Capital",
  // Une page d'administration n'a rien à faire dans un index, même protégée.
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const boite = await cookies();
  if (!jetonValide(boite.get(COOKIE_SESSION)?.value)) {
    return <Connexion />;
  }

  const resultat = await appelerAdminApi({ action: "lister" });

  const brutes = Array.isArray(resultat.corps?.sessions)
    ? (resultat.corps.sessions as Record<string, unknown>[])
    : [];

  // Les dates sont converties ici, une seule fois, et transmises déjà mises en
  // forme. Les convertir aussi côté client exposerait à une divergence
  // d'hydratation, l'ICU de Node et celle du navigateur pouvant différer.
  const sessions: SessionAffichee[] = brutes.map((s) => ({
    id: String(s.id ?? ""),
    libelle: typeof s.libelle === "string" ? s.libelle : "",
    dateIso: typeof s.date_webinaire === "string" ? s.date_webinaire : null,
    dateChamp: isoVersChampLocal(typeof s.date_webinaire === "string" ? s.date_webinaire : null),
    statut: typeof s.statut === "string" ? s.statut : "planifie",
    lienLive: typeof s.lien_live === "string" ? s.lien_live : "",
    lienReplay: typeof s.lien_replay === "string" ? s.lien_replay : "",
    nbInscrits: typeof s.nb_inscrits === "number" ? s.nb_inscrits : 0,
  }));

  const avertissements = Array.isArray(resultat.corps?.avertissements)
    ? (resultat.corps.avertissements as unknown[]).filter(
        (a): a is string => typeof a === "string",
      )
    : [];

  return (
    <Console
      sessions={sessions}
      avertissements={avertissements}
      erreurChargement={resultat.ok ? null : (resultat.erreur ?? "Chargement impossible.")}
    />
  );
}
