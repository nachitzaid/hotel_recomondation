"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, MapPin, Calendar, User, LogIn, Heart, Trophy, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HotelDashboardHeaderProps {
  onSearch: (searchParams: any) => void
}

const HotelDashboardHeader = ({ onSearch }: HotelDashboardHeaderProps) => {
  const [destination, setDestination] = useState("")
  const [dates, setDates] = useState("")
  const [guests, setGuests] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSearchClick = () => {
    onSearch({ destination, dates, guests })
  }

  return (
    <header className="w-full">
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
                <li className="font-medium hover:text-blue-200 transition-colors">
                  <Link href="/stadiums">Stades</Link>
                </li>
                <li className="font-medium hover:text-blue-200 transition-colors">
                  <Link href="/packages">Forfaits</Link>
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

      {/* Hero section with background image */}
      <div
        className="relative bg-cover bg-center h-80"
        style={{
          backgroundImage: "url('/placeholder.svg?height=400&width=1200&text=World+Cup+2030')",
          backgroundPosition: "center 30%",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30"></div>
        <div className="relative container mx-auto h-full flex flex-col justify-center items-center text-white px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Trouvez votre hébergement pour la Coupe du Monde
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-center max-w-3xl">
            Espagne · Portugal · Maroc · Juin-Juillet 2030
          </p>
        </div>
      </div>

      {/* Search bar */}
      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-white rounded-xl shadow-2xl p-6">
          <div className="flex flex-wrap gap-3 md:flex-nowrap">
            <div className="flex items-center w-full md:w-1/3 border rounded-lg p-3 bg-gray-50 hover:bg-white hover:border-blue-300 transition-colors">
              <MapPin className="text-blue-500 mr-2" />
              <input
                type="text"
                placeholder="Ville ou stade"
                className="w-full outline-none bg-transparent"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            <div className="flex items-center w-full md:w-1/3 border rounded-lg p-3 bg-gray-50 hover:bg-white hover:border-blue-300 transition-colors">
              <Calendar className="text-blue-500 mr-2" />
              <input
                type="text"
                placeholder="Dates du séjour"
                className="w-full outline-none bg-transparent"
                value={dates}
                onChange={(e) => setDates(e.target.value)}
              />
            </div>
            <div className="flex items-center w-full md:w-1/4 border rounded-lg p-3 bg-gray-50 hover:bg-white hover:border-blue-300 transition-colors">
              <User className="text-blue-500 mr-2" />
              <input
                type="text"
                placeholder="Nombre de voyageurs"
                className="w-full outline-none bg-transparent"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              />
            </div>
            <Button className="w-full md:w-1/6" onClick={handleSearchClick}>
              <Search className="mr-2" size={20} />
              <span>Rechercher</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default HotelDashboardHeader

