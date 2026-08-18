import type { Metadata } from "next";
import { Webinaire } from "./Webinaire";

export const metadata: Metadata = {
  title: "Webinaire apporteurs d'affaires · Umdeny Capital",
  description:
    "Umdeny Capital ouvre son programme d'apporteurs d'affaires. Inscrivez-vous au webinaire de présentation pour découvrir l'opportunité en direct.",
};

export default function WebinairePage() {
  return <Webinaire />;
}
