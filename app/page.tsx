import Link from "next/link";
import { Arrow, Loupe, Network, Shield, Globe } from "./components/icons";
import { FinalCTA, Transparence } from "./components/shared";

const PILLARS = [
  { icon: <Loupe />, title: "Sélection rigoureuse", body: "Chaque opportunité est analysée, auditée et validée avant d'être proposée. Aucun partenaire n'intègre notre écosystème sans avoir passé notre processus de due diligence." },
  { icon: <Network />, title: "Réseau de confiance", body: "Plus de 20 ans de réseau africain couvrant le juridique, le fiscal, le financier et l'opérationnel. Des partenaires vérifiés, pas des prestataires inconnus." },
  { icon: <Shield />, title: "Conformité totale", body: "Nous opérons dans le respect des cadres réglementaires africains et internationaux : COSUMAF, CEMAC, COBAC, FCA, CySEC, ASIC, FSCA." },
  { icon: <Globe />, title: "Expertise diaspora", body: "Vous êtes à Paris, Montréal ou Lyon ? Nous exécutons sur le terrain à Yaoundé et Douala. Reporting régulier, preuves de réalisation, interlocuteur dédié." },
];

const PROFILS = [
  { name: "Prudent", icon: "🏛", tag: "Préservation du capital avant tout", items: ["Marché Boursier — obligations 6,5%/an", "Immobilier — loyers + plus-values 20%", "Crowdlending Fonds Tournants — 25%/an, aucun frais"] },
  { name: "Équilibré", icon: "⚖", tag: "Sécurité et rendement combinés", items: ["Marché Boursier — actions + obligations", "Télécom — ROI à partir de 3 ans", "Mobile Money", "Crowdlending"] },
  { name: "Dynamique", icon: "🚀", tag: "Performance supérieure assumée", items: ["Crowdfunding — jusqu'à 35%/an", "Crowdlending Fonds Urgence", "Transport — 300 000 XAF/véhicule/mois"] },
  { name: "Opportuniste", icon: "⚡", tag: "Rendement maximal, risques compris", items: ["Trading — jusqu'à 100%/an, dès 5 000 USD", "Crowdfunding — jusqu'à 35%/an", "Crowdlending Fonds Urgence"] },
];

const SECTORS = [
  { icon: "📈", name: "Marché Boursier", desc: "Obligations 6,5%/an · Actions dividendes · Marché régulé BVMAC", min: "Dès 100 000 XAF", status: "active" },
  { icon: "📡", name: "Télécom", desc: "ROI positif à partir de 3 ans · Croissance 4G/5G africaine", min: "Dès 3 000 000 XAF", status: "active" },
  { icon: "📱", name: "Mobile Money", desc: "ROI positif à partir de 4 ans · Inclusion financière africaine", min: "Dès 27 000 000 XAF", status: "active" },
  { icon: "🏗", name: "Immobilier", desc: "Loyers réguliers + plus-values jusqu'à 20% · Gestion intégrale", min: "Dès 3 000 000 XAF", status: "soon" },
  { icon: "🤲", name: "Crowdfunding", desc: "Jusqu'à 35%/an · Projets africains à impact · Ticket accessible", min: "Dès 10 000 XAF", status: "active" },
  { icon: "🏦", name: "Crowdlending", desc: "Jusqu'à 25%/an · Aucun frais client · Revenus réguliers", min: "Dès 1 000 000 XAF", status: "active" },
  { icon: "🚛", name: "Transport", desc: "Jusqu'à 300 000 XAF/véhicule/mois · Logistique camerounaise", min: "Dès 3 000 000 XAF", status: "soon" },
  { icon: "📊", name: "Trading", desc: "Jusqu'à 100%/an · Traders audités · Plateformes régulées", min: "Dès 5 000 USD", status: "active" },
];

function HomeHero() {
  return (
    <section className="hero">
      <div className="hero__inner">
        <div>
          <div className="hero__pill">
            <span className="dot">UC</span>
            <span>Depuis 2019 · Yaoundé · Cameroun</span>
          </div>
          <h1 className="hero__h1">
            Développez, sécurisez et <em>transmettez</em> votre patrimoine en Afrique.
          </h1>
          <p className="hero__sub">
            Nous identifions les secteurs les plus porteurs, les opportunités les mieux encadrées et les dispositifs les plus adaptés aux réalités du Cameroun et du continent africain. Depuis 2019, Umdeny Capital accompagne particuliers et entrepreneurs dans la construction et la transmission d&apos;un patrimoine durable.
          </p>
          <div className="hero__ctas">
            <Link href="/nos-vehicules" className="btn btn--gold">Découvrir nos véhicules <Arrow size={14} /></Link>
            <Link href="/prendre-rdv" className="btn btn--outline-light">Faire le quiz patrimonial</Link>
          </div>
          <div className="hero__sectors">
            {["Marché Boursier", "Télécom", "Mobile Money", "Immobilier", "Crowdfunding", "Crowdlending", "Transport", "Trading"].map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </div>
        <div className="hero__visual">
          <div className="hero__visual-img" />
          <div className="hero__visual-overlay" />
          <div className="hero__visual-corner" />
          <div className="hero__visual-meta">
            <strong>Siège Umdeny Capital</strong>
            <span>Yaoundé, Fouda · Cameroun</span>
          </div>
        </div>
      </div>

      <div className="hero__metrics">
        <div className="hero__metrics-grid">
          <div className="hero__metric"><div className="hero__metric-num">2019</div><div className="hero__metric-label">Année de création</div></div>
          <div className="hero__metric"><div className="hero__metric-num">8</div><div className="hero__metric-label">Secteurs d&apos;investissement</div></div>
          <div className="hero__metric"><div className="hero__metric-num">20<span style={{ fontSize: "0.6em" }}>+</span></div><div className="hero__metric-label">Ans de réseau africain</div></div>
          <div className="hero__metric"><div className="hero__metric-num">7<span style={{ fontSize: "0.6em" }}>+</span></div><div className="hero__metric-label">Régulations respectées</div></div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main>
      <HomeHero />

      {/* Notre différence */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">Notre différence</div>
              <h2 className="section-head__title h2">Ce qui nous distingue.</h2>
            </div>
            <p className="section-head__sub lede">
              Chaque engagement Umdeny Capital repose sur quatre piliers non négociables — la méthode qui sépare un investissement structuré d&apos;une promesse en l&apos;air.
            </p>
          </div>
          <div className="grid col-4">
            {PILLARS.map((p, i) => (
              <div key={p.title} className="pillar">
                <div className="pillar__num">0{i + 1} / 04</div>
                <div style={{ color: "var(--gold)" }}>{p.icon}</div>
                <h3 className="pillar__title">{p.title}</h3>
                <p className="pillar__body">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Profils investisseurs */}
      <section className="section" style={{ background: "var(--ivory)" }}>
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">Profils investisseurs</div>
              <h2 className="section-head__title h2">Quel investisseur êtes-vous ?</h2>
            </div>
            <p className="section-head__sub lede">
              Quatre profils, quatre stratégies. Identifiez le vôtre et découvrez les véhicules qui correspondent à vos objectifs.
            </p>
          </div>
          <div className="grid col-4">
            {PROFILS.map((p) => (
              <div key={p.name} className="profile-card">
                <div style={{ fontSize: 28, marginBottom: 8 }}>{p.icon}</div>
                <div className="profile-card__label">Profil</div>
                <h3 className="profile-card__name">{p.name}</h3>
                <p className="profile-card__tag">{p.tag}</p>
                <ul className="profile-card__list">
                  {p.items.map((it) => <li key={it}>{it}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link href="/prendre-rdv" className="btn btn--outline-navy">Faire le quiz patrimonial et découvrir mon profil <Arrow size={14} /></Link>
          </div>
        </div>
      </section>

      {/* Sectors table */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">Nos véhicules</div>
              <h2 className="section-head__title h2">8 secteurs d&apos;investissement.<br />Un seul interlocuteur.</h2>
            </div>
            <p className="section-head__sub lede">
              Umdeny Capital sélectionne, structure et pilote vos investissements dans les secteurs les plus porteurs du Cameroun et d&apos;Afrique centrale. Chaque secteur est accessible via des partenaires vérifiés, audités avant tout engagement.
            </p>
          </div>
          <div className="sectors">
            <div className="sectors__row head">
              <div>Secteur</div>
              <div>Rendement &amp; caractéristiques</div>
              <div>Investissement min.</div>
              <div>Statut</div>
              <div></div>
            </div>
            {SECTORS.map((s) => (
              <Link key={s.name} href="/nos-vehicules" className="sectors__row">
                <div className="sectors__name"><span className="icon">{s.icon}</span> {s.name}</div>
                <div className="sectors__desc">{s.desc}</div>
                <div className="sectors__min">{s.min}</div>
                <div><span className={"sectors__status " + s.status}>{s.status === "active" ? "Actif" : "Bientôt"}</span></div>
                <div className="sectors__arrow"><Arrow size={16} /></div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: "right", marginTop: 24 }}>
            <Link href="/nos-vehicules" className="btn btn--ghost">Explorer tous nos véhicules <Arrow size={14} /></Link>
          </div>
        </div>
      </section>

      <Transparence />

      {/* Méthode */}
      <section className="section dark">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: "var(--gold-soft)" }}>La méthode Umdeny</div>
              <h2 className="section-head__title h2" style={{ color: "#fff" }}>Notre méthode.<br />Votre sérénité.</h2>
            </div>
            <p className="section-head__sub lede">
              Trois étapes. Un accompagnement complet, de votre premier échange à la transmission de votre patrimoine.
            </p>
          </div>
          <div className="steps">
            {[
              { n: "01", label: "Diagnostic", title: "Comprendre votre situation", body: "Analyse complète de votre situation patrimoniale, de vos objectifs et de votre tolérance au risque. Le point de départ de toute stratégie solide." },
              { n: "02", label: "Stratégie", title: "Construire la feuille de route", body: "Recommandations personnalisées, allocation sectorielle, diversification adaptée à votre profil. Une feuille de route claire, pas une formule générique." },
              { n: "03", label: "Exécution & suivi", title: "Tenir l'exécution dans le temps", body: "Mise en œuvre terrain par nos équipes, reporting régulier, ajustements continus. Vous êtes informé à chaque étape." },
            ].map((s) => (
              <div key={s.n} className="step">
                <span className="step__num">{s.n}</span>
                <div className="step__label">{s.label}</div>
                <h3 className="step__title">{s.title}</h3>
                <p className="step__body">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />

      <p className="legal" style={{ paddingTop: 32, paddingBottom: 32, background: "var(--paper)" }}>
        Les rendements et exemples cités sur cette page sont des estimations basées sur des projections et des performances observées. Ils ne constituent pas une garantie de résultats futurs. Tout investissement comporte des risques, y compris le risque de perte partielle ou totale du capital investi. Umdeny Capital est une entité du groupe Umdeny Holdings, basée à Yaoundé, Cameroun.
      </p>
    </main>
  );
}
