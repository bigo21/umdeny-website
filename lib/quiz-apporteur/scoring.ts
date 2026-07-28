// =====================================================
// QUIZ CANDIDATURE — APPORTEUR D'AFFAIRES — Scoring
// Port fidèle de design_handoff_site_umdeny/src/quiz-core.js
//
// Ce score sert UNIQUEMENT au tri interne des candidatures.
// Il n'est jamais affiché au candidat : aucun badge, aucun score,
// aucune page de résultat côté candidat (spec v2.0, parties 9 et 12).
// =====================================================

import {
  COMMON_SCREENS,
  CONTACT_OPTIONS,
  DELAI_OPTIONS,
  GEO_CITY_OPTIONS,
  GEO_STANDARD_OPTIONS,
  RELATION_OPTIONS,
  VERTICALS,
} from "./data";
import type { Answers, GeoType, QuizScore, VerticalKey } from "./types";

/** Barème par index de réponse (l'ordre des options dans data.ts fait foi). */
export const SCORE_POINTS = {
  contact: { 0: 3, 1: 2, 2: 1 } as Record<number, number>,
  geoStandard: { 0: 1, 1: 1, 2: 2 } as Record<number, number>,
  geoCity: { 0: 2, 1: 2, 2: 1, 3: 0 } as Record<number, number>,
  relation: { 0: 3, 1: 2, 2: 1 } as Record<number, number>,
  delai: { 0: 3, 1: 2, 2: 1, 3: 0 } as Record<number, number>,
  reseau: { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5 } as Record<number, number>,
  exp: { 0: 1, 1: 2, 2: 3 } as Record<number, number>,
  dispo: { 0: 1, 1: 2, 2: 3, 3: 4 } as Record<number, number>,
};

export const TAG_PRIORITAIRE = "🟢 PRIORITAIRE";
export const TAG_A_QUALIFIER = "🟡 À QUALIFIER";
export const TAG_EN_VEILLE = "⚪ EN VEILLE";

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/** Index de la réponse dans les options d'un écran commun, -1 si non répondu. */
function commonAnswerIndex(screenId: string, answers: Answers): number {
  const screen = COMMON_SCREENS.find((s) => s.id === screenId);
  if (!screen?.options) return -1;
  return screen.options.indexOf(asString(answers[screenId]));
}

function geoIndex(value: string, type: GeoType): number {
  return (type === "city" ? GEO_CITY_OPTIONS : GEO_STANDARD_OPTIONS).indexOf(value);
}

/** Points d'un barème pour un index, 0 si l'index est invalide. */
function points(scale: Record<number, number>, index: number): number {
  return index >= 0 ? (scale[index] ?? 0) : 0;
}

export function computeScore(answers: Answers): QuizScore {
  const idx13 = commonAnswerIndex("q13_taille_reseau", answers);
  const idx15 = commonAnswerIndex("q15_exp", answers);
  const idx16 = commonAnswerIndex("q16_dispo", answers);

  const scoreReseau = idx13 >= 0 ? (SCORE_POINTS.reseau[idx13] / 5) * 100 : 0;
  const scoreExp = idx15 >= 0 ? (SCORE_POINTS.exp[idx15] / 3) * 100 : 0;
  const scoreDispo = idx16 >= 0 ? (SCORE_POINTS.dispo[idx16] / 4) * 100 : 0;

  const pivot = answers.q18_pivot;
  const chosenLabels = Array.isArray(pivot) ? pivot : [];
  const chosenVerticals = VERTICALS.filter((v) => chosenLabels.includes(v.label));

  let bestPertinence = 0;
  const pertinenceDetail: Partial<Record<VerticalKey, number>> = {};
  const maitriseByVertical: Partial<Record<VerticalKey, string | null>> = {};

  chosenVerticals.forEach((vertical) => {
    const contactPts = points(SCORE_POINTS.contact, CONTACT_OPTIONS.indexOf(asString(answers[`${vertical.key}_1`])));
    const geoIdx = geoIndex(asString(answers[`${vertical.key}_3`]), vertical.geoType);
    const geoPts = points(vertical.geoType === "city" ? SCORE_POINTS.geoCity : SCORE_POINTS.geoStandard, geoIdx);
    const relPts = points(SCORE_POINTS.relation, RELATION_OPTIONS.indexOf(asString(answers[`${vertical.key}_4`])));
    const delPts = points(SCORE_POINTS.delai, DELAI_OPTIONS.indexOf(asString(answers[`${vertical.key}_5`])));

    // 11 points max : 3 contact + 2 géographie + 3 relation + 3 délai.
    // Le niveau de maîtrise (_2) et les questions CRM (_6, _7) n'y entrent pas.
    const pct = ((contactPts + geoPts + relPts + delPts) / 11) * 100;

    pertinenceDetail[vertical.key] = Math.round(pct);
    if (pct > bestPertinence) bestPertinence = pct;
    maitriseByVertical[vertical.key] = asString(answers[`${vertical.key}_2`]) || null;
  });

  // MAX et non moyenne : un réseau exceptionnel sur une seule verticale ne doit
  // pas être pénalisé par une verticale cochée par curiosité (spec, partie 7).
  const scoreTotal = scoreReseau * 0.35 + scoreExp * 0.2 + scoreDispo * 0.2 + bestPertinence * 0.25;

  let tag = TAG_EN_VEILLE;
  if (scoreTotal >= 75) tag = TAG_PRIORITAIRE;
  else if (scoreTotal >= 50) tag = TAG_A_QUALIFIER;

  return {
    scoreReseau: Math.round(scoreReseau),
    scoreExp: Math.round(scoreExp),
    scoreDispo: Math.round(scoreDispo),
    scorePertinence: Math.round(bestPertinence),
    scoreTotal: Math.round(scoreTotal),
    tag,
    pertinenceDetail,
    maitriseByVertical,
  };
}
