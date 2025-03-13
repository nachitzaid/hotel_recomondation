"use client"

import type React from "react"
import { useState } from "react"
import { Search, MapPin, Calendar, User, LogIn, Heart } from "lucide-react"

interface HotelDashboardHeaderProps {
  onSearch: (searchParams: any) => void
}

const HotelDashboardHeader: React.FC<HotelDashboardHeaderProps> = ({ onSearch }) => {
  const [destination, setDestination] = useState("")
  const [dates, setDates] = useState("")
  const [guests, setGuests] = useState("")

  const handleSearchClick = () => {
    onSearch({ destination, dates, guests })
  }

  return (
    <header className="w-full">
      {/* Top navigation bar */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">TravelBook</h1>
          <div className="flex items-center space-x-6">
            <nav>
              <ul className="flex space-x-6">
                <li className="font-medium hover:text-blue-200 transition-colors">Hôtels</li>
                <li className="hover:text-blue-200 transition-colors flex items-center">
                  <Heart className="mr-1 h-4 w-4" />
                  Favorites
                </li>
              </ul>
            </nav>
            <button className="flex items-center bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-md transition-colors font-medium">
              <LogIn className="mr-2 h-4 w-4" />
              <span>Login</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero section with background image */}
      <div
        className="relative bg-cover bg-center h-80"
        style={{ backgroundImage: "url('/placeholder.svg?height=400&width=1200')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative container mx-auto h-full flex flex-col justify-center items-center text-white px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">Trouvez l'hôtel parfait pour votre voyage</h2>
          <p className="text-xl md:text-2xl mb-8 text-center max-w-3xl">
            Comparez les prix et trouvez les meilleures offres pour votre prochain séjour
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
                placeholder="Où souhaitez-vous aller?"
                className="w-full outline-none bg-transparent"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            <div className="flex items-center w-full md:w-1/3 border rounded-lg p-3 bg-gray-50 hover:bg-white hover:border-blue-300 transition-colors">
              <Calendar className="text-blue-500 mr-2" />
              <input
                type="text"
                placeholder="03/12/2025 - 10/12/2025"
                className="w-full outline-none bg-transparent"
                value={dates}
                onChange={(e) => setDates(e.target.value)}
              />
            </div>
            <div className="flex items-center w-full md:w-1/4 border rounded-lg p-3 bg-gray-50 hover:bg-white hover:border-blue-300 transition-colors">
              <User className="text-blue-500 mr-2" />
              <input
                type="text"
                placeholder="2 adultes, 0 enfant"
                className="w-full outline-none bg-transparent"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              />
            </div>
            <button
              className="w-full md:w-1/6 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors font-medium"
              onClick={handleSearchClick}
            >
              <Search className="mr-2" size={20} />
              <span>Rechercher</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default HotelDashboardHeader

