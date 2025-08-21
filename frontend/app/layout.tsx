import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "../styles/globals.css"; // <-- path must be correct
import "../styles/animations.css"
import "../styles/components.css"
import { cn } from "@/lib/utils"
import ThemeLogger from "@/components/theme-logger"
import ChatBot from "@/components/chatbot"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://sba-compta-rgpd.com"),
  title: {
    default: "SBA Compta RGPD - Intelligence Artificielle pour la Conformité",
    template: "%s | SBA Compta RGPD",
  },
  description:
    "Solution révolutionnaire de gestion RGPD avec IA intégrée. Automatisez votre conformité, analysez vos risques et protégez vos données avec SBA Compta RGPD Intelligence.",
  keywords: [
    "RGPD",
    "conformité",
    "intelligence artificielle",
    "gestion des risques",
    "données personnelles",
    "SBA Compta",
    "automatisation",
    "sécurité",
    "DPO",
    "protection des données",
  ],
  authors: [{ name: "SBA Compta" }],
  creator: "SBA Compta",
  publisher: "SBA Compta",
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
    type: "website",
    locale: "fr_FR",
    url: "https://sba-compta-rgpd.com",
    title: "SBA Compta RGPD - Intelligence Artificielle pour la Conformité",
    description:
      "Solution révolutionnaire de gestion RGPD avec IA intégrée. Automatisez votre conformité avec SBA Compta RGPD Intelligence.",
    siteName: "SBA Compta RGPD",
    images: [
      {
        url: "/images/sba-logo.png",
        width: 1200,
        height: 630,
        alt: "SBA Compta RGPD - Intelligence Artificielle",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SBA Compta RGPD - Intelligence Artificielle pour la Conformité",
    description: "Solution révolutionnaire de gestion RGPD avec IA intégrée.",
    images: ["/images/sba-logo.png"],
    creator: "@sbacompta",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/images/sba-logo.png",
    shortcut: "/images/sba-logo.png",
    apple: "/images/sba-logo.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#a855f7" },
    { media: "(prefers-color-scheme: dark)", color: "#a855f7" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#a855f7" />
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable, jetbrainsMono.variable)}>
        <ThemeLogger />
        <div id="root">{children}</div>
        <div id="portal-root" />
        <ChatBot />
      </body>
    </html>
  )
}
