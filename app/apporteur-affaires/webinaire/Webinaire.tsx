"use client";

// =====================================================
// WEBINAIRE APPORTEURS D'AFFAIRES
// Port React de design_handoff_site_umdeny/apporteurs-webinaire/.
//
// Surface autonome, comme le quiz de candidature : elle vit hors du groupe
// (site) et ne porte donc ni le bandeau diaspora, ni le header de navigation,
// ni le pré-footer. Elle reste accessible pendant que le site vitrine est en
// maintenance — le matcher de proxy.ts exclut déjà tout le préfixe
// /apporteur-affaires.
//
// Date, durée et vidéo ne sont pas écrites ici : elles viennent de
// lib/webinaire/config.ts, seul fichier à toucher quand elles seront arrêtées.
// =====================================================

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Banknote,
  CalendarDays,
  CircleCheck,
  Clock,
  Hourglass,
  LoaderCircle,
  Play,
  Radio,
  ShieldCheck,
  TriangleAlert,
  Users,
} from "lucide-react";
import { A_CONFIRMER, LIENS_LEGAUX, posterDeRepli, urlLecteur, WEBINAIRE } from "@/lib/webinaire/config";
import { submitInscription } from "@/lib/webinaire/submitInscription";
import type { Inscription } from "@/lib/webinaire/types";
import "./webinaire.css";

// Les icônes maison de app/components/icons.tsx tracent à 1.5, Lucide à 2 par
// défaut. 1.7 recale les deux jeux à l'œil, le temps que le reste du site
// bascule lui aussi sur Lucide.
const TRAIT = 1.7;

const AVANTAGES = [
  {
    Icone: Banknote,
    titre: "Rémunération attractive",
    texte: "Une commission claire sur chaque affaire concrétisée, sans plafond de revenus.",
  },
  {
    Icone: Clock,
    titre: "Flexibilité totale",
    texte:
      "Une activité que vous menez à votre rythme, en complément de votre emploi actuel ou à temps plein.",
  },
  {
    Icone: ShieldCheck,
    titre: "Accompagnement dédié",
    texte:
      "Formation initiale, outils de présentation et suivi personnalisé par notre équipe tout au long du partenariat.",
  },
  {
    Icone: Users,
    titre: "Un réseau élargi",
    texte:
      "Accédez à l'écosystème Umdeny Capital et à ses partenaires vérifiés pour enrichir vos propres opportunités.",
  },
];

/**
 * Révélation des sections au défilement.
 *
 * La classe `wb-reveal` est posée dans le JSX et non ajoutée ici : l'ajouter
 * après le montage ferait clignoter les blocs déjà à l'écran, visibles le temps
 * d'une image avant d'être masqués. En contrepartie il faut garantir que tout
 * finit visible — d'où les deux sorties de secours ci-dessous, sans quoi la
 * page resterait blanche.
 */
function useRevelationAuDefilement() {
  useEffect(() => {
    const cibles = Array.from(document.querySelectorAll<HTMLElement>(".wb-reveal"));

    const sansAnimation =
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (sansAnimation) {
      cibles.forEach((cible) => cible.classList.add("is-visible"));
      return;
    }

    const observateur = new IntersectionObserver(
      (entrees) => {
        entrees.forEach((entree) => {
          if (!entree.isIntersecting) return;
          entree.target.classList.add("is-visible");
          observateur.unobserve(entree.target);
        });
      },
      { threshold: 0.15 },
    );

    cibles.forEach((cible) => observateur.observe(cible));
    return () => observateur.disconnect();
  }, []);
}

function Header() {
  // Marque volontairement non cliquable : le site vitrine est en maintenance en
  // production, un lien vers « / » enverrait le visiteur sur la page de
  // maintenance au lieu de l'accueil.
  //
  // Passe par next/image plutôt qu'un fond CSS, contrairement aux autres logos
  // du dépôt : le fichier source fait 4000 px de large et n'est servi que sur
  // 30 px de haut.
  return (
    <header className="wb-header">
      <div className="wb-header__brand">
        <Image src="/logo-dark.png" alt="Umdeny Capital" width={74} height={30} priority />
      </div>
      <p className="wb-header__titre">Programme apporteurs d&apos;affaires</p>
      <a href="#inscription" className="btn wb-header__cta">
        S&apos;inscrire au webinaire
      </a>
    </header>
  );
}

function Hero() {
  return (
    <section className="wb-hero">
      <div className="wb-hero__inner">
        <div className="wb-hero__badge">Campagne de recrutement</div>
        <h1>
          Devenez <em>Apporteur d&apos;Affaires</em> chez Umdeny Capital
        </h1>
        <p className="wb-hero__sub">
          Umdeny Capital ouvre son programme de partenariat commercial à toute personne disposant
          d&apos;un réseau et d&apos;une capacité de recommandation. Découvrez l&apos;opportunité
          lors d&apos;un webinaire de présentation en direct.
        </p>
        <a href="#inscription" className="btn btn--gold wb-hero__cta">
          Je réserve ma place au webinaire <ArrowRight size={14} strokeWidth={TRAIT} />
        </a>
      </div>
    </section>
  );
}

function SectionVideo({ poster }: { poster: string | null }) {
  const [lecture, setLecture] = useState(false);
  const video = WEBINAIRE.video;
  // Un fichier hébergé par nous et sans poster n'a pas d'image à afficher :
  // c'est le navigateur qui peint sa première image, via une balise <video>
  // muette servant de couverture.
  const couvertureFichier = !poster && video?.hebergeur === "fichier";
  const illustre = Boolean(poster) || couvertureFichier;

  return (
    <section className="wb-video wb-reveal">
      <div className="wb-video__head">
        <div className="eyebrow no-rule" style={{ justifyContent: "center", marginBottom: 14 }}>
          L&apos;opportunité en vidéo
        </div>
        <h2 className="h3" style={{ margin: 0 }}>
          Comprenez l&apos;opportunité en quelques minutes.
        </h2>
      </div>

      {lecture && video ? (
        <div className="wb-video__frame">
          {video.hebergeur === "fichier" ? (
            // Ajouter un <track kind="captions"> dès qu'un fichier .vtt
            // accompagne la vidéo.
            <video className="wb-video__player" src={video.src} poster={video.poster} controls autoPlay />
          ) : (
            // Attributs alignés sur le code d'intégration officiel de
            // YouTube. « referrerPolicy » en fait partie : privé de référent,
            // le lecteur se charge puis refuse de démarrer.
            <iframe
              className="wb-video__player"
              src={
                urlLecteur(video, typeof window === "undefined" ? undefined : window.location.origin) ??
                undefined
              }
              title="Webinaire apporteurs d'affaires — vidéo de présentation"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          )}
        </div>
      ) : (
        <button
          type="button"
          className={"wb-video__frame" + (illustre ? " wb-video__frame--illustre" : "")}
          onClick={() => setLecture(true)}
          disabled={!video}
          aria-label={
            video
              ? "Lire la vidéo de présentation"
              : "Vidéo de présentation — pas encore disponible"
          }
        >
          {poster ? (
            // Couverture purement décorative, déjà dimensionnée par le ratio
            // 16/9 du cadre. next/image est écarté ici : il exige des
            // dimensions connues à la compilation, et l'hébergeur de la
            // vignette change avec la configuration.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="wb-video__poster"
              src={poster}
              alt=""
              onError={(evenement) => {
                // Vignette YouTube en pleine définition absente : hqdefault
                // existe toujours. posterDeRepli renvoie null au second échec,
                // ce qui coupe court à toute boucle de rechargement.
                const repli = posterDeRepli(evenement.currentTarget.src);
                if (repli) evenement.currentTarget.src = repli;
              }}
            />
          ) : null}
          {couvertureFichier && video?.hebergeur === "fichier" ? (
            // « #t=0.1 » demande au navigateur de se positionner juste après le
            // début : sans cela certains ne peignent aucune image avant lecture.
            <video
              className="wb-video__poster"
              src={`${video.src}#t=0.1`}
              preload="metadata"
              muted
              playsInline
              tabIndex={-1}
              aria-hidden="true"
            />
          ) : null}
          <span className="wb-video__center">
            <span className="wb-video__play">
              <Play size={26} strokeWidth={TRAIT} fill="currentColor" />
            </span>
            {video ? null : (
              <span className="wb-video__soon">Vidéo de présentation — bientôt disponible</span>
            )}
          </span>
        </button>
      )}
    </section>
  );
}

function Avantages() {
  return (
    <section className="wb-offer">
      <div className="wb-offer__inner">
        <div className="wb-offer__head">
          <div className="eyebrow no-rule" style={{ justifyContent: "center", marginBottom: 14 }}>
            Ce que vous obtenez
          </div>
          <h2 className="h3" style={{ margin: 0 }}>
            Un partenariat sérieux, pensé pour durer.
          </h2>
        </div>
        <div className="wb-offer__grid">
          {AVANTAGES.map(({ Icone, titre, texte }) => (
            <div key={titre} className="wb-offer__card wb-reveal">
              <div className="wb-offer__icn">
                <Icone size={22} strokeWidth={TRAIT} />
              </div>
              <h3>{titre}</h3>
              <p>{texte}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LigneMeta({
  Icone,
  label,
  valeur,
}: {
  Icone: typeof CalendarDays;
  label: string;
  valeur: string | null;
}) {
  return (
    <div className="wb-session__meta-item">
      <div className="wb-session__meta-icn">
        <Icone size={18} strokeWidth={TRAIT} />
      </div>
      <div>
        <div className="wb-session__meta-label">{label}</div>
        <div className={"wb-session__meta-value" + (valeur ? "" : " wb-session__meta-value--attente")}>
          {valeur ?? A_CONFIRMER}
        </div>
      </div>
    </div>
  );
}

function Session() {
  return (
    <section className="wb-session">
      <div className="wb-session__inner wb-reveal">
        <div>
          <div className="wb-session__eyebrow">Webinaire de présentation</div>
          <h2>Assistez à une session en direct, posez vos questions.</h2>
          <p>
            Une session animée par nos équipes : présentation du groupe, des offres et du modèle de
            rémunération, suivie d&apos;une séance de questions-réponses.
          </p>
        </div>
        <div className="wb-session__meta">
          <LigneMeta Icone={CalendarDays} label="Date" valeur={WEBINAIRE.date} />
          <LigneMeta Icone={Radio} label="Format" valeur={WEBINAIRE.format} />
          <LigneMeta Icone={Hourglass} label="Durée" valeur={WEBINAIRE.duree} />
        </div>
      </div>
    </section>
  );
}

const INSCRIPTION_VIDE: Inscription = {
  prenom: "",
  nom: "",
  email: "",
  telephone: "",
  consentementRgpd: false,
  consentementContact: false,
};

function Formulaire() {
  const [inscription, setInscription] = useState<Inscription>(INSCRIPTION_VIDE);
  const [envoi, setEnvoi] = useState(false);
  const [succes, setSucces] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  function modifier<C extends keyof Inscription>(champ: C, valeur: Inscription[C]) {
    setInscription((precedent) => ({ ...precedent, [champ]: valeur }));
  }

  async function envoyer(evenement: React.FormEvent<HTMLFormElement>) {
    evenement.preventDefault();
    if (envoi) return;

    setEnvoi(true);
    setErreur(null);
    try {
      await submitInscription(inscription);
      setSucces(true);
    } catch (cause) {
      // Le message vient du serveur quand il en fournit un : il est rédigé pour
      // le visiteur. On ne montre jamais l'erreur technique brute.
      setErreur(
        cause instanceof Error
          ? cause.message
          : "L'envoi de votre inscription a échoué. Merci de réessayer.",
      );
    } finally {
      setEnvoi(false);
    }
  }

  if (succes) {
    return (
      <section className="wb-form-section" id="inscription">
        <div className="wb-done">
          <div className="wb-done__icn">
            <CircleCheck size={32} strokeWidth={TRAIT} />
          </div>
          <h2>Votre inscription est enregistrée.</h2>
          <p>
            Merci {inscription.prenom}. Vous recevrez le lien de connexion au webinaire par email,
            à l&apos;adresse {inscription.email}. Pensez à vérifier vos indésirables.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="wb-form-section" id="inscription">
      <form className="wb-form wb-reveal" onSubmit={envoyer}>
        <div className="wb-form__head">
          <h2>Inscrivez-vous au webinaire</h2>
          <p>Complétez le formulaire, vous recevrez le lien de confirmation par email.</p>
        </div>

        <div className="wb-field--row">
          <div className="wb-field">
            <label htmlFor="prenom">Prénom</label>
            <input
              type="text"
              id="prenom"
              name="prenom"
              required
              autoComplete="given-name"
              value={inscription.prenom}
              onChange={(e) => modifier("prenom", e.target.value)}
            />
          </div>
          <div className="wb-field">
            <label htmlFor="nom">Nom</label>
            <input
              type="text"
              id="nom"
              name="nom"
              required
              autoComplete="family-name"
              value={inscription.nom}
              onChange={(e) => modifier("nom", e.target.value)}
            />
          </div>
        </div>

        <div className="wb-field">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            autoComplete="email"
            value={inscription.email}
            onChange={(e) => modifier("email", e.target.value)}
          />
        </div>

        <div className="wb-field">
          <label htmlFor="telephone">
            Téléphone <span className="wb-optional">(optionnel)</span>
          </label>
          <input
            type="tel"
            id="telephone"
            name="telephone"
            autoComplete="tel"
            value={inscription.telephone}
            onChange={(e) => modifier("telephone", e.target.value)}
          />
        </div>

        <label className="wb-checkbox">
          <input
            type="checkbox"
            name="consentement_rgpd"
            required
            checked={inscription.consentementRgpd}
            onChange={(e) => modifier("consentementRgpd", e.target.checked)}
          />
          <span>
            J&apos;accepte que mes données soient traitées par Umdeny Capital dans le cadre de cette
            inscription, conformément à la politique de confidentialité. <span className="req">*</span>
          </span>
        </label>

        <label className="wb-checkbox">
          <input
            type="checkbox"
            name="consentement_contact"
            checked={inscription.consentementContact}
            onChange={(e) => modifier("consentementContact", e.target.checked)}
          />
          <span>J&apos;accepte d&apos;être recontacté(e) par l&apos;équipe Umdeny Capital.</span>
        </label>

        {erreur ? (
          <p className="wb-error" role="alert">
            <TriangleAlert size={16} strokeWidth={TRAIT} />
            <span>{erreur}</span>
          </p>
        ) : null}

        <button type="submit" className="btn btn--gold wb-submit" disabled={envoi}>
          {envoi ? (
            <>
              <LoaderCircle size={16} strokeWidth={TRAIT} /> Envoi en cours…
            </>
          ) : (
            "Je m'inscris au webinaire"
          )}
        </button>
      </form>
    </section>
  );
}

function Footer() {
  return (
    <footer className="wb-footer">
      {/* Variante claire du logo de l'en-tête : sur le navy du pied de page, le
          lettrage de logo-dark.png, lui-même navy, serait invisible. */}
      <Image
        src="/logo-light.png"
        alt="Umdeny Capital"
        width={99}
        height={40}
        className="wb-footer__logo"
      />
      <p className="wb-footer__legal">© 2026 Umdeny Holdings — Tous droits réservés.</p>
      <p className="wb-footer__liens">
        {LIENS_LEGAUX.map(({ label, href }, index) => (
          <span key={label}>
            {index > 0 ? <span className="wb-footer__separateur"> · </span> : null}
            {href ? <a href={href}>{label}</a> : label}
          </span>
        ))}
      </p>
    </footer>
  );
}

export function Webinaire({ poster }: { poster: string | null }) {
  useRevelationAuDefilement();

  return (
    <div className="wb-body">
      <Header />
      <main>
        <Hero />
        <SectionVideo poster={poster} />
        <Avantages />
        <Session />
        <Formulaire />
      </main>
      <Footer />
    </div>
  );
}
