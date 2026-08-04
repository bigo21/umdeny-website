// =====================================================
// QUIZ APPORTEUR D'AFFAIRES — Lectures internes
// Parcours de formation (spec v2.0 partie 8) et signaux complémentaires
// (partie 7). Absents du code du handoff, mais requis par l'email interne
// de la partie 10.
//
// Usage strictement interne : rien de ceci n'est montré au candidat.
// =====================================================

import { COMMON_SCREENS, DELAI_OPTIONS, MAITRISE_OPTIONS, VERTICALS } from "./data";
import type { Answers, QuizScore, VerticalKey } from "./types";

export interface FormationPath {
  verticalKey: VerticalKey;
  verticalLabel: string;
  maitrise: string;
  tag: string;
  parcours: string;
}

// Grille de la partie 8, indexée sur l'ordre de MAITRISE_OPTIONS.
const FORMATION_GRID = [
  {
    tag: "MAITRISE_DEBUTANT",
    parcours: "Formation complète depuis la base, incluant les fondamentaux du produit",
  },
  {
    tag: "MAITRISE_PARTIELLE",
    parcours: "Formation ciblée sur l'offre Umdeny spécifiquement — les fondamentaux du sujet sont déjà acquis",
  },
  {
    tag: "MAITRISE_BONNE",
    parcours: "Mise à niveau légère avant le terrain, quelques points précis à clarifier en entretien",
  },
  {
    tag: "MAITRISE_EXPERTE",
    parcours: "Autonome — briefing de cadrage seulement, pourrait présenter l'offre à son réseau sans formation initiale",
  },
];

/**
 * Parcours de formation recommandé, déterminé INDÉPENDAMMENT pour chaque
 * verticale cochée : un candidat peut être expert sur l'une et débutant
 * complet sur l'autre.
 */
export function computeFormationPaths(score: QuizScore): FormationPath[] {
  const paths: FormationPath[] = [];

  for (const vertical of VERTICALS) {
    const maitrise = score.maitriseByVertical[vertical.key];
    if (!maitrise) continue;

    const index = MAITRISE_OPTIONS.indexOf(maitrise);
    const grid = index >= 0 ? FORMATION_GRID[index] : null;
    if (!grid) continue;

    paths.push({
      verticalKey: vertical.key,
      verticalLabel: vertical.label,
      maitrise,
      tag: grid.tag,
      parcours: grid.parcours,
    });
  }

  return paths;
}

function answerIndex(screenId: string, answers: Answers): number {
  const screen = COMMON_SCREENS.find((s) => s.id === screenId);
  if (!screen?.options) return -1;
  const value = answers[screenId];
  return typeof value === "string" ? screen.options.indexOf(value) : -1;
}

/**
 * Signaux de la partie 7. Ils n'affectent jamais le score : ils remontent en
 * note interne pour enrichir l'email d'équipe et la fiche CRM.
 */
export function computeSignals(answers: Answers): string[] {
  const signals: string[] = [];

  const finIndex = answerIndex("q10_fin", answers); // 3 = Excédentaire
  const reseauIndex = answerIndex("q13_taille_reseau", answers); // 2 = M, 3 = L, 4 = XL
  const expIndex = answerIndex("q15_exp", answers); // 2 = régulièrement
  const dispoIndex = answerIndex("q16_dispo", answers); // 3 = plus de 10 h

  const pivot = answers.q18_pivot;
  const chosenLabels = Array.isArray(pivot) ? pivot : [];
  const chosenVerticals = VERTICALS.filter((v) => chosenLabels.includes(v.label));

  const hasImmediateDelay = chosenVerticals.some((v) => answers[`${v.key}_5`] === DELAI_OPTIONS[0]);

  if (finIndex === 3 && reseauIndex >= 3) {
    signals.push("Potentiel client direct également");
  }
  if (expIndex === 2 && dispoIndex === 3) {
    signals.push("Profil quasi-professionnel");
  }
  if (chosenVerticals.length >= 3 && reseauIndex >= 3) {
    signals.push("Réseau multi-potentiel");
  }
  if (hasImmediateDelay && reseauIndex >= 2) {
    signals.push("Opportunité chaude — mise en relation possible à très court terme");
  }

  return signals;
}
