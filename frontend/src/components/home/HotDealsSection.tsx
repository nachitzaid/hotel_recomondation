"use client"

import { Flame } from "lucide-react"
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

interface HotDealsSectionProps {
  hotDeals: Hotel[]
  favorites: number[]
  onToggleFavorite: (id: number) => void
  onViewDetails: (id: number) => void
}

export default function HotDealsSection({
  hotDeals,
  favorites,
  onToggleFavorite,
  onViewDetails,
}: HotDealsSectionProps) {
  return (
    <section className="mb-16">
      <div className="flex items-center mb-6">
        <Flame className="text-red-500 mr-2 h-6 w-6" />
        <h2 className="text-2xl font-bold">Offres spéciales Coupe du Monde</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotDeals.map((hotel) => (
          <HotelCard
            key={hotel.id}
            hotel={hotel}
            isFavorite={favorites.includes(hotel.id)}
            onToggleFavorite={onToggleFavorite}
            onViewDetails={onViewDetails}
            isDeal={true}
          />
        ))}
      </div>
    </section>
  )
}

