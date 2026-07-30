"use client";

// =====================================================
// QUIZ APPORTEUR D'AFFAIRES — Variante « Actuel »
// Port React de design_handoff_site_umdeny/src/quiz-apporteur.js.
// Le moteur (états, écrans, scoring) vient de lib/quiz-apporteur :
// cette variante ne porte que le rendu.
// =====================================================

import { useEffect, useState } from "react";
import Link from "next/link";
import { Arrow, Chat, Check, Clock, Shield } from "@/app/components/icons";
import { TRAIL_BLOCKS, VERTICAL_THEMES } from "@/lib/quiz-apporteur/data";
import { VerticalIcon } from "@/lib/quiz-apporteur/icons";
import type { QuizPayload, QuizScreen } from "@/lib/quiz-apporteur/types";
import { useQuizApporteur } from "@/lib/quiz-apporteur/useQuizApporteur";
import "./quiz.css";

const LETTERS = "ABCDEFGHIJ";

function Landing({ onStart }: { onStart: () => void }) {
  return (
    <>
      <div className="qz-hero">
        <div className="qz-hero__inner">
          <div className="eyebrow no-rule">Programme apporteurs Umdeny</div>
          <h1>
            Devenez <em>apporteur d&apos;affaires</em> Umdeny.
          </h1>
          <p className="qz-hero__sub">
            Vous avez un réseau ? Nous avons les opportunités. Répondez à quelques questions pour soumettre votre
            candidature : notre équipe l&apos;étudie et vous recontacte sous quelques jours ouvrés.
          </p>
        </div>
      </div>

      <div className="qz-landing">
        <div className="qz-sincerity">
          <span className="icn">
            <Chat size={20} />
          </span>
          <p>
            Plus vos réponses seront sincères et complètes, plus l&apos;accompagnement et l&apos;incubation que nous
            pourrons vous proposer seront adaptés à votre situation réelle. Ce quiz n&apos;est pas un test à réussir :
            c&apos;est un outil qui nous permet de mieux vous accompagner, dès le premier échange.
          </p>
        </div>

        <div className="qz-reassure">
          {[
            "Candidature gratuite et sans engagement",
            "Réponse sous quelques jours ouvrés",
            "Données confidentielles",
          ].map((label) => (
            <span key={label}>
              <span className="ck">
                <Check size={10} stroke={2.4} />
              </span>{" "}
              {label}
            </span>
          ))}
        </div>

        <div className="qz-eligibility">
          <span className="icn">
            <Shield size={19} />
          </span>
          <p>
            <strong>Condition d&apos;éligibilité : </strong>
            ce programme est ouvert à toute personne majeure (18 ans et plus). C&apos;est la seule condition
            d&apos;entrée requise pour candidater.
          </p>
        </div>

        <button
          type="button"
          className="btn btn--gold"
          style={{ width: "100%", justifyContent: "center", padding: 18, fontSize: 15 }}
          onClick={onStart}
        >
          Commencer ma candidature <Arrow size={14} />
        </button>
      </div>
    </>
  );
}

function Trail({ screen }: { screen: QuizScreen | undefined }) {
  if (!screen) return <div className="qz-trail" />;

  const activeLabel =
    screen.id === "complementary" ? "Une dernière chose" : screen.conditional ? "Détails" : screen.block;
  const activeIndex = TRAIL_BLOCKS.indexOf(activeLabel ?? "");

  return (
    <div className="qz-trail">
      {TRAIL_BLOCKS.map((block, i) => (
        <span key={block}>
          {i > 0 && <span className="qz-trail__sep">•</span>}
          <span className={"qz-trail__step " + (i === activeIndex ? "active" : i < activeIndex ? "done" : "")}>
            {block}
          </span>
        </span>
      ))}
    </div>
  );
}

function ConfirmationModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="qz-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="qz-modal-title">
      <div className="qz-modal">
        <div className="icn">
          <Check size={24} stroke={2.2} />
        </div>
        {/* Spec v2.0 partie 12 : message texte seul, aucun lien ni bouton de navigation. */}
        <h3 id="qz-modal-title">Votre candidature a bien été reçue.</h3>
        <p>
          Notre équipe l&apos;étudie et vous recontactera sous quelques jours ouvrés si votre profil correspond aux
          besoins actuels du programme.
        </p>
        <button type="button" className="btn btn--gold" style={{ width: "100%", justifyContent: "center" }} onClick={onClose}>
          OK, j&apos;ai compris
        </button>
      </div>
    </div>
  );
}

export function QuizApporteur({ onSubmit }: { onSubmit?: (payload: QuizPayload) => void }) {
  const quiz = useQuizApporteur({ onSubmit });
  const { phase, screen, index, total, progress, answers, answered, isLast, submitState, submitError } = quiz;
  const [modalDismissed, setModalDismissed] = useState(false);
  // Dérivé plutôt que synchronisé : la confirmation s'affiche dès la
  // soumission et disparaît une fois fermée, sans effet de bord.
  const modalOpen = phase === "thanks" && !modalDismissed;

  // Le parcours peut être long : on remonte en haut à chaque écran.
  useEffect(() => {
    if (phase === "quiz") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [index, phase]);

  const themeVars =
    screen?.conditional && screen.verticalKey
      ? ({
          "--vc-bg": VERTICAL_THEMES[screen.verticalKey].bg,
          "--vc-border": VERTICAL_THEMES[screen.verticalKey].border,
          "--vc-accent": VERTICAL_THEMES[screen.verticalKey].accent,
          "--vc-ink": VERTICAL_THEMES[screen.verticalKey].ink,
        } as React.CSSProperties)
      : undefined;

  return (
    <div className="qz-body">
      <header className="qz-header">
        <Link href="/" className="qz-header__brand">
          <span className="qz-header__mark" />
          <span className="qz-header__text">UMDENY CAPITAL</span>
        </Link>
        <Link href="/" className="qz-header__back">
          ← Retour au site
        </Link>
      </header>

      <div className="qz-progress-track">
        <div
          className="qz-progress-fill"
          style={{ width: `${phase === "landing" ? 0 : phase === "quiz" ? progress : 100}%` }}
        />
      </div>

      {phase === "quiz" ? <Trail screen={screen} /> : <div className="qz-trail" />}

      <main className="qz-shell">
        {phase === "landing" && <Landing onStart={quiz.start} />}

        {phase === "exit" && (
          <div className="qz-exit">
            <div className="icn">
              <Clock size={30} />
            </div>
            <h2>Merci pour votre intérêt.</h2>
            <p>
              Ce programme est réservé aux personnes majeures (18 ans et plus). N&apos;hésitez pas à revenir vers nous
              dès que vous remplirez cette condition.
            </p>
          </div>
        )}

        {phase === "thanks" && (
          <div className="qz-thanks">
            <div className="icn">
              <Check size={26} stroke={2.2} />
            </div>
            <h2>Votre candidature est en cours de traitement.</h2>
            <p>
              Merci d&apos;avoir soumis votre candidature. Notre équipe l&apos;étudie et vous recontactera sous quelques
              jours ouvrés si votre profil correspond aux besoins actuels du programme.
            </p>
            <p style={{ marginTop: 20 }}>
              Vous pouvez fermer cette page ou{" "}
              <Link href="/" style={{ color: "var(--gold-dark)", borderBottom: "1px solid var(--gold)" }}>
                revenir à l&apos;accueil
              </Link>
              .
            </p>
          </div>
        )}

        {phase === "quiz" && screen && (
          <div className={"qz-card" + (screen.conditional ? " is-conditional" : "")} style={themeVars}>
            {screen.type === "intro" && screen.verticalKey ? (
              <div className="qz-intro">
                <div className="qz-intro__eyebrow">
                  Section {screen.sectionIndex} / {screen.sectionTotal}
                </div>
                <div className="qz-intro__icn">
                  <VerticalIcon verticalKey={screen.verticalKey} size={30} stroke={1.5} />
                </div>
                <h2 className="qz-intro__title">{screen.verticalLabel}</h2>
                <p className="qz-intro__body">
                  7 questions rapides pour identifier vos contacts sur cette opportunité. Comme pour les autres, rien
                  n&apos;est engageant : vous répondez simplement selon ce que vous savez aujourd&apos;hui.
                </p>
              </div>
            ) : screen.conditional && screen.verticalKey ? (
              <div className="qz-vertical-flag">
                <span className="vf-icn">
                  <VerticalIcon verticalKey={screen.verticalKey} size={16} />
                </span>
                {screen.verticalLabel}
                <span className="vf-count">encore {screen.remaining}</span>
              </div>
            ) : screen.block ? (
              <div className="qz-block-label">{screen.block}</div>
            ) : null}

            {screen.type === "fields" && (
              <>
                {screen.title && <h2 className="qz-q-title">{screen.title}</h2>}
                <div className="qz-fields">
                  {(screen.fields ?? []).map((field) => {
                    const value = typeof answers[field.id] === "string" ? (answers[field.id] as string) : "";
                    return (
                      <div key={field.id} className="qz-field">
                        <label htmlFor={`f_${field.id}`}>
                          {field.label}
                          {!field.required && <span className="qz-optional-tag">(optionnel)</span>}
                        </label>
                        {field.sub && (
                          <p style={{ fontSize: 12.5, color: "var(--mist)", margin: "0 0 8px" }}>{field.sub}</p>
                        )}
                        {field.type === "textarea" ? (
                          <textarea
                            id={`f_${field.id}`}
                            value={value}
                            onChange={(e) => quiz.setField(field.id, e.target.value)}
                          />
                        ) : (
                          <input
                            id={`f_${field.id}`}
                            type={field.type}
                            value={value}
                            onChange={(e) => quiz.setField(field.id, e.target.value)}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {(screen.type === "radio" || screen.type === "checkbox") && (
              <>
                <h2 className="qz-q-title">{screen.title}</h2>
                {screen.hint && <p className="qz-multi-hint">{screen.hint}</p>}
                <div className="qz-options">
                  {(screen.options ?? []).map((option, oi) => {
                    const current = answers[screen.id];
                    const isMulti = screen.type === "checkbox";
                    const selected = isMulti
                      ? Array.isArray(current) && current.includes(option)
                      : current === option;
                    return (
                      <label
                        key={option}
                        className={
                          "qz-opt " + (isMulti ? "check-style" : "radio-style") + (selected ? " selected" : "")
                        }
                      >
                        <input
                          type={isMulti ? "checkbox" : "radio"}
                          name={screen.id}
                          checked={selected}
                          onChange={() =>
                            isMulti ? quiz.toggleOption(screen.id, option) : quiz.selectOption(screen.id, option)
                          }
                        />
                        <span className="letter">{LETTERS[oi] ?? String(oi + 1)}</span>
                        <span>{option}</span>
                        <span className="mark">{isMulti && <Check size={11} stroke={2.6} />}</span>
                      </label>
                    );
                  })}
                </div>
                {screen.note && <p className="qz-q-note">{screen.note}</p>}
              </>
            )}

            {submitError && (
              <p
                role="alert"
                style={{
                  margin: "0 0 16px",
                  padding: "12px 16px",
                  background: "#FFF3E0",
                  borderLeft: "3px solid #B96A00",
                  color: "#5C3A0A",
                  fontSize: 13.5,
                  lineHeight: 1.5,
                }}
              >
                {submitError}
              </p>
            )}

            <div className="qz-nav">
              <button
                type="button"
                className="btn btn--outline-navy"
                onClick={quiz.back}
                style={{ visibility: index === 0 ? "hidden" : "visible" }}
              >
                ← Précédent
              </button>
              <span className="qz-count">
                Étape {index + 1} / {total}
              </span>
              <button
                type="button"
                className="btn btn--gold"
                onClick={quiz.next}
                disabled={!answered || submitState === "sending"}
                style={{ opacity: answered && submitState !== "sending" ? 1 : 0.45 }}
              >
                {submitState === "sending" ? "Envoi…" : isLast ? "Envoyer ma candidature" : "Continuer"} <Arrow size={14} />
              </button>
            </div>
          </div>
        )}
      </main>

      {modalOpen && <ConfirmationModal onClose={() => setModalDismissed(true)} />}
    </div>
  );
}
