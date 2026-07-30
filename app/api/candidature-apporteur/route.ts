// =====================================================
// POST /api/candidature-apporteur
// Reçoit les réponses du quiz, les enregistre, puis notifie.
//
// Le client n'envoie QUE ses réponses : le score et les tags sont recalculés
// ici. Sinon n'importe qui pourrait se déclarer PRIORITAIRE en modifiant sa
// requête.
// =====================================================

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { candidateEmail, TEAM_EMAIL, teamEmail } from "@/lib/emails/candidature-apporteur";
import { buildCandidature, validateAnswers } from "@/lib/quiz-apporteur/candidature";
import { createServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const FROM = process.env.RESEND_FROM ?? "Umdeny Capital <candidatures@umdeny.com>";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête illisible." }, { status: 400 });
  }

  const answers = (body as { answers?: unknown } | null)?.answers;

  const validation = validateAnswers(answers);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: validation.status });
  }

  const built = buildCandidature(answers as Record<string, string | string[]>);

  // --- 1. Persistance : source de vérité.
  // Si elle échoue, on ne raconte pas au candidat que sa candidature est reçue.
  let candidatId: string;
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("candidatures_apporteur")
      .insert(built.row)
      .select("candidat_id")
      .single();

    if (error) throw error;
    candidatId = data.candidat_id as string;
  } catch (error) {
    // On journalise l'erreur technique, jamais le contenu de la candidature :
    // elle contient nom, email et téléphone.
    console.error("[candidature-apporteur] échec d'enregistrement :", error);
    return NextResponse.json(
      { error: "Enregistrement impossible pour le moment. Merci de réessayer dans un instant." },
      { status: 502 },
    );
  }

  // --- 2. Notifications : au mieux.
  // La candidature est déjà sauvegardée ; un échec d'email ne doit pas la
  // faire perdre ni bloquer le candidat.
  let emailsSent = false;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn("[candidature-apporteur] RESEND_API_KEY absente : aucun email envoyé.");
  } else {
    try {
      const resend = new Resend(apiKey);
      const toCandidate = candidateEmail(built.row.prenom);
      const toTeam = teamEmail(built);

      const results = await Promise.allSettled([
        resend.emails.send({
          from: FROM,
          to: built.row.email,
          replyTo: TEAM_EMAIL,
          subject: toCandidate.subject,
          html: toCandidate.html,
          text: toCandidate.text,
        }),
        resend.emails.send({
          from: FROM,
          to: TEAM_EMAIL,
          replyTo: built.row.email,
          subject: toTeam.subject,
          html: toTeam.html,
          text: toTeam.text,
        }),
      ]);

      results.forEach((result, i) => {
        const target = i === 0 ? "candidat" : "équipe";
        if (result.status === "rejected") {
          console.error(`[candidature-apporteur] email ${target} en échec :`, result.reason);
        } else if (result.value.error) {
          console.error(`[candidature-apporteur] email ${target} refusé par Resend :`, result.value.error);
        }
      });

      emailsSent = results.every((r) => r.status === "fulfilled" && !r.value.error);
    } catch (error) {
      console.error("[candidature-apporteur] échec d'envoi des emails :", error);
    }
  }

  return NextResponse.json({ ok: true, candidatId, emailsSent }, { status: 201 });
}
