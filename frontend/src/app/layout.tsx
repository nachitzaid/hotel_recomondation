import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import ClientLayout from "@/components/client-layout"

// Configuration des polices Google Fonts
const geistSans = Geist({
  variable: "--font-geist-sans", // Utilisable via des classes CSS
  subsets: ["latin"], // Support des caractères latins
  display: 'swap', // Optimisation du chargement
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono", // Utilisable via des classes CSS
  subsets: ["latin"], // Support des caractères latins
  display: 'swap', // Optimisation du chargement
})

// Métadonnées de base pour le site
export const metadata: Metadata = {
  title: {
    default: "WorldCup Hotels", // Titre par défaut
    template: "%s | WorldCup Hotels" // Permet des titres dynamiques par page
  },
  description: "Réservez les meilleurs hôtels pour la Coupe du Monde 2030",
  keywords: ["hôtels", "réservation", "coupe du monde", "voyage"],
  authors: [{ name: "WorldCup Hotels Team" }],
  openGraph: {
    title: "WorldCup Hotels",
    description: "Réservez les meilleurs hôtels pour la Coupe du Monde",
    type: "website",
    locale: "fr_FR",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: "width=device-width, initial-scale=1"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="fr" 
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="antialiased bg-white text-black dark:bg-black dark:text-white">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}