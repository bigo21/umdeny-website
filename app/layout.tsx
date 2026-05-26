import type { Metadata } from "next";
import { Inter, Roboto_Condensed, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Chrome } from "./components/chrome";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const robotoCondensed = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Umdeny Capital — From Patrimony to Legacy",
  description:
    "Développez, sécurisez et transmettez votre patrimoine en Afrique. Umdeny Capital accompagne particuliers et entrepreneurs dans la construction d'un patrimoine durable depuis 2019.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${robotoCondensed.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <Chrome>{children}</Chrome>
      </body>
    </html>
  );
}
