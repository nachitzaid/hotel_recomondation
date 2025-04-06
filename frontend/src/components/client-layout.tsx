// components/client-layout.tsx
"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import UserLayout from "@/components/layouts/user-layout"
import AdminLayout from "@/components/layouts/admin-layout"
import GuestLayout from "@/components/layouts/guest-layout"
import { usePathname } from "next/navigation"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  
  // Effet pour éviter l'hydratation côté serveur/client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Pendant le chargement ou avant le montage, afficher juste le contenu de base
  if (isLoading || !mounted) {
    return <>{children}</>
  }

  // Vérifier si c'est une page de login ou signup pour ne pas appliquer le GuestLayout
  const isAuthPage = pathname === '/login' || pathname === '/signup'
  
  // Une fois authentifié, décider quel layout utiliser
  if (isAuthenticated) {
    if (isAdmin) {
      return <AdminLayout>{children}</AdminLayout>
    } else {
      return <UserLayout>{children}</UserLayout>
    }
  }

  // Pour les utilisateurs non authentifiés
  if (isAuthPage) {
    // Pas de layout pour les pages d'authentification qui ont leur propre design
    return <>{children}</>
  } else {
    // Layout invité pour les autres pages
    return <GuestLayout>{children}</GuestLayout>
  }
}