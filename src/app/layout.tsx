import type { Metadata } from "next";
import "./globals.css";
import { COMPANY } from "@/lib/content";

export const metadata: Metadata = {
  title: {
    default: `${COMPANY.name} — Photography & Media Production, Kigali`,
    template: `%s | ${COMPANY.name}`,
  },
  description:
    "Legacy Studio is a creative photography and media production company in Kigali, Rwanda. Weddings, portraits, events, maternity and commercial shoots.",
  keywords: [
    "photography Rwanda",
    "Kigali photographer",
    "wedding photography Kigali",
    "Legacy Studio",
    "videography Rwanda",
  ],
  openGraph: {
    title: `${COMPANY.name} — Photography & Media Production`,
    description: "Capturing moments, creating timeless visual art. Based in Kigali, Rwanda.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
