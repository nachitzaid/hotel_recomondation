"use client"

import { useState } from "react"
import Link from "next/link"
import { LogIn, Heart, Trophy, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function GuestNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
              </ul>
            </nav>
            <Button variant="secondary" size="sm" className="bg-white text-red-700 hover:bg-red-50" asChild>
              <Link href="/login" className="flex items-center">
                <LogIn className="mr-2 h-4 w-4" />
                <span>Connexion</span>
              </Link>
            </Button>
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
              <li className="font-medium hover:text-blue-200 transition-colors px-4 py-2">
                <Link href="/stadiums">Stades</Link>
              </li>
              <li className="font-medium hover:text-blue-200 transition-colors px-4 py-2">
                <Link href="/packages">Forfaits</Link>
              </li>
              <li className="hover:text-blue-200 transition-colors flex items-center px-4 py-2">
                <Heart className="mr-1 h-4 w-4" />
                <Link href="/favorites">Favoris</Link>
              </li>
              <li className="px-4 py-2">
                <Button variant="secondary" size="sm" className="w-full bg-white text-red-700 hover:bg-red-50" asChild>
                  <Link href="/login" className="flex items-center justify-center">
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>Connexion</span>
                  </Link>
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </>
  )
}