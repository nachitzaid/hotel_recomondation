"use client"

import { useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function AuthCheck({ 
  adminOnly = false,
  authRequired = false
}: { 
  adminOnly?: boolean
  authRequired?: boolean 
}) {
  const { isAuthenticated, isAdmin, isReady } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isReady) return

    // Admin-only routes check
    if (adminOnly && !isAdmin) {
      router.push("/login")
      return
    }

    // Auth-required routes check
    if (authRequired && !isAuthenticated) {
      router.push("/login")
      return
    }
  }, [isReady, isAuthenticated, isAdmin, adminOnly, authRequired, router])

  return null
}