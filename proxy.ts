import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Mode maintenance — piloté par la variable d'environnement MAINTENANCE_MODE.
// Le code est identique sur toutes les branches : c'est la valeur définie dans
// Vercel qui décide. main => "1" (site en maintenance), develop => "0".
const MAINTENANCE_ENABLED = process.env.MAINTENANCE_MODE === "1";

export function proxy(request: NextRequest) {
  if (!MAINTENANCE_ENABLED) return NextResponse.next();

  // Réécriture (et non redirection) : l'URL demandée reste affichée dans la
  // barre d'adresse, chaque lien existant d'umdeny.com rend la page de
  // maintenance servie par O2Switch.
  const response = NextResponse.rewrite(new URL("/maintenance.html", request.url));

  // Empêche l'indexation de la page de maintenance à la place des vraies pages.
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Retry-After", "86400");
  response.headers.set("Cache-Control", "no-store");

  return response;
}

export const config = {
  // Tout est intercepté sauf :
  //  - les fichiers internes de Next et les assets de la page de maintenance ;
  //  - le quiz apporteur d'affaires et sa route API. C'est une surface
  //    autonome, qui doit rester ouverte pendant que le site vitrine est en
  //    maintenance — comme quizz.umdeny.com pour le quiz patrimonial.
  //    Sans cette exclusion, /apporteur-affaires rendrait la page de
  //    maintenance et le POST vers l'API échouerait en 500, la réécriture
  //    l'envoyant vers un fichier HTML statique.
  //  - la route d'inscription au webinaire, pour la même raison. Le préfixe
  //    « apporteur-affaires » couvre déjà la page /apporteur-affaires/webinaire,
  //    mais sa route API vit sous /api et doit être citée à part.
  matcher: [
    "/((?!_next/static|_next/image|assets/|maintenance\\.html|favicon\\.ico|apporteur-affaires|api/candidature-apporteur|api/inscription-webinaire).*)",
  ],
};
