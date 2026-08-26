// Conversion entre l'ISO 8601 stocké et le champ « datetime-local » du
// formulaire.
//
// L'Edge Function refuse une date sans décalage horaire, et elle a raison :
// « 2026-11-05 18:00 » ne dit pas quelle heure sera réellement annoncée aux
// inscrits. Or un champ datetime-local ne produit jamais de décalage. C'est
// donc ici qu'on l'ajoute, explicitement.

/** Fuseau du siège, à Yaoundé. Le Cameroun ne pratique pas d'heure d'été. */
export const FUSEAU_SIEGE = "Africa/Douala";
export const DECALAGE_SIEGE = "+01:00";

/**
 * ISO stocké → valeur d'un champ datetime-local, exprimée à l'heure de Yaoundé.
 *
 * À n'appeler que côté serveur : la page convertit une fois et transmet le
 * résultat, l'ICU de Node et celle du navigateur ne formatant pas toujours à
 * l'identique.
 */
export function isoVersChampLocal(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const parties = new Intl.DateTimeFormat("fr-CA", {
    timeZone: FUSEAU_SIEGE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const p = (type: string) => parties.find((x) => x.type === type)?.value ?? "";
  // fr-CA rend déjà l'année, le mois et le jour en deux chiffres zéro-remplis.
  return `${p("year")}-${p("month")}-${p("day")}T${p("hour")}:${p("minute")}`;
}

/**
 * Valeur d'un champ datetime-local → ISO 8601 avec décalage.
 *
 * Rend `null` sur un champ vidé : c'est ainsi que le contrat efface une date,
 * là qu'un champ absent la laisserait inchangée.
 */
export function champLocalVersIso(valeur: string): string | null {
  const propre = valeur.trim();
  if (!propre) return null;
  return `${propre}:00${DECALAGE_SIEGE}`;
}
