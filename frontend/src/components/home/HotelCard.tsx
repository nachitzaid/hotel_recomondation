"use client"
import Image from "next/image"
import { Star, MapPin, Heart, Trophy, Wifi, Coffee, Tv, Bath, Flag, Plane, Ticket, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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

interface HotelCardProps {
  hotel: Hotel
  isFavorite: boolean
  onToggleFavorite: (id: number) => void
  onViewDetails: (id: number) => void
  isDeal?: boolean
}

export default function HotelCard({
  hotel,
  isFavorite,
  onToggleFavorite,
  onViewDetails,
  isDeal = false,
}: HotelCardProps) {
  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <Wifi className="h-4 w-4" />
      case "breakfast":
        return <Coffee className="h-4 w-4" />
      case "tv":
        return <Tv className="h-4 w-4" />
      case "spa":
      case "pool":
        return <Bath className="h-4 w-4" />
      case "stadium view":
      case "stadium views":
        return <Trophy className="h-4 w-4" />
      case "fan zone":
        return <Flag className="h-4 w-4" />
      case "shuttle":
        return <Plane className="h-4 w-4" />
      case "match tickets":
      case "match day package":
        return <Ticket className="h-4 w-4" />
      case "sports bar":
      case "stadium tours":
        return <Users className="h-4 w-4" />
      default:
        return null
    }
  }

  const calculateDiscount = (original?: number, current?: number) => {
    if (!original || !current) return 0
    return Math.round(((original - current) / original) * 100)
  }

  const getCountryFlag = (country: string): string => {
    switch (country.toLowerCase()) {
      case "espagne":
        return "🇪🇸"
      case "portugal":
        return "🇵🇹"
      case "maroc":
        return "🇲🇦"
      case "france":
        return "🇫🇷"
      default:
        return "🏳️"
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-0">
      <div className="relative">
        <div className="h-48 w-full bg-gray-200">
          <Image src={hotel.image || "/placeholder.svg"} alt={hotel.name} fill className="object-cover" />
        </div>
        {hotel.deal && hotel.originalPrice && (
          <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
            -{calculateDiscount(hotel.originalPrice, hotel.price)}%
          </Badge>
        )}
        {hotel.worldCupVenue && (
          <Badge className="absolute top-2 left-16 bg-blue-600 hover:bg-blue-700 flex items-center">
            <Trophy className="h-3 w-3 mr-1" /> Stade Coupe du Monde
          </Badge>
        )}
        <button
          onClick={() => onToggleFavorite(hotel.id)}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md"
        >
          <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
        </button>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg">{hotel.name}</h3>
            <div className="flex items-center text-gray-500 mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{hotel.location}</span>
              <span className="ml-1">{getCountryFlag(hotel.country)}</span>
            </div>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 flex items-center">
            <Star className="h-4 w-4 fill-blue-700 mr-1" />
            {hotel.rating}
          </Badge>
        </div>

        {hotel.distanceToStadium && (
          <div className="flex items-center text-green-600 mt-2 text-sm font-medium">
            <Trophy className="h-3 w-3 mr-1" />À {hotel.distanceToStadium} du stade
          </div>
        )}

        {hotel.matchesHosted && hotel.matchesHosted.length > 0 && (
          <div className="mt-2 text-sm">
            <span className="font-medium text-blue-700">Matchs à proximité:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {hotel.matchesHosted.map((match, idx) => (
                <Badge key={idx} variant="outline" className="bg-blue-50 text-xs">
                  {match}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-3">
          {hotel.amenities.slice(0, 3).map((amenity, index) => (
            <div key={index} className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
              {getAmenityIcon(amenity)}
              <span className="ml-1">{amenity}</span>
            </div>
          ))}
          {hotel.amenities.length > 3 && (
            <div className="text-xs bg-gray-100 px-2 py-1 rounded">+{hotel.amenities.length - 3}</div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div>
          <span className={`font-bold text-lg ${isDeal ? "text-red-600" : ""}`}>{hotel.price}€</span>
          {hotel.originalPrice && (
            <span className="text-gray-500 text-sm line-through ml-2">{hotel.originalPrice}€</span>
          )}
          <span className="text-gray-500 text-sm block"> / nuit</span>
        </div>
        <Button
          onClick={() => onViewDetails(hotel.id)}
          className={isDeal ? "bg-blue-600 hover:bg-blue-700" : "bg-green-500 hover:bg-green-600"}
        >
          {isDeal ? "Détails" : "À propos"}
        </Button>
      </CardFooter>
    </Card>
  )
}

