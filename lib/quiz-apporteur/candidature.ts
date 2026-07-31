// =====================================================
// QUIZ APPORTEUR D'AFFAIRES — Fiche de candidature
// Transforme les réponses brutes en la structure attendue par la table
// candidatures_apporteur (spec v2.0 partie 11) et par l'email interne
// (partie 10).
//
// Le score est TOUJOURS recalculé ici, côté serveur : le client ne peut pas
// s'attribuer un tag de priorité en modifiant sa requête.
// =====================================================

import { MAITRISE_OPTIONS, VERTICALS } from "./data";
import { computeFormationPaths, computeSignals } from "./insights";
import { computeScore, TAG_PLAIN } from "./scoring";
import type { Answers, QuizScore, VerticalKey } from "./types";

export interface VerticalAnswers {
  label: string;
  niveau_contact: string | null;
  niveau_maitrise: string | null;
  geographie: string | null;
  nature_relation: string | null;
  delai_mise_en_relation: string | null;
  frein_principal: string | null;
  question_specifique: string | string[] | null;
}

export interface CandidatureRow {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  pays: string | null;
  age_range: string | null;
  situation_pro: string | null;
  situation_matrimoniale: string | null;
  situation_financiere: string | null;
  secteur: string | null;
  reseau_type: string[];
  reseau_taille: string | null;
  canaux: string[];
  experience_commerciale: string | null;
  disponibilite: string | null;
  motivation: string | null;
  verticales_interet: string[];
  reponses_conditionnelles_json: Record<string, VerticalAnswers>;
  maitrise_par_verticale_json: Record<string, string>;
  parcours_formation_par_verticale_json: Record<string, string>;
  score_reseau: number;
  score_experience: number;
  score_disponibilite: number;
  score_pertinence_par_verticale_json: Partial<Record<VerticalKey, number>>;
  score_total: number;
  tag_priorite: string;
  signaux_complementaires: string[];
  liens_partages: string | null;
  message_libre: string | null;
  geo_tag: string | null;
  reponses_completes_json: Answers;
}

function str(answers: Answers, id: string): string | null {
  const value = answers[id];
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function list(answers: Answers, id: string): string[] {
  const value = answers[id];
  return Array.isArray(value) ? value : [];
}

/** Réponses aux 7 questions de chaque verticale cochée, avec des clés lisibles. */
export function buildConditionalAnswers(answers: Answers): Record<string, VerticalAnswers> {
  const chosen = list(answers, "q18_pivot");
  const result: Record<string, VerticalAnswers> = {};

  for (const vertical of VERTICALS) {
    if (!chosen.includes(vertical.label)) continue;

    const specific = answers[`${vertical.key}_7`];
    result[vertical.key] = {
      label: vertical.label,
      niveau_contact: str(answers, `${vertical.key}_1`),
      niveau_maitrise: str(answers, `${vertical.key}_2`),
      geographie: str(answers, `${vertical.key}_3`),
      nature_relation: str(answers, `${vertical.key}_4`),
      delai_mise_en_relation: str(answers, `${vertical.key}_5`),
      frein_principal: str(answers, `${vertical.key}_6`),
      question_specifique: Array.isArray(specific) ? specific : (str(answers, `${vertical.key}_7`) ?? null),
    };
  }

  return result;
}

export interface BuiltCandidature {
  row: CandidatureRow;
  score: QuizScore;
  signals: string[];
  formationPaths: ReturnType<typeof computeFormationPaths>;
}

export function buildCandidature(answers: Answers): BuiltCandidature {
  const score = computeScore(answers);
  const signals = computeSignals(answers);
  const formationPaths = computeFormationPaths(score);

  const maitriseByVertical: Record<string, string> = {};
  const parcoursByVertical: Record<string, string> = {};
  for (const path of formationPaths) {
    maitriseByVertical[path.verticalKey] = path.tag;
    parcoursByVertical[path.verticalKey] = path.parcours;
  }

  const row: CandidatureRow = {
    nom: str(answers, "nom") ?? "",
    prenom: str(answers, "prenom") ?? "",
    email: str(answers, "email") ?? "",
    telephone: str(answers, "tel") ?? "",
    pays: str(answers, "q6_geo"),
    age_range: str(answers, "q7_age"),
    situation_pro: str(answers, "q8_pro"),
    situation_matrimoniale: str(answers, "q9_matri"),
    situation_financiere: str(answers, "q10_fin"),
    secteur: str(answers, "q11_secteur"),
    reseau_type: list(answers, "q12_type_reseau"),
    reseau_taille: str(answers, "q13_taille_reseau"),
    canaux: list(answers, "q14_canaux"),
    experience_commerciale: str(answers, "q15_exp"),
    disponibilite: str(answers, "q16_dispo"),
    motivation: str(answers, "q17_motiv"),
    verticales_interet: list(answers, "q18_pivot"),
    reponses_conditionnelles_json: buildConditionalAnswers(answers),
    maitrise_par_verticale_json: maitriseByVertical,
    parcours_formation_par_verticale_json: parcoursByVertical,
    score_reseau: score.scoreReseau,
    score_experience: score.scoreExp,
    score_disponibilite: score.scoreDispo,
    score_pertinence_par_verticale_json: score.pertinenceDetail,
    score_total: score.scoreTotal,
    tag_priorite: TAG_PLAIN[score.tag] ?? "En veille",
    signaux_complementaires: signals,
    liens_partages: str(answers, "liens"),
    message_libre: str(answers, "message"),
    // Le pays de résidence sert de repère géographique dans le CRM.
    geo_tag: str(answers, "q6_geo"),
    reponses_completes_json: answers,
  };

  return { row, score, signals, formationPaths };
}

export interface ValidationResult {
  ok: boolean;
  status: number;
  error?: string;
}

/** Le client n'est pas digne de confiance : on revalide tout côté serveur. */
export function validateAnswers(answers: unknown): ValidationResult {
  if (typeof answers !== "object" || answers === null || Array.isArray(answers)) {
    return { ok: false, status: 400, error: "Réponses absentes ou malformées." };
  }

  const a = answers as Answers;

  for (const field of ["nom", "prenom", "email", "tel"]) {
    const value = a[field];
    if (typeof value !== "string" || value.trim().length === 0) {
      return { ok: false, status: 400, error: `Champ requis manquant : ${field}.` };
    }
  }

  const email = (a.email as string).trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, status: 400, error: "Adresse email invalide." };
  }

  // Spec partie 4 : une réponse « Non » à la majorité ne crée AUCUNE fiche CRM.
  if (a.q5_gate !== "Oui") {
    return { ok: false, status: 422, error: "Le programme est réservé aux personnes majeures." };
  }

  const verticals = a.q18_pivot;
  if (!Array.isArray(verticals) || verticals.length === 0) {
    return { ok: false, status: 400, error: "Au moins une opportunité doit être sélectionnée." };
  }

  const known = new Set(VERTICALS.map((v) => v.label));
  if (verticals.some((v) => typeof v !== "string" || !known.has(v))) {
    return { ok: false, status: 400, error: "Opportunité inconnue." };
  }

  // Garde-fou : les niveaux de maîtrise déclarés doivent appartenir au barème.
  for (const vertical of VERTICALS) {
    const maitrise = a[`${vertical.key}_2`];
    if (maitrise !== undefined && (typeof maitrise !== "string" || !MAITRISE_OPTIONS.includes(maitrise))) {
      return { ok: false, status: 400, error: "Niveau de maîtrise inconnu." };
    }
  }

  return { ok: true, status: 200 };
}
