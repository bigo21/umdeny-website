// =====================================================
// QUIZ CANDIDATURE — APPORTEUR D'AFFAIRES — Contenu
// Port fidèle de design_handoff_site_umdeny/src/quiz-apporteur-data.js
// Aucune marque (Badawo, Mobile Wallet PLC, Cherryz, Umdeny Capital)
// n'apparaît côté candidat : la correspondance se fait en interne.
// =====================================================

import type { QuizScreen, Vertical, VerticalKey, VerticalTheme } from "./types";

/** Nom de l'icône (voir app/components/icons.tsx) associée à chaque verticale. */
export const VERTICAL_ICONS: Record<VerticalKey, string> = {
  BOURSE: "chart",
  TRADING: "target",
  MOMO: "smartphone",
  WIFI: "tower",
  IP: "globe",
  CROWD: "hands",
};

// Teinte distincte par verticale — même famille de clarté/chroma, la teinte
// seule varie, pour servir de repère de navigation entre les blocs.
export const VERTICAL_THEMES: Record<VerticalKey, VerticalTheme> = {
  BOURSE: { bg: "oklch(97% 0.018 250)", border: "oklch(87% 0.05 250)", accent: "oklch(62% 0.10 250)", ink: "oklch(38% 0.08 250)" },
  TRADING: { bg: "oklch(97% 0.018 300)", border: "oklch(87% 0.05 300)", accent: "oklch(62% 0.10 300)", ink: "oklch(38% 0.08 300)" },
  MOMO: { bg: "oklch(97% 0.018 155)", border: "oklch(87% 0.05 155)", accent: "oklch(58% 0.10 155)", ink: "oklch(36% 0.08 155)" },
  WIFI: { bg: "oklch(97% 0.018 205)", border: "oklch(87% 0.05 205)", accent: "oklch(60% 0.09 205)", ink: "oklch(37% 0.07 205)" },
  IP: { bg: "oklch(97% 0.018 278)", border: "oklch(87% 0.05 278)", accent: "oklch(60% 0.10 278)", ink: "oklch(38% 0.08 278)" },
  CROWD: { bg: "oklch(97% 0.018 35)", border: "oklch(87% 0.05 35)", accent: "oklch(62% 0.11 35)", ink: "oklch(40% 0.09 35)" },
};

export const VERTICALS: Vertical[] = [
  {
    key: "BOURSE",
    label: "Bourse & marchés financiers",
    q1: "Avez-vous des contacts intéressés par la bourse ou l'investissement en actions, obligations ?",
    geoType: "standard",
    q7: {
      title: "Vos contacts ont-ils déjà investi en bourse ou dans des produits financiers par le passé ?",
      type: "radio",
      options: ["Oui", "Non", "Je ne sais pas"],
    },
  },
  {
    key: "TRADING",
    label: "Trading algorithmique",
    q1: "Avez-vous des contacts intéressés par un système de trading automatisé (sans gestion active de leur part) ?",
    geoType: "standard",
    q7: {
      title: "Vos contacts recherchent-ils surtout un revenu passif sans y consacrer de temps, ou sont-ils prêts à suivre activement leurs performances ?",
      type: "radio",
      options: ["Un revenu passif, sans y consacrer de temps", "Un suivi actif de leurs performances", "Les deux, selon le montant investi"],
    },
  },
  {
    key: "MOMO",
    label: "Mobile Money",
    q1: "Connaissez-vous des personnes avec un budget d'investissement au-dessus de 20 000 000 FCFA, intéressées par ouvrir une franchise ou investir dans ce type de business ?",
    geoType: "standard",
    q7: {
      title: "Ces personnes ont-elles déjà une activité commerciale existante (commerce, boutique, agence) où ce service pourrait s'intégrer ?",
      type: "radio",
      options: ["Oui", "Non", "Je ne sais pas"],
    },
  },
  {
    key: "WIFI",
    label: "WiFi Zone",
    q1: "Connaissez-vous des personnes cherchant un business à revenus quotidiens quasi passifs, avec un budget en dessous de 10 000 000 FCFA ?",
    geoType: "standard",
    q7: {
      title: "Vos contacts recherchent-ils un actif qu'ils géreraient eux-mêmes, ou totalement délégué à une équipe technique ?",
      type: "radio",
      options: ["Gestion autonome", "Gestion totalement déléguée", "Les deux, selon le projet"],
    },
  },
  {
    key: "IP",
    label: "IP publique dédiée",
    q1: "Connaissez-vous des Directeurs Généraux, Directeurs Techniques ou Directeurs Financiers d'entreprise, ayant le pouvoir de décision sur le choix des fournisseurs ou partenaires ?",
    geoType: "city",
    q7: {
      title: "Dans quel(s) secteur(s) évoluent principalement ces contacts ?",
      type: "checkbox",
      options: [
        "Banque, finance, assurance",
        "Technologies, télécom, digital",
        "Bâtiment, immobilier, BTP",
        "Santé et pharmacie",
        "Commerce, import-export, distribution",
        "Autre secteur",
      ],
    },
  },
  {
    key: "CROWD",
    label: "Crowdlending",
    q1: "Connaissez-vous des personnes qui voudraient investir dans des projets, à partir de 1 000 000 FCFA ?",
    geoType: "standard",
    q7: {
      title: "Quel montant moyen pensez-vous que ces personnes pourraient engager par projet ?",
      type: "radio",
      options: [
        "Moins de 1 000 000 FCFA",
        "Entre 1 000 000 et 5 000 000 FCFA",
        "Entre 5 000 000 et 20 000 000 FCFA",
        "Plus de 20 000 000 FCFA",
      ],
    },
  },
];

// ---- Jeux d'options réutilisés par tous les blocs conditionnels ----
// L'ordre fait foi : le scoring travaille sur l'index de la réponse.
export const CONTACT_OPTIONS = [
  "Oui, plusieurs contacts clairement intéressés",
  "Oui, quelques contacts",
  "Non, mais je pense pouvoir en trouver",
];

export const MAITRISE_OPTIONS = [
  "Aucune information, je découvre totalement le sujet",
  "Quelques notions générales sur le sujet, mais pas sur notre offre précise",
  "Je connais assez bien le sujet et les grandes lignes de votre offre",
  "Je maîtrise déjà bien vos solutions et pourrais les présenter moi-même",
];

export const RELATION_OPTIONS = [
  "Ce sont des proches (famille, amis)",
  "Ce sont des relations professionnelles",
  "Ce sont des connaissances indirectes que je pourrais approcher",
];

export const DELAI_OPTIONS = ["Immédiatement", "Sous 1 mois", "Entre 1 et 3 mois", "Plus de 3 mois"];

export const FREIN_OPTIONS = ["La méconnaissance du sujet", "Le manque de confiance", "Le budget disponible", "Autre"];

export const GEO_STANDARD_OPTIONS = ["Au Cameroun", "À l'étranger / dans la diaspora", "Les deux"];

export const GEO_CITY_OPTIONS = ["Douala", "Yaoundé", "Une autre ville du Cameroun", "Hors du Cameroun"];

/** Les 7 questions déroulées pour chaque verticale cochée à Q18. */
export function buildVerticalScreens(vertical: Vertical): QuizScreen[] {
  const geoOptions = vertical.geoType === "city" ? GEO_CITY_OPTIONS : GEO_STANDARD_OPTIONS;
  const geoTitle =
    vertical.geoType === "city" ? "Dans quelle ville sont basées ces entreprises ?" : "Ces contacts sont-ils basés :";

  return [
    { id: `${vertical.key}_1`, type: "radio", title: vertical.q1, options: CONTACT_OPTIONS },
    {
      id: `${vertical.key}_2`,
      type: "radio",
      title: `Quel est votre niveau de connaissance des solutions ${vertical.label.toLowerCase()} proposées par notre structure ?`,
      options: MAITRISE_OPTIONS,
      note: "Cette réponse n'entre pas dans le score de priorité : elle nous permet de préparer un accompagnement de formation adapté à votre niveau.",
    },
    { id: `${vertical.key}_3`, type: "radio", title: geoTitle, options: geoOptions },
    { id: `${vertical.key}_4`, type: "radio", title: "Quelle est la nature de votre relation avec ces contacts ?", options: RELATION_OPTIONS },
    { id: `${vertical.key}_5`, type: "radio", title: "Sous quel délai pensez-vous pouvoir organiser une première mise en relation ?", options: DELAI_OPTIONS },
    { id: `${vertical.key}_6`, type: "radio", title: "Selon vous, quel est le principal frein de ces contacts vis-à-vis de cette opportunité ?", options: FREIN_OPTIONS },
    { id: `${vertical.key}_7`, type: vertical.q7.type, title: vertical.q7.title, options: vertical.q7.options },
  ];
}

/** Les 17 questions communes, posées avant la sélection des verticales. */
export const COMMON_SCREENS: QuizScreen[] = [
  {
    id: "identity",
    type: "fields",
    block: "Faisons connaissance",
    fields: [
      { id: "nom", label: "Nom", type: "text", required: true },
      { id: "prenom", label: "Prénom", type: "text", required: true },
      { id: "email", label: "Email", type: "email", required: true },
      { id: "tel", label: "Téléphone / WhatsApp", type: "tel", required: true },
    ],
  },
  {
    id: "q5_gate",
    type: "radio",
    block: "Faisons connaissance",
    title: "Confirmez-vous avoir 18 ans ou plus ?",
    options: ["Oui", "Non"],
    gate: true,
  },
  {
    id: "q6_geo",
    type: "radio",
    block: "Faisons connaissance",
    title: "Où résidez-vous actuellement ?",
    options: ["Au Cameroun", "Afrique Centrale (hors Cameroun)", "Afrique de l'Ouest", "Autre pays africain", "Europe", "Amérique", "Autre"],
  },
  {
    id: "q7_age",
    type: "radio",
    block: "Faisons connaissance",
    title: "Quelle est votre tranche d'âge ?",
    options: ["18 – 24 ans", "25 – 34 ans", "35 – 44 ans", "45 – 54 ans", "55 ans et plus"],
  },

  {
    id: "q8_pro",
    type: "radio",
    block: "Votre situation actuelle",
    title: "Quelle est votre situation professionnelle ?",
    options: [
      "Salarié du secteur privé",
      "Fonctionnaire / Agent de l'État",
      "Entrepreneur / Chef d'entreprise",
      "Profession libérale (médecin, avocat, expert-comptable…)",
      "Investisseur / Je vis de mes revenus patrimoniaux",
      "Étudiant ou en formation",
      "En transition / Sans activité principale",
    ],
  },
  {
    id: "q9_matri",
    type: "radio",
    block: "Votre situation actuelle",
    title: "Quelle est votre situation matrimoniale ?",
    options: ["Célibataire sans enfants", "Célibataire avec enfants", "Marié(e) sans enfants", "Marié(e) avec enfants"],
  },
  {
    id: "q10_fin",
    type: "radio",
    block: "Votre situation actuelle",
    title: "Comment décririez-vous votre situation financière actuelle ?",
    options: [
      "Endettée : mes dettes absorbent l'essentiel de mes revenus",
      "Fragile : mes revenus couvrent mes dépenses avec peu de marge",
      "Équilibrée : j'ai une épargne régulière et mes finances sont stables",
      "Excédentaire : j'ai un capital disponible au-delà de mon épargne de précaution",
    ],
    hint: "Cette réponse ne conditionne jamais votre candidature : le statut d'apporteur ne requiert aucun capital.",
  },
  {
    id: "q11_secteur",
    type: "radio",
    block: "Votre situation actuelle",
    title: "Dans quel secteur exercez-vous ?",
    options: [
      "Banque, finance, assurance",
      "Santé et pharmacie",
      "Commerce, import-export, distribution",
      "Bâtiment, immobilier, BTP",
      "Technologies, télécom, digital",
      "Agriculture, agro-industrie",
      "Transport et logistique",
      "Droit, conseil, audit",
      "Éducation, formation",
      "Fonction publique / Administration",
      "Autre secteur",
    ],
  },

  {
    id: "q12_type_reseau",
    type: "checkbox",
    block: "Parlons de votre réseau",
    title: "Quel type de réseau pouvez-vous mobiliser ?",
    hint: "Plusieurs choix possibles.",
    options: ["Famille et amis proches", "Réseau professionnel", "Communauté / association", "Audience sur les réseaux sociaux", "Clientèle B2B existante"],
  },
  {
    id: "q13_taille_reseau",
    type: "radio",
    block: "Parlons de votre réseau",
    title: "Combien de personnes de ce réseau pourraient être réellement intéressées par une ou plusieurs des opportunités que nous allons vous présenter ?",
    options: ["Moins de 20 personnes", "Entre 20 et 50 personnes", "Entre 50 et 150 personnes", "Entre 150 et 500 personnes", "Plus de 500 personnes"],
  },
  {
    id: "q14_canaux",
    type: "checkbox",
    block: "Parlons de votre réseau",
    title: "Par quels canaux touchez-vous habituellement ce réseau ?",
    hint: "Plusieurs choix possibles.",
    options: ["WhatsApp", "Réseaux sociaux (Facebook, Instagram, TikTok, LinkedIn…)", "Terrain / rencontres physiques", "Bouche-à-oreille", "Autre"],
  },

  {
    id: "q15_exp",
    type: "radio",
    block: "Expérience & disponibilité",
    title: "Avez-vous déjà une expérience commerciale ou d'apporteur d'affaires ?",
    options: ["Jamais", "Ponctuellement", "Oui, régulièrement"],
  },
  {
    id: "q16_dispo",
    type: "radio",
    block: "Expérience & disponibilité",
    title: "Combien de temps pouvez-vous consacrer à cette activité chaque semaine ?",
    options: ["Moins de 2 heures", "2 à 5 heures", "5 à 10 heures", "Plus de 10 heures"],
  },
  {
    id: "q17_motiv",
    type: "radio",
    block: "Expérience & disponibilité",
    title: "Quelle est votre principale motivation ?",
    options: ["Un revenu complémentaire ponctuel", "En faire une activité principale à terme", "Développer mon réseau et mes opportunités", "Autre"],
  },

  {
    id: "q18_pivot",
    type: "checkbox",
    block: "Vos opportunités",
    title: "Quelle(s) opportunité(s) souhaitez-vous recommander à votre réseau ?",
    pivot: true,
    hint: "Plusieurs choix possibles, au moins 1 requis.",
    options: VERTICALS.map((v) => v.label),
  },
];

export const COMPLEMENTARY_SCREEN: QuizScreen = {
  id: "complementary",
  type: "fields",
  block: "Une dernière chose",
  title: "Une dernière chose avant d'envoyer votre candidature",
  fields: [
    {
      id: "liens",
      label: "Liens utiles",
      sub: "Page Facebook, Instagram, TikTok, LinkedIn, site web, chaîne YouTube, groupe WhatsApp/Telegram que vous animez…",
      type: "textarea",
      required: false,
    },
    {
      id: "message",
      label: "Message pour l'équipe",
      sub: "Contexte particulier, question, précision sur votre réseau ou votre situation.",
      type: "textarea",
      required: false,
    },
  ],
};

export const TRAIL_BLOCKS = [
  "Faisons connaissance",
  "Votre situation actuelle",
  "Parlons de votre réseau",
  "Expérience & disponibilité",
  "Vos opportunités",
  "Détails",
  "Une dernière chose",
];

/**
 * Construit la liste d'écrans complète à partir des réponses courantes.
 * Chaque verticale cochée à Q18 insère un écran d'intro + ses 7 questions,
 * dans l'ordre de la liste Q18. La longueur varie donc en cours de parcours.
 */
export function buildScreens(answers: Record<string, string | string[]>): QuizScreen[] {
  const screens: QuizScreen[] = [...COMMON_SCREENS];

  const pivot = answers.q18_pivot;
  const chosenLabels = Array.isArray(pivot) ? pivot : [];
  const chosenVerticals = VERTICALS.filter((v) => chosenLabels.includes(v.label));

  chosenVerticals.forEach((vertical, vi) => {
    screens.push({
      id: `${vertical.key}_intro`,
      type: "intro",
      conditional: true,
      verticalKey: vertical.key,
      verticalLabel: vertical.label,
      sectionIndex: vi + 1,
      sectionTotal: chosenVerticals.length,
    });

    buildVerticalScreens(vertical).forEach((questionScreen, qi) => {
      screens.push({
        ...questionScreen,
        conditional: true,
        verticalKey: vertical.key,
        verticalLabel: vertical.label,
        remaining: 7 - qi,
      });
    });
  });

  screens.push(COMPLEMENTARY_SCREEN);
  return screens;
}
