"use client";

import { useState } from "react";
import { LoaderCircle, Lock, TriangleAlert } from "lucide-react";

const TRAIT = 1.7;

export function Connexion() {
  const [motDePasse, setMotDePasse] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function envoyer(evenement: React.FormEvent<HTMLFormElement>) {
    evenement.preventDefault();
    if (envoi) return;

    setEnvoi(true);
    setErreur(null);
    try {
      const reponse = await fetch("/api/admin/connexion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motDePasse }),
      });
      const corps = (await reponse.json().catch(() => null)) as { error?: string } | null;

      if (!reponse.ok) {
        setErreur(corps?.error ?? "Connexion impossible.");
        return;
      }
      // Rechargement plutôt que navigation : la page est rendue côté serveur
      // selon le cookie, qui vient seulement d'être posé.
      window.location.reload();
    } catch {
      setErreur("Connexion impossible. Vérifiez votre réseau.");
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <main className="ad-connexion">
      <form className="ad-connexion__carte" onSubmit={envoyer}>
        <div className="ad-connexion__icn">
          <Lock size={26} strokeWidth={TRAIT} />
        </div>
        <h1>Administration</h1>
        <p>Configuration des sessions de webinaire.</p>

        <label htmlFor="motDePasse">Mot de passe</label>
        <input
          type="password"
          id="motDePasse"
          autoComplete="current-password"
          autoFocus
          required
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
        />

        {erreur ? (
          <p className="ad-erreur" role="alert">
            <TriangleAlert size={16} strokeWidth={TRAIT} />
            <span>{erreur}</span>
          </p>
        ) : null}

        <button type="submit" className="ad-bouton ad-bouton--or" disabled={envoi}>
          {envoi ? (
            <>
              <LoaderCircle size={16} strokeWidth={TRAIT} className="ad-tourne" /> Connexion…
            </>
          ) : (
            "Se connecter"
          )}
        </button>
      </form>
    </main>
  );
}
