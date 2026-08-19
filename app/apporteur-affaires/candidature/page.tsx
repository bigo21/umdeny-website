import type { Metadata } from "next";
import { QuizApporteur } from "./QuizApporteur";

export const metadata: Metadata = {
  title: "Devenez apporteur d'affaires · Umdeny",
  description:
    "Vous avez un réseau ? Nous avons les opportunités. Soumettez votre candidature pour devenir apporteur d'affaires Umdeny.",
};

export default function ApporteurAffairesPage() {
  return <QuizApporteur />;
}
