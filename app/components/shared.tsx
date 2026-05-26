import Link from "next/link";
import { Arrow, Lock, Handshake, Doc } from "./icons";

export function PageHero({ crumb, title, sub }: { crumb?: string; title: string; sub?: string }) {
  return (
    <section className="page-hero">
      <div className="page-hero__inner">
        {crumb && (
          <div className="page-hero__crumb">
            <Link href="/">Accueil</Link> &nbsp;/&nbsp; <span>{crumb}</span>
          </div>
        )}
        <h1 className="page-hero__h1">{title}</h1>
        {sub && <p className="page-hero__sub">{sub}</p>}
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="final-cta">
      <div className="final-cta__inner">
        <div className="eyebrow no-rule" style={{ justifyContent: "center", color: "var(--gold-soft)" }}>Prêt à commencer ?</div>
        <h2 className="final-cta__title" style={{ marginTop: 16 }}>Prêt à construire votre stratégie patrimoniale ?</h2>
        <p className="final-cta__sub">Répondez à 14 questions en 4 minutes et recevez votre analyse patrimoniale gratuite.</p>
        <div className="final-cta__ctas">
          <Link href="/prendre-rdv" className="btn btn--gold">Faire le quiz patrimonial <Arrow size={14} /></Link>
          <Link href="/prendre-rdv" className="btn btn--outline-light">Prendre rendez-vous</Link>
        </div>
        <div className="final-cta__note">Appel de 30 min · Gratuit · Sans engagement · Disponible en semaine</div>
      </div>
    </section>
  );
}

const FEES = [
  {
    label: "Mode 1",
    title: "Commission d'intermédiation",
    body: "Dans le cadre de certaines mises en relation avec nos partenaires vérifiés, Umdeny Capital perçoit une commission d'intermédiation négociée. Elle est encadrée, déclarée, et conforme aux normes COSUMAF et OHADA. Le client n'est jamais prélevé deux fois.",
    app: "Marché Boursier · Mobile Money · Crowdfunding",
    range: "1% à 3% (boursier) · jusqu'à 10% (autres)",
  },
  {
    label: "Mode 2",
    title: "Frais de gestion",
    body: "Ils couvrent le suivi opérationnel, le reporting régulier, l'interface avec les partenaires et l'accompagnement personnalisé. Ces frais garantissent que votre dossier est activement suivi — pas simplement enregistré.",
    app: "Télécom · Immobilier · Transport",
    range: "1% à 10% selon le véhicule",
  },
  {
    label: "Mode 3",
    title: "Frais de performance",
    body: "Nous gagnons davantage uniquement quand vous performez. Les frais de performance sont prélevés uniquement lorsque vos investissements dépassent le hurdle rate convenu contractuellement.",
    app: "Trading · Immobilier · Transport · Télécom",
    range: "1% à 10% des gains au-dessus du seuil",
  },
  {
    label: "Mode 4",
    title: "Frais d'entrée & structuration",
    body: "Ils couvrent le travail initial réalisé avant votre premier engagement : analyse du dossier, due diligence complète, montage contractuel, création d'entité si nécessaire. L'investissement fondateur — celui qui protège tout ce qui suit.",
    app: "Mobile Money · Trading · Immobilier · Transport · Télécom",
    range: "1% à 10% du montant engagé",
  },
];

export function FeeModel() {
  return (
    <section className="section" style={{ background: "var(--ivory)" }} id="methode">
      <div className="wrap">
        <div className="section-head">
          <div>
            <div className="eyebrow">Modèle de rémunération</div>
            <h2 className="section-head__title h2">Une rémunération transparente,<br />alignée sur vos intérêts.</h2>
          </div>
          <p className="section-head__sub lede">
            Chez Umdeny Capital, la confiance se construit d&apos;abord par la clarté. Certains véhicules ne génèrent aucun frais pour le client. Pour les autres, chaque frais est négocié, borné et contractualisé avant tout engagement. Aucun frais caché. Aucune surprise.
          </p>
        </div>

        <div className="fees">
          {FEES.map((f) => (
            <div key={f.title} className="fee">
              <div className="fee__label">{f.label}</div>
              <h3 className="fee__title">{f.title}</h3>
              <p className="fee__body">{f.body}</p>
              <div className="fee__meta"><strong>Applicable à</strong>{f.app}</div>
              <div className="fee__meta"><strong>Fourchette</strong>{f.range}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 40, padding: "32px 36px", background: "var(--navy)", color: "#fff", borderLeft: "4px solid var(--gold)" }}>
          <div className="eyebrow" style={{ color: "var(--gold-soft)" }}>Notre engagement de transparence</div>
          <ul style={{ margin: "16px 0 0", paddingLeft: 22, color: "rgba(255,255,255,0.82)", fontSize: 14.5, lineHeight: 1.7 }}>
            <li>Tous les frais sont présentés, expliqués et signés contractuellement avant toute action.</li>
            <li><strong style={{ color: "var(--gold-soft)" }}>Marché Boursier et Crowdlending</strong> : aucun frais de gestion prélevé sur le client.</li>
            <li>Pour les autres véhicules : frais négociés, bornés entre 1% et 10%, justifiés.</li>
            <li>Aucun frais caché · Aucune commission non déclarée · Contrat signé avant tout engagement.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Transparence() {
  return (
    <section className="section transp">
      <div className="wrap">
        <div className="section-head">
          <div>
            <div className="eyebrow">Transparence</div>
            <h2 className="section-head__title h2">Une transparence totale<br />sur nos frais.</h2>
          </div>
          <p className="section-head__sub lede">
            Chez Umdeny Capital, la confiance se construit par la clarté. Avant tout engagement, chaque frais est présenté, expliqué et signé contractuellement. Aucun frais caché. Aucune surprise.
          </p>
        </div>
        <div className="grid col-3">
          <div className="transp-card">
            <div className="transp-card__icon"><Lock size={20} /></div>
            <h3 className="transp-card__title">Aucun frais caché</h3>
            <p className="transp-card__body">Tout est présenté, expliqué et signé avant votre premier engagement.</p>
          </div>
          <div className="transp-card">
            <div className="transp-card__icon"><Handshake size={20} /></div>
            <h3 className="transp-card__title">Marché Boursier &amp; Crowdlending</h3>
            <p className="transp-card__body">Aucun frais de gestion prélevé sur ces deux véhicules.</p>
          </div>
          <div className="transp-card">
            <div className="transp-card__icon"><Doc size={20} /></div>
            <h3 className="transp-card__title">1% à 10% maximum</h3>
            <p className="transp-card__body">Pour les autres véhicules : frais négociés, bornés et contractualisés.</p>
          </div>
        </div>
        <div style={{ marginTop: 32 }}>
          <Link href="/qui-sommes-nous#methode" className="btn btn--ghost">Consulter notre modèle de rémunération complet <Arrow size={14} /></Link>
        </div>
      </div>
    </section>
  );
}
