// Parcours candidat du quiz apporteur d'affaires, dans un vrai navigateur.
// Détecte automatiquement la variante servie (Actuel, Éditorial, Assistant,
// Cartes) et applique le même jeu de vérifications à toutes.
//
//   npm run build && npx next start -p 3000
//   npm run test:quiz                 # port 3000 par défaut
//   PORT=3993 npm run test:quiz       # autre port
//
// Le port passe par l'environnement et non par un argument : `node --test`
// interprète tout argument supplémentaire comme un fichier de test à charger.
//
// Utilise le Chrome installé sur la machine (playwright-core, sans
// téléchargement de navigateur).

import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { chromium } from "playwright-core";

const PORT = process.env.PORT ?? "3000";
const URL = `http://localhost:${PORT}/apporteur-affaires`;

// Chaque variante nomme ses classes et affiche son compteur différemment.
const VARIANTS = {
  qz: { name: "Actuel", count: ".qz-count", fmt: (i, t) => `Étape ${i} / ${t}` },
  qm1: { name: "Éditorial", count: ".qm1-count", fmt: (i, t) => `${i} / ${t}` },
  qm2: { name: "Assistant", count: ".qm2-topbar__count", fmt: (i, t) => `${i} / ${t}` },
  qm3: { name: "Cartes", count: ".qm3-visual__progress-label strong", fmt: (i, t) => `${i} / ${t}` },
};

let browser;
let page;
let V;
let P;

const next = () => page.locator(`.${P}-nav button.btn--gold`);
const count = () => page.locator(V.count).textContent();

async function startQuiz() {
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Commencer ma candidature/ }).click();
}

async function fillIdentity() {
  await page.fill("#f_nom", "Ango");
  await page.fill("#f_prenom", "Loic");
  await page.fill("#f_email", "loic@example.com");
  await page.fill("#f_tel", "+237600000000");
}

/** Répond « première option » sur n écrans à choix et avance. */
async function answerScreens(n) {
  for (let i = 0; i < n; i++) {
    await page.locator(`.${P}-opt`).first().click();
    await next().click();
  }
}

before(async () => {
  browser = await chromium.launch({ channel: "chrome" });
  page = await browser.newPage();

  const html = await (await fetch(URL)).text();
  P = Object.keys(VARIANTS).find((prefix) => html.includes(`"${prefix}-`) || html.includes(` ${prefix}-`));
  assert.ok(P, `aucune variante reconnue sur ${URL} — préfixes attendus : ${Object.keys(VARIANTS).join(", ")}`);
  V = VARIANTS[P];
  console.log(`\nVariante détectée : ${V.name} (préfixe ${P}-)\n`);
});

after(async () => {
  await browser?.close();
});

describe("Écran d'identité", () => {
  it("démarre sur le premier des 16 écrans", async () => {
    await startQuiz();
    assert.equal(await count(), V.fmt(1, 16));
  });

  it("bloque tant que les 4 champs requis ne sont pas remplis", async () => {
    assert.equal(await next().isDisabled(), true);
    await page.fill("#f_nom", "Ango");
    await page.fill("#f_prenom", "Loic");
    await page.fill("#f_email", "loic@example.com");
    assert.equal(await next().isDisabled(), true, "doit rester bloqué sans téléphone");
    await page.fill("#f_tel", "+237600000000");
    assert.equal(await next().isDisabled(), false);
  });
});

describe("Condition d'éligibilité (18 ans)", () => {
  it("interrompt le parcours sur « Non », sans rien soumettre", async () => {
    await startQuiz();
    await fillIdentity();
    await next().click();
    assert.match(await page.locator(`.${P}-q-title`).textContent(), /18 ans/);

    await page.getByText("Non", { exact: true }).click();
    await next().click();

    assert.equal(await page.locator(`.${P}-exit h2`).textContent(), "Merci pour votre intérêt.");
    assert.equal(await page.locator(`.${P}-nav`).count(), 0, "plus aucune navigation après la sortie");
  });
});

describe("Question pivot Q18", () => {
  it("allonge le parcours d'un bloc par verticale cochée", async () => {
    await startQuiz();
    await fillIdentity();
    await next().click();
    await page.getByText("Oui", { exact: true }).click();
    await next().click();
    await answerScreens(12);

    assert.match(await page.locator(`.${P}-q-title`).textContent(), /Quelle\(s\) opportunité\(s\)/);
    assert.equal(await count(), V.fmt(15, 16));

    await page.locator(`.${P}-opt`, { hasText: "Bourse & marchés financiers" }).click();
    assert.equal(await count(), V.fmt(15, 24), "1 verticale = +8 écrans");

    await page.locator(`.${P}-opt`, { hasText: "Mobile Money" }).click();
    assert.equal(await count(), V.fmt(15, 32), "2 verticales = +16 écrans");
  });

  it("raccourcit au décochage sans éjecter le candidat", async () => {
    // La version vanilla du handoff sautait à l'écran de remerciement ici.
    await page.locator(`.${P}-opt`, { hasText: "Mobile Money" }).click();
    assert.equal(await count(), V.fmt(15, 24));
    assert.equal(await page.locator(`.${P}-q-title`).count(), 1, "toujours sur la question pivot");
  });
});

describe("Bloc conditionnel", () => {
  it("ouvre sur l'intro de la verticale puis décompte ses 7 questions", async () => {
    await next().click();
    assert.match(await page.locator(`.${P}-card`).innerText(), /Bourse & marchés financiers/);
    await next().click();
    assert.match(await page.locator(`.${P}-card`).innerText(), /encore 7/);
  });
});

describe("Soumission", () => {
  it("laisse envoyer sans remplir les champs optionnels", async () => {
    await answerScreens(7);
    assert.match(await page.locator(`.${P}-card`).innerText(), /optionnel/);
    assert.equal(await next().isDisabled(), false);
    assert.match(await next().textContent(), /Envoyer ma candidature/);
  });

  it("affiche une confirmation sans lien ni navigation", async () => {
    // Spec v2.0 partie 12 : message texte seul dans la pop-up.
    await next().click();
    assert.equal(await page.locator(`.${P}-modal`).count(), 1);
    assert.equal(await page.locator(`.${P}-modal h3`).textContent(), "Votre candidature a bien été reçue.");
    assert.equal(await page.locator(`.${P}-modal a`).count(), 0, "aucun lien");
    assert.equal(await page.locator(`.${P}-modal button`).count(), 1, "un seul bouton, de fermeture");
  });

  it("ne laisse fuiter aucun score au candidat", async () => {
    // Spec v2.0 partie 9 : score et tags sont strictement internes.
    const body = await page.locator("body").innerText();
    assert.doesNotMatch(body, /PRIORITAIRE|À QUALIFIER|EN VEILLE|\/100/);
  });

  it("passe à l'écran de remerciement une fois la modale fermée", async () => {
    await page.locator(`.${P}-modal button`).click();
    assert.equal(await page.locator(`.${P}-modal`).count(), 0);
    assert.equal(
      await page.locator(`.${P}-thanks h2`).textContent(),
      "Votre candidature est en cours de traitement.",
    );
  });
});
