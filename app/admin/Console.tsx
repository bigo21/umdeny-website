"use client";

// Console d'administration des sessions de webinaire.
//
// Périmètre volontairement restreint à la configuration des sessions : ni
// liste d'inscrits, ni action sur eux. Une page derrière un simple mot de
// passe ne doit pas devenir une seconde porte vers les données personnelles
// des candidats — le suivi nominatif reste dans Looker Studio.

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarClock,
  CirclePlus,
  LoaderCircle,
  LogOut,
  Send,
  TriangleAlert,
  Users,
} from "lucide-react";
import { champLocalVersIso } from "@/lib/admin/date";

const TRAIT = 1.7;

export interface SessionAffichee {
  id: string;
  libelle: string;
  dateIso: string | null;
  /** Déjà converti à l'heure de Yaoundé par la page, prêt pour datetime-local. */
  dateChamp: string;
  statut: string;
  lienLive: string;
  lienReplay: string;
  nbInscrits: number;
}

type Brouillon = Partial<Pick<SessionAffichee, "libelle" | "dateChamp" | "lienLive" | "lienReplay">>;

/** Ce qu'on s'apprête à faire, mis en attente le temps d'une confirmation. */
type Demande =
  | { genre: "configurer"; id: string; champs: Record<string, unknown> }
  | { genre: "statut"; id: string; statut: string };

interface Confirmation {
  demande: Demande;
  /** Session concernée : le panneau s'affiche dans sa carte. */
  id: string;
  titre: string;
  lignes: string[];
  /** true quand l'action a une conséquence fâcheuse et silencieuse. */
  alerte: boolean;
}

const STATUTS = [
  { valeur: "planifie", libelle: "Planifiée" },
  { valeur: "termine", libelle: "Terminée" },
  { valeur: "annule", libelle: "Annulée" },
];

export function Console({
  sessions,
  avertissements,
  erreurChargement,
}: {
  sessions: SessionAffichee[];
  avertissements: string[];
  erreurChargement: string | null;
}) {
  const router = useRouter();
  const [brouillons, setBrouillons] = useState<Record<string, Brouillon>>({});
  const [enCours, setEnCours] = useState<string | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [succes, setSucces] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  function valeur(session: SessionAffichee, champ: keyof Brouillon): string {
    return brouillons[session.id]?.[champ] ?? session[champ];
  }

  function modifier(id: string, champ: keyof Brouillon, v: string) {
    setBrouillons((p) => ({ ...p, [id]: { ...p[id], [champ]: v } }));
  }

  async function appeler(charge: Record<string, unknown>, cle: string, message: string) {
    setEnCours(cle);
    setErreur(null);
    setSucces(null);
    try {
      const reponse = await fetch("/api/admin/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(charge),
      });
      const corps = (await reponse.json().catch(() => null)) as { error?: string } | null;

      if (!reponse.ok) {
        setErreur(corps?.error ?? "L'opération a échoué.");
        return false;
      }
      setSucces(message);
      // router.refresh recharge le composant serveur : la liste et les dates
      // reviennent converties par le serveur, sans dupliquer ici la logique de
      // fuseau.
      router.refresh();
      return true;
    } catch {
      setErreur("Le serveur ne répond pas. Réessayez.");
      return false;
    } finally {
      setEnCours(null);
    }
  }

  /**
   * N'envoie que les champs réellement modifiés.
   *
   * Le contrat distingue un champ absent — laissé tel quel — d'un champ à null,
   * qui EFFACE la valeur. Renvoyer tout le formulaire écraserait donc des
   * champs qu'on ne voulait pas toucher.
   */
  function champsModifies(session: SessionAffichee): Record<string, unknown> {
    const b = brouillons[session.id];
    if (!b) return {};
    const champs: Record<string, unknown> = {};

    if (b.libelle !== undefined && b.libelle !== session.libelle) champs.libelle = b.libelle;
    if (b.lienLive !== undefined && b.lienLive !== session.lienLive) champs.lien_live = b.lienLive;
    if (b.lienReplay !== undefined && b.lienReplay !== session.lienReplay) {
      champs.lien_replay = b.lienReplay;
    }
    if (b.dateChamp !== undefined && b.dateChamp !== session.dateChamp) {
      champs.date_webinaire = champLocalVersIso(b.dateChamp);
    }
    return champs;
  }

  async function enregistrer(session: SessionAffichee) {
    const champs = champsModifies(session);
    if (Object.keys(champs).length === 0) {
      setErreur("Aucune modification à enregistrer.");
      return;
    }

    const demande: Demande = { genre: "configurer", id: session.id, champs };

    // Toute modification prévient désormais les inscrits, plus seulement la
    // date. Mieux vaut prévenir une fois de trop que laisser partir un email
    // sans l'annoncer.
    //
    // Le lien de replay fait bande à part : il ne va qu'aux ABSENTS, il est
    // porté par une autre tâche planifiée, et il ne se regroupe donc pas avec
    // les autres champs. C'est la seule combinaison qui produit deux emails.
    const toucheReplay = "lien_replay" in champs;
    const autres = Object.keys(champs).filter((c) => c !== "lien_replay");

    if (session.nbInscrits > 0 || toucheReplay) {
      const pluriel = session.nbInscrits > 1 ? "s" : "";
      // Aucun compte pour le replay : nb_inscrits le surestimerait
      // grossièrement, en annonçant tous les inscrits là où seuls les absents
      // le reçoivent.
      const titre =
        autres.length > 0
          ? `Cette modification préviendra jusqu'à ${session.nbInscrits} inscrit${pluriel} par email.`
          : "Cette modification préviendra les inscrits qui n'ont pas assisté à la session.";

      const lignes: string[] = [];
      if (autres.length > 0) {
        lignes.push("L'envoi n'est pas immédiat : ils seront prévenus dans les 5 minutes.");
      }
      if (toucheReplay) {
        lignes.push(
          autres.length > 0
            ? "Le lien de replay part séparément, aux seuls absents, et peut mettre jusqu'à 30 minutes : cet enregistrement produira donc deux emails."
            : "Ceux qui étaient présents ne le reçoivent pas. L'envoi peut prendre jusqu'à 30 minutes.",
        );
      } else {
        lignes.push("Plusieurs champs modifiés en une seule fois ne produisent qu'un seul email.");
      }

      setConfirmation({ demande, id: session.id, alerte: false, titre, lignes });
      return;
    }

    await appliquer(demande);
  }

  function changerStatut(session: SessionAffichee, statut: string) {
    const demande: Demande = { genre: "statut", id: session.id, statut };

    // L'annulation prévient bien les inscrits et retire la date de leurs
    // rappels. Elle reste la seule action irréversible au sens qui compte :
    // l'email parti ne se rattrape pas.
    if (statut === "annule") {
      setConfirmation({
        demande,
        id: session.id,
        alerte: true,
        titre: "Annuler enverra un email d'annulation aux inscrits.",
        lignes: [
          session.nbInscrits > 0
            ? `Jusqu'à ${session.nbInscrits} inscrit${session.nbInscrits > 1 ? "s" : ""} recevront le message, et leurs rappels seront supprimés.`
            : "Aucun inscrit pour l'instant : rien ne sera envoyé.",
          "Un email envoyé ne se rappelle pas. Vérifiez qu'il s'agit bien de la session à annuler.",
        ],
      });
      return;
    }

    // « Terminée » n'annonce rien : la session a eu lieu.
    void appliquer(demande);
  }

  async function appliquer(demande: Demande) {
    setConfirmation(null);
    if (demande.genre === "configurer") {
      const fait = await appeler(
        { action: "configurer", id: demande.id, ...demande.champs },
        `config-${demande.id}`,
        "Modifications enregistrées.",
      );
      if (fait) setBrouillons((p) => ({ ...p, [demande.id]: {} }));
      return;
    }
    await appeler(
      { action: "changer_statut", id: demande.id, statut: demande.statut },
      `statut-${demande.id}`,
      "Statut mis à jour.",
    );
  }

  async function deconnecter() {
    await fetch("/api/admin/connexion", { method: "DELETE" });
    window.location.reload();
  }

  return (
    <main className="ad-console">
      <header className="ad-entete">
        <div>
          <h1>Sessions de webinaire</h1>
          <p>Configuration des dates et des liens. Le suivi des inscrits reste dans Looker Studio.</p>
        </div>
        <button type="button" className="ad-bouton ad-bouton--fantome" onClick={deconnecter}>
          <LogOut size={15} strokeWidth={TRAIT} /> Se déconnecter
        </button>
      </header>

      {erreurChargement ? (
        <p className="ad-erreur" role="alert">
          <TriangleAlert size={16} strokeWidth={TRAIT} />
          <span>{erreurChargement}</span>
        </p>
      ) : null}

      {avertissements.map((a) => (
        <p key={a} className="ad-avertissement">
          <TriangleAlert size={16} strokeWidth={TRAIT} />
          <span>{a}</span>
        </p>
      ))}

      {erreur ? (
        <p className="ad-erreur" role="alert">
          <TriangleAlert size={16} strokeWidth={TRAIT} />
          <span>{erreur}</span>
        </p>
      ) : null}
      {succes ? (
        <p className="ad-succes" role="status">
          {succes}
        </p>
      ) : null}

      {sessions.length === 0 && !erreurChargement ? (
        <p className="ad-vide">Aucune session enregistrée pour l&apos;instant.</p>
      ) : null}

      {sessions.map((session) => (
        <section key={session.id} className="ad-carte">
          <div className="ad-carte__tete">
            <span className={`ad-pastille ad-pastille--${session.statut}`}>
              {STATUTS.find((s) => s.valeur === session.statut)?.libelle ?? session.statut}
            </span>
            <span className="ad-inscrits">
              <Users size={14} strokeWidth={TRAIT} /> {session.nbInscrits} inscrit
              {session.nbInscrits > 1 ? "s" : ""}
            </span>
          </div>

          <div className="ad-champ">
            <label htmlFor={`libelle-${session.id}`}>Libellé</label>
            <input
              id={`libelle-${session.id}`}
              type="text"
              value={valeur(session, "libelle")}
              onChange={(e) => modifier(session.id, "libelle", e.target.value)}
            />
          </div>

          <div className="ad-champ">
            <label htmlFor={`date-${session.id}`}>
              Date et heure <span className="ad-note">heure de Yaoundé (UTC+1)</span>
            </label>
            <input
              id={`date-${session.id}`}
              type="datetime-local"
              value={valeur(session, "dateChamp")}
              onChange={(e) => modifier(session.id, "dateChamp", e.target.value)}
            />
            <p className="ad-aide">
              Fixer, changer ou retirer la date prévient les inscrits par email, dans les
              5 minutes qui suivent.
            </p>
          </div>

          <p className="ad-aide ad-aide--bloc">
            Toute modification prévient les inscrits par email. Modifiez donc tout ce qui doit
            l&apos;être, puis enregistrez une seule fois : plusieurs champs changés ensemble ne
            produisent qu&apos;un seul message, là où un enregistrement par champ en produirait
            autant. Le lien de replay fait exception — il part à part, aux seuls absents — et
            retirer un lien sans le remplacer n&apos;envoie rien, puisqu&apos;il n&apos;y a rien à
            transmettre.
          </p>

          <div className="ad-champ--duo">
            <div className="ad-champ">
              <label htmlFor={`live-${session.id}`}>Lien du direct</label>
              <input
                id={`live-${session.id}`}
                type="url"
                placeholder="https://…"
                value={valeur(session, "lienLive")}
                onChange={(e) => modifier(session.id, "lienLive", e.target.value)}
              />
            </div>
            <div className="ad-champ">
              <label htmlFor={`replay-${session.id}`}>Lien du replay</label>
              <input
                id={`replay-${session.id}`}
                type="url"
                placeholder="https://…"
                value={valeur(session, "lienReplay")}
                onChange={(e) => modifier(session.id, "lienReplay", e.target.value)}
              />
            </div>
          </div>

          {confirmation?.id === session.id ? (
            <div
              className={"ad-confirmation" + (confirmation.alerte ? " ad-confirmation--alerte" : "")}
              role="alertdialog"
            >
              <p>
                {confirmation.alerte ? (
                  <TriangleAlert size={16} strokeWidth={TRAIT} />
                ) : (
                  <Send size={16} strokeWidth={TRAIT} />
                )}
                <span>
                  <strong>{confirmation.titre}</strong>
                  {confirmation.lignes.map((ligne) => (
                    <span key={ligne} className="ad-confirmation__ligne">
                      {ligne}
                    </span>
                  ))}
                </span>
              </p>
              <div className="ad-confirmation__actions">
                <button
                  type="button"
                  className="ad-bouton ad-bouton--or"
                  onClick={() => appliquer(confirmation.demande)}
                  disabled={enCours !== null}
                >
                  {confirmation.alerte ? "Continuer quand même" : "Confirmer et prévenir"}
                </button>
                <button
                  type="button"
                  className="ad-bouton ad-bouton--fantome"
                  onClick={() => setConfirmation(null)}
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : null}

          <div className="ad-carte__actions">
            <button
              type="button"
              className="ad-bouton ad-bouton--or"
              onClick={() => enregistrer(session)}
              disabled={enCours !== null}
            >
              {enCours === `config-${session.id}` ? (
                <>
                  <LoaderCircle size={15} strokeWidth={TRAIT} className="ad-tourne" /> Enregistrement…
                </>
              ) : (
                "Enregistrer"
              )}
            </button>

            <div className="ad-statut">
              <label htmlFor={`statut-${session.id}`}>Statut</label>
              <select
                id={`statut-${session.id}`}
                value={session.statut}
                onChange={(e) => changerStatut(session, e.target.value)}
                disabled={enCours !== null}
              >
                {STATUTS.map((s) => (
                  <option key={s.valeur} value={s.valeur}>
                    {s.libelle}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>
      ))}

      <Creation enCours={enCours} appeler={appeler} />
    </main>
  );
}

function Creation({
  enCours,
  appeler,
}: {
  enCours: string | null;
  appeler: (charge: Record<string, unknown>, cle: string, message: string) => Promise<boolean>;
}) {
  const [libelle, setLibelle] = useState("");
  // Coché par défaut, et c'est délibéré : créer une session sans clore la
  // précédente laisse deux sessions ouvertes, et c'est alors la plus ancienne,
  // déjà passée, qui continue de recevoir les nouveaux inscrits — sans que
  // rien ne le signale.
  const [cloturer, setCloturer] = useState(true);

  async function creer(evenement: React.FormEvent<HTMLFormElement>) {
    evenement.preventDefault();
    const fait = await appeler(
      { action: "creer", libelle: libelle.trim(), cloturer_courante: cloturer },
      "creation",
      "Session créée.",
    );
    if (fait) setLibelle("");
  }

  return (
    <form className="ad-carte ad-creation" onSubmit={creer}>
      <h2>
        <CalendarClock size={18} strokeWidth={TRAIT} /> Nouvelle session
      </h2>

      <div className="ad-champ">
        <label htmlFor="nouveau-libelle">Libellé</label>
        <input
          id="nouveau-libelle"
          type="text"
          required
          placeholder="Webinaire Apporteurs d'Affaires — octobre"
          value={libelle}
          onChange={(e) => setLibelle(e.target.value)}
        />
      </div>

      <label className="ad-case">
        <input type="checkbox" checked={cloturer} onChange={(e) => setCloturer(e.target.checked)} />
        <span>
          Clôturer la session en cours. À décocher uniquement pour programmer deux sessions à
          l&apos;avance : sinon la plus ancienne continuerait de recevoir les nouveaux inscrits.
        </span>
      </label>

      <button type="submit" className="ad-bouton ad-bouton--or" disabled={enCours !== null}>
        {enCours === "creation" ? (
          <>
            <LoaderCircle size={15} strokeWidth={TRAIT} className="ad-tourne" /> Création…
          </>
        ) : (
          <>
            <CirclePlus size={15} strokeWidth={TRAIT} /> Créer la session
          </>
        )}
      </button>
    </form>
  );
}
