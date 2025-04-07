"use client"

import React, { useState } from "react"
import Link from "next/link"
import { LogOut, User, Calendar, Heart, Home, Menu, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function UserLayoutClient({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
            <Home className="h-6 w-6" />
            <span>WorldCup Hotels</span>
          </Link>
          
          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/hotels" className="hover:text-amber-200 transition-colors">
              Rechercher
            </Link>
            <Link href="/bookings" className="flex items-center hover:text-amber-200 transition-colors">
              <Calendar className="mr-1 h-4 w-4" />
              <span>Mes réservations</span>
            </Link>
            <Link href="/favorites" className="flex items-center hover:text-amber-200 transition-colors">
              <Heart className="mr-1 h-4 w-4" />
              <span>Favoris</span>
            </Link>
            <div className="border-l border-amber-400 h-6 mx-2"></div>
            <Link href="/profile" className="flex items-center hover:text-amber-200 transition-colors">
              <User className="mr-1 h-4 w-4" />
              <span>Mon profil</span>
            </Link>
            <Button variant="secondary" size="sm" className="bg-white text-amber-600 hover:bg-amber-50" asChild>
              <Link href="/logout" className="flex items-center">
                <LogOut className="mr-1 h-4 w-4" />
                <span>Déconnexion</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-amber-700 text-white">
          <nav className="container mx-auto py-4">
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/hotels" 
                  className="flex items-center px-4 py-2 hover:bg-amber-600 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Search className="mr-2 h-4 w-4" />
                  <span>Rechercher</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/bookings" 
                  className="flex items-center px-4 py-2 hover:bg-amber-600 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Mes réservations</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/favorites" 
                  className="flex items-center px-4 py-2 hover:bg-amber-600 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  <span>Favoris</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/profile" 
                  className="flex items-center px-4 py-2 hover:bg-amber-600 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Mon profil</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/logout" 
                  className="flex items-center px-4 py-2 bg-white text-amber-600 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
      
      {/* Main content */}
      <main className="flex-1 container mx-auto p-4 md:p-6">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-4 md:mb-0">
              <Link href="/" className="flex items-center">
                <Home className="h-6 w-6 mr-2" />
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