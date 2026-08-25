// Scoring du quiz apporteur d'affaires — conformité à la spec v2.0.
// Ce score n'est jamais affiché au candidat : une erreur ici est silencieuse,
// d'où ces cas dérivés directement du document de contenu.
//
//   npm run test:scoring

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildScreens,
  COMMON_SCREENS,
  CONTACT_OPTIONS,
  DELAI_OPTIONS,
  GEO_CITY_OPTIONS,
  GEO_STANDARD_OPTIONS,
  RELATION_OPTIONS,
  VERTICALS,
} from "../lib/quiz-apporteur/data";
import { computeScore } from "../lib/quiz-apporteur/scoring";
import type { Answers } from "../lib/quiz-apporteur/types";

/** Options d'un écran commun, pour construire des réponses par index. */
function opts(screenId: string): string[] {
  const screen = COMMON_SCREENS.find((s) => s.id === screenId);
  assert.ok(screen?.options, `écran ${screenId} introuvable ou sans options`);
  return screen.options;
}

/** Profil au maximum sur les 4 axes de score. */
const MAX_PROFILE: Answers = {
  q13_taille_reseau: opts("q13_taille_reseau")[4],
  q15_exp: opts("q15_exp")[2],
  q16_dispo: opts("q16_dispo")[3],
  q18_pivot: ["Bourse & marchés financiers"],
  BOURSE_1: CONTACT_OPTIONS[0],
  BOURSE_3: GEO_STANDARD_OPTIONS[2],
  BOURSE_4: RELATION_OPTIONS[0],
  BOURSE_5: DELAI_OPTIONS[0],
};

describe("Score total et tags de priorité", () => {
  it("profil maximal : 100/100 et tag PRIORITAIRE", () => {
    const score = computeScore(MAX_PROFILE);
    assert.equal(score.scoreTotal, 100);
    assert.equal(score.tag, "🟢 PRIORITAIRE");
    assert.equal(score.scorePertinence, 100);
  });

  it("profil minimal : 25/100 et tag EN VEILLE", () => {
    // réseau 20x0,35 + exp 33,3x0,20 + dispo 25x0,20 + pertinence 27,3x0,25 = 25,48
    const score = computeScore({
      q13_taille_reseau: opts("q13_taille_reseau")[0],
      q15_exp: opts("q15_exp")[0],
      q16_dispo: opts("q16_dispo")[0],
      q18_pivot: ["Bourse & marchés financiers"],
      BOURSE_1: CONTACT_OPTIONS[2],
      BOURSE_3: GEO_STANDARD_OPTIONS[0],
      BOURSE_4: RELATION_OPTIONS[2],
      BOURSE_5: DELAI_OPTIONS[3],
    });
    assert.equal(score.scoreTotal, 25);
    assert.equal(score.tag, "⚪ EN VEILLE");
  });

  it("profil intermédiaire : 63/100 et tag À QUALIFIER", () => {
    const score = computeScore({
      q13_taille_reseau: opts("q13_taille_reseau")[2],
      q15_exp: opts("q15_exp")[1],
      q16_dispo: opts("q16_dispo")[1],
      q18_pivot: ["Bourse & marchés financiers"],
      BOURSE_1: CONTACT_OPTIONS[1],
      BOURSE_3: GEO_STANDARD_OPTIONS[2],
      BOURSE_4: RELATION_OPTIONS[1],
      BOURSE_5: DELAI_OPTIONS[1],
    });
    assert.equal(score.scoreTotal, 63);
    assert.equal(score.tag, "🟡 À QUALIFIER");
  });

  it("aucune réponse : score nul, sans planter", () => {
    const score = computeScore({});
    assert.equal(score.scoreTotal, 0);
    assert.equal(score.tag, "⚪ EN VEILLE");
  });
});

describe("Pertinence verticale", () => {
  it("retient le MAX et non la moyenne entre verticales", () => {
    // Spec partie 7 : un réseau exceptionnel sur une verticale ne doit pas
    // être pénalisé par une verticale cochée par curiosité.
    const score = computeScore({
      ...MAX_PROFILE,
      q18_pivot: ["Bourse & marchés financiers", "Trading algorithmique"],
      TRADING_1: CONTACT_OPTIONS[2],
      TRADING_3: GEO_STANDARD_OPTIONS[0],
      TRADING_4: RELATION_OPTIONS[2],
      TRADING_5: DELAI_OPTIONS[3],
    });
    assert.equal(score.scorePertinence, 100);
    assert.equal(score.scoreTotal, 100);
    assert.deepEqual(score.pertinenceDetail, { BOURSE: 100, TRADING: 27 });
  });

  it("applique le barème « city » propre à IP publique dédiée", () => {
    // « Hors du Cameroun » vaut 0 pt : 3 + 0 + 3 + 3 = 9/11
    const score = computeScore({
      q13_taille_reseau: opts("q13_taille_reseau")[4],
      q15_exp: opts("q15_exp")[2],
      q16_dispo: opts("q16_dispo")[3],
      q18_pivot: ["IP publique dédiée"],
      IP_1: CONTACT_OPTIONS[0],
      IP_3: GEO_CITY_OPTIONS[3],
      IP_4: RELATION_OPTIONS[0],
      IP_5: DELAI_OPTIONS[0],
    });
    assert.equal(score.scorePertinence, 82);
  });
});

describe("Niveau de maîtrise", () => {
  it("n'entre pas dans le score de priorité", () => {
    const withMaitrise = { ...MAX_PROFILE, BOURSE_2: "Aucune information, je découvre totalement le sujet" };
    assert.equal(computeScore(withMaitrise).scoreTotal, computeScore(MAX_PROFILE).scoreTotal);
  });

  it("est collecté à part, pour le parcours de formation", () => {
    const withMaitrise = { ...MAX_PROFILE, BOURSE_2: "Aucune information, je découvre totalement le sujet" };
    assert.deepEqual(computeScore(withMaitrise).maitriseByVertical, {
      BOURSE: "Aucune information, je découvre totalement le sujet",
    });
  });
});

describe("Construction du parcours", () => {
  it("sans verticale : 15 écrans communs + 1 écran final", () => {
    // Q1 à Q4 tiennent sur un seul écran d'identité, d'où 15 et non 18.
    assert.equal(buildScreens({}).length, 16);
  });

  it("avec les 6 verticales : 15 + 6x(1 intro + 7 questions) + 1", () => {
    const all = buildScreens({ q18_pivot: VERTICALS.map((v) => v.label) });
    assert.equal(all.length, 15 + 6 * 8 + 1);
  });

  it("totalise les 61 questions de la spec, plus la question pivot", () => {
    const all = buildScreens({ q18_pivot: VERTICALS.map((v) => v.label) });
    const questions = all.reduce(
      // Les cases de consentement ne sont pas des questions de la spec : elles
      // ne comptent pas dans ce total, qui vérifie la couverture du contenu.
      (n, s) =>
        n +
        (s.type === "fields"
          ? (s.fields ?? []).filter((f) => f.type !== "consent").length
          : s.type === "intro"
            ? 0
            : 1),
      0,
    );
    assert.equal(questions, 62);
  });

  it("pose les deux consentements sur le dernier écran, RGPD obligatoire", () => {
    const all = buildScreens({ q18_pivot: [VERTICALS[0].label] });
    const consents = (all[all.length - 1].fields ?? []).filter((f) => f.type === "consent");

    assert.deepEqual(
      consents.map((f) => [f.id, f.required]),
      [
        ["consentement_rgpd", true],
        ["consentement_contact", false],
      ],
    );
  });

  it("insère les verticales dans l'ordre de la liste Q18", () => {
    const all = buildScreens({ q18_pivot: ["Crowdlending", "Bourse & marchés financiers"] });
    const intros = all.filter((s) => s.type === "intro").map((s) => s.verticalKey);
    assert.deepEqual(intros, ["BOURSE", "CROWD"]);
  });
});
