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
  // Tout est intercepté sauf les assets de la page de maintenance elle-même
  // et les fichiers internes de Next.
  matcher: [
    "/((?!_next/static|_next/image|assets/|maintenance\\.html|favicon\\.ico).*)",
  ],
};
