"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Arrow } from "../components/icons";
import { PageHero, FinalCTA, FeeModel } from "../components/shared";

const VEHICLES = [
  {
    id: "marche-boursier", icon: "📈", name: "Marché Boursier", risk: "Modéré", ret: "Oblig. 6,5%/an + décote 5%",
    min: "Dès 100 000 XAF", fees: "Commission 1–3% · 0 gestion", status: "active", profiles: "Prudent · Équilibré", horizon: "Moyen à long terme",
    partners: ["BEM Securities — bemsecurities.com"],
    intro: "Accédez aux marchés financiers régulés d'Afrique centrale via la BVMAC et nos partenaires vérifiés. Le marché boursier reste l'un des véhicules les plus méconnus des investisseurs africains — et pourtant l'un des plus structurés, des plus accessibles et des plus transparents disponibles sur le continent.",
    info: [["Type", "Investissement en valeurs mobilières via la BVMAC et marchés régulés d'Afrique centrale."], ["Rendement", "Obligations jusqu'à 6,5%/an. Actions avec dividendes. Décote possible jusqu'à 5% sous le prix de marché."], ["Implication", "Suivi régulier du portefeuille — Umdeny Capital assure le reporting et les recommandations d'arbitrage."], ["Rôle d'Umdeny", "Sélection des titres, recommandations d'allocation, interface avec les partenaires, reporting régulier."]],
    feeBlocks: [["Frais de gestion", "Aucun frais de gestion prélevé sur le client"], ["Commission d'intermédiation", "1% à 3% du capital investi — négociée avec le partenaire boursier"]],
    note: "La BVMAC reste méconnue de nombreux investisseurs africains. Umdeny Capital démocratise l'accès et accompagne la compréhension de ce marché en croissance.",
  },
  {
    id: "telecom", icon: "📡", name: "Télécom", risk: "Modéré à élevé", ret: "ROI positif à partir de 3 ans",
    min: "Dès 3 000 000 XAF", fees: "Entrée + Gestion + Perf. 1–10%", status: "active", profiles: "Équilibré · Dynamique", horizon: "Moyen terme — 3 ans minimum",
    partners: ["Cherryz — cherryz.tech"],
    intro: "Le secteur télécom en Afrique connaît une croissance à deux chiffres. L'expansion des réseaux 4G et 5G, la démocratisation des services numériques et le développement des infrastructures de connectivité créent des opportunités significatives pour les investisseurs avertis.",
    info: [["Type", "Participation aux projets d'expansion télécom et de déploiement de services numériques sur le continent africain."], ["Rendement", "ROI positif à partir de 3 ans. Revenus variables selon les projets et le volume d'activité."], ["Implication", "Suivi périodique — Umdeny Capital assure l'interface avec les partenaires et le reporting de performance."], ["Rôle d'Umdeny", "Identification et audit des partenaires, structuration de la participation, suivi opérationnel et financier."]],
    feeBlocks: [["Frais d'entrée", "1% à 10% du montant engagé — analyse, structuration, mise en relation"], ["Frais de gestion", "1% à 10% des revenus générés — pilotage continu, reporting, suivi"], ["Frais de performance", "1% à 10% des gains au-dessus du hurdle rate — uniquement en cas de surperformance"]],
    note: "Le secteur télécom en Afrique est en pleine structuration. Les opportunités sont réelles mais nécessitent une sélection rigoureuse des partenaires.",
  },
  {
    id: "mobile-money", icon: "📱", name: "Mobile Money", risk: "Modéré", ret: "ROI positif à partir de 4 ans",
    min: "Dès 27 000 000 XAF", fees: "Entrée + Commission 1–10%", status: "active", profiles: "Équilibré · Dynamique", horizon: "Long terme — 4 ans minimum",
    partners: ["Mobile Wallet Inc. — mobilewalletinc.com"],
    intro: "Le paiement mobile transforme l'inclusion financière en Afrique à une vitesse sans précédent. Des millions de transactions quotidiennes, un taux d'adoption en constante hausse, des besoins d'infrastructure croissants.",
    info: [["Type", "Participation à l'écosystème du paiement mobile — infrastructure, volumes de transactions, services financiers inclusifs."], ["Rendement", "ROI positif à partir de 4 ans. Revenus récurrents liés aux volumes de transactions et à la croissance utilisateurs."], ["Implication", "Faible à modérée — performances transmises via reporting régulier d'Umdeny Capital."], ["Rôle d'Umdeny", "Identification et audit des opérateurs partenaires, structuration, interface avec l'écosystème, reporting."]],
    feeBlocks: [["Frais d'entrée", "1% à 10% du montant engagé — analyse, mise en relation, intégration partenaire"], ["Commission d'intermédiation", "1% à 10% — perçue auprès de l'opérateur partenaire, non prélevée en supplément"]],
    note: "Le Mobile Money transforme l'Afrique de l'intérieur. Avec une population massivement sous-bancarisée et un taux de pénétration mobile en hausse constante, ce secteur offre des perspectives solides.",
  },
  {
    id: "immobilier", icon: "🏗", name: "Immobilier", risk: "Faible à modéré", ret: "Loyers + plus-values jusqu'à 20%",
    min: "Dès 3 000 000 XAF", fees: "Entrée + Gestion + Perf. 1–10%", status: "soon", profiles: "Prudent · Équilibré", horizon: "Moyen terme — 3 ans minimum",
    partners: ["Réseau notarial & cadastral Umdeny — en cours de structuration"],
    intro: "Le marché immobilier camerounais offre des opportunités solides pour qui connaît le foncier, les procédures cadastrales et les dynamiques urbaines locales. Yaoundé, Douala, et les villes secondaires en croissance connaissent une appréciation structurelle.",
    info: [["Type", "Investissement immobilier géré intégralement par l'équipe Umdeny Capital. Résidentiel, commercial ou foncier selon les opportunités."], ["Rendement", "Plus-values à la revente jusqu'à 20% selon la localisation. Revenus locatifs réguliers tout au long de la détention."], ["Implication", "Minimale — visite du propriétaire facultative. Umdeny Capital assure recherche, acquisition, gestion locative, reporting complet."], ["Rôle d'Umdeny", "Recherche, due diligence foncière et cadastrale, négociation, gestion locative, suivi de la valorisation, conseil à la revente."]],
    feeBlocks: [["Frais d'entrée", "1% à 10% — recherche, due diligence foncière et cadastrale, montage contractuel"], ["Frais de gestion", "1% à 10% des revenus locatifs — gestion locative, entretien, interface locataires"], ["Frais de performance", "1% à 10% de la plus-value à la revente, au-dessus du seuil convenu"]],
    note: "Le marché immobilier camerounais nécessite une connaissance approfondie du foncier et des procédures cadastrales. Les litiges fonciers sont fréquents pour les non-initiés — en particulier pour la diaspora.",
  },
  {
    id: "crowdfunding", icon: "🤲", name: "Crowdfunding", risk: "Modéré à élevé", ret: "Jusqu'à 35%/an",
    min: "Dès 10 000 XAF", fees: "Commission 1–10% (plateforme)", status: "active", profiles: "Dynamique · Opportuniste", horizon: "Court à moyen terme",
    partners: ["Wemonii — wemonii.com"],
    intro: "Financez des projets africains à fort impact — entrepreneuriat, agriculture, technologie, commerce, services — et percevez des rendements attractifs. Le crowdfunding permet d'accéder à des opportunités d'investissement à fort potentiel avec le ticket d'entrée le plus accessible.",
    info: [["Type", "Financement participatif de projets africains. Chaque projet est audité avant proposition."], ["Rendement", "Jusqu'à 35%/an selon les projets. Intérêts, parts de bénéfices ou valorisation selon la structure."], ["Implication", "Lecture du projet proposé, ou délégation complète via l'allocation automatique de la plateforme."], ["Rôle d'Umdeny", "Sélection et audit des projets, interface avec la plateforme, suivi de la performance, alerte en cas d'anomalie."]],
    feeBlocks: [["Commission", "1% à 10% — intégrée dans la structure de la plateforme, non prélevée en supplément"]],
    note: "Avec un ticket d'entrée dès 10 000 XAF, le crowdfunding est le véhicule le plus accessible de l'offre Umdeny Capital.",
  },
  {
    id: "crowdlending", icon: "🏦", name: "Crowdlending", risk: "Modéré à élevé", ret: "Jusqu'à 25%/an",
    min: "Dès 1 000 000 XAF", fees: "AUCUN FRAIS CLIENT", status: "active", profiles: "Équilibré · Dynamique · Opportuniste", horizon: "Court terme — cycles renouvelés",
    partners: ["Réseau bancaire & microfinance Umdeny"],
    intro: "Un mécanisme discret, puissant, au cœur du circuit financier africain. Le crowdlending consiste à mettre vos capitaux à disposition d'institutions financières — banques, microfinances, coopératives de crédit — et de leurs clients. Vous investissez · Nous gérons · Vous encaissez.",
    info: [["Modalités", "Fonds Tournants (revenus réguliers sur cycles courts) · Fonds d'Urgence (rendements supérieurs sur opportunité ciblée)."], ["Rendement", "Jusqu'à 25%/an. Fonds Tournants : prévisibles. Fonds d'Urgence : rendement supérieur sur opportunité validée."], ["Implication", "Faible à modérée — décision d'entrée et de modalité, suivi via reporting."], ["Rôle d'Umdeny", "Identification et audit des institutions, structuration contractuelle, suivi du remboursement, reporting régulier."]],
    feeBlocks: [["AUCUN FRAIS CLIENT", "Notre rémunération est intégrée dans la structuration de l'opération et perçue auprès de l'emprunteur."]],
    note: "Les besoins en liquidité des institutions financières africaines sont structurels et récurrents. Banques, microfinances et opérateurs économiques font régulièrement face à des décalages de trésorerie.",
    warning: "Tout prêt comporte un risque de non-remboursement. Chaque opération fait l'objet d'une expertise préalable et d'une structuration contractuelle rigoureuse.",
  },
  {
    id: "transport", icon: "🚛", name: "Transport & Logistique", risk: "Modéré à élevé", ret: "300 000 XAF/véhicule/mois",
    min: "Dès 3 000 000 XAF", fees: "Entrée + Gestion + Perf. 1–10%", status: "soon", profiles: "Dynamique · Opportuniste", horizon: "Moyen terme",
    partners: ["Opérateurs logistiques camerounais — en cours d'audit"],
    intro: "Le transport est un secteur stratégique et structurellement en demande au Cameroun. Une économie en croissance, des infrastructures en développement, des besoins logistiques croissants dans les secteurs agricole, commercial et industriel.",
    info: [["Type", "Investissement dans la gestion de flotte et la logistique au Cameroun. Revenus générés par l'exploitation des véhicules."], ["Rendement", "Jusqu'à 300 000 XAF par véhicule par mois selon l'exploitation. Valorisation progressive de la flotte."], ["Implication", "Suivi périodique — Umdeny Capital assure le pilotage opérationnel et le reporting régulier."], ["Rôle d'Umdeny", "Sélection des partenaires opérationnels, structuration, supervision de la gestion de flotte, reporting de performance."]],
    feeBlocks: [["Frais d'entrée", "1% à 10% — structuration, sélection des véhicules, identification des partenaires"], ["Frais de gestion", "1% à 10% des revenus d'exploitation — pilotage continu, suivi opérationnel"], ["Frais de performance", "1% à 10% des gains au-dessus du seuil de rentabilité convenu"]],
    note: "Le transport au Cameroun est un secteur à forte demande structurelle mais qui nécessite une gestion opérationnelle rigoureuse et une connaissance précise des circuits locaux.",
  },
  {
    id: "trading", icon: "📊", name: "Trading / Gestion de Comptes", risk: "Élevé", ret: "Jusqu'à 100%/an",
    min: "Dès 5 000 USD", fees: "Entrée + Perf. 1–10%", status: "active", profiles: "Opportuniste exclusivement", horizon: "Court terme",
    partners: ["Exness — exness.com", "FBS — fbs.com", "Fusion Markets — fusionmarkets.com", "HFM — hfm.com"],
    intro: "Confiez votre capital à des traders indépendants audités, opérant sur des plateformes régulées internationalement (FCA, CySEC, ASIC, FSCA). Le trading est le véhicule à fort potentiel de rendement de l'offre Umdeny Capital — et le plus risqué.",
    info: [["Type", "Gestion de comptes de trading par des traders indépendants audités. Forex, indices, matières premières."], ["Rendement", "Jusqu'à 100%/an selon les stratégies. Gains variables, non garantis. Risque élevé de perte en capital."], ["Implication", "Suivi régulier de performance — compréhension des risques de marché indispensable."], ["Rôle d'Umdeny", "Sélection et audit des traders, structuration du mandat, cadrage des protocoles de risque, reporting régulier."]],
    feeBlocks: [["Frais d'entrée", "1% à 10% — mise en relation avec le trader audité, structuration du mandat, cadrage des protocoles de risque"], ["Frais de performance", "1% à 10% des gains au-dessus du hurdle rate — aucun frais si le seuil n'est pas atteint"]],
    note: "Les partenaires trading d'Umdeny Capital sont tous régulés (FCA, CySEC, ASIC, FSCA) et audités avant toute proposition. Ce véhicule s'adresse exclusivement aux profils opportunistes conscients des risques.",
    warning: "Le trading comporte des risques élevés de perte en capital, pouvant aller jusqu'à la perte totale du capital alloué. Les performances passées ne préjugent pas des performances futures. Strictement réservé aux profils avertis.",
  },
];

type Vehicle = typeof VEHICLES[0];

function VehicleRow({ v, expanded, onToggle }: { v: Vehicle; expanded: boolean; onToggle: () => void }) {
  return (
    <>
      <div className={"veh-overview__row body" + (expanded ? " active" : "")} onClick={onToggle}>
        <div className="name"><span style={{ fontSize: 18 }}>{v.icon}</span> {v.name}</div>
        <div className="risk">{v.risk}</div>
        <div>{v.ret}</div>
        <div style={{ fontFamily: "var(--mono)", fontSize: 12.5 }}>{v.min}</div>
        <div><span className={"sectors__status " + v.status}>{v.status === "active" ? "Actif" : "Bientôt"}</span></div>
        <div style={{ color: "var(--gold)", textAlign: "right", fontSize: 18, transform: expanded ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}>
          <Arrow size={16} />
        </div>
      </div>
      {expanded && (
        <div className="veh-detail fade-up">
          <div>
            <h4><span className="icn">●</span> Présentation</h4>
            <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.65, margin: "0 0 24px" }}>{v.intro}</p>
            <h4 style={{ marginTop: 24 }}><span className="icn">●</span> Informations générales</h4>
            {v.info.map(([k, val]) => (
              <div key={k} className="veh-detail__row"><strong>{k}</strong><span>{val}</span></div>
            ))}
            <div className="veh-detail__row"><strong>Profils</strong><span>{v.profiles}</span></div>
            <div className="veh-detail__row"><strong>Horizon</strong><span>{v.horizon}</span></div>
          </div>
          <div>
            <h4><span className="icn">●</span> Frais Umdeny Capital</h4>
            <p style={{ fontSize: 12.5, color: "var(--mist)", fontStyle: "italic", margin: "0 0 16px" }}>Définis et signés contractuellement avant tout engagement.</p>
            {v.feeBlocks.map(([k, val]) => (
              <div key={k} className="veh-detail__row"><strong>{k}</strong><span>{val}</span></div>
            ))}
            <h4 style={{ marginTop: 24 }}><span className="icn">●</span> Partenaires vérifiés</h4>
            <ul style={{ paddingLeft: 18, margin: 0, fontSize: 13.5, color: "var(--ink-soft)" }}>
              {v.partners.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </div>

          <div className="veh-detail__note">
            <strong>📍 Note terrain</strong>
            {v.note}
          </div>

          {"warning" in v && v.warning && (
            <div className="veh-detail__note" style={{ background: "#5C3A0A", borderLeftColor: "#DFB56D" }}>
              <strong>⚠️ Précaution importante</strong>
              {v.warning as string}
            </div>
          )}

          <div className="veh-detail__cta">
            <Link href="/prendre-rdv" className="btn btn--gold">
              {v.status === "soon" ? "Rejoindre la liste d'attente" : "Investir — Prendre rendez-vous"} <Arrow size={14} />
            </Link>
            <Link href="/contact" className="btn btn--outline-navy">Poser une question</Link>
          </div>
        </div>
      )}
    </>
  );
}

export default function VehiclesPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <main>
      <PageHero
        crumb="Nos véhicules"
        title="8 véhicules d'investissement. Un seul interlocuteur."
        sub="Chaque véhicule a été sélectionné, structuré et audité. Cliquez sur un secteur pour découvrir sa fiche complète : rendement, ticket d'entrée, frais, partenaires vérifiés, niveau de risque et note terrain."
      />

      <section className="section">
        <div className="wrap">
          <div className="eyebrow">Vue d&apos;ensemble</div>
          <h2 className="h2" style={{ margin: "12px 0 48px", maxWidth: "20ch" }}>Tout l&apos;éventail.<br />Comparé sur une ligne.</h2>

          <div className="veh-overview">
            <div className="veh-overview__row head">
              <div>Secteur</div>
              <div>Risque</div>
              <div>Rendement potentiel</div>
              <div>Invest. min.</div>
              <div>Statut</div>
              <div></div>
            </div>
            {VEHICLES.map((v) => (
              <VehicleRow
                key={v.id}
                v={v}
                expanded={expanded === v.id}
                onToggle={() => setExpanded((e) => (e === v.id ? null : v.id))}
              />
            ))}
          </div>

          <p style={{ fontSize: 13, color: "var(--mist)", fontStyle: "italic", marginTop: 24 }}>
            ↳ Cliquez une ligne pour déployer la fiche complète (présentation, infos détaillées, frais, note terrain, partenaires).
          </p>
        </div>
      </section>

      <FeeModel />
      <FinalCTA />

      <p className="legal" style={{ paddingTop: 32, paddingBottom: 32, background: "var(--paper)" }}>
        Les rendements, exemples et projections présentés sur cette page sont des estimations basées sur des données de marché observées et des performances passées. Ils ne constituent pas une garantie de résultats futurs. Tout investissement comporte des risques, y compris le risque de perte partielle ou totale du capital investi. Les statuts « Bientôt » indiquent des véhicules en cours de structuration, non encore disponibles à la souscription.
      </p>
    </main>
  );
}
