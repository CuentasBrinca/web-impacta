import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

/**
 * FH Lecturis — display typeface (paid, self-hosted).
 * BLOCKER pre-launch: confirm web license is in place.
 */
const fhLecturis = localFont({
  variable: "--font-fh-lecturis",
  display: "swap",
  src: [
    { path: "./fonts/FHLecturis-Light.otf",   weight: "300", style: "normal" },
    { path: "./fonts/FHLecturis-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/FHLecturis-Bold.otf",    weight: "700", style: "normal" },
  ],
});

const fhLecturisRounded = localFont({
  variable: "--font-fh-lecturis-rounded",
  display: "swap",
  src: [
    { path: "./fonts/FHLecturisRounded-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/FHLecturisRounded-Bold.otf",    weight: "700", style: "normal" },
  ],
});

const googleSansFlex = localFont({
  variable: "--font-google-sans-flex",
  display: "swap",
  src: [
    { path: "./fonts/GoogleSansFlex-Light.ttf",    weight: "300", style: "normal" },
    { path: "./fonts/GoogleSansFlex-Regular.ttf",  weight: "400", style: "normal" },
    { path: "./fonts/GoogleSansFlex-Medium.ttf",   weight: "500", style: "normal" },
    { path: "./fonts/GoogleSansFlex-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/GoogleSansFlex-Bold.ttf",     weight: "700", style: "normal" },
    { path: "./fonts/GoogleSansFlex-Black.ttf",    weight: "900", style: "normal" },
  ],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://impactaia.cl";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Impacta IA · La conferencia de IA para quienes toman decisiones",
  description:
    "Primera conferencia de inteligencia artificial para ejecutivos C-suite en Chile. Santiago, septiembre 2026. 400 cupos.",
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: SITE_URL,
    siteName: "Impacta IA Chile",
    title: "Impacta IA · La conferencia de IA para quienes toman decisiones",
    description:
      "Primera conferencia de IA para ejecutivos C-suite en Chile. Santiago, septiembre 2026. 400 cupos curados.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Impacta IA · Santiago · Septiembre 2026",
    description: "La conferencia de IA para quienes toman decisiones.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es-CL"
      className={`${fhLecturis.variable} ${fhLecturisRounded.variable} ${googleSansFlex.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
