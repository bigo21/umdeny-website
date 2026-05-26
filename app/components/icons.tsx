import { SVGProps } from "react";

type IconProps = Omit<SVGProps<SVGSVGElement>, "stroke"> & { size?: number; stroke?: number };

const Icon = ({ children, size = 20, stroke = 1.5, ...rest }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...rest}
  >
    {children}
  </svg>
);

export const Arrow = (p: IconProps) => <Icon {...p}><path d="M5 12h14M13 5l7 7-7 7"/></Icon>;
export const Globe = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></Icon>;
export const Close = (p: IconProps) => <Icon {...p}><path d="M18 6L6 18M6 6l12 12"/></Icon>;
export const Menu = (p: IconProps) => <Icon {...p}><path d="M4 7h16M4 12h16M4 17h16"/></Icon>;
export const Search = (p: IconProps) => <Icon {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></Icon>;
export const Shield = (p: IconProps) => <Icon {...p}><path d="M12 3l8 3v5c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-3z"/></Icon>;
export const Network = (p: IconProps) => <Icon {...p}><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M8 6h8M7 8l4 8M17 8l-4 8"/></Icon>;
export const Loupe = (p: IconProps) => <Icon {...p}><circle cx="10" cy="10" r="6"/><path d="m20 20-5.5-5.5M10 7v6M7 10h6"/></Icon>;
export const Handshake = (p: IconProps) => <Icon {...p}><path d="M3 12l4-4 4 4 3-3 6 6"/><path d="M15 9l-3 3"/></Icon>;
export const Lock = (p: IconProps) => <Icon {...p}><rect x="5" y="11" width="14" height="10" rx="1"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></Icon>;
export const Doc = (p: IconProps) => <Icon {...p}><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/></Icon>;
export const Money = (p: IconProps) => <Icon {...p}><rect x="3" y="6" width="18" height="12" rx="1"/><circle cx="12" cy="12" r="2.5"/><path d="M6 9v6M18 9v6"/></Icon>;
export const Chart = (p: IconProps) => <Icon {...p}><path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 16V11M12 16V7M16 16v-4"/></Icon>;
export const Wave = (p: IconProps) => <Icon {...p}><path d="M3 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0"/></Icon>;
export const Gear = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/></Icon>;
export const Pin = (p: IconProps) => <Icon {...p}><path d="M12 21s-7-6-7-12a7 7 0 0 1 14 0c0 6-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></Icon>;
export const Phone = (p: IconProps) => <Icon {...p}><path d="M5 4h4l2 5-2 1a11 11 0 0 0 5 5l1-2 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></Icon>;
export const Mail = (p: IconProps) => <Icon {...p}><rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 7 9 6 9-6"/></Icon>;
export const Clock = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Icon>;
export const Target = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></Icon>;
export const Check = (p: IconProps) => <Icon {...p}><path d="M5 12l5 5L20 7"/></Icon>;
export const Briefcase = (p: IconProps) => <Icon {...p}><rect x="3" y="7" width="18" height="13" rx="1"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></Icon>;
export const Building = (p: IconProps) => <Icon {...p}><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 7h2M8 11h2M8 15h2M14 7h2M14 11h2M14 15h2"/></Icon>;
export const Truck = (p: IconProps) => <Icon {...p}><path d="M3 16V7h11v9"/><path d="M14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></Icon>;
export const Smartphone = (p: IconProps) => <Icon {...p}><rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/></Icon>;
export const Tower = (p: IconProps) => <Icon {...p}><path d="M12 8v13M8 21h8M5 7a6 6 0 0 1 14 0M8 9a3 3 0 0 1 8 0"/></Icon>;
export const Hands = (p: IconProps) => <Icon {...p}><path d="M5 13V7a2 2 0 0 1 4 0v6M9 11V5a2 2 0 0 1 4 0v8M13 9V6a2 2 0 0 1 4 0v9c0 4-3 6-6 6h-2c-2 0-4-1-4-3v-3"/></Icon>;
export const Bank = (p: IconProps) => <Icon {...p}><path d="M3 10l9-5 9 5v2H3z"/><path d="M5 12v6M9 12v6M15 12v6M19 12v6M4 20h16"/></Icon>;
export const Linkedin = (p: IconProps) => <Icon {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 11v6M8 8v.01M12 17v-6c0-1 1-2 2.5-2s2.5 1 2.5 2v6"/></Icon>;
export const Facebook = (p: IconProps) => <Icon {...p}><path d="M18 3h-3a4 4 0 0 0-4 4v3H8v4h3v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></Icon>;
export const Instagram = (p: IconProps) => <Icon {...p}><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></Icon>;
export const Youtube = (p: IconProps) => <Icon {...p}><rect x="3" y="6" width="18" height="12" rx="2"/><path d="m10 9 5 3-5 3z" fill="currentColor"/></Icon>;
export const Whatsapp = (p: IconProps) => <Icon {...p}><path d="M3 21l1.5-4A8 8 0 1 1 12 21H3z"/><path d="M9 9c0 3 3 6 6 6 .5 0 1 0 1.5-.5l.5-.5-2-1-1 1c-1 0-3-2-3-3l1-1-1-2-.5.5C9 9 9 9.5 9 9z"/></Icon>;
