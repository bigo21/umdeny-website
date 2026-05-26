"use client";

import { useState } from "react";
import { PageHero } from "../components/shared";
import { Clock, Target, Check, Arrow, Briefcase, Globe, Building } from "../components/icons";

type FormState = {
  first: string;
  last: string;
  email: string;
  phone: string;
  country: string;
  objective: string;
  avail: string;
  mode: string;
  source: string;
  consent1: boolean;
  consent2: boolean;
};

export default function RDVPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>({
    first: "", last: "", email: "", phone: "", country: "", objective: "",
    avail: "", mode: "visio", source: "", consent1: false, consent2: false,
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent1 || !form.consent2) return;
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main>
      <PageHero
        crumb="Prendre rendez-vous"
        title="Parlons de votre patrimoine. 30 minutes. Gratuit. Sans engagement."
        sub="Un premier appel avec un membre de notre équipe pour comprendre votre situation, vos objectifs et vos contraintes. Nous vous proposons ensuite une analyse personnalisée de votre profil et des véhicules adaptés à votre cas."
      />

      <section className="section">
        <div className="wrap">
          {submitted && (
            <div className="success-banner">
              <strong>Merci {form.first || ""}.</strong> Votre demande de rendez-vous a bien été reçue. Un membre de notre équipe vous contactera sous 24 heures pour confirmer votre créneau. En attendant, vous pouvez faire le quiz patrimonial pour préparer notre échange.
            </div>
          )}
          <div className="rdv-promises">
            <div>
              <div className="icn"><Clock size={24} /></div>
              <h4>30 minutes</h4>
              <p>Un échange structuré, pas une présentation commerciale.</p>
            </div>
            <div>
              <div className="icn"><Target size={24} /></div>
              <h4>100% personnalisé</h4>
              <p>Votre situation, vos objectifs, votre profil. Rien de générique.</p>
            </div>
            <div>
              <div className="icn"><Check size={24} /></div>
              <h4>Gratuit, sans engagement</h4>
              <p>Aucune obligation à l&apos;issue de l&apos;appel. Vous décidez.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section tight" style={{ background: "var(--ivory)" }}>
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">Ce que nous faisons pendant ces 30 minutes</div>
              <h2 className="section-head__title h2">Pas un appel de vente.<br />Un diagnostic.</h2>
            </div>
            <p className="section-head__sub lede">
              Notre objectif est de comprendre où vous en êtes, où vous voulez aller, et si — et comment — Umdeny Capital peut vous aider à y arriver.
            </p>
          </div>
          <div className="grid col-4">
            {[
              ["01", "Nous écoutons votre situation", "Votre profil professionnel, votre situation patrimoniale actuelle, vos expériences passées. Sans jugement — avec attention."],
              ["02", "Nous comprenons vos objectifs", "Qu'est-ce que vous voulez construire ? Sur quel horizon ? Avec quels moyens ? Quelles sont vos contraintes réelles ?"],
              ["03", "Nous identifions les véhicules adaptés", "2 ou 3 véhicules qui correspondent à votre situation — avec les rendements réalistes, les risques et les conditions d'accès."],
              ["04", "Vous repartez avec un plan", "Vous savez exactement par où commencer, combien allouer en premier, et ce qui vous attend si vous décidez d'aller plus loin."],
            ].map(([n, t, b]) => (
              <div key={n} className="pillar">
                <div className="pillar__num">{n}</div>
                <h3 className="pillar__title" style={{ fontSize: 18 }}>{t}</h3>
                <p className="pillar__body">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">Pour qui est ce rendez-vous ?</div>
              <h2 className="section-head__title h2">Ce rendez-vous est fait pour vous si…</h2>
            </div>
          </div>
          <div className="rdv-check">
            <div className="rdv-check__box good">
              <h4>✓ Ce RDV est fait pour vous si…</h4>
              <ul>
                <li>Vous avez un capital à investir et ne savez pas par où commencer</li>
                <li>Vous êtes de la diaspora et cherchez un relais fiable au Cameroun</li>
                <li>Vous avez déjà investi et voulez structurer ou diversifier votre patrimoine</li>
                <li>Vous avez un projet précis (immobilier, entreprise, transmission) à structurer</li>
                <li>Vous voulez comprendre les opportunités réelles des marchés africains</li>
              </ul>
            </div>
            <div className="rdv-check__box bad">
              <h4>— Ce RDV n&apos;est pas adapté si…</h4>
              <ul>
                <li>Vous cherchez des rendements garantis élevés sur des horizons très courts — ce n&apos;est pas ce que nous proposons</li>
                <li>Vous n&apos;êtes pas prêt à investir dans les 6 prochains mois — privilégiez d&apos;abord le quiz patrimonial</li>
                <li>Vous cherchez un conseil juridique ou fiscal formel — orientez-vous vers notre réseau d&apos;experts spécialisés</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--ivory)" }}>
        <div className="wrap">
          <div className="contact-grid">
            <div>
              <div className="eyebrow">Réservez votre créneau</div>
              <h2 className="h3" style={{ margin: "12px 0 16px" }}>Remplissez ce formulaire — un membre de notre équipe vous confirme votre rendez-vous sous 24h.</h2>
              <p className="muted" style={{ fontSize: 14, marginBottom: 24 }}>L&apos;échange se déroule en visio (Zoom/Meet), par téléphone, ou en présentiel à Yaoundé. Disponibilités en semaine, fuseaux horaires diaspora pris en compte.</p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
                <div className="proof-card">
                  <div className="icn"><Briefcase size={22} /></div>
                  <h4>Le salarié qui veut diversifier</h4>
                  <p>Une épargne dormante, le besoin d&apos;un premier investissement structuré — loin des arnaques et des promesses vides.</p>
                </div>
                <div className="proof-card">
                  <div className="icn"><Globe size={22} /></div>
                  <h4>Le diaspora qui veut rentabiliser</h4>
                  <p>En Europe ou en Amérique, il envoie de l&apos;argent au Cameroun sans structure réelle. Il veut enfin construire quelque chose de tangible.</p>
                </div>
                <div className="proof-card">
                  <div className="icn"><Building size={22} /></div>
                  <h4>L&apos;entrepreneur qui veut protéger</h4>
                  <p>Une activité rentable mais tout le patrimoine repose sur l&apos;entreprise. Diversifier, structurer, préparer la transmission.</p>
                </div>
              </div>
            </div>

            <form className="form" onSubmit={onSubmit}>
              <div>
                <h3 className="form__title">Réservez votre RDV</h3>
                <p className="form__sub">30 min · Gratuit · Sans engagement · Disponible en semaine.</p>
              </div>

              <div className="field--row">
                <div className="field">
                  <label>Prénom <span className="req">*</span></label>
                  <input type="text" required value={form.first} onChange={(e) => setForm({ ...form, first: e.target.value })} placeholder="Votre prénom" />
                </div>
                <div className="field">
                  <label>Nom <span className="req">*</span></label>
                  <input type="text" required value={form.last} onChange={(e) => setForm({ ...form, last: e.target.value })} placeholder="Votre nom de famille" />
                </div>
              </div>

              <div className="field--row">
                <div className="field">
                  <label>Email <span className="req">*</span></label>
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="votre@email.com" />
                </div>
                <div className="field">
                  <label>Téléphone / WhatsApp <span className="req">*</span></label>
                  <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+237 6XX XXX XXX" />
                </div>
              </div>

              <div className="field">
                <label>Pays de résidence <span className="req">*</span></label>
                <select required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>
                  <option value="">Sélectionnez votre pays…</option>
                  <option>Cameroun (Yaoundé)</option>
                  <option>Cameroun (Douala)</option>
                  <option>Cameroun (autre)</option>
                  <option>France</option>
                  <option>Belgique</option>
                  <option>Suisse</option>
                  <option>Canada</option>
                  <option>États-Unis</option>
                  <option>Côte d&apos;Ivoire</option>
                  <option>Gabon</option>
                  <option>Afrique du Sud</option>
                  <option>Autre pays africain</option>
                  <option>Autre</option>
                </select>
              </div>

              <div className="field">
                <label>Objectif principal <span className="req">*</span></label>
                <select required value={form.objective} onChange={(e) => setForm({ ...form, objective: e.target.value })}>
                  <option value="">Quel est votre objectif ?</option>
                  <option>Faire fructifier un capital existant</option>
                  <option>Générer des revenus complémentaires</option>
                  <option>Protéger mon patrimoine</option>
                  <option>Préparer ma retraite</option>
                  <option>Transmettre un patrimoine</option>
                  <option>Investir depuis la diaspora</option>
                  <option>Structurer juridiquement</option>
                  <option>Autre</option>
                </select>
              </div>

              <div className="field">
                <label>Disponibilités souhaitées <span className="req">*</span></label>
                <textarea required value={form.avail} onChange={(e) => setForm({ ...form, avail: e.target.value })} placeholder="Ex : Disponible lundi, mercredi ou vendredi entre 10h et 18h (heure de Yaoundé)…" style={{ minHeight: 90 }} />
              </div>

              <div className="field">
                <label>Mode de rendez-vous <span className="req">*</span></label>
                <div className="radio-group">
                  {([["visio", "Visio (Zoom/Meet)"], ["tel", "Téléphone"], ["pres", "Présentiel — Yaoundé"]] as const).map(([v, l]) => (
                    <label key={v}>
                      <input type="radio" name="mode" value={v} checked={form.mode === v} onChange={(e) => setForm({ ...form, mode: e.target.value })} />
                      <span>{l}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="field">
                <label>Comment nous avez-vous connus ? (optionnel)</label>
                <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
                  <option value="">Sélectionnez…</option>
                  <option>Recommandation d&apos;un proche</option>
                  <option>Réseaux sociaux</option>
                  <option>Quiz patrimonial</option>
                  <option>Blog</option>
                  <option>Recherche Google</option>
                  <option>Autre</option>
                </select>
              </div>

              <label className="checkbox">
                <input type="checkbox" checked={form.consent1} onChange={(e) => setForm({ ...form, consent1: e.target.checked })} />
                <span>J&apos;accepte d&apos;être contacté(e) par l&apos;équipe Umdeny Capital pour confirmer mon rendez-vous. <span className="req">*</span></span>
              </label>
              <label className="checkbox">
                <input type="checkbox" checked={form.consent2} onChange={(e) => setForm({ ...form, consent2: e.target.checked })} />
                <span>J&apos;accepte la politique de confidentialité d&apos;Umdeny Capital. <span className="req">*</span></span>
              </label>

              <button
                type="submit"
                className="btn btn--gold"
                style={{ alignSelf: "flex-start", opacity: form.consent1 && form.consent2 ? 1 : 0.5, pointerEvents: form.consent1 && form.consent2 ? "auto" : "none" }}
              >
                Réserver mon rendez-vous <Arrow size={14} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
