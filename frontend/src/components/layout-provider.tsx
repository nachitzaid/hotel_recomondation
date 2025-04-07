"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

// Import layouts
import AdminLayout from "@/app/admin/layout"
import UserLayout from "@/app/users/layout"
import GuestLayout from "@/app/guest/layout"

interface LayoutProviderProps {
  children: React.ReactNode
}

export default function LayoutProvider({ children }: LayoutProviderProps) {
  const pathname = usePathname()
  const { user, isLoading, isReady, isAuthenticated, isAdmin } = useAuth()
  const [currentLayout, setCurrentLayout] = useState<"admin" | "user" | "guest" | "none">("none")

  // Liste des pages d'authentification et autres pages spéciales qui ne nécessitent pas de layout
  const noLayoutPages = ["/login", "/signup", "/reset-password", "/forgot-password"]

  // Déterminer le layout à utiliser
  useEffect(() => {
    if (!isReady) return

    // Vérifier si c'est une page qui ne nécessite pas de layout
    const isNoLayoutPage = noLayoutPages.some((page) => pathname === page || pathname.startsWith(page + "/"))

    // Vérifier si c'est une page admin
    const isAdminPage = pathname.startsWith("/admin")

    // Logique de sélection du layout
    if (isNoLayoutPage) {
      // Pas de layout pour les pages d'authentification
      setCurrentLayout("none")
    } else if (isAdminPage) {
      // Pages admin - vérifier si l'utilisateur est admin
      if (isAuthenticated && isAdmin) {
        setCurrentLayout("admin")
      } else {
        // Redirection gérée par les composants de protection de route
        setCurrentLayout("none")
      }
    } else if (isAuthenticated) {
      // Utilisateur connecté mais pas sur une page admin
      setCurrentLayout("user")
    } else {
      // Utilisateur non connecté et pas sur une page d'authentification
      setCurrentLayout("guest")
    }

    console.log("Layout mis à jour:", currentLayout, "pour le chemin:", pathname)
  }, [isReady, isAuthenticated, isAdmin, pathname, currentLayout])

  // Pendant le chargement initial, afficher un loader
  if (isLoading || !isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  // Afficher le layout approprié
  switch (currentLayout) {
    case "user":
      return <UserLayout>{children}</UserLayout>
    case "guest":
      return <GuestLayout>{children}</GuestLayout>
    case "none":
      return <>{children}</>
    default:
      return <>{children}</>
  }
}

