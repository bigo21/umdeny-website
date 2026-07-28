// Résolution des icônes du quiz vers le système d'icônes du site.
// data.ts ne contient que des noms (fichier .ts, sans JSX) ; c'est ici que
// chaque nom devient un composant.

import {
  Chart,
  Globe,
  Hands,
  Smartphone,
  Tag,
  Target,
  Tower,
} from "@/app/components/icons";
import { VERTICAL_ICONS } from "./data";
import type { VerticalKey } from "./types";

type IconComponent = (props: { size?: number; stroke?: number }) => React.JSX.Element;

const BY_NAME: Record<string, IconComponent> = {
  chart: Chart,
  target: Target,
  smartphone: Smartphone,
  tower: Tower,
  globe: Globe,
  hands: Hands,
  tag: Tag,
};

/** Icône d'une verticale, avec repli sur `tag` comme la version vanilla. */
export function VerticalIcon({ verticalKey, size = 18, stroke = 1.7 }: { verticalKey: VerticalKey; size?: number; stroke?: number }) {
  const Component = BY_NAME[VERTICAL_ICONS[verticalKey]] ?? Tag;
  return <Component size={size} stroke={stroke} />;
}
