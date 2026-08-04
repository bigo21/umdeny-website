"use client";

import { useState } from "react";
import { PageHero, FinalCTA } from "@/app/components/shared";
import { Arrow } from "@/app/components/icons";

const CATEGORIES = [
  { id: "all", label: "Tous les articles" },
  { id: "actualites", label: "📰 Actualités" },
  { id: "conseils", label: "💡 Conseils" },
  { id: "secteurs", label: "🏗 Focus Secteurs" },
  { id: "diaspora", label: "🌍 Diaspora" },
  { id: "education", label: "📋 Éducation" },
];

const ARTICLES = [
  { id: 1, cat: "diaspora", catLabel: "Diaspora", time: "7 min", title: "5 erreurs à éviter quand on investit depuis la diaspora", lede: "Beaucoup de Camerounais de l'étranger ont perdu de l'argent au Cameroun. Pas par malchance — par manque d'information et de structure." },
  { id: 2, cat: "education", catLabel: "Éducation", time: "5 min", title: "Comprendre la BVMAC en 5 minutes — obligations et actions en Afrique centrale", lede: "La Bourse des Valeurs Mobilières de l'Afrique Centrale existe depuis 2003. La grande majorité des investisseurs camerounais n'en a jamais entendu parler." },
  { id: 3, cat: "conseils", catLabel: "Conseils", time: "6 min", title: "Pourquoi la structuration juridique est essentielle au Cameroun", lede: "Investir sans structure juridique au Cameroun, c'est construire une maison sans fondations. Solide en apparence — jusqu'au premier coup de vent." },
  { id: 4, cat: "secteurs", catLabel: "Focus Secteurs", time: "6 min", title: "Crowdlending : générer jusqu'à 25%/an en prêtant aux institutions financières africaines", lede: "Les banques et microfinances africaines ont des besoins structurels en liquidité. Vous pouvez en profiter — sans frais, sans intermédiaire inutile." },
  { id: 5, cat: "secteurs", catLabel: "Focus Secteurs", time: "7 min", title: "Crowdfunding africain : financer des projets à impact et viser jusqu'à 35%/an", lede: "Investir dans l'entrepreneuriat africain n'a jamais été aussi accessible. Dès 10 000 XAF, vous pouvez financer des projets réels et percevoir des rendements supérieurs aux placements classiques." },
  { id: 6, cat: "secteurs", catLabel: "Focus Secteurs", time: "6 min", title: "Mobile Money : comment participer à la révolution financière africaine en tant qu'investisseur ?", lede: "Des millions de transactions par jour. Une adoption qui ne faiblit pas. Le Mobile Money est l'une des transformations économiques les plus profondes de l'Afrique." },
  { id: 7, cat: "secteurs", catLabel: "Focus Secteurs", time: "8 min", title: "Immobilier au Cameroun : les pièges fonciers et comment les éviter", lede: "Les litiges fonciers sont la première source de pertes pour les investisseurs immobiliers au Cameroun. Voici ce que vous devez absolument savoir avant d'acheter." },
  { id: 8, cat: "secteurs", catLabel: "Focus Secteurs", time: "7 min", title: "Trading régulé : comment choisir un bon trader et encadrer les risques", lede: "Le trading peut générer des rendements élevés — ou des pertes totales. La différence ne tient pas au marché, elle tient au trader et à la structure qui l'encadre." },
  { id: 9, cat: "secteurs", catLabel: "Focus Secteurs", time: "5 min", title: "Transport et logistique au Cameroun : un secteur stratégique à saisir", lede: "Chaque économie en croissance a besoin de transport. Le Cameroun ne fait pas exception — et les opportunités pour les investisseurs sont concrètes." },
  { id: 10, cat: "conseils", catLabel: "Conseils", time: "8 min", title: "Holding ou SARL : quelle structure choisir pour son patrimoine au Cameroun ?", lede: "La bonne structure juridique peut vous faire économiser des millions en fiscalité et vous éviter des années de contentieux. Voici comment choisir." },
  { id: 11, cat: "conseils", catLabel: "Conseils", time: "9 min", title: "Transmission patrimoniale en Afrique : anticiper avant qu'il ne soit trop tard", lede: "En Afrique, les conflits successoraux détruisent plus de patrimoines que les marchés ne le font. Et ils sont presque toujours évitables." },
];

export default function BlogPage() {
  const [filter, setFilter] = useState("all");
  const feature = ARTICLES[0];
  const rest = ARTICLES.slice(1);
  const filtered = filter === "all" ? rest : rest.filter((a) => a.cat === filter);

  return (
    <main>
      <PageHero
        crumb="Blog"
        title="Le Blog Umdeny Capital"
        sub="Analyses, conseils et décryptages pour investir intelligemment en Afrique. Onze articles. Cinq catégories. Zéro promesse irréaliste."
      />

      <section className="section">
        <div className="wrap">
          <div className="blog-filter">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                className={filter === c.id ? "active" : ""}
                onClick={() => setFilter(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>

          {filter === "all" && (
            <div className="blog-feature">
              <div className="blog-feature__media">
                <span className="blog-feature__cat">{feature.catLabel} · Article en vedette</span>
              </div>
              <div className="blog-feature__body">
                <div className="blog-feature__cat-lbl">{feature.catLabel} · ⏱ {feature.time} de lecture</div>
                <h2 className="blog-feature__title">{feature.title}</h2>
                <p className="blog-feature__lede">{feature.lede}</p>
                <div className="blog-feature__meta">Par l&apos;équipe Umdeny — Janvier 2026</div>
                <div style={{ marginTop: 16 }}>
                  <a href="#" className="btn btn--outline-navy">Lire l&apos;article <Arrow size={14} /></a>
                </div>
              </div>
            </div>
          )}

          <div className="blog-grid">
            {filtered.map((a) => (
              <article key={a.id} className="blog-card">
                <div className="blog-card__media">
                  <span className="blog-card__cat">{a.catLabel}</span>
                </div>
                <div className="blog-card__body">
                  <h3 className="blog-card__title">{a.title}</h3>
                  <p className="blog-card__lede">{a.lede}</p>
                  <div className="blog-card__meta">⏱ {a.time} · L&apos;équipe Umdeny</div>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <p style={{ textAlign: "center", color: "var(--mist)", padding: 64, fontStyle: "italic" }}>
              Aucun article dans cette catégorie pour l&apos;instant.
            </p>
          )}
        </div>
      </section>

      <FinalCTA />
    </main>
  );
}
