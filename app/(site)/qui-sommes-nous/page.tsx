import { PageHero, FinalCTA, FeeModel } from "@/app/components/shared";
import { Lock, Doc, Money, Chart, Gear, Shield } from "@/app/components/icons";

const ECO = [
  { icon: "🤲", name: "Wemonii", url: "wemonii.com", body: "Plateforme de crowdfunding pour projets africains à impact. Finance l'entrepreneuriat, l'agriculture et l'innovation sur le continent." },
  { icon: "📱", name: "Mobile Wallet", url: "mobilewalletinc.com", body: "Solutions de paiement mobile et d'inclusion financière. Connecte les populations sous-bancarisées à l'économie numérique africaine." },
  { icon: "⚡", name: "Badawo", url: "badawo.com", body: "Plateforme d'investissement offensif à haut potentiel. Destinée aux profils dynamiques et opportunistes en quête de performance maximale." },
  { icon: "📡", name: "Cherryz", url: "cherryz.tech", body: "Déploiements télécom et infrastructure de réseaux. Opérateur de référence dans l'expansion 4G/5G en Afrique centrale." },
];

const EXPERTISES = [
  { icon: <Lock size={18} />, title: "Juridique & structuration", body: "Création d'entités, structuration patrimoniale, protection des actifs, conformité réglementaire. Un cadre légal solide est la première protection de votre investissement." },
  { icon: <Doc size={18} />, title: "Administratif", body: "Immatriculations, obtention d'agréments, démarches officielles auprès des administrations camerounaises et africaines. Nous gérons les procédures à votre place." },
  { icon: <Money size={18} />, title: "Fiscal & optimisation", body: "Optimisation fiscale légale, exploitation des conventions fiscales internationales, structuration des flux financiers entre la diaspora et l'Afrique." },
  { icon: <Chart size={18} />, title: "Financier & portefeuille", body: "Gestion de portefeuille, analyse de marché, allocation d'actifs, arbitrage sectoriel. Une approche rigoureuse et personnalisée de chaque dossier client." },
  { icon: <Gear size={18} />, title: "Opérationnel & terrain", body: "Exécution terrain, gestion de projet, supervision des partenaires, logistique. La partie visible de l'iceberg — celle qui détermine si un investissement performe réellement." },
  { icon: <Shield size={18} />, title: "Sécurité & due diligence", body: "Due diligence complète des partenaires, audit préalable, veille réglementaire, détection des risques cachés. Aucun partenaire n'intègre notre écosystème sans avoir passé ce filtre." },
];

const PARTNERS = ["BEM Securities", "Africa First Finance", "COGEP", "Cabinet Nemendi", "BVMAC", "Exness", "FBS", "Fusion Markets", "HFM"];

export default function AboutPage() {
  return (
    <main>
      <PageHero
        crumb="Qui sommes-nous"
        title="Une famille. Un patrimoine. Un héritage."
        sub="Depuis 2019, Umdeny Capital identifie, structure et pilote les opportunités d'investissement les plus solides du Cameroun et d'Afrique centrale — pour les particuliers, les entrepreneurs et la diaspora."
      />

      {/* Mission */}
      <section className="section">
        <div className="wrap">
          <div className="about-intro">
            <div>
              <div className="eyebrow">Qui sommes-nous</div>
              <h2 className="h2" style={{ margin: "12px 0 0" }}>Un acteur de confiance dans le patrimoine africain.</h2>
            </div>
            <div>
              <p className="lede" style={{ marginBottom: 24 }}>
                Umdeny Capital est un acteur de confiance dans le développement, la sécurisation et la transmission patrimoniale en Afrique. Depuis 2019, nous accompagnons particuliers et entrepreneurs dans l&apos;identification des meilleures opportunités d&apos;investissement — des plus porteurs aux plus méconnus, mais prometteurs.
              </p>
              <p className="lede">
                Notre nom, <em>Umdeny</em>, signifie « <strong style={{ color: "var(--gold-dark)" }}>famille</strong> » en zoulou. Il incarne notre vision : construire un écosystème de confiance où chaque investisseur, local ou diaspora, trouve les outils, les partenaires et l&apos;accompagnement pour réussir.
              </p>
            </div>
          </div>

          <div className="values-grid" style={{ marginTop: 64 }}>
            <div>
              <div className="icn">Mission</div>
              <h4>Développer &amp; sécuriser</h4>
              <p>Développer et sécuriser le patrimoine de nos clients en Afrique, en identifiant les meilleures opportunités et en offrant un accompagnement complet, humain et adapté aux réalités du continent.</p>
            </div>
            <div>
              <div className="icn">Vision</div>
              <h4>Référence en Afrique centrale</h4>
              <p>Devenir la référence de confiance pour le développement patrimonial en Afrique centrale. Un écosystème où chaque investisseur — local ou diaspora — trouve les outils pour réussir.</p>
            </div>
            <div>
              <div className="icn">Promesse</div>
              <h4>Sélection &amp; exécution</h4>
              <p>Une sélection rigoureuse des opportunités, un accompagnement complet à chaque étape, et une exécution terrain qui fait la différence. Pas de promesses irréalistes — des résultats construits avec méthode.</p>
            </div>
            <div>
              <div className="icn">Identité</div>
              <h4>Umdeny = famille</h4>
              <p>Notre nom incarne notre approche : la confiance, la durée, la transmission. Chaque client n&apos;est pas un dossier — c&apos;est un patrimoine qui se construit sur plusieurs générations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="dark-stats">
        <div className="dark-stats__grid">
          <div className="dark-stats__cell"><div className="dark-stats__num">2019</div><div className="dark-stats__label">Année de création</div></div>
          <div className="dark-stats__cell"><div className="dark-stats__num">8</div><div className="dark-stats__label">Secteurs d&apos;investissement</div></div>
          <div className="dark-stats__cell"><div className="dark-stats__num">20<span style={{ fontSize: "0.55em" }}>+</span></div><div className="dark-stats__label">Ans de réseau africain</div></div>
          <div className="dark-stats__cell"><div className="dark-stats__num">7<span style={{ fontSize: "0.55em" }}>+</span></div><div className="dark-stats__label">Régulations respectées</div></div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">L&apos;équipe dirigeante</div>
              <h2 className="section-head__title h2">Des praticiens.<br />Pas des théoriciens.</h2>
            </div>
            <p className="section-head__sub lede">
              Chaque membre de l&apos;équipe Umdeny Capital est un opérateur actif sur les marchés africains. Notre légitimité se construit au quotidien, sur le terrain, au contact des réalités économiques du Cameroun et du continent.
            </p>
          </div>
          <div className="team-row">
            <div className="team-card">
              <div className="team-card__photo"><span>Portrait — N. Onana</span></div>
              <div className="team-card__role">Direction stratégique</div>
              <h3 className="team-card__name">Nicodème Onana</h3>
              <div className="team-card__body">
                <p>Plus de 30 ans d&apos;expérience dans le développement économique et patrimonial au Cameroun. Son réseau couvre les 10 régions du pays et s&apos;étend à l&apos;ensemble de l&apos;Afrique centrale.</p>
                <p>Il incarne la vision long terme d&apos;Umdeny Capital : construire des patrimoines solides, ancrés dans les réalités africaines, transmissibles aux générations suivantes.</p>
              </div>
            </div>
            <div className="team-card">
              <div className="team-card__photo"><span>Portrait — Y. Tadie</span></div>
              <div className="team-card__role">Direction opérationnelle</div>
              <h3 className="team-card__name">Yvan Tadie</h3>
              <div className="team-card__body">
                <p>En charge de la coordination opérationnelle et du déploiement des projets sur le terrain. Yvan assure le lien entre la vision stratégique et l&apos;exécution quotidienne — là où se joue réellement la performance d&apos;un investissement.</p>
                <p>Son rôle : garantir que chaque engagement client se traduit par une action concrète, mesurable et documentée.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem */}
      <section className="section" style={{ background: "var(--ivory)" }}>
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">L&apos;écosystème Umdeny Capital</div>
              <h2 className="section-head__title h2">Un groupe, quatre plateformes,<br />un seul objectif.</h2>
            </div>
            <p className="section-head__sub lede">
              Umdeny Capital est l&apos;entité d&apos;accompagnement patrimonial du groupe Umdeny Holdings. Elle s&apos;appuie sur un écosystème de plateformes complémentaires, chacune spécialisée dans un domaine d&apos;investissement ou de service financier.
            </p>
          </div>
          <div className="eco-grid">
            {ECO.map((e) => (
              <div key={e.name} className="eco-card">
                <div className="eco-card__icon">{e.icon}</div>
                <h4 className="eco-card__name">{e.name}</h4>
                <div className="eco-card__url">{e.url}</div>
                <p className="eco-card__body">{e.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise network */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">Notre réseau d&apos;experts</div>
              <h2 className="section-head__title h2">Les expertises dont vous avez besoin,<br />réunies en un seul réseau.</h2>
            </div>
            <p className="section-head__sub lede">
              Investir en Afrique ne s&apos;improvise pas. Umdeny Capital a constitué, au fil de 20 ans de présence africaine, un réseau d&apos;experts vérifiés couvrant l&apos;intégralité des dimensions d&apos;un investissement réussi.
            </p>
          </div>
          <div className="exp-grid">
            {EXPERTISES.map((e) => (
              <div key={e.title} className="exp">
                <h4 className="exp__title"><span className="icn">{e.icon}</span> {e.title}</h4>
                <p className="exp__body">{e.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="section" style={{ background: "var(--ivory)" }}>
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">Partenaires vérifiés</div>
              <h2 className="section-head__title h2">Nos partenaires vérifiés.</h2>
            </div>
            <p className="section-head__sub lede">
              Chaque partenaire Umdeny Capital a été identifié, audité et validé avant toute proposition à nos clients. Aucun partenaire n&apos;a l&apos;exclusivité d&apos;un secteur — notre écosystème est ouvert à l&apos;intégration progressive de nouveaux opérateurs vérifiés.
            </p>
          </div>
          <div className="partners">
            {PARTNERS.map((p) => <span key={p} className="partner-pill">{p}</span>)}
            <span className="partner-pill" style={{ borderStyle: "dashed", color: "var(--mist)" }}>+ à venir</span>
          </div>
        </div>
      </section>

      {/* Regulations */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">Cadre réglementaire</div>
              <h2 className="section-head__title h2">Nous opérons<br />dans un cadre légal et réglementé.</h2>
            </div>
            <p className="section-head__sub lede">
              La conformité réglementaire n&apos;est pas une contrainte pour Umdeny Capital — c&apos;est une garantie que nous offrons à nos clients. Nous respectons les cadres légaux africains et internationaux qui encadrent chacun de nos véhicules d&apos;investissement.
            </p>
          </div>
          <div className="regs">
            <div>
              <h4>Régulations africaines</h4>
              <ul className="regs__list">
                <li><strong>COSUMAF</strong><span>Commission de Surveillance du Marché Financier de l&apos;Afrique Centrale</span></li>
                <li><strong>CEMAC</strong><span>Communauté Économique et Monétaire de l&apos;Afrique Centrale</span></li>
                <li><strong>COBAC</strong><span>Commission Bancaire de l&apos;Afrique Centrale</span></li>
                <li><strong>ONECCA</strong><span>Ordre National des Experts-Comptables du Cameroun</span></li>
                <li><strong>MINADER</strong><span>Ministère de l&apos;Agriculture et du Développement Rural</span></li>
              </ul>
            </div>
            <div>
              <h4>Régulations internationales</h4>
              <ul className="regs__list">
                <li><strong>FCA</strong><span>Financial Conduct Authority — Royaume-Uni</span></li>
                <li><strong>CySEC</strong><span>Cyprus Securities and Exchange Commission</span></li>
                <li><strong>ASIC</strong><span>Australian Securities and Investments Commission</span></li>
                <li><strong>FSCA</strong><span>Financial Sector Conduct Authority — Afrique du Sud</span></li>
                <li><strong>FSC</strong><span>Financial Services Commission — Maurice</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <FeeModel />
      <FinalCTA />
    </main>
  );
}
