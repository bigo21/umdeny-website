import { Chrome } from "@/app/components/chrome";

// Habillage commun aux pages du site vitrine : bandeau diaspora, header,
// pré-footer et footer. Les surfaces autonomes (quiz apporteur d'affaires,
// page de maintenance) vivent hors de ce groupe et n'en héritent pas.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <Chrome>{children}</Chrome>;
}
