"use client"

import { useState } from "react"
import Link from "next/link"
import { LogOut, Heart, Trophy, Menu, X, Hotel, User, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export default function UserNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      // La redirection est gérée dans la fonction logout
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    }
  }

  return (
    <>
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

      {/* Footer - laissez à l'extérieur car il est géré par le layout */}
    </>
  )
}