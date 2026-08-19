# Tests

Deux jeux de tests, indépendants l'un de l'autre.

## `npm run test:scoring`

Deux fichiers, tous deux exécutés par cette commande.

**`scoring.test.ts`** — le moteur de scoring contre la spec v2.0
(`QUIZ_CANDIDATURE_-_APPORTEUR_D'AFFAIRES_UMDENY.pdf`) : seuils de tag, barème
géographique propre à IP publique dédiée, primauté du MAX sur la moyenne entre
verticales, neutralité de la question de maîtrise, longueur du parcours.

Ce score n'est jamais affiché au candidat — une erreur y serait donc invisible
en usage normal, d'où ces tests.

**`emails.test.ts`** — les deux emails de la partie 10. Vérifie les règles que
la spec impose et qu'un relecteur ne remarquerait pas : absence de lien Cal.com
ou WhatsApp dans l'email candidat, absence de score dans l'email candidat,
présence des 6 sections dans l'email équipe, parcours de formation distinct par
verticale, transmission intégrale du message libre, et échappement du contenu
saisi par le candidat.

Tourne sur n'importe quelle branche : le moteur vit dans `lib/quiz-apporteur/`,
partagé par toutes les variantes.

> Les modules de `lib/quiz-apporteur/` utilisent des imports sans extension, que
> Node ne sait pas résoudre nativement. Le script les compile d'abord en
> CommonJS dans `.test-build/` (ignoré par git) via `tsconfig.test.json`.

## `npm run test:quiz`

Rejoue le parcours candidat complet dans un vrai Chrome : champs requis,
condition des 18 ans qui interrompt sans soumettre, reconstruction dynamique des
écrans selon la question pivot Q18, décochage d'une verticale, bloc
conditionnel, soumission, et absence de toute fuite de score côté candidat.

**Nécessite la route `/apporteur-affaires/candidature`** : ne tourne donc que sur les
branches de variante (`quiz-actuel`, `quiz-editorial`, `quiz-dashboard`,
`quiz-cards`), pas sur `develop`.

```bash
npm run build
npx next start -p 3000       # dans un autre terminal
npm run test:quiz            # port 3000 par défaut
PORT=3993 npm run test:quiz  # autre port
```

Le port passe par l'environnement et non par un argument : `node --test`
interprète tout argument supplémentaire comme un fichier de test à charger.

Le test **détecte automatiquement la variante servie** d'après le préfixe de ses
classes CSS (`qz-`, `qm1-`, `qm2-`, `qm3-`) et applique le même jeu de
vérifications à toutes. Pour une nouvelle variante, il suffit d'ajouter une
entrée dans la table `VARIANTS` en tête de `quiz-flow.mjs` :

```js
qm4: { name: "Ma variante", count: ".qm4-count", fmt: (i, t) => `${i} / ${t}` },
```

Utilise `playwright-core` et le Chrome déjà installé sur la machine — aucun
navigateur n'est téléchargé à l'installation.
