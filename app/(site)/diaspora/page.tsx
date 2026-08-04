import { Fragment } from "react";
import Link from "next/link";
import { PageHero, FinalCTA } from "@/app/components/shared";
import { Pin, Chart, Handshake, Check, Arrow } from "@/app/components/icons";

const REALITIES = [
  { icon: "🗺", title: "La distance géographique", body: "Vous ne pouvez pas vous rendre sur place pour visiter un bien, superviser un projet ou rencontrer un partenaire. Chaque décision se prend à distance, avec les risques que cela implique." },
  { icon: "🔍", title: "Le manque de relais fiables", body: "Famille, amis, connaissances : même bien intentionnés, ils n'ont pas toujours les compétences ni le temps pour gérer un investissement sérieux avec la rigueur qu'il exige." },
  { icon: "⚠️", title: "La méfiance légitime", body: "Beaucoup ont déjà vécu ou connu des expériences malheureuses : argent confié à de mauvaises personnes, projets qui n'ont jamais abouti, promesses non tenues. Cette méfiance est normale et saine." },
  { icon: "🕐", title: "Fuseaux horaires & complexité", body: "Les démarches administratives au Cameroun demandent du temps, de la présence et de la connaissance des procédures locales. Gérer ça depuis l'étranger, en décalage horaire, est épuisant." },
];

const DIALOG_PAIRS = [
  { q: "Je ne sais pas si je peux faire confiance à quelqu'un que je ne connais pas.", a: "Nos engagements sont contractuels, signés avant tout versement. Chaque opération est documentée et tracée. Nous vous fournissons des preuves de réalisation à chaque étape — photos, contrats, relevés." },
  { q: "J'ai déjà envoyé de l'argent au Cameroun et je n'ai jamais rien reçu.", a: "Nous comprenons. C'est précisément pour cela qu'Umdeny Capital existe. Notre modèle repose sur des structures légales, des partenaires vérifiés et des contrats opposables — pas sur des promesses verbales." },
  { q: "Je ne suis pas sur place pour surveiller ce qui se passe réellement.", a: "C'est notre rôle d'être là à votre place. Votre interlocuteur dédié vous tient informé régulièrement, avec des preuves concrètes : photos de terrain, documents officiels, états d'avancement." },
  { q: "Les rendements annoncés me semblent trop beaux pour être vrais.", a: "Nous ne garantissons aucun rendement fixe — toute promesse de ce type est un signal d'alarme. Nos estimations sont basées sur des projections réalistes, des données de marché vérifiées, et notre expérience terrain depuis 2019." },
  { q: "Je ne comprends pas suffisamment la fiscalité et les lois camerounaises.", a: "Notre réseau d'experts juridiques et fiscaux est là pour ça. Nous structurons votre investissement dans le respect total du cadre légal local et des conventions fiscales internationales applicables à votre pays de résidence." },
];

const VEH = [
  { icon: "🏦", name: "Crowdlending", headline: "Jusqu'à 25%/an", ticket: "Dès 1 000 000 XAF", body: "Aucun frais client. Revenus réguliers sans aucune présence physique requise. Le véhicule le plus autonome pour la diaspora.", status: "active" },
  { icon: "🤲", name: "Crowdfunding", headline: "Jusqu'à 35%/an", ticket: "Dès 10 000 XAF", body: "Le ticket d'entrée le plus accessible. Financez des projets africains à impact depuis n'importe où dans le monde.", status: "active" },
  { icon: "🏗", name: "Immobilier", headline: "Loyers + plus-values jusqu'à 20%", ticket: "Dès 3 000 000 XAF", body: "Le seul véhicule qui permet d'ancrer un patrimoine tangible et transmissible au Cameroun sans jamais avoir à y être.", status: "soon" },
  { icon: "📈", name: "Marché Boursier (BVMAC)", headline: "Obligations 6,5%/an + décote 5%", ticket: "Dès 100 000 XAF", body: "Le véhicule régulé par excellence pour les investisseurs prudents et équilibrés. Aucun frais de gestion.", status: "active" },
];

const PROCESS_STEPS = [
  { n: "01", title: "Vous prenez rendez-vous", body: "Un premier appel de 30 minutes avec un membre de notre équipe. Gratuit, sans engagement. L'objectif : comprendre votre situation, vos objectifs et vos contraintes. Pas de discours commercial — une conversation honnête." },
  { n: "02", title: "Vous recevez votre analyse", body: "Après l'appel, nous vous envoyons une analyse personnalisée de votre profil investisseur : les véhicules adaptés, les montants recommandés, les horizons réalistes. Vous avez tout le temps d'y réfléchir." },
  { n: "03", title: "Vous validez la stratégie", body: "Si vous décidez de nous faire confiance, nous structurons ensemble votre stratégie d'investissement. Chaque engagement est formalisé dans un contrat signé avant tout versement. Aucune action sans votre accord explicite." },
  { n: "04", title: "Nous exécutons. Vous êtes informé.", body: "Notre équipe terrain entre en action. Vous recevez des reportings réguliers avec preuves de réalisation (photos, documents, états d'avancement). Vous avez un interlocuteur dédié joignable directement." },
  { n: "05", title: "Vous percevez vos revenus", body: "Selon le véhicule choisi : revenus locatifs, intérêts de crowdlending, rendements boursiers. Versés selon la fréquence définie contractuellement. Transférables vers votre compte à l'étranger." },
];

const SUPPORT_ITEMS = [
  "Un interlocuteur dédié — un seul contact, qui connaît votre dossier dans le détail, disponible par WhatsApp, email ou visio.",
  "Des reportings réguliers — comptes rendus d'avancement, preuves de réalisation (photos terrain, documents officiels, contrats signés).",
  "Une traçabilité complète — chaque mouvement de capital est documenté et justifié. Vous avez accès aux pièces à tout moment.",
  "Un cadre contractuel solide — tous les engagements sont formalisés et signés avant tout versement. Rien ne se fait verbalement.",
  "Un réseau juridique local — avocats, notaires, experts-comptables camerounais mobilisables pour structurer et protéger votre patrimoine.",
  "Des alertes proactives — si quelque chose change (marché, partenaire, réglementation), vous êtes informé avant que ça n'impacte votre investissement.",
];

export default function DiasporaPage() {
  return (
    <main>
      <PageHero
        crumb="Diaspora"
        title="Vous vivez loin du Cameroun. Votre patrimoine peut y prendre racine."
        sub="Umdeny Capital est votre relais de confiance sur le terrain. Nous comprenons vos contraintes, vos inquiétudes et vos ambitions. Nous exécutons avec rigueur ce que la distance vous empêche de faire au quotidien."
      />

      {/* Reassurance */}
      <section className="section tight" style={{ background: "var(--ivory)" }}>
        <div className="wrap">
          <div className="grid col-3">
            <div className="reass-card">
              <div className="icn"><Pin size={26} /></div>
              <h4>Présence terrain réelle</h4>
              <p>Équipe basée à Yaoundé. Nous sommes là où vous ne pouvez pas être.</p>
            </div>
            <div className="reass-card">
              <div className="icn"><Chart size={26} /></div>
              <h4>Reporting régulier</h4>
              <p>Preuves de réalisation : photos, documents, contrats. Vous êtes informé à chaque étape.</p>
            </div>
            <div className="reass-card">
              <div className="icn"><Handshake size={26} /></div>
              <h4>Interlocuteur dédié</h4>
              <p>Un contact unique, disponible, qui connaît votre dossier dans le détail.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Realities */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">Les réalités, sans les esquiver</div>
              <h2 className="section-head__title h2">Investir depuis l&apos;étranger,<br />c&apos;est affronter des défis concrets.</h2>
            </div>
            <p className="section-head__sub lede">
              Nous ne prétendons pas que c&apos;est simple. Vivre à Paris, Montréal, Bruxelles ou New York et vouloir construire un patrimoine au Cameroun, c&apos;est faire face à des obstacles réels. Nous les connaissons — parce que nos clients les vivent.
            </p>
          </div>
          <div className="grid col-2">
            {REALITIES.map((r) => (
              <div key={r.title} className="pillar">
                <div style={{ fontSize: 22 }}>{r.icon}</div>
                <h3 className="pillar__title">{r.title}</h3>
                <p className="pillar__body">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dialog */}
      <section className="section" style={{ background: "var(--ivory)" }}>
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">Vos inquiétudes. Nos réponses.</div>
              <h2 className="section-head__title h2">Pas en paroles.<br />En actes.</h2>
            </div>
            <p className="section-head__sub lede">
              Nous avons accompagné suffisamment d&apos;investisseurs de la diaspora pour connaître les doutes qui reviennent. Voici comment nous y répondons.
            </p>
          </div>
          <div className="dialog-row">
            {DIALOG_PAIRS.map((p, i) => (
              <Fragment key={i}>
                <div>
                  <div className="label">Ce que vous vous dites…</div>
                  <p className="question">« {p.q} »</p>
                </div>
                <div>
                  <div className="label">Ce que nous faisons.</div>
                  <p className="answer">{p.a}</p>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicles */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">Véhicules diaspora</div>
              <h2 className="section-head__title h2">Conçus pour fonctionner<br />à distance.</h2>
            </div>
            <p className="section-head__sub lede">
              Tous nos véhicules sont accessibles depuis l&apos;étranger. Certains sont particulièrement adaptés à la diaspora : ils ne nécessitent aucune présence physique, génèrent des revenus réguliers et sont gérés intégralement par Umdeny Capital.
            </p>
          </div>
          <div className="grid col-2">
            {VEH.map((v) => (
              <Link key={v.name} href="/nos-vehicules" className="profile-card" style={{ cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ fontSize: 28 }}>{v.icon}</div>
                  <span className={"sectors__status " + v.status}>{v.status === "active" ? "Actif" : "Bientôt"}</span>
                </div>
                <h3 className="profile-card__name">{v.name}</h3>
                <div style={{ display: "flex", gap: 24, margin: "8px 0 20px", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--mist)" }}>Rendement</div>
                    <div style={{ fontFamily: "var(--display)", fontSize: 16, fontWeight: 700, color: "var(--gold-dark)" }}>{v.headline}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--mist)" }}>Ticket</div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 14 }}>{v.ticket}</div>
                  </div>
                </div>
                <p className="profile-card__tag" style={{ color: "var(--ink-soft)", fontStyle: "normal", fontSize: 14 }}>{v.body}</p>
              </Link>
            ))}
          </div>
          <p style={{ fontSize: 13, color: "var(--mist)", marginTop: 24, fontStyle: "italic" }}>
            ↳ Virements possibles depuis votre pays de résidence. Mobile Money disponible pour les montants compatibles. Consulter notre équipe pour les modalités spécifiques à votre pays.
          </p>
        </div>
      </section>

      {/* Process */}
      <section className="section dark">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: "var(--gold-soft)" }}>Comment ça fonctionne</div>
              <h2 className="section-head__title h2" style={{ color: "#fff" }}>De votre premier message<br />à votre premier rendement.</h2>
            </div>
            <p className="section-head__sub lede">Investir depuis la diaspora avec Umdeny Capital suit un processus clair, documenté et sans surprise.</p>
          </div>
          <div style={{ borderTop: "1px solid rgba(191,142,80,0.25)" }}>
            {PROCESS_STEPS.map((s) => (
              <div key={s.n} style={{ display: "grid", gridTemplateColumns: "80px 1fr 2fr", gap: 32, padding: "36px 0", borderBottom: "1px solid rgba(191,142,80,0.25)", alignItems: "baseline" }}>
                <div style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: 36, color: "var(--gold-soft)", lineHeight: 1 }}>{s.n}</div>
                <h3 style={{ fontFamily: "var(--display)", fontSize: 22, margin: 0, fontWeight: 700 }}>{s.title}</h3>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.72)", fontSize: 15, lineHeight: 1.65 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">Accompagnement humain &amp; terrain</div>
              <h2 className="section-head__title h2">Votre présence à distance.<br />Notre exécution locale.</h2>
            </div>
            <p className="section-head__sub lede">
              Chaque client de la diaspora bénéficie d&apos;un accompagnement personnalisé pensé pour fonctionner malgré la distance. Nous construisons, avec méthode et rigueur, un patrimoine qui dure — pendant que vous continuez votre vie à l&apos;étranger.
            </p>
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, border: "1px solid var(--rule-light)" }}>
            {SUPPORT_ITEMS.map((it, i) => (
              <li key={i} style={{
                padding: "28px 32px",
                borderRight: i % 2 === 0 ? "1px solid var(--rule-light)" : "none",
                borderBottom: i < SUPPORT_ITEMS.length - 2 ? "1px solid var(--rule-light)" : "none",
                display: "flex", gap: 16, alignItems: "flex-start",
              }}>
                <div style={{ flexShrink: 0, width: 28, height: 28, border: "1px solid var(--gold)", display: "grid", placeItems: "center", color: "var(--gold)" }}>
                  <Check size={14} />
                </div>
                <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: "var(--ink)" }}>{it}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Geo */}
      <section className="section" style={{ background: "var(--ivory)" }}>
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">Couverture diaspora</div>
              <h2 className="section-head__title h2">Où que vous soyez,<br />nous sommes là.</h2>
            </div>
            <p className="section-head__sub lede">
              Notre clientèle diaspora est répartie sur plusieurs continents. Nous avons développé une expertise des contraintes spécifiques à chaque zone de résidence — fiscalité, transferts de fonds, fuseaux horaires, réglementations locales.
            </p>
          </div>
          <div className="geo-grid">
            <div className="geo-cell">
              <div className="geo-cell__flag">🇪🇺</div>
              <h4>Europe</h4>
              <p className="geo-cell__cities">France · Belgique · Suisse · Allemagne · Italie · Espagne · Royaume-Uni</p>
              <p className="geo-cell__note">Conventions fiscales Franco-Camerounaises et accords OHADA. Virements SEPA possibles. Décalage horaire UTC+1 à UTC+2 géré sans friction.</p>
            </div>
            <div className="geo-cell">
              <div className="geo-cell__flag">🌎</div>
              <h4>Amérique du Nord</h4>
              <p className="geo-cell__cities">Canada (Montréal, Ottawa) · États-Unis</p>
              <p className="geo-cell__note">Transferts internationaux via Wire Transfer. Décalage horaire UTC-5 / UTC-6 géré par disponibilités flexibles de notre équipe.</p>
            </div>
            <div className="geo-cell">
              <div className="geo-cell__flag">🌍</div>
              <h4>Afrique hors Cameroun</h4>
              <p className="geo-cell__cities">Côte d&apos;Ivoire · Gabon · Sénégal · RDC · Afrique du Sud · Maurice</p>
              <p className="geo-cell__note">Mobile Money disponible selon les corridors. Proximité culturelle et réglementaire zone CFA facilitée.</p>
            </div>
          </div>
        </div>
      </section>

      <FinalCTA />

      <p className="legal" style={{ paddingTop: 32, paddingBottom: 32, background: "var(--paper)" }}>
        Les rendements et exemples cités sur cette page sont des estimations basées sur des projections et des performances observées. Ils ne constituent pas une garantie de résultats futurs. Tout investissement comporte des risques. Les modalités de transfert de fonds et les implications fiscales varient selon le pays de résidence — consultez un conseiller fiscal local pour votre situation spécifique.
      </p>
    </main>
  );
}
