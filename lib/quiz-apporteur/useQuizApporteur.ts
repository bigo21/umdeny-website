"use client";

// =====================================================
// QUIZ CANDIDATURE — APPORTEUR D'AFFAIRES — Machine à états
// Port React de design_handoff_site_umdeny/src/quiz-core.js.
// Aucun rendu ici : les 4 variantes d'interface consomment ce hook.
// =====================================================

import { useCallback, useMemo, useState } from "react";
import { buildScreens, COMPLEMENTARY_SCREEN } from "./data";
import { computeScore } from "./scoring";
import { submitCandidature } from "./submitCandidature";
import type { Answers, QuizPayload, QuizPhase, QuizScreen } from "./types";

/** État de l'envoi : le candidat ne doit pas lire « reçue » si rien n'est parti. */
export type SubmitState = "idle" | "sending" | "error";

/**
 * Les cases de consentement partent explicitement à false. Sans cela, une case
 * jamais touchée reste absente de reponses_completes_json, où rien ne
 * distinguerait plus un refus d'une question non posée — c'est précisément ce
 * que cette trace doit pouvoir montrer.
 */
const ANSWERS_INITIALES: Answers = Object.fromEntries(
  (COMPLEMENTARY_SCREEN.fields ?? []).filter((f) => f.type === "consent").map((f) => [f.id, false]),
);

export interface UseQuizApporteurOptions {
  /**
   * Transport de la candidature. Par défaut, POST vers la route API.
   * Une exception fait basculer en état d'erreur, avec possibilité de réessayer.
   */
  onSubmit?: (payload: QuizPayload) => void | Promise<void>;
}

export function isScreenAnswered(screen: QuizScreen | undefined, answers: Answers): boolean {
  if (!screen) return false;
  if (screen.type === "intro") return true;

  if (screen.type === "fields") {
    return (screen.fields ?? []).every((field) => {
      if (!field.required) return true;
      const value = answers[field.id];
      // Une case de consentement obligatoire bloque tant qu'elle n'est pas
      // cochée : c'est le pendant client du rejet 422 côté serveur.
      if (field.type === "consent") return value === true;
      return typeof value === "string" && value.trim().length > 0;
    });
  }

  const value = answers[screen.id];
  if (screen.type === "checkbox") return Array.isArray(value) && value.length > 0;
  return typeof value === "string" && value.length > 0;
}

export function useQuizApporteur(options: UseQuizApporteurOptions = {}) {
  const { onSubmit } = options;

  const [answers, setAnswers] = useState<Answers>(ANSWERS_INITIALES);
  const [rawIndex, setRawIndex] = useState(0);
  const [phase, setPhase] = useState<QuizPhase>("landing");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  // La liste d'écrans dépend des verticales cochées à Q18 : elle est
  // recalculée à chaque changement de réponse, comme dans la version vanilla.
  const screens = useMemo(() => buildScreens(answers), [answers]);

  // Décocher une verticale déjà renseignée raccourcit la liste. La version
  // vanilla affichait alors l'écran de remerciement par accident ; on borne.
  const index = Math.min(rawIndex, Math.max(screens.length - 1, 0));
  const screen: QuizScreen | undefined = screens[index];
  const total = screens.length;

  const answered = isScreenAnswered(screen, answers);
  const progress = total ? Math.min(100, Math.round((index / total) * 100)) : 0;
  const isLast = index === total - 1;

  const setField = useCallback((fieldId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
  }, []);

  /** Case de consentement : stockée en booléen, jamais en "Oui"/"Non". */
  const setConsent = useCallback((fieldId: string, checked: boolean) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: checked }));
  }, []);

  const selectOption = useCallback((screenId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [screenId]: option }));
  }, []);

  const toggleOption = useCallback((screenId: string, option: string) => {
    setAnswers((prev) => {
      const current = prev[screenId];
      const list = Array.isArray(current) ? current : [];
      const at = list.indexOf(option);
      const next = at >= 0 ? [...list.slice(0, at), ...list.slice(at + 1)] : [...list, option];
      return { ...prev, [screenId]: next };
    });
  }, []);

  const start = useCallback(() => {
    setRawIndex(0);
    setPhase("quiz");
  }, []);

  const back = useCallback(() => {
    setRawIndex((i) => Math.max(0, i - 1));
  }, []);

  const submit = useCallback(async () => {
    const payload: QuizPayload = {
      answers,
      score: computeScore(answers),
      submittedAt: new Date().toISOString(),
    };

    setSubmitState("sending");
    setSubmitError(null);

    try {
      if (onSubmit) await onSubmit(payload);
      else await submitCandidature(answers);
      setSubmitState("idle");
      setPhase("thanks");
    } catch (error) {
      // On reste sur le dernier écran : le candidat peut réessayer sans avoir
      // à refaire le questionnaire.
      setSubmitState("error");
      setSubmitError(
        error instanceof Error ? error.message : "L'envoi de votre candidature a échoué. Merci de réessayer.",
      );
    }
  }, [answers, onSubmit]);

  const next = useCallback(async () => {
    if (!isScreenAnswered(screen, answers)) return;
    if (submitState === "sending") return;

    // Seule condition d'éligibilité : être majeur. Une réponse « Non » arrête
    // le parcours — candidature non soumise, aucune fiche CRM créée.
    if (screen?.gate && screen.id === "q5_gate" && answers.q5_gate === "Non") {
      setPhase("exit");
      return;
    }

    if (index === total - 1) {
      await submit();
      return;
    }

    setRawIndex(index + 1);
  }, [screen, answers, index, total, submit, submitState]);

  return {
    // état
    phase,
    answers,
    screens,
    screen,
    index,
    total,
    progress,
    answered,
    isLast,
    // envoi
    submitState,
    submitError,
    // navigation
    start,
    next,
    back,
    submit,
    // saisie
    setField,
    setConsent,
    selectOption,
    toggleOption,
  };
}
