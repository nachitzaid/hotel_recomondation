"use client"

import { Trophy } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import HotelCard from "./HotelCard"

interface Hotel {
  id: number
  name: string
  location: string
  price: number
  originalPrice?: number
  rating: number
  image: string
  amenities: string[]
  deal?: boolean
  worldCupVenue?: boolean
  distanceToStadium?: string
  country: string
  matchesHosted?: string[]
}

interface StadiumHotelsSectionProps {
  hotels: Hotel[]
  favorites: number[]
  activeTab: string
  onTabChange: (value: string) => void
  onToggleFavorite: (id: number) => void
  onViewDetails: (id: number) => void
}

export default function StadiumHotelsSection({
  hotels,
  favorites,
  activeTab,
  onTabChange,
  onToggleFavorite,
  onViewDetails,
}: StadiumHotelsSectionProps) {
  // Filter hotels based on active tab
  const filteredHotels =
    activeTab === "all" ? hotels : hotels.filter((hotel) => hotel.country.toLowerCase() === activeTab.toLowerCase())

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Trophy className="text-amber-500 mr-2 h-6 w-6" />
          <h2 className="text-2xl font-bold">Hôtels près des stades</h2>
        </div>

        <Tabs value={activeTab} onValueChange={onTabChange} className="w-auto">
          <TabsList>
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="espagne">Espagne 🇪🇸</TabsTrigger>
            <TabsTrigger value="portugal">Portugal 🇵🇹</TabsTrigger>
            <TabsTrigger value="maroc">Maroc 🇲🇦</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredHotels.map((hotel) => (
          <HotelCard
            key={hotel.id}
            hotel={hotel}
            isFavorite={favorites.includes(hotel.id)}
            onToggleFavorite={onToggleFavorite}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </section>
  )
}

