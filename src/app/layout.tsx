import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

import { getCurrentYearSEO } from "@/lib/date";
import StructuredData from "@/components/seo/StructuredData";
import AttributionTracker from "@/components/AttributionTracker";

export const metadata: Metadata = {
  title: {
    template: `%s | Urgence Couverture ${getCurrentYearSEO()}`,
    default: `Urgence Couverture - Fuites Toiture & Devis Couvreur RGE ${getCurrentYearSEO()}`,
  },
  description: "Urgence fuite de toiture, travaux de couverture et réparation de toit. Devis gratuit sous 24h avec des artisans couvreurs RGE.",
  metadataBase: new URL("https://urgencecouverture.com"),
  alternates: {
    canonical: "https://urgencecouverture.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Urgence Couverture - Fuites Toiture & Couvreurs RGE",
    description: "Dépannage fuite de toiture et réfection de couverture de toit. Devis gratuit sous 24h avec des professionnels certifiés.",
    siteName: "Urgence Couverture",
    locale: "fr_FR",
    type: "website",
    url: "https://urgencecouverture.com",
    images: [
      {
        url: "https://urgencecouverture.com/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Urgence Couverture - Travaux de toiture et dépannage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Urgence Couverture - Dépannage Toiture & Couvreur RGE",
    description: "Dépannage fuite de toiture et réfection de couverture de toit. Devis gratuit.",
    images: ["https://urgencecouverture.com/images/og-image.png"],
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.png",
    apple: "/icon.png",
    other: [
      {
        rel: "icon",
        url: "/favicon.ico",
      }
    ]
  },
};

export const viewport: Viewport = {
  themeColor: "#ea580c",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-WFKLMZMF');`,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-neutral-900 text-neutral-50`}
      >
        <StructuredData />
        <AttributionTracker />
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WFKLMZMF"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {children}
      </body>
    </html>
  );
}
