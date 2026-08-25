// =====================================================
// QUIZ CANDIDATURE — APPORTEUR D'AFFAIRES
// Types partagés par les 4 variantes d'interface.
// Référence : QUIZ_CANDIDATURE_-_APPORTEUR_D'AFFAIRES_UMDENY.pdf (v2.0)
// =====================================================

export type VerticalKey = "BOURSE" | "TRADING" | "MOMO" | "WIFI" | "IP" | "CROWD";

export type GeoType = "standard" | "city";

// Le booléen sert aux deux cases de consentement : une case cochée n'est pas
// une réponse parmi des options, et la stocker en "Oui"/"Non" obligerait
// chaque lecteur à réinterpréter une chaîne là où les colonnes
// consentement_rgpd / consentement_contact sont des booléens.
export type AnswerValue = string | string[] | boolean;
export type Answers = Record<string, AnswerValue>;

export type FieldType = "text" | "email" | "tel" | "textarea" | "consent";

export interface QuizField {
  id: string;
  label: string;
  sub?: string;
  type: FieldType;
  /** Pour un champ « consent », signifie : la case doit être cochée pour continuer. */
  required: boolean;
}

export type ScreenType = "fields" | "radio" | "checkbox" | "intro";

export interface QuizScreen {
  id: string;
  type: ScreenType;
  /** Titre de bloc affiché au-dessus de la question (écrans communs uniquement). */
  block?: string;
  title?: string;
  options?: string[];
  fields?: QuizField[];
  hint?: string;
  note?: string;
  /** q5_gate : une réponse « Non » interrompt la candidature. */
  gate?: boolean;
  /** q18_pivot : détermine les blocs conditionnels à dérouler. */
  pivot?: boolean;

  // ---- Décorations ajoutées aux écrans conditionnels ----
  conditional?: boolean;
  verticalKey?: VerticalKey;
  verticalLabel?: string;
  /** Nombre de questions restantes dans le bloc de la verticale. */
  remaining?: number;
  sectionIndex?: number;
  sectionTotal?: number;
}

export interface VerticalTheme {
  bg: string;
  border: string;
  accent: string;
  ink: string;
}

export interface Vertical {
  key: VerticalKey;
  label: string;
  q1: string;
  geoType: GeoType;
  q7: {
    title: string;
    type: "radio" | "checkbox";
    options: string[];
  };
}

export interface QuizScore {
  scoreReseau: number;
  scoreExp: number;
  scoreDispo: number;
  scorePertinence: number;
  scoreTotal: number;
  tag: string;
  /** Score de pertinence par verticale cochée. */
  pertinenceDetail: Partial<Record<VerticalKey, number>>;
  /** Niveau de maîtrise déclaré par verticale — alimente le parcours de formation. */
  maitriseByVertical: Partial<Record<VerticalKey, string | null>>;
}

export interface QuizPayload {
  answers: Answers;
  score: QuizScore;
  submittedAt: string;
}

/** Étape du parcours candidat, commune aux 4 variantes d'interface. */
export type QuizPhase = "landing" | "quiz" | "exit" | "thanks";
