// =====================================================
// POST /api/candidature-apporteur
// Reçoit les réponses du quiz, les enregistre dans le schéma
// umdeny_apporteur du Supabase mutualisé, puis notifie via Resend.
//
// Même pattern que quiz-umdeny/app/api/submit : insertion via service_role,
// emails en Promise.allSettled sans faire échouer la requête, puis mise à
// jour des drapeaux d'envoi.
//
// Le client n'envoie QUE ses réponses : le score et le tag de priorité sont
// recalculés ici. Sinon n'importe qui pourrait se déclarer PRIORITAIRE en
// modifiant sa requête.
// =====================================================

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { candidateEmail, TEAM_EMAIL, teamEmail } from "@/lib/emails/candidature-apporteur";
import { buildCandidature, validateAnswers } from "@/lib/quiz-apporteur/candidature";
import { APPORTEUR_SCHEMA, CANDIDATURES_TABLE, createServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const FROM = process.env.EMAIL_FROM ?? "Umdeny Capital <candidatures@umdeny.com>";

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
  const supabase = createServiceClient();

  // --- 1. Persistance : source de vérité.
  // Si elle échoue, on ne raconte pas au candidat que sa candidature est reçue.
  let candidatId: string;
  try {
    const { data, error } = await supabase
      .schema(APPORTEUR_SCHEMA)
      .from(CANDIDATURES_TABLE)
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
  let emailCandidatOk = false;
  let emailEquipeOk = false;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn("[candidature-apporteur] RESEND_API_KEY absente : aucun email envoyé.");
  } else {
    const resend = new Resend(apiKey);
    const toCandidate = candidateEmail(built.row.prenom);
    const toTeam = teamEmail(built);

    const [candidatResult, equipeResult] = await Promise.allSettled([
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

    emailCandidatOk = candidatResult.status === "fulfilled" && !candidatResult.value.error;
    emailEquipeOk = equipeResult.status === "fulfilled" && !equipeResult.value.error;

    if (!emailCandidatOk) console.error("[candidature-apporteur] email candidat en échec :", candidatResult);
    if (!emailEquipeOk) console.error("[candidature-apporteur] email équipe en échec :", equipeResult);

    // Trace en base de ce qui est réellement parti, comme umdeny_quiz.
    const { error: updateError } = await supabase
      .schema(APPORTEUR_SCHEMA)
      .from(CANDIDATURES_TABLE)
      .update({ email_candidat_envoye: emailCandidatOk, email_equipe_envoye: emailEquipeOk })
      .eq("candidat_id", candidatId);

    if (updateError) {
      console.error("[candidature-apporteur] mise à jour des drapeaux d'email en échec :", updateError);
    }
  }

  return NextResponse.json(
    { ok: true, candidatId, emailsSent: emailCandidatOk && emailEquipeOk },
    { status: 201 },
  );
}
