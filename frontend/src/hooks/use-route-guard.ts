"use client"

import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from './use-auth'

export function useRouteGuard() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    // Attendre la fin du chargement
    if (isLoading) return

    // Routes publiques qui ne nécessitent pas d'authentification
    const publicRoutes = ['/login', '/signup', '/', '/hotels']

    // Routes qui nécessitent une authentification
    const authRoutes = ['/dashboard', '/reservations', '/favorites', '/profile']

    // Routes réservées aux administrateurs
    const adminRoutes = ['/admin', '/admin/users', '/admin/hotels', '/admin/reservations']

    // Vérifier les conditions de redirection

    // 1. Si l'utilisateur n'est pas connecté et tente d'accéder à une route protégée
    if (!user && !isPublicRoute() && !pathname.startsWith('/login') && !pathname.startsWith('/signup')) {
      console.log('Redirection vers login: utilisateur non authentifié tentant d\'accéder à une route protégée')
      router.push('/login')
      return
    }

    // 2. Si l'utilisateur est connecté mais n'est pas admin et tente d'accéder aux routes admin
    if (user && user.role !== 'admin' && isAdminRoute()) {
      console.log('Redirection vers accueil: utilisateur non-admin tentant d\'accéder à une route admin')
      router.push('/')
      return
    }

    // 3. Si l'utilisateur est connecté et tente d'accéder à login/signup
    if (user && (pathname === '/login' || pathname === '/signup')) {
      console.log('Redirection selon rôle: utilisateur authentifié tentant d\'accéder à login/signup')
      router.push(user.role === 'admin' ? '/admin' : '/')
      return
    }

    // Fonctions utilitaires pour vérifier les types de routes
    function isPublicRoute() {
      return publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))
    }

    function isAdminRoute() {
      return adminRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))
    }
  }, [pathname, user, isLoading, router])

  // Retourner un état indiquant si la redirection est en cours
  return { isRedirecting: isLoading }
}