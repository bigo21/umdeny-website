"use client";

// =====================================================
// QUIZ CANDIDATURE — APPORTEUR D'AFFAIRES — Machine à états
// Port React de design_handoff_site_umdeny/src/quiz-core.js.
// Aucun rendu ici : les 4 variantes d'interface consomment ce hook.
// =====================================================

import { useCallback, useMemo, useState } from "react";
import { buildScreens } from "./data";
import { computeScore } from "./scoring";
import type { Answers, QuizPayload, QuizPhase, QuizScreen } from "./types";

export interface UseQuizApporteurOptions {
  /** Transport de la candidature (API, webhook CRM…). Non implémenté à ce stade. */
  onSubmit?: (payload: QuizPayload) => void;
}

export function isScreenAnswered(screen: QuizScreen | undefined, answers: Answers): boolean {
  if (!screen) return false;
  if (screen.type === "intro") return true;

  if (screen.type === "fields") {
    return (screen.fields ?? []).every((field) => {
      if (!field.required) return true;
      const value = answers[field.id];
      return typeof value === "string" && value.trim().length > 0;
    });
  }

  const value = answers[screen.id];
  if (screen.type === "checkbox") return Array.isArray(value) && value.length > 0;
  return typeof value === "string" && value.length > 0;
}

export function useQuizApporteur(options: UseQuizApporteurOptions = {}) {
  const { onSubmit } = options;

  const [answers, setAnswers] = useState<Answers>({});
  const [rawIndex, setRawIndex] = useState(0);
  const [phase, setPhase] = useState<QuizPhase>("landing");

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

  const submit = useCallback(() => {
    const payload: QuizPayload = {
      answers,
      score: computeScore(answers),
      submittedAt: new Date().toISOString(),
    };
    onSubmit?.(payload);
    setPhase("thanks");
    return payload;
  }, [answers, onSubmit]);

  const next = useCallback(() => {
    if (!isScreenAnswered(screen, answers)) return;

    // Seule condition d'éligibilité : être majeur. Une réponse « Non » arrête
    // le parcours — candidature non soumise, aucune fiche CRM créée.
    if (screen?.gate && screen.id === "q5_gate" && answers.q5_gate === "Non") {
      setPhase("exit");
      return;
    }

    if (index === total - 1) {
      submit();
      return;
    }

    setRawIndex(index + 1);
  }, [screen, answers, index, total, submit]);

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
    // navigation
    start,
    next,
    back,
    submit,
    // saisie
    setField,
    selectOption,
    toggleOption,
  };
}
