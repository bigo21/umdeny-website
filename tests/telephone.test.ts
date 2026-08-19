// Composition du numéro au format E.164.
//
// Ces cas méritent un test parce que leur échec est silencieux : un numéro mal
// formé n'arrête pas l'inscription, il fait refuser la requête entière par
// Brevo — le contact n'est alors pas créé du tout. Personne ne le verrait
// depuis le formulaire, qui affiche sa confirmation habituelle.

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { composerE164, erreurTelephone, INDICATIFS, INDICATIF_PAR_DEFAUT } from "../lib/webinaire/telephone";

describe("composerE164", () => {
  it("colle l'indicatif au numéro national", () => {
    assert.equal(composerE164("+237", "657559616"), "+237657559616");
  });

  it("retire les séparateurs de saisie", () => {
    assert.equal(composerE164("+237", "6 57 55 96 16"), "+237657559616");
    assert.equal(composerE164("+33", "06-12-34-56-78"), "+33612345678");
    assert.equal(composerE164("+33", "(0) 6.12.34.56.78"), "+33612345678");
  });

  it("abandonne le zéro interurbain, comme le veut l'international", () => {
    assert.equal(composerE164("+33", "0612345678"), "+33612345678");
  });

  it("ne concatène pas un numéro déjà international", () => {
    // Sans cette tolérance, un copier-coller donnerait +237237657559616.
    assert.equal(composerE164("+237", "+237657559616"), "+237657559616");
    assert.equal(composerE164("+237", "+33 6 12 34 56 78"), "+33612345678");
    assert.equal(composerE164("+237", "00237657559616"), "+237657559616");
  });

  it("rend null sur une saisie vide, pour que la clé soit omise du payload", () => {
    assert.equal(composerE164("+237", ""), null);
    assert.equal(composerE164("+237", "   "), null);
    assert.equal(composerE164("+237", "abc"), null);
  });

  it("refuse au-delà de 15 chiffres au lieu de tronquer", () => {
    // Tronquer produirait un numéro syntaxiquement valide mais faux, qui
    // partirait en campagne SMS sans que rien ne signale l'erreur.
    assert.equal(composerE164("+237", "1234567890123456789"), null);
    // Pile à la borne, en revanche, doit passer.
    assert.equal(composerE164("+237", "123456789012"), "+237123456789012");
  });

  it("compte l'indicatif dans le plafond, pas seulement la saisie", () => {
    // 13 chiffres saisis, 16 une fois +237 ajouté : le contrôle doit voir le
    // numéro composé, sinon la saisie passe puis la composition la refuse.
    assert.equal(composerE164("+237", "1234567890123"), null);
    assert.ok(erreurTelephone("+237", "1234567890123"));
  });

  it("ne produit jamais autre chose qu'un plus suivi de chiffres", () => {
    for (const saisie of ["657559616", "6 57 55 96 16", "+33 6 12 34 56 78", "00237657559616", "0612345678"]) {
      const compose = composerE164("+237", saisie);
      assert.ok(compose);
      assert.match(compose, /^\+\d+$/, `saisie rejetée : ${saisie}`);
    }
  });
});

describe("erreurTelephone", () => {
  it("laisse passer un champ vide, qui reste facultatif", () => {
    assert.equal(erreurTelephone("+237", ""), null);
  });

  it("accepte un numéro plausible", () => {
    assert.equal(erreurTelephone("+237", "657559616"), null);
    assert.equal(erreurTelephone("+33", "0612345678"), null);
  });

  it("signale une saisie interrompue", () => {
    assert.ok(erreurTelephone("+237", "12"));
  });

  it("signale une saisie sans le moindre chiffre", () => {
    assert.ok(erreurTelephone("+237", "abcdef"));
  });
});

describe("INDICATIFS", () => {
  it("place le Cameroun par défaut, et il figure bien dans la liste", () => {
    const defaut = INDICATIFS.find((i) => i.code === INDICATIF_PAR_DEFAUT);
    assert.ok(defaut);
    assert.equal(defaut.indicatif, "+237");
  });

  it("n'a pas de code pays en double, sans quoi React perdrait ses clés", () => {
    const codes = INDICATIFS.map((i) => i.code);
    assert.equal(new Set(codes).size, codes.length);
  });

  it("n'expose que des indicatifs bien formés", () => {
    for (const { indicatif, pays } of INDICATIFS) {
      assert.match(indicatif, /^\+\d{1,4}$/, `indicatif douteux pour ${pays}`);
    }
  });
});
