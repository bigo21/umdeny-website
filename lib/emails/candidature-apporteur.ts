// =====================================================
// EMAILS — Candidature apporteur d'affaires
// Gabarits de la spec v2.0 partie 10.
//
// Email 1 (candidat) : accusé de réception. Aucun lien Cal.com ni WhatsApp —
// c'est l'équipe qui initie le contact suivant, jamais le candidat.
// Email 2 (équipe)   : synthèse de priorité + parcours de formation + TOUTES
// les réponses brutes. Les deux ensemble, jamais l'une sans l'autre. Le
// message libre du candidat est transmis intégralement, jamais reformulé.
// =====================================================

import type { BuiltCandidature } from "../quiz-apporteur/candidature";
import { VERTICALS } from "../quiz-apporteur/data";

const TEAM_EMAIL = "partner@umdeny.com";

/** Échappe le contenu saisi par le candidat avant insertion dans du HTML. */
function esc(value: string | null | undefined): string {
  if (value == null || value === "") return "—";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escMultiline(value: string | null | undefined): string {
  if (value == null || value === "") return "—";
  return esc(value).replace(/\n/g, "<br />");
}

function escList(values: string[] | null | undefined): string {
  return values && values.length ? values.map((v) => esc(v)).join(" · ") : "—";
}

// ---------------------------------------------------------------
// EMAIL 1 — au candidat
// ---------------------------------------------------------------

export function candidateEmail(prenom: string): { subject: string; html: string; text: string } {
  const subject = "Votre candidature apporteur d'affaires — Umdeny";

  const text = `Bonjour ${prenom},

Merci d'avoir soumis votre candidature pour devenir apporteur d'affaires Umdeny.

Notre équipe étudie actuellement votre profil. Si celui-ci correspond aux besoins actuels du programme, nous reviendrons vers vous sous quelques jours ouvrés pour organiser un échange.

En attendant, n'hésitez pas à nous écrire à ${TEAM_EMAIL} pour toute question.

L'équipe Umdeny
${TEAM_EMAIL} · Yaoundé, Cameroun`;

  const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#F7F5F0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F5F0;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid rgba(11,18,38,0.10);">
        <tr><td style="background:#050F3C;padding:24px 32px;">
          <div style="font-family:'Roboto Condensed',Arial,sans-serif;font-weight:700;font-size:17px;letter-spacing:0.08em;color:#ffffff;">UMDENY CAPITAL</div>
          <div style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.24em;text-transform:uppercase;color:#BF8E50;margin-top:4px;">From Patrimony to Legacy</div>
        </td></tr>
        <tr><td style="padding:32px;font-family:Arial,sans-serif;font-size:15px;line-height:1.65;color:#0B1226;">
          <p style="margin:0 0 18px;">Bonjour ${esc(prenom)},</p>
          <p style="margin:0 0 18px;">Merci d'avoir soumis votre candidature pour devenir apporteur d'affaires Umdeny.</p>
          <p style="margin:0 0 18px;">Notre équipe étudie actuellement votre profil. Si celui-ci correspond aux besoins actuels du programme, nous reviendrons vers vous sous quelques jours ouvrés pour organiser un échange.</p>
          <p style="margin:0 0 18px;">En attendant, n'hésitez pas à nous écrire à <a href="mailto:${TEAM_EMAIL}" style="color:#8C6837;">${TEAM_EMAIL}</a> pour toute question.</p>
          <p style="margin:24px 0 0;color:#4A5475;">L'équipe Umdeny<br />
          <span style="font-size:13px;">${TEAM_EMAIL} · Yaoundé, Cameroun</span></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  return { subject, html, text };
}

// ---------------------------------------------------------------
// EMAIL 2 — à l'équipe
// ---------------------------------------------------------------

function section(title: string, body: string): string {
  return `<tr><td style="padding:20px 28px 0;">
    <div style="font-family:'Roboto Condensed',Arial,sans-serif;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#8C6837;border-bottom:1px solid rgba(191,142,80,0.35);padding-bottom:6px;margin-bottom:12px;">${title}</div>
    <div style="font-family:Arial,sans-serif;font-size:13.5px;line-height:1.65;color:#0B1226;">${body}</div>
  </td></tr>`;
}

function row(label: string, value: string): string {
  return `<div style="margin-bottom:4px;"><strong style="color:#4A5475;font-weight:600;">${label} :</strong> ${value}</div>`;
}

export function teamEmail(built: BuiltCandidature): { subject: string; html: string; text: string } {
  const { row: r, score, signals, formationPaths } = built;
  const fullName = `${r.prenom} ${r.nom}`.trim();

  const subject = `Nouvelle candidature apporteur — ${fullName} — ${score.tag} — Score ${score.scoreTotal}/100`;

  // --- Identité
  const identite = [
    row("Nom", esc(r.nom)),
    row("Prénom", esc(r.prenom)),
    row("Email", esc(r.email)),
    row("Téléphone / WhatsApp", esc(r.telephone)),
    row("Pays de résidence", esc(r.pays)),
    row("Tranche d'âge", esc(r.age_range)),
    row("Situation matrimoniale", esc(r.situation_matrimoniale)),
    row("Situation professionnelle", esc(r.situation_pro)),
    row("Secteur d'activité", esc(r.secteur)),
  ].join("");

  // --- Synthèse de priorité
  const bestVertical =
    VERTICALS.filter((v) => score.pertinenceDetail[v.key] === score.scorePertinence).map((v) => v.label)[0] ?? "—";

  const synthese =
    `<div style="font-size:16px;margin-bottom:10px;"><strong>Score total : ${score.scoreTotal}/100</strong> · ${esc(score.tag)}</div>` +
    row("Réseau", `${score.scoreReseau}/100`) +
    row("Expérience", `${score.scoreExp}/100`) +
    row("Disponibilité", `${score.scoreDispo}/100`) +
    row("Pertinence verticale", `${score.scorePertinence}/100 — ${esc(bestVertical)}`) +
    row("Signaux complémentaires", signals.length ? signals.map((s) => esc(s)).join("<br />") : "Aucun");

  // --- Parcours de formation
  const formation = formationPaths.length
    ? formationPaths
        .map(
          (p) =>
            `<div style="margin-bottom:10px;"><strong>${esc(p.verticalLabel)}</strong><br />` +
            `Maîtrise déclarée : ${esc(p.maitrise)}<br />` +
            `<span style="color:#4A5475;">Parcours : ${esc(p.parcours)}</span></div>`,
        )
        .join("")
    : "—";

  // --- Bloc commun Q1 à Q17
  const commun = [
    row("Q1–Q4 Identité", `${esc(r.nom)} · ${esc(r.prenom)} · ${esc(r.email)} · ${esc(r.telephone)}`),
    row("Q5 Majorité confirmée", "Oui"),
    row("Q6 Lieu de résidence", esc(r.pays)),
    row("Q7 Tranche d'âge", esc(r.age_range)),
    row("Q8 Situation professionnelle", esc(r.situation_pro)),
    row("Q9 Situation matrimoniale", esc(r.situation_matrimoniale)),
    row("Q10 Situation financière", esc(r.situation_financiere)),
    row("Q11 Secteur d'activité", esc(r.secteur)),
    row("Q12 Type de réseau", escList(r.reseau_type)),
    row("Q13 Taille du réseau", esc(r.reseau_taille)),
    row("Q14 Canaux utilisés", escList(r.canaux)),
    row("Q15 Expérience commerciale", esc(r.experience_commerciale)),
    row("Q16 Disponibilité hebdomadaire", esc(r.disponibilite)),
    row("Q17 Motivation principale", esc(r.motivation)),
  ].join("");

  // --- Blocs conditionnels, intégralement
  const conditionnels = Object.entries(r.reponses_conditionnelles)
    .map(([, v]) => {
      const specific = Array.isArray(v.question_specifique)
        ? escList(v.question_specifique)
        : esc(v.question_specifique);
      return (
        `<div style="margin-bottom:14px;padding-left:10px;border-left:2px solid rgba(191,142,80,0.4);">` +
        `<strong>${esc(v.label)}</strong><br />` +
        row("Q_x1 Niveau de contact", esc(v.niveau_contact)) +
        row("Q_x2 Niveau de maîtrise de l'offre", esc(v.niveau_maitrise)) +
        row("Q_x3 Géographie des contacts", esc(v.geographie)) +
        row("Q_x4 Nature de la relation", esc(v.nature_relation)) +
        row("Q_x5 Délai de mise en relation", esc(v.delai_mise_en_relation)) +
        row("Q_x6 Frein principal anticipé", esc(v.frein_principal)) +
        row("Q_x7 Question spécifique", specific) +
        `</div>`
      );
    })
    .join("");

  // --- Message libre : transmis tel quel, jamais reformulé
  const libre =
    row("Liens partagés (Q_END1)", escMultiline(r.liens_partages)) +
    row("Message libre (Q_END2)", escMultiline(r.message_libre));

  const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#EFEAE0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;background:#ffffff;border:1px solid rgba(11,18,38,0.12);">
        <tr><td style="background:#050F3C;padding:20px 28px;">
          <div style="font-family:'Roboto Condensed',Arial,sans-serif;font-weight:700;font-size:15px;letter-spacing:0.07em;color:#ffffff;">CANDIDATURE APPORTEUR D'AFFAIRES</div>
          <div style="font-family:Arial,sans-serif;font-size:13px;color:#DFB56D;margin-top:6px;">${esc(fullName)} · ${esc(score.tag)} · ${score.scoreTotal}/100</div>
        </td></tr>
        ${section("1 · Identité", identite)}
        ${section("2 · Synthèse de priorité", synthese)}
        ${section("3 · Parcours de formation recommandé", formation)}
        ${section("4 · Bloc commun (Q1 à Q17)", commun)}
        ${section("5 · Blocs conditionnels par verticale", conditionnels || "—")}
        ${section("6 · Message libre et liens partagés", libre)}
        <tr><td style="padding:24px 28px 28px;">
          <div style="font-family:Arial,sans-serif;font-size:11.5px;color:#6B7A99;font-style:italic;border-top:1px solid rgba(11,18,38,0.08);padding-top:14px;">
            Score et tags à usage interne strict : ils ne sont jamais affichés au candidat.
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  // Version texte : mêmes informations, pour les clients sans HTML.
  const text = [
    `CANDIDATURE APPORTEUR D'AFFAIRES`,
    `${fullName} · ${score.tag} · ${score.scoreTotal}/100`,
    ``,
    `1. IDENTITÉ`,
    `${r.nom} · ${r.prenom} · ${r.email} · ${r.telephone}`,
    `Pays : ${r.pays ?? "—"} · Âge : ${r.age_range ?? "—"} · Matrimonial : ${r.situation_matrimoniale ?? "—"}`,
    `Professionnel : ${r.situation_pro ?? "—"} · Secteur : ${r.secteur ?? "—"}`,
    ``,
    `2. SYNTHÈSE DE PRIORITÉ`,
    `Score total : ${score.scoreTotal}/100 · Tag : ${score.tag}`,
    `Réseau ${score.scoreReseau}/100 · Expérience ${score.scoreExp}/100 · Disponibilité ${score.scoreDispo}/100 · Pertinence ${score.scorePertinence}/100 (${bestVertical})`,
    `Signaux : ${signals.length ? signals.join(" | ") : "Aucun"}`,
    ``,
    `3. PARCOURS DE FORMATION`,
    ...(formationPaths.length
      ? formationPaths.map((p) => `- ${p.verticalLabel} : ${p.maitrise} -> ${p.parcours}`)
      : ["—"]),
    ``,
    `4. BLOC COMMUN`,
    `Q10 Situation financière : ${r.situation_financiere ?? "—"}`,
    `Q12 Type de réseau : ${r.reseau_type.join(", ") || "—"}`,
    `Q13 Taille du réseau : ${r.reseau_taille ?? "—"}`,
    `Q14 Canaux : ${r.canaux.join(", ") || "—"}`,
    `Q15 Expérience : ${r.experience_commerciale ?? "—"}`,
    `Q16 Disponibilité : ${r.disponibilite ?? "—"}`,
    `Q17 Motivation : ${r.motivation ?? "—"}`,
    ``,
    `5. BLOCS CONDITIONNELS`,
    ...Object.values(r.reponses_conditionnelles).flatMap((v) => [
      `[${v.label}]`,
      `  Contact : ${v.niveau_contact ?? "—"}`,
      `  Maîtrise : ${v.niveau_maitrise ?? "—"}`,
      `  Géographie : ${v.geographie ?? "—"}`,
      `  Relation : ${v.nature_relation ?? "—"}`,
      `  Délai : ${v.delai_mise_en_relation ?? "—"}`,
      `  Frein : ${v.frein_principal ?? "—"}`,
      `  Spécifique : ${Array.isArray(v.question_specifique) ? v.question_specifique.join(", ") : (v.question_specifique ?? "—")}`,
    ]),
    ``,
    `6. MESSAGE LIBRE ET LIENS`,
    `Liens : ${r.liens_partages ?? "—"}`,
    `Message : ${r.message_libre ?? "—"}`,
  ].join("\n");

  return { subject, html, text };
}

export { TEAM_EMAIL };
