// Données collectées par le formulaire d'inscription au webinaire.
//
// Les deux consentements reprennent les colonnes `consentement_rgpd` et
// `consentement_contact` déjà prévues par le schéma umdeny_apporteur, que le
// quiz de candidature ne remplit pas encore.

export interface Inscription {
  prenom: string;
  nom: string;
  email: string;
  /** Facultatif : le champ peut être laissé vide. */
  telephone: string;
  /** Obligatoire : le formulaire ne se soumet pas sans. */
  consentementRgpd: boolean;
  consentementContact: boolean;
}
