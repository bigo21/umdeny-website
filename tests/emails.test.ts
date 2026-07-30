// Emails de candidature apporteur — conformité à la spec v2.0 partie 10.
//
//   npm run test:scoring

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { candidateEmail, teamEmail } from "../lib/emails/candidature-apporteur";
import { buildCandidature } from "../lib/quiz-apporteur/candidature";
import type { Answers } from "../lib/quiz-apporteur/types";

/** Candidature complète, calibrée pour déclencher les 4 signaux de la partie 7. */
const ANSWERS: Answers = {
  nom: "Ango",
  prenom: "Loic",
  email: "loic@example.com",
  tel: "+237600000000",
  q5_gate: "Oui",
  q6_geo: "Europe",
  q7_age: "35 – 44 ans",
  q8_pro: "Entrepreneur / Chef d'entreprise",
  q9_matri: "Marié(e) avec enfants",
  q10_fin: "Excédentaire : j'ai un capital disponible au-delà de mon épargne de précaution",
  q11_secteur: "Technologies, télécom, digital",
  q12_type_reseau: ["Réseau professionnel", "Clientèle B2B existante"],
  q13_taille_reseau: "Plus de 500 personnes",
  q14_canaux: ["WhatsApp", "Bouche-à-oreille"],
  q15_exp: "Oui, régulièrement",
  q16_dispo: "Plus de 10 heures",
  q17_motiv: "En faire une activité principale à terme",
  q18_pivot: ["Bourse & marchés financiers", "IP publique dédiée", "Crowdlending"],
  BOURSE_1: "Oui, plusieurs contacts clairement intéressés",
  BOURSE_2: "Je maîtrise déjà bien vos solutions et pourrais les présenter moi-même",
  BOURSE_3: "Les deux",
  BOURSE_4: "Ce sont des proches (famille, amis)",
  BOURSE_5: "Immédiatement",
  BOURSE_6: "Le manque de confiance",
  BOURSE_7: "Oui",
  IP_1: "Oui, quelques contacts",
  IP_2: "Aucune information, je découvre totalement le sujet",
  IP_3: "Douala",
  IP_4: "Ce sont des relations professionnelles",
  IP_5: "Sous 1 mois",
  IP_6: "Le budget disponible",
  IP_7: ["Banque, finance, assurance", "Technologies, télécom, digital"],
  CROWD_1: "Oui, quelques contacts",
  CROWD_2: "Quelques notions générales sur le sujet, mais pas sur notre offre précise",
  CROWD_3: "Au Cameroun",
  CROWD_4: "Ce sont des connaissances indirectes que je pourrais approcher",
  CROWD_5: "Entre 1 et 3 mois",
  CROWD_6: "Autre",
  CROWD_7: "Plus de 20 000 000 FCFA",
  liens: "https://linkedin.com/in/exemple",
  message: "Je gère un groupe WhatsApp de 800 entrepreneurs à Douala.",
};

describe("Email au candidat", () => {
  const mail = candidateEmail("Loic");

  it("porte l'objet exact de la spec", () => {
    assert.equal(mail.subject, "Votre candidature apporteur d'affaires — Umdeny");
  });

  it("ne contient ni lien Cal.com ni lien WhatsApp", () => {
    // Spec partie 10 : c'est l'équipe qui initie le contact suivant.
    for (const body of [mail.html, mail.text]) {
      assert.doesNotMatch(body, /cal\.com|calendly|wa\.me|whatsapp/i);
    }
  });

  it("ne divulgue ni score ni tag de priorité", () => {
    for (const body of [mail.html, mail.text]) {
      assert.doesNotMatch(body, /PRIORITAIRE|À QUALIFIER|EN VEILLE|\/100/);
    }
  });

  it("donne l'adresse de contact de l'équipe", () => {
    assert.match(mail.text, /partner@umdeny\.com/);
  });

  it("ne promet aucun délai précis autre que « quelques jours ouvrés »", () => {
    assert.match(mail.text, /quelques jours ouvrés/);
    assert.doesNotMatch(mail.text, /24\s?h|48\s?h|sous \d+ heures/i);
  });
});

describe("Email à l'équipe", () => {
  const built = buildCandidature(ANSWERS);
  const mail = teamEmail(built);

  it("porte un objet avec nom, tag et score", () => {
    assert.equal(mail.subject, "Nouvelle candidature apporteur — Loic Ango — 🟢 PRIORITAIRE — Score 100/100");
  });

  it("contient les 6 sections de la spec", () => {
    for (const section of [
      "1 · Identité",
      "2 · Synthèse de priorité",
      "3 · Parcours de formation recommandé",
      "4 · Bloc commun",
      "5 · Blocs conditionnels",
      "6 · Message libre",
    ]) {
      assert.ok(mail.html.includes(section), `section manquante : ${section}`);
    }
  });

  it("reporte le détail du score et la verticale la plus pertinente", () => {
    assert.match(mail.html, /100\/100/);
    assert.match(mail.html, /Bourse &amp; marchés financiers/);
  });

  it("liste les signaux complémentaires déclenchés", () => {
    for (const signal of [
      "Potentiel client direct également",
      "Profil quasi-professionnel",
      "Réseau multi-potentiel",
      "Opportunité chaude",
    ]) {
      assert.ok(mail.html.includes(signal), `signal manquant : ${signal}`);
    }
  });

  it("donne un parcours de formation distinct par verticale", () => {
    // Assertions sur la version texte : le HTML échappe les apostrophes.
    assert.match(mail.text, /IP publique dédiée : .* -> Formation complète depuis la base/);
    assert.match(mail.text, /Crowdlending : .* -> Formation ciblée sur l'offre Umdeny/);
    assert.match(mail.text, /Bourse & marchés financiers : .* -> Autonome/);
  });

  it("transmet les 7 réponses de chaque verticale cochée", () => {
    for (const label of ["Bourse &amp; marchés financiers", "IP publique dédiée", "Crowdlending"]) {
      assert.ok(mail.html.includes(label), `verticale manquante : ${label}`);
    }
    assert.match(mail.html, /Q_x7 Question spécifique/);
  });

  it("transmet le message libre intégralement, sans reformulation", () => {
    assert.ok(mail.html.includes("Je gère un groupe WhatsApp de 800 entrepreneurs à Douala."));
    assert.ok(mail.text.includes("Je gère un groupe WhatsApp de 800 entrepreneurs à Douala."));
  });

  it("échappe le contenu saisi par le candidat", () => {
    const hostile = { ...ANSWERS, message: '<script>alert("xss")</script>' };
    const html = teamEmail(buildCandidature(hostile)).html;
    assert.ok(!html.includes("<script>"), "la balise script ne doit pas passer telle quelle");
    assert.ok(html.includes("&lt;script&gt;"));
  });
});
