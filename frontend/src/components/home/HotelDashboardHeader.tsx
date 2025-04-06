// components/HotelDashboardHeader.tsx
"use client"

import { useState } from "react"
import { Search, MapPin, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HotelDashboardHeaderProps {
  onSearch: (searchParams: any) => void
}

const HotelDashboardHeader = ({ onSearch }: HotelDashboardHeaderProps) => {
  const [destination, setDestination] = useState("")
  const [dates, setDates] = useState("")
  const [guests, setGuests] = useState("")

  const handleSearchClick = () => {
    onSearch({ destination, dates, guests })
  }

  return (
    <div>
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
    </div>
  )
}

export default HotelDashboardHeader