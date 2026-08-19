// Libellé de la date du webinaire.
//
// Ce qui mérite un test ici, c'est la conversion de fuseau. La date vient
// désormais de la base, où elle peut être écrite dans n'importe quel décalage.
// Une valeur en UTC affichée telle quelle annoncerait au visiteur une heure
// fausse d'une unité — assez plausible pour que personne ne la remarque avant
// que quelqu'un se connecte au mauvais moment.

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { libelleDateWebinaire } from "../lib/webinaire/config";

describe("libelleDateWebinaire", () => {
  it("rend null quand la date est inconnue", () => {
    // Les deux cas du contrat : aucune session, ou session sans date arrêtée.
    assert.equal(libelleDateWebinaire(null), null);
  });

  it("rend null sur une date illisible plutôt que de casser la page", () => {
    assert.equal(libelleDateWebinaire("pas une date"), null);
    assert.equal(libelleDateWebinaire(""), null);
  });

  it("affiche l'heure de Yaoundé pour une date déjà exprimée en +01:00", () => {
    assert.equal(
      libelleDateWebinaire("2026-08-20T18:00:00+01:00"),
      "Jeudi 20 août 2026 · 18h00 (UTC+1)",
    );
  });

  it("convertit vers Yaoundé une date exprimée en UTC", () => {
    // Même instant que le cas précédent, écrit autrement : le libellé doit
    // être identique. Sans conversion, il annoncerait 17h00.
    assert.equal(
      libelleDateWebinaire("2026-08-20T17:00:00Z"),
      "Jeudi 20 août 2026 · 18h00 (UTC+1)",
    );
  });

  it("décale bien l'heure quand le fuseau d'écriture diffère", () => {
    // 18h00 UTC, c'est 19h00 à Yaoundé.
    assert.equal(
      libelleDateWebinaire("2026-09-17T18:00:00Z"),
      "Jeudi 17 septembre 2026 · 19h00 (UTC+1)",
    );
  });

  it("passe la majuscule initiale, que l'ICU rend en minuscule", () => {
    const libelle = libelleDateWebinaire("2026-08-20T18:00:00+01:00");
    assert.ok(libelle);
    assert.match(libelle, /^[A-ZÉÀ]/);
  });
});
