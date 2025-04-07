"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import AdminLayout from "@/app/admin/layout"
import UserLayout from "@/app/users/layout"
import GuestLayout from "@/app/guest/layout"
import { useAuth } from "@/hooks/use-auth"

interface LayoutProviderProps {
  children: React.ReactNode
}

export default function LayoutProvider({ children }: LayoutProviderProps) {
  const pathname = usePathname()
  const { user, isLoading, isReady, isAuthenticated, isAdmin } = useAuth()
  const [currentLayout, setCurrentLayout] = useState<"admin" | "user" | "guest" | "none">("none")

  // Liste des pages d'authentification
  const authPages = [
    '/login', 
    '/signup', 
    '/reset-password',
    '/forgot-password'
  ]

  // Déterminer le layout à utiliser
  useEffect(() => {
    if (!isReady) return

    // Vérifier si c'est une page d'authentification
    const isAuthPage = authPages.includes(pathname)
    
    if (isAuthenticated) {
      // Priorité à l'admin si connecté en tant qu'admin
      setCurrentLayout(isAdmin ? "admin" : "user")
    } else {
      // Pas de layout pour les pages d'auth, guest layout pour les autres pages
      setCurrentLayout(isAuthPage ? "none" : "guest")
    }

    console.log("Layout mis à jour:", 
      isAdmin ? "admin" : 
      (isAuthenticated ? "user" : 
      (isAuthPage ? "none" : "guest"))
    )
  }, [isReady, isAuthenticated, isAdmin, pathname])

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
    case "admin":
      return <AdminLayout>{children}</AdminLayout>
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