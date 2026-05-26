"use client";

import { useState } from "react";
import { PageHero, FinalCTA } from "../components/shared";
import { Pin, Mail, Phone, Arrow } from "../components/icons";

type FormState = {
  first: string;
  last: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  consent: boolean;
};

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>({
    first: "", last: "", email: "", phone: "", subject: "", message: "", consent: false,
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent) return;
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main>
      <PageHero
        crumb="Contact"
        title="Une question ? Un projet ? Écrivez-nous."
        sub="Notre équipe répond à toutes les demandes sous 24 à 48 heures ouvrées. Pas de formulaire perdu dans une boîte noire — une vraie réponse, d'une vraie personne."
      />

      <section className="section">
        <div className="wrap">
          {submitted && (
            <div className="success-banner">
              <strong>Merci {form.first || ""}.</strong> Votre message a bien été reçu. Un membre de notre équipe vous répondra sous 24 à 48 heures ouvrées à l&apos;adresse <strong>{form.email}</strong>. Pour toute urgence, vous pouvez également nous contacter directement par WhatsApp au <strong>+237 658 602 054</strong>.
            </div>
          )}

          <div className="contact-grid">
            <div>
              <div className="eyebrow">Coordonnées directes</div>
              <h2 className="h3" style={{ margin: "12px 0 24px" }}>Trois canaux. Une seule équipe.</h2>

              <div className="contact-card">
                <div className="contact-card__label"><Pin size={14} /> Adresse</div>
                <p className="contact-card__value">Yaoundé, Fouda, Cameroun</p>
                <p className="contact-card__note">Siège social — Umdeny Holdings</p>
              </div>
              <div className="contact-card">
                <div className="contact-card__label"><Mail size={14} /> Email</div>
                <p className="contact-card__value">direction@umdeny.com</p>
                <p className="contact-card__note">Réponse garantie sous 24–48h ouvrées</p>
              </div>
              <div className="contact-card">
                <div className="contact-card__label"><Phone size={14} /> Téléphone / WhatsApp</div>
                <p className="contact-card__value">+237 658 602 054</p>
                <p className="contact-card__note">Disponible en semaine · Lun–Ven · 8h–18h</p>
              </div>

              <div style={{ marginTop: 32, padding: "20px 22px", background: "var(--paper)", borderLeft: "3px solid var(--gold)" }}>
                <div className="eyebrow no-rule" style={{ fontSize: 10 }}>Confidentialité garantie</div>
                <p style={{ margin: "8px 0 0", fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>
                  Vos informations ne sont jamais partagées ni revendues. Elles sont utilisées uniquement pour vous répondre.
                </p>
              </div>
            </div>

            <form className="form" onSubmit={onSubmit}>
              <div>
                <h3 className="form__title">Envoyez-nous votre message</h3>
                <p className="form__sub">Décrivez votre situation et votre demande. Plus vous êtes précis, plus notre réponse sera utile.</p>
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

              <div className="field">
                <label>Email <span className="req">*</span></label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="votre@email.com" />
              </div>

              <div className="field">
                <label>Téléphone (optionnel)</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+237 6XX XXX XXX ou +33 6XX XX XX XX" />
              </div>

              <div className="field">
                <label>Sujet <span className="req">*</span></label>
                <select required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                  <option value="">Sélectionnez un sujet…</option>
                  <option>Demande d&apos;information générale</option>
                  <option>Question sur un véhicule d&apos;investissement</option>
                  <option>Partenariat</option>
                  <option>Presse &amp; médias</option>
                  <option>Autre</option>
                </select>
              </div>

              <div className="field">
                <label>Message <span className="req">*</span></label>
                <textarea required maxLength={2000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Décrivez votre situation, votre projet ou votre question…" />
                <div style={{ fontSize: 11, color: "var(--mist)", textAlign: "right" }}>{form.message.length}/2000</div>
              </div>

              <label className="checkbox">
                <input type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} />
                <span>J&apos;accepte la politique de confidentialité d&apos;Umdeny Capital. <span className="req">*</span></span>
              </label>

              <button type="submit" className="btn btn--gold" style={{ alignSelf: "flex-start", opacity: form.consent ? 1 : 0.5, pointerEvents: form.consent ? "auto" : "none" }}>
                Envoyer ma demande <Arrow size={14} />
              </button>
            </form>
          </div>
        </div>
      </section>

      <FinalCTA />
    </main>
  );
}
