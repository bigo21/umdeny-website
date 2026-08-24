# Umdeny Capital — site

Application Next.js du site vitrine, du quiz de candidature apporteur
d'affaires et de la landing d'inscription au webinaire.

## Où vit le schéma de base de données

**Pas dans ce dépôt.** Le schéma `umdeny_apporteur` — `candidatures`,
`inscriptions_webinaire`, `webinaires` — est versionné dans
`umdeny-supa-backend`, avec les Edge Functions et les crons qui écrivent dans
ces tables. Ce site en est client : il y écrit via `/api/candidature-apporteur`
et via l'Edge Function `inscription-webinaire`, mais ne gère ni le cycle de vie
de la base ni les fonctions qui en dépendent.

Une seule copie fait foi, à la suite d'un incident : le schéma a été décrit
quelque temps dans les deux dépôts à la fois, chacun n'en connaissant qu'une
partie. Un `supabase db reset` lancé depuis l'un aurait supprimé les tables
décrites par l'autre, sans avertissement — le reset reconstruit fidèlement ce
qui est décrit, et c'est la description qui était incomplète.

Le répertoire `supabase/` subsiste ici pour la seule pile locale de
développement. Voir l'en-tête de `supabase/config.toml`.

## Développement

Base locale attendue sur `http://127.0.0.1:54321` (voir `.env.example`).
Lancer le serveur de développement :

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
