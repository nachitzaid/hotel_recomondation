// components/client-layout.tsx
"use client"

import { useEffect, useState } from "react"
import { AuthProvider } from "@/contexts/auth-context" 
import LayoutProvider from "./layout-provider"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  // S'assurer que le montage initial est fait côté client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Pendant l'hydratation, montrer un écran de chargement
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  return (
    <AuthProvider>
      <LayoutProvider>{children}</LayoutProvider>
    </AuthProvider>
  )
}