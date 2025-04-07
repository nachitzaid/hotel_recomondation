"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { LogOut, Heart, Trophy, Menu, X, Hotel, User, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  // État pour la transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 50)
    
    return () => clearTimeout(timer)
  }, [])

  const handleLogout = async () => {
    try {
      // Désactiver la transition avec un court délai pour permettre
      // à l'animation de se produire avant la déconnexion
      setIsReady(false)
      
      // Court délai pour l'animation de fondu
      setTimeout(async () => {
        await logout()
        // La redirection est gérée dans la fonction logout
      }, 150)
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
      setIsReady(true) // Réactiver la transition en cas d'erreur
    }
  }

  return (
    <div className={`min-h-screen flex flex-col transition-opacity duration-300 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
      {/* Top navigation bar */}
      <div className="bg-gradient-to-r from-red-700 via-amber-600 to-green-700 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Trophy className="h-6 w-6 mr-2" />
            <h1 className="text-2xl font-bold tracking-tight">WorldCup Hotels</h1>
          </Link>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav>
              <ul className="flex space-x-6">
                <li className="font-medium hover:text-blue-200 transition-colors">
                  <Link href="/hotels">Hôtels</Link>
                </li>
                <li className="hover:text-blue-200 transition-colors flex items-center">
                  <Heart className="mr-1 h-4 w-4" />
                  <Link href="/favorites">Favoris</Link>
                </li>
                <li className="hover:text-blue-200 transition-colors flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  <Link href="/reservations">Réservations</Link>
                </li>
              </ul>
            </nav>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="text-sm">{user?.firstName || "Utilisateur"}</span>
              <Button variant="secondary" size="sm" className="bg-white text-red-700 hover:bg-red-50" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-red-800 text-white">
          <nav className="container mx-auto py-4">
            <ul className="space-y-4">
              <li className="font-medium hover:text-blue-200 transition-colors px-4 py-2">
                <Link href="/hotels">Hôtels</Link>
              </li>
              <li className="hover:text-blue-200 transition-colors flex items-center px-4 py-2">
                <Heart className="mr-1 h-4 w-4" />
                <Link href="/favorites">Favoris</Link>
              </li>
              <li className="hover:text-blue-200 transition-colors flex items-center px-4 py-2">
                <Calendar className="mr-1 h-4 w-4" />
                <Link href="/reservations">Réservations</Link>
              </li>
              <li className="px-4 py-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{user?.firstName || "Utilisateur"}</span>
                  </div>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="bg-white text-red-700 hover:bg-red-50" 
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </Button>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-4 md:mb-0">
              <Link href="/" className="flex items-center">
                <Trophy className="h-6 w-6 mr-2" />
                <span className="font-bold">WorldCup Hotels</span>
              </Link>
              <p className="mt-2 text-sm text-gray-400">Les meilleurs hôtels pour la Coupe du Monde 2030</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-semibold mb-2">Liens utiles</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link href="/about">À propos</Link></li>
                  <li><Link href="/contact">Contact</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold mb-2">Légal</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link href="/terms">Conditions</Link></li>
                  <li><Link href="/privacy">Confidentialité</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t border-gray-700 text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} WorldCup Hotels. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  )
}