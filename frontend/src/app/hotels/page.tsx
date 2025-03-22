"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, MapPin, Star, Calendar, User } from "lucide-react"

// Types
interface Hotel {
  id: number
  name: string
  location: string
  description: string
  price: number
  rating: number
  image: string
  amenities: string[]
  available: boolean
}

// Données simulées pour les hôtels
const hotels: Hotel[] = [
  {
    id: 1,
    name: "Grand Hôtel Paris",
    location: "Paris, France",
    description: "Un hôtel luxueux au cœur de Paris, à proximité des Champs-Élysées et de la Tour Eiffel.",
    price: 199,
    rating: 4.7,
    image: "/placeholder.svg?height=200&width=300",
    amenities: ["Wifi", "Piscine", "Spa", "Restaurant", "Salle de sport"],
    available: true,
  },
  {
    id: 2,
    name: "Seaside Resort",
    location: "Nice, France",
    description: "Profitez d'une vue imprenable sur la Méditerranée dans ce resort en bord de mer.",
    price: 249,
    rating: 4.9,
    image: "/placeholder.svg?height=200&width=300",
    amenities: ["Wifi", "Piscine", "Plage privée", "Restaurant", "Bar"],
    available: true,
  },
  {
    id: 3,
    name: "Mountain Lodge",
    location: "Chamonix, France",
    description: "Un chalet confortable dans les Alpes françaises, parfait pour les amateurs de ski.",
    price: 179,
    rating: 4.5,
    image: "/placeholder.svg?height=200&width=300",
    amenities: ["Wifi", "Cheminée", "Sauna", "Restaurant", "Navette ski"],
    available: true,
  },
  {
    id: 4,
    name: "City Center Hotel",
    location: "Lyon, France",
    description: "Idéalement situé au centre-ville de Lyon, proche des restaurants et attractions touristiques.",
    price: 159,
    rating: 4.3,
    image: "/placeholder.svg?height=200&width=300",
    amenities: ["Wifi", "Restaurant", "Bar", "Salle de conférence", "Parking"],
    available: false,
  },
  {
    id: 5,
    name: "Riverside Boutique",
    location: "Bordeaux, France",
    description: "Un hôtel boutique élégant au bord de la Garonne, avec une ambiance chaleureuse.",
    price: 189,
    rating: 4.6,
    image: "/placeholder.svg?height=200&width=300",
    amenities: ["Wifi", "Restaurant gastronomique", "Bar à vin", "Terrasse", "Vélos"],
    available: true,
  },
  {
    id: 6,
    name: "Historic Center Inn",
    location: "Strasbourg, France",
    description: "Logez dans un bâtiment historique au cœur de Strasbourg, à deux pas de la cathédrale.",
    price: 169,
    rating: 4.4,
    image: "/placeholder.svg?height=200&width=300",
    amenities: ["Wifi", "Petit-déjeuner", "Bar", "Jardin", "Parking"],
    available: true,
  },
]

export default function HotelsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState("all")
  const [dateRange, setDateRange] = useState("")
  const [guests, setGuests] = useState("")

  // Filtrer les hôtels en fonction des critères
  const filteredHotels = hotels.filter((hotel) => {
    // Filtre de recherche
    const matchesSearch =
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.description.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtre de prix
    const matchesPrice =
      priceRange === "all" ||
      (priceRange === "budget" && hotel.price < 150) ||
      (priceRange === "mid" && hotel.price >= 150 && hotel.price < 200) ||
      (priceRange === "luxury" && hotel.price >= 200)

    return matchesSearch && matchesPrice
  })

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Trouvez l'hôtel parfait pour votre séjour</h1>

      {/* Barre de recherche et filtres */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un hôtel ou une destination"
              className="w-full pl-10 pr-3 py-2 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Dates de séjour"
              className="w-full pl-10 pr-3 py-2 border rounded-md"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            />
          </div>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Nombre de voyageurs"
              className="w-full pl-10 pr-3 py-2 border rounded-md"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            />
          </div>
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="all">Tous les prix</option>
            <option value="budget">Économique (moins de 150€)</option>
            <option value="mid">Milieu de gamme (150€-200€)</option>
            <option value="luxury">Luxe (plus de 200€)</option>
          </select>
        </div>
      </div>

      {/* Liste des hôtels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.length > 0 ? (
          filteredHotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48">
                <img src={hotel.image || "/placeholder.svg"} alt={hotel.name} className="w-full h-full object-cover" />
                {!hotel.available && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-bold text-lg py-1.5 px-3 bg-red-500 rounded-md">Complet</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold">{hotel.name}</h2>
                  <div className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    <Star className="h-4 w-4 fill-blue-800 mr-1" />
                    {hotel.rating}
                  </div>
                </div>
                <div className="flex items-center text-gray-500 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  {hotel.location}
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{hotel.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {hotel.amenities.slice(0, 3).map((amenity, index) => (
                    <span key={index} className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {amenity}
                    </span>
                  ))}
                  {hotel.amenities.length > 3 && (
                    <span className="bg-gray-100 px-2 py-1 rounded text-sm">+{hotel.amenities.length - 3}</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold">{hotel.price}€</span>
                    <span className="text-gray-500 text-sm"> / nuit</span>
                  </div>
                  <Link href={`/hotels/${hotel.id}`}>
                    <button
                      disabled={!hotel.available}
                      className={`px-4 py-2 rounded-md text-sm transition-colors ${
                        hotel.available
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {hotel.available ? "Voir détails" : "Indisponible"}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <h3 className="text-xl font-medium text-gray-500">
              Aucun hôtel ne correspond à vos critères de recherche.
            </h3>
            <p className="mt-2 text-gray-400">Essayez de modifier vos filtres.</p>
          </div>
        )}
      </div>
    </div>
  )
}

