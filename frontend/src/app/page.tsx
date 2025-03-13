"use client"

import { useState } from "react"
import { useSearchParams, usePathname } from "next/navigation"
import HotelDashboardHeader from "./HotelDashboardHeader"
import { Star, MapPin, Wifi, Coffee, Tv, Bath, Heart, Clock, TrendingUp, Search, Flame } from "lucide-react"

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
}

interface PopularSearch {
  id: number
  term: string
  count: number
}

export default function HomePage() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [favorites, setFavorites] = useState<number[]>([])

  const handleSearch = (searchParams: any) => {
    const queryString = new URLSearchParams(searchParams).toString()
    window.location.href = `${pathname}?${queryString}`
  }

  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((hotelId) => hotelId !== id))
    } else {
      setFavorites([...favorites, id])
    }
  }

  // Sample hotel data
  const hotels: Hotel[] = [
    {
      id: 1,
      name: "Grand Hôtel Paris",
      location: "Paris, France",
      price: 199,
      rating: 4.7,
      image: "/placeholder.svg?height=200&width=300",
      amenities: ["Wifi", "Breakfast", "TV", "Spa"],
    },
    {
      id: 2,
      name: "Seaside Resort",
      location: "Nice, France",
      price: 249,
      rating: 4.9,
      image: "/placeholder.svg?height=200&width=300",
      amenities: ["Wifi", "Pool", "Breakfast", "Beach Access"],
    },
    {
      id: 3,
      name: "Mountain Lodge",
      location: "Chamonix, France",
      price: 179,
      rating: 4.5,
      image: "/placeholder.svg?height=200&width=300",
      amenities: ["Wifi", "Breakfast", "Fireplace", "Hiking Trails"],
    },
    {
      id: 4,
      name: "City Center Hotel",
      location: "Lyon, France",
      price: 159,
      rating: 4.3,
      image: "/placeholder.svg?height=200&width=300",
      amenities: ["Wifi", "Breakfast", "TV", "Gym"],
    },
  ]

  // Hot deals data
  const hotDeals: Hotel[] = [
    {
      id: 5,
      name: "Luxury Palace Hotel",
      location: "Cannes, France",
      price: 189,
      originalPrice: 299,
      rating: 4.8,
      image: "/placeholder.svg?height=200&width=300",
      amenities: ["Wifi", "Pool", "Spa", "Restaurant"],
      deal: true,
    },
    {
      id: 6,
      name: "Riverside Boutique Hotel",
      location: "Bordeaux, France",
      price: 129,
      originalPrice: 199,
      rating: 4.6,
      image: "/placeholder.svg?height=200&width=300",
      amenities: ["Wifi", "Breakfast", "River View", "Bar"],
      deal: true,
    },
    {
      id: 7,
      name: "Historic Center Inn",
      location: "Strasbourg, France",
      price: 109,
      originalPrice: 159,
      rating: 4.4,
      image: "/placeholder.svg?height=200&width=300",
      amenities: ["Wifi", "Breakfast", "Historic Building"],
      deal: true,
    },
  ]

  // Best booking times
  const bookingTimes = [
    {
      id: 1,
      destination: "Paris",
      bestMonth: "Septembre",
      savingsPercent: 23,
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      id: 2,
      destination: "Côte d'Azur",
      bestMonth: "Mai",
      savingsPercent: 31,
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      id: 3,
      destination: "Alpes Françaises",
      bestMonth: "Juin",
      savingsPercent: 28,
      image: "/placeholder.svg?height=150&width=200",
    },
  ]

  // Popular searches
  const popularSearches: PopularSearch[] = [
    { id: 1, term: "Paris", count: 12500 },
    { id: 2, term: "Nice", count: 8700 },
    { id: 3, term: "Marseille", count: 7300 },
    { id: 4, term: "Lyon", count: 6800 },
    { id: 5, term: "Bordeaux", count: 5900 },
    { id: 6, term: "Strasbourg", count: 4200 },
  ]

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
      default:
        return null
    }
  }

  const calculateDiscount = (original?: number, current?: number) => {
    if (!original || !current) return 0
    return Math.round(((original - current) / original) * 100)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HotelDashboardHeader onSearch={handleSearch} />

      <main className="container mx-auto py-16 px-4">
        {/* Hot Hotel Deals */}
        <section className="mb-16">
          <div className="flex items-center mb-6">
            <Flame className="text-red-500 mr-2 h-6 w-6" />
            <h2 className="text-2xl font-bold">Hot hotel deals right now</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotDeals.map((hotel) => (
              <div
                key={hotel.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="relative">
                  <img src={hotel.image || "/placeholder.svg"} alt={hotel.name} className="w-full h-48 object-cover" />
                  {hotel.deal && hotel.originalPrice && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
                      -{calculateDiscount(hotel.originalPrice, hotel.price)}%
                    </div>
                  )}
                  <button
                    onClick={() => toggleFavorite(hotel.id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md"
                  >
                    <Heart
                      className={`h-5 w-5 ${favorites.includes(hotel.id) ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                    />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg">{hotel.name}</h3>
                    <div className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      <Star className="h-4 w-4 fill-blue-800 mr-1" />
                      {hotel.rating}
                    </div>
                  </div>
                  <div className="flex items-center text-gray-500 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {hotel.location}
                  </div>
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
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-lg text-red-600">{hotel.price}€</span>
                      {hotel.originalPrice && (
                        <span className="text-gray-500 text-sm line-through ml-2">{hotel.originalPrice}€</span>
                      )}
                      <span className="text-gray-500 text-sm block"> / nuit</span>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                      Réserver
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Best Time to Book */}
        <section className="mb-16 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
          <div className="flex items-center mb-6">
            <Clock className="text-blue-600 mr-2 h-6 w-6" />
            <h2 className="text-2xl font-bold">Discover the best time to book your next stay</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bookingTimes.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.destination}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg">{item.destination}</h3>
                  <div className="flex items-center mt-2 text-gray-700">
                    <span className="font-medium">Meilleur mois: </span>
                    <span className="ml-2">{item.bestMonth}</span>
                  </div>
                  <div className="mt-3 bg-green-100 text-green-800 px-3 py-2 rounded-md flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <span>Économisez jusqu'à {item.savingsPercent}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Searches */}
        <section className="mb-16">
          <div className="flex items-center mb-6">
            <Search className="text-purple-600 mr-2 h-6 w-6" />
            <h2 className="text-2xl font-bold">Popular searches</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {popularSearches.map((search) => (
              <button
                key={search.id}
                className="bg-white border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors rounded-full px-4 py-2 flex items-center"
              >
                <span className="font-medium">{search.term}</span>
                <span className="ml-2 text-xs text-gray-500">({search.count.toLocaleString()})</span>
              </button>
            ))}
          </div>
        </section>

        {/* Popular Destinations */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Destinations populaires</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {hotels.map((hotel) => (
              <div
                key={hotel.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <img src={hotel.image || "/placeholder.svg"} alt={hotel.name} className="w-full h-48 object-cover" />
                  <button
                    onClick={() => toggleFavorite(hotel.id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md"
                  >
                    <Heart
                      className={`h-5 w-5 ${favorites.includes(hotel.id) ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                    />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg">{hotel.name}</h3>
                    <div className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      <Star className="h-4 w-4 fill-blue-800 mr-1" />
                      {hotel.rating}
                    </div>
                  </div>
                  <div className="flex items-center text-gray-500 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {hotel.location}
                  </div>
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
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-lg">{hotel.price}€</span>
                      <span className="text-gray-500 text-sm"> / nuit</span>
                    </div>
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm transition-colors">
                      Réserver
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-10 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">TravelBook</h3>
              <p className="text-gray-300">Trouvez les meilleures offres d'hôtels partout dans le monde.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Liens Rapides</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Accueil
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Hôtels
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Favorites
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Mon Compte
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Destinations Populaires</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Paris
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Nice
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Lyon
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Marseille
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Email: contact@travelbook.com</li>
                <li>Téléphone: +33 1 23 45 67 89</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} TravelBook. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

