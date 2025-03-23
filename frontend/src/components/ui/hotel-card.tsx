import type { Hotel } from "@/app/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Star, Calendar, Trophy, Bus } from "lucide-react"
import Link from "next/link"

interface HotelCardProps {
  hotel: Hotel
}

export function HotelCard({ hotel }: HotelCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 relative">
        <img
          src={hotel.image || "/placeholder.svg?height=200&width=300"}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        {hotel.world_cup_package && (
          <div className="absolute top-2 right-2 bg-[#8A1538] text-white px-2 py-1 rounded-md text-xs font-medium flex items-center">
            <Trophy className="h-3 w-3 mr-1" />
            Forfait Coupe du Monde
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="text-xl font-bold mb-1">{hotel.name}</h3>
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{hotel.location}</span>
        </div>
        <div className="flex items-center mb-3">
          <Star className="h-4 w-4 text-yellow-500 fill-current" />
          <span className="ml-1 font-medium">{hotel.rating}</span>
          <span className="text-sm text-gray-500 ml-1">(120 avis)</span>
        </div>

        {/* Fonctionnalités spéciales Coupe du Monde */}
        {(hotel.match_day_shuttle || hotel.fan_zone_nearby) && (
          <div className="flex flex-wrap gap-2 mb-3">
            {hotel.match_day_shuttle && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                <Bus className="h-3 w-3 mr-1" />
                Navette match
              </span>
            )}
            {hotel.fan_zone_nearby && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                <Trophy className="h-3 w-3 mr-1" />
                Fan zone à proximité
              </span>
            )}
          </div>
        )}

        <div className="flex justify-between items-center">
          <div>
            <span className="text-lg font-bold">{hotel.price}€</span>
            <span className="text-sm text-gray-500"> / nuit</span>
          </div>
          <Button asChild size="sm" className="bg-[#8A1538] hover:bg-[#6d102c]">
            <Link href={`/hotels/${hotel._id}`} className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              Réserver
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

