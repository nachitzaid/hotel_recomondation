"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, MapPin } from "lucide-react"
import axios from "axios"

// Types
interface Hotel {
  id: number
  HotelName: string
  cityName: string
  countyName: string
  Address: string
  Description: string
  image: string
}

export default function HotelsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([])

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/hotels") // Remplacez par l'URL de votre API
        const data = response.data

        // Formater les données pour n'inclure que les informations nécessaires
        const formattedHotels = data.map((hotel: any) => ({
          id: hotel["_id"],
          HotelName: hotel["HotelName"],
          cityName: hotel["cityName"],
          countyName: hotel["countyName"],
          Address: hotel["Address"],
          Description: hotel["Description"],
          image: "https://tse2.mm.bing.net/th?id=OIP.2e5EJ8mavTlIwZSQ3TQaUAHaEK&pid=Api&P=0&h=180", // Image par défaut
        }))

        setHotels(formattedHotels)
        setFilteredHotels(formattedHotels) // Par défaut, afficher tous les hôtels
      } catch (error) {
        console.error("Error fetching hotels:", error)
      }
    }

    fetchHotels()
  }, [])

  // Fonction pour filtrer les hôtels
  const handleSearch = () => {
    const result = hotels.filter(hotel => {
      return (
        hotel.HotelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.cityName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
    setFilteredHotels(result)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Trouvez l'hôtel parfait pour votre séjour</h1>

      {/* Barre de recherche */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 flex items-center">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un hôtel ou une destination"
            className="w-full pl-10 pr-3 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={handleSearch}
          className="ml-4 px-4 py-2 rounded-md text-sm bg-blue-600 hover:bg-blue-700 text-white"
        >
          Rechercher
        </button>
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
                <img src={hotel.image} alt={hotel.HotelName} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold">{hotel.HotelName}</h2>
                </div>
                <div className="flex items-center text-gray-500 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  {hotel.cityName}, {hotel.countyName}
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{hotel.Description}</p>
                <div className="flex justify-between items-center">
                  <Link href={`/hotels/${hotel["id"]}`}>
                    <button className="px-4 py-2 rounded-md text-sm bg-blue-600 hover:bg-blue-700 text-white">
                      Voir détails
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